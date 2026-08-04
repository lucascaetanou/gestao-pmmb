// ==================== AUTH MODULE ====================
// Sistema de autenticaÃ§Ã£o para o GestÃ£o PMMB
// Suporta criptografia SHA-256, alteraÃ§Ã£o de senha no 1Âº acesso e sincronizaÃ§Ã£o direta com o GitHub.

window.Auth = (function() {

  const GITHUB_TOKEN = atob("Z2hwXzJlakdySXV0M3k5OGlPOER1Z2pVYlJkR1ZrWWFJQTBVRExaZg==");
  const GITHUB_REPO = "lucascaetanou/gestao-pmmb";
  const USERS_FILE_PATH = "data/users.json";

  // Gera hash SHA-256 de uma string
  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Carrega lista de usuÃ¡rios mesclando servidor e localStorage
  async function loadUsers() {
    let serverUsers = [];
    try {
      const resp = await fetch('data/users.json?v=' + Date.now());
      if (resp.ok) {
        serverUsers = await resp.json();
      }
    } catch(e) {
      console.error('Erro ao buscar users.json:', e);
    }

    const localUsers = JSON.parse(localStorage.getItem('pmmb_users') || '[]');

    // Mesclar: localUsers tem precedÃªncia para senhas alteradas localmente
    const userMap = new Map();
    serverUsers.forEach(u => userMap.set(u.email.toLowerCase(), u));
    localUsers.forEach(u => {
      const key = u.email.toLowerCase();
      // Se a senha foi alterada localmente (mustChangePassword === false), mantÃ©m a versÃ£o local
      if (!userMap.has(key) || u.mustChangePassword === false) {
        userMap.set(key, u);
      }
    });

    const merged = Array.from(userMap.values());
    localStorage.setItem('pmmb_users', JSON.stringify(merged));
    return merged;
  }

  function saveUsersLocal(users) {
    localStorage.setItem('pmmb_users', JSON.stringify(users));
  }

  // Atualiza data/users.json no GitHub via API
  async function pushUsersToGitHub(users) {
    try {
      const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${USERS_FILE_PATH}`;
      const headers = {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json"
      };

      let sha = null;
      try {
        const getResp = await fetch(url, { headers });
        if (getResp.ok) {
          const getData = await getResp.json();
          sha = getData.sha;
        }
      } catch(e) {}

      const jsonStr = JSON.stringify(users, null, 2);
      const bytes = new TextEncoder().encode(jsonStr);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Content = btoa(binary);

      const body = {
        message: "Atualiza usuÃ¡rios / alteraÃ§Ã£o de senha",
        content: base64Content,
        sha: sha
      };

      const putResp = await fetch(url, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (putResp.ok) {
        console.log("users.json sincronizado com o GitHub!");
        return true;
      }
    } catch(e) {
      console.error("Erro ao sincronizar users.json no GitHub:", e);
    }
    return false;
  }

  // Autenticar login
  async function login(email, password) {
    const users = await loadUsers();
    const hash = await sha256(password);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hash);
    if (user) {
      sessionStorage.setItem('pmmb_session', JSON.stringify({
        email: user.email,
        name: user.name,
        mustChangePassword: user.mustChangePassword,
        loggedAt: new Date().toISOString()
      }));
      return { success: true, mustChangePassword: user.mustChangePassword, user: user };
    }
    return { success: false };
  }

  // Alterar senha (usado no primeiro acesso)
  async function changePassword(email, newPassword) {
    const users = await loadUsers();
    const hash = await sha256(newPassword);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.passwordHash = hash;
      user.mustChangePassword = false;
      saveUsersLocal(users);

      // Atualiza sessÃ£o ativa
      const session = getCurrentUser();
      if (session) {
        session.mustChangePassword = false;
        sessionStorage.setItem('pmmb_session', JSON.stringify(session));
      }

      // Envia para o GitHub para ficar permanente para todos
      await pushUsersToGitHub(users);
      return true;
    }
    return false;
  }

  // Cadastrar/Conceder novo usuÃ¡rio (solicitaÃ§Ã£o de acesso)
  async function addUser(email, initialPassword, name) {
    const users = await loadUsers();
    const hash = await sha256(initialPassword);
    const emailKey = email.trim().toLowerCase();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === emailKey);

    const newUserObj = {
      email: email.trim(),
      passwordHash: hash,
      name: name ? name.trim() : email.split('@')[0],
      mustChangePassword: true // Primeira senha sempre precisarÃ¡ ser alterada no 1Âº acesso
    };

    if (existingIndex >= 0) {
      users[existingIndex] = newUserObj;
    } else {
      users.push(newUserObj);
    }

    saveUsersLocal(users);
    await pushUsersToGitHub(users);
    return true;
  }

  function isLoggedIn() {
    const session = sessionStorage.getItem('pmmb_session');
    if (!session) return false;
    const parsed = JSON.parse(session);
    // Se ainda precisa trocar a senha, forÃ§a voltar pra tela de troca
    return !parsed.mustChangePassword;
  }

  function getCurrentUser() {
    const session = sessionStorage.getItem('pmmb_session');
    return session ? JSON.parse(session) : null;
  }

  function logout() {
    sessionStorage.removeItem('pmmb_session');
    location.reload();
  }

  return { sha256, loadUsers, login, changePassword, addUser, isLoggedIn, getCurrentUser, logout };
})();

// ==================== LOGIN UI ====================

function renderLoginScreen() {
  const app = document.getElementById('app');
  if (app) app.style.display = 'none';

  const existing = document.getElementById('login-screen');
  if (existing) existing.remove();

  const screen = document.createElement('div');
  screen.id = 'login-screen';
  screen.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <span class="material-symbols-outlined">dashboard</span>
          </div>
          <h1>GestÃ£o PMMB</h1>
          <p>Programa Mais MÃ©dicos para o Brasil</p>
        </div>
        <form id="login-form" class="login-form">
          <div class="login-field">
            <span class="material-symbols-outlined">mail</span>
            <input type="email" id="login-email" placeholder="E-mail institucional" required autocomplete="email" />
          </div>
          <div class="login-field">
            <span class="material-symbols-outlined">lock</span>
            <input type="password" id="login-password" placeholder="Senha" required autocomplete="current-password" />
          </div>
          <div id="login-error" class="login-error" style="display:none;"></div>
          <button type="submit" class="login-btn" id="login-btn">
            <span>Entrar</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>
        <div class="login-footer">
          <span>Secretaria de AtenÃ§Ã£o PrimÃ¡ria Ã  SaÃºde</span>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(screen);

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');

    btn.disabled = true;
    btn.querySelector('span:first-child').textContent = 'Verificando...';
    errorEl.style.display = 'none';

    const result = await window.Auth.login(email, password);

    if (result.success) {
      if (result.mustChangePassword) {
        renderChangePasswordScreen(email);
      } else {
        screen.remove();
        if (app) app.style.display = '';
        if (typeof initApp === 'function') initApp();
      }
    } else {
      errorEl.textContent = 'E-mail ou senha incorretos.';
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.querySelector('span:first-child').textContent = 'Entrar';
    }
  });
}

function renderChangePasswordScreen(email) {
  const existing = document.getElementById('login-screen');
  if (existing) existing.remove();

  const screen = document.createElement('div');
  screen.id = 'login-screen';
  screen.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo" style="background: linear-gradient(135deg, #f39c12, #e67e22);">
            <span class="material-symbols-outlined">key</span>
          </div>
          <h1>Primeiro Acesso - Alterar Senha</h1>
          <p>VocÃª estÃ¡ acessando com uma senha temporÃ¡ria (${email}). Defina a sua nova senha pessoal.</p>
        </div>
        <form id="change-pw-form" class="login-form">
          <div class="login-field">
            <span class="material-symbols-outlined">lock</span>
            <input type="password" id="new-password" placeholder="Nova senha (mÃ­n. 6 caracteres)" required minlength="6" />
          </div>
          <div class="login-field">
            <span class="material-symbols-outlined">lock</span>
            <input type="password" id="confirm-password" placeholder="Confirmar nova senha" required minlength="6" />
          </div>
          <div id="change-pw-error" class="login-error" style="display:none;"></div>
          <button type="submit" class="login-btn" id="change-pw-btn" style="background: linear-gradient(135deg, #f39c12, #e67e22);">
            <span>Salvar Nova Senha</span>
            <span class="material-symbols-outlined">check</span>
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(screen);

  document.getElementById('change-pw-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPw = document.getElementById('new-password').value;
    const confirmPw = document.getElementById('confirm-password').value;
    const errorEl = document.getElementById('change-pw-error');
    const btn = document.getElementById('change-pw-btn');

    if (newPw.length < 6) {
      errorEl.textContent = 'A senha deve ter pelo menos 6 caracteres.';
      errorEl.style.display = 'block';
      return;
    }

    if (newPw !== confirmPw) {
      errorEl.textContent = 'As senhas nÃ£o coincidem.';
      errorEl.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.querySelector('span:first-child').textContent = 'Salvando e sincronizando...';

    const ok = await window.Auth.changePassword(email, newPw);
    if (ok) {
      screen.remove();
      const app = document.getElementById('app');
      if (app) app.style.display = '';
      if (typeof initApp === 'function') initApp();
    } else {
      errorEl.textContent = 'Erro ao alterar senha. Tente novamente.';
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.querySelector('span:first-child').textContent = 'Salvar Nova Senha';
    }
  });
}

// Modal para conceder/cadastrar novo usuÃ¡rio (acessÃ­vel pelo botÃ£o de configuraÃ§Ãµes ou menu)
function openAddUserModal() {
  if (typeof showModal === 'function') {
    showModal({
      title: 'Conceder Novo Acesso (Cadastrar UsuÃ¡rio)',
      fields: [
        { key: 'name', label: 'Nome Completo', type: 'text', required: true },
        { key: 'email', label: 'E-mail Institucional', type: 'email', required: true },
        { key: 'password', label: 'Senha ProvisÃ³ria (1Âº Acesso)', type: 'text', required: true }
      ],
      onSave: async (data) => {
        if (window.showToast) window.showToast('Cadastrando e sincronizando usuÃ¡rio no GitHub...', 'info');
        const success = await window.Auth.addUser(data.email, data.password, data.name);
        if (success) {
          if (window.showToast) window.showToast(`Acesso concedido com sucesso para ${data.email}!`, 'success');
        } else {
          if (window.showToast) window.showToast('Erro ao salvar no GitHub. Tente novamente.', 'error');
        }
      }
    });
  }
}
