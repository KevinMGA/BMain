import * as THREE from 'three';
import { OrbitControls } from '../../lib/three/examples/jsm/controls/OrbitControls.js';

export function makeThree(canvasParent){
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1017);
  const camera = new THREE.PerspectiveCamera(50, 16/9, 0.1, 100);
  camera.position.set(3, 2, 6);

  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(canvasParent.clientWidth, 480);
  canvasParent.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0,1,0);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 0.8);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 1.0);
  dir.position.set(3,5,2);
  scene.add(dir);

  const grid = new THREE.GridHelper(20, 20, 0x22324c, 0x22324c);
  scene.add(grid);

  let raf;
  function tick(){
    raf = requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
  }
  tick();

  return { THREE, scene, camera, renderer, controls, dispose(){
    cancelAnimationFrame(raf);
    renderer.dispose();
    renderer.domElement.remove();
  }};
}
