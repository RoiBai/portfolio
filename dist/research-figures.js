import { siteURL } from './site-paths.js';
import { replacementFor } from './data-viz.js';
import { setupPersonaIntent } from './research-interactions.js';
// Original paper images and HTML/CSS web figures. See assets/research-interactive/sources.json.
// Rating coordinates come directly from PDF vector objects, not a screenshot or estimated raw data.
const ASSET = '/assets/research-interactive/';
let sequence = 0;
const esc = (s='') => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const picture=(src,alt,extra='')=>`<img src="${siteURL(ASSET+src)}" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}>`;
const paintings=['Paris Street, Rainy Day','The Stonemason’s Yard','The Wedding at Cana','Historical scene','The Hay Wain'];
const groups=[['understanding','Context'],['usability','Usability'],['workload','Workload'],['engagement','Engagement']];
const survey = {
 needs:[['Hard to compare sections',61.8],['Want close-up exploration',85.3],['Want clearer spatial positioning',80.6],['Viewing is mostly passive',78.5],['Social perspectives encourage exploration',82.7],['Limited background affects viewing',64.9]],
 functions:[['Role-based interpretation',77],['High-resolution detail exploration',70.7],['Dynamic scene activation',63.4],['Layered knowledge content',51.3],['Spatial progress navigation',47.6],['Virtual guide / NPC dialogue',40.3],['Knowledge quiz / interactive game',28.8]]
};
function tabs(id, items, selected) {
 return `<div class="rf-tabs" role="tablist" aria-label="Choose a view">${items.map(([key,label])=>`<button type="button" role="tab" id="${id}-${key}" aria-controls="${id}-panel" aria-selected="${String(key)===String(selected)}" tabindex="${String(key)===String(selected)?0:-1}" data-rf-tab="${key}">${esc(label)}</button>`).join('')}</div>`;
}
function note(title,body){return `<figcaption class="rf-caption"><strong>${esc(title)}</strong><p>${esc(body)}</p></figcaption>`;}
function gazeOverview(){
 const views=[
  ['gaze-art-2-original.jpg','Artwork','The original painting'],
  ['gaze-1-heatmap.webp','Gaze','Where looking accumulated'],
  ['gaze-1-scanpath.webp','Eye path','The order of eye movements'],
  ['gaze-1-regions.webp','Region map','Meaningful areas for comparison']
 ];
 return `<figure class="project-figure rf-figure rf-gaze-overview" data-research-figure="gaze-artwork"><div class="rf-gaze-overview-grid" role="group" aria-label="Four aligned views of the same painting">${views.map(([file,label,detail],i)=>`<figure><img src="${siteURL(ASSET+file)}" alt="Paris Street, Rainy Day — ${detail.toLowerCase()}" loading="eager" decoding="async"${i===0?' fetchpriority="high"':''}><figcaption><strong>${label}</strong></figcaption></figure>`).join('')}</div><figcaption class="rf-gaze-overview-note"><em>Paris Street, Rainy Day</em> · One of 24 study paintings</figcaption></figure>`;
}
function setupGazeHierarchy(root){
 if(document.body.dataset.project!=='beyond-the-gaze')return;
 let chapter=0;
 const labels={signals:'Method · GSL & HLL',example:'Analysis · One example'};
 root.querySelectorAll('.case-study>.case-section').forEach(section=>{
  const eyebrow=section.querySelector(':scope>.section-heading>.eyebrow');
  if(!eyebrow)return;
  if(section.dataset.navParent!==section.id){
   section.classList.add('gaze-subsection');
   eyebrow.textContent=labels[section.id]||eyebrow.textContent;
   root.querySelector('#'+section.dataset.navParent)?.classList.add('gaze-has-subsection');
  }else{
   chapter++;
   const number=eyebrow.querySelector('span');
   if(number)number.textContent=String(chapter).padStart(2,'0');
  }
 });
}
function evidencePanel(selected=0){
 const terms=[['heatmap','Gaze density'],['scanpath','Eye path'],['regions','Region map']];
 return `<div class="rf-evidence-grid">${terms.map(([key,label])=>{
  const haywain=Number(selected)===4&&key==='regions';
  const file=haywain?'gaze-haywain-a3.webp':`gaze-${Number(selected)+1}-${key}.webp`;
  const detail=key==='heatmap'?'Where looking accumulated':key==='scanpath'?'The order of eye movements':haywain?'Six semantic regions · A3 highlighted':'Semantic region labels';
  return `<div class="rf-evidence-item">${picture(file,`${paintings[selected]}: ${key}${haywain?' from Figure 5':''}`).replace('loading="lazy"','loading="eager"')}<h4>${esc(label)}</h4><p>${detail}</p></div>`;
 }).join('')}</div>`;
}
function gazeArchive(id){
 return `<section class="project-figure rf-gaze-archive rf-gaze-evidence" data-research-figure="gaze-evidence" data-rf-id="${id}" data-rf-selected="0" aria-label="Original eye-tracking views"><h3>Original eye-tracking views</h3>${tabs(id,paintings.map((name,i)=>[i,name]),0).replace('Choose a view','Choose a painting')}<p class="rf-gaze-gallery-hint">Swipe to compare the three views →</p><div class="rf-panel" id="${id}-panel" role="tabpanel" aria-labelledby="${id}-0" tabindex="0">${evidencePanel(0)}</div></section>`;
}
function gazeRecord(){
 const codes=[
  ['H','Gaze','High accumulated gaze','A3 met the combined gaze criterion. Its 38 visits exceeded the trial mean of 20.33.'],
  ['L','Selection','Not selected in recall','A3 was not selected as important or helpful in the later recall task.'],
  ['L','Language','No interpretive claim','A3 was not used to make a coded interpretive claim about the painting.']
 ];
 return `<figure class="project-figure rf-figure rf-gaze-record" data-research-figure="gaze-record"><div class="rf-record-region">${picture('gaze-haywain-a3.webp','The Hay Wain: region A3 highlighted in the original paper’s Figure 5')}<div class="rf-record-source"><strong>The Hay Wain · Region A3</strong><span>One viewer, P16 · Paper-reported coding</span></div></div><div class="rf-record-codes">${codes.map(([code,name,title,body])=>`<section><span class="rf-record-letter" aria-label="${name}: ${code==='H'?'High':'Low'}">${code}</span><div><span class="rf-record-signal">${name}</span><h4>${title}</h4><p>${body}</p></div></section>`).join('')}</div></figure>`;
}
function surveyPanel(selected='needs'){
 const rows=survey[selected];return `<div class="rf-bars">${rows.map(([label,value],i)=>`<div class="rf-bar-row" style="--rf-order:${i}"><div><span>${esc(label)}</span><strong aria-label="${value.toFixed(1)} percent"><span data-rf-number="${value}" aria-hidden="true">${value.toFixed(1)}</span><small aria-hidden="true">%</small></strong></div><div class="rf-bar-track" aria-hidden="true"><span style="--rf-value:${value}%"></span></div></div>`).join('')}</div><p class="rf-chart-note">${selected==='functions'?'Participants could select several functions.':'Share of participants agreeing with each statement.'} Survey n = 191</p>`;
}
function interval(row, series, y){
 const [low,mean,high]=row[series].map(v=>4.166667+v*91.666667);
 const val=v=>(2.5+v*2.5).toFixed(2);
 const description=`${series==='baseline'?'Baseline':'ScrollVerse'}: mean approximately ${val(row[series][1])}, 95% confidence interval ${val(row[series][0])} to ${val(row[series][2])}`;
 return `<div class="rf-ci rf-ci-${series}" role="img" aria-label="${esc(description)}" style="--rf-y:${y}px"><span class="rf-ci-range" style="left:${low}%;width:${high-low}%"></span><span class="rf-ci-mean" style="left:${mean}%"></span></div>`;
}
function ratingsPanel(selected='understanding'){
 const rows=RATINGS.filter(r=>r.group===selected);
 return `<div class="rf-ratings"><div class="rf-rating-axis"><span>Rating</span><div>${[2.5,3,3.5,4,4.5,5].map(v=>`<span>${v}</span>`).join('')}</div></div>${rows.map((r,i)=>`<div class="rf-rating-row" style="--rf-order:${i}"><span>${esc(r.label)}</span><div class="rf-ci-plot">${[0,.2,.4,.6,.8,1].map(v=>`<i class="rf-gridline" aria-hidden="true" style="left:${4.166667+v*91.666667}%"></i>`).join('')}${interval(r,'baseline',17)}${interval(r,'scrollverse',36)}</div></div>`).join('')}</div><p class="rf-chart-note">Means and 95% confidence intervals · 30 participants per condition<br>Rating scale: 1–5 · Chart shows 2.5–5</p>`;
}
function tabFigure(kind,id,title,body,items,selected,panel,extra=''){
 return `<figure class="project-figure rf-figure rf-${kind}" data-research-figure="${kind}" data-rf-id="${id}" data-rf-selected="${selected}" data-rf-mode="original">${tabs(id,items,selected)}${extra}<div class="rf-panel" id="${id}-panel" role="tabpanel" aria-labelledby="${id}-${selected}">${panel}</div>${note(title,body)}</figure>`;
}
function gazeSignalMatrix(){
 const signals=[
  ['Gaze','gaze','More total fixation time than the trial’s average region, plus supporting measures.','Did not meet the combined gaze criterion.'],
  ['Selection','selection','Selected the region as important or helpful in later recall.','Did not select it as important or helpful in later recall.'],
  ['Language','language','Used the region to explain the painting: “The smoke suggests war.”','Did not mention it, or only described it: “There is smoke.”']
 ];
 return `<figure class="project-figure rf-figure rf-gaze-signals" data-research-figure="gaze-signals"><div class="rf-signal-columns">${signals.map(([name,key,high,low],i)=>`<section data-signal="${key}"><h4>${name}</h4><dl>${[['High',high],['Low',low]].map(([level,description],j)=>{const selected=i===0?j===0:j===1;return `<div class="rf-signal-cell${selected?' is-hll-component':''}" data-signal-level="${level.toLowerCase()}"${selected?' data-hll-selected="true"':''}><dt><b>${level[0]}</b><span>${level}</span>${selected?'<span class="sr-only"> — part of HLL</span>':''}</dt><dd>${description}</dd></div>`;}).join('')}</dl></section>`).join('')}</div><figcaption class="rf-gsl-hll"><strong>HLL</strong><div><h4>Read the highlighted cells: H–L–L</h4><p>High accumulated gaze, no later selection, and no coded interpretive claim.</p><small>The smoke statements above illustrate the coding rule; they are not participant quotations.</small></div></figcaption></figure>`;
}
function personaOpening(image){
 const scenes=[
  ['Ask for a day off','You’re a PhD student. AI writes:','“I am writing to formally request…”','Too formal for someone you know.'],
  ['Set the relationship','Familiar supervisor. Polite, appreciative and brief.','“Could I take today off? Thank you for understanding.”',''],
  ['Keep your style','Next request: miss a morning meeting.','','Change the facts; keep the relationship and tone.']
 ];
 return `<figure class="project-figure rf-figure rf-persona-opening" data-research-figure="persona-opening"><img class="rf-persona-comic" src="${siteURL(image||'/assets/research-interactive/persona-example-comic.png')}" width="2172" height="724" alt="A PhD student struggles with formal AI emails, defines a familiar supervisor relationship, then reuses the same writing style"><figcaption class="rf-persona-scenes">${scenes.map(([title,body,quote,after],i)=>`<div><span>0${i+1}</span><h4>${title}</h4><p>${body}</p>${quote?`<p class="persona-hero-quote ${i===0?'is-generic':'is-personal'}">${quote}</p>`:''}${after?`<p>${after}</p>`:''}${i===2?'<a class="persona-hero-try" href="#interaction">Try the example ↓</a>':''}</div>`).join('')}</figcaption></figure>`;
}
function compactSuzhouStudy(kind){
 const data=replacementFor('suzhou-scrollverse','study','/assets/fig4-study-results-bc437b38.webp');
 return `<figure class="project-figure rf-figure rf-suzhou-study" data-research-figure="${kind}"><div class="rf-suzhou-conditions"><section><span class="eyebrow">Annotation viewer · 30 people</span><h4>Browse and read</h4><p>Pan and zoom freely; open expert notes at 15 cultural scenes. About 260 shops are located on the painting.</p></section><section><span class="eyebrow">ScrollVerse · 30 people</span><h4>Follow, interpret and investigate</h4><p>The same painting and cultural content, organized through unfolding scenes, social perspectives and visual inquiry.</p></section></div><div class="rf-study-comparisons">${data.panels.slice(0,2).map((panel,i)=>`<section><h4>${panel.title}</h4><p class="rf-study-unit">${i===0?'SUS score · 0–100':'Workload rating · 0–5'}</p>${panel.rows.map((r,j)=>`<div class="rf-study-bar"><div><span>${r.label}</span><strong>${r.display}</strong></div><div class="rf-bar-track"><span style="--rf-value:${r.value/panel.max*100}%;--rf-order:${j};background:${j===0?'var(--rf-brown)':'var(--rf-blue)'}"></span></div></div>`).join('')}<p class="rf-study-reading">${i===0?'No clear usability difference (p = .294).':'No clear workload difference (p = .359).'}</p></section>`).join('')}</div><div class="rf-study-reports">${data.panels[2].rows.map((r,i)=>`<div><strong>${r.value}<small> / 30</small></strong><p>${i===0?'reported clearer understanding of Qing-dynasty urban life':'would recommend ScrollVerse or try a similar experience'}</p></div>`).join('')}</div></figure>`;
}
function suzhouWalkthrough(){
 const photo=(file,alt,w,h)=>`<img src="${siteURL('/assets/research-clarity/'+file)}" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async">`;
 const media=(...args)=>`<div class="rf-suzhou-image">${photo(...args)}</div>`;
 const roles=[
  ['commoner','Commoner','Food, work and daily routines'],
  ['merchant','Merchant','Shops, transport and trade'],
  ['scholar','Scholar','Gardens and the city’s cultural life']
 ];
 return `<figure class="project-figure rf-figure rf-suzhou-walkthrough" data-research-figure="suzhou-experience"><div class="rf-suzhou-place"><section class="rf-suzhou-locate"><div class="rf-suzhou-step"><span class="eyebrow">01 · Locate</span><h4>Arrive at Shantang Street</h4><p>Scroll along the city. The location marker keeps this riverfront street connected to the whole painting.</p></div>${media('suzhou-original-scroll-view.webp','Original Shantang Street interface with the scene name and position marker',1897,823)}</section><section class="rf-suzhou-lenses" data-no-detail><div class="rf-suzhou-step"><span class="eyebrow">02 · Choose a perspective</span><h4>One riverfront, three readings</h4></div><div class="rf-suzhou-role-list">${roles.map(([file,name,body])=>`<div class="rf-suzhou-lens">${photo('suzhou-role-'+file+'-native.webp',name+' character',228,229)}<div><strong>${name}</strong><p>${body}</p></div></div>`).join('')}</div></section></div><div class="rf-suzhou-clue"><div class="rf-suzhou-step"><span class="eyebrow">03 · Return to the evidence</span><h4>Find the figure, then read the street</h4><p>Match the pictured person to the scroll. Look at the surrounding shops, then connect them to the scene’s explanation.</p></div>${media('suzhou-original-cultural-clue.webp','A street figure located within the Shantang Street painting using the original trace-seeking interface',1896,826)}<aside class="rf-suzhou-context"><span class="eyebrow">What the scene record adds</span><h4>Shopfronts become a commercial street</h4><p>The Shantang Street record names <strong>fan shops, lantern shops and restaurants</strong>. The merchant lens connects these pictured details to the city’s trade and services.</p></aside></div></figure>`;
}
export function renderResearchFigure(spec={}){
 const id=`research-figure-${++sequence}`;
 switch(spec.kind){
 case 'persona-opening': return personaOpening(spec.image);
 case 'gaze-artwork': return gazeOverview();
 case 'gaze-evidence': return gazeArchive(id);
 case 'gaze-procedure': return `<figure class="project-figure rf-figure rf-method-source" data-research-figure="${spec.kind}"><p class="rf-method-context">Nine-point calibration → 24 self-paced painting trials</p><ol class="rf-method-source-steps">${[
 ['Look','View freely; click when an initial interpretation forms.'],
 ['Recall','With the screen blank, identify the regions that helped your understanding.'],
 ['Explain','Explain the painting’s meaning. Both spoken responses are recorded.']
 ].map(([title,body],i)=>`<li>${picture('gaze-signal-'+(i+1)+'.webp',title+' scene from the original study procedure')}<div><span>0${i+1}</span><h4>${title}</h4><p>${body}</p></div></li>`).join('')}</ol></figure>`;
 case 'gaze-signals': return gazeSignalMatrix();
 case 'gaze-record': return gazeRecord();
 case 'gaze-composition': return `<figure class="project-figure rf-figure" data-research-figure="${spec.kind}"><div class="rf-composition-grid">${[
 ['The Peasant Wedding','Diagonal composition','Piper and guests entering through the doorway'],
 ['The Stonemason’s Yard','Spatial depth','Church and buildings on the opposite bank'],
 ['Paris Street, Rainy Day','Perspective transition','Approaching pedestrians and umbrellas']
 ].map(([name,label,body],i)=>`<div>${picture(`gaze-composition-${i+1}.webp`,`${name}: highlighted HLL region and compositional lines`)}<h4>${label}</h4><p>${body}</p></div>`).join('')}</div></figure>`;
 case 'suzhou-survey': return `<div class="rf-suzhou-needs"><section><span class="eyebrow">Place</span><h4>80.6% wanted clearer positioning</h4><p>Keep a progress marker while unfolding the scroll.</p></section><section><span class="eyebrow">Perspective</span><h4>82.7% valued social perspectives</h4><p>Organize context through commoner, scholar and merchant lenses.</p></section><section><span class="eyebrow">Evidence</span><h4>64.9% lacked background knowledge</h4><p>Link explanations and inquiry to details in the painting.</p></section></div><details class="rf-suzhou-source-details"><summary>See the formative survey · 191 responses</summary>${tabFigure(spec.kind,id,'Needs and preferred functions','Reported survey percentages informed the design; they do not establish that a feature improves learning.',[['needs','Needs & barriers'],['functions','Preferred functions']],'needs',surveyPanel())}</details>`;
 case 'suzhou-ratings': return `<details class="rf-suzhou-rating-details"><summary>Explore all experience ratings</summary>${tabFigure(spec.kind,id,'Four dimensions of the experience','Means and uncertainty across context, usability, workload and engagement.',groups,'understanding',ratingsPanel(),'<div class="rf-legend"><span class="rf-key-baseline">Annotation viewer</span><span class="rf-key-scrollverse">ScrollVerse</span></div>')}</details>`;
 case 'suzhou-experience': return suzhouWalkthrough();
 case 'suzhou-study': return compactSuzhouStudy(spec.kind);
 case 'suzhou-runtime': return `<details class="rf-suzhou-runtime-details"><summary>How the website keeps place and content together</summary><figure class="project-figure rf-figure rf-runtime" data-research-figure="${spec.kind}"><ol class="rf-runtime-flow"><li><span>01</span><h4>Load nearby tiles</h4>${picture('suzhou-tiles.webp','Visible and prefetched scroll tiles from the original pipeline figure')}<p>Buffer the next area as the viewer moves.</p></li><li><span>02</span><h4>Match scene and role</h4>${picture('suzhou-scene.webp','An indexed scene in the scroll')}<p>Retrieve the scene’s story for the selected perspective.</p></li><li><span>03</span><h4>Keep the view aligned</h4>${picture('suzhou-renderer.webp','The actual composite renderer interface')}<p>Synchronize painting, hotspots, progress and media.</p></li></ol></figure></details>`;
 case 'verse-results': {
  // Mean-bar heights read from the source plot, excluding error bars.
  // These are displayed to 0.1, not presented as raw study data.
  const measures=[
   ['Connecting ideas',3.0,4.7,'d = 2.29'],
   ['Interpreting imagery',3.2,4.7,'d = 1.91'],
   ['Completing the task',3.8,4.3,''],
   ['Comparing poems',3.8,4.2,''],
   ['Finding relevant poems',4.2,4.2,''],
   ['Ease of use',4.7,4.2,'']
  ];
  return `<figure class="project-figure rf-figure rf-verse-results" data-research-figure="${spec.kind}"><div class="rf-verse-chart-heading"><h3>Experience ratings</h3><div class="rf-verse-chart-legend"><span><i class="verse-key"></i>VerseColor</span><span><i class="souyun-key"></i>Souyun</span></div></div><div class="rf-verse-chart-axis" aria-hidden="true"><span></span><div>${[0,1,2,3,4,5,6].map(n=>`<span>${n}</span>`).join('')}</div></div><div class="rf-verse-rating-rows">${measures.map(([label,souyun,verse,effect])=>`<div class="rf-verse-rating-row"><div class="rf-verse-rating-label"><strong>${label}</strong>${effect?`<small>${effect}</small>`:''}</div><div class="rf-verse-bars"><div class="rf-verse-rating-bar verse-bar" aria-label="VerseColor estimated mean ${verse.toFixed(1)}"><span style="--rating-width:${verse/6*100}%"></span><b style="--rating-width:${verse/6*100}%">${verse.toFixed(1)}</b></div><div class="rf-verse-rating-bar souyun-bar" aria-label="Souyun estimated mean ${souyun.toFixed(1)}"><span style="--rating-width:${souyun/6*100}%"></span><b style="--rating-width:${souyun/6*100}%">${souyun.toFixed(1)}</b></div></div></div>`).join('')}</div><figcaption>Mean ratings read from the source figure, rounded to 0.1; error bars omitted. Reported effect sizes appear beside the two strongest differences.</figcaption></figure>`;
 }
 case 'verse-procedure': return `<figure class="project-figure rf-figure rf-verse-procedure" data-research-figure="${spec.kind}"><div class="rf-verse-phases"><section class="rf-verse-formative"><span class="rf-phase-label">Formative study</span><strong class="rf-phase-count">8 readers</strong><div><h4>Reader interviews</h4><p>Identify interpretive needs and shape the research questions.</p></div></section><section class="rf-verse-comparison"><span class="rf-phase-label">Comparative evaluation · 30 participants</span><ol><li><span>01</span><h4>Before reading</h4><p>Background and pre-test questionnaire</p></li><li><span>02</span><h4>Interpret color imagery</h4><div class="rf-tool-branches"><span>VerseColor</span><span>Souyun</span></div><p>Same tasks · 15 minutes</p></li><li><span>03</span><h4>Rate the experience</h4><p>Usability questionnaire</p></li><li><span>04</span><h4>Explain the experience</h4><p>Follow-up interview</p></li></ol></section></div></figure>`;
 default: return '';
 }
}
export function setupResearchFigures(root=document){
 setupGazeHierarchy(root);
 const personaCleanup=setupPersonaIntent(root);
 const figures=[...root.querySelectorAll('[data-research-figure]')];
 const frames=new Set(), reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function animateNumbers(el){
  if(reduced)return;
  el.querySelectorAll('[data-rf-number]').forEach(node=>{const value=Number(node.dataset.rfNumber),start=performance.now();let id;function step(now){frames.delete(id);if(!node.isConnected)return;const t=Math.min(1,(now-start)/750),ease=1-Math.pow(1-t,3);node.textContent=(value*ease).toFixed(1);if(t<1){id=requestAnimationFrame(step);frames.add(id);}}id=requestAnimationFrame(step);frames.add(id);});
 }
 function update(el,value){
  const kind=el.dataset.researchFigure, panel=el.querySelector('.rf-panel');
  if(!panel)return;
  el.dataset.rfSelected=value;const select=el.querySelector('[data-rf-select]');if(select)select.value=String(value);
  el.querySelectorAll('[data-rf-tab]').forEach(b=>{const active=b.dataset.rfTab===String(value);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
  panel.setAttribute('aria-labelledby',`${el.dataset.rfId}-${value}`);
  if(kind==='gaze-evidence'){panel.innerHTML=evidencePanel(Number(value));panel.scrollLeft=0;}
  if(kind==='suzhou-survey')panel.innerHTML=surveyPanel(value);
  if(kind==='suzhou-ratings')panel.innerHTML=ratingsPanel(value);
  if(el.classList.contains('rf-visible'))animateNumbers(el);
 }
 function click(e){const tab=e.target.closest('[data-rf-tab]');if(tab&&root.contains(tab)){update(tab.closest('[data-research-figure]'),tab.dataset.rfTab);}}
 function keydown(e){const tab=e.target.closest('[data-rf-tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const buttons=[...tab.parentElement.querySelectorAll('[data-rf-tab]')],i=buttons.indexOf(tab);const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;e.preventDefault();buttons[next].focus();update(tab.closest('[data-research-figure]'),buttons[next].dataset.rfTab);}
 function change(e){if(e.target.matches('[data-rf-select]'))update(e.target.closest('[data-research-figure]'),e.target.value);}
 root.addEventListener('click',click);root.addEventListener('keydown',keydown);root.addEventListener('change',change);
 let observer;
 if('IntersectionObserver' in window){observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('rf-visible');animateNumbers(entry.target);observer.unobserve(entry.target);}}),{threshold:.12});figures.forEach(f=>observer.observe(f));}else figures.forEach(f=>f.classList.add('rf-visible'));
 return()=>{personaCleanup();root.removeEventListener('click',click);root.removeEventListener('keydown',keydown);root.removeEventListener('change',change);observer?.disconnect();frames.forEach(cancelAnimationFrame);};
}

