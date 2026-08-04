window.TabModules = window.TabModules || {};
window.TabModules.qualidade = {
  render: function(container) {
    container.innerHTML = `
      <div class="placeholder-content" style="display:flex; flex-direction:column; alignItems:center; justify-content:center; text-align:center; padding: 60px 20px; background:#fff; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <div style="width:80px; height:80px; border-radius:50%; background:#f0f0f0; color:#aaa; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">
          <span class="material-icons" style="font-size:40px;">analytics</span>
        </div>
        <h2 style="margin:0 0 8px 0; color:#333;">Qualidade de Dados</h2>
        <p style="margin:0; color:#666;">Seção de qualidade de dados em desenvolvimento.</p>
      </div>
    `;
  }
};
