const AppState = {
  currentTab: 'painel',
  currentPage: 'visao-geral',
  data: {}
};

async function loadData() {
  const files = ['medicos', 'supervisores', 'secretarios', 'referencias', 'instituicoes', 'processos', 'tutores'];
  for (const file of files) {
    try {
      // Adicionado um timestamp (v=Date.now()) para evitar que o navegador guarde em cache
      const resp = await fetch('data/' + file + '.json?v=' + Date.now());
      if (resp.ok) {
         AppState.data[file] = await resp.json();
      } else {
         AppState.data[file] = [];
      }
    } catch(e) {
      console.error("Erro ao carregar " + file, e);
      AppState.data[file] = [];
    }
  }
}

function saveData(key) {
  localStorage.setItem('pmmb_' + key, JSON.stringify(AppState.data[key]));
}

function navigateToTab(tabName) {
  // Update sub-nav active state
  document.querySelectorAll('.sub-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabName);
  });
  // Hide all tab-content, show the target
  document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
  const target = document.getElementById('tab-' + tabName);
  if (target) {
    target.classList.add('active');
    // Render if not yet rendered
    if (!target.dataset.rendered && window.TabModules && window.TabModules[tabName]) {
      window.TabModules[tabName].render(target);
      target.dataset.rendered = 'true';
    }
  }
  AppState.currentTab = tabName;
}

function navigateToPage(pageName) {
  // Show/hide main-content vs relatorios-page
  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.style.display = pageName === 'visao-geral' ? '' : 'none';
  
  const relatorios = document.getElementById('relatorios-page');
  if (relatorios) relatorios.style.display = pageName === 'relatorios' ? '' : 'none';
  
  // Update navbar active state
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === pageName));
  
  AppState.currentPage = pageName;
  
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

document.addEventListener('DOMContentLoaded', initApp);
