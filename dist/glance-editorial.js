const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const heading=(s,i)=>`<header class="section-heading reveal"><div class="eyebrow">${String(i+1).padStart(2,'0')} / ${esc(s.nav)}</div><h2>${esc(s.title)}</h2></header>`;

export function renderGlanceChapter(s,i){
 if(s.id==='study')return `<section id="study" class="case-section glance-study" data-reveal-group><div class="glance-study-opening">${heading(s,i)}<div class="study-deck"><p>Sixteen participants tried both formats on the same indoor route. Each heard four lessons, then returned for a recall test seven days later.</p><dl><div><dt>16</dt><dd>participants</dd></div><div><dt>4</dt><dd>lessons each</dd></div><div><dt>7 days</dt><dd>follow-up</dd></div></dl></div></div><div class="route-story" data-route-story><div class="route-map"><img src="/assets/design-revision/glance-route.svg" width="1032" height="790" alt="The shared route: six indoor laps, escalator ascent, stair descent and rejoining the loop."></div><div class="route-leaders route-leaders-css" aria-hidden="true">${[0,1,2].map(()=>'<span><i></i><b></b></span>').join('')}</div><div class="route-people">${[
 ['glance-indoor.svg','269','428','Indoor loop','Walk six laps. Quest Pro and earbuds deliver the lesson.'],
 ['glance-escalator.svg','343','248','Escalator up','Listen while moving between levels.'],
 ['glance-stairs.svg','364','260','Stairs down','Watch each step, then rejoin the loop.']
 ].map((v,j)=>`<figure class="route-person" data-route-person="${j}" style="--person-delay:${j*90}ms"><div class="route-person-art"><img src="/assets/design-revision/${v[0]}" width="${v[1]}" height="${v[2]}" alt="${v[3]} study participant"></div><figcaption><span>0${j+1}</span><div><strong>${v[3]}</strong><p>${v[4]}</p></div></figcaption></figure>`).join('')}</div></div><div class="route-study-notes"><p><b>Movement + attention</b><br>A right-ankle IMU and eye tracking recorded the walk. A researcher shadowed each trial.</p><blockquote>“The earlier part doesn’t disappear; it is one complete thing.”<cite>Participant 15</cite></blockquote><blockquote>“A bit like reviewing.”<cite>Participant 08, returning after navigation</cite></blockquote></div><div class="study-voices"><p><b>Illustrations</b> helped P08 understand unfamiliar concepts.</p><p><b>Text</b> helped P04 recover context: “reading the text is quicker and easier than listening.”</p></div></section>`;
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
