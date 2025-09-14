// Minimal Rapier loader with local-first strategy.
export async function loadRapier(){
  // Load locally if available
  const local = './lib/rapier/rapier.es.js';
  try{
    const RAPIER = await import(local);
    return RAPIER;
  }catch(e){
    console.warn('[Physics] Local rapier not found, physics disabled.', e);
    return null;
  }
}