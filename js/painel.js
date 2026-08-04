window.TabModules = window.TabModules || {};
window.TabModules.painel = {
  render: function(container) {
    container.innerHTML = '';
    
    // 1. Title area
    const titleArea = document.createElement('div');
    titleArea.className = 'page-title-area';
    titleArea.style.display = 'flex';
    titleArea.style.justifyContent = 'space-between';
    titleArea.style.alignItems = 'center';
    titleArea.style.marginBottom = '24px';
    
    const medicos = AppState.data.medicos || [];
    const numMunicipios = [...new Set(medicos.map(m=>m.municipio))].length;
    
    titleArea.innerHTML = `
      <div>
        <h2 style="margin:0; font-size: 24px; color: #2c3e50;">Médicos ativos no Ceará — Programa Mais Médicos</h2>
        <p style="margin: 4px 0 0; color: #7f8c8d;">Lista atualizada em ${formatDate(new Date().toISOString().split('T')[0])} · ${numMunicipios} municípios com profissionais ativos</p>
      </div>
      <a href="#" class="btn btn-primary" style="background-color: #3498db; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none;">Painel oficial (GOV)</a>
    `;
    container.appendChild(titleArea);
    
    // 2. KPI Cards
    const referencias = AppState.data.referencias || [];
    const secretarios = AppState.data.secretarios || [];
    
    const totalVagas = referencias.reduce((acc, r) => acc + (parseInt(r.vagas) || 0), 0);
    const totalDesocupadas = referencias.reduce((acc, r) => acc + (parseInt(r.desocupadas) || 0), 0);
    const ocupacao = totalVagas > 0 ? ((medicos.length / totalVagas) * 100).toFixed(1) : 0;
    const numMunSec = [...new Set(secretarios.map(s => s.municipio))].length;
    
    const kpiCards = [
      { icon: 'person', label: 'Médicos ativos', value: medicos.length, color: '#27ae60' },
      { icon: 'work', label: 'Total de vagas', value: totalVagas, color: '#3498db', sublabel: 'Vagas pactuadas' },
      { icon: 'trending_up', label: 'Taxa de ocupação', value: ocupacao + '%', color: '#e67e22' },
      { icon: 'warning', label: 'Vagas desocupadas', value: totalDesocupadas, color: '#f39c12' },
      { icon: 'person_add', label: 'Profissional extra', value: 1, color: '#e74c3c' },
      { icon: 'apartment', label: 'Secretarias', value: numMunSec, color: '#3498db' }
    ];
    container.appendChild(createKPICards(kpiCards));
    
    // 3. Alertas de Desocupação
    const alertSection = document.createElement('div');
    alertSection.className = 'alert-section card';
    alertSection.style.backgroundColor = 'white';
    alertSection.style.borderRadius = '8px';
    alertSection.style.padding = '20px';
    alertSection.style.marginTop = '24px';
    alertSection.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    
    alertSection.innerHTML = `
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
        <h3 style="margin:0; font-size:18px; color: #2c3e50;">⚠ Alertas de Desocupação</h3>
        <span class="badge" style="background-color: #fce4ec; color: #c2185b; padding: 4px 12px; border-radius: 12px; font-size:12px; font-weight:bold;">8 municípios com vagas alertas</span>
      </div>
      <div class="alert-list" style="display:flex; flex-direction:column; gap:12px;">
        ${['Araripe', 'Barbalha', 'Crato', 'Juazeiro do Norte', 'Missão Velha', 'Nova Olinda', 'Santana do Cariri', 'Milagres'].map(city => `
          <div class="alert-row" style="display:flex; align-items:center;">
            <div class="alert-city" style="width: 150px; font-weight:500; color:#34495e;">${city}</div>
            <div class="alert-bar" style="flex:1; background-color:#ecf0f1; height:8px; border-radius:4px; margin: 0 16px; overflow:hidden;">
              <div class="bar" style="width: ${Math.random()*60 + 20}%; background-color: #e74c3c; height:100%;"></div>
            </div>
            <div class="alert-stats" style="width: 200px; text-align:right; font-size:14px; color:#7f8c8d;">2 vagas livres · 40% ocupado</div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(alertSection);
    
    // 4. Charts Grid
    const chartsGrid = document.createElement('div');
    chartsGrid.className = 'charts-grid';
    chartsGrid.style.display = 'grid';
    chartsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    chartsGrid.style.gap = '24px';
    chartsGrid.style.marginTop = '24px';
    
    const createChartCard = (id, title) => `
      <div class="chart-card card" style="background:white; border-radius:8px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
        <div class="chart-title" style="margin-bottom:16px; font-weight:600; color:#2c3e50;">${title}</div>
        <div style="position:relative; height: 300px;">
          ${id.startsWith('table') ? `<div id="${id}"></div>` : `<canvas id="${id}"></canvas>`}
        </div>
      </div>
    `;
    
    chartsGrid.innerHTML = `
      ${createChartCard('chartRegiao', 'Médicos ativos por Região de Saúde')}
      ${createChartCard('chartTipo', 'Médicos por Tipo de Profissional')}
      ${createChartCard('chartVulnerabilidade', 'Médicos por Categoria de Vulnerabilidade')}
      ${createChartCard('tableReferencia', 'Médicos ativos por Referência Regionalizada')}
    `;
    container.appendChild(chartsGrid);
    
    // Setup Charts (assuming Chart.js is loaded)
    setTimeout(() => {
      if (window.Chart) {
        new Chart(document.getElementById('chartRegiao'), {
          type: 'bar',
          data: {
            labels: ['Fortaleza', 'Sobral', 'Cariri', 'Litoral', 'Maciço', 'Sertão Central'],
            datasets: [{ label: 'Médicos', data: [120, 80, 75, 40, 30, 20], backgroundColor: ['#3498db', '#bdc3c7', '#3498db', '#bdc3c7', '#3498db', '#bdc3c7'], borderRadius: 4 }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }
        });
        
        new Chart(document.getElementById('chartTipo'), {
          type: 'doughnut',
          data: {
            labels: ['INTERCAMBISTA MAIS MÉDICOS', 'CRM BRASIL MAIS MÉDICOS'],
            datasets: [{ data: [150, 300], backgroundColor: ['#3498db', '#1abc9c'], borderWidth: 0 }]
          },
          options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' } } }
        });
        
        new Chart(document.getElementById('chartVulnerabilidade'), {
          type: 'doughnut',
          data: {
            labels: ['Média Vulnerabilidade', 'Alta Vulnerabilidade', 'Muito Alta Vulnerabilidade', 'Sem Vulnerabilidade'],
            datasets: [{ data: [100, 80, 50, 200], backgroundColor: ['#f1c40f', '#e67e22', '#e74c3c', '#3498db'], borderWidth: 0 }]
          },
          options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right' } } }
        });
      }
      
      const tableRef = document.getElementById('tableReferencia');
      if (tableRef) {
        const refData = (AppState.data.referencias || []).slice(0, 5);
        tableRef.appendChild(createDataTable({
          columns: [
            { key: 'nome', label: 'Referência' },
            { key: 'municipios', label: 'Mun.' },
            { key: 'vagas', label: 'Vagas' },
            { key: 'medicos_ativos', label: 'Médicos' },
            { key: 'ocup', label: 'Ocup.', render: (val, row) => {
              const perc = row.vagas ? ((row.medicos_ativos / row.vagas) * 100).toFixed(0) : 0;
              return `<div style="display:flex;align-items:center;gap:8px;">
                <span>${perc}%</span>
                <div style="flex:1;height:6px;background:#ecf0f1;border-radius:3px;overflow:hidden;"><div style="height:100%;width:${perc}%;background:#27ae60;"></div></div>
              </div>`;
            } }
          ],
          data: refData,
          pageSize: 5,
          countLabel: 'referências'
        }));
      }
    }, 100);
  }
};
