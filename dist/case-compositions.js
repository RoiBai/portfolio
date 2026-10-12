const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs = body => (Array.isArray(body) ? body : [body]).filter(Boolean).map(text=>`<p>${esc(text)}</p>`).join('');
export function layeredFigure(f) {
 const c=f.layeredSource;
 return `<figure class="project-figure layered-source reveal" data-layered-source style="--source-width:1200px">
  <div class="layered-art" tabindex="0" role="region" aria-label="${esc(f.alt||f.caption||'Annotated source design')}">
   <img class="layered-base" src="${esc(c.baseSrc)}" width="${c.width}" height="${c.height}" alt="${esc(f.alt||'Original Color Agent design')}" loading="lazy">
   ${c.steps.map((step,i)=>`<img class="layered-step-art" data-step="${i+1}" style="--step-delay:${.55+i*.5}s" src="${esc(step.src)}" width="${c.width}" height="${c.height}" alt="" aria-hidden="true" loading="lazy">`).join('')}
  </div>
  <ol class="layered-explanations">${c.steps.map((step,i)=>`<li data-step="${i+1}" style="--step-delay:${.55+i*.5}s"><span class="layered-number">${String(step.number||i+1).padStart(2,'0')}</span><div><h3>${esc(step.title)}</h3>${paragraphs(step.body)}</div></li>`).join('')}</ol>
  <span class="figure-scroll-hint layered-scroll-hint" aria-hidden="true">Scroll across the diagram →</span>
  ${f.caption?`<figcaption>${esc(f.caption)}</figcaption>`:''}
 </figure>`;
}
export function compositionLabels(labels=[]) {
 return labels.map(l=>`<foreignObject x="${Number(l.x)}" y="${Number(l.y)}" width="${Number(l.width)}" height="${Number(l.height)}"><div xmlns="http://www.w3.org/1999/xhtml" class="composition-label" style="font-size:${Number(l.fontSize)||22}px;color:${esc(l.color||'inherit')};background:${esc(l.background||'transparent')};font-weight:${Number(l.fontWeight)||400};line-height:${Number(l.lineHeight)>4?Number(l.lineHeight)+'px':Number(l.lineHeight)||1.5};text-align:${esc(l.textAlign||'left')};padding:${Number(l.paddingY)||0}px ${Number(l.paddingX)||0}px">${l.title?`<h3>${esc(l.title)}</h3>`:''}${paragraphs(l.body)}</div></foreignObject>`).join('');
}
export function setupLayeredFigures(root=document) {
 const figures=[...root.querySelectorAll('[data-layered-source]')];
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-playing');observer.unobserve(entry.target)}},{threshold:.12});
 figures.forEach(f=>observer.observe(f));
 return()=>observer.disconnect();
}
