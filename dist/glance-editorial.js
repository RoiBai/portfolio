const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const heading=(s,i)=>`<header class="section-heading reveal"><div class="eyebrow">${String(i+1).padStart(2,'0')} / ${esc(s.nav)}</div><h2>${esc(s.title)}</h2></header>`;

function studyBaseline(s){
 if(!s)return "";
 return `<section id="baseline" data-nav-parent="study" class="glance-study-baseline" aria-label="The two study conditions"><div class="study-condition-grid"><article class="study-condition"><header><span class="study-subsection-label">Control condition</span><h3>Illustration Only</h3></header><figure><img src="${esc(s.figures[0].src)}" width="${s.figures[0].width}" height="${s.figures[0].height}" alt="Illustration Only: the current lesson illustration without a persistent mind map" loading="lazy"><figcaption>Pilot 6 · our AudioXtend-inspired comparison</figcaption></figure><div class="baseline-story"><a class="baseline-reference" href="https://doi.org/10.1145/3613904.3642514" target="_blank" rel="noopener noreferrer">AudioXtend · CHI 2024 ↗</a><p>Pilot 6’s <strong>Illustration Only</strong> follows AudioXtend’s illustrated-audio approach. An <strong>AudioXtend co-author</strong> joined our design process.</p></div></article><article class="study-condition"><header><span class="study-subsection-label">Experimental condition</span><h3>GlanceMap</h3></header><figure><img src="/assets/glance-clarity/final-interface-original.png" width="2350" height="897" alt="GlanceMap: a persistent mind map alongside the same lesson illustration" loading="lazy"><figcaption>Progressive mind map + the same illustrations</figcaption></figure><div class="baseline-story"><p><strong>GlanceMap adds a persistent mind map.</strong> New ideas appear with the narration; earlier branches remain readable.</p><p><mark class="glance-phrase-highlight"><strong>Our question:</strong></mark> what does this visible structure add?</p></div></article></div><p class="study-shared-inputs"><strong>Matched across both conditions:</strong> prepared narration, illustrations and timing.</p></section>`;
}

export function renderGlanceChapter(s,i){


 if(s.id==='study')return `<section id="study" class="case-section glance-study" data-reveal-group>${heading(s,i)}${studyBaseline(s.baseline)}<div class="glance-study-opening"><div class="study-method"><span class="study-subsection-label">Study design</span><h3>A within-subjects comparison</h3><p>Each participant tried <strong>both interfaces</strong>: two lessons with GlanceMap and two with Illustration Only. Interface order and lesson assignments were <strong>counterbalanced</strong>.</p><p>The four topics had <strong>similar structures and novice-level difficulty</strong>.</p></div><div class="study-deck"><dl class="study-facts"><div><dt><strong>16</strong><span>participants</span></dt><dd>Each completed four trials, for <strong>64 trials</strong> in total.</dd></div><div><dt><strong>4</strong><span>lesson materials</span></dt><dd>HUD visual fatigue; AR + phone reading; AI music creation; and reading a phone while walking.</dd></div><div><dt><strong>7 days</strong><span>follow-up</span></dt><dd><strong>Free and cued recall</strong> were repeated seven days later.</dd></div></dl></div></div><div class="route-story" data-route-story><div class="route-map"><img src="/assets/design-revision/glance-route.svg" width="1032" height="790" alt="The shared route: six indoor laps, escalator ascent, stair descent and rejoining the loop."></div><div class="route-leaders route-leaders-css" aria-hidden="true">${[0,1,2].map(()=>'<span><i></i><b></b></span>').join('')}</div><div class="route-people">${[
 ['glance-indoor.svg','269','428','Indoor loop','Walk six laps. Quest Pro and earbuds deliver the lesson.'],
 ['glance-escalator.svg','343','248','Escalator up','Listen while moving between levels.'],
 ['glance-stairs.svg','364','260','Stairs down','Watch each step, then rejoin the loop.']
 ].map((v,j)=>`<figure class="route-person" data-route-person="${j}" style="--person-delay:${j*90}ms"><div class="route-person-art"><img src="/assets/design-revision/${v[0]}" width="${v[1]}" height="${v[2]}" alt="${v[3]} study participant"></div><figcaption><span>0${j+1}</span><div><strong>${v[3]}</strong><p>${v[4]}</p></div></figcaption></figure>`).join('')}</div></div><div class="study-measures"><article><h3>Movement + attention</h3><p><strong>Eye tracking</strong> recorded gaze. A <strong>right-ankle IMU</strong> (accelerometer + gyroscope) measured cadence and gait stability.</p></article><article><h3>Content memory</h3><p><strong>Free recall</strong> (no prompts) and <strong>cued recall</strong> (with prompts) tested remembered content immediately and on <strong>Day 7</strong>.</p></article><article><h3>Picture recognition</h3><p>After each lesson, participants chose the <strong>previously seen picture</strong> from a pair.</p></article><p class="study-experience-note"><strong>Experience</strong> · Participants also reported their workload and learning experience.</p></div></section>`;
 return null;
}

