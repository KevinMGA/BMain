export const DEFAULT_ACTIONS = [
  'Idle','StepFwd','StepBack','StepLeft','StepRight','Jab','Cross'
];
const KEY='anim-map-v1';
let _map=Object.create(null);

export function getAnimMap(){
  if(Object.keys(_map).length) return _map;
  try{ const raw=localStorage.getItem(KEY); if(raw) _map=JSON.parse(raw);}catch(e){}
  return _map;
}
export function setAnim(action, url, clipName){
  const m=getAnimMap(); m[action]={url,clipName}; localStorage.setItem(KEY, JSON.stringify(m));
}
export function clearAnim(action){
  const m=getAnimMap(); delete m[action]; localStorage.setItem(KEY, JSON.stringify(m));
}
export function exportJSON(){ return JSON.stringify(getAnimMap(), null, 2); }
export function importJSON(json){ _map=JSON.parse(json||'{}'); localStorage.setItem(KEY, JSON.stringify(_map)); }
