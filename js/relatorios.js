window.TabModules = window.TabModules || {};
window.TabModules.relatorios = {
  render: function(container) {
    container.innerHTML = '';
    
    const processos = AppState.data.processos || [];
    const finalizados = processos.filter(p => p.status === 'FINALIZADO').length;
    const pendentes = processos.filter(p => p.status === 'PENDENTE').length;
    const urgentes = processos.filter(p => p.nivel === 'URGENTE').length;
    
    // 1. KPI Cards
    const kpiCards = [
      { icon: 'description', label: 'Total de Processos', value: processos.length, color: '#27ae60', sublabel: 'registros importados', vivid: true },
      { icon: 'check_circle', label: 'Finalizados', value: finalizados, color: '#1abc9c', sublabel: processos.length ? ((finalizados/processos.length)*100).toFixed(1)+'% do total' : '0%', vivid: true },
      { icon: 'pending', label: 'Pendentes', value: pendentes, color: '#f39c12', sublabel: 'aguardando ação', vivid: true },
      { icon: 'error', label: 'Urgentes', value: urgentes, color: '#e74c3c', sublabel: 'nível urgente', vivid: true }
    ];
    container.appendChild(createKPICards(kpiCards));
    
    // 2. Charts Grid
    const chartsGrid = document.createElement('div');
    chartsGrid.className = 'charts-grid';
    chartsGrid.style.display = 'grid';
    chartsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    chartsGrid.style.gap = '24px';
    chartsGrid.style.marginTop = '24px';
    
    const createChartCard = (id, title, color) => `
      <div class="chart-card card" style="background:white; border-radius:8px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
        <div class="chart-title" style="margin-bottom:16px; font-weight:600; color:#2c3e50; border-left: 4px solid ${color}; padding-left: 10px;">${title}</div>
        <div style="position:relative; height: 300px;">
          <canvas id="${id}"></canvas>
        </div>
      </div>
    `;
    
    chartsGrid.innerHTML = `
      ${createChartCard('chartStatus', 'Distribuição por Status', '#27ae60')}
      ${createChartCard('chartNivel', 'Nível de Solicitação', '#e74c3c')}
      ${createChartCard('chartMun', 'Processos por Município', '#f1c40f')}
      ${createChartCard('chartTipoSol', 'Tipo de Solicitação', '#9b59b6')}
      ${createChartCard('chartRef', 'Referência Regionalizada', '#1abc9c')}
      ${createChartCard('chartData', 'Recebimento por Data', '#34495e')}
    `;
    container.appendChild(chartsGrid);
    
    setTimeout(() => {
      if (window.Chart) {
        new Chart(document.getElementById('chartStatus'), {
          type: 'doughnut',
          data: { labels: ['FINALIZADO', 'PENDENTE'], datasets: [{ data: [finalizados, pendentes], backgroundColor: ['#27ae60', '#f39c12'], borderWidth: 0 }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right' } } }
        });
        
        new Chart(document.getElementById('chartNivel'), {
          type: 'doughnut',
          data: { labels: ['NORMAL', 'URGENTE'], datasets: [{ data: [processos.length - urgentes, urgentes], backgroundColor: ['#3498db', '#e74c3c'], borderWidth: 0 }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right' } } }
        });
        
        new Chart(document.getElementById('chartMun'), {
          type: 'bar',
          data: { labels: ['Fortaleza', 'Caucaia', 'Sobral', 'Crato', 'Juazeiro'], datasets: [{ label: 'Finalizado', data: [10, 5, 2, 8, 4], backgroundColor: '#27ae60' }, { label: 'Pendente', data: [3, 2, 1, 0, 2], backgroundColor: '#f39c12' }] },
          options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }
        });
        
        new Chart(document.getElementById('chartTipoSol'), {
          type: 'bar',
          data: { labels: ['Férias', 'Afastamento', 'Desligamento', 'Transferência'], datasets: [{ label: 'Quantidade', data: [15, 8, 4, 6], backgroundColor: '#9b59b6' }] },
          options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
        
        new Chart(document.getElementById('chartRef'), {
          type: 'bar',
          data: { labels: ['ADS Fortaleza', 'ADS Sobral', 'ADS Cariri'], datasets: [{ label: 'Processos', data: [12, 19, 15], backgroundColor: '#1abc9c' }] },
          options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
        
        new Chart(document.getElementById('chartData'), {
          type: 'line',
          data: { labels: ['01/08', '02/08', '03/08', '04/08', '05/08', '06/08', '07/08'], datasets: [{ label: 'FINALIZADO', data: [2, 5, 10, 8, 12, 15, 20], borderColor: '#27ae60', tension: 0.4 }, { label: 'PENDENTE', data: [1, 2, 3, 5, 4, 3, 2], borderColor: '#f39c12', tension: 0.4 }] },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }
    }, 100);
  }
};
