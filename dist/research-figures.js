import { siteURL } from './site-paths.js';
import { replacementFor } from './data-viz.js';
import { setupPersonaIntent } from './research-interactions.js';
// Original paper images and HTML/CSS web figures. See assets/research-interactive/sources.json.
// Rating coordinates come directly from PDF vector objects, not a screenshot or estimated raw data.
const ASSET = '/assets/research-interactive/';
let sequence = 0;
const esc = (s='') => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const picture=(src,alt,extra='')=>`<img src="${siteURL(ASSET+src)}" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}>`;
const art = [
 {name:'The Stonemason’s Yard',type:'Cityscape',file:1},
 {name:'Paris Street, Rainy Day',type:'Everyday life',file:2},
 {name:'Liberty Leading the People',type:'Historical scene',file:3}
];
const paintings=['Paris Street, Rainy Day','The Stonemason’s Yard','The Wedding at Cana','The Peasant Wedding','The Hay Wain'];
const groups=[['understanding','Context'],['usability','Usability'],['workload','Workload'],['engagement','Engagement']];
const survey = {
 needs:[['Hard to compare sections',61.8],['Want close-up exploration',85.3],['Want clearer spatial positioning',80.6],['Viewing is mostly passive',78.5],['Social perspectives encourage exploration',82.7],['Limited background affects viewing',64.9]],
 functions:[['Role-based interpretation',77],['High-resolution detail exploration',70.7],['Dynamic scene activation',63.4],['Layered knowledge content',51.3],['Spatial progress navigation',47.6],['Virtual guide / NPC dialogue',40.3],['Knowledge quiz / interactive game',28.8]]
};
function tabs(id, items, selected) {
 return `<div class="rf-tabs" role="tablist" aria-label="Choose a view">${items.map(([key,label])=>`<button type="button" role="tab" id="${id}-${key}" aria-controls="${id}-panel" aria-selected="${String(key)===String(selected)}" tabindex="${String(key)===String(selected)?0:-1}" data-rf-tab="${key}">${esc(label)}</button>`).join('')}</div>`;
}
function note(title,body){return `<figcaption class="rf-caption"><strong>${esc(title)}</strong><p>${esc(body)}</p></figcaption>`;}
function artworkPanel(selected=0, mode='original'){
 const a=art[selected];return `<div class="rf-art-stage">${picture(`gaze-art-${a.file}-${mode}.${mode==='original'?'jpg':'png'}`,`${a.name}${mode==='regions'?' with the study’s semantic regions':''}`)}</div><div class="rf-art-meta"><p><strong>${a.name}</strong><span>${a.type} · One of 24 study paintings</span></p><button type="button" class="rf-toggle" data-rf-regions aria-pressed="${mode==='regions'}">${mode==='regions'?'Hide regions':'Show study regions'} <span aria-hidden="true">${mode==='regions'?'−':'+'}</span></button></div>`;
}
function evidencePanel(selected=0){
 const terms=[['heatmap','Gaze density'],['scanpath','Eye path'],['regions','Region map']];
 return `<div class="rf-evidence-grid">${terms.map(([key,label])=>`<div class="rf-evidence-item">${picture(`gaze-${Number(selected)+1}-${key}.webp`,`${paintings[selected]}: ${key}`)}<h4>${esc(label)}</h4><p>${key==='heatmap'?'Heatmap':key==='scanpath'?'Scanpath':'5–7 areas'}</p></div>`).join('')}</div>`;
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
  ['Gaze','gaze','Looked longer, with supporting eye-movement measures.','Did not meet the study’s High gaze threshold.'],
  ['Selection','selection','Named the region as important when explaining the painting.','Did not name the region as important in later recall.'],
  ['Language','language','Used the region to explain the painting: “The smoke suggests war.”','Did not mention it, or only described it: “There is smoke.”']
 ];
 return `<figure class="project-figure rf-figure rf-gaze-signals" data-research-figure="gaze-signals"><div class="rf-signal-columns">${signals.map(([name,key,high,low],i)=>`<section data-signal="${key}"><h4>${name}</h4><dl>${[['High',high],['Low',low]].map(([level,description],j)=>{const selected=i===0?j===0:j===1;return `<div class="rf-signal-cell${selected?' is-hll-component':''}" data-signal-level="${level.toLowerCase()}"${selected?' data-hll-selected="true"':''}><dt><b>${level[0]}</b><span>${level}</span>${selected?'<span class="sr-only"> — part of HLL</span>':''}</dt><dd>${description}</dd></div>`;}).join('')}</dl></section>`).join('')}</div><figcaption class="rf-gsl-hll"><strong>HLL</strong><div><h4>Looking is not the same as interpreting</h4><p>The viewer looked closely, but did not choose the region as important or use it to interpret the painting.</p><small>Low Language may include a literal description. HLL alone does not imply poor understanding.</small><details class="rf-gaze-coding"><summary>How High gaze was coded</summary><p>Total fixation time exceeded the mean across regions in the same trial, and at least two additional eye-movement measures met their High criterion. This is a coding rule, not a direct measure of interest.</p></details></div></figcaption></figure>`;
}
function personaOpening(image){
 const scenes=[
  ['Ask for a day off','You’re a PhD student. AI writes:','“I am writing to formally request…”','Too formal for someone you know.'],
  ['Set the relationship','Familiar supervisor. Polite, appreciative and brief.','“Could I take today off? Thank you for understanding.”',''],
  ['Keep your style','Next request: miss a morning meeting.','','Change the facts; keep the relationship and tone.']
 ];
 return `<figure class="project-figure rf-figure rf-persona-opening" data-research-figure="persona-opening"><img class="rf-persona-comic" src="${siteURL(image||'/assets/research-interactive/persona-example-comic.png')}" width="1881" height="836" alt="A PhD student struggles with formal AI emails, defines a familiar supervisor relationship, then reuses the same writing style"><figcaption class="rf-persona-scenes">${scenes.map(([title,body,quote,after],i)=>`<div><span>0${i+1}</span><h4>${title}</h4><p>${body}</p>${quote?`<p class="persona-hero-quote ${i===0?'is-generic':'is-personal'}">${quote}</p>`:''}${after?`<p>${after}</p>`:''}${i===2?'<a class="persona-hero-try" href="#interaction">Try the example ↓</a>':''}</div>`).join('')}</figcaption></figure>`;
}
function compactSuzhouStudy(kind){
 const data=replacementFor('suzhou-scrollverse','study','/assets/fig4-study-results-bc437b38.webp');
 return `<figure class="project-figure rf-figure rf-suzhou-study" data-research-figure="${kind}"><div class="rf-study-comparisons">${data.panels.slice(0,2).map((panel,i)=>`<section><h4>${panel.title}</h4><p class="rf-study-unit">${i===0?'SUS score · 0–100':'Workload rating · 0–5'}</p>${panel.rows.map((r,j)=>`<div class="rf-study-bar"><div><span>${r.label}</span><strong>${r.display}</strong></div><div class="rf-bar-track"><span style="--rf-value:${r.value/panel.max*100}%;--rf-order:${j};background:${j===0?'var(--rf-brown)':'var(--rf-blue)'}"></span></div></div>`).join('')}<p class="rf-study-reading">${i===0?'Usability was rated higher, but the difference was not statistically significant (p = .294).':'Workload was rated lower, but the difference was not statistically significant (p = .359).'}</p></section>`).join('')}</div><div class="rf-study-reports">${data.panels[2].rows.map((r,i)=>`<div><strong>${r.value}<small> / 30</small></strong><p>${i===0?'reported clearer understanding of Qing-dynasty urban life':'would recommend ScrollVerse or try a similar experience'}</p></div>`).join('')}</div><p class="rf-chart-note">30 participants per condition. These are participants’ reports, not a knowledge test. The study did not establish a clear usability or workload difference.</p></figure>`;
}
export function renderResearchFigure(spec={}){
 const id=`research-figure-${++sequence}`;
 switch(spec.kind){
 case 'persona-opening': return personaOpening(spec.image);
 case 'gaze-artwork': return tabFigure(spec.kind,id,'The same painting, three sources of evidence','Eye movements, selected regions, and explanations are compared within the same painted detail.',art.map((a,i)=>[i,a.type]),0,artworkPanel());
 case 'gaze-evidence': return tabFigure(spec.kind,id,'Compare the evidence','Choose a painting to compare heatmaps, eye movement paths, and the regions used in the analysis.',paintings.map((a,i)=>[i,a]),0,evidencePanel(),`<label class="rf-mobile-choice" for="${id}-select">Choose a painting<select id="${id}-select" data-rf-select>${paintings.map((name,i)=>`<option value="${i}">${name}</option>`).join('')}</select></label>`);
 case 'gaze-procedure': return `<figure class="project-figure rf-figure rf-method-source" data-research-figure="${spec.kind}"><p class="rf-method-context">Nine-point calibration → 24 self-paced painting trials</p><ol class="rf-method-source-steps">${[
 ['Look','View the painting freely. Click when an initial interpretation has formed.'],
 ['Recall','With the screen blank, name the regions that mattered to your understanding.'],
 ['Explain','Describe what the painting means. The response is recorded for coding.']
 ].map(([title,body],i)=>`<li>${picture('gaze-signal-'+(i+1)+'.webp',title+' scene from the original study procedure')}<div><span>0${i+1}</span><h4>${title}</h4><p>${body}</p></div></li>`).join('')}</ol><p class="rf-method-context rf-method-after">After all trials → questionnaire and interview</p></figure>`;
 case 'gaze-signals': return gazeSignalMatrix();
 case 'gaze-composition': return `<figure class="project-figure rf-figure" data-research-figure="${spec.kind}"><div class="rf-composition-grid">${[
 ['The Peasant Wedding','Diagonal composition','Piper and guests entering through the doorway'],
 ['The Stonemason’s Yard','Spatial depth','Church and buildings on the opposite bank'],
 ['Paris Street, Rainy Day','Perspective transition','Approaching pedestrians and umbrellas']
 ].map(([name,label,body],i)=>`<div>${picture(`gaze-composition-${i+1}.webp`,`${name}: highlighted HLL region and compositional lines`)}<h4>${label}</h4><p>${body}</p></div>`).join('')}</div>${note('Three selected composition examples','Red outlines identify the focal HLL regions. These selected examples suggest where mismatches can appear; they are not a rule for every painting.')}</figure>`;
 case 'suzhou-survey': return tabFigure(spec.kind,id,'What viewers wanted','Selected needs and barriers, alongside all seven preferred functions reported in the formative survey.',[['needs','Needs & barriers'],['functions','Preferred functions']],'needs',surveyPanel());
 case 'suzhou-ratings': return tabFigure(spec.kind,id,'Four dimensions of the experience','Compare average ratings in four areas. Each line shows the range of uncertainty around an average.',groups,'understanding',ratingsPanel(),'<div class="rf-legend"><span class="rf-key-baseline">Baseline</span><span class="rf-key-scrollverse">ScrollVerse</span></div>');
 case 'suzhou-experience': return `<figure class="project-figure rf-figure rf-suzhou-experience" data-research-figure="${spec.kind}"><div class="rf-suzhou-three">${[
 ['suzhou-scroll.png','Follow the handscroll','Eight core scenes and twelve contextual videos keep the painting continuous.'],
 ['suzhou-perspectives.png','Choose a perspective','Read the city through a commoner, scholar or merchant.'],
 ['suzhou-cultural-clues.png','Find a cultural clue','Observe details, locate them in the scroll, then uncover their context.']
 ].map(([file,title,caption])=>`<figure><img src="${siteURL('/assets/research-editorial/'+file)}" alt="${title}: original system module" loading="lazy"><figcaption><strong>${title}</strong><p>${caption}</p></figcaption></figure>`).join('')}</div><p class="rf-suzhou-summary">ScrollVerse brings <strong>sequential unfolding, social perspectives and painted evidence</strong> into one experience. Each reading returns to a detail in the original scroll.</p></figure>`;
 case 'suzhou-study': return compactSuzhouStudy(spec.kind);
 case 'suzhou-runtime': return `<figure class="project-figure rf-figure rf-runtime" data-research-figure="${spec.kind}"><ol class="rf-runtime-flow"><li><span>01</span><h4>Load the visible area</h4>${picture('suzhou-tiles.webp','Visible and prefetched scroll tiles from the original pipeline figure')}<p>The scroll position determines which tiles load, with nearby sections kept ready.</p></li><li><span>02</span><h4>Find the scene and role</h4>${picture('suzhou-scene.webp','An indexed scene in the scroll')}<p>The visible scene and selected role retrieve the matching story records.</p></li><li><span>03</span><h4>Update the view</h4>${picture('suzhou-renderer.webp','The actual composite renderer interface')}<p>The painting, hotspots, progress marker and media stay aligned.</p></li></ol><p class="rf-method-context">Ten image tiles · scene coordinates · role records · linked videos</p></figure>`;
 case 'verse-procedure': return `<figure class="project-figure rf-figure rf-verse-procedure" data-research-figure="${spec.kind}"><div class="rf-verse-phases"><div class="rf-verse-formative"><span class="rf-phase-label">Formative study</span><h4>Reader interviews</h4><strong class="rf-phase-count">8 readers</strong><p>Identify interpretive needs and shape the research questions.</p></div><div class="rf-verse-comparison"><span class="rf-phase-label">Comparative evaluation · 30 participants</span><ol><li><span>01</span><h4>Before reading</h4><p>Background and pre-test questionnaire</p></li><li><span>02</span><h4>Interpret color imagery</h4><div class="rf-tool-branches"><span>VerseColor</span><span>Souyun</span></div><p>Same tasks · 15 minutes</p></li><li><span>03</span><h4>Rate the experience</h4><p>Usability questionnaire</p></li><li><span>04</span><h4>Explain the experience</h4><p>Follow-up interview</p></li></ol></div></div><p class="rf-chart-note">The original two-phase study flow, rebuilt for the web. Participant count follows the current portfolio.</p></figure>`;
 default: return '';
 }
}
export function setupResearchFigures(root=document){
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
  if(kind==='gaze-artwork')panel.innerHTML=artworkPanel(Number(value),el.dataset.rfMode);
  if(kind==='gaze-evidence')panel.innerHTML=evidencePanel(Number(value));
  if(kind==='suzhou-survey')panel.innerHTML=surveyPanel(value);
  if(kind==='suzhou-ratings')panel.innerHTML=ratingsPanel(value);
  if(el.classList.contains('rf-visible'))animateNumbers(el);
 }
 function click(e){const tab=e.target.closest('[data-rf-tab]');if(tab&&root.contains(tab)){update(tab.closest('[data-research-figure]'),tab.dataset.rfTab);return;}const button=e.target.closest('[data-rf-regions]');if(button&&root.contains(button)){const el=button.closest('[data-research-figure]');el.dataset.rfMode=el.dataset.rfMode==='regions'?'original':'regions';update(el,el.dataset.rfSelected);el.querySelector('[data-rf-regions]').focus({preventScroll:true});}}
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
