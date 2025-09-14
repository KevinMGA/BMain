// Simple pose/anim binding registry. Editor writes here (localStorage backed).
const STORAGE_KEY = 'boxing.bindings.v1';
const DEFAULT = {
  Guard: 'GuardPhilly',
  Relaxed: 'RelaxedPhilly',
  Jab: 'Jab',
  Cross: 'Cross',
  WeaveL: 'WeaveL',
  WeaveR: 'WeaveR',
  BobUp: 'BobUp',
  BobDown: 'BobDown'
};

export const AnimDB = {
  // action -> url (fbx)   (set in editor)
};
export const PoseDB = {
  bindings(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY))||DEFAULT }catch{ return DEFAULT; } },
  save(b){ localStorage.setItem(STORAGE_KEY, JSON.stringify(b)); }
};
