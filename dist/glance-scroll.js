import { emphasize } from './case-editorial.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title=(s,i)=>`<header class="section-heading"><div class="eyebrow">${String(i+1).padStart(2,'0')} / ${esc(s.nav)}</div><h2>${esc(s.title)}</h2></header>`;
const goals=[
 ['Keep text brief','Short phrases, not full sentences.'],
 ['Keep ideas connected','Keep relationships visible.'],
 ['Use familiar structure','Parent–child links; no new code.'],
 ['Ground concrete ideas','Pictures for objects and scenes.'],
 ['Reveal with the audio','Add nodes as narration unfolds.'],
 ['Help learners return','Keep past branches readable.']
];
const pill=i=>`<span class="dg-pill">DG ${String(i+1).padStart(2,'0')}</span>`;
const headphones=`<span class="headphone-symbol" aria-hidden="true">🎧︎</span>`;
const wave=`<span class="podcast-wave" aria-hidden="true">${[14,28,42,24,50,34,20,42,30,16,38,24].map((h,i)=>`<i style="--h:${h}px;--d:${i*.08}s"></i>`).join('')}</span>`;
const scenes=[
 {label:'WALK + LISTEN',quote:'“I’m following the explanation.”',heading:'Ideas arrive in sequence',body:'AR glasses + earbuds. The podcast builds <strong>one idea on the next</strong>.',aside:'Podcast keeps playing',detail:'Even when attention moves away.'},
 {label:'LOOK AWAY',quote:'“Is it safe to cross the road?”',heading:'Connections disappear',body:'Attention shifts to the road. <strong>The audio continues.</strong> Causes, conditions and comparisons are hard to recover after the audio moves on.',aside:'Reading takes attention',detail:'Full captions compete with watching the road.'},
 {label:'LOOK BACK',quote:'“How did the podcast get here?”',heading:'Context must be recovered',body:'He missed <strong>how the ideas connect</strong>. Now he must rejoin the current topic.',aside:'A glance needs a way back',detail:'Recover the connection, then follow the current explanation.'}
];
export function renderGlanceScroll(s,i){
 if(s.id==='problem')return `<section id="problem" class="case-section glance-walk-chapter"><div class="walk-scroll-track" data-walk-scroll><div class="walk-sticky"><div class="walk-story-heading">${title(s,i)}<p class="chapter-deck">AR glasses, a walking route, and a podcast that keeps playing</p></div><div class="walk-viewport"><div class="walk-map"><img class="walk-road" src="/assets/scroll-story/glance-road.svg" width="1340" height="1160" alt="The original winding walking route and pedestrian crossing"><div class="walk-traveller" aria-hidden="true">${['walker','walker-check','walker-return'].map((n,j)=>`<img data-pose="${j}" src="/assets/scroll-story/glance-${n}.svg" alt="">`).join('')}</div><div class="walk-listening" aria-hidden="true">${headphones}${wave}</div><img class="walk-signal" src="/assets/scroll-story/glance-signal.svg" alt="" aria-hidden="true"></div></div><div class="walk-narration">${scenes.map((s,j)=>`<article class="walk-scene" data-walk-scene="${j}" ${j?'aria-hidden="true"':''}><div class="walk-step-label"><span>0${j+1}</span>${s.label}</div><blockquote>${s.quote}</blockquote><h3>${s.heading}</h3><p>${s.body}</p><aside><h4>${s.aside}</h4><p>${s.detail}</p></aside></article>`).join('')}<div class="walk-navigation" aria-label="Walking sequence">${scenes.map((s,j)=>`<button type="button" data-walk-jump="${j}" aria-label="${s.label}" ${j===0?'aria-current="step"':''}>0${j+1}</button>`).join('')}<span>Scroll to follow the walk ↓</span></div></div></div></div><aside class="glance-design-question"><span class="eyebrow">Design question</span><h3>How can we design an AR interface that supports audio learning while walking, so people can attend to their surroundings and follow the explanation when they glance back?</h3></aside></section>`;
 const rounds=['process','process-visuals','process-history'];
 if(rounds.includes(s.id)){
  const r=rounds.indexOf(s.id),insights=['Words need connections','Avoid visual decoding','Focus needs context'];
  return `${r===0?'<aside class="pilot-introduction"><span>Exploring the design space</span><p>We ran <strong>14 rounds of pilot studies</strong> to test interface outcomes, alongside a <strong>designer workshop</strong>.</p></aside>':''}<section id="${s.id}" class="case-section glance-pilot">${title(s,i)}<p class="pilot-count">${esc(s.body[0].replace(/^Pilots [^·]+·\s*/,''))}</p><div class="pilot-gallery">${s.figures.map((f,j)=>`<figure class="pilot-example"><img src="${esc(f.src)}" alt="${esc(f.alt)}" width="${f.width}" height="${f.height}" loading="lazy"><figcaption><span>0${j+1}</span>${esc(f.caption)}</figcaption></figure>`).join('')}</div><div class="pilot-reasoning"><div class="pilot-insight"><span class="pilot-insight-label">Insight</span><h3>${insights[r]}</h3><p>${emphasize(s.body[1],s.highlights||[])}</p><blockquote>${esc(s.quote.text).replace(/\n/g,'<br>')}<cite>${esc(s.quote.attribution)}</cite></blockquote></div><div class="pilot-goals">${goals.slice(r*2,r*2+2).map((g,j)=>`<article data-cascade>${pill(r*2+j)}<h3>${g[0]}</h3><p>${g[1]}</p></article>`).join('')}</div></div></section>`;
 }
 if(s.id==='goals'){
 const item=j=>`<article class="goal-callout goal-${j+1}" data-goal="${j}">${pill(j)}<div><h3>${goals[j][0]}</h3><p>${goals[j][1]}</p></div></article>`;
 return `<section id="goals" class="case-section glance-goals-chapter"><div class="goals-scroll-track" data-goals-scroll><div class="goals-sticky"><div class="goals-story-heading">${title(s,i)}<p class="chapter-deck">Making the lesson visible, one idea at a time</p></div><div class="goals-composition"><figure class="goal-interface"><img src="/assets/design-revision/glance-918-460-source.png" width="850" height="356" alt="GlanceMap final interface: short connected labels, familiar branches and a synchronized illustration"></figure><div class="goal-leaders" aria-hidden="true">${goals.map(()=>'<span class="goal-leader"><i></i><i></i><i></i><b></b></span>').join('')}</div>${goals.map((_,j)=>item(j)).join('')}</div></div></div></section>`;
 }
 return null;
}
export function setupGlanceScroll(root){
 const walk=root.querySelector('[data-walk-scroll]'),goal=root.querySelector('[data-goals-scroll]');if(!walk&&!goal)return()=>{};
 const reduce=matchMedia('(prefers-reduced-motion:reduce)'),cleanups=[];let raf=0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 const progress=el=>{const r=el.getBoundingClientRect();const top=parseFloat(getComputedStyle(el.firstElementChild).top)||90;return clamp((top-r.top)/Math.max(1,r.height-el.firstElementChild.offsetHeight));};
 function point(t){const pts=[[.31,.27],[.41,.40],[.48,.51],[.62,.69],[.77,.90]];const seg=Math.min(3,Math.floor(t*4)),u=t*4-seg;return{x:pts[seg][0]+(pts[seg+1][0]-pts[seg][0])*u,y:pts[seg][1]+(pts[seg+1][1]-pts[seg][1])*u};}
 function lines(){if(!goal)return;const box=goal.querySelector('.goals-composition').getBoundingClientRect(),im=goal.querySelector('.goal-interface img').getBoundingClientRect(),leaders=goal.querySelector('.goal-leaders');
 // Distinct ports on the actual short label, hierarchy, illustration and temporal branches.
 // Route each leader out through its nearest edge so no connector crosses another callout.
 const anchors=[[.285,.175],[.21,.50],[.425,.69],[.86,.48],[.65,.16],[.72,.83]];
 anchors.forEach(([ax,ay],i)=>{const r=goal.querySelector(`[data-goal="${i}"]`).getBoundingClientRect(),x=im.left-box.left+im.width*ax,y=im.top-box.top+im.height*ay;let points;
 if(i===0||i===4){const ex=r.left-box.left+r.width/2,ey=r.bottom-box.top+9, lane=im.top-box.top-21;points=[[x,y],[x,lane],[ex,lane],[ex,ey]];}
 else if(i===2||i===5){const ex=r.left-box.left+r.width/2,ey=r.top-box.top-9,lane=im.bottom-box.top+21;points=[[x,y],[x,lane],[ex,lane],[ex,ey]];}
 else {const left=i===1,ex=(left?r.right:r.left)-box.left+(left?10:-10),ey=r.top-box.top+r.height/2,lane=(left?im.left:im.right)-box.left+(left?-18:18);points=[[x,y],[lane,y],[lane,ey],[ex,ey]];}
 const line=leaders.children[i];points.slice(0,-1).forEach(([a,b],j)=>{const[c,d]=points[j+1];Object.assign(line.children[j].style,{left:a+'px',top:b+'px',width:Math.hypot(c-a,d-b)+'px',rotate:Math.atan2(d-b,c-a)+'rad'});});Object.assign(line.lastElementChild.style,{left:x+'px',top:y+'px'});});}
 function update(){raf=0;if(walk){const t=progress(walk),stage=Math.min(2,Math.floor(t*3)),pos=point(t),traveller=walk.querySelector('.walk-traveller');walk.dataset.walkStage=String(stage);traveller.style.left=pos.x*100+'%';traveller.style.top=pos.y*100+'%';traveller.style.setProperty('--step-y',reduce.matches?'0px':Math.sin(t*90)*1.4+'px');walk.querySelectorAll('[data-pose]').forEach(n=>n.classList.toggle('is-active',+n.dataset.pose===stage));walk.querySelectorAll('[data-walk-scene]').forEach(n=>{const active=reduce.matches||+n.dataset.walkScene===stage;n.classList.toggle('is-active',active);n.setAttribute('aria-hidden',String(!active));});walk.querySelectorAll('[data-walk-jump]').forEach((n,i)=>{if(i===stage)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current')});walk.querySelector('.walk-listening').style.opacity=String(stage===0?1:.3);}
 if(goal){const t=progress(goal),shown=reduce.matches?6:Math.min(6,Math.floor(t*6)+1);goal.dataset.goalsShown=String(shown);goal.querySelectorAll('[data-goal]').forEach(n=>{const i=Number(n.dataset.goal);n.classList.toggle('is-visible',i<shown);n.classList.toggle('is-current',i===shown-1);});goal.querySelectorAll('[data-goal-jump]').forEach((n,i)=>n.classList.toggle('is-visible',i<shown));goal.querySelectorAll('.goal-leader').forEach((n,i)=>n.classList.toggle('is-visible',i<shown));}
 }
 const queue=()=>{if(!raf)raf=requestAnimationFrame(update)};
 const click=e=>{const button=e.target.closest('[data-walk-jump],[data-goal-jump]');if(!button)return;const isWalk=button.hasAttribute('data-walk-jump'),track=isWalk?walk:goal,index=Number(isWalk?button.dataset.walkJump:button.dataset.goalJump),r=track.getBoundingClientRect(),top=parseFloat(getComputedStyle(track.firstElementChild).top)||90,f=isWalk?(index+.35)/3:(index+.15)/6;window.scrollTo({top:scrollY+r.top-top+f*(r.height-track.firstElementChild.offsetHeight),behavior:reduce.matches?'instant':'smooth'});};
 root.addEventListener('click',click);window.addEventListener('scroll',queue,{passive:true});const resize=new ResizeObserver(()=>{lines();queue()});[walk,goal].filter(Boolean).forEach(n=>resize.observe(n));window.addEventListener('resize',queue,{passive:true});reduce.addEventListener('change',queue);lines();update();
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('has-entered',e.isIntersecting)),{threshold:.15});root.querySelectorAll('.pilot-goals [data-cascade]').forEach(n=>observer.observe(n));
 return()=>{cancelAnimationFrame(raf);resize.disconnect();observer.disconnect();root.removeEventListener('click',click);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);reduce.removeEventListener('change',queue);cleanups.forEach(f=>f())};
}
