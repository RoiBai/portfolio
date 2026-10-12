import { layeredFigure, compositionLabels, setupLayeredFigures } from './case-compositions.js';
import { siteURL, sitePath } from './site-paths.js';
import { games, gameSection, setupGames } from './game-embeds.js';
import { renderGameExperience, setupGameExperiences } from './game-experiences.js';
import { renderVerseInteraction, setupVerseInteraction } from './verse-interaction.js';
import { setupSourceFigures } from './source-figures.js';
import { projectHomeOrigin, prepareHomeReturn } from './home-position.js';
import { emphasize, rolePanel, comicPanel, publicLink } from './case-editorial.js';
import { replacementFor, renderDataVisual, setupDataViz, DATA_VISUAL_ADDITIONS } from './data-viz.js';
const homeOrigin = projectHomeOrigin();
let experienceCleanup = () => {}, verseCleanup = () => {}, sourceCleanup = () => {}, layeredCleanup = () => {};
const main = document.querySelector('main');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let projects = [], observer, sectionObserver, layoutObserver, pairedColumns = [], layoutFrame = 0, renderVersion = 0;
const arrow = '<span aria-hidden="true">↗</span>';
const aliases = {'/gglancemap':'/glancemap','/icon-color':'/icon-colors','/iconcolor':'/icon-colors','/traditional-color':'/color-in-context','/traditionalcolor':'/color-in-context','/games/loofa-soup':'/games/loofasoup','/research/gaze':'/research/beyond-the-gaze'};
const path = () => aliases[sitePath()] || sitePath();
const normalizedList = v => !v ? [] : Array.isArray(v) ? v : [v];
function imageSrc(v) { return typeof v === 'string' ? v : v?.src || v?.path; }
function paragraph(body,highlights=[]) { return normalizedList(body).map(t => `<p>${emphasize(typeof t === 'string' ? t : t.text || t.body || '',highlights)}</p>`).join(''); }
function figure(f, i=0, hero=false) {
 if(f?.layeredSource)return layeredFigure(f);
 if(f?.comic)return comicPanel(f.comic,hero);
 if(f?.dataVisual)return renderDataVisual(f.dataVisual);
 if(f?.sourceComposition){
  const c=f.sourceComposition,v=c.viewBox||[0,0,f.width,f.height];
  const transform=t=>Array.isArray(t)?`matrix(${t.join(' ')})`:t||'';
  return `<figure class="project-figure source-composition reveal" style="--source-width:${Number(f.displayWidth)||1200}px"><div class="source-panorama" style="--panorama-width:${Number(c.mobileMinWidth||f.mobileMinWidth)||1000}px" tabindex="0" role="region" aria-label="Annotated project diagram"><svg role="img" aria-label="${esc(f.alt||f.caption)}" style="background:${esc(c.background||'transparent')}" viewBox="${v.join(' ')}" xmlns="http://www.w3.org/2000/svg">${c.layers.map(l=>`<image href="${esc(l.src)}" x="${l.x}" y="${l.y}" width="${l.width}" height="${l.height}"/>`).join('')}${(c.leaders||[]).map(l=>`<path class="original-leader" pathLength="1" d="${esc(l.d)}" transform="${esc(transform(l.transform))}" fill="none" stroke="${esc(l.stroke||'#44518a')}" stroke-width="${l.strokeWidth||3}"/>`).join('')}${compositionLabels(c.labels)}${(c.dots||[]).map(d=>`<circle class="original-leader-dot" cx="${d.cx}" cy="${d.cy}" r="${d.r||3}" fill="${esc(d.fill||'#44518a')}"/>`).join('')}</svg></div><span class="figure-scroll-hint" aria-hidden="true">Scroll across the diagram →</span>${f.caption?`<figcaption>${f.captionTitle?`<div><strong class="figure-caption-title">${esc(f.captionTitle)}</strong><p>${esc(f.caption)}</p></div>`:esc(f.caption)}</figcaption>`:''}</figure>`;
 }
 if(!imageSrc(f))return '';
 const alt=typeof f==='object'?(f.alt||f.caption||'Project process image'):'Project process image';
 const width=Math.min(Number(f.displayWidth)||Number(f.width)||1000,1200);
 const notes=normalizedList(f.annotations);
 const overlay=notes.length?`<svg class="source-connectors" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${notes.map(n=>`<path pathLength="1" d="M ${Number(n.x)} ${Number(n.y)} L ${Number(n.targetX)} ${Number(n.targetY)}"/><circle cx="${Number(n.targetX)}" cy="${Number(n.targetY)}" r=".45"/>`).join('')}</svg>${notes.map(n=>`<span class="source-callout" style="left:${Number(n.x)}%;top:${Number(n.y)}%">${esc(n.text)}</span>`).join('')}`:'';
 return `<figure style="--source-width:${width}px" data-figure-role="${esc(f.figureRole||'')}" class="project-figure ${hero?'hero-figure':''} ${f.className||''} ${notes.length?'annotated-figure':''} reveal"><div class="figure-media" ${f.panoramaMin?`data-panorama="${Number(f.panoramaMin)}" style="--panorama-width:${Number(f.panoramaMin)}px" tabindex="0" role="region" aria-label="Annotated project diagram"`:''} ${f.animateLines?`data-source-svg="${esc(imageSrc(f))}" ${f.width/f.height>2?'tabindex="0" role="region" aria-label="Annotated project diagram"':''}`:''}><img src="${esc(imageSrc(f))}" alt="${esc(alt)}" width="${f.width||1200}" height="${f.height||800}" ${hero?'fetchpriority="high"':'loading="lazy"'} decoding="async">${overlay}</div>${f.panoramaMin||f.animateLines&&f.width/f.height>2?'<span class="figure-scroll-hint" aria-hidden="true">Scroll across the diagram →</span>':''}${f.caption?`<figcaption><span>FIG. ${String(i+1).padStart(2,'0')}</span>${f.captionTitle?`<div><strong class="figure-caption-title">${esc(f.captionTitle)}</strong><p>${esc(f.caption)}</p></div>`:esc(f.caption)}</figcaption>`:''}</figure>`;
}
function links(p) {const list=[...normalizedList(p.links)];if(games[p.id]&&!list.some(l=>(l.url||l.href||'').replace(/\/$/,'')===games[p.id].source.replace(/\/$/,'')))list.unshift({label:'Play original',url:games[p.id].source});return list.filter(l=>publicLink(l.url||l.href)).map(l=>`<a class="text-link" href="${esc(l.url||l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ${arrow}</a>`).join('');}
function setTheme(p) { const t=p?.theme||{}; document.documentElement.style.setProperty('--bg',t.background||t.bg||'#050505'); document.documentElement.style.setProperty('--ink',t.ink||'#f4f4f4');document.documentElement.style.setProperty('--accent',t.accent||'#f4f4f4');document.body.dataset.project=p?.id||'';document.body.classList.toggle('serif',p?.id==='color-in-context'||p?.id==='traditional-color'); }
function section(s,i,hideFigures=false,projectId='') {
 const fs=[...normalizedList(s.figures).map(f=>({...f,dataVisual:f.dataVisual||replacementFor(projectId,s.id,imageSrc(f))})),...DATA_VISUAL_ADDITIONS.filter(v=>v.projectId===projectId&&v.sectionId===s.id).map(v=>({dataVisual:v.visual}))];
 const items=normalizedList(s.items),wide=fs.some(f=>f.width/f.height>=4),composition=fs.some(f=>f.sourceComposition||f.layeredSource||f.panoramaMin||f.animateLines&&f.width/f.height>2);
 const comparison=s.figureLayout==='comparison'||projectId==='traditional-color'&&s.id==='outcomes';
 const visuals=comparison?Array.from({length:Math.ceil(fs.length/2)},(_,j)=>`<div class="figure-pair">${fs.slice(j*2,j*2+2).map((f,k)=>figure(f,j*2+k)).join('')}</div>`).join(''):fs.map((f,j)=>figure(f,j)).join('');
 const interaction=s.experience?renderGameExperience(projectId,s.experience):s.interaction==='verse'?renderVerseInteraction():'';
 const insights=items.length?`<div class="insights">${items.map((item,j)=>typeof item==='string'?`<div class="insight"><span class="small-number">${String(j+1).padStart(2,'0')}</span><p>${esc(item)}</p></div>`:`<div class="insight"><span class="small-number">${String(j+1).padStart(2,'0')}</span><div><h3>${esc(item.title||item.label||'')}</h3>${paragraph(item.body||item.description||item.text||item.detail||item.quote||'',s.highlights)}${publicLink(item.url)?`<a class="text-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.label||'Source')} ↗</a>`:''}</div></div>`).join('')}</div>`:'';
 return `<section id="${esc(s.id)}" data-reveal-group class="case-section ${i%2?'from-right':'from-left'} ${fs.length?'with-visual':'text-only'} ${wide?'wide-visual':''} ${composition?'has-composition':''} ${interaction?'with-experience':''} ${s.experiencePosition==='before-body'?'experience-first':''} ${s.layout?`layout-${esc(s.layout)}`:''}"><div class="section-heading reveal"><div class="eyebrow"><span>${String(i+1).padStart(2,'0')}</span> / ${esc(s.nav||s.id.replaceAll('-',' '))}</div><h2>${esc(s.title)}</h2></div>${interaction&&s.experiencePosition==='before-body'?`<div class="section-experience reveal">${interaction}</div>`:''}<div class="section-body reveal">${paragraph(s.body,s.highlights)}${insights}${s.quote?`<blockquote>${esc(s.quote.text||s.quote)}${s.quote.attribution?`<cite>${esc(s.quote.attribution)}</cite>`:''}</blockquote>`:''}</div>${fs.length?`<div style="--figure-count:${fs.length}" class="section-visuals ${fs.length>1?'multiple':''} ${comparison?'comparisons':''} ${['character-row','dish-grid','study-route','final-design'].includes(s.figureLayout)?s.figureLayout:''}">${visuals}</div>`:''}${interaction&&s.experiencePosition!=='before-body'?`<div class="section-experience reveal">${interaction}</div>`:''}</section>`;
}
function renderProject(p) {
 experienceCleanup();verseCleanup();sourceCleanup();layeredCleanup();
 setTheme(p);document.body.dataset.view='project';document.title=`${p.title} — Ruiyuan Bai`;
 const meta=typeof p.meta==='string'?p.meta:normalizedList(p.meta).filter(m=>typeof m==='string'||!/^my role$/i.test(m.label)).map(m=>typeof m==='string'?m:(m.label?m.label+': ':'')+(m.value||m.text||'')).join(' · ');
 main.innerHTML=`<div class="chapter-bar"><a class="back-link" href="${siteURL('/')}">← All projects</a><nav class="chapter-nav" aria-label="On this page"><a href="#overview" class="active">Overview</a>${games[p.id]&&!['hersound','ourworld'].includes(p.id)?'<a href="#play">Play</a>':''}${p.sections.map(s=>`<a href="#${esc(s.id)}">${esc(s.nav||s.id.replaceAll('-',' '))}</a>`).join('')}</nav></div><article class="case-study"><section class="case-hero" id="overview"><div class="eyebrow">${esc(p.kicker||p.category)}</div><h1>${esc(p.title)}</h1><p class="hero-subtitle">${esc(p.subtitle)}</p><div class="hero-overview" data-reveal-group><div class="hero-bottom reveal"><p>${esc(p.description)}</p>${rolePanel(p.role)}<div class="hero-links">${links(p)}</div><div class="project-meta">${esc(meta)}</div></div>${figure(p.hero,0,true)}</div>${p.stats?.length?`<div class="stats">${p.stats.map(s=>`<div><strong class="${String(s.value).length>8?'stat-long':''}">${esc(s.value)}</strong><span>${esc(s.label)}</span>${s.detail?`<small>${esc(s.detail)}</small>`:''}</div>`).join('')}</div>`:''}</section>${['hersound','ourworld'].includes(p.id)?'':gameSection(p.id)}${p.sections.map((s,i)=>section(s,i,false,p.id)).join('')}</article>`;
 setupGames();setupDataViz(main);experienceCleanup=setupGameExperiences(main);sourceCleanup=setupSourceFigures(main);layeredCleanup=setupLayeredFigures(main);
 if(p.id==='versecolor')verseCleanup=setupVerseInteraction(main);
}
// A chapter is one reveal unit: its text and all corresponding figures enter together.
function setupMotion(){
 observer?.disconnect();sectionObserver?.disconnect();
 const groups=[...document.querySelectorAll('[data-reveal-group]')];
 if(!reduce.matches){
  observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
   const members=target.matches('[data-reveal-group]')?target.querySelectorAll('.reveal'):[target];
   members.forEach(member=>member.classList.toggle('in-view',isIntersecting));
  }),{threshold:0,rootMargin:'-60px 0px -6% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('motion-ready'));
  groups.forEach(group=>observer.observe(group));
  document.querySelectorAll('.reveal').forEach(el=>{if(!el.closest('[data-reveal-group]'))observer.observe(el);});
 }
 const nav=document.querySelector('.chapter-nav');
 if(nav){
  sectionObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){nav.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}}},{rootMargin:'-15% 0px -65% 0px',threshold:0});
  document.querySelectorAll('.case-study section[id]').forEach(s=>sectionObserver.observe(s));
 }
 setupPairedColumns();
}
function updatePairedColumns(){
 cancelAnimationFrame(layoutFrame);
 layoutFrame=requestAnimationFrame(()=>{
  const available=innerHeight-140,desktop=innerWidth>=640;
  const measurements=pairedColumns.map(([copy,visuals])=>({copy,visuals,copyHeight:copy.offsetHeight,visualHeight:visuals.offsetHeight}));
  for(const {copy,visuals,copyHeight,visualHeight} of measurements){
   copy.classList.toggle('reading-companion',desktop&&copyHeight<available&&visualHeight>copyHeight+60);
   visuals.classList.toggle('reading-companion',desktop&&visualHeight<available&&copyHeight>visualHeight+60);
  }
 });
}
function setupPairedColumns(){
 layoutObserver?.disconnect();
 pairedColumns=[...document.querySelectorAll('.case-section.with-visual')].map(section=>[section.querySelector('.section-body'),section.querySelector('.section-visuals')]);
 layoutObserver=new ResizeObserver(updatePairedColumns);
 pairedColumns.flat().forEach(column=>layoutObserver.observe(column));
 updatePairedColumns();
}
window.addEventListener('resize',updatePairedColumns,{passive:true});
function resetScroll(){window.scrollTo({top:0,left:0,behavior:'instant'});}
function render(){
 const route=path(), p=projects.find(p=>p.slug===route);
 if(route==='/'||route==='/games'||route==='/research'){location.replace(siteURL('/'));return;}
 if(p)renderProject(p);
 else{setTheme();main.innerHTML=`<section class="not-found"><h1>Project not found.</h1><a class="text-link" href="${siteURL('/')}">Return to all projects ↗</a></section>`;}
 resetScroll();setupMotion();
}
async function navigate(url,push=true){
 if(sitePath(new URL(url,location.href).pathname)==='/'){prepareHomeReturn(homeOrigin);location.assign(url);return;}
 const version=++renderVersion;
 const commit=()=>{if(version!==renderVersion)return;if(push)history.pushState({},'',url);render();document.body.classList.remove('leaving');document.dispatchEvent(new CustomEvent('portfolio-transition',{detail:{phase:'after',to:location.pathname,source:'project-app'}}));main.focus({preventScroll:true});if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'}));};
 if(!push){window.PortfolioCodeFlow?.cancel('history');commit();return;}
 const detail={phase:'before',from:location.pathname,to:url,source:'project-app',kind:'spa',commit};
 const event=new CustomEvent('portfolio-transition',{cancelable:true,detail});
 if(document.dispatchEvent(event))commit();else if(detail.finished)await detail.finished;
}
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.download||e.button!==0)return;const url=new URL(a.href,location.href);if(url.origin!==location.origin||/\.[a-z0-9]+$/i.test(url.pathname))return;if(url.pathname===location.pathname&&url.hash){e.preventDefault();document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({behavior:reduce.matches?'instant':'smooth'});return;}e.preventDefault();navigate(url.pathname+url.hash);});
history.scrollRestoration='manual';window.addEventListener('popstate',()=>navigate(location.pathname,false));window.addEventListener('pageshow',()=>resetScroll());
try{
 const response=await fetch(siteURL('/content.json'));if(!response.ok)throw Error('Content unavailable');
 projects=(await response.json()).projects;render();
 document.dispatchEvent(new CustomEvent('portfolio-transition',{detail:{phase:'ready',to:location.pathname,source:'project-app'}}));
}catch(error){main.innerHTML='<section class="not-found"><h1>A brief intermission.</h1><p>The portfolio could not load. Please refresh the page.</p><button onclick="location.reload()">Try again</button></section>';console.error(error);}