const RATINGS = [
  {
    "label": "Willing to use frequently",
    "group": "usability",
    "baseline": [
      0.28,
      0.4266667,
      0.5733333
    ],
    "scrollverse": [
      0.2933333,
      0.4533333,
      0.6133333
    ]
  },
  {
    "label": "Low perceived complexity",
    "group": "usability",
    "baseline": [
      0.3466667,
      0.48,
      0.6133333
    ],
    "scrollverse": [
      0.4,
      0.56,
      0.7066667
    ]
  },
  {
    "label": "Easy to use",
    "group": "usability",
    "baseline": [
      0.48,
      0.6,
      0.72
    ],
    "scrollverse": [
      0.4666667,
      0.6133333,
      0.7466667
    ]
  },
  {
    "label": "Low need for assistance",
    "group": "usability",
    "baseline": [
      0.3333333,
      0.5066667,
      0.6666667
    ],
    "scrollverse": [
      0.5733333,
      0.6933333,
      0.8133333
    ]
  },
  {
    "label": "Functions well integrated",
    "group": "usability",
    "baseline": [
      0.4133333,
      0.52,
      0.6266667
    ],
    "scrollverse": [
      0.44,
      0.6,
      0.7466667
    ]
  },
  {
    "label": "High system consistency",
    "group": "usability",
    "baseline": [
      0.3066667,
      0.4666667,
      0.6133333
    ],
    "scrollverse": [
      0.5066667,
      0.6533333,
      0.8
    ]
  },
  {
    "label": "Easy to learn",
    "group": "usability",
    "baseline": [
      0.52,
      0.64,
      0.76
    ],
    "scrollverse": [
      0.5066667,
      0.64,
      0.7733333
    ]
  },
  {
    "label": "Low perceived cumbersomeness",
    "group": "usability",
    "baseline": [
      0.4666667,
      0.5866667,
      0.7066667
    ],
    "scrollverse": [
      0.4533333,
      0.6,
      0.7333333
    ]
  },
  {
    "label": "Confident in use",
    "group": "usability",
    "baseline": [
      0.4266667,
      0.5466667,
      0.6666667
    ],
    "scrollverse": [
      0.5866667,
      0.7066667,
      0.8133333
    ]
  },
  {
    "label": "Low learning prerequisite",
    "group": "usability",
    "baseline": [
      0.32,
      0.48,
      0.6266667
    ],
    "scrollverse": [
      0.3733333,
      0.5466667,
      0.72
    ]
  },
  {
    "label": "Lower mental demand",
    "group": "workload",
    "baseline": [
      0.0933333,
      0.24,
      0.3866667
    ],
    "scrollverse": [
      0.1866667,
      0.3466667,
      0.5066667
    ]
  },
  {
    "label": "Lower time pressure",
    "group": "workload",
    "baseline": [
      0.2133333,
      0.3466667,
      0.48
    ],
    "scrollverse": [
      0.2933333,
      0.4666667,
      0.64
    ]
  },
  {
    "label": "Lower effort",
    "group": "workload",
    "baseline": [
      0.2266667,
      0.36,
      0.5066667
    ],
    "scrollverse": [
      0.28,
      0.4533333,
      0.6266667
    ]
  },
  {
    "label": "Lower frustration",
    "group": "workload",
    "baseline": [
      0.4266667,
      0.56,
      0.6933333
    ],
    "scrollverse": [
      0.4266667,
      0.6,
      0.76
    ]
  },
  {
    "label": "Sense of gradual unfolding",
    "group": "understanding",
    "baseline": [
      0.5063333,
      0.6266667,
      0.7466667
    ],
    "scrollverse": [
      0.64,
      0.7466667,
      0.8533333
    ]
  },
  {
    "label": "Viewing order and rhythm",
    "group": "understanding",
    "baseline": [
      0.4533333,
      0.6,
      0.7333333
    ],
    "scrollverse": [
      0.56,
      0.7066667,
      0.84
    ]
  },
  {
    "label": "Understanding spatial progression",
    "group": "understanding",
    "baseline": [
      0.48,
      0.6,
      0.72
    ],
    "scrollverse": [
      0.64,
      0.76,
      0.8533333
    ]
  },
  {
    "label": "Understanding historical value",
    "group": "understanding",
    "baseline": [
      0.4933333,
      0.6133333,
      0.7333333
    ],
    "scrollverse": [
      0.64,
      0.76,
      0.8666667
    ]
  },
  {
    "label": "Recommend / try similar experiences",
    "group": "engagement",
    "baseline": [
      0.56,
      0.6666667,
      0.7733333
    ],
    "scrollverse": [
      0.64,
      0.76,
      0.8666667
    ]
  }
];
