export function mountMenu(root){
  const el = document.createElement('div');
  el.className = 'panel';
  el.innerHTML = `
    <h2>Sideview Boxing</h2>
    <p class="muted">Pick a mode:</p>
    <ul class="clean">
      <li>• <a href="#/match">Match vs AI</a> <span class="badge">prototype</span></li>
      <li>• <a href="#/editor">Pose/Anim Editor</a> <span class="badge">work in progress</span></li>
    </ul>
    <small class="note">Make sure <code>assets/character.fbx</code> exists. Copy <code>rapier.es.js</code> and <code>rapier_wasm3d_bg.wasm</code> to <code>lib/rapier/</code> for physics.</small>
  `;
  root.appendChild(el);
}
