// model-debug.js
// Mueve el código de inspección y ajuste de materiales fuera de index.html
(function(){
  const mv = document.querySelector('#main-model');
  if(!mv) return;

  // Helper: inspect and log model internals (materials, textures, images)
  function inspectModel(){
    try{
      const model = mv.model;
      if(!model){ console.log('model-viewer: model not yet available'); return; }

      const mats = model.materials || [];
      const textures = model.textures || [];
      const images = model.images || [];

      console.group('model-viewer: model inspection');
      console.log('materials:', mats.length, 'textures:', textures.length || 'n/a', 'images:', images.length || 'n/a');

      mats.forEach((mat,i) => {
        console.group(`material[${i}] ${mat.name || ''}`);
        try{ console.log('material object:', mat); }catch(e){}

        try{
          const pbr = mat.pbrMetallicRoughness || mat.pbrMetallicRoughness;
          if(pbr){
            console.log('pbrMetallicRoughness ->', {
              metallicFactor: pbr.metallicFactor ?? (pbr.getMetallicFactor ? pbr.getMetallicFactor() : 'n/a'),
              roughnessFactor: pbr.roughnessFactor ?? (pbr.getRoughnessFactor ? pbr.getRoughnessFactor() : 'n/a')
            });
            if(pbr.baseColorTexture) console.log('baseColorTexture:', pbr.baseColorTexture);
            if(pbr.metallicRoughnessTexture) console.log('metallicRoughnessTexture:', pbr.metallicRoughnessTexture);
          }
        }catch(e){}

        if(mat.normalTexture) console.log('normalTexture:', mat.normalTexture);
        console.groupEnd();
      });

      if(textures && textures.length) console.log('textures list:', textures.map(t => t.name || t));
      if(images && images.length) console.log('images list:', images.map((img, idx) => ({ idx, mimeType: img.mimeType, bufferView: img.bufferView, uri: img.uri })));
      console.groupEnd();
    }catch(e){ console.warn('inspectModel error', e); }
  }

  // Fallback: heuristic adjustments for metal-like materials
  function adjustMetallicFallback(){
    try{
      const model = mv.model;
      if(!model) return;
      const mats = model.materials || [];

      for(const mat of mats){
        const name = (mat.name || '').toLowerCase();
        if(/metal|alumin|steel|iron|gold|chrome|bronze/.test(name)){
          try{
            if(mat.pbrMetallicRoughness && typeof mat.pbrMetallicRoughness.setMetallicFactor === 'function'){
              mat.pbrMetallicRoughness.setMetallicFactor(1.0);
              mat.pbrMetallicRoughness.setRoughnessFactor(0.35);
            } else if('metallicFactor' in mat && 'roughnessFactor' in mat){
              mat.metallicFactor = 1.0;
              mat.roughnessFactor = 0.35;
            }
          }catch(e){ console.debug('adjust per-material failed', e); }
        }
      }

      if(typeof model.updateScene === 'function') model.updateScene();
    }catch(e){ console.warn('adjustMetallicFallback error', e); }
  }

  mv.addEventListener('load', () => {
    console.log('model-viewer: load event fired');
    inspectModel();
    adjustMetallicFallback();
  });

  // retry a bit later in case some resources finish after the event
  setTimeout(() => { inspectModel(); }, 1200);
  setTimeout(() => { adjustMetallicFallback(); }, 1400);

  // Expose helpers to the window so a UI button can re-run inspection
  try{
    window.modelDebug = window.modelDebug || {};
    window.modelDebug.inspectModel = inspectModel;
    window.modelDebug.adjustMetallicFallback = adjustMetallicFallback;
  }catch(e){ /* ignore */ }
})();
