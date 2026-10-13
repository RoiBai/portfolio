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
  const layout=document.createElement('div');layout.className='loofa-gameplay-guide';
  const screen=document.createElement('div');screen.className='loofa-gameplay-film';if(recording)screen.append(recording);
  const explainer=document.createElement('ol');explainer.className='loofa-gameplay-notes';
  explainer.innerHTML=notes.map(([h,p],i)=>`<li data-loofa-note><span>${String(i+1).padStart(2,'0')}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join('');
  layout.append(screen,explainer);gameplay.append(layout);
 }
 const joma=root.querySelector('[data-character=joma]');
 if(joma){const note=document.createElement('div');note.className='loofa-joma-personal';note.innerHTML=`<strong>That’s me!</strong><span><img src="${siteURL(art+'jojo-yoyo-original.png')}" width="166" height="95" alt="Jojo and Yoyo, the two dogs in the original portfolio"><span>Jojo + Yoyo</span></span>`;joma.append(note);}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0;
 const update=()=>{raf=0;root.querySelectorAll('[data-loofa-note]').forEach(n=>n.classList.toggle('is-shown',reduced.matches||n.getBoundingClientRect().top<innerHeight*.86));};
 const queue=()=>{if(!raf)raf=requestAnimationFrame(update)};addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});reduced.addEventListener('change',queue);update();
 return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',queue);removeEventListener('resize',queue);reduced.removeEventListener('change',queue);clean.forEach(fn=>fn());};
}
