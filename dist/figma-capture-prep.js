// Local authoring-only capture: this module is never loaded in published pages.
if(location.hash.includes('figmacapture=')){
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  while(!document.querySelector('.project-next'))await wait(100);
  await document.fonts.ready;
  const style=document.createElement('style');style.textContent=`
    .chapter-bar,.reading-companion,.gx-wind-panel{position:static!important}.gx-wind-track{height:auto!important}
    .reveal,.motion-ready,.layered-step,.layered-step-art,.layered-explanations li,.original-leader-dot,.source-callout{opacity:1!important;transform:none!important}
    .original-leader,.source-connectors path,.source-line-mask{stroke-dashoffset:0!important}
    .skip-link,#portfolio-code-flow{display:none!important}
    *{animation:none!important;transition:none!important}
  `;document.head.append(style);
  for(const canvas of document.querySelectorAll('canvas[data-wind-src]')){const image=new Image();image.src=canvas.dataset.windSrc;image.alt=canvas.getAttribute('aria-label');canvas.replaceWith(image);}
  for(const img of document.images)img.loading='eager';
  await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));
  // Reveal all source figures and initialize scroll-driven diagrams before capture.
  for(const section of document.querySelectorAll('section[id]')){section.scrollIntoView({behavior:'instant'});await wait(75);}
  window.scrollTo({top:0,behavior:'instant'});await wait(800);
  // Resolve modern CSS colors for Figma's parser, without changing the live site.
  const ink=document.createElement('canvas');ink.width=ink.height=1;const pen=ink.getContext('2d');
  const rgba=value=>{pen.clearRect(0,0,1,1);pen.fillStyle=value;pen.fillRect(0,0,1,1);const d=pen.getImageData(0,0,1,1).data;return `rgba(${d[0]},${d[1]},${d[2]},${d[3]/255})`;};
  for(const el of document.querySelectorAll('body *')){const css=getComputedStyle(el);if(css.color.startsWith('color(')||css.color.includes('color-mix'))el.style.color=rgba(css.color);if(css.backgroundColor.startsWith('color(')||css.backgroundColor.includes('color-mix'))el.style.backgroundColor=rgba(css.backgroundColor);}
  // Content SVG compositions can contain nested local SVG images. Embed these
  // sources so the importer has their pixels rather than broken URL references.
  const dataURL=blob=>new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(blob);});
  for(const svg of document.querySelectorAll('.project-figure svg')){
    if(!svg.querySelector('image'))continue;
    const copy=svg.cloneNode(true),box=svg.getBoundingClientRect();
    copy.setAttribute('xmlns','http://www.w3.org/2000/svg');copy.setAttribute('width',box.width);copy.setAttribute('height',box.height);
    for(const image of copy.querySelectorAll('image')){const href=image.getAttribute('href')||image.getAttribute('xlink:href');if(href&&!href.startsWith('data:'))image.setAttribute('href',await dataURL(await (await fetch(href)).blob()));}
    const original=[svg,...svg.querySelectorAll('*')],clones=[copy,...copy.querySelectorAll('*')];
    original.forEach((el,i)=>{const css=getComputedStyle(el);for(const key of ['color','fill','stroke','stroke-width','stroke-dasharray','stroke-dashoffset','font-family','font-size','font-weight','line-height','opacity'])clones[i].style.setProperty(key,css.getPropertyValue(key));});
    const image=new Image();image.src=await dataURL(new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}));await image.decode();
    try{const raster=document.createElement('canvas');raster.width=Math.ceil(box.width*2);raster.height=Math.ceil(box.height*2);raster.getContext('2d').drawImage(image,0,0,raster.width,raster.height);image.src=raster.toDataURL('image/png');await image.decode();}catch(e){console.warn('SVG raster fallback',e);}
    image.style.cssText='width:100%;height:auto;display:block';image.alt=svg.getAttribute('aria-label')||'Original annotated project diagram';svg.replaceWith(image);
  }
  for(const image of document.querySelectorAll('.project-figure img')){
    if(image.src.startsWith('data:image/png'))continue;
    try{const box=image.getBoundingClientRect();const raster=document.createElement('canvas');raster.width=Math.ceil(box.width*2);raster.height=Math.ceil(box.height*2);raster.getContext('2d').drawImage(image,0,0,raster.width,raster.height);image.src=raster.toDataURL('image/png');await image.decode();}catch(e){console.warn('Content image raster fallback',e);}
  }
  const script=document.createElement('script');script.src='https://mcp.figma.com/mcp/html-to-design/capture.js';script.async=true;document.head.append(script);
}
