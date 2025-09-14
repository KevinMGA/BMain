export function mount(root){
  const el = document.createElement('div');
  el.innerHTML = `<h2>Menu</h2><p>Go to <a href="#/match">Match</a> or <a href="#/editor">Editor</a>.</p>`;
  root.appendChild(el);
}