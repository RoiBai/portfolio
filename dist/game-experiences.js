// Original, inline excerpts. Source components and asset provenance are retained in
// /assets/games-revision/. setupGameExperiences() always returns a disposer.
const ASSETS = '/assets/games-revision';
const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const installed = new WeakMap();
let herModule;

const animals = [
  {id:'laika',name:'Laika',year:'1957',date:'3 November 1957',image:'laika-sputnik-2.png',
   title:'A journey without a return.',
   body:'Laika was sent into Earth orbit aboard Sputnik 2. The spacecraft had no return design. Later mission accounts corrected the early claim that she survived for days: she died within hours from overheating and stress.',
   note:'The change in the published account matters: visitors can compare the sources instead of treating the first report as final.',
   sources:[{name:'NASA · The first animal in orbit',url:'https://www.nasa.gov/history/60-years-ago-the-first-animal-in-orbit/'},{name:'Smithsonian · Laika’s one-way trip',url:'https://www.smithsonianmag.com/smithsonian-institution/sad-story-laika-space-dog-and-her-one-way-trip-orbit-1-180968728/'}]},
  {id:'freya',name:'Freya',year:'2022',date:'14 August 2022',image:'freya-oslo-walrus.png',
   title:'People did not keep their distance.',
   body:'Crowds repeatedly approached Freya in Oslofjord despite warnings. Authorities killed her, citing a continuing risk to people. A later examination confirmed that she had been healthy.',
   note:'Authorities and animal-protection groups disagreed about whether relocation or stricter separation were viable alternatives. The archive preserves that uncertainty.',
   sources:[{name:'Norwegian Veterinary Institute · Examination',url:'https://kommunikasjon.ntb.no/pressemelding/17939937/obduksjonen-av-hvalrossen-freya-er-klar?publisherId=17848243'},{name:'NOAH · Challenge to the decision',url:'https://www.dyrsrettigheter.no/rettsvern/noah-klager-avlivingen-av-freya-inn-til-sivilombudet/'}]},
];

