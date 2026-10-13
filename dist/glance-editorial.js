const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const heading=(s,i)=>`<header class="section-heading reveal"><div class="eyebrow">${String(i+1).padStart(2,'0')} / ${esc(s.nav)}</div><h2>${esc(s.title)}</h2></header>`;

export function renderGlanceChapter(s,i){
 if(s.id==='problem')return `<section id="problem" class="case-section glance-walking" data-reveal-group>${heading(s,i)}<div class="walking-story" data-scroll-sequence><div class="walking-art"><img src="/assets/design-followup/glance-journey.svg" alt="A listener walks with AR glasses, checks the traffic light, then returns to the lesson." width="1340" height="1324"><div class="walk-tag tag-one" data-sequence="0"><b>01</b> Walk + listen</div><div class="walk-tag tag-two" data-sequence="1"><b>02</b> Look away</div><div class="walk-tag tag-three" data-sequence="2"><b>03</b> Look back</div></div><div class="walking-copy"><div class="walk-step" data-sequence="0"><span>01 / FOLLOWING THE LESSON</span><h3>The audio keeps playing</h3><p>Ideas build on earlier causes, conditions and comparisons.</p></div><div class="walk-step" data-sequence="1"><span>02 / ATTENTION SHIFTS</span><h3>The path needs attention</h3><p>A crossing or a change of level pulls the listener away.</p></div><div class="walk-step" data-sequence="2"><span>03 / RECONNECTING</span><h3>Where was I?</h3><p>On returning, the listener needs the connection—not just the latest words.</p></div></div></div><p class="editorial-question">How can an AR interface help people watch their surroundings and find their place in the explanation?</p></section>`;
 if(s.id==='goals')return `<section id="goals" class="case-section glance-final" data-reveal-group>${heading(s,i)}<p class="final-intro">New ideas appear with the audio; earlier branches stay readable</p><div class="final-composition"><figure class="final-interface"><img src="/assets/design-revision/glance-918-460-source.png" width="850" height="356" alt="Original GlanceMap interface, with its persistent map and synchronized illustration"><figcaption>GlanceMap · Original study interface</figcaption></figure><svg class="final-leaders" viewBox="0 0 1200 430" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M320 154 L660 154 L726 56"/><path pathLength="1" d="M175 225 L642 225 L726 203"/><path pathLength="1" d="M572 237 L670 237 L726 354"/></svg><div class="final-callouts"><div><span>01 · GOALS 05–06</span><h3>Reveal, then retain context</h3><p>New ideas appear with the audio. Earlier branches stay readable for a returning glance.</p></div><div><span>02 · GOALS 01–03</span><h3>Short labels, clear links</h3><p>Brief labels and familiar branches make relationships easy to read.</p></div><div><span>03 · GOAL 04</span><h3>Pair maps with illustrations</h3><p>The map explains relationships; illustrations ground concrete ideas.</p></div></div></div></section>`;
 if(s.id==='study')return `<section id="study" class="case-section glance-study" data-reveal-group>${heading(s,i)}<div class="study-deck"><p>Sixteen participants tried both formats on the same indoor route. Each heard four lessons, then returned for a recall test seven days later.</p><dl><div><dt>16</dt><dd>participants</dd></div><div><dt>4</dt><dd>lessons each</dd></div><div><dt>7 days</dt><dd>follow-up</dd></div></dl></div><div class="route-story" data-route-story><div class="route-map"><img src="/assets/design-revision/glance-route.svg" width="1032" height="790" alt="The shared route: six indoor laps, escalator ascent, stair descent and rejoining the loop."></div><svg class="route-leaders" aria-hidden="true"><path pathLength="1"/><path pathLength="1"/><path pathLength="1"/><circle r="4"/><circle r="4"/><circle r="4"/></svg><div class="route-people">${[
 ['glance-indoor.svg','269','428','Indoor loop','Walk six laps. Quest Pro and earbuds deliver the lesson.'],
 ['glance-escalator.svg','343','248','Escalator up','Listen while moving between levels.'],
 ['glance-stairs.svg','364','260','Stairs down','Watch each step, then rejoin the loop.']
 ].map((v,j)=>`<figure class="route-person"><div class="route-person-art"><img src="/assets/design-revision/${v[0]}" width="${v[1]}" height="${v[2]}" alt="${v[3]} study participant"></div><figcaption><span>0${j+1}</span><div><strong>${v[3]}</strong><p>${v[4]}</p></div></figcaption></figure>`).join('')}</div></div><div class="route-study-notes"><p><b>Movement + attention</b><br>A right-ankle IMU and eye tracking recorded the walk. A researcher shadowed each trial.</p><blockquote>“The earlier part doesn’t disappear; it is one complete thing.”<cite>Participant 15</cite></blockquote><blockquote>“A bit like reviewing.”<cite>Participant 08, returning after navigation</cite></blockquote></div><div class="study-voices"><p><b>Illustrations</b> helped P08 understand unfamiliar concepts.</p><p><b>Text</b> helped P04 recover context: “reading the text is quicker and easier than listening.”</p></div></section>`;
 return null;
}

