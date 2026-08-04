window.TabModules = window.TabModules || {};
window.TabModules.instituicoes = {
  render: function(container) {
    let searchTerm = '';

    const renderAll = () => {
      container.innerHTML = '';
      
      const searchContainer = document.createElement('div');
      searchContainer.style.marginBottom = '20px';
      
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = 'Pesquisar instituição...';
      searchInput.value = searchTerm;
      searchInput.style.width = '100%';
      searchInput.style.padding = '10px';
      searchInput.style.borderRadius = '8px';
      searchInput.style.border = '1px solid #ccc';
      
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        renderCards();
      });

      searchContainer.appendChild(searchInput);
      container.appendChild(searchContainer);

      const cardsContainer = document.createElement('div');
      cardsContainer.className = 'card-grid';
      cardsContainer.style.display = 'grid';
      cardsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
      cardsContainer.style.gap = '20px';
      container.appendChild(cardsContainer);

      const colors = ['#3498db', '#e67e22', '#9b59b6', '#1abc9c'];

      const renderCards = () => {
        cardsContainer.innerHTML = '';
        const data = window.AppState.data.instituicoes || [];
        const filtered = data.filter(i => i.nome.toLowerCase().includes(searchTerm) || (i.sigla && i.sigla.toLowerCase().includes(searchTerm)));
        
        filtered.forEach((inst, index) => {
          const card = document.createElement('div');
          card.className = 'institution-card';
          const color = colors[index % colors.length];
          card.style.borderLeft = `4px solid ${color}`;
          card.style.backgroundColor = '#fff';
          card.style.borderRadius = '8px';
          card.style.padding = '16px';
          card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          card.style.display = 'flex';
          card.style.alignItems = 'center';
          card.style.justifyContent = 'space-between';

          const leftContent = document.createElement('div');
          leftContent.style.display = 'flex';
          leftContent.style.alignItems = 'center';
          leftContent.style.gap = '16px';

          const iconWrapper = document.createElement('div');
          iconWrapper.style.backgroundColor = `${color}22`;
          iconWrapper.style.color = color;
          iconWrapper.style.width = '48px';
          iconWrapper.style.height = '48px';
          iconWrapper.style.borderRadius = '50%';
          iconWrapper.style.display = 'flex';
          iconWrapper.style.alignItems = 'center';
          iconWrapper.style.justifyContent = 'center';
          iconWrapper.innerHTML = `<span class="material-icons">${index % 2 === 0 ? 'apartment' : 'school'}</span>`;

          const info = document.createElement('div');
          info.innerHTML = `
            <div style="font-weight:bold; text-transform:uppercase; margin-bottom:4px;">${inst.nome}</div>
            <div style="font-size:0.85rem; color:#666; margin-bottom:8px;">Sigla: ${inst.sigla || '-'} · UF: ${inst.uf || '-'}</div>
            <div style="font-size:0.8rem; color:#444; display:flex; gap:12px;">
              <span>👤 ${inst.num_supervisores || 0} superv.</span>
              <span>📍 ${inst.num_cidades || 0} cidades</span>
            </div>
          `;

          leftContent.appendChild(iconWrapper);
          leftContent.appendChild(info);

          const rightContent = document.createElement('div');
          rightContent.innerHTML = `<button style="background:none; border:none; cursor:pointer; color:#999;"><span class="material-icons">chevron_right</span></button>`;

          card.appendChild(leftContent);
          card.appendChild(rightContent);

          cardsContainer.appendChild(card);
        });
      };

      renderCards();
    };

    renderAll();
  }
};
