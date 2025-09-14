import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { MiniThree } from '../core/three-setup.js';
import { AnimDB, PoseDB } from '../core/pose-db.js';

export function mountEditor(root){
  const el = document.createElement('div');
  el.className='grid';
  el.innerHTML = `
    <div class="panel">
      <h2>Pose/Anim Editor</h2>
      <p class="muted">Bind your FBX animation clips to actions. Files are not uploaded; we only store their local URL in your browser.</p>
      <div class="row">
        <label>Action
          <select id="action">
            <option>Idle</option>
            <option>StepForward</option>
            <option>StepBack</option>
            <option>StepLeft</option>
            <option>StepRight</option>
            <option>Jab</option>
            <option>Cross</option>
          </select>
        </label>
        <input id="url" placeholder="./anims/Idle.fbx" size="40"/>
        <button id="bind">Bind</button>
        <button id="export">Export JSON</button>
      </div>
      <small class="note">Example paths: <code>./anims/Idle.fbx</code>, <code>./anims/Short Step Forward.fbx</code></small>
      <pre class="muted" id="map"></pre>
    </div>
    <div class="panel">
      <div class="canvas-wrap" id="canvas"></div>
    </div>
  `;
  root.appendChild(el);

  const mapEl = el.querySelector('#map');
  const refresh = ()=> mapEl.textContent = JSON.stringify(AnimDB,null,2);
  refresh();

  el.querySelector('#bind').onclick = ()=>{
    const action = el.querySelector('#action').value;
    const url = el.querySelector('#url').value.trim();
    if(!url){ alert('Enter a URL/path to an FBX'); return; }
    AnimDB[action]=url; refresh();
    localStorage.setItem('boxing.animdb.v1', JSON.stringify(AnimDB));
  };
  el.querySelector('#export').onclick = ()=>{
    const blob = new Blob([JSON.stringify(AnimDB,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'animdb.json'; a.click();
  };

  // minimal preview character (optional, loads ./assets/character.fbx if present)
  const wrap = el.querySelector('#canvas');
  const app = new MiniThree(wrap);
  const loader = new FBXLoader();
  loader.load('./assets/character.fbx', g=>{
    g.position.y = 0; app.add(g);
  }, undefined, ()=>{
    const txt = document.createElement('div');
    txt.className='muted'; txt.style.padding='1rem';
    txt.textContent = 'Place your character at ./assets/character.fbx to preview here.';
    wrap.appendChild(txt);
  });
}
