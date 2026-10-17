import { setupHerEditorial } from './her-editorial.js';
import {imageVariant} from './image-variants.js';
import {startAssetLoading, warmProject} from './asset-loading.js';
import { renderGlanceResults, setupGlanceResults } from './glance-results.js';
import { setupAmbulanceEditorial } from './ambulance-editorial.js';
import { setupAmbulanceRecording } from './ambulance-recording.js';
import { setupLoofaEditorial } from './loofa-editorial.js';
import { renderResearchFigure, setupResearchFigures } from './research-figures.js';
import { renderProjectNavigation } from './project-navigation.js';
import { setupColorInteractions } from './color-interactions.js';
import { setupIconInteractions } from './icon-interactions.js';
import { setupGamesMotion } from './games-motion.js';
import { renderGlanceScroll, setupGlanceScroll } from './glance-scroll.js';
import { setupNewsEmbeds } from './news-embeds.js';
import { renderPersonaIntent } from './research-interactions.js';
import { renderGlanceChapter, setupGlanceEditorial } from './glance-editorial.js';
import { layeredFigure, compositionLabels, setupLayeredFigures } from './case-compositions.js';
import { siteURL, sitePath } from './site-paths.js';
import { games, gameSection, setupGames } from './game-embeds.js';
import { renderGameExperience, setupGameExperiences } from './game-experiences.js';
import { renderVerseInteraction, setupVerseInteraction } from './verse-interaction.js';
import { setupSourceFigures } from './source-figures.js';
import { projectHomeOrigin, prepareHomeReturn } from './home-position.js';
import { emphasize, rolePanel, outcomePanel, comicPanel, publicLink } from './case-editorial.js';
import { replacementFor, renderDataVisual, setupDataViz, DATA_VISUAL_ADDITIONS } from './data-viz.js';
const homeOrigin = projectHomeOrigin();
let glanceResultsCleanup=()=>{};
let researchFiguresCleanup=()=>{}, colorCleanup=()=>{}, iconCleanup=()=>{}, gamesMotionCleanup=()=>{}, gamesCleanup=()=>{}, ambulanceRecordingCleanup=()=>{}, ambulanceCleanup=()=>{}, loofaCleanup=()=>{};
let glanceCleanup = () => {}, glanceScrollCleanup = () => {}, newsCleanup = () => {};
let experienceCleanup = () => {}, verseCleanup = () => {}, sourceCleanup = () => {}, layeredCleanup = () => {};
const main = document.querySelector('main');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const heading = s => esc(String(s||'').replace(/[.!。]+$/, '')).replace(/\b(?:illustration-based|Re-sound)\b/g,word=>`<span class="keep-word">${word}</span>`);
let projects = [], observer, sectionObserver, layoutObserver, pairedColumns = [], layoutFrame = 0, renderVersion = 0;
const arrow = '<span aria-hidden="true">↗</span>';
const aliases = {'/gglancemap':'/glancemap','/icon-color':'/icon-colors','/iconcolor':'/icon-colors','/traditional-color':'/color-in-context','/traditionalcolor':'/color-in-context','/games/loofa-soup':'/games/loofasoup','/research/gaze':'/research/beyond-the-gaze'};
const path = () => aliases[sitePath()] || sitePath();
const normalizedList = v => !v ? [] : Array.isArray(v) ? v : [v];
function imageSrc(v) { return imageVariant(typeof v === 'string' ? v : v?.src || v?.path); }
function paragraph(body,highlights=[]) { return normalizedList(body).map(t => `<p>${emphasize(typeof t === 'string' ? t : t.text || t.body || '',highlights)}</p>`).join(''); }
function figure(f, i=0, hero=false) {
 if(f?.researchFigure)return renderResearchFigure(f.researchFigure);
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
 return `<figure style="--source-width:${width}px" data-figure-role="${esc(f.figureRole||'')}" class="project-figure ${hero?'hero-figure':''} ${f.className||''} ${notes.length?'annotated-figure':''} reveal"><div class="figure-media" ${f.panoramaMin?`data-panorama="${Number(f.panoramaMin)}" style="--panorama-width:${Number(f.panoramaMin)}px" tabindex="0" role="region" aria-label="Annotated project diagram"`:''} ${f.animateLines?`data-source-svg="${esc(imageSrc(f))}" ${f.width/f.height>2?'tabindex="0" role="region" aria-label="Annotated project diagram"':''}`:''}><img src="${esc(imageSrc(f))}"${f.fullSrc?` data-full-src="${esc(f.fullSrc)}"`:""} alt="${esc(alt)}" width="${f.width||1200}" height="${f.height||800}" ${hero?'fetchpriority="high"':'loading="lazy"'} decoding="async">${overlay}</div>${f.panoramaMin||f.animateLines&&f.width/f.height>2?'<span class="figure-scroll-hint" aria-hidden="true">Scroll across the diagram →</span>':''}${f.caption?`<figcaption><span>FIG. ${String(i+1).padStart(2,'0')}</span>${f.captionTitle?`<div><strong class="figure-caption-title">${esc(f.captionTitle)}</strong><p>${esc(f.caption)}</p></div>`:esc(f.caption)}</figcaption>`:''}</figure>`;
}
function links(p) {const list=[...normalizedList(p.links)];if(games[p.id]&&!list.some(l=>(l.url||l.href||'').replace(/\/$/,'')===games[p.id].source.replace(/\/$/,'')))list.unshift({label:'Play original',url:games[p.id].source});return list.filter(l=>publicLink(l.url||l.href)).map(l=>`<a class="text-link" href="${esc(l.url||l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ${arrow}</a>`).join('');}
function setTheme(p) { const t=p?.theme||{}; document.documentElement.style.setProperty('--bg',t.background||t.bg||'#050505'); document.documentElement.style.setProperty('--ink',t.ink||'#f4f4f4');document.documentElement.style.setProperty('--accent',t.accent||'#f4f4f4');document.body.dataset.project=p?.id||'';document.body.classList.toggle('serif',p?.id==='color-in-context'||p?.id==='traditional-color'); }
function section(s,i,hideFigures=false,projectId='') {
 if(projectId==='glancemap'){const custom=renderGlanceResults(s,i)||renderGlanceScroll(s,i)||renderGlanceChapter(s,i);if(custom)return custom;}
 const fs=[...normalizedList(s.figures).map(f=>({...f,dataVisual:f.dataVisual||replacementFor(projectId,s.id,imageSrc(f))})),...DATA_VISUAL_ADDITIONS.filter(v=>v.projectId===projectId&&v.sectionId===s.id).map(v=>({dataVisual:v.visual}))];
 const items=normalizedList(s.items),wide=fs.some(f=>f.width/f.height>=4),composition=fs.some(f=>f.sourceComposition||f.layeredSource||f.panoramaMin||f.animateLines&&f.width/f.height>2);
 const comparison=s.figureLayout==='comparison'||projectId==='traditional-color'&&s.id==='outcomes';
 const visuals=comparison?Array.from({length:Math.ceil(fs.length/2)},(_,j)=>`<div class="figure-pair">${fs.slice(j*2,j*2+2).map((f,k)=>figure(f,j*2+k)).join('')}</div>`).join(''):fs.map((f,j)=>figure(f,j)).join('');
 const interaction=s.experience?renderGameExperience(projectId,s.experience):s.interaction==='verse'?renderVerseInteraction():s.interaction==='persona-intent'?renderPersonaIntent():'';
 const insights=items.length?`<div class="insights">${items.map((item,j)=>typeof item==='string'?`<div class="insight"><span class="small-number">${String(j+1).padStart(2,'0')}</span><p>${esc(item)}</p></div>`:`<div class="insight"><span class="small-number">${String(j+1).padStart(2,'0')}</span><div><h3>${esc(item.title||item.label||'')}</h3>${paragraph(item.body||item.description||item.text||item.detail||item.quote||'',s.highlights)}${publicLink(item.url)?`<a class="text-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.label||'Source')} ↗</a>`:''}</div></div>`).join('')}</div>`:'';
 return `<section id="${esc(s.id)}" data-nav-parent="${esc(s.navParent||s.id)}" data-reveal-group class="case-section ${i%2?'from-right':'from-left'} ${fs.length?'with-visual':'text-only'} ${wide?'wide-visual':''} ${composition?'has-composition':''} ${interaction?'with-experience':''} ${s.experiencePosition==='before-body'?'experience-first':''} ${s.layout?`layout-${esc(s.layout)}`:''}"><div class="section-heading reveal"><div class="eyebrow"><span>${String(i+1).padStart(2,'0')}</span> / ${esc(s.nav||s.id.replaceAll('-',' '))}</div><h2>${heading(s.title)}</h2></div>${interaction&&s.experiencePosition==='before-body'?`<div class="section-experience reveal">${interaction}</div>`:''}<div class="section-body reveal">${paragraph(s.body,s.highlights)}${projectId==='glancemap'&&s.id.startsWith('process')?'':insights}${s.quote?`<blockquote>${esc(s.quote.text||s.quote)}${s.quote.attribution?`<cite>${esc(s.quote.attribution)}</cite>`:''}</blockquote>`:''}${projectId==='glancemap'&&s.id.startsWith('process')?insights:''}</div>${fs.length?`<div style="--figure-count:${fs.length}" class="section-visuals ${fs.length>1?'multiple':''} ${comparison?'comparisons':''} ${['character-row','dish-grid','study-route','final-design'].includes(s.figureLayout)?s.figureLayout:''}">${visuals}</div>`:''}${interaction&&s.experiencePosition!=='before-body'?`<div class="section-experience reveal">${interaction}</div>`:''}</section>`;
}
function cleanProjectHeadings(){
 main.querySelectorAll('h1,h2,h3,h4').forEach(el=>{const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,last;while(n=walk.nextNode())if(n.textContent.trim())last=n;if(last)last.textContent=last.textContent.replace(/[.。]+(\s*)$/,'$1')});
}
function projectMetadata(p){
 const entries=p.id==='glancemap'?[
  {kind:'date',text:'July 2025–September 2026'},
  {kind:'paper',text:'CHI 2027 · Under review'},
  {kind:'author',text:'Second author'}
 ]:(typeof p.meta==='string'?p.meta.split(' · '):normalizedList(p.meta).filter(m=>typeof m==='string'||!/^my role$|^research$/i.test(m.label)).map(m=>typeof m==='string'?m:m.value||m.text||'')).filter(Boolean).map(text=>({kind:/20[0-9]{2}|present/i.test(text)&&! /CHI|IUI|ACM|paper/i.test(text)?'date':/CHI|IUI|ACM|paper|poster|published|review|conference|journal|preprint|session/i.test(text)?'paper':'detail',text}));
 return entries.length?`<div class="project-meta" aria-label="Project dates and publication">${entries.map(e=>`<span class="meta-badge meta-${e.kind}">${esc(e.text)}</span>`).join('')}</div>`:'';
}
function renderStats(p) {
 const item=s=>`<div class="stat-item"><strong class="${String(s.value).length>8?'stat-long':''}">${esc(s.value)}</strong><span>${esc(s.label)}</span>${s.detail?`<small>${esc(s.detail)}</small>`:''}</div>`;
 if(!p.stats?.length)return '';
 if(!p.stats.some(s=>s.group))return `<div class="stats">${p.stats.map(item).join('')}</div>`;
 const groups=[...new Set(p.stats.map(s=>s.group||''))];
 return `<div class="stats stats-grouped">${groups.map(group=>`<div class="stat-group"><h3>${esc(group)}</h3><div class="stat-group-values">${p.stats.filter(s=>(s.group||'')===group).map(item).join('')}</div></div>`).join('')}</div>`;
}
function renderProject(p) {
 ambulanceRecordingCleanup();ambulanceCleanup();loofaCleanup();glanceResultsCleanup();gamesCleanup();researchFiguresCleanup();colorCleanup();iconCleanup();gamesMotionCleanup();glanceScrollCleanup();newsCleanup();experienceCleanup();verseCleanup();sourceCleanup();layeredCleanup();glanceCleanup();
 setTheme(p);document.body.dataset.view='project';document.title=`${p.title} — Ruiyuan Bai`;
 const meta=projectMetadata(p);
 main.innerHTML=`<div class="chapter-bar"><a class="back-link" href="${siteURL('/')}">← All projects</a><nav class="chapter-nav" aria-label="On this page"><a href="#overview" class="active">Overview</a>${games[p.id]&&!['hersound','ourworld'].includes(p.id)?'<a href="#play">Play</a>':''}${p.sections.filter(s=>!s.navParent).map(s=>`<a href="#${esc(s.id)}">${esc(s.nav||s.id.replaceAll('-',' '))}</a>`).join('')}</nav></div><article class="case-study"><section class="case-hero" id="overview"><div class="project-title-row"><h1>${heading(p.title)}</h1><div class="project-pills" aria-label="Project themes">${(p.tags||[]).map(tag=>`<span class="project-pill">${esc(tag)}</span>`).join('')}</div></div>${p.subtitle?`<p class="hero-subtitle">${esc(String(p.subtitle||'').replace(/[.。]+$/,''))}</p>`:''}<div class="hero-overview" data-reveal-group><div class="hero-bottom reveal"><p>${emphasize(p.description,p.highlights||[])}</p>${rolePanel(p.role)}${outcomePanel(p.outcome)}<div class="hero-links">${links(p)}</div>${meta}</div>${figure(p.hero,0,true)}</div>${renderStats(p)}</section>${['hersound','ourworld'].includes(p.id)?'':gameSection(p.id)}${p.sections.map((s,i)=>section(s,i,false,p.id)).join('')}${renderProjectNavigation(p,projects)}</article>`;
 glanceResultsCleanup=setupGlanceResults(main);glanceScrollCleanup=setupGlanceScroll(main);glanceCleanup=setupGlanceEditorial(main);gamesCleanup=setupGames(main);setupDataViz(main);setupHerEditorial(main,p);experienceCleanup=setupGameExperiences(main);newsCleanup=setupNewsEmbeds(main);sourceCleanup=setupSourceFigures(main);colorCleanup=setupColorInteractions(main,p);iconCleanup=setupIconInteractions(main,p);layeredCleanup=setupLayeredFigures(main);researchFiguresCleanup=setupResearchFigures(main);gamesMotionCleanup=setupGamesMotion(main);
 ambulanceCleanup=setupAmbulanceEditorial(main,p);ambulanceRecordingCleanup=setupAmbulanceRecording(main,p);loofaCleanup=setupLoofaEditorial(main,p);
 if(p.id==='versecolor')verseCleanup=setupVerseInteraction(main);
 cleanProjectHeadings();
 warmProject(p.id);
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
  sectionObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){nav.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash==='#'+(e.target.dataset.navParent||e.target.id)));}}},{rootMargin:'-15% 0px -65% 0px',threshold:0});
  document.querySelectorAll('.case-study section[id]').forEach(s=>sectionObserver.observe(s));
 }
 setupPairedColumns();
}
function updatePairedColumns(){
 document.querySelectorAll('.reading-companion').forEach(n=>n.classList.remove('reading-companion'));
}
function setupPairedColumns(){
 layoutObserver?.disconnect();updatePairedColumns();
 for(const section of document.querySelectorAll('.case-section.with-visual')){
  const visual=section.querySelector(':scope > .section-visuals');
  const count=visual?.querySelectorAll(':scope > .project-figure').length;
  const custom=section.matches('.has-composition,.with-experience,.ambulance-chapter,.loofa-gameplay-editorial')||section.querySelector('[data-ic-study],.icon-guideline-tier,.research-process,.atlas-feature,[data-research-figure],.persona-intent-demo');
  section.classList.toggle('editorial-pair',!!visual&&count===1&&!custom&&!['characters','production','future','study','atlas','refinement','gradients','reflection'].includes(section.id));
 }
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
async function settleHero(){await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,80))]);}
async function navigate(url,push=true,sourceElement=null){
 if(sitePath(new URL(url,location.href).pathname)==='/'){prepareHomeReturn(homeOrigin);const detail={phase:'before',to:url,kind:'native',sourceElement,commit:()=>location.assign(url)};if(document.dispatchEvent(new CustomEvent('portfolio-transition',{cancelable:true,detail})))detail.commit();return;}
 const version=++renderVersion;
 const commit=async()=>{if(version!==renderVersion)return;if(push)history.pushState({},'',url);render();await settleHero();if(version!==renderVersion)return;if(!location.hash)resetScroll();document.body.classList.remove('leaving');document.dispatchEvent(new CustomEvent('portfolio-transition',{detail:{phase:'after',to:location.pathname,source:'project-app'}}));main.focus({preventScroll:true});if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'}));};
 const detail={phase:'before',from:location.pathname,to:url,source:'project-app',kind:'spa',sourceElement,commit};
 const event=new CustomEvent('portfolio-transition',{cancelable:true,detail});
 if(document.dispatchEvent(event))commit();else if(detail.finished)await detail.finished;
}
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.download||e.button!==0)return;const url=new URL(a.href,location.href);if(url.origin!==location.origin||/\.[a-z0-9]+$/i.test(url.pathname))return;if(url.pathname===location.pathname&&url.hash){e.preventDefault();document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({behavior:reduce.matches?'instant':'smooth'});return;}e.preventDefault();navigate(url.pathname+url.hash,true,a);});
history.scrollRestoration='manual';window.addEventListener('popstate',()=>navigate(location.pathname,false));window.addEventListener('pageshow',()=>resetScroll());
try{
 const response=await fetch(siteURL('/content.json'));if(!response.ok)throw Error('Content unavailable');
 const content=await response.json();projects=content.projects;startAssetLoading(content);render();await settleHero();if(!location.hash)resetScroll();
 document.dispatchEvent(new CustomEvent('portfolio-transition',{detail:{phase:'ready',to:location.pathname,source:'project-app'}}));
}catch(error){main.innerHTML='<section class="not-found"><h1>A brief intermission.</h1><p>The portfolio could not load. Please refresh the page.</p><button onclick="location.reload()">Try again</button></section>';console.error(error);}