export function renderGameExperience(projectId, part='all') {
  if(projectId==='hersound') {
    if(part==='all')return ['assemble','erase','restore'].map(p=>renderGameExperience(projectId,p)).join('');
    if(part==='assemble'||part==='restore')return `<div class="game-experience gx-her" data-experience="hersound-${part}">
      <p class="gx-instruction">${part==='assemble'?'<strong>Start with the first frame.</strong> Choose <strong>Lake</strong>, then select the frame. Add <strong>Waner</strong> and <strong>Taiping</strong> the same way. Both women belong in the picture because this is a journey they shared.':'<strong>Choose POWER below, then select each picture.</strong> The same people return with their agency restored. Watch the images change before reading their stories.'}</p>
      ${part==='assemble'?'<ol class="gx-her-guide"><li><strong>1 · Lake + Waner + Taiping</strong><span>A journey they took together.</span></li><li><strong>2 · Banquet + Waner + Taiping</strong><span>A meal they shared.</span></li><li><strong>3 · Poetry + Waner + Taiping</strong><span>Memories preserved in verse.</span></li></ol>':''}
      <div class="gx-her-island" data-her-part="${part}" aria-busy="true"><p class="gx-loading" role="status">Opening the scene…</p></div>
      <p class="gx-inline-status" role="status" aria-live="polite"></p>
    </div>`;
    if(part==='erase')return `<div class="game-experience gx-her gx-wind" data-experience="hersound-erase">
      <div class="gx-wind-track"><div class="gx-wind-panel">
        <p class="gx-instruction"><strong>Keep scrolling.</strong> Eighteen scenes hold their lives together. As you move down, parts of that history turn to dust. Scroll back to recover them.</p>
        <div class="gx-wind-art" aria-label="Eighteen scenes across six chapters">
          ${Array.from({length:18},(_,i)=>{const id=String(i+1).padStart(2,'0'),label=`Chapter ${Math.floor(i/3)+1}, scene ${i%3+1}`;return `<figure>${windProfiles[i]?`<canvas data-wind-src="${ASSETS}/her/wind/${id}.webp" data-wind-profile="${i}" role="img" aria-label="${label}; fragments disperse as you scroll"></canvas>`:`<img src="${ASSETS}/her/wind/${id}.webp" width="536" height="360" alt="${label}; a surviving record" decoding="async">`}<figcaption>${Math.floor(i/3)+1}.${i%3+1}</figcaption></figure>`;}).join('')}
        </div>
        <p class="gx-inline-status" role="status" aria-live="polite">All eighteen scenes are intact. Scroll down ↓</p>
      </div></div>
    </div>`;
  }
  if(projectId==='ourworld') {
    if(part==='all')return ['archive','candles'].map(p=>renderGameExperience(projectId,p)).join('');
    if(part==='archive')return `<div class="game-experience gx-archive" data-experience="ourworld-archive">
      <p class="gx-instruction">Choose an animal to read their story and original sources.</p>
      <div class="gx-animal-choices" role="group" aria-label="Two lives from the archive">${animals.map((a,i)=>`<button type="button" class="gx-animal" data-animal="${a.id}" aria-pressed="${i===0}" aria-controls="gx-animal-record"><img src="${ASSETS}/ourworld/${a.image}" width="1254" height="1254" alt="${a.name}, archive portrait" loading="lazy"><span>${a.name}</span><small>${a.year}</small></button>`).join('')}</div>
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
  let disposed=false,unmount=()=>{};
  const complete=e=>{section.querySelector('.gx-inline-status').textContent=e.detail.complete?(host.dataset.herPart==='assemble'?'All three scenes are complete.':'Their agency returns to view.'):'';};
  host.addEventListener('portfolio:game-experience',complete);
  herModule ||= import('./assets/games-revision/her/bundle/her-inline.js');
  herModule.then(module=>{
    if(disposed)return;
    unmount=module.mountHerExperience(host,host.dataset.herPart);
    host.setAttribute('aria-busy','false');
  }).catch(()=>{if(!disposed){host.innerHTML='<p>The scene could not load. <a href="https://she.ruiyuanbai.com/" target="_blank" rel="noopener noreferrer">Open the full game ↗</a></p>';host.setAttribute('aria-busy','false');}});
  return()=>{disposed=true;host.removeEventListener('portfolio:game-experience',complete);unmount();};
}

// Original target scenes, scroll behavior and wind equations. The eight animated
// images are sampled once on load; the ten surviving records remain native images.
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
    const phase=progress===0?'intact':progress>.98?'erased':'fading';if(phase!==lastPhase){lastPhase=phase;status.textContent=phase==='intact'?'All eighteen scenes are intact. Scroll down ↓':phase==='erased'?'Eight scenes have disappeared. Ten records remain.':'Parts of their lives are disappearing. Keep scrolling ↓';}
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(draw);};
  section.querySelectorAll('canvas').forEach(canvas=>{const image=new Image();image.onload=()=>{if(disposed)return;const source=document.createElement('canvas');source.width=Math.min(720,image.naturalWidth);source.height=Math.round(source.width*image.naturalHeight/image.naturalWidth);source.getContext('2d').drawImage(image,0,0,source.width,source.height);canvas.width=source.width;canvas.height=source.height;const profile=windProfiles[Number(canvas.dataset.windProfile)],parts=fragments(source,profile);states.push({canvas,image:source,profile,parts});canvas.dataset.ready='true';canvas.dataset.particleCount=String(parts.length);dirty=true;schedule();};image.src=canvas.dataset.windSrc;});
  const resize=()=>{track.style.setProperty('--gx-wind-panel-height',panel.offsetHeight+'px');dirty=true;schedule();};
  const observer=new ResizeObserver(resize);observer.observe(panel);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',resize);media.addEventListener('change',resize);resize();
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',resize);media.removeEventListener('change',resize);states.length=0;};
}
function setupArchive(section) {
  const record=section.querySelector('.gx-animal-record'),buttons=[...section.querySelectorAll('[data-animal]')];
  const select=id=>{const a=animals.find(a=>a.id===id);buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.animal===id)));section.dataset.selected=id;record.innerHTML=`<p class="gx-record-date">${esc(a.date)}</p><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p><p class="gx-record-note">${esc(a.note)}</p><div class="gx-sources">${a.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)} ↗</a>`).join('')}</div>`;};
  const click=e=>{const b=e.target.closest('[data-animal]');if(b&&section.contains(b))select(b.dataset.animal);};
  section.addEventListener('click',click);select('laika');return()=>section.removeEventListener('click',click);
}
function setupCandles(section) {
  const click=e=>{const b=e.target.closest('[data-candle]');if(!b||b.dataset.candle==='0')return;const lit=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(lit));b.setAttribute('aria-label',`${lit?'Put out':'Light'} candle ${Number(b.dataset.candle)+1}`);b.classList.toggle('is-lit',lit);b.classList.toggle('is-dark',!lit);const n=section.querySelectorAll('.candle.is-lit').length;section.querySelector('.candle-status').textContent=`${n} of 10 candles lit`;section.dataset.litCount=String(n);};
  section.dataset.litCount='1';section.addEventListener('click',click);return()=>section.removeEventListener('click',click);
}
export function setupGameExperiences(root=document) {
  const sections=[...(root.matches?.('[data-experience]')?[root]:[]),...root.querySelectorAll('[data-experience]')],disposers=[];
  for(const section of sections){installed.get(section)?.();const id=section.dataset.experience;const dispose=id==='hersound-erase'?setupWind(section):id.startsWith('hersound-')?setupHer(section):id==='ourworld-archive'?setupArchive(section):id==='ourworld-candles'?setupCandles(section):()=>{};installed.set(section,dispose);disposers.push(()=>{if(installed.get(section)===dispose){dispose();installed.delete(section);}});}
  return()=>disposers.forEach(dispose=>dispose());
}
