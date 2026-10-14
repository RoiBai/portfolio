import {siteURL} from './site-paths.js';
const art='/assets/games-motion/';
const notes=[
 ['Read the table','Check each guest’s likes and dislikes. Their current satisfaction appears beside their name.'],
 ['Plan for three stars','Each level lists three goals. Balance individual tastes with goals for the whole table.'],
 ['Use item cards','Cards can swap plates or change a guest’s choices. Think about the whole table.'],
 ['Watch the round and AP','The step counter shows the current round. Each round gives you a limited number of action points.'],
 ['Rotate together','Hover over Lufa’s hand, then click to rotate every dish. Every guest is affected.'],
 ['Serve','Move once before serving. Click EAT and meet the guests’ targets before the round limit.']
];
export function setupLoofaEditorial(root,project){
 if(project.id!=='loofasoup')return()=>{};
 const clean=[],title=root.querySelector('.project-title-row');
 const reclining=document.createElement('img');reclining.className='loofa-title-character';reclining.src=siteURL('/assets/games-revision/loofa/lufa-reclining.png');reclining.alt='Lufa reclining beside the title';reclining.width=569;reclining.height=399;const heading=title?.querySelector('h1');if(heading){const lockup=document.createElement('div');lockup.className='loofa-name-lockup';heading.before(lockup);lockup.append(heading,reclining);}
 const gameplay=root.querySelector('#gameplay');
 if(gameplay){
  gameplay.classList.add('loofa-gameplay-editorial');
  const recording=gameplay.querySelector('.loofa-recording');
  for(const node of [...gameplay.children])if(!node.classList.contains('section-heading')&&node!==recording)node.remove();
  const layout=document.createElement('div');layout.className='loofa-gameplay-diagram';
  const note=(i)=>`<li data-loofa-note="${i}"><span>${String(i+1).padStart(2,'0')}</span><div><h3>${notes[i][0]}</h3><p>${notes[i][1]}</p></div></li>`;
  layout.innerHTML=`<ol class="loofa-gameplay-notes loofa-notes-left">${[1,0].map(note).join('')}</ol><figure class="loofa-gameplay-art"><img src="${siteURL('/assets/games-other-followup/loofa-gameplay-centered-complete-ui.png')}" width="2558" height="1438" alt="Original Loofa Soup interface: guest tastes, score goals, item cards, turns, rotating hands and the EAT button" loading="lazy" decoding="async"></figure><ol class="loofa-gameplay-notes loofa-notes-right">${[2,3].map(note).join('')}</ol><ol class="loofa-gameplay-notes loofa-notes-bottom">${[4,5].map(note).join('')}</ol><div class="loofa-game-leaders" aria-hidden="true">${notes.map((_,i)=>`<i data-loofa-line="${i}"></i>`).join('')}</div>`;
  gameplay.append(layout);
  if(recording){const screen=document.createElement('div');screen.className='loofa-gameplay-film';screen.append(recording);gameplay.append(screen);}
 }
 const routePair=root.querySelector('#routes .figure-pair');
 if(routePair){routePair.classList.add('loofa-routes-pair');const lead=document.createElement('div');lead.className='loofa-route-connection';lead.setAttribute('aria-hidden','true');routePair.append(lead);}
 const coords=[[.23,.76],[.08,.34],[.96,.24],[.88,.57],[.49,.85],[.87,.85]];
 function elbow(el,points){if(!el)return;el.innerHTML=points.slice(1).map((to,i)=>{const from=points[i],vertical=Math.abs(to[0]-from[0])<.1;return `<b class="${vertical?'vertical':'horizontal'}" style="left:${Math.min(from[0],to[0])}px;top:${Math.min(from[1],to[1])}px;width:${Math.abs(to[0]-from[0])}px;height:${Math.abs(to[1]-from[1])}px"></b>`}).join('')+`<em style="left:${points.at(-1)[0]}px;top:${points.at(-1)[1]}px"></em>`;}
 function measure(){
  const diagram=root.querySelector('.loofa-gameplay-diagram');if(diagram){const base=diagram.getBoundingClientRect(),img=diagram.querySelector('.loofa-gameplay-art img').getBoundingClientRect();notes.forEach((_,i)=>{const n=diagram.querySelector(`[data-loofa-note="${i}"]`).getBoundingClientRect(),x2=img.left+img.width*coords[i][0]-base.left,y2=img.top+img.height*coords[i][1]-base.top;let points;if(i>=4){const x1=n.left+15-base.left,y1=n.top-8-base.top,bend=img.bottom+18+(i-4)*7-base.top;points=[[x1,y1],[x1,bend],[x2,bend],[x2,y2]];}else{const left=i<2,x1=(left?n.right+3:n.left-3)-base.left,y1=n.top+22-base.top,bend=(left?img.left-12-i*5:img.right+12+(i-2)*5)-base.left;points=[[x1,y1],[bend,y1],[bend,y2],[x2,y2]];}elbow(diagram.querySelector(`[data-loofa-line="${i}"]`),points);});}
  if(routePair){const imgs=routePair.querySelectorAll('.figure-media img');if(imgs.length<2)return;const base=routePair.getBoundingClientRect(),a=imgs[0].getBoundingClientRect(),b=imgs[1].getBoundingClientRect(),x1=a.left+a.width*.57-base.left,y1=a.top+a.height*.372-base.top;let points;if(innerWidth>650){const rail=a.top-base.top-20;points=[[x1,y1],[x1,rail],[b.left-base.left-18,rail],[b.left-base.left-18,b.top+b.height*.5-base.top],[b.left-base.left+2,b.top+b.height*.5-base.top]];}else{const rail=a.right-base.left-12;points=[[x1,y1],[rail,y1],[rail,b.top-base.top-18],[b.left+b.width*.5-base.left,b.top-base.top-18],[b.left+b.width*.5-base.left,b.top-base.top+2]];}const connector=routePair.querySelector('.loofa-route-connection');elbow(connector,points);connector.insertAdjacentHTML('beforeend',`<em style="left:${x1}px;top:${y1}px"></em>`);}
 }
 const joma=root.querySelector('[data-character=joma]');
 if(joma){const note=document.createElement('div');note.className='loofa-joma-personal';note.innerHTML=`<strong>That’s me!</strong><span><img src="${siteURL(art+'jojo-yoyo-original.png')}" width="166" height="95" alt="Jojo and Yoyo, the two dogs in the original portfolio"><span>Jojo + Yoyo</span></span>`;joma.append(note);}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0;
 const update=()=>{raf=0;root.querySelectorAll('[data-loofa-note]').forEach(n=>{const shown=reduced.matches||n.getBoundingClientRect().top<innerHeight*.86;n.classList.toggle('is-shown',shown);root.querySelector(`[data-loofa-line="${n.dataset.loofaNote}"]`)?.classList.toggle('is-shown',shown)});};
 const queue=()=>{if(!raf)raf=requestAnimationFrame(update)};const resize=()=>{measure();queue()};const observer=new ResizeObserver(resize);for(const el of root.querySelectorAll('.loofa-gameplay-diagram,.loofa-routes-pair'))observer.observe(el);for(const im of root.querySelectorAll('.loofa-gameplay-diagram img,.loofa-routes-pair img'))im.addEventListener('load',resize,{once:true});addEventListener('scroll',queue,{passive:true});addEventListener('resize',resize,{passive:true});reduced.addEventListener('change',queue);routePair?.addEventListener('transitionend',resize);measure();update();
 return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',queue);removeEventListener('resize',resize);observer.disconnect();reduced.removeEventListener('change',queue);routePair?.removeEventListener('transitionend',resize);clean.forEach(fn=>fn());};
}
