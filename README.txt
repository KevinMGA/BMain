
Sideview Boxing — LIB layout (no bundler)

1) Copy Three.js files to these paths. The app looks for `lib/three` first
   and falls back to `vendor/three` for older layouts:
   lib/three/build/three.module.js
   lib/three/examples/jsm/loaders/FBXLoader.js
   lib/three/examples/jsm/controls/OrbitControls.js

   (Optional, if some old import requests /examples/js/*, shims are provided at:
   lib/three/examples/js/loaders/FBXLoader.js
   lib/three/examples/js/controls/OrbitControls.js )

2) (Optional) Physics — put Rapier here:
   lib/rapier/rapier.es.js
   lib/rapier/rapier_wasm3d_bg.wasm

3) Put your character FBX here:
   assets/character.fbx

4) Serve the project root via http(s)://yourhost/
   Open: http://localhost/#/match

This build uses /js/views/* (not /js/pages/*) and prefers a LIB folder but
will fall back to a vendor folder if present.
Created: 2025-09-14T01:52:23.195573Z