export function setupGlanceEditorial(root){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const sequences=[...root.querySelectorAll('[data-scroll-sequence]')];
 const stories=[...root.querySelectorAll('[data-route-story]')];
 let raf=0;
 function measure(){
  for(const story of stories){
   const box=story.getBoundingClientRect(),map=story.querySelector('.route-map img').getBoundingClientRect(),leaders=story.querySelector('.route-leaders');
   const anchors=[[.34,.71],[.59,.32],[.68,.36]];
   story.querySelectorAll('.route-person').forEach((person,i)=>{
    const im=person.querySelector('img'),art=person.querySelector('.route-person-art').getBoundingClientRect(),p={left:art.left+(art.width-im.offsetWidth)/2,right:art.left+(art.width+im.offsetWidth)/2,top:art.bottom-im.offsetHeight,width:im.offsetWidth,height:im.offsetHeight},x=map.left-box.left+map.width*anchors[i][0],y=map.top-box.top+map.height*anchors[i][1],ex=p.left-box.left+p.width/2,ey=p.top-box.top+12;
    const around=innerWidth>=1000;
    const endX=around?(i===0?p.right-box.left:p.left-box.left):ex,endY=around?p.top-box.top+p.height*.5:ey;
    const line=leaders.children[i];Object.assign(line.firstElementChild.style,{left:x+'px',top:y+'px',width:Math.hypot(endX-x,endY-y)+'px',rotate:Math.atan2(endY-y,endX-x)+'rad'});Object.assign(line.lastElementChild.style,{left:x+'px',top:y+'px'});
   });
  }
 }
 function update(){raf=0;
  sequences.forEach(el=>{
   const rect=el.getBoundingClientRect(),progress=Math.max(0,Math.min(1,(innerHeight*.88-rect.top)/(Math.min(rect.height,innerHeight)*1.15)));
   el.querySelectorAll('[data-sequence]').forEach(n=>n.classList.toggle('sequence-visible',reduced.matches||progress>[.02,.38,.78][Number(n.dataset.sequence)]));
   el.dataset.stage=String(reduced.matches?3:[.02,.38,.78].filter(t=>progress>t).length);
  });
  stories.forEach(el=>{
   const r=el.getBoundingClientRect(),progress=Math.max(0,Math.min(1,(innerHeight*.84-r.top)/(innerHeight*.40)));
   el.classList.toggle('route-visible',reduced.matches||progress>0);
   el.querySelectorAll('[data-route-person]').forEach((person,i)=>{const visible=reduced.matches||progress>[0,.20,.40][i];person.classList.toggle('is-pop-visible',visible);el.querySelector('.route-leaders')?.children[i]?.classList.toggle('is-pop-visible',visible)});
  });
  root.querySelectorAll('.final-composition').forEach(el=>el.classList.toggle('route-visible',reduced.matches||el.getBoundingClientRect().top<innerHeight*.75));
 }
 const queue=()=>{if(!raf)raf=requestAnimationFrame(update)};
 const resize=new ResizeObserver(()=>{measure();queue()});
 [...sequences,...stories].forEach(n=>resize.observe(n));
 window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue,{passive:true});reduced.addEventListener('change',queue);
 measure();update();
 return()=>{cancelAnimationFrame(raf);resize.disconnect();window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);reduced.removeEventListener('change',queue)};
}
