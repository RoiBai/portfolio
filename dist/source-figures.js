// Animate only identified connector/route paths in the author's own SVG exports.
let serial=0;
export function setupSourceFigures(root=document) {
 const controller=new AbortController();
 for(const host of root.querySelectorAll('[data-source-svg]')) {
  const fallback=host.querySelector('img'),src=host.dataset.sourceSvg;
  if(!(src?.startsWith('/assets/design-revision/')||src?.startsWith('/assets/design-followup/'))||!src.endsWith('.svg'))continue;
  fetch(src,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Source SVG unavailable');return r.text()}).then(text=>{
   if(controller.signal.aborted||!host.isConnected)return;
   const doc=new DOMParser().parseFromString(text,'image/svg+xml');
   const svg=doc.documentElement;if(svg.localName!=='svg'||doc.querySelector('parsererror'))return;
   svg.querySelectorAll('script,foreignObject').forEach(node=>node.remove());
   const paths=[...svg.querySelectorAll('path[stroke][id]')].filter(p=>/route|implication to creative step/i.test(p.id));
   const prefix='source-figure-'+(++serial)+'-', ids=new Map([...svg.querySelectorAll('[id]')].map(el=>[el.id,prefix+el.id]));
   for(const el of [svg,...svg.querySelectorAll('*')])for(const attr of [...el.attributes]){
    if(/^on/i.test(attr.name)){el.removeAttribute(attr.name);continue;}
    if(attr.name==='id'){el.setAttribute('id',ids.get(attr.value));continue;}
    let value=attr.value;
    for(const [oldId,newId] of ids){value=value.replaceAll('url(#'+oldId+')','url(#'+newId+')');if(value==='#'+oldId)value='#'+newId;}
    if(value!==attr.value)el.setAttribute(attr.name,value);
   }
   const ns='http://www.w3.org/2000/svg',defs=doc.createElementNS(ns,'defs');svg.append(defs);
   paths.forEach((path,index)=>{
    const mask=doc.createElementNS(ns,'mask'),id=prefix+'line-mask-'+index;mask.id=id;mask.setAttribute('maskUnits','userSpaceOnUse');mask.setAttribute('x','-100%');mask.setAttribute('y','-100%');mask.setAttribute('width','300%');mask.setAttribute('height','300%');
    const ink=path.cloneNode();ink.removeAttribute('id');ink.removeAttribute('opacity');ink.setAttribute('stroke','white');ink.setAttribute('fill','none');ink.setAttribute('stroke-width',String(Number(path.getAttribute('stroke-width')||4)+4));ink.setAttribute('pathLength','1');ink.setAttribute('stroke-dasharray','1');ink.setAttribute('stroke-dashoffset','1');ink.classList.add('source-line-mask');ink.style.setProperty('--line-delay',(index*.06)+'s');mask.append(ink);defs.append(mask);path.setAttribute('mask','url(#'+id+')');
   });
   svg.setAttribute('role','img');svg.setAttribute('aria-label',fallback?.alt||'');svg.classList.add('inline-source-svg');svg.removeAttribute('width');svg.removeAttribute('height');
   fallback?.replaceWith(document.importNode(svg,true));host.dataset.linesLoaded=String(paths.length);
  }).catch(error=>{if(error.name!=='AbortError')host.dataset.sourceFallback='true'});
 }
 return()=>controller.abort();
}
