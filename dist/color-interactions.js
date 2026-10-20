import { siteURL } from './site-paths.js';
import { renderAtlasScroll, setupAtlasScroll, renderAtlasCompose, setupAtlasCompose } from './atlas-scroll.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const PALETTES=[{name:'A · Warmer accents',colors:[['Zhu Sha','#8B1A1A'],['Teng Huang','#E8A50F'],['Shi Lü','#4D8A63'],['Tian Qing','#6E9CB3'],['Qian Bai','#F2ECDE']]},{name:'B · Blue-led direction',colors:[['Tian Qing','#6E9CB3'],['Yue Bai','#CFE0E8'],['Yan Zhi','#9D2933'],['Dai','#4A4266'],['Qian Bai','#F2ECDE']]}];
// Dialogue and palette values transcribed from the author's original Color Agent concept.
const DIALOGUE=[
 {user:'I’m unsure how to color this palace magnet.',agent:'What feeling should the design convey?'},
 {prompt:'Which era and place should guide the palette?',user:'Qing-era Beijing, with a calm, contemporary feel.',agent:null},
 {agent:'For that brief: a warmer direction, or a softer blue-led palette.',palettes:true},
 {agent:'B pairs sky-inspired Tian Qing with moonlight-inspired Yue Bai.',source:'Tian Qing: Guide to the Study of Antiquities. Check period notes and source uncertainty.'},
 {agent:'Now preview both palettes across the whole drawing.',art:true},
 {user:'I prefer B. Soften the flowers and keep the blue sky.',agent:'I’ll adjust only the flowers. Review or accept when ready.',actions:true}
];
const paletteMarkup=()=>`<div class="color-chat-palettes">${PALETTES.map(p=>`<div><strong>${p.name}</strong><div class="color-chat-swatches">${p.colors.map(([name,hex])=>`<span style="--swatch:${hex}" title="${name} · ${hex}"><i></i><small>${name}</small></span>`).join('')}</div></div>`).join('')}</div>`;
function agentNote(step,i){return `<div class="color-agent-row-note" data-agent-note="${i}"><span>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(step.title||'')}</h3><p>${esc(step.body||'')}</p></div></div>`;}
function phaseMarkup(d,i,step={}){return `<div class="color-chat-phase" data-phase="${i}" data-mobile-title="${String(i+1).padStart(2,'0')} · ${esc(step.title||'')}"><div class="color-agent-row-dialogue">${d.prompt?`<p class="color-chat-context">${esc(d.prompt)}</p>`:''}${d.user?`<div class="color-chat-message color-chat-user"><span class="color-message-label">Designer</span><p class="color-typed-message" data-message="${esc(d.user)}"><span class="color-message-reserve" aria-hidden="true">${esc(d.user)}</span><span data-typed-output>${esc(d.user)}</span></p></div>`:''}${d.agent?`<div class="color-chat-message color-chat-agent"><span class="color-message-label">Color Agent</span><p>${esc(d.agent)}</p>${d.palettes?paletteMarkup():''}${d.source?`<div class="color-chat-source"><span>Color record</span><strong>Tian Qing · 天青</strong><p>${esc(d.source)}</p></div>`:''}${d.art?`<div class="color-chat-art-pair">${['a','b'].map((key,j)=>`<figure class="color-chat-art"><svg class="color-palace-cutout" viewBox="90 108 1440 850" role="img" aria-label="Original palace magnet study artwork, ${j?'cooler':'warmer'} direction"><defs><clipPath id="palace-outline-${key}"><path d="M 169 552 C 169 518 165 480 188 460 L 223 442 C 214 401 239 365 271 344 C 249 325 255 286 281 273 C 297 260 320 259 346 259 C 357 223 394 204 435 201 C 461 197 486 204 507 217 C 527 184 580 169 622 177 C 638 133 682 114 723 121 C 762 127 797 153 814 179 C 842 164 871 168 889 180 C 910 143 958 117 1004 124 C 1050 131 1087 162 1097 185 C 1119 176 1137 180 1158 192 C 1203 182 1236 197 1257 219 C 1270 237 1274 260 1274 266 C 1308 257 1339 270 1340 297 C 1340 310 1326 318 1315 322 C 1346 332 1371 359 1386 377 C 1399 397 1404 419 1399 437 L 1432 460 C 1455 481 1467 498 1466 518 L 1465 551 C 1500 558 1519 578 1514 606 C 1516 636 1499 652 1481 662 C 1495 702 1478 731 1456 752 C 1471 778 1476 794 1470 806 C 1455 826 1441 829 1428 831 C 1423 870 1413 893 1383 912 C 1355 931 1318 934 1268 937 L 397 947 C 366 942 356 925 345 918 C 301 920 271 908 241 893 C 211 878 199 851 195 835 C 160 830 146 808 153 775 C 132 763 123 739 133 712 C 122 695 125 683 130 673 C 109 665 99 646 104 625 C 100 602 119 576 139 566 Z"/></clipPath></defs><image href="${siteURL('/assets/design-followup/color-agent-palace-'+key+'.jpg')}" width="1620" height="1080" clip-path="url(#palace-outline-${key})"/></svg><figcaption>${j?'B · Cooler':'A · Warmer'}</figcaption></figure>`).join('')}</div><p class="color-chat-art-label">Roof · Sky · Flowers · Stone</p>`:''}${d.actions?'<div class="color-chat-actions"><span>Refine B</span><span>Accept direction</span></div>':''}</div>`:''}</div><p class="color-agent-mobile-note">${esc(step.body||'')}</p></div>`;}
export function renderColorAgent(source){const steps=source?.steps||[];return `<div class="color-agent-scroll color-agent-rows color-agent-separated" data-color-agent><div class="color-agent-stage"><div class="color-agent-heading"><span>Color Agent / Future concept</span></div><div class="color-agent-two-columns"><div class="color-agent-explanations">${DIALOGUE.map((_,i)=>agentNote(steps[i],i)).join('')}</div><div class="color-chat-window"><div class="color-chat-top"><span class="color-chat-symbol" aria-hidden="true">✳</span><span>Color Agent</span><span class="color-chat-step">01 / 06</span></div><div class="color-chat-content">${DIALOGUE.map((d,i)=>phaseMarkup(d,i,steps[i])).join('')}</div></div></div></div></div>`;}
function atlasFigure(f){return `<figure class="color-atlas-figure color-vertical-figure"><img src="${siteURL(f.src)}" alt="${esc(f.alt||f.caption||'Original Color Atlas artwork')}" width="${f.width||1200}" height="${f.height||800}" loading="lazy" decoding="async">${f.caption?`<figcaption>${esc(f.caption).replaceAll('usual workflow','<span class="color-keep-phrase">usual workflow</span>').replaceAll('with the atlas','<span class="color-keep-phrase">with the atlas</span>')}${f.observation?`<span class="color-artwork-observation">${esc(f.observation)}</span>`:''}</figcaption>`:''}</figure>`;}
function renderAtlasRecord(c){const figs=c.figures||[];return `<div class="color-record-heading"><h3>${esc(c.title)}</h3></div><div class="color-record-board"><div class="color-record-callouts"><article data-record-callout="0"><h4>Name & value</h4><p><strong>Tianqing · Sky blue.</strong> <span class="color-inline-reference"><i style="background:#6E9CB3" aria-hidden="true"></i>#6E9CB3</span> is the atlas’s digital display value; historical sources describe the color and its context.</p></article><article data-record-callout="1"><h4>Origin & historical context</h4><p>The sky clearing after rain connects the name to <strong>Ru-ware glaze</strong> and the <strong>Five Dynasties–Northern Song</strong> period.</p></article><article data-record-callout="2"><h4>Citation evidence</h4><p>Follow the record’s references to <strong>Guide to the Study of Antiquities</strong> and <strong>Miscellaneous Records of Qingbo</strong>.</p></article></div><div class="color-record-original">${figs.map((f,i)=>`<img data-record-image="${i}" src="${siteURL(f.src)}" alt="${esc(f.alt)}" width="${f.width}" height="${f.height}" loading="lazy">`).join('')}</div><div class="color-record-connectors" aria-hidden="true">${[0,1,2].map(i=>`<div data-record-line="${i}"><i></i><i></i><i></i><b></b></div>`).join('')}</div></div>`;}
function setupRecordConnectors(root){
 const board=root.querySelector('.color-record-board');if(!board)return()=>{};
 let frame=0,disposed=false;
 // Point beside the printed hex value and into the source text's left margin without covering lettering.
 const points=[[0,.68,.455],[1,.025,.14],[1,.025,.91]];
 function segment(el,x1,y1,x2,y2){
  const horizontal=Math.abs(y2-y1)<.1;el.dataset.axis=horizontal?'x':'y';
  el.style.cssText=`left:${Math.min(x1,x2)}px;top:${Math.min(y1,y2)}px;width:${horizontal?Math.abs(x2-x1):0}px;height:${horizontal?0:Math.abs(y2-y1)}px`;
 }
 function draw(){
  frame=0;if(disposed)return;const base=board.getBoundingClientRect(),mobile=innerWidth<=700;
  points.forEach(([imageIndex,tx,ty],i)=>{
   const callout=board.querySelector(`[data-record-callout="${i}"]`),source=board.querySelector(`[data-record-image="${imageIndex}"]`),line=board.querySelector(`[data-record-line="${i}"]`);if(!callout||!source||!line)return;
   const text=callout.getBoundingClientRect(),image=source.getBoundingClientRect(),parts=line.querySelectorAll('i');
   const x1=(mobile?text.left:text.right)-base.left,y1=text.top+text.height*.5-base.top,x2=image.left-base.left+image.width*tx,y2=image.top-base.top+image.height*ty;
   const lane=mobile?8+i*8:text.right-base.left+(image.left-text.right)*(.34+i*.2);
   segment(parts[0],x1,y1,lane,y1);segment(parts[1],lane,y1,lane,y2);segment(parts[2],lane,y2,x2,y2);
   line.querySelector('b').style.cssText=`left:${x2}px;top:${y2}px`;
  });
 }
 const queue=()=>{if(!disposed&&!frame)frame=requestAnimationFrame(draw)},observer=new ResizeObserver(queue),images=[...board.querySelectorAll('img')];
 observer.observe(board);images.forEach(image=>image.addEventListener('load',queue));window.addEventListener('resize',queue);document.fonts.ready.then(queue);queue();
 return()=>{disposed=true;observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('resize',queue);images.forEach(image=>image.removeEventListener('load',queue));};
}
export function renderColorAtlas(chapters){return `<div class="color-atlas-chapters">${chapters.map(c=>`<article class="color-atlas-subchapter color-atlas-${c.id}" id="atlas-${c.id}">${c.id==='connections'?renderAtlasScroll(c):c.id==='record'?renderAtlasRecord(c):`<div class="color-atlas-copy"><h3>${esc(c.title)}</h3><ul>${(Array.isArray(c.body)?c.body:[c.body]).filter(Boolean).map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>${c.id==='brief'?renderAtlasCompose():`<div class="color-atlas-media">${c.figures.map(atlasFigure).join('')}</div>`}`}</article>`).join('')}</div>`;}
function setupResearch(root,p){
 const section=root.querySelector('#research'),data=p.sections.find(s=>s.id==='research');if(!section||!data)return;
 section.classList.add('color-research-brief');section.querySelector('.section-visuals')?.remove();section.classList.remove('with-visual','editorial-pair');
 section.querySelector('.insights')?.remove();
 const swatches=`<div class="color-reference-swatches" aria-label="Two illustrative digital references for Zhu sha">${[['#CA3433','Reference A'],['#9D2933','Reference B']].map(([hex,label])=>`<div><i style="background:${hex}" aria-hidden="true"></i><span><strong>Zhu sha / 朱砂</strong><small>${hex}</small></span></div>`).join('')}</div>`;
 section.insertAdjacentHTML('beforeend',`<div class="color-research-questions">${(data.items||[]).map((item,i)=>`<article class="color-research-question"><div><h3>${esc(item.title)}</h3>${item.quote?`<blockquote class="color-formative-quote">“${esc(item.quote.text)}”<cite>${esc(item.quote.attribution)}</cite></blockquote>`:''}<p>${esc(item.body)}</p>${i===1?swatches:''}</div></article>`).join('')}</div>`);
}

