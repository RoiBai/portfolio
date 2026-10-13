const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs = body => (Array.isArray(body) ? body : [body]).filter(Boolean).map(text=>`<p>${esc(text)}</p>`).join('');
export function layeredFigure(f) {
 const c=f.layeredSource;
 return `<figure class="project-figure layered-source scroll-layered-source reveal" data-layered-source style="--source-width:1200px">
  <div class="layered-art" tabindex="0" role="region" aria-label="${esc(f.alt||f.caption||'Annotated source design')}">
   <img class="layered-base" src="${esc(c.baseSrc)}" width="${c.width}" height="${c.height}" alt="${esc(f.alt||'Original Color Agent design')}" loading="lazy">
   ${c.steps.map((step,i)=>`<img class="layered-step-art" data-step="${i+1}"  src="${esc(step.src)}" width="${c.width}" height="${c.height}" alt="" aria-hidden="true" loading="lazy">`).join('')}
  </div>
  <ol class="layered-explanations">${c.steps.map((step,i)=>`<li data-step="${i+1}" ><span class="layered-number">${String(step.number||i+1).padStart(2,'0')}</span><div><h3>${esc(step.title)}</h3>${paragraphs(step.body)}</div></li>`).join('')}</ol>
  <span class="figure-scroll-hint layered-scroll-hint" aria-hidden="true">Scroll to follow the six design decisions ↓</span>
  ${f.caption?`<figcaption>${esc(f.caption)}</figcaption>`:''}
 </figure>`;
}
export function compositionLabels(labels=[]) {
 return labels.map(l=>`<foreignObject x="${Number(l.x)}" y="${Number(l.y)}" width="${Number(l.width)}" height="${Number(l.height)}"><div xmlns="http://www.w3.org/1999/xhtml" class="composition-label" style="font-size:${Number(l.fontSize)||22}px;color:${esc(l.color||'inherit')};background:${esc(l.background||'transparent')};font-weight:${Number(l.fontWeight)||400};line-height:${Number(l.lineHeight)>4?Number(l.lineHeight)+'px':Number(l.lineHeight)||1.5};text-align:${esc(l.textAlign||'left')};padding:${Number(l.paddingY)||0}px ${Number(l.paddingX)||0}px">${l.title?`<h3>${esc(l.title)}</h3>`:''}${paragraphs(l.body)}</div></foreignObject>`).join('');
}
export function setupLayeredFigures(root=document) {
 const figures=[...root.querySelectorAll('[data-layered-source]')];
 if(!figures.length)return()=>{};
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const states=figures.map(figure=>({figure,steps:[...figure.querySelectorAll('.layered-explanations > li')],art:[...figure.querySelectorAll('.layered-step-art')]}));
 let frame=0;
 const update=()=>{
  frame=0;
  const threshold=window.innerHeight*.72;
  for(const {figure,steps,art} of states){
   let active=0;
   steps.forEach((step,index)=>{
    const visible=reduced.matches||step.getBoundingClientRect().top<=threshold;
    step.classList.toggle('is-step-visible',visible);
    art[index]?.classList.toggle('is-step-visible',visible);
    if(visible)active=index+1;
   });
   figure.dataset.activeStep=String(active);
   steps.forEach((step,index)=>step.classList.toggle('is-current-step',index===active-1));
  }
 };
 const queue=()=>{if(!frame)frame=requestAnimationFrame(update)};
 window.addEventListener('scroll',queue,{passive:true});
 window.addEventListener('resize',queue,{passive:true});
 reduced.addEventListener('change',queue);
 update();
 return()=>{
  if(frame)cancelAnimationFrame(frame);
  window.removeEventListener('scroll',queue);
  window.removeEventListener('resize',queue);
  reduced.removeEventListener('change',queue);
 };
}
