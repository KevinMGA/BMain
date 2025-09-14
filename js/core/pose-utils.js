
import * as THREE from 'three'; const _q=new THREE.Quaternion();
export function applyPoseImmediate(skinned,pose){ if(!skinned||!pose) return; for(const b of skinned.skeleton.bones){ const q=pose[b.name]; if(!q) continue; _q.set(q[0],q[1],q[2],q[3]); b.quaternion.copy(_q);} skinned.skeleton.pose(); }
export function blendTowardsPose(skinned,pose,amt){ if(!skinned||!pose) return; for(const b of skinned.skeleton.bones){ const q=pose[b.name]; if(!q) continue; _q.set(q[0],q[1],q[2],q[3]); b.quaternion.slerp(_q, amt);}}
export function blendTowardsPoseMasked(skinned,pose,amt,mask){ if(!skinned||!pose) return; for(const b of skinned.skeleton.bones){ if(!mask(b.name)) continue; const q=pose[b.name]; if(!q) continue; _q.set(q[0],q[1],q[2],q[3]); b.quaternion.slerp(_q, amt);}}
export const Easings={cubicOut:t=>1-Math.pow(1-t,3)};
