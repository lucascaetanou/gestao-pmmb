window.TabModules = window.TabModules || {};
window.TabModules.referencias = {
  render: function(container) {
    container.innerHTML = '';
    
    // 1. Search bar
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `<input type="text" id="ref-search" placeholder="Pesquisar referência..." class="table-search" style="width: 100%; max-width: 400px; margin-bottom: 24px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">`;
    container.appendChild(searchContainer);
    
    // 2. Grid of expandable cards
    const grid = document.createElement('div');
    grid.className = 'cards-grid';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
    grid.style.gap = '20px';
    container.appendChild(grid);
    
    const referencias = AppState.data.referencias || [];
    
    function renderCards(filterTerm = '') {
      grid.innerHTML = '';
      const filtered = referencias.filter(r => r.nome && r.nome.toLowerCase().includes(filterTerm.toLowerCase()));
      
      filtered.forEach(r => {
        const badges = [];
        if (r.desocupadas > 0) badges.push({ text: `${r.desocupadas} desocupadas`, color: '#e74c3c' });
        
        const card = createExpandableCard({
          icon: 'corporate_fare',
          title: r.nome,
          subtitle: 'Regiões: ' + (r.regioes || '-'),
          stats: [
            { icon: '📍', text: `${r.municipios || 0} municípios` },
            { icon: '💼', text: `${r.vagas || 0} vagas` },
            { icon: '👤', text: `${r.medicos_ativos || 0} médicos ativos` }
          ],
          badges: badges,
          color: '#8e44ad'
        });
        
        // Add styling for stats
        const statsEl = card.querySelector('.card-stats');
        if (statsEl) {
          statsEl.style.display = 'flex';
          statsEl.style.flexWrap = 'wrap';
          statsEl.style.gap = '12px';
          statsEl.style.marginTop = '12px';
          statsEl.style.fontSize = '14px';
          statsEl.style.color = '#7f8c8d';
        }
        
        // Badge styling
        const badgesEl = card.querySelectorAll('.badge');
        badgesEl.forEach(b => {
          b.style.padding = '4px 8px';
          b.style.borderRadius = '12px';
          b.style.color = 'white';
          b.style.fontSize = '12px';
          b.style.fontWeight = 'bold';
        });
        
        grid.appendChild(card);
      });
    }
    
    renderCards();
    
    const searchInput = searchContainer.querySelector('#ref-search');
    searchInput.addEventListener('input', debounce((e) => {
      renderCards(e.target.value);
    }, 300));
  }
};
