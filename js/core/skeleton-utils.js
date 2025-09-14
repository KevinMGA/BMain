import * as THREE from 'three';
export function findFirstSkinnedMesh(root){ let found=null; root.traverse(o=>{ if(!found&&o.isSkinnedMesh) found=o; }); return found; }
export function getWorldPositionOfBone(bone, out=new THREE.Vector3()){ bone.updateWorldMatrix(true,false); return out.setFromMatrixPosition(bone.matrixWorld); }
export function getBoneMap(skinned){ const map={}; if(!skinned||!skinned.skeleton) return map; for(const b of skinned.skeleton.bones) map[b.name]=b; return map; }