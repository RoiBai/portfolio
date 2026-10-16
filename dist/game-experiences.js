// Original, inline excerpts. Source components and asset provenance are retained in
// /assets/games-revision/. setupGameExperiences() always returns a disposer.
const ASSETS = '/assets/games-revision';
const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const installed = new WeakMap();
let herModule;

const animals = [
  {
    "id": "chunee-exeter-exchange",
    "name": "Chunee",
    "year": "1826",
    "date": "March 1826",
    "image": "chunee-exeter-exchange.png",
    "title": "Chunee was shot inside a menagerie",
    "body": "Years of menagerie confinement ended in a prolonged public killing at Exeter Exchange, London.",
    "note": "Contemporary accounts disagree on the exact number of shots.",
    "sources": [
      {
        "name": "London Museum · Chunee the elephant",
        "url": "https://www.londonmuseum.org.uk/collections/v/object-99934/the-destruction-of-the-elephant-at-exeter-change-march-1st1826/"
      }
    ],
    "species": "Asian elephant",
    "width": 1024,
    "height": 1024
  },
  {
    "id": "eldey-last-great-auks",
    "name": "The great auk pair",
    "year": "1844",
    "date": "1844",
    "image": "eldey-last-great-auks.png",
    "title": "Collectors killed the last confirmed great auk pair",
    "body": "Fishermen killed a breeding pair to supply museum collectors at Eldey Island.",
    "note": "The date is shown at year precision; the linked museum account places the event in summer.",
    "sources": [
      {
        "name": "Smithsonian Institution · Research Case: The Great Auk",
        "url": "https://www.si.edu/exhibitions/research-case-great-auk%3Aevent-exhib-4482"
      },
      {
        "name": "Cincinnati Museum Center · Cincinnati specimen helps solve 180-year extinction mystery",
        "url": "https://www.cincymuseum.org/press/great-auk-paper/"
      }
    ],
    "species": "Great auks",
    "width": 1024,
    "height": 1024
  },
  {
    "id": "balaclava-light-brigade-horses",
    "name": "Light Brigade horses",
    "year": "1854",
    "date": "October 25, 1854",
    "image": "balaclava-light-brigade-horses.png",
    "title": "The Light Brigade's horses were ordered into artillery fire",
    "body": "A misunderstood military order sent the British Light Brigade directly toward Russian guns; the National Army Museum records the loss of 475 horses.",
    "note": "Contemporary records do not agree on how many of the 475 died during the charge versus after injury.",
    "sources": [
      {
        "name": "National Army Museum · The order that launched the Charge of the Light Brigade, 1854",
        "url": "https://collection.nam.ac.uk/detail.php?acc=1962-11-4-3"
      },
      {
        "name": "National Army Museum · Battle of Balaklava",
        "url": "https://www.nam.ac.uk/explore/battle-balaklava"
      }
    ],
    "species": "Military horses",
    "width": 1024,
    "height": 1024
  },
  {
    "id": "cher-ami-1918",
    "name": "Cher Ami",
    "year": "1918",
    "date": "4 October 1918",
    "image": "cher-ami-pigeon.png",
    "title": "A message carried through gunfire",
    "body": "Cher Ami carried a message to stop friendly fire during the First World War. Wounded on the flight, the pigeon survived for several months and died in 1919.",
    "note": "The bird’s sex, the cause of individual wounds and some mission details remain disputed.",
    "sources": [
      {
        "name": "Smithsonian Institution · Solving a 100-Year-Old Mystery About a Pigeon",
        "url": "https://www.smithsonianmag.com/blogs/national-museum-american-history/2021/07/19/cher-ami/"
      },
      {
        "name": "U.S. National Archives · The Lost Battalion and the Message of Cher Ami",
        "url": "https://prologue.blogs.archives.gov/2018/10/04/cher-ami/"
      }
    ],
    "species": "Homing pigeon",
    "width": 1024,
    "height": 1024
  },
  {
    "id": "thylacine-1936",
    "name": "The last captive thylacine",
    "year": "1936",
    "date": "7 September 1936",
    "image": "last-captive-thylacine.png",
    "title": "The last known thylacine died in captivity",
    "body": "Hunting and bounty schemes depleted the species. The last known captive thylacine died at Hobart Zoo; no later surviving animal has been scientifically confirmed.",
    "note": "The animal’s name, sex and immediate cause of death remain uncertain.",
    "sources": [
      {
        "name": "Queen Victoria Museum & Art Gallery · Tasmanian Tiger: precious little remains",
        "url": "https://www.qvmag.tas.gov.au/Whats-on/Museum-at-Inveresk/Tasmanian-Tiger-precious-little-remains"
      },
      {
        "name": "National Museum of Australia · Extinction of thylacine",
        "url": "https://www.nma.gov.au/defining-moments/resources/extinction-of-thylacine"
      }
    ],
    "species": "Thylacine",
    "width": 1024,
    "height": 1024
  },
  {
    "id": "laika-1957",
    "name": "Laika",
    "year": "1957",
    "date": "3 November 1957",
    "image": "laika-sputnik-2.png",
    "title": "A journey without a return",
    "body": "Laika was sent into orbit aboard Sputnik 2, a spacecraft with no return design. She died within hours from overheating and stress.",
    "note": "Later mission accounts corrected the early claim that she had survived for days.",
    "sources": [
      {
        "name": "NASA · 60 Years Ago: The First Animal in Orbit",
        "url": "https://www.nasa.gov/history/60-years-ago-the-first-animal-in-orbit/"
      },
      {
        "name": "Smithsonian Magazine · The Sad, Sad Story of Laika, the Space Dog",
        "url": "https://www.smithsonianmag.com/smithsonian-institution/sad-story-laika-space-dog-and-her-one-way-trip-orbit-1-180968728/"
      }
    ],
    "species": "Domestic dog",
    "width": 1024,
    "height": 1024
  },
  {
    "id": "skylab-spiders-1973",
    "name": "Arabella and Anita",
    "year": "1973",
    "date": "28 July 1973",
    "image": "arabella-anita-skylab.png",
    "title": "Two spiders in an orbital experiment",
    "body": "Arabella and Anita were sent to Skylab to study web-building in weightlessness. Both spiders died around the end of the mission and were preserved as specimens.",
    "note": "The archive follows the NASA and Smithsonian records linked below.",
    "sources": [
      {
        "name": "NASA · A Brief History of Animals in Space",
        "url": "https://www.nasa.gov/history/a-brief-history-of-animals-in-space/"
      },
      {
        "name": "Smithsonian National Air and Space Museum · Spider, Arabella, Skylab 3",
        "url": "https://airandspace.si.edu/collection-objects/spider-arabella-skylab-3/nasm_A19740993000"
      }
    ],
    "species": "Cross orb-weaver spiders",
    "width": 1024,
    "height": 1024
  },
  {
    "id": "sandoz-rhine-fish",
    "name": "Rhine river fish",
    "year": "1986",
    "date": "November 1, 1986",
    "image": "sandoz-rhine-fish.png",
    "title": "Chemical firefighting runoff killed Rhine fish",
    "body": "Firefighting water carried pesticides and chemicals from a warehouse into the Rhine near Basel, killing fish downstream.",
    "note": "Mortality can only be estimated by reach and species; sources agree on mass fish death.",
    "sources": [
      {
        "name": "International Commission for the Protection of the Rhine · The turning point: the Sandoz accident",
        "url": "https://www.iksr.org/en/icpr/about-us/history/the-turning-point-the-sandoz-accident/"
      },
      {
        "name": "Eawag · Rhine running red, fish dead — 30th anniversary",
        "url": "https://www.eawag.ch/en/info/portal/news/news-archive/archive-detail/rhine-running-red-fish-dead-30th-anniversary-of-the-sandoz-blaze/"
      }
    ],
    "species": "European eels and other river fish",
    "width": 1024,
    "height": 1024
  },
  {
    "id": "ming-ocean-quahog",
    "name": "Ming / Hafrún",
    "year": "2006",
    "date": "2006",
    "image": "ming-ocean-quahog.png",
    "title": "Ming died after being collected for research",
    "body": "Collected alive in Icelandic coastal waters in 2006, Ming was later found to have lived for 507 years. Its shell held a long record of marine climate.",
    "note": "The team could not know the live animal's exact age before opening the shell; it was not deliberately killed after its age was known.",
    "sources": [
      {
        "name": "Bangor University · Clam found to be over 500 years old",
        "url": "https://www.bangor.ac.uk/news/archive/clam-found-to-be-over-500-years-old-16781"
      },
      {
        "name": "Nature Portfolio blog · A clam named Ming",
        "url": "https://blogs.nature.com/blog/a_clam_named_ming/"
      }
    ],
    "species": "Ocean quahog",
    "width": 1024,
    "height": 1024
  },
  {
    "id": "juma-2016",
    "name": "Juma",
    "year": "2016",
    "date": "20 June 2016",
    "image": "juma-olympic-jaguar.png",
    "title": "A jaguar brought to a torch ceremony",
    "body": "Juma was taken to an Olympic torch event under military control. After escaping restraint, she was shot by soldiers when sedation failed.",
    "note": "The army’s account describes an immediate safety threat; public footage cannot establish the full sequence.",
    "sources": [
      {
        "name": "Brazilian Army via Reuters · Army statement on Juma's death",
        "url": "https://www.newsweek.com/jaguar-shot-dead-brazil-escaped-soldier-juma-amazon-olympics-manaus-amazon-472950"
      },
      {
        "name": "Agência Brasil via AS · IPAAM notification and Rio 2016 response",
        "url": "https://as.com/masdeporte/2016/06/22/juegosolimpicos/1466593276_686613.html"
      }
    ],
    "species": "Jaguar",
    "width": 1024,
    "height": 1024
  }
];