function setupColoGene(root,p){
 const section=root.querySelector('#colorgene'),data=p.sections.find(s=>s.id==='colorgene');if(!section||!data)return;
 const labels=['Function 01','Functions 02–04','Function 05'];
 section.querySelectorAll('.project-figure>figcaption').forEach((caption,i)=>{
  caption.querySelector(':scope>span')?.remove();
  const title=caption.querySelector('.figure-caption-title');
  if(!title)return;
  const heading=document.createElement('h3');
  heading.className='color-function-title';
  heading.textContent=`${labels[i]}: ${data.figures[i].captionTitle}`;
  title.replaceWith(heading);
 });
}

function setupAtlasStudy(root,p){const section=root.querySelector('#atlas-study'),data=p.sections.find(s=>s.id==='atlas-study');if(!section||!data)return;section.classList.add('color-atlas-study');section.querySelector('.section-visuals')?.remove();section.insertAdjacentHTML('beforeend',`<div class="color-study-sequence"><div><strong>3 artworks</strong><span>Usual workflow</span></div><span class="color-study-sequence-arrow" aria-hidden="true">→</span><div><strong>Explore Atlas</strong><span>Color records + palette recommendations</span></div><span class="color-study-sequence-arrow" aria-hidden="true">→</span><div><strong>3 artworks</strong><span>Revisit the same briefs with Atlas</span></div></div><div class="color-study-artworks"><h3>Selected revisions across three briefs</h3><p class="color-comparison-hint">Scroll sideways to compare the three briefs →</p><div class="color-study-comparison-window" tabindex="0" role="region" aria-label="Three artwork comparisons: usual workflow above, Color Atlas below"><div class="color-study-comparison-matrix">${[0,1].map(row=>`<div class="color-artwork-row ${row?'color-artwork-row-with':'color-artwork-row-without'}"><div class="color-artwork-row-label"><strong class="color-artwork-row-title">${row?'With Color Atlas':'Without Color Atlas'}</strong><span class="color-artwork-row-subtitle">${row?'The same three briefs, revisited':'The designers’ usual workflow'}</span></div>${data.figures.filter((_,i)=>i%2===row).map(atlasFigure).join('')}</div>`).join('')}</div></div></div><div class="color-study-feedback color-next-steps"><h3>Next iteration</h3><ul>${(data.colorStudyFeedback||[]).map(f=>`<li><h4>${esc(f.next.replace(/\.$/,''))}</h4><blockquote>“${esc(f.text)}”<cite>${esc(f.participant)}</cite></blockquote></li>`).join('')}</ul></div>`);}
function setupAbstract(root,p){const section=root.querySelector('#abstract');if(!section)return;section.classList.add('color-abstract-overview');section.querySelectorAll('.color-abstract-visual,.section-visuals').forEach(e=>e.remove());const body=section.querySelector('.section-body');body?.querySelector('.insights')?.remove();const items=p.sections.find(s=>s.id==='abstract')?.items||[];const assets=[['/assets/colorgene-02-system-404f4e0a.webp',3840,951],['/website-assets/atlas-display.svg',470,401],['/assets/design-followup/color-agent-base.svg',1960,1390]];const wrap=document.createElement('div');wrap.className='color-version-overview';wrap.innerHTML=items.map((item,i)=>`<article><div class="color-version-image"><img src="${siteURL(assets[i][0])}" width="${assets[i][1]}" height="${assets[i][2]}" alt="${esc(item.title)} original interface overview" loading="lazy"></div><div class="color-version-copy"><div class="color-version-caption"><div class="color-version-meta"><span class="color-version-number">${esc(item.version||`Version ${i+1}.0`)}</span><span class="color-version-status">${esc(item.status||['CHI Poster 2026','In progress','Future'][i])}</span></div><h3>${esc(item.title)}</h3></div><p>${esc(item.body)}</p></div></article>`).join('');const finding=body?.querySelector(':scope>p:nth-of-type(3)');if(finding){finding.classList.add('color-abstract-finding');section.append(wrap,finding);}else section.append(wrap);}
function setupPilot(root,p){const data=p.sections.find(s=>s.id==='pilot');const section=root.querySelector('#pilot');if(!section)return;section.classList.remove('with-visual','wide-visual','editorial-pair');section.classList.add('color-pilot-compact');const body=section.querySelector('.section-body'),visuals=section.querySelector('.section-visuals'),next=body?.querySelector('.insights');if(next){next.className='color-pilot-next color-next-steps';next.innerHTML=`<h3>Next iteration</h3><ul>${(data?.nextIteration||[{title:'Fuller historical sources',body:'Keep museum and scholarly references beside each color.'},{title:'Palettes for the designer’s brief',body:'Suggest combinations for the intended scene and cultural theme.'}]).map(item=>`<li><h4>${esc(item.title)}</h4><p>${esc(item.body)}</p></li>`).join('')}</ul>`;section.append(next);}const firstFigure=visuals?.querySelector('.project-figure:not(.data-visual)'),quote=body?.querySelector('blockquote');if(firstFigure&&quote){const context=document.createElement('div');context.className='color-pilot-evidence-copy';visuals.prepend(context);context.append(firstFigure,quote);}const dv=visuals?.querySelector('[data-native-visual]');if(body&&visuals){const summary=document.createElement('div');summary.className='color-pilot-results-copy';section.insertBefore(body,visuals);if(dv)summary.append(dv);visuals.append(summary);}if(dv){
 dv.querySelector('.dv-title')?.remove();dv.querySelector('.dv-description')?.remove();dv.removeAttribute('aria-labelledby');dv.setAttribute('aria-label','ColoGene pilot results');
 const panels=[...dv.querySelectorAll('.dv-panel')];
 const labels=[['Self-reported color decisions','Mean pre–post gain · Questionnaire points'],['Finished within 15 minutes','Participants completing all three tasks · Out of 5 per group']];
 panels.forEach((panel,i)=>{if(!labels[i])return;const [title,unit]=labels[i];panel.querySelector('.dv-panel-title').textContent=title;panel.querySelector('.dv-unit').textContent=unit;});
 dv.querySelector('.dv-panels')?.insertAdjacentHTML('afterend','<p class="color-pilot-result-summary">In this small pilot, <strong>ColoGene users reported larger gains</strong> and all five finished on time; the questionnaire reflects self-assessment.</p>');
 const details=dv.querySelector('details');if(details)details.insertAdjacentHTML('beforeend','<p class="color-scale-explanation"><strong>Questionnaire measure.</strong> The Traditional Color Semantic Cognition and Decision Scale (TCSCDS) uses 1–7 agreement ratings about cultural meaning, evidence, palette decisions and task effort. The gain is self-assessment, not a test of historical accuracy. Five participants per group.</p>');
 } }