export function setupGlanceEditorial(root){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const sequences=[...root.querySelectorAll('[data-scroll-sequence]')];
 const stories=[...root.querySelectorAll('[data-route-story]')];
 let raf=0;
 function measure(){
  for(const story of stories){
   const box=story.getBoundingClientRect(),map=story.querySelector('.route-map img').getBoundingClientRect(),svg=story.querySelector('svg');
   svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
   const anchors=[[.34,.71],[.59,.32],[.68,.36]];
   story.querySelectorAll('.route-person').forEach((person,i)=>{
    const p=person.querySelector('img').getBoundingClientRect(),x=map.left-box.left+map.width*anchors[i][0],y=map.top-box.top+map.height*anchors[i][1],ex=p.left-box.left+p.width/2,ey=p.top-box.top+12;
    const around=innerWidth>=900;
    const endX=around?(i===0?p.right-box.left:p.left-box.left):ex,endY=around?p.top-box.top+p.height*.5:ey;
    const bendX=(x+endX)/2,bendY=around?(y+endY)/2:map.bottom-box.top+24+i*12;
    svg.children[i].setAttribute('d',`M ${x} ${y} C ${bendX} ${y}, ${bendX} ${bendY}, ${endX} ${endY}`);
    svg.children[3+i].setAttribute('cx',x);svg.children[3+i].setAttribute('cy',y);
   });
  }
 }
 function update(){raf=0;
  sequences.forEach(el=>{
   const rect=el.getBoundingClientRect(),progress=Math.max(0,Math.min(1,(innerHeight*.88-rect.top)/(Math.min(rect.height,innerHeight)*1.15)));
   el.querySelectorAll('[data-sequence]').forEach(n=>n.classList.toggle('sequence-visible',reduced.matches||progress>[.02,.38,.78][Number(n.dataset.sequence)]));
   el.dataset.stage=String(reduced.matches?3:[.02,.38,.78].filter(t=>progress>t).length);
  });
  stories.forEach(el=>el.classList.toggle('route-visible',reduced.matches||el.getBoundingClientRect().top<innerHeight*.72));
  root.querySelectorAll('.final-composition').forEach(el=>el.classList.toggle('route-visible',reduced.matches||el.getBoundingClientRect().top<innerHeight*.75));
 }
 const queue=()=>{if(!raf)raf=requestAnimationFrame(update)};
 const resize=new ResizeObserver(()=>{measure();queue()});
 [...sequences,...stories].forEach(n=>resize.observe(n));
 window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue,{passive:true});reduced.addEventListener('change',queue);
 measure();update();
 return()=>{cancelAnimationFrame(raf);resize.disconnect();window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);reduced.removeEventListener('change',queue)};
}