export function renderGameExperience(projectId, part='all') {
  if(projectId==='hersound') {
    if(part==='all')return ['assemble','erase','restore'].map(p=>renderGameExperience(projectId,p)).join('');
    if(part==='assemble'||part==='restore')return `<div class="game-experience gx-her" data-experience="hersound-${part}">
      <div class="gx-her-layout"><aside class="gx-play-guide">
        <p class="gx-guide-kicker">${part==='assemble'?'A guided chapter':'The final chapter'}</p>
        <div class="gx-guide-icons" aria-hidden="true"><img src="${ASSETS}/her/game/choice-normalized/${part==='assemble'?'shangguan-waner':'power'}.png" alt="">${part==='assemble'?`<img src="${ASSETS}/her/game/choice-normalized/princess-taiping.png" alt="">`:''}</div>
        <h3>${part==='assemble'?'Bring them into the same story':'Give them the power to act'}</h3>
        <p class="gx-instruction">${part==='assemble'?'The first frame is complete. Taiping is selected for you: add her to the second frame, then build the last scene.':'Choose <strong>POWER</strong>. Select each picture to restore their agency.'}</p>
        ${part==='assemble'?'<ol class="gx-her-guide"><li><strong>01 · A completed example</strong><span>Lake + Waner + Taiping</span></li><li><strong>02 · Add Taiping</strong><span>Waner and the banquet are already here</span></li><li><strong>03 · Build it yourself</strong><span>Poetry + Waner + Taiping</span></li></ol>':'<p class="gx-guide-meaning">In this last puzzle, the change is in who gets to define their lives. The same women become political actors and trusted allies.</p>'}
        <a class="gx-full-game" href="https://she.ruiyuanbai.com/" target="_blank" rel="noopener noreferrer">Play the complete story ↗</a>
      </aside><div class="gx-her-island" data-her-part="${part}" aria-busy="true"><p class="gx-loading" role="status">Opening the scene…</p></div></div>
      <p class="gx-inline-status" role="status" aria-live="polite"></p>
    </div>`;
    if(part==='erase')return `<div class="game-experience gx-her gx-wind" data-experience="hersound-erase">
      <div class="gx-wind-track"><div class="gx-wind-panel">
        <p class="gx-instruction"><strong>Six chapters become eighteen scenes.</strong> As you scroll, eight scenes dissolve. The gaps make the loss of their stories visible. Scroll back to recover them.</p>
        <div class="gx-wind-art" aria-label="Eighteen scenes across six chapters">
          ${Array.from({length:18},(_,i)=>{const id=String(i+1).padStart(2,'0'),label=`Chapter ${Math.floor(i/3)+1}, scene ${i%3+1}`;return `<figure>${windProfiles[i]?`<canvas data-wind-src="${ASSETS}/her/wind/${id}.webp" data-wind-profile="${i}" role="img" aria-label="${label}; fragments disperse as you scroll"></canvas>`:`<img src="${ASSETS}/her/wind/${id}.webp" width="536" height="360" alt="${label}; a surviving scene" decoding="async">`}<figcaption>${Math.floor(i/3)+1}.${i%3+1}</figcaption></figure>`;}).join('')}
        </div>
        <p class="gx-inline-status" role="status" aria-live="polite">All eighteen scenes are intact. Scroll down ↓</p>
      </div></div>
    </div>`;
  }
  if(projectId==='ourworld') {
    if(part==='all')return ['archive','candles'].map(p=>renderGameExperience(projectId,p)).join('');
    if(part==='archive')return `<div class="game-experience gx-archive" data-experience="ourworld-archive">
      <div class="gx-archive-top"><p class="gx-instruction">Dates mark each event, not necessarily an animal’s death.</p><a class="gx-full-game" href="https://www.ruiyuanbai.com/art/Earth-is-not-humanitys-alone/demo" target="_blank" rel="noopener noreferrer">Explore the full archive ↗</a></div>
      <div class="gx-timeline-window" tabindex="0" aria-label="Scroll through ten selected animal histories"><div class="gx-animal-choices" role="group" aria-label="Selected cases from 1826 to 2016">${animals.map((a,i)=>`<button type="button" class="gx-animal" data-animal="${a.id}" aria-pressed="${i===0}" aria-controls="gx-animal-record"><small>${a.year}</small><span class="gx-timeline-dot" aria-hidden="true"></span><img src="${ASSETS}/ourworld/${a.image}" width="${a.width}" height="${a.height}" alt="${a.name}, archive portrait" loading="lazy"><span>${a.name}</span></button>`).join('')}</div></div>
      <div class="gx-animal-record" id="gx-animal-record" aria-live="polite"></div>
    </div>`;
    if(part==='candles')return `<div class="game-experience gx-candles" data-experience="ourworld-candles">
      <p class="gx-instruction">One candle stays lit for the recorded lives. Light the others for those still missing from the archive.</p>
      <div class="candle-scene"><div class="candle-wall" aria-hidden="true"></div><div class="candle-row" role="group" aria-label="Ten memorial candles">${Array.from({length:10},(_,i)=>`<button class="candle ${i===0?'is-lit':'is-dark'}" type="button" data-candle="${i}" aria-pressed="${i===0}" ${i===0?'aria-disabled="true"':''} aria-label="${i===0?'Candle 1, always lit for the recorded lives':`Light candle ${i+1}`}" ><span class="candle-flame" aria-hidden="true"><i></i></span><span class="candle-wick" aria-hidden="true"></span><span class="candle-rim" aria-hidden="true"></span><span class="candle-body" aria-hidden="true"><i></i></span><span class="candle-base" aria-hidden="true"></span></button>`).join('')}</div><div class="candle-shelf" aria-hidden="true"></div><p class="candle-status" role="status" aria-live="polite">1 of 10 candles lit</p></div>
      <p class="gx-caption">Click or tap a candle to light it; select it again to put it out. Keyboard: Tab, then Enter or Space.</p>
    </div>`;
  }
  return '';
}