function numberColorChapters(root){
 const chapters=[['overview','Overview'],['abstract','Abstract'],['research','Problem statement'],['colorgene','ColoGene'],['atlas','Atlas'],['future','Future']];
 chapters.forEach(([id,label],i)=>{
  const section=root.querySelector('#'+id);if(!section)return;
  const number=String(i+1).padStart(2,'0');
  if(id==='overview'){
   const title=section.querySelector('.project-title-row');
   if(title&&!section.querySelector('.color-overview-label'))title.insertAdjacentHTML('beforebegin',`<div class="eyebrow color-overview-label">${number} / ${label}</div>`);
  }else{const labelNode=section.querySelector('.section-heading .eyebrow');if(labelNode)labelNode.textContent=`${number} / ${label}`;}
  const link=root.querySelector(`.chapter-nav a[href="#${id}"]`);if(link)link.setAttribute('aria-label',`${number}. ${label}`);
 });
 for(const [id,label] of [['pilot','ColoGene / Pilot'],['atlas-study','Atlas / Study']]){
  const section=root.querySelector('#'+id);if(!section)continue;
  section.classList.add('color-internal-section');const eyebrow=section.querySelector('.section-heading .eyebrow');if(eyebrow)eyebrow.textContent=label;
 }
}

export function setupColorInteractions(root=document,p){
 if(p?.id!=='traditional-color')return()=>{};
 setupAbstract(root,p);setupResearch(root,p);setupColoGene(root,p);setupPilot(root,p);setupAtlasStudy(root,p);numberColorChapters(root);
 const atlas=root.querySelector('#atlas'),atlasData=p.sections.find(s=>s.id==='atlas');
 if(atlas&&atlasData?.colorAtlasChapters){atlas.className='case-section color-atlas-complete';atlas.querySelector('.section-body')?.remove();atlas.querySelector('.section-visuals')?.remove();atlas.insertAdjacentHTML('beforeend',`<div class="color-atlas-introduction">${(atlasData.body||[]).map(t=>`<p>${esc(t)}</p>`).join('')}</div>`+renderColorAtlas(atlasData.colorAtlasChapters));const sticky=atlas.querySelector('.atlas-native-sticky'),heading=atlas.querySelector(':scope>.section-heading'),intro=atlas.querySelector(':scope>.color-atlas-introduction');if(sticky&&heading){heading.classList.add('atlas-chapter-heading');heading.classList.remove('reveal','motion-ready');sticky.prepend(heading);if(intro)heading.after(intro);}}
 const recordCleanup=setupRecordConnectors(root);
 const atlasScrollCleanup=setupAtlasScroll(atlas);
 const atlasComposeCleanup=setupAtlasCompose(atlas);
 const verticalSections=['research','colorgene','sources','compose'].map(id=>root.querySelector('#'+id)).filter(Boolean);
 verticalSections.forEach(section=>{section.classList.add('color-vertical-chapter');section.querySelectorAll('.project-figure').forEach((fig,i)=>{fig.classList.remove('reveal','motion-ready');fig.classList.add('color-vertical-figure');fig.style.setProperty('--figure-order',i);});});
 const verticalFigures=[...verticalSections.flatMap(section=>[...section.querySelectorAll('.color-vertical-figure')]),...root.querySelectorAll('.color-atlas-figure')];
 const future=p.sections.find(s=>s.id==='future'),source=future?.figures?.find(f=>f.layeredSource)?.layeredSource;
 const target=root.querySelector('#future .layered-source');if(source&&target){const holder=document.createElement('div');holder.innerHTML=renderColorAgent(source);target.replaceWith(holder.firstElementChild);root.querySelector('#future .section-visuals')?.classList.add('color-agent-visuals');}
 const agent=root.querySelector('[data-color-agent]');const artPairs=[...root.querySelectorAll('#outcomes .figure-pair,.color-atlas-artworks .color-artwork-pair,#atlas-study .color-artwork-pair')];artPairs.forEach(pair=>{pair.classList.add('color-artwork-pair');pair.querySelectorAll('figcaption').forEach(c=>{c.innerHTML=c.innerHTML.replaceAll('usual workflow','<span class="color-keep-phrase">usual workflow</span>').replaceAll('with the atlas','<span class="color-keep-phrase">with the atlas</span>');});});
 const insights=[...root.querySelectorAll('#research .insight')];insights.forEach((el,i)=>{el.classList.add('color-research-insight');el.style.setProperty('--insight-index',i)});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),compact=matchMedia('(max-width:999px)');let frame=0,currentPhase=0;
 const readMode=()=>reduced.matches||compact.matches;
 function update(){
  frame=0;const vh=innerHeight,plain=readMode();
  for(const fig of verticalFigures){const r=fig.getBoundingClientRect(),pr=reduced.matches?1:clamp((vh*.94-r.top)/(vh*.26));fig.style.setProperty('--figure-reveal',pr.toFixed(3));}
  for(const el of insights){const r=el.getBoundingClientRect(),pr=reduced.matches?1:clamp((vh*.90-r.top)/(vh*.26));el.style.setProperty('--insight-progress',pr.toFixed(3));}
  for(const pair of artPairs){const r=pair.getBoundingClientRect(),distance=Math.abs(r.top+r.height/2-vh*.5)/(vh*.65+r.height*.25),focus=clamp(1-distance);pair.style.setProperty('--art-focus',reduced.matches?1:focus.toFixed(3));}
  if(agent){agent.classList.toggle('color-agent-read-mode',reduced.matches);const rows=[...agent.querySelectorAll('[data-phase]')];currentPhase=0;
   rows.forEach((el,i)=>{const rect=el.getBoundingClientRect(),local=reduced.matches?1:clamp((vh*.92-rect.top)/Math.min(vh*.53,Math.max(160,rect.height*.95)));if(local>.02)currentPhase=i;el.hidden=false;el.classList.toggle('is-phase-current',local>0&&local<1);el.classList.toggle('is-phase-filled',local>=.98);el.style.setProperty('--step-progress',local>0?1:0);const note=agent.querySelector(`[data-agent-note="${i}"]`);if(note)note.classList.toggle('is-note-visible',reduced.matches||local>.06);const typing=el.querySelector('[data-message]'),d=DIALOGUE[i];if(typing){const t=typing.dataset.message;typing.querySelector('[data-typed-output]').textContent=t.slice(0,Math.ceil(t.length*clamp(local/.48)));typing.classList.toggle('is-typing',!reduced.matches&&local>0&&local<.48)}const answer=el.querySelector('.color-chat-agent');const reveal=reduced.matches?1:d.user?clamp((local-.47)/.20):clamp(local/.35);if(answer){answer.style.setProperty('--reply-progress',reveal.toFixed(3));answer.classList.toggle('is-answer-visible',reveal>.5);}});
   agent.querySelector('.color-chat-step').textContent=`${String(currentPhase+1).padStart(2,'0')} / 06`;
  }
 }
 const queue=()=>{if(!frame)frame=requestAnimationFrame(update)};
 function measureAgent(){if(!agent)return;const small=innerWidth<=700;agent.querySelectorAll('[data-phase]').forEach((row,i)=>{const note=agent.querySelector(`[data-agent-note="${i}"]`);row.style.removeProperty('min-height');note?.style.removeProperty('min-height');if(!small&&note){const height=Math.ceil(Math.max(row.getBoundingClientRect().height,note.getBoundingClientRect().height));row.style.minHeight=height+'px';note.style.minHeight=height+'px';}});queue();}
 const agentObserver=agent?new ResizeObserver(()=>{if(!measurePending)measurePending=requestAnimationFrame(()=>{measurePending=0;measureAgent()})}):null;let measurePending=0;
 if(agentObserver)agentObserver.observe(agent.querySelector('.color-agent-two-columns'));
 requestAnimationFrame(measureAgent);
 function navigation(event){

  if(agent&&event.target.closest('[data-agent-next],[data-agent-prev]')){const direction=event.target.closest('[data-agent-next]')?1:-1,next=clamp(currentPhase+direction,0,5),travel=agent.offsetHeight-agent.querySelector('.color-agent-stage').offsetHeight;window.scrollTo({top:scrollY+agent.getBoundingClientRect().top-100+(next+.6)/6*travel,behavior:reduced.matches?'instant':'smooth'});}
 }
 root.addEventListener('click',navigation);window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue,{passive:true});reduced.addEventListener('change',queue);compact.addEventListener('change',queue);update();
 return()=>{recordCleanup();atlasScrollCleanup();atlasComposeCleanup();cancelAnimationFrame(frame);cancelAnimationFrame(measurePending);agentObserver?.disconnect();root.removeEventListener('click',navigation);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);reduced.removeEventListener('change',queue);compact.removeEventListener('change',queue)};
}
