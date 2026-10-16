// Original portfolio artwork, recomposed as responsive HTML rather than a scaled canvas.
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const src='/assets/games-other-followup/';
const local='/assets/ambulance-editorial/';
const clamp=n=>Math.max(0,Math.min(1,n));
const image=(url,alt,w,h,cls='')=>`<img class="${cls}" src="${url}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">`;
const hospitalNames=['Lyell McEwin Hospital','Royal Adelaide Hospital','Flinders Medical Centre'];
const pinPositions={real:[[.503,.132],[.341,.597],[.300,.872]],game:[[.330,.262],[.203,.603],[.668,.735]]};
function mapFigure(type){return `<figure class="ar-map ar-map-${type}"><figcaption>${type==='real'?'Real Adelaide':'Game map'}</figcaption><div class="ar-map-crop">${image(src+(type==='real'?'ambulance-original-sa-health-map-context-kept.png':'ambulance-original-city-plan-paper-figure.png'),type==='real'?'Original SA Health hospital map':'Original Ambulance Rush city plan',type==='real'?1774:1240,type==='real'?1526:1145)}${pinPositions[type].map(([x,y],i)=>`<span class="ar-map-pin" data-hospital="${i}" style="left:${x*100}%;top:${y*100}%">${i+1}</span>`).join('')}</div></figure>`;}
const notes=[
 {title:'Check beds',text:'Tap the hospital icon for names and available beds.',xy:[.12,.12],art:true},
 {title:'Tap the patient portrait',text:'Check name and urgency. Local names connect the calls to Adelaide.',xy:[.045,.105],urgency:true},
 {title:'Current patient',text:'The patient currently aboard.',xy:[.08,.51]},
 {title:'3 hearts',text:'Miss a deadline: lose a heart. Three lost: game over.',xy:[.10,.035]},
 {title:'Navigate',text:'Use the minimap to locate calls and plan a route.',xy:[.89,.18]},
 {title:'Speed + recovery',text:'Rocket boosts speed. Rotate flips you upright.',xy:[.25,.80]}
];
function note(n,i){return `<div class="ar-game-note" data-ar-step="${i}" data-game-note="${i}"><span class="ar-step-number">${String(i+1).padStart(2,'0')}</span><div><h3>${n.title}</h3><p>${n.text}</p>${n.urgency?'<div class="ar-urgency"><span>Low</span><span>Medium</span><span>High</span></div>':''}${n.art?image(src+'ambulance-hospital-tab-all-three-names-and-capacity.png','Original hospital capacity panel',306,402,'ar-hospital-panel'):''}</div></div>`;}
function replaceSection(section,body){if(!section)return;const heading=section.querySelector('.section-heading')?.outerHTML||'';section.className='case-section ambulance-chapter';section.innerHTML=heading+body;}
export function setupAmbulanceEditorial(root=document,project){
 if((project?.id||document.body.dataset.project)!=='ambulance')return()=>{};
 if(root.querySelector('.ambulance-chapter'))return()=>{};
 const abstract=root.querySelector('#abstract'),city=root.querySelector('#city'),gameplay=root.querySelector('#gameplay'),reflection=root.querySelector('#reflection'),publication=root.querySelector('#publication');
 const sourceCard=abstract?.querySelector('.news-preview')?.outerHTML||'';
 replaceSection(abstract,`<div class="ar-news-grid"><figure class="ar-news-photo">${image(local+'ambulance-cutout.png','Ambulance isolated from the original ABC News photograph',1672,941)}<figcaption>ABC News · Che Chorley</figcaption></figure><div class="ar-news-copy"><p><strong>Ramping</strong> means ambulance crews wait to hand patients over to hospital staff. Demand rises while beds stay scarce.</p>${sourceCard}<p class="ar-takeaway">We turned reporting into <strong>decisions younger students could experience.</strong></p></div></div>`);
 city?.remove();
 replaceSection(gameplay,`<p class="ar-section-deck">Drive, triage and check capacity.</p><div class="ar-game-layout" data-ar-game><div class="ar-game-notes ar-game-notes-left">${[0,1,2].map(i=>note(notes[i],i)).join('')}</div><div class="ar-game-note-top">${note(notes[3],3)}</div><figure class="ar-game-frame">${image(src+'ambulance-complete-gameplay-screen-new-user-screenshot.png','Original Ambulance Rush gameplay interface',3416,2136)}<figcaption>One patient, a deadline, and an available bed</figcaption></figure><div class="ar-game-notes ar-game-notes-right">${[4,5].map(i=>note(notes[i],i)).join('')}<div class="ar-pressure" data-ar-step="6"><h3>Why the pressure rises</h3><p>Calls rise as beds stay scarce. Players can save individual patients, but <strong>the shortage remains.</strong></p></div></div><div class="ar-connections" aria-hidden="true">${notes.map((_,i)=>`<i data-game-line="${i}"></i>`).join('')}</div></div><div id="city" class="ar-game-map" aria-labelledby="adelaide-map-title"><div class="ar-map-intro"><h3 id="adelaide-map-title">Adelaide Map</h3><p class="ar-section-deck"><span>Real hospital names and approximate locations in Adelaide shape the game map.</span><span>Low-poly geometry keeps streets clear and rendering efficient.</span></p></div><div class="ar-map-comparison" data-ar-map>${mapFigure('real')}<ol class="ar-hospitals">${hospitalNames.map((n,i)=>`<li data-ar-step="${i}" data-hospital-label="${i}"><span class="ar-step-number">${i+1}</span><div><span class="ar-region">${['North','Central','South'][i]}</span><h3>${n}</h3></div></li>`).join('')}</ol>${mapFigure('game')}<div class="ar-connections" aria-hidden="true">${hospitalNames.map((_,i)=>`<i data-map-line="${i}-real"></i><i data-map-line="${i}-game"></i>`).join('')}</div></div></div>`);
 replaceSection(reflection,`<div class="ar-reflection-grid"><figure class="ar-postgame"><div class="ar-postgame-original"><div class="ar-postgame-readable"><p>The ambulance ramping crisis isn’t slowing down, even with your help! In July 2024 ambulances were ramped for a total of <strong>5,539 hours</strong> outside Adelaide’s hospitals. And it’s not just here; no state or territory across Australia is meeting their targets. In New South Wales in July 2024, <strong>50,000 patients</strong> were ramped outside hospitals in that month alone – up from 44,000 in 2022, according to The Conversation.</p><p>This game is here to give you a glimpse into what emergency services face every day. Behind every number is a patient waiting for life-saving care. Thanks for playing and seeing how urgent this crisis is!</p></div></div><figcaption>Original post-game artwork and text · July 2024 reporting</figcaption></figure><div class="ar-reflection-copy"><p>After the run, <strong>real ramping data</strong> connects the game’s frustration to the news.</p><blockquote><span>Student feedback</span><p>“I feel frustrated when I want to save someone but there are no hospital beds. The game made me realise how serious ramping is.”</p></blockquote></div></div>`);
 replaceSection(publication,`<div class="ar-audience-result"><strong>2,000+</strong><p>Adelaide players reached</p></div>`);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,disposed=false;
 function line(el,x1,y1,x2,y2){if(!el)return;el.style.left=x1+'px';el.style.top=y1+'px';el.style.width=Math.hypot(x2-x1,y2-y1)+'px';el.style.transform=`rotate(${Math.atan2(y2-y1,x2-x1)}rad)`;}
 function elbow(el,points,pink=false){
  if(!el)return;el.classList.add('ar-elbow');el.dataset.points=JSON.stringify(points);const minX=Math.min(...points.map(p=>p[0]))-6,minY=Math.min(...points.map(p=>p[1]))-6,width=Math.max(...points.map(p=>p[0]))-minX+6,height=Math.max(...points.map(p=>p[1]))-minY+6,scale=Math.min(devicePixelRatio||1,2);let canvas=el.querySelector('canvas');if(!canvas){canvas=document.createElement('canvas');el.replaceChildren(canvas);}canvas.width=Math.ceil(width*scale);canvas.height=Math.ceil(height*scale);Object.assign(canvas.style,{left:minX+'px',top:minY+'px',right:'auto',bottom:'auto',width:width+'px',height:height+'px'});const ctx=canvas.getContext('2d');ctx.scale(scale,scale);ctx.translate(-minX,-minY);ctx.strokeStyle=pink?'#D8657C':'#5981AF';ctx.lineWidth=2.5;ctx.setLineDash([6,5]);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length-1;i++){const prev=points[i-1],p=points[i],next=points[i+1],a=Math.hypot(p[0]-prev[0],p[1]-prev[1]),b=Math.hypot(next[0]-p[0],next[1]-p[1]),r=Math.min(9,a/2,b/2);if(a<.1||b<.1){ctx.lineTo(...p);continue;}ctx.lineTo(p[0]-(p[0]-prev[0])*r/a,p[1]-(p[1]-prev[1])*r/a);ctx.quadraticCurveTo(p[0],p[1],p[0]+(next[0]-p[0])*r/b,p[1]+(next[1]-p[1])*r/b);}ctx.lineTo(...points.at(-1));ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(...points.at(-1),3.5,0,Math.PI*2);ctx.fillStyle=ctx.strokeStyle;ctx.fill();
 }
 function measure(){
  const map=root.querySelector('[data-ar-map]');if(map){const base=map.getBoundingClientRect();for(let i=0;i<3;i++){const label=map.querySelector(`[data-hospital-label="${i}"]`).getBoundingClientRect();for(const type of ['real','game']){const pin=map.querySelector(`.ar-map-${type} [data-hospital="${i}"]`).getBoundingClientRect();line(map.querySelector(`[data-map-line="${i}-${type}"]`),pin.left+pin.width/2-base.left,pin.top+pin.height/2-base.top,(type==='real'?label.left:label.right)-base.left,label.top+label.height/2-base.top);}}}
  const game=root.querySelector('[data-ar-game]');if(game){const base=game.getBoundingClientRect(),im=game.querySelector('.ar-game-frame>img').getBoundingClientRect();notes.forEach((n,i)=>{const noteEl=game.querySelector(`[data-game-note="${i}"]`),box=noteEl.getBoundingClientRect(),heading=noteEl.querySelector('h3').getBoundingClientRect(),left=i<3,x2=im.left+im.width*n.xy[0]-base.left,y2=im.top+im.height*n.xy[1]-base.top;let points;
   if(i===0){const x1=box.right+4-base.left,y1=heading.top+heading.height/2-base.top,corridor=im.left-22-base.left,approach=im.top+im.height*.06-base.top;points=[[x1,y1],[corridor,y1],[corridor,approach],[x2,approach],[x2,y2]];}
   else if(i===3){const x1=box.left+12-base.left,y1=box.bottom+5-base.top,bend=im.top-12-base.top;points=[[x1,y1],[x1,bend],[x2,bend],[x2,y2]];}
   else if(i===5){const x1=box.left-4-base.left,y1=heading.top+heading.height/2-base.top,bend=im.right+16-base.left,bottom=im.bottom+9-base.top;points=[[x1,y1],[bend,y1],[bend,bottom],[x2,bottom],[x2,y2]];}
   else{const x1=(left?box.right+4:box.left-4)-base.left,y1=heading.top+heading.height/2-base.top,bend=(left?im.left-10-i*8:im.right+10)-base.left;points=[[x1,y1],[bend,y1],[bend,y2],[x2,y2]];}
   elbow(game.querySelector(`[data-game-line="${i}"]`),points,i===0||i===3);});}


 }
 function update(){
  frame=0;if(disposed)return;
  const map=root.querySelector('[data-ar-map]');
  for(const label of map?.querySelectorAll('[data-hospital-label]')||[]){
   const shown=reduced.matches||label.getBoundingClientRect().top<innerHeight*.88,i=label.dataset.hospitalLabel;
   label.classList.toggle('ar-is-visible',shown);
   map.querySelectorAll(`[data-hospital="${i}"],[data-map-line^="${i}-"]`).forEach(el=>el.classList.toggle('ar-is-visible',shown));
  }
  const game=root.querySelector('[data-ar-game]');
  for(const el of game?.querySelectorAll('[data-ar-step]')||[]){
   const shown=reduced.matches||el.getBoundingClientRect().top<innerHeight*.88;
   el.classList.toggle('ar-is-visible',shown);
   game.querySelector(`[data-game-line="${el.dataset.arStep}"]`)?.classList.toggle('ar-is-visible',shown);
  }
 }
 const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};const resize=()=>{measure();queue();};
 const observer=new ResizeObserver(resize);for(const el of root.querySelectorAll('[data-ar-map],[data-ar-game]'))observer.observe(el);for(const im of root.querySelectorAll('.ambulance-chapter img'))im.addEventListener('load',resize,{once:true});
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',resize,{passive:true});reduced.addEventListener('change',queue);measure();update();
 return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();removeEventListener('scroll',queue);removeEventListener('resize',resize);reduced.removeEventListener('change',queue);};
}
