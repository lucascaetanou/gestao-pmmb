window.AppState = {
  currentTab: 'painel',
  currentPage: 'visao-geral',
  data: {}
};

// Limpa dados antigos do localStorage (exceto users e senhas alteradas)
['medicos', 'supervisores', 'secretarios', 'referencias', 'instituicoes', 'processos', 'tutores'].forEach(k => localStorage.removeItem('pmmb_' + k));

async function loadData() {
  const files = ['medicos', 'supervisores', 'secretarios', 'referencias', 'instituicoes', 'processos', 'tutores'];
  for (const file of files) {
    try {
      const resp = await fetch('data/' + file + '.json?v=' + Date.now());
      if (resp.ok) {
         window.AppState.data[file] = await resp.json();
      } else {
         window.AppState.data[file] = [];
      }
    } catch(e) {
      console.error("Erro ao carregar " + file, e);
      window.AppState.data[file] = [];
    }
  }
}

function saveData(key) {
  localStorage.setItem('pmmb_' + key, JSON.stringify(window.AppState.data[key]));
}

function navigateToTab(tabName) {
  document.querySelectorAll('.sub-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
  const target = document.getElementById('tab-' + tabName);
  if (target) {
    target.classList.add('active');
    if (!target.dataset.rendered && window.TabModules && window.TabModules[tabName]) {
      window.TabModules[tabName].render(target);
      target.dataset.rendered = 'true';
    }
  }
  window.AppState.currentTab = tabName;
}

function navigateToPage(pageName) {
  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.style.display = pageName === 'visao-geral' ? '' : 'none';
  
  const relatorios = document.getElementById('relatorios-page');
  if (relatorios) relatorios.style.display = pageName === 'relatorios' ? '' : 'none';
  
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === pageName));
  
  window.AppState.currentPage = pageName;
  
  if (pageName === 'relatorios') {
    const container = document.getElementById('tab-relatorios');
    if (container && !container.dataset.rendered && window.TabModules && window.TabModules.relatorios) {
      window.TabModules.relatorios.render(container);
      container.dataset.rendered = 'true';
    }
  }
}

async function initApp() {
  await loadData();
  
  // Atualiza avatar com iniciais do usuÃ¡rio logado
  const user = window.Auth.getCurrentUser();
  if (user && user.name) {
    const avatar = document.querySelector('.avatar');
    if (avatar) {
      const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      avatar.textContent = initials;
      avatar.title = user.name + ' (' + user.email + ')';
      avatar.style.cursor = 'pointer';
      avatar.addEventListener('click', () => {
        if (confirm('Deseja sair da sua conta?')) {
          window.Auth.logout();
        }
      });
    }
  }
  
  // Sub-nav tab clicks
  document.querySelectorAll('.sub-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToTab(item.dataset.tab);
    });
  });
  
  // Main nav page clicks
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToPage(link.dataset.page);
    });
  });
  
  // ConfiguraÃ§Ãµes -> Cadastrar Novo UsuÃ¡rio
  const btnSettings = document.getElementById('btn-settings');
  if (btnSettings) {
    btnSettings.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof openAddUserModal === 'function') {
        openAddUserModal();
      }
    });
  }

  // Modal close
  const modalClose = document.getElementById('modal-close');
  if (modalClose) modalClose.addEventListener('click', hideModal);
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) hideModal();
    });
  }
  
  // Render default tab
  navigateToTab('painel');
}

// ==================== BOOT ====================
// Verifica autenticaÃ§Ã£o antes de iniciar o app
document.addEventListener('DOMContentLoaded', () => {
  if (window.Auth && window.Auth.isLoggedIn()) {
    initApp();
  } else {
    renderLoginScreen();
  }
});
