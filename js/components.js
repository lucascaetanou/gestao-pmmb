// Reusable UI component factory functions

function createKPICards(cards) {
  const container = document.createElement('div');
  container.className = 'kpi-grid';
  
  cards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'kpi-card';
    
    if (card.vivid) {
      cardEl.classList.add('kpi-vivid');
      cardEl.style.backgroundColor = card.color;
      cardEl.style.color = '#fff';
      cardEl.innerHTML = `
        <div class="kpi-icon" style="color: #fff;"><span class="material-symbols-outlined">${card.icon}</span></div>
        <div class="kpi-content">
          <div class="kpi-label" style="color: #fff; opacity: 0.9;">${card.label}</div>
          <div class="kpi-value">${card.value}</div>
          ${card.sublabel ? `<div class="kpi-sublabel" style="color: #fff; opacity: 0.8;">${card.sublabel}</div>` : ''}
        </div>
      `;
    } else {
      cardEl.innerHTML = `
        <div class="kpi-icon" style="background-color: ${card.color}20; color: ${card.color};"><span class="material-symbols-outlined">${card.icon}</span></div>
        <div class="kpi-content">
          <div class="kpi-label">${card.label}</div>
          <div class="kpi-value">${card.value}</div>
          ${card.sublabel ? `<div class="kpi-sublabel">${card.sublabel}</div>` : ''}
        </div>
      `;
    }
    container.appendChild(cardEl);
  });
  
  return container;
}

function createDataTable(config) {
  const container = document.createElement('div');
  container.className = 'table-section';
  
  let currentPage = 1;
  const pageSize = config.pageSize || 15;
  let filteredData = [...config.data];
  
  const header = document.createElement('div');
  header.className = 'table-header';
  
  if (config.searchPlaceholder) {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = config.searchPlaceholder;
    searchInput.className = 'table-search';
    searchInput.addEventListener('input', debounce((e) => {
      const term = e.target.value.toLowerCase();
      filteredData = config.data.filter(row => {
        return config.columns.some(col => {
          const val = row[col.key];
          return val && String(val).toLowerCase().includes(term);
        });
      });
      currentPage = 1;
      renderBody();
    }, 300));
    header.appendChild(searchInput);
  }
  
  const countSpan = document.createElement('span');
  countSpan.className = 'table-count';
  header.appendChild(countSpan);
  
  container.appendChild(header);
  
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'table-wrapper';
  const table = document.createElement('table');
  
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  config.columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col.label;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  tableWrapper.appendChild(table);
  container.appendChild(tableWrapper);
  
  function renderBody() {
    tbody.innerHTML = '';
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);
    
    pageData.forEach(row => {
      const tr = document.createElement('tr');
      config.columns.forEach(col => {
        const td = document.createElement('td');
        td.innerHTML = col.render ? col.render(row[col.key], row) : row[col.key];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    
    countSpan.textContent = `${filteredData.length} de ${config.data.length} ${config.countLabel || 'registros'}`;
  }
  
  renderBody();
  return container;
}

function createFilterBar(config) {
  const container = document.createElement('div');
  container.className = 'filter-bar';
  
  if (config.searchPlaceholder) {
    const search = document.createElement('input');
    search.type = 'text';
    search.placeholder = config.searchPlaceholder;
    search.className = 'filter-search';
    search.addEventListener('input', debounce((e) => {
      if(config.onFilter) config.onFilter({ search: e.target.value });
    }, 300));
    container.appendChild(search);
  }
  
  return container;
}

function showModal(config) {
  const overlay = document.getElementById('modal-overlay');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const footer = document.getElementById('modal-footer');
  
  title.textContent = config.title;
  body.innerHTML = '';
  
  const form = document.createElement('form');
  
  config.fields.forEach(field => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';
    wrapper.innerHTML = `<label>${field.label}</label><input type="${field.type || 'text'}" name="${field.key}" ${field.required ? 'required' : ''} />`;
    form.appendChild(wrapper);
  });
  body.appendChild(form);
  
  footer.innerHTML = `
    <button class="btn btn-secondary" id="btn-modal-cancel">Cancelar</button>
    <button class="btn btn-primary" id="btn-modal-save">Salvar</button>
  `;
  
  document.getElementById('btn-modal-cancel').addEventListener('click', hideModal);
  document.getElementById('btn-modal-save').addEventListener('click', () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    if (config.onSave) config.onSave(data);
    hideModal();
  });
  
  overlay.style.display = 'flex';
}

function hideModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function createExpandableCard(config) {
  const card = document.createElement('div');
  card.className = 'expandable-card';
  card.innerHTML = `
    <div class="card-header">
      <div class="card-icon" style="background-color: ${config.color || '#3498db'}20; color: ${config.color || '#3498db'};"><span class="material-symbols-outlined">${config.icon}</span></div>
      <div class="card-titles">
        <div class="card-title">${config.title}</div>
        <div class="card-subtitle">${config.subtitle}</div>
      </div>
    </div>
    <div class="card-stats">
      ${(config.stats || []).map(s => `<div><span>${s.icon || ''}</span> ${s.text} ${s.value || ''}</div>`).join('')}
      ${(config.badges || []).map(b => `<span class="badge" style="background:${b.color}">${b.text}</span>`).join('')}
    </div>
  `;
  return card;
}
