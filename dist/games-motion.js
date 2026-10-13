// Motion built from the portfolio's original source art. Nothing changes game state.
const rootAssets='/assets/games-motion';
const installed=new WeakMap();
const clamp=n=>Math.max(0,Math.min(1,n));
const noMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function setupCharacters(root){
 const figures=[...root.querySelectorAll('#characters .project-figure')];const clean=[];
 for(const f of figures){const img=f.querySelector('img');if(!img)continue;const id=img.getAttribute('src').match(/\/([^/]+)\.png$/)?.[1];if(!['lufa','onion-man','ave','lolo','hyber','aunty','ekvin','joma'].includes(id))continue;
 const normal=`${rootAssets}/loofa-${id}-normal.png`,active=`${rootAssets}/loofa-${id}-active.png`;
 // The original Onion Man has one face: retain it, with the same floating response.
 img.src=normal;img.removeAttribute('srcset');f.classList.add('loofa-character');f.dataset.character=id;
 const media=img.closest('.figure-media')||img.parentElement;const button=document.createElement('button');button.type='button';button.className='loofa-character-trigger';button.setAttribute('aria-label',id==='onion-man'?'Meet Onion Man':`Change ${id==='lufa'?'Lufa':id}'s expression`);button.setAttribute('aria-pressed','false');media.insertBefore(button,img);button.append(img);
 let pinned=false;const set=v=>{button.setAttribute('aria-pressed',String(v));f.classList.toggle('is-active',v);if(id!=='onion-man')img.src=v?active:normal;};
 const enter=()=>set(true),leave=()=>set(pinned),click=()=>{pinned=!pinned;set(pinned);};button.addEventListener('pointerenter',enter);button.addEventListener('pointerleave',leave);button.addEventListener('focus',enter);button.addEventListener('blur',leave);button.addEventListener('click',click);
 if(id!=='onion-man'){const pre=new Image();pre.src=active;}
 clean.push(()=>{button.removeEventListener('pointerenter',enter);button.removeEventListener('pointerleave',leave);button.removeEventListener('focus',enter);button.removeEventListener('blur',leave);button.removeEventListener('click',click);button.replaceWith(img);img.src=normal;f.classList.remove('is-active','loofa-character')});
 }
 return()=>clean.forEach(f=>f());
}
function setupMenu(root){
 const grid=root.querySelector('#production .dish-grid');if(!grid)return()=>{};
 const dishes=[...grid.querySelectorAll('.project-figure')].filter(f=>f.querySelector('img')?.src.includes('/loofa-dish-'));
 if(!dishes.length)return()=>{};
 const menu=document.createElement('div');menu.className='loofa-menu';menu.innerHTML='<div class="loofa-menu-heading"><span>On the menu · 26 dishes</span><button type="button" aria-pressed="false">Pause dishes Ⅱ</button></div><div class="loofa-menu-viewport" tabindex="0" aria-label="Scroll to explore the original dish artworks"><div class="loofa-menu-track"></div></div>';
 grid.prepend(menu);const track=menu.querySelector('.loofa-menu-track'),viewport=menu.querySelector('.loofa-menu-viewport'),control=menu.querySelector('button');dishes.forEach(d=>track.append(d));
 // Duplicate only the visual loop, hidden from the accessibility tree.
 const clone=document.createElement('div');clone.className='loofa-menu-loop';clone.setAttribute('aria-hidden','true');dishes.forEach(d=>clone.append(d.cloneNode(true)));track.append(clone);
 let raf=0,last=0,remainder=0,paused=noMotion(),hover=false,focus=false,visible=false,disposed=false;const initial=paused;
 const updateLabel=()=>{control.textContent=paused?'Play dishes ▷':'Pause dishes Ⅱ';control.setAttribute('aria-pressed',String(paused));};updateLabel();
 const tick=t=>{if(disposed)return;if(last&&visible&&!paused&&!hover&&!focus){remainder+=(Math.min(t-last,64)/1000)*21;const step=Math.floor(remainder);if(step){viewport.scrollLeft+=step;remainder-=step;}const half=clone.offsetLeft;if(half>0&&viewport.scrollLeft>=half)viewport.scrollLeft-=half;}last=t;raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);
 const toggle=()=>{paused=!paused;updateLabel();},enter=()=>hover=true,leave=()=>hover=false,focusin=()=>focus=true,focusout=()=>focus=false;
 control.addEventListener('click',toggle);viewport.addEventListener('pointerenter',enter);viewport.addEventListener('pointerleave',leave);viewport.addEventListener('focusin',focusin);viewport.addEventListener('focusout',focusout);
 const observer=new IntersectionObserver(e=>visible=e[0].isIntersecting);observer.observe(menu);
 return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();control.removeEventListener('click',toggle);viewport.removeEventListener('pointerenter',enter);viewport.removeEventListener('pointerleave',leave);viewport.removeEventListener('focusin',focusin);viewport.removeEventListener('focusout',focusout);dishes.forEach(d=>grid.insertBefore(d,menu));menu.remove()};
}
function setupAmbulanceMap(root){
 const section=root.querySelector('#city'),svg=section?.querySelector('.source-composition svg');if(!svg)return()=>{};
 const originals=[...svg.querySelectorAll('image')].filter(i=>i.getAttribute('href')?.includes('map-connection'));
 const allLabels=[...svg.querySelectorAll('foreignObject')];let disposed=false,raf=0;const layers=[],groups=[[],[],[]];
 allLabels.forEach(l=>{const x=+l.getAttribute('x'),y=+l.getAttribute('y');if(x>2100&&x<2800&&y>210){const g=y<340?0:y<455?1:2;groups[g].push(l);l.classList.add('game-map-label');}});
 const update=()=>{raf=0;if(disposed)return;const rect=svg.getBoundingClientRect(),p=noMotion()?1:clamp((innerHeight*.84-rect.top)/Math.max(260,rect.height*.95));section.dataset.mapProgress=p.toFixed(3);for(let i=0;i<3;i++){const local=noMotion()?1:clamp((p-i*.23)/.36);groups[i].forEach(l=>{l.style.opacity=String(local);l.style.transform=`translateY(${(1-local)*10}px)`;});for(const{node,index}of layers)if(index===i){node.style.clipPath=`inset(0 ${(1-local)*100}% 0 0)`;node.style.opacity=String(clamp(local*2));}}};
 const queue=()=>{if(!raf)raf=requestAnimationFrame(update);};
 Promise.all(originals.map(async original=>{try{const src=original.getAttribute('href'),raw=await(await fetch(src)).text();if(disposed)return;const parsed=new DOMParser().parseFromString(raw,'image/svg+xml').documentElement;if(parsed.localName!=='svg')return;const nested=document.importNode(parsed,true);for(const k of['x','y','width','height'])nested.setAttribute(k,original.getAttribute(k));nested.classList.add('game-map-line');nested.setAttribute('aria-hidden','true');original.replaceWith(nested);layers.push({node:nested,index:Number(src.match(/connection(\d)/)?.[1]||1)-1});queue();}catch{ /* Original image remains visible if a vector cannot be loaded. */}})).then(queue);
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});queue();
 return()=>{disposed=true;cancelAnimationFrame(raf);removeEventListener('scroll',queue);removeEventListener('resize',queue)};
}
function setupRecording(root){let figure=root.querySelector('.loofa-recording');if(!figure){const section=root.querySelector('#gameplay');if(!section)return()=>{};figure=document.createElement('figure');figure.className='loofa-recording';figure.innerHTML='<video class="loofa-real-recording" src="/assets/recordings/loofa-original-gameplay.webm" poster="/assets/recordings/loofa-original-gameplay-poster.png" width="1280" height="720" controls muted loop playsinline preload="metadata" aria-label="Original Loofa Soup level 3: rotating the table and eating with Lufa, Ave and Kevin Lau"></video><figcaption><span>Level 3 · 25-second loop</span><p>Rotate the table and choose when to eat with Lufa, Ave and Kevin Lau. <a href="#play">Try it yourself ↑</a></p></figcaption>';section.append(figure);}const video=figure.querySelector('video');if(!video)return()=>{};const reduced=matchMedia('(prefers-reduced-motion: reduce)');const observer=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!reduced.matches)video.play().catch(()=>{});else video.pause();},{threshold:.25});observer.observe(video);return()=>{observer.disconnect();video.pause();video.removeAttribute('src');video.load();figure.remove()};}
export function setupGamesMotion(root=document){installed.get(root)?.();const clean=[];if(document.body.dataset.project==='loofasoup'){clean.push(setupCharacters(root),setupRecording(root));}if(document.body.dataset.project==='ambulance')clean.push(setupAmbulanceMap(root));const dispose=()=>clean.forEach(f=>f());installed.set(root,dispose);return()=>{if(installed.get(root)===dispose){dispose();installed.delete(root)}};}
