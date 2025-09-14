// Editor snippet: capture only rotated bones (sparse pose)
// Usage in your editor: const pose = captureSparsePose(skinned, 0.01);
export function captureSparsePose(skinned, epsilonRad = 0.01){
  const map = {};
  const bones = skinned.skeleton.bones;
  for (const b of bones){
    const rest = b.userData._restQuat || (b.userData._restQuat = b.quaternion.clone());
    const q = b.quaternion;
    const dot = Math.abs(rest.w*q.w + rest.x*q.x + rest.y*q.y + rest.z*q.z);
    const angle = 2*Math.acos(Math.min(1, dot));
    if (angle > epsilonRad){
      map[b.name] = [q.x, q.y, q.z, q.w];
    }
  }
  return { boneRotations: map };
}
