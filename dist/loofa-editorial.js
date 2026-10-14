import {siteURL} from './site-paths.js';
const art='/assets/games-motion/';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const notes=[
 ['Read the table','Check each guest’s likes, dislikes and current satisfaction.'],
 ['Plan for three stars','Balance individual tastes with the three goals for the whole table.'],
 ['Use item cards','Cards can swap plates or change a guest’s choices. Think about every guest.'],
 ['Watch the round and AP','The round counter and remaining action points limit your next move.'],
 ['Rotate together','Click Lufa’s hand to rotate every dish. Every guest is affected.'],
 ['Serve','Move once before serving. Click EAT and meet the guests’ targets before the round limit.']
];
// Coordinates refer to the original 1280 × 720 gameplay recording, not a recreated interface.
const spots=[
 {x:12,y:67,box:[11.5,65,15,24]},
 {x:3.5,y:22,box:[1,14.5,30.2,47]},
 {x:93,y:7,box:[92.4,1.5,6.6,43]},
 {x:80,y:49,box:[77,43,15,18]},
 {x:47,y:81,box:[45,77,7,15]},
 {x:92,y:80,box:[71,74,27,23]}
];
function setupVideoAnnotations(section,project){
 const recording=section.querySelector('.loofa-recording');if(!recording)return()=>{};
 const video=recording.querySelector('video');if(!video)return()=>{};
 for(const node of [...section.children])if(!node.classList.contains('section-heading')&&node!==recording)node.remove();
 section.classList.add('loofa-gameplay-editorial','loofa-gameplay-on-film');
 const data=project.sections.find(s=>s.id==='gameplay')?.videoSteps;
 const copy=data?.length===6?data.map(s=>[s.title,s.body]):notes;
 const player=document.createElement('div');player.className='loofa-annotated-player';
 const stage=document.createElement('div');stage.className='loofa-video-stage';
 stage.append(video);stage.insertAdjacentHTML('beforeend',`<div class="loofa-video-hotspots" aria-label="Explore six gameplay controls">${spots.map((p,i)=>`<button type="button" class="loofa-video-hotspot" data-video-step="${i}" aria-label="${String(i+1).padStart(2,'0')}: ${esc(copy[i][0])}" aria-pressed="${i===0}" aria-controls="loofa-video-note" style="left:${p.x}%;top:${p.y}%">${String(i+1).padStart(2,'0')}</button>`).join('')}</div><div class="loofa-video-target" aria-hidden="true"></div>`);
 const note=document.createElement('div');note.className='loofa-video-note';note.id='loofa-video-note';note.setAttribute('aria-live','polite');note.setAttribute('aria-atomic','true');
 note.innerHTML='<div class="loofa-video-note-top"><span data-note-counter>01 / 06</span><div><button type="button" data-note-prev aria-label="Previous gameplay note">←</button><button type="button" data-note-next aria-label="Next gameplay note">→</button><button type="button" data-note-hide aria-label="Hide explanation" title="Hide explanation">×</button></div></div><h3 data-note-title></h3><p data-note-body></p>';
 player.append(stage,note);recording.prepend(player);recording.classList.add('loofa-recording-annotated');
 const caption=recording.querySelector('figcaption');if(caption)caption.innerHTML='<span>Original gameplay · 2× speed</span><p>Choose a number on the video to explore the controls. <a href="#play">Play the game ↑</a></p>';
 let current=0;
 const select=i=>{note.hidden=false;current=(i+copy.length)%copy.length;const [title,body]=copy[current];player.dataset.activeStep=current;note.querySelector('[data-note-counter]').textContent=`${String(current+1).padStart(2,'0')} / 06`;note.querySelector('[data-note-title]').textContent=title;note.querySelector('[data-note-body]').textContent=body;stage.querySelectorAll('[data-video-step]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.videoStep===current)));const[x,y,w,h]=spots[current].box;stage.querySelector('.loofa-video-target').style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;};
 const click=e=>{const step=e.target.closest('[data-video-step]');if(step)select(+step.dataset.videoStep);else if(e.target.closest('[data-note-prev]'))select(current-1);else if(e.target.closest('[data-note-next]'))select(current+1);else if(e.target.closest('[data-note-hide]')){note.hidden=true;stage.querySelector(`[data-video-step="${current}"]`).focus({preventScroll:true});}};
 player.addEventListener('click',click);select(0);
 return()=>{player.removeEventListener('click',click);};
}
function setupRoutes(section,project){
 const data=project.sections.find(s=>s.id==='routes');if(!data)return;
 for(const node of [...section.children])if(!node.classList.contains('section-heading'))node.remove();
 section.classList.add('loofa-routes-editorial');
 const map=data.figures?.[0]||{src:'/assets/recordings/loofa-level-select.png',width:1280,height:720,alt:'Original Loofa Soup level-selection map'};
 const dialogue=data.dialogueFigures||[
 {src:'/assets/1577-8305-raw-1-06b0c478.webp',width:3406,height:2140,alt:'Original dialogue between Lufa and Onion Man',caption:'Lufa and Onion Man'},
 {src:'/assets/1577-8306-raw-1-e13b7f64.webp',width:3420,height:2142,alt:'Original dialogue between Lufa and Ekvin',caption:'Lufa and Ekvin'}
 ];
 section.insertAdjacentHTML('beforeend',`<div class="loofa-routes-layout"><figure class="loofa-route-map"><img src="${siteURL(map.src)}" alt="${esc(map.alt)}" width="${map.width}" height="${map.height}" loading="lazy" decoding="async"><figcaption>Two routes on the original chapter map</figcaption></figure><div class="loofa-route-copy"><p>${esc(data.body||'A dinner invitation opens two paths: work or family.')}</p>${(data.items||[]).map((item,i)=>`<article><span class="loofa-route-number">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></div></article>`).join('')}</div></div><div class="loofa-dialogue-intro"><h3>Before the meal</h3><p>${esc(data.dialogueIntro||'Before each chapter, Lufa talks with the guests.')}</p><div class="loofa-original-dialogues">${dialogue.map(f=>`<figure><img src="${siteURL(f.src)}" width="${f.width}" height="${f.height}" alt="${esc(f.alt)}" loading="lazy" decoding="async"><figcaption>${esc(f.caption)}</figcaption></figure>`).join('')}</div></div>`);
}
export function setupLoofaEditorial(root,project){
 if(project.id!=='loofasoup')return()=>{};
 const clean=[],title=root.querySelector('.project-title-row');
 const reclining=document.createElement('img');reclining.className='loofa-title-character';reclining.src=siteURL('/assets/games-revision/loofa/lufa-reclining.png');reclining.alt='Lufa reclining beside the title';reclining.width=569;reclining.height=399;const heading=title?.querySelector('h1');if(heading){const lockup=document.createElement('div');lockup.className='loofa-name-lockup';heading.before(lockup);lockup.append(heading,reclining);}
 const gameplay=root.querySelector('#gameplay');if(gameplay)clean.push(setupVideoAnnotations(gameplay,project));
 const routes=root.querySelector('#routes');if(routes)setupRoutes(routes,project);
 const joma=root.querySelector('[data-character=joma]');
 if(joma){const note=document.createElement('div');note.className='loofa-joma-personal';note.innerHTML=`<strong>That’s me!</strong><span><img src="${siteURL(art+'jojo-yoyo-original.png')}" width="166" height="95" alt="Jojo and Yoyo, the two dogs in the original portfolio"><span>Jojo + Yoyo</span></span>`;joma.append(note);}
 return()=>clean.forEach(fn=>fn());
}
