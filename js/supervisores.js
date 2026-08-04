window.TabModules = window.TabModules || {};
window.TabModules.supervisores = {
  render: function(container) {
    const renderAll = () => {
      container.innerHTML = '';
      const data = window.AppState.data.supervisores || [];
      const instituicoes = window.AppState.data.instituicoes || [];
      const instituicaoNames = instituicoes.map(i => i.nome);

      const tableConfig = {
        data: data,
        searchPlaceholder: 'Buscar por nome, cidade, e-mail ou especialidade...',
        filters: [
          { key: 'residencia', label: 'Todas as cidades', options: [...new Set(data.map(m => m.residencia).filter(Boolean))] },
          { key: 'instituicao', label: 'Todas as instituições', options: [...new Set(data.map(m => m.instituicao).filter(Boolean))] }
        ],
        columns: [
          { key: 'nome', label: 'Nome', render: (val) => `<strong style="color: var(--color-primary); cursor: pointer; text-decoration: underline;">${val}</strong>` },
          { key: 'residencia', label: 'Residência' },
          { key: 'instituicao', label: 'Instituição' },
          { key: 'titulacao', label: 'Titulação' },
          { key: 'especialidade', label: 'Especialidade' },
          { key: 'situacao', label: 'Situação', render: (val) => {
              const bg = val === 'Ativo' ? '#2ecc71' : '#95a5a6';
              return `<span class="badge" style="background-color: ${bg}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">${val}</span>`;
          }}
        ],
        exportable: false,
        editable: true,
        countLabel: 'supervisores',
        pageSize: 15,
        onAdd: () => openModal(null, instituicaoNames),
        onEdit: (row) => openModal(row, instituicaoNames),
        onDelete: (row) => {
          if (confirm(`Deseja remover ${row.nome}?`)) {
            window.AppState.data.supervisores = window.AppState.data.supervisores.filter(m => m.id !== row.id);
            if (window.saveData) window.saveData('supervisores');
            if (window.showToast) window.showToast('Supervisor removido com sucesso!', 'success');
            renderAll();
          }
        }
      };

      if (window.createDataTable) {
        container.appendChild(window.createDataTable(tableConfig));
      }
    };

    const openModal = (row, instituicaoNames) => {
      const isEdit = !!row;
      const modalConfig = {
        title: isEdit ? 'Editar Supervisor' : 'Adicionar Supervisor',
        data: row || {},
        fields: [
          { key: 'nome', label: 'Nome', type: 'text', required: true },
          { key: 'residencia', label: 'Residência', type: 'text', required: true },
          { key: 'instituicao', label: 'Instituição', type: 'select', options: instituicaoNames },
          { key: 'titulacao', label: 'Titulação', type: 'select', options: ['Mestrado', 'Doutorado', 'Especialização', 'Residência Médica', 'Graduação'] },
          { key: 'especialidade', label: 'Especialidade', type: 'text' },
          { key: 'situacao', label: 'Situação', type: 'select', options: ['Ativo', 'Inativo'] }
        ],
        onSave: (formData) => {
          if (isEdit) {
            const index = window.AppState.data.supervisores.findIndex(m => m.id === row.id);
            if (index > -1) window.AppState.data.supervisores[index] = { ...row, ...formData };
          } else {
             window.AppState.data.supervisores.push({ id: window.generateId ? window.generateId() : Date.now().toString(), ...formData });
          }
          if (window.saveData) window.saveData('supervisores');
          if (window.showToast) window.showToast(`Supervisor ${isEdit ? 'atualizado' : 'adicionado'} com sucesso!`, 'success');
          if (window.hideModal) window.hideModal();
          renderAll();
        }
      };
      if (window.showModal) window.showModal(modalConfig);
    };

    renderAll();
  }
};
