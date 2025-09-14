export async function navigateTo(hash){
  const app = document.getElementById('app');
  const route = (hash||'#/menu').replace(/^#\/?/,'').toLowerCase();
  try{
    if(route.startsWith('menu')){
      const {mountMenu} = await import('./pages/menu.js');
      app.innerHTML=''; mountMenu(app);
    }else if(route.startsWith('editor')){
      const {mountEditor} = await import('./pages/editor.js');
      app.innerHTML=''; mountEditor(app);
    }else{
      const {mountMatch} = await import('./pages/match.js');
      app.innerHTML=''; mountMatch(app);
    }
  }catch(err){
    console.error(err);
    app.innerHTML = '<div class="panel"><h3>Load error</h3><pre>'+String(err)+'</pre></div>';
  }
}
