import * as THREE from 'three';
import { FBXLoader } from '/boxing/lib/three/examples/jsm/loaders/FBXLoader.js';
import { makeThree } from '../core/three-setup.js';

export function mount(root){
  const panel = document.createElement('div');
  const canvas = document.createElement('div');
  panel.appendChild(canvas);
  root.appendChild(panel);

  const app = makeThree(canvas);

  // Simple sanity cube so you see something even if FBX missing.
  const cube = new app.THREE.Mesh(
    new app.THREE.BoxGeometry(1,1,1),
    new app.THREE.MeshStandardMaterial({color:0x4aa3ff})
  );
  cube.position.y = 1;
  app.scene.add(cube);

  // Try to load your local character if present.
  const tryPath = '/boxing/assets/character.fbx';
  const loader = new FBXLoader();
  loader.load(tryPath, (g)=>{
    g.traverse(o=>{ o.castShadow = true; });
    g.position.set(0,0,0);
    app.scene.add(g);
    console.log('[FBX] loaded', g);
  }, undefined, (e)=>{
    console.warn('[FBX] Could not load /boxing/assets/character.fbx (this is ok for now).');
  });
}
