import { emphasize } from './case-editorial.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title=(s,i)=>`<header class="section-heading"><div class="eyebrow${s.pilotParticipants?' pilot-heading-line':''}"><span>${String(i+1).padStart(2,'0')} / ${esc(s.nav)}</span>${s.pilotParticipants?` <strong class="pilot-count">${Number(s.pilotParticipants)} participants</strong>`:''}</div><h2>${esc(s.title)}</h2></header>`;
const goals=[
 ['Keep text brief','Short phrases, not full sentences.'],
 ['Keep ideas connected','Keep relationships visible.'],
 ['Use familiar structure','Parent–child links; no new code.'],
 ['Ground concrete ideas','Pictures for objects and scenes.'],
 ['Reveal with the audio','Add nodes as narration unfolds.'],
 ['Help learners return','Keep past branches readable.']
];
// The frames are consecutive original lesson assets, not a simulated gaze recording.
const reentryFrames=[
 {src:'/assets/glance-clarity/reentry-follow-original.png',alt:'Original lesson frame: the Distance Cost branch and close-range point, with earlier topics retained above'},
 {src:'/assets/glance-clarity/reentry-away-original.png',alt:'Next original lesson frame: the 2m and 5m point and increased arm fatigue appear on the same branch'},
 {src:'/assets/glance-clarity/final-interface-original.png',alt:'Original lesson frame: the current distance branch is bright green; earlier interface and advantage branches remain yellow-green'}
];
// Three actions explain the design; the six pilot goals remain cross-references.
const designActions=[
 {title:'Short labels, explicit links',body:'Brief phrases and parent–child links show how each idea belongs to the explanation.',goals:[0,1,2],anchor:[.41,.57]},
 {title:'Pictures with structure',body:'An illustration grounds the concrete idea; the map connects it to the lesson.',goals:[3],anchor:[.97,.48]},
 {title:'Reveal with audio. Retain history.',body:'New nodes follow the narration. Earlier branches stay readable when the learner looks back.',goals:[4,5],anchor:[.96,.13]}
];
const pill=i=>`<span class="dg-pill">DG ${String(i+1).padStart(2,'0')}</span>`;
const headphones=`<span class="headphone-symbol" aria-hidden="true">🎧︎</span>`;
const wave=`<span class="podcast-wave" aria-hidden="true">${[14,28,42,24,50,34,20,42,30,16,38,24].map((h,i)=>`<i style="--h:${h}px;--d:${i*.08}s"></i>`).join('')}</span>`;
const scrollCue=`<div class="walk-scroll-cue"><span>Keep scrolling</span><span class="walk-scroll-particles" aria-hidden="true">${[[0,-18],[0,-11],[0,-4],[0,3],[0,10],[-14,-4],[-7,3],[7,3],[14,-4]].map(([x,y],i)=>`<i style="--particle-x:${x}px;--particle-y:${y}px;--particle-delay:${i*.08}s"></i>`).join('')}</span></div>`;
const scenes=[
 {label:'Walk and listen',quote:'“I’m following the explanation.”',body:'Each idea builds on the last. Following the lesson means keeping <strong>their connections</strong> in mind.'},
 {label:'Look away',quote:'“Is it safe to cross the road?”',body:'Attention shifts to the crossing while the explanation moves on. <strong>Captions also compete with watching the road.</strong>'},
 {label:'Rejoin the lesson',quote:'“How did the podcast get here?”',body:'A listener may remember words but miss <strong>how the ideas connect</strong>—and needs that context to rejoin.'}
];
export function renderGlanceScroll(s,i){
 if(s.id==='problem')return `<section id="problem" class="case-section glance-walk-chapter walk-simplified"><div class="walk-scroll-track" data-walk-scroll><div class="walk-sticky"><div class="walk-story-heading">${title(s,i)}</div><div class="walk-viewport"><div class="walk-map"><img class="walk-road" src="/assets/scroll-story/glance-road.svg" width="1340" height="1160" alt="The original winding walking route and pedestrian crossing"><div class="walk-traveller" aria-hidden="true">${['walker','walker-check','walker-return'].map((n,j)=>`<img data-pose="${j}" src="/assets/scroll-story/glance-${n}.svg" alt="">`).join('')}<div class="walk-listening" aria-hidden="true">${headphones}${wave}</div></div><img class="walk-signal" src="/assets/scroll-story/glance-signal.svg" alt="" aria-hidden="true"></div></div><div class="walk-narration"><p class="walk-audio-status"><span aria-hidden="true"><i></i><i></i><i></i></span>Audio keeps playing</p>${scenes.map((s,j)=>`<article class="walk-scene" data-walk-scene="${j}" ${j?'aria-hidden="true"':''}><blockquote>${s.quote}</blockquote><p>${s.body}</p></article>`).join('')}${scrollCue}<div class="walk-navigation" aria-label="Walking sequence">${scenes.map((s,j)=>`<button type="button" data-walk-jump="${j}" aria-label="${s.label}" ${j===0?'aria-current="step"':''}>0${j+1}</button>`).join('')}</div></div></div></div><aside class="glance-design-question"><span class="eyebrow">Design question</span><h3>Can relational structure become glanceable while walking?</h3><p>We asked how a visual structure could preserve an explanation after attention shifts—and what it would cost in visual attention, workload and gait.</p></aside></section>`;
 if(s.id==='process'&&s.rounds){
  const examples=(r)=>r.figures.map((f,j)=>`<figure class="pilot-example"${r.id==='process-visuals'&&j===0?' data-workshop-target':''}><img src="${esc(f.src)}" alt="${esc(f.alt)}" width="${f.width}" height="${f.height}" loading="lazy" decoding="async"><figcaption><span>0${j+1}</span>${esc(f.caption)}</figcaption><p class="pilot-example-note">${esc(r.figureNotes?.[j]||'')}${r.id==='process-visuals'&&j===1?' <a class="pilot-source-link" href="https://doi.org/10.1145/3613904.3642514" target="_blank" rel="noopener noreferrer">AudioXtend ↗</a>':''}</p></figure>`).join('');
  const feedback=r=>r.quote?`<blockquote class="pilot-feedback"><p>${esc(r.quote.excerpt||r.quote.text)}</p>${r.quote.remainder?`<details class="pilot-quote-more"><summary>Read the rest of the feedback</summary><p>${esc(r.quote.remainder)}</p></details>`:''}<cite>${esc(r.quote.attribution)}</cite></blockquote>`:'';
  const workshop=`<aside class="pilot-workshop" aria-labelledby="pilot-workshop-title"><span class="pilot-workshop-symbol" aria-hidden="true">✦</span><div><h3 id="pilot-workshop-title">Designer workshop <span>· 5 designers</span></h3><p>Could layout replace long sentences? Designers proposed spatial hierarchies and color-coded relationships; we tested them as <strong>Structured Keywords</strong>.</p></div></aside>`;
  const stageMarker=n=>`<span class="pilot-stage-mark" aria-hidden="true">${[0,1,2].map(j=>`<i${n===j?' class="is-current"':''}></i>`).join('')}</span>`;
  return `<section id="process" class="case-section glance-pilot-collection">${title(s,i)}<aside class="pilot-introduction"><p><strong>14 rounds of pilot studies</strong> and a <strong>designer workshop</strong> shaped the interface below.</p></aside>${s.rounds.map((r,n)=>`${n===1?workshop+'<svg class="pilot-workshop-connector" aria-hidden="true" focusable="false"><path/></svg>':''}<article id="pilot-round-${n+1}" class="glance-pilot pilot-round" aria-labelledby="pilot-round-title-${n+1}"><header class="pilot-round-heading">${stageMarker(n)}<div><h3 id="pilot-round-title-${n+1}"><span class="pilot-title-panel">${esc(r.nav)} <span class="pilot-count">${Number(r.pilotParticipants)} participants</span></span></h3><p>${esc(r.title)}</p></div></header><div class="pilot-gallery${r.figures.length===3?' pilot-gallery-three':''}">${examples(r)}</div>${n<2?feedback(r):`<div class="pilot-observation"><span class="pilot-insight-label">Observation</span><p class="pilot-history-note">${esc(r.historyNote)}</p></div>`}<div class="pilot-reasoning"><div class="pilot-insight"><span class="pilot-insight-label">Insight</span><p>${emphasize(r.body[0],r.highlights||[])}</p></div><div class="pilot-goals">${goals.slice(n*2,n*2+2).map((g,j)=>`<article>${pill(n*2+j)}<h3>${g[0]}</h3></article>`).join('')}</div></div></article>`).join('')}</section>`;
 }
 if(s.id==='goals'){
  const actionCopy=(a,j)=>`<div class="design-action-references">${a.goals.map(pill).join('')}</div><h3>${a.title}</h3><p>${a.body}</p>`;
  const fallbackFrame=[0,2,2];
  const item=(a,j)=>`<article class="design-action${j===0?' is-current':''}" data-goal="${j}" aria-hidden="${j!==0}"${j===0?' aria-current="step"':''}>${actionCopy(a,j)}</article>`;
  return `<section id="goals" class="case-section glance-goals-chapter goals-three-actions"><div class="goals-scroll-track" data-goals-scroll><div class="goals-sticky"><div class="goals-story-heading">${title(s,i)}<p class="chapter-deck">${esc(s.deck||'Three design actions bring the pilot insights together.')}</p></div><div class="goals-composition"><figure class="goal-interface"><img data-reentry-frame src="${reentryFrames[0].src}" width="2350" height="897" alt="${reentryFrames[0].alt}"><figcaption class="design-frame-progress" aria-hidden="true"></figcaption></figure><div class="design-action-stack">${designActions.map(item).join('')}</div><svg class="goal-leaders" aria-hidden="true" focusable="false">${designActions.map(()=>'<g class="goal-leader"><path/><circle r="2.5"/></g>').join('')}</svg></div><div class="design-action-footer"><div class="design-action-navigation" aria-label="Design actions">${designActions.map((a,j)=>`<button type="button" data-goal-jump="${j}" aria-label="${esc(a.title)}"${j===0?' aria-current="step"':''}>0${j+1}</button>`).join('')}</div>${scrollCue.replace('class="walk-scroll-cue"','class="walk-scroll-cue goals-scroll-cue"')}</div><div class="design-action-sequence">${designActions.map((a,j)=>`<article><figure><img src="${reentryFrames[fallbackFrame[j]].src}" alt="${reentryFrames[fallbackFrame[j]].alt}" width="2350" height="897" loading="lazy" decoding="async"></figure><div>${actionCopy(a,j)}</div></article>`).join('')}</div></div></div></section>`;
 }

 return null;
}
export function setupGlanceScroll(root){
 const walk=root.querySelector('[data-walk-scroll]'),goal=root.querySelector('[data-goals-scroll]'),pilots=root.querySelector('#process');if(!walk&&!goal)return()=>{};
 if(goal)reentryFrames.forEach(f=>{const img=new Image();img.src=f.src;});
 const reduce=matchMedia('(prefers-reduced-motion:reduce)'),short=matchMedia('(min-width:701px) and (max-height:650px)'),cleanups=[];let raf=0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 const progress=el=>{const r=el.getBoundingClientRect();const top=parseFloat(getComputedStyle(el.firstElementChild).top)||90;return clamp((top-r.top)/Math.max(1,r.height-el.firstElementChild.offsetHeight));};
 function point(t){const pts=[[.31,.27],[.41,.40],[.48,.51],[.62,.69],[.77,.90]];const seg=Math.min(3,Math.floor(t*4)),u=t*4-seg;return{x:pts[seg][0]+(pts[seg+1][0]-pts[seg][0])*u,y:pts[seg][1]+(pts[seg+1][1]-pts[seg][1])*u};}
 function lines(){
  const connector=pilots?.querySelector('.pilot-workshop-connector'),source=pilots?.querySelector('#pilot-workshop-title'),target=pilots?.querySelector('[data-workshop-target] img');
  if(connector&&source&&target){
   const box=pilots.getBoundingClientRect(),from=source.getBoundingClientRect(),panel=source.closest('.pilot-workshop').getBoundingClientRect(),to=target.getBoundingClientRect();
   const sx=panel.left-box.left-4,sy=from.top-box.top+from.height/2,tx=to.left-box.left+6,ty=to.top-box.top+6;
   const lane=Math.max(6-box.left,panel.left-box.left-(innerWidth<=700?16:26));
   connector.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
   connector.querySelector('path').setAttribute('d',`M ${sx} ${sy} H ${lane} V ${ty} H ${tx}`);
  }
  if(!goal)return;const box=goal.querySelector('.goals-composition').getBoundingClientRect(),im=goal.querySelector('.goal-interface img').getBoundingClientRect(),leaders=goal.querySelector('.goal-leaders');
 if(!box.width||!box.height)return;
 leaders.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
 // Curved leaders join the active explanation to its relevant source region.
 designActions.forEach(({anchor:[ax,ay]},i)=>{
  const label=goal.querySelector(`[data-goal="${i}"] h3`),r=label.getBoundingClientRect();
  const x=im.left-box.left+im.width*ax,y=im.top-box.top+im.height*ay;
  const ex=r.left-box.left-10,ey=r.top-box.top+r.height/2;
  const bend=Math.max(24,(ex-x)*.30),line=leaders.children[i];
  const path=i===0?`M ${ex} ${ey} C ${ex-130} ${ey+75}, ${x+110} ${y+60}, ${x} ${y}`:`M ${ex} ${ey} C ${ex-bend} ${ey+35}, ${x+bend} ${y-20}, ${x} ${y}`;
  line.querySelector('path').setAttribute('d',path);
  line.querySelector('circle').setAttribute('cx',x);line.querySelector('circle').setAttribute('cy',y);
 });}

 function update(){raf=0;if(walk){const plain=reduce.matches||short.matches,t=plain?0:progress(walk),stage=Math.min(2,Math.floor(t*3)),pos=point(t),traveller=walk.querySelector('.walk-traveller');walk.dataset.walkStage=String(stage);traveller.style.left=pos.x*100+'%';traveller.style.top=pos.y*100+'%';traveller.style.setProperty('--step-y',reduce.matches?'0px':Math.sin(t*90)*1.4+'px');walk.querySelectorAll('[data-pose]').forEach(n=>n.classList.toggle('is-active',+n.dataset.pose===stage));walk.querySelectorAll('[data-walk-scene]').forEach(n=>{const active=plain||+n.dataset.walkScene===stage;n.classList.toggle('is-active',active);n.setAttribute('aria-hidden',String(!active));});walk.querySelectorAll('[data-walk-jump]').forEach((n,i)=>{if(i===stage)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current')});// The crossing occupies the second quarter of the route. Sound stays present,
 // dims as attention turns to the signal, then returns after the crossing.
 const approach=clamp((t-.30)/.10),departure=clamp((t-.50)/.25),ease=v=>v*v*(3-2*v);
 const listeningOpacity=plain?1:1-.7*ease(approach)*(1-ease(departure));
 walk.querySelector('.walk-listening').style.opacity=String(listeningOpacity);}
 if(goal){const t=progress(goal),plain=reduce.matches||getComputedStyle(goal.firstElementChild).position!=='sticky',step=plain?2:Math.min(2,Math.floor(t*3));
 goal.dataset.goalsShown=String(step+1);goal.dataset.goalStep=String(step);goal.dataset.reentryStage=String(step);goal.dataset.staticGoals=String(plain);
 const frameStage=plain?2:step===0?0:step===1?2:Math.max(0,Math.min(2,Math.floor((t*3-2)*3)));
 const frame=goal.querySelector('[data-reentry-frame]');if(frame.dataset.frame!==String(frameStage)){frame.src=reentryFrames[frameStage].src;frame.alt=reentryFrames[frameStage].alt;frame.dataset.frame=String(frameStage);}
 const frameProgress=goal.querySelector('.design-frame-progress');frameProgress.textContent=step===2?`With narration · ${frameStage+1} / 3`:'';frameProgress.style.visibility=step===2?'visible':'hidden';
 goal.querySelectorAll('[data-goal]').forEach(n=>{const current=!plain&&Number(n.dataset.goal)===step;n.classList.toggle('is-current',current);n.setAttribute('aria-hidden',String(!current));if(current)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current');});
 goal.querySelectorAll('.goal-leader').forEach((n,i)=>{n.classList.toggle('is-visible',!plain&&i===step);n.classList.toggle('is-current',!plain&&i===step);});
 goal.querySelectorAll('[data-goal-jump]').forEach((n,i)=>{if(i===step)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current');});}


 }
 const cueObserver=walk?new IntersectionObserver(entries=>{walk.classList.toggle('walk-is-visible',entries[0].isIntersecting)},{threshold:.05}):null;
 if(cueObserver){cueObserver.observe(walk);cleanups.push(()=>cueObserver.disconnect());}
 const queue=()=>{if(!raf)raf=requestAnimationFrame(update)};
 const click=e=>{const button=e.target.closest('[data-walk-jump],[data-goal-jump]');if(!button)return;const isGoal=button.hasAttribute('data-goal-jump'),track=isGoal?goal:walk;if(!track)return;const index=Number(isGoal?button.dataset.goalJump:button.dataset.walkJump),r=track.getBoundingClientRect(),top=parseFloat(getComputedStyle(track.firstElementChild).top)||90;window.scrollTo({top:scrollY+r.top-top+((index+.35)/3)*(r.height-track.firstElementChild.offsetHeight),behavior:reduce.matches?'instant':'smooth'});};
 root.addEventListener('click',click);window.addEventListener('scroll',queue,{passive:true});const resize=new ResizeObserver(()=>{lines();queue()});[walk,goal,pilots,...(pilots?[pilots.querySelector('.pilot-workshop'),pilots.querySelector('[data-workshop-target] img')]:[]),...(goal?[goal.querySelector('.goals-composition'),goal.querySelector('.goal-interface img'),...goal.querySelectorAll('.design-action')]:[])].filter(Boolean).forEach(n=>resize.observe(n));window.addEventListener('resize',queue,{passive:true});reduce.addEventListener('change',queue);short.addEventListener('change',queue);lines();update();
 return()=>{cancelAnimationFrame(raf);resize.disconnect();root.removeEventListener('click',click);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);reduce.removeEventListener('change',queue);short.removeEventListener('change',queue);cleanups.forEach(f=>f())};
}