function setupHer(section) {
  const host=section.querySelector('[data-her-part]');
  let disposed=false,unmount=()=>{},collapseFrame=0;
  const collapse=()=>{
    cancelAnimationFrame(collapseFrame);
    collapseFrame=requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(disposed||host.dataset.herPart!=='restore')return;
      const stage=host.querySelector('.final-chapter'),board=host.querySelector('.final-chapter-board');
      if(!stage||!board)return;
      if(host.dataset.complete!=='true'){stage.style.removeProperty('height');stage.classList.remove('gx-completed-stage');return;}
      const top=board.getBoundingClientRect().top;
      const bottom=Math.max(...[...board.querySelectorAll('.final-chapter-slot,.final-chapter-slot-wrap>p')].map(el=>el.getBoundingClientRect().bottom));
      stage.style.height=Math.ceil(bottom-top+24)+'px';stage.classList.add('gx-completed-stage');
    }));
  };
  const complete=e=>{
    section.classList.toggle('is-done',e.detail.complete);
    section.querySelector('.gx-inline-status').textContent=e.detail.complete?(host.dataset.herPart==='assemble'?'All three scenes are complete.':'Their agency returns to view.'):'';
    collapse();
  };
  window.addEventListener('resize',collapse);
  host.addEventListener('portfolio:game-experience',complete);
  herModule ||= import('./assets/games-revision/her/bundle/her-inline.js');
  herModule.then(module=>{
    if(disposed)return;
    unmount=module.mountHerExperience(host,host.dataset.herPart);
    host.setAttribute('aria-busy','false');
  }).catch(()=>{if(!disposed){host.innerHTML='<p>The scene could not load. <a href="https://she.ruiyuanbai.com/" target="_blank" rel="noopener noreferrer">Open the full game ↗</a></p>';host.setAttribute('aria-busy','false');}});
  return()=>{disposed=true;cancelAnimationFrame(collapseFrame);window.removeEventListener('resize',collapse);host.removeEventListener('portfolio:game-experience',complete);unmount();};
}

