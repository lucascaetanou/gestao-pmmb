window.TabModules = window.TabModules || {};
window.TabModules.medicos = {
  render: function(container) {
    const renderAll = () => {
      container.innerHTML = '';
      const data = window.AppState.data.medicos || [];
      
      // KPI Cards
      const totalCount = data.length;
      const crmCount = data.filter(m => m.tipo && m.tipo.includes('CRM')).length;
      const interCount = data.filter(m => m.tipo && m.tipo.includes('INTERCAMBISTA')).length;
      const municipiosCount = new Set(data.map(m => m.municipio).filter(Boolean)).size;
      const regionaisCount = new Set(data.map(m => m.regional).filter(Boolean)).size;

      const cardsData = [
        { icon: 'people', label: 'Médicos ativos', value: totalCount, color: '#27ae60' },
        { icon: 'verified', label: 'CRM Brasil', value: crmCount, color: '#3498db' },
        { icon: 'public', label: 'Intercambistas', value: interCount, color: '#1abc9c' },
        { icon: 'location_city', label: 'Municípios', value: municipiosCount, color: '#f39c12' },
        { icon: 'map', label: 'Regiões', value: regionaisCount, color: '#9b59b6' }
      ];

      if (window.createKPICards) {
        container.appendChild(window.createKPICards(cardsData));
      }

      // Data Table
      const tableConfig = {
        data: data,
        searchPlaceholder: 'Buscar por nome, CPF ou e-mail...',
        filters: [
          { key: 'municipio', label: 'Todos os municípios', options: [...new Set(data.map(m => m.municipio).filter(Boolean))] },
          { key: 'tipo', label: 'Todos os tipos', options: [...new Set(data.map(m => m.tipo).filter(Boolean))] },
          { key: 'vulnerabilidade', label: 'Toda vulnerabilidade', options: [...new Set(data.map(m => m.vulnerabilidade).filter(Boolean))] }
        ],
        columns: [
          { key: 'nome', label: 'Nome', render: (val) => `<strong style="cursor:pointer">${val}</strong>` },
          { key: 'cpf', label: 'CPF', render: (val) => window.formatCPF ? window.formatCPF(val) : val },
          { key: 'municipio', label: 'Município' },
          { key: 'regional', label: 'Regional' },
          { key: 'tipo', label: 'Tipo', render: (val) => `<span class="badge" style="background-color: var(--color-primary, #3498db); color: #fff; padding: 2px 6px; border-radius: 12px; font-size: 0.8rem;">${val}</span>` },
          { key: 'vulnerabilidade', label: 'Vulnerabilidade', render: (val) => {
              let bg = '#ccc';
              if (val === 'Média Vulnerabilidade') bg = '#f1c40f';
              else if (val === 'Alta Vulnerabilidade') bg = '#e67e22';
              else if (val === 'Muito Alta Vulnerabilidade') bg = '#e74c3c';
              else if (val === 'Sem Vulnerabilidade') bg = '#2ecc71';
              return `<span class="badge" style="background-color: ${bg}; color: white; padding: 2px 6px; border-radius: 12px; font-size: 0.8rem;">${val}</span>`;
          }},
          { key: 'inicio', label: 'Início', render: (val) => window.formatDate ? window.formatDate(val) : val },
          { key: 'contato', label: 'Contato', render: (val, row) => `<div>${row.contato_email || ''}</div><div style="font-size:0.8rem; color:#666">${window.formatPhone ? window.formatPhone(row.contato_telefone) : (row.contato_telefone || '')}</div>` }
        ],
        exportable: true,
        editable: true,
        countLabel: 'médicos',
        pageSize: 15,
        onAdd: () => openModal(null),
        onEdit: (row) => openModal(row),
        onDelete: (row) => {
          if (confirm(`Deseja remover ${row.nome}?`)) {
            window.AppState.data.medicos = window.AppState.data.medicos.filter(m => m.id !== row.id);
            if (window.saveData) window.saveData('medicos');
            if (window.showToast) window.showToast('Médico removido com sucesso!', 'success');
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
        title: isEdit ? 'Editar Médico' : 'Adicionar Médico',
        data: row || {},
        fields: [
          { key: 'nome', label: 'Nome', type: 'text', required: true },
          { key: 'cpf', label: 'CPF', type: 'text', required: true },
          { key: 'municipio', label: 'Município', type: 'text', required: true },
          { key: 'regional', label: 'Regional', type: 'text' },
          { key: 'tipo', label: 'Tipo', type: 'select', options: ['INTERCAMBISTA MAIS MÉDICOS', 'CRM BRASIL MAIS MÉDICOS'] },
          { key: 'vulnerabilidade', label: 'Vulnerabilidade', type: 'select', options: ['Média Vulnerabilidade', 'Alta Vulnerabilidade', 'Muito Alta Vulnerabilidade', 'Sem Vulnerabilidade'] },
          { key: 'inicio', label: 'Início', type: 'date' },
          { key: 'contato_email', label: 'E-mail', type: 'email' },
          { key: 'contato_telefone', label: 'Telefone', type: 'tel' }
        ],
        onSave: (formData) => {
          if (isEdit) {
            const index = window.AppState.data.medicos.findIndex(m => m.id === row.id);
            if (index > -1) window.AppState.data.medicos[index] = { ...row, ...formData };
          } else {
             window.AppState.data.medicos.push({ id: window.generateId ? window.generateId() : Date.now().toString(), ...formData });
          }
          if (window.saveData) window.saveData('medicos');
          if (window.showToast) window.showToast(`Médico ${isEdit ? 'atualizado' : 'adicionado'} com sucesso!`, 'success');
          if (window.hideModal) window.hideModal();
          renderAll();
        }
      };
      if (window.showModal) window.showModal(modalConfig);
    };

    renderAll();
  }
};
