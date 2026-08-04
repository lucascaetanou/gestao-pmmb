window.TabModules = window.TabModules || {};
window.TabModules.secretarios = {
  render: function(container) {
    const renderAll = () => {
      container.innerHTML = '';
      const data = window.AppState.data.secretarios || [];
      
      // KPI Cards
      const totalCount = data.length;
      const municipiosCount = new Set(data.map(m => m.municipio).filter(Boolean)).size;
      const regioesCount = new Set(data.map(m => m.regiao).filter(Boolean)).size;

      const cardsData = [
        { icon: 'badge', label: 'Secretários', value: totalCount, color: '#e67e22' },
        { icon: 'location_city', label: 'Municípios', value: municipiosCount, color: '#f39c12' },
        { icon: 'public', label: 'Regiões de Saúde', value: regioesCount, color: '#3498db' }
      ];

      if (window.createKPICards) {
        container.appendChild(window.createKPICards(cardsData));
      }

      // Data Table
      const tableConfig = {
        data: data,
        searchPlaceholder: 'Buscar por nome, município, região ou e-mail...',
        columns: [
          { key: 'nome', label: 'Nome', render: (val) => `<strong>${val}</strong>` },
          { key: 'municipio', label: 'Município' },
          { key: 'regiao', label: 'Região' },
          { key: 'telefone', label: 'Telefone', render: (val) => window.formatPhone ? window.formatPhone(val) : val },
          { key: 'email', label: 'E-mail', render: (val) => val ? `<a href="mailto:${val}">${val}</a>` : '' },
          { key: 'endereco', label: 'Endereço' }
        ],
        exportable: true,
        editable: true,
        countLabel: 'secretários',
        pageSize: 15,
        onAdd: () => openModal(null),
        onEdit: (row) => openModal(row),
        onDelete: (row) => {
          if (confirm(`Deseja remover ${row.nome}?`)) {
            window.AppState.data.secretarios = window.AppState.data.secretarios.filter(m => m.id !== row.id);
            if (window.saveData) window.saveData('secretarios');
            if (window.showToast) window.showToast('Secretário removido com sucesso!', 'success');
            renderAll();
          }
        }
      };

      if (window.createDataTable) {
        container.appendChild(window.createDataTable(tableConfig));
      }
    };

    const openModal = (row) => {
      const isEdit = !!row;
      const modalConfig = {
        title: isEdit ? 'Editar Secretário' : 'Adicionar Secretário',
        data: row || {},
        fields: [
          { key: 'nome', label: 'Nome', type: 'text', required: true },
          { key: 'municipio', label: 'Município', type: 'text', required: true },
          { key: 'regiao', label: 'Região', type: 'text' },
          { key: 'telefone', label: 'Telefone', type: 'tel' },
          { key: 'email', label: 'E-mail', type: 'email' },
          { key: 'endereco', label: 'Endereço', type: 'text' }
        ],
        onSave: (formData) => {
          if (isEdit) {
            const index = window.AppState.data.secretarios.findIndex(m => m.id === row.id);
            if (index > -1) window.AppState.data.secretarios[index] = { ...row, ...formData };
          } else {
             window.AppState.data.secretarios.push({ id: window.generateId ? window.generateId() : Date.now().toString(), ...formData });
          }
          if (window.saveData) window.saveData('secretarios');
          if (window.showToast) window.showToast(`Secretário ${isEdit ? 'atualizado' : 'adicionado'} com sucesso!`, 'success');
          if (window.hideModal) window.hideModal();
          renderAll();
        }
      };
      if (window.showModal) window.showModal(modalConfig);
    };

    renderAll();
  }
};
