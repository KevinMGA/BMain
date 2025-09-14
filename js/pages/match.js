import * as THREE from 'three';
import { MiniThree } from '../core/three-setup.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { findFirstSkinnedMesh, getBoneMap, getWorldPositionOfBone } from '../core/skeleton-utils.js';
import { normalizeCharacter } from '../core/model-utils.js';
import { PoseDB, AnimDB } from '../core/pose-db.js';
import { loadRapier } from '../core/physics-loader.js';

export async function mountMatch(root){
  const el = document.createElement('div');
  el.className = 'grid';
  el.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <div class="row">
        <h2 style="margin-right:1rem">Match vs AI</h2>
        <span class="muted">Controls:</span>
        <span class="badge">A/D</span><span class="muted">left/right</span>
        <span class="badge">W/S</span><span class="muted">in/out</span>
        <span class="badge">X</span><span class="muted">Jab</span>
        <span class="badge">C</span><span class="muted">Cross</span>
        <span class="badge">Shift</span><span class="muted">Guard (hold)</span>
        <span class="badge">Left Alt</span><span class="muted">= body target</span>
      </div>
      <label class="switch"><input type="checkbox" id="camFree"/> Free Camera</label>
    </div>
    <small class="note" id="physNote">Physics: loading...</small>
    <div class="panel">
      <div class="canvas-wrap" id="canvasWrap">
        <div class="hud">
          <div class="row"><span class="badge">P1</span><div class="health"><i id="hp1" style="width:100%"></i></div></div>
          <div class="row" style="margin-left:1rem"><span class="badge">P2</span><div class="health"><i id="hp2" style="width:100%"></i></div></div>
        </div>
      </div>
    </div>
  `;
  root.appendChild(el);

  const wrap = el.querySelector('#canvasWrap');
  const physNote = el.querySelector('#physNote');
  const {enabled:RAPIER_OK, RAPIER, world} = await loadRapier();
  physNote.textContent = RAPIER_OK ? 'Physics: Rapier enabled.' : 'Physics: disabled (anim-only).';

  const app = new MiniThree(wrap, true);
  app.controls.enableRotate = false;
  app.controls.enablePan = false;

  // Camera toggle
  el.querySelector('#camFree').addEventListener('change', e=>{
    const free = e.target.checked;
    app.controls.enableRotate = free;
    app.controls.enablePan = free;
  });

  // Ring
  const rng = new THREE.Group();
  const RING_W=8, RING_D=8, RING_H=0.5;
  rng.add(new THREE.Mesh(new THREE.BoxGeometry(RING_W, RING_H, RING_D), new THREE.MeshStandardMaterial({color:0x0f1726, roughness:.95})));
  rng.children[0].position.y = RING_H/2;
  const ropeMat = new THREE.MeshStandardMaterial({color:0x6aa1ff, metalness:.1, roughness:.4});
  function bar(x1,z1,x2,z2,y){
    const dx=x2-x1,dz=z2-z1; const len=Math.hypot(dx,dz);
    const m=new THREE.Mesh(new THREE.BoxGeometry(len, .04, .04), ropeMat);
    m.position.set((x1+x2)/2, y, (z1+z2)/2); m.rotation.y = Math.atan2(dz,dx); rng.add(m);
  }
  for(const h of [0.7, 1.0, 1.3]){
    bar(-RING_W/2+.2,-RING_D/2+.2, RING_W/2-.2,-RING_D/2+.2,h);
    bar(-RING_W/2+.2, RING_D/2-.2, RING_W/2-.2, RING_D/2-.2,h);
    bar(-RING_W/2+.2,-RING_D/2+.2,-RING_W/2+.2, RING_D/2-.2,h);
    bar( RING_W/2-.2,-RING_D/2+.2, RING_W/2-.2, RING_D/2-.2,h);
  }
  app.add(rng);

  // Fighters
  const loader = new FBXLoader();
  const players = [makeF('P1'), makeF('P2')];
  function makeF(label){ return { label, object:null, skinned:null, bones:{}, hp:100, cooldown:0, lastHit:0, base:'Relaxed' }; }

  function faceTowards(P, Q){
    if (!P.object || !Q.object) return;
    const dx = Q.object.position.x - P.object.position.x;
    const dz = Q.object.position.z - P.object.position.z;
    const yaw = Math.atan2(dx, dz) + Math.PI; // face -Z baseline
    P.object.rotation.set(0,yaw,0);
  }
  function spawn(){
    if(players[0].object) players[0].object.position.set(0, 0.55, -2.0);
    if(players[1].object) players[1].object.position.set(0, 0.55,  2.0);
    if(players[0].object&&players[1].object){ faceTowards(players[0],players[1]); faceTowards(players[1],players[0]); }
  }

  function onLoaded(i, g){
    normalizeCharacter(g, 1.75);
    g.traverse(o=>{o.castShadow=o.receiveShadow=true; o.frustumCulled=false;});
    const P = players[i]; if(P.object) app.remove(P.object);
    P.object = g; P.skinned = findFirstSkinnedMesh(g); P.bones = P.skinned?{}:{};
    if(P.skinned) for(const b of P.skinned.skeleton.bones) P.bones[b.name]=b;
    app.add(g); spawn();
  }

  loader.load('./assets/character.fbx', g=>onLoaded(0,g), undefined, err=>console.warn('P1 missing character.fbx',err));
  loader.load('./assets/character.fbx', g=>onLoaded(1,g), undefined, err=>console.warn('P2 missing character.fbx',err));

  // Controls & movement
  const keys=new Set(); addEventListener('keydown',e=>keys.add(e.code)); addEventListener('keyup',e=>keys.delete(e.code));
  const speedZ=2.0, speedX=1.6; // Z = left/right, X = in/out
  function clampToRing(obj){
    obj.position.z = THREE.MathUtils.clamp(obj.position.z, -RING_D/2+0.5, RING_D/2-0.5);
    obj.position.x = THREE.MathUtils.clamp(obj.position.x, -RING_W/2+0.5, RING_W/2-0.5);
  }

  // Simple actions (snap-style animation timing)
  function startPunch(P, which='Jab'){ P.action={kind:which, t:0}; P.cooldown=.15; }
  function blendPose(P, name){ P.base = name; }

  function updateF(P, dt, isPlayer){
    const Q = (P===players[0]?players[1]:players[0]);
    if(Q.object&&P.object) faceTowards(P,Q);
    if(!P.object) return;

    // Movement (W=forward (in), S=back (out))
    if(isPlayer){
      let vz=0,vx=0;
      if(keys.has('KeyA')||keys.has('ArrowLeft'))  vz += 1;
      if(keys.has('KeyD')||keys.has('ArrowRight')) vz -= 1;
      if(keys.has('KeyW')||keys.has('ArrowUp'))    vx -= 1; // forward = negative X toward ring center
      if(keys.has('KeyS')||keys.has('ArrowDown'))  vx += 1;
      P.object.position.z += vz*dt*speedZ;
      P.object.position.x += vx*dt*speedX;
      clampToRing(P.object);

      // Guard
      if(keys.has('ShiftLeft')||keys.has('ShiftRight')) blendPose(P,'Guard'); else blendPose(P,'Relaxed');

      if(P.cooldown<=0){
        if(keys.has('KeyX')) startPunch(P,'Jab');
        if(keys.has('KeyC')) startPunch(P,'Cross');
      }
    }else{
      // ultra-simple AI: hover at distance, jab sometimes
      if(Q.object){
        const dz = Q.object.position.z-P.object.position.z; const dirZ = Math.sign(dz);
        if(Math.abs(dz)>1.5) P.object.position.z += dirZ*dt*1.2; else P.object.position.z -= dirZ*dt*0.8;
        const dx = Q.object.position.x-P.object.position.x; const dirX = Math.sign(dx);
        if(Math.abs(dx)>1.2) P.object.position.x += dirX*dt*1.0;
        clampToRing(P.object);
        if(Math.random()<0.01 && P.cooldown<=0) startPunch(P, Math.random()<0.5?'Jab':'Cross');
      }
      blendPose(P,'Guard');
    }

    // Action timing
    P.cooldown = Math.max(0, P.cooldown-dt);
    if(P.action){
      P.action.t += dt/0.12; // quick snap
      if(P.action.t>=1){ P.action=null; }
    }
  }

  // Health & hit detection (rough spheres)
  const hp1El = el.querySelector('#hp1'); const hp2El = el.querySelector('#hp2');
  let hp1=100,hp2=100;
  function damage(which, amt){
    if(which===1){ hp1=Math.max(0,hp1-amt); hp1El.style.width=hp1+'%'; }
    else{ hp2=Math.max(0,hp2-amt); hp2El.style.width=hp2+'%'; }
  }

  function getHitSpheres(P){
    const out=[]; if(!P.object) return out;
    const head = P.bones['mixamorig1Head'], torso = P.bones['mixamorig1Spine'];
    const tmp = new THREE.Vector3();
    if(head) out.push({type:'head', pos:head.getWorldPosition(tmp.clone()), r:.18});
    if(torso) out.push({type:'torso',pos:torso.getWorldPosition(tmp.clone()), r:.25});
    return out;
  }

  function fists(P){
    const out=[]; if(!P.object) return out;
    const lh=P.bones['mixamorig1LeftHand'], rh=P.bones['mixamorig1RightHand'];
    const tmp = new THREE.Vector3();
    if(lh) out.push({pos:lh.getWorldPosition(tmp.clone()), r:.12});
    if(rh) out.push({pos:rh.getWorldPosition(tmp.clone()), r:.12});
    return out;
  }

  function checkHits(){
    const P1=players[0], P2=players[1];
    if(P1.action&&(P1.action.kind==='Jab'||P1.action.kind==='Cross')){
      for(const a of fists(P1)) for(const b of getHitSpheres(P2)){
        if(a.pos.distanceTo(b.pos) < a.r+b.r){ damage(2, b.type==='head'?8:5); P1.action=null; break; }
      }
    }
    if(P2.action&&(P2.action.kind==='Jab'||P2.action.kind==='Cross')){
      for(const a of fists(P2)) for(const b of getHitSpheres(P1)){
        if(a.pos.distanceTo(b.pos) < a.r+b.r){ damage(1, b.type==='head'?8:5); P2.action=null; break; }
      }
    }
  }

  app.onRender((dt)=>{
    updateF(players[0], dt, true);
    updateF(players[1], dt, false);
    checkHits();
  });
}
