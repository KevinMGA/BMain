
Sideview Boxing — LIB layout (no bundler)

1) Copy Three.js files to these paths (exactly):
   /boxing/lib/three/build/three.module.js
   /boxing/lib/three/examples/jsm/loaders/FBXLoader.js
   /boxing/lib/three/examples/jsm/controls/OrbitControls.js

   (Optional, if some old import requests /examples/js/*, shims are provided at:
   /boxing/lib/three/examples/js/loaders/FBXLoader.js
   /boxing/lib/three/examples/js/controls/OrbitControls.js )

2) (Optional) Physics — put Rapier here:
   /boxing/lib/rapier/rapier.es.js
   /boxing/lib/rapier/rapier_wasm3d_bg.wasm

3) Put your character FBX here:
   /boxing/assets/character.fbx

4) Serve the /boxing folder via http(s)://yourhost/boxing/
   Open: http://localhost/boxing/#/match

This build uses /js/views/* (not /js/pages/*) and a LIB folder (no vendor).
Created: 2025-09-14T01:52:23.195573Z
