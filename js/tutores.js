window.TabModules = window.TabModules || {};
window.TabModules.tutores = {
  render: function(container) {
    container.innerHTML = `
      <div class="placeholder-content" style="display:flex; flex-direction:column; alignItems:center; justify-content:center; text-align:center; padding: 60px 20px; background:#fff; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <div style="width:80px; height:80px; border-radius:50%; background:#f0f0f0; color:#aaa; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">
          <span class="material-icons" style="font-size:40px;">school</span>
        </div>
        <h2 style="margin:0 0 8px 0; color:#333;">Tutores</h2>
        <p style="margin:0 0 24px 0; color:#666;">Nenhum tutor cadastrado no momento.</p>
        <button style="background-color:var(--color-primary, #3498db); color:white; border:none; padding:10px 20px; border-radius:4px; cursor:pointer; font-weight:500; display:flex; align-items:center; gap:8px; margin:0 auto;">
          <span class="material-icons" style="font-size:18px;">add</span> Adicionar Tutor
        </button>
      </div>
    `;
  }
};
