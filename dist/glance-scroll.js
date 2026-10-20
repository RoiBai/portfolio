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
// Six explanatory steps use the unchanged lesson frames in chronological order.
// The completed frame stays in place while its illustration, new nodes and
// retained context are considered separately.
const goalFrameForStep=[0,0,1,2,2,2];
const pill=i=>`<span class="dg-pill">DG ${String(i+1).padStart(2,'0')}</span>`;
const headphones=`<span class="headphone-symbol" aria-hidden="true">🎧︎</span>`;
const wave=`<span class="podcast-wave" aria-hidden="true">${[14,28,42,24,50,34,20,42,30,16,38,24].map((h,i)=>`<i style="--h:${h}px;--d:${i*.08}s"></i>`).join('')}</span>`;
const scrollCue=`<div class="walk-scroll-cue"><span>Keep scrolling</span><span class="walk-scroll-particles" aria-hidden="true">${[[0,-18],[0,-11],[0,-4],[0,3],[0,10],[-14,-4],[-7,3],[7,3],[14,-4]].map(([x,y],i)=>`<i style="--particle-x:${x}px;--particle-y:${y}px;--particle-delay:${i*.08}s"></i>`).join('')}</span></div>`;
const scenes=[
 {label:'WALK + LISTEN',quote:'“I’m following the explanation.”',heading:'Ideas arrive in sequence',body:'AR glasses + earbuds. The podcast builds <strong>one idea on the next</strong>.',aside:'Podcast keeps playing',detail:'Even when attention moves away.'},
 {label:'LOOK AWAY',quote:'“Is it safe to cross the road?”',heading:'Connections disappear',body:'Attention shifts to the road. <strong>The audio continues.</strong> Missed connections are hard to recover.',aside:'Reading takes attention',detail:'Full captions compete with watching the road.'},
 {label:'LOOK BACK',quote:'“How did the podcast get here?”',heading:'Context must be recovered',body:'He missed <strong>how the ideas connect</strong>. Now he must rejoin the current topic.',aside:'A glance needs a way back',detail:'Recover the connection, then follow the current explanation.'}
];
export function renderGlanceScroll(s,i){
 if(s.id==='problem')return `<section id="problem" class="case-section glance-walk-chapter"><div class="walk-scroll-track" data-walk-scroll><div class="walk-sticky"><div class="walk-story-heading">${title(s,i)}<p class="chapter-deck">AR glasses, a walking route, and a podcast that keeps playing</p></div><div class="walk-viewport"><div class="walk-map"><img class="walk-road" src="/assets/scroll-story/glance-road.svg" width="1340" height="1160" alt="The original winding walking route and pedestrian crossing"><div class="walk-traveller" aria-hidden="true">${['walker','walker-check','walker-return'].map((n,j)=>`<img data-pose="${j}" src="/assets/scroll-story/glance-${n}.svg" alt="">`).join('')}<div class="walk-listening" aria-hidden="true">${headphones}${wave}</div></div><img class="walk-signal" src="/assets/scroll-story/glance-signal.svg" alt="" aria-hidden="true"></div></div><div class="walk-narration">${scenes.map((s,j)=>`<article class="walk-scene" data-walk-scene="${j}" ${j?'aria-hidden="true"':''}><div class="walk-step-label"><span>0${j+1}</span>${s.label}</div><blockquote>${s.quote}</blockquote><h3>${s.heading}</h3><p>${s.body}</p><aside><h4>${s.aside}</h4><p>${s.detail}</p></aside></article>`).join('')}${scrollCue}<div class="walk-navigation" aria-label="Walking sequence">${scenes.map((s,j)=>`<button type="button" data-walk-jump="${j}" aria-label="${s.label}" ${j===0?'aria-current="step"':''}>0${j+1}</button>`).join('')}</div></div></div></div><aside class="glance-design-question"><span class="eyebrow">Design question</span><h3>Can relational structure become glanceable while walking?</h3><p>We asked how a visual structure could preserve an explanation after attention shifts—and what it would cost in visual attention, workload and gait.</p></aside></section>`;
 if(s.id==='process'&&s.rounds){
  const insights=['Words need connections','Avoid visual decoding','Focus needs context'];
  const examples=(r)=>r.figures.map((f,j)=>`<figure class="pilot-example"${r.id==='process-visuals'&&j===0?' data-workshop-target':''}><img src="${esc(f.src)}" alt="${esc(f.alt)}" width="${f.width}" height="${f.height}" loading="lazy" decoding="async"><figcaption><span>0${j+1}</span>${esc(f.caption)}</figcaption><p class="pilot-example-note">${esc(r.figureNotes?.[j]||'')}${r.id==='process-visuals'&&j===1?' <a class="pilot-source-link" href="https://doi.org/10.1145/3613904.3642514" target="_blank" rel="noopener noreferrer">AudioXtend ↗</a>':''}</p></figure>`).join('');
  const feedback=r=>r.quote?`<blockquote class="pilot-feedback">${esc(r.quote.text)}<cite>${esc(r.quote.attribution)}</cite></blockquote>`:'';
  const workshop=`<aside class="pilot-workshop" aria-labelledby="pilot-workshop-title"><span class="pilot-workshop-symbol" aria-hidden="true">✦</span><div><h3 id="pilot-workshop-title">Designer workshop <span>· 5 designers</span></h3><p>Could layout replace long sentences? Designers proposed spatial hierarchies and color-coded relationships; we tested them as <strong>Structured Keywords</strong>.</p></div></aside>`;
  const stageMarker=n=>`<span class="pilot-stage-mark" aria-hidden="true">${[0,1,2].map(j=>`<i${n===j?' class="is-current"':''}></i>`).join('')}</span>`;
  return `<section id="process" class="case-section glance-pilot-collection">${title(s,i)}<aside class="pilot-introduction"><p><strong>14 rounds of pilot studies</strong> and a <strong>designer workshop</strong> shaped the interface below.</p></aside>${s.rounds.map((r,n)=>`${n===1?workshop+'<svg class="pilot-workshop-connector" aria-hidden="true" focusable="false"><path/></svg>':''}<article id="pilot-round-${n+1}" class="glance-pilot pilot-round" aria-labelledby="pilot-round-title-${n+1}"><header class="pilot-round-heading">${stageMarker(n)}<div><h3 id="pilot-round-title-${n+1}"><span class="pilot-title-panel">${esc(r.nav)} <span class="pilot-count">${Number(r.pilotParticipants)} participants</span></span></h3><p>${esc(r.title)}</p></div></header><div class="pilot-gallery${r.figures.length===3?' pilot-gallery-three':''}">${examples(r)}</div>${n<2?feedback(r):`<div class="pilot-observation"><span class="pilot-insight-label">Observation</span><p class="pilot-history-note">${esc(r.historyNote)}</p></div>`}<div class="pilot-reasoning"><div class="pilot-insight"><span class="pilot-insight-label">Insight</span><h3>${insights[n]}</h3><p>${emphasize(r.body[0],r.highlights||[])}</p></div><div class="pilot-goals">${goals.slice(n*2,n*2+2).map((g,j)=>`<article data-cascade>${pill(n*2+j)}<h3>${g[0]}</h3><p>${g[1]}</p></article>`).join('')}</div></div></article>`).join('')}</section>`;
 }
 if(s.id==='goals'){
 const item=j=>`<article class="goal-callout goal-${j+1}${j===0?' is-visible is-current':''}" data-goal="${j}" aria-hidden="${j!==0}"${j===0?' aria-current="step"':''}>${pill(j)}<div><h3>${goals[j][0]}</h3></div></article>`;
 return `<section id="goals" class="case-section glance-goals-chapter"><div class="goals-scroll-track" data-goals-scroll><div class="goals-sticky"><div class="goals-story-heading">${title(s,i)}<p class="chapter-deck">${esc(s.deck||'Insights from 14 pilot rounds, brought together in GlanceMap')}</p></div><div class="goals-composition"><figure class="goal-interface"><img data-reentry-frame src="${reentryFrames[0].src}" width="2350" height="897" alt="${reentryFrames[0].alt}"></figure><svg class="goal-leaders" aria-hidden="true" focusable="false">${goals.map(()=>'<g class="goal-leader"><path/><circle r="2.5"/></g>').join('')}</svg>${goals.map((_,j)=>item(j)).join('')}</div>${scrollCue.replace('class="walk-scroll-cue"','class="walk-scroll-cue goals-scroll-cue"')}</div></div></section>`;
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
 // Endpoints sit beside the root phrase, root junction, familiar fork,
 // concrete illustration, newly revealed node and retained upper branch.
 const anchors=[[.019,.53],[.204,.535],[.215,.31],[.94,.42],[.60,.765],[.60,.025]];
 anchors.forEach(([ax,ay],i)=>{
  const label=goal.querySelector(`[data-goal="${i}"] h3`),r=label.getBoundingClientRect();
  const x=im.left-box.left+im.width*ax,y=im.top-box.top+im.height*ay;
  const left=r.left-box.left,right=r.right-box.left,top=r.top-box.top,bottom=r.bottom-box.top;
  let ex,ey,c1x,c1y,c2x,c2y;
  if(i===2||i===5){
   ex=Math.max(left+8,Math.min(right-8,x));ey=bottom+8;
   const bend=Math.max(20,Math.abs(y-ey)*.42);
   const bow=Math.abs(x-ex)<24?-24:0;
   c1x=ex+bow;c1y=ey+bend;c2x=x+bow;c2y=y-20;
  }else if(i===1||i===4){
   ex=Math.max(left+8,Math.min(right-8,x));ey=top-8;
   const bend=Math.max(20,Math.abs(y-ey)*.42);
   const bow=Math.abs(x-ex)<24?24:0;
   c1x=ex+bow;c1y=ey-bend;c2x=x+bow;c2y=y+20;
  }else{
   ex=i===0?right+8:left-8;ey=Math.max(top+4,Math.min(bottom-4,y));
   const dx=x-ex;
   c1x=ex+dx*.45;c1y=ey;c2x=x-dx*.2;c2y=y+(ey>y?10:-10);
  }
  const line=leaders.children[i];
  line.querySelector('path').setAttribute('d',`M ${ex} ${ey} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x} ${y}`);
  line.querySelector('circle').setAttribute('cx',x);line.querySelector('circle').setAttribute('cy',y);
  line.dataset.targetX=String(ax);line.dataset.targetY=String(ay);
 });}

 function update(){raf=0;if(walk){const plain=reduce.matches||short.matches,t=plain?0:progress(walk),stage=Math.min(2,Math.floor(t*3)),pos=point(t),traveller=walk.querySelector('.walk-traveller');walk.dataset.walkStage=String(stage);traveller.style.left=pos.x*100+'%';traveller.style.top=pos.y*100+'%';traveller.style.setProperty('--step-y',reduce.matches?'0px':Math.sin(t*90)*1.4+'px');walk.querySelectorAll('[data-pose]').forEach(n=>n.classList.toggle('is-active',+n.dataset.pose===stage));walk.querySelectorAll('[data-walk-scene]').forEach(n=>{const active=plain||+n.dataset.walkScene===stage;n.classList.toggle('is-active',active);n.setAttribute('aria-hidden',String(!active));});walk.querySelectorAll('[data-walk-jump]').forEach((n,i)=>{if(i===stage)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current')});// The crossing occupies the second quarter of the route. Sound stays present,
 // dims as attention turns to the signal, then returns after the crossing.
 const approach=clamp((t-.30)/.10),departure=clamp((t-.50)/.25),ease=v=>v*v*(3-2*v);
 const listeningOpacity=plain?1:1-.7*ease(approach)*(1-ease(departure));
 walk.querySelector('.walk-listening').style.opacity=String(listeningOpacity);}
 if(goal){const t=progress(goal),plain=reduce.matches||getComputedStyle(goal.firstElementChild).position!=='sticky',step=plain?5:Math.min(5,Math.floor(t*6)),stage=goalFrameForStep[step];
 goal.dataset.goalsShown=String(step+1);goal.dataset.goalStep=String(step);goal.dataset.reentryStage=String(stage);goal.dataset.staticGoals=String(plain);
 const frame=goal.querySelector('[data-reentry-frame]');if(frame.dataset.frame!==String(stage)){frame.src=reentryFrames[stage].src;frame.alt=reentryFrames[stage].alt;frame.dataset.frame=String(stage);}
 goal.querySelectorAll('[data-goal]').forEach(n=>{const i=Number(n.dataset.goal),visible=i<=step,current=!plain&&i===step;n.classList.toggle('is-visible',visible);n.classList.toggle('is-current',current);n.setAttribute('aria-hidden',String(!visible));if(current)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current');});
 goal.querySelectorAll('.goal-leader').forEach((n,i)=>{n.classList.toggle('is-visible',i<=step);n.classList.toggle('is-current',!plain&&i===step);});}

 }
 const cueObserver=walk?new IntersectionObserver(entries=>{walk.classList.toggle('walk-is-visible',entries[0].isIntersecting)},{threshold:.05}):null;
 if(cueObserver){cueObserver.observe(walk);cleanups.push(()=>cueObserver.disconnect());}
 const queue=()=>{if(!raf)raf=requestAnimationFrame(update)};
 const click=e=>{const button=e.target.closest('[data-walk-jump]');if(!button||!walk)return;const index=Number(button.dataset.walkJump),r=walk.getBoundingClientRect(),top=parseFloat(getComputedStyle(walk.firstElementChild).top)||90;window.scrollTo({top:scrollY+r.top-top+((index+.35)/3)*(r.height-walk.firstElementChild.offsetHeight),behavior:reduce.matches?'instant':'smooth'});};
 root.addEventListener('click',click);window.addEventListener('scroll',queue,{passive:true});const resize=new ResizeObserver(()=>{lines();queue()});[walk,goal,pilots,...(pilots?[pilots.querySelector('.pilot-workshop'),pilots.querySelector('[data-workshop-target] img')]:[]),...(goal?[goal.querySelector('.goals-composition'),goal.querySelector('.goal-interface img'),...goal.querySelectorAll('.goal-callout')]:[])].filter(Boolean).forEach(n=>resize.observe(n));window.addEventListener('resize',queue,{passive:true});reduce.addEventListener('change',queue);short.addEventListener('change',queue);lines();update();
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('has-entered',e.isIntersecting)),{threshold:.15});root.querySelectorAll('.pilot-goals [data-cascade]').forEach(n=>observer.observe(n));
 return()=>{cancelAnimationFrame(raf);resize.disconnect();observer.disconnect();root.removeEventListener('click',click);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);reduce.removeEventListener('change',queue);short.removeEventListener('change',queue);cleanups.forEach(f=>f())};
}
