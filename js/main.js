// Very small hash router that lazy-loads the right view file.
const app = document.getElementById('app');

const routes = {
  '#/menu': () => import('./views/menu.js'),
  '#/editor': () => import('./views/editor.js'),
  '#/match': () => import('./views/match.js'),
};

function showError(msg){
  app.innerHTML = `<div class="error"><h3>Load error</h3><pre>${msg}</pre></div>`;
}

async function render(){
  const hash = location.hash || '#/menu';
  const loader = routes[hash] || routes['#/menu'];
  try{
    const mod = await loader();
    const mount = mod.mount || mod.default;
    app.innerHTML = '';
    await mount(app);
  }catch(err){
    console.error(err);
    showError(err?.message || String(err));
  }
}

window.addEventListener('hashchange', render);
render();