// Original target scenes, scroll behavior and wind equations. The eight animated
// images are sampled once on load; the ten surviving scenes remain native images.
const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
const windProfiles={6:{angle:-.12,delay:.02,duration:.68,gust:1.05,lift:.42,seed:113},7:{angle:.22,delay:.08,duration:.72,gust:.88,lift:.76,seed:227},8:{angle:-.34,delay:.15,duration:.66,gust:1.18,lift:.31,seed:349},9:{angle:.08,delay:.21,duration:.7,gust:.95,lift:.58,seed:463},11:{angle:.27,delay:.26,duration:.64,gust:1.12,lift:.69,seed:521},13:{angle:-.2,delay:.3,duration:.62,gust:1.26,lift:.48,seed:587},16:{angle:.31,delay:.39,duration:.58,gust:1.04,lift:.82,seed:701},17:{angle:-.05,delay:.47,duration:.5,gust:1.34,lift:.63,seed:829}};
function seeded(seed){let state=seed>>>0;return()=>{state+=0x6d2b79f5;let v=state;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};}
function fragments(image,p) {
  const sample=document.createElement('canvas');sample.width=image.width;sample.height=image.height;
  const ctx=sample.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
  const pixels=ctx.getImageData(0,0,sample.width,sample.height).data,random=seeded(p.seed),result=[];
  const step=Math.max(3,Math.ceil(sample.width/110));
  for(let y=0;y<sample.height;y+=step)for(let x=0;x<sample.width;x+=step){
    const at=(Math.min(sample.height-1,y+1)*sample.width+Math.min(sample.width-1,x+1))*4,a=pixels[at+3];if(a<18)continue;
    const h=x/Math.max(1,sample.width-1),v=y/Math.max(1,sample.height-1),wave=Math.sin(h*13.7+p.seed*.07)+Math.cos(v*16.1-p.seed*.03)+Math.sin((h+v)*21.3);
    result.push({x,y,size:step+(random()>.82?1:0),activation:clamp(.08+(p.angle>=0?h:1-h)*.52+(wave+3)*.045+random()*.16,.04,.9),velocity:.62+random()*.82,wobble:(random()-.5)*2,phase:random()*Math.PI*2,color:`rgba(${pixels[at]},${pixels[at+1]},${pixels[at+2]},${a/255})`});
  }return result;
}
function setupWind(section) {
  const track=section.querySelector('.gx-wind-track'),panel=section.querySelector('.gx-wind-panel'),status=section.querySelector('.gx-inline-status'),media=matchMedia('(prefers-reduced-motion: reduce)');
  let disposed=false,raf=0,lastProgress=-1,dirty=true,lastPhase='';const states=[];
  const draw=()=>{raf=0;if(disposed)return;const top=Number.parseFloat(getComputedStyle(panel).top)||80,rect=track.getBoundingClientRect(),progress=clamp((top-rect.top)/Math.max(1,track.offsetHeight-panel.offsetHeight));section.dataset.progress=progress.toFixed(4);
    if(!dirty&&Math.abs(progress-lastProgress)<.0005)return;dirty=false;lastProgress=progress;section.dataset.drawCount=String(Number(section.dataset.drawCount||0)+1);
    for(const s of states){const{canvas,image,profile,parts}=s,ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.globalAlpha=1;
      const local=clamp((progress-profile.delay)/profile.duration);
      if(media.matches){ctx.globalAlpha=1-local;ctx.drawImage(image,0,0);ctx.globalAlpha=1;continue;}
      if(local<=.001){ctx.drawImage(image,0,0);continue;}
      for(const f of parts){if(local<=f.activation){ctx.drawImage(image,f.x,f.y,f.size,f.size,f.x,f.y,f.size+.35,f.size+.35);continue;}
        const life=clamp((local-f.activation)/Math.max(.08,1-f.activation));if(life>=.995)continue;
        const gust=Math.pow(life,1.35)*canvas.width*.72*profile.gust*f.velocity,swirl=Math.sin(life*11+f.phase)*(4+19*life)*f.wobble;
        const dx=(profile.angle>=0?1:-1)*gust+swirl,dy=-Math.pow(life,1.08)*canvas.height*.34*profile.lift+Math.sin(life*7+f.phase)*8*f.wobble,size=Math.max(.45,f.size*(1-life*.72));
        ctx.globalAlpha=Math.pow(1-life,1.35);if(life<.48)ctx.drawImage(image,f.x,f.y,f.size,f.size,f.x+dx,f.y+dy,size,size);else{ctx.fillStyle=f.color;ctx.fillRect(f.x+dx,f.y+dy,size,Math.max(.45,size*.58));}
      }ctx.globalAlpha=1;
    }
    const phase=progress===0?'intact':progress>.98?'erased':'fading';if(phase!==lastPhase){lastPhase=phase;status.textContent=phase==='intact'?'All eighteen scenes are intact. Scroll down ↓':phase==='erased'?'Eight scenes have disappeared. Ten scenes remain.':'Parts of their lives are disappearing. Keep scrolling ↓';}
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(draw);};
  section.querySelectorAll('canvas').forEach(canvas=>{const image=new Image();image.onload=()=>{if(disposed)return;const source=document.createElement('canvas');source.width=Math.min(720,image.naturalWidth);source.height=Math.round(source.width*image.naturalHeight/image.naturalWidth);source.getContext('2d').drawImage(image,0,0,source.width,source.height);canvas.width=source.width;canvas.height=source.height;const profile=windProfiles[Number(canvas.dataset.windProfile)],parts=fragments(source,profile);states.push({canvas,image:source,profile,parts});canvas.dataset.ready='true';canvas.dataset.particleCount=String(parts.length);dirty=true;schedule();};image.src=canvas.dataset.windSrc;});
  const resize=()=>{track.style.setProperty('--gx-wind-panel-height',panel.offsetHeight+'px');dirty=true;schedule();};
  const observer=new ResizeObserver(resize);observer.observe(panel);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',resize);media.addEventListener('change',resize);resize();
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',resize);media.removeEventListener('change',resize);states.length=0;};
}
function setupArchive(section) {
  const record=section.querySelector('.gx-animal-record'),buttons=[...section.querySelectorAll('[data-animal]')];
  const select=id=>{if(section.dataset.selected===id)return;const a=animals.find(a=>a.id===id);if(!a)return;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.animal===id)));section.dataset.selected=id;record.innerHTML=`<figure class="gx-selected-portrait"><img src="${ASSETS}/ourworld/${a.image}" width="${a.width}" height="${a.height}" alt="${esc(a.name)}"><figcaption>${esc(a.species)}</figcaption></figure><div class="gx-record-copy"><p class="gx-record-date">${esc(a.date)}</p><h3>What happened to ${esc(a.name.replace(/^The /,'the '))}?</h3><p class="gx-record-summary">${esc(a.title)}</p><p>${esc(a.body)}</p><p class="gx-record-note">${esc(a.note)}</p><div class="gx-sources">${a.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)} ↗</a>`).join('')}</div></div>`;};
  const click=e=>{const b=e.target.closest('[data-animal]');if(b&&section.contains(b))select(b.dataset.animal);};
  const hover=e=>{if(e.pointerType!=='mouse')return;const b=e.target.closest('[data-animal]');if(b&&section.contains(b))select(b.dataset.animal);};
  const focus=e=>{const b=e.target.closest('[data-animal]');if(b&&section.contains(b))select(b.dataset.animal);};
  section.addEventListener('click',click);section.addEventListener('pointermove',hover);section.addEventListener('focusin',focus);select('laika-1957');
  return()=>{section.removeEventListener('click',click);section.removeEventListener('pointermove',hover);section.removeEventListener('focusin',focus);};
}
function setupCandles(section) {
  const click=e=>{const b=e.target.closest('[data-candle]');if(!b||b.dataset.candle==='0')return;const lit=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(lit));b.setAttribute('aria-label',`${lit?'Put out':'Light'} candle ${Number(b.dataset.candle)+1}`);b.classList.toggle('is-lit',lit);b.classList.toggle('is-dark',!lit);const n=section.querySelectorAll('.candle.is-lit').length;section.querySelector('.candle-status').textContent=`${n} of 10 candles lit`;section.dataset.litCount=String(n);};
  section.dataset.litCount='1';section.addEventListener('click',click);return()=>section.removeEventListener('click',click);
}

function setupHerArticle(root) {
  const containers=root.querySelectorAll('.case-study .hero-bottom>p,.case-study .section-body,.case-study #abstract figcaption,.her-abstract-copy,.her-accusations,.her-wish-words,.gx-play-guide');
  const labels=[];
  for(const container of containers){
    const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);const nodes=[];
    while(walker.nextNode()){const node=walker.currentNode;if(/\b(Waner|Taiping)\b/.test(node.textContent)&&!node.parentElement.closest('.her-name'))nodes.push(node);}
    for(const node of nodes){const fragment=document.createDocumentFragment();for(const text of node.textContent.split(/(\bWaner\b|\bTaiping\b)/)){if(text==='Waner'||text==='Taiping'){const mark=document.createElement('span');mark.className='her-name her-name-'+text.toLowerCase();mark.textContent=text;fragment.append(mark);labels.push(mark);}else fragment.append(document.createTextNode(text));}node.replaceWith(fragment);}
  }
  return()=>labels.forEach(mark=>mark.replaceWith(document.createTextNode(mark.textContent)));
}
function setupArchiveHero(root) {
  const figure=root.querySelector('.case-hero .hero-figure'),media=figure?.querySelector('.figure-media');if(!media)return()=>{};
  const original=[...media.childNodes];const gallery=document.createElement('div');gallery.className='gx-hero-menagerie';gallery.setAttribute('role','img');gallery.setAttribute('aria-label','Five archive portraits: Chunee, Laika, Freya, the great auk pair and Juma');
  const portraits=[['chunee-exeter-exchange','Chunee'],['laika-sputnik-2','Laika'],['freya-oslo-walrus','Freya'],['eldey-last-great-auks','Great auks'],['juma-olympic-jaguar','Juma']];
  gallery.innerHTML=portraits.map(([id,name],i)=>`<img class="gx-hero-animal gx-hero-animal-${i}" src="${ASSETS}/ourworld/${id}.png" alt="${name}" width="1254" height="1254" decoding="async">`).join('');media.replaceChildren(gallery);figure.classList.add('gx-archive-hero');
  return()=>{media.replaceChildren(...original);figure.classList.remove('gx-archive-hero');};
}

export function setupGameExperiences(root=document) {
  const sections=[...(root.matches?.('[data-experience]')?[root]:[]),...root.querySelectorAll('[data-experience]')],disposers=[];
  if(document.body.dataset.project==='hersound')disposers.push(setupHerArticle(root));
  if(document.body.dataset.project==='ourworld')disposers.push(setupArchiveHero(root));
  for(const section of sections){installed.get(section)?.();const id=section.dataset.experience;const dispose=id==='hersound-erase'?setupWind(section):id.startsWith('hersound-')?setupHer(section):id==='ourworld-archive'?setupArchive(section):id==='ourworld-candles'?setupCandles(section):()=>{};installed.set(section,dispose);disposers.push(()=>{if(installed.get(section)===dispose){dispose();installed.delete(section);}});}
  return()=>disposers.forEach(dispose=>dispose());
}
