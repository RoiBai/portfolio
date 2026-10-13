/* One continuous aperture: the destination appears as the two code seams part. */
(() => {
 if(window.PortfolioCodeFlow)return;
 const KEY='portfolio:aperture:v3',ORIGIN='portfolio:aperture-origin:v3';
 const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const read=k=>{try{return JSON.parse(sessionStorage.getItem(k)||'null')}catch{return null}};
 const write=(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify(v))}catch{}};
 const remove=k=>{try{sessionStorage.removeItem(k)}catch{}};
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 let seams=[],pending=null,active=null,starts=0,lastNavigation=null;
 const isHome=()=>!!document.querySelector('#name-hero');
 function bounds(el){const b=el?.closest?.('.project-row,.group-row,.project-next')?.getBoundingClientRect();return b?{top:clamp(b.top,0,innerHeight-48),bottom:clamp(b.bottom,48,innerHeight),row:el.closest('.project-row,.group-row,.project-next').id||el.closest('.project-row,.group-row,.project-next').getAttribute('href')||''}:{top:innerHeight*.4,bottom:innerHeight*.6,row:''}}
 function ensure(){if(seams.length)return;for(const side of ['top','bottom']){const el=document.createElement('div');el.className='code-seam code-seam-'+side;el.setAttribute('aria-hidden','true');el.innerHTML=Array.from({length:22},(_,i)=>`<span>${['const','{','01','view','→','return','[]','open',';','story'][i%10]}</span>`).join('');root.append(el);seams.push(el)}}
 function prepare(b,entering=false){ensure();root.style.setProperty('--aperture-top',b.top+'px');root.style.setProperty('--aperture-bottom',(innerHeight-b.bottom)+'px');root.classList.add('project-opening');seams.forEach((el,i)=>{el.hidden=false;el.style.viewTransitionName='code-'+(i?'bottom':'top');el.style.top=(entering?(i?innerHeight+10:-34):(i?b.bottom:b.top)-12)+'px'});}
 function clean(){root.classList.remove('project-opening');for(const el of seams){el.hidden=true;el.style.viewTransitionName='none'}active=null;pending=null;}
 function track(vt,kind,to){active=vt;starts++;lastNavigation={kind,to,delayMs:0};vt.finished.catch(()=>{}).finally(clean);vt.ready.catch(()=>{});}
 const marker=read(KEY);if(marker&&Date.now()-marker.at<15000){root.classList.add('project-opening');root.style.setProperty('--aperture-top',marker.top+'px');root.style.setProperty('--aperture-bottom',(innerHeight-marker.bottom)+'px');}
 window.addEventListener('pageswap',e=>{
  if(!e.viewTransition||reduce.matches)return;
  const to=e.activation?.entry?.url||pending?.to||'';
  const b=pending||read(ORIGIN)||bounds(null);
  prepare(b);write(KEY,{...b,to,at:Date.now()});
  e.viewTransition.finished.finally(()=>{for(const el of seams){el.hidden=true;el.style.viewTransitionName='none'}});
 });
 window.addEventListener('pagereveal',e=>{
  const b=read(KEY);remove(KEY);
  if(!e.viewTransition||reduce.matches){e.viewTransition?.skipTransition();clean();return;}
  if(!b||Date.now()-b.at>15000){e.viewTransition.skipTransition();clean();return;}
  prepare(b,true);
  // Restore the index before its first snapshot, so a return never opens at the top.
  if(isHome())window.PortfolioRestoreHome?.();
  track(e.viewTransition,'native',location.pathname);
 });
 document.addEventListener('portfolio-transition',e=>{
  const d=e.detail||{};if(d.phase!=='before'||typeof d.commit!=='function'||!e.cancelable)return;
  if(reduce.matches||!document.startViewTransition)return;
  const b=bounds(d.sourceElement);if(isHome())write(ORIGIN,b);
  if(d.kind==='native'){pending={...b,to:d.to};return;}
  e.preventDefault();active?.skipTransition();prepare(b);
  const vt=document.startViewTransition(async()=>{await d.commit();prepare(b,true);});
  track(vt,'spa',d.to);d.finished=vt.finished.catch(()=>{});
 });
 document.addEventListener('click',e=>{
  if(!isHome()||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;
  const a=e.target.closest?.('a[href]');if(!a||a.target||a.download)return;
  const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.hash||u.pathname===location.pathname)return;
  pending={...bounds(a),to:u.href};write(ORIGIN,pending);
  // Let the browser navigate immediately. No outgoing timer and no second entry effect.
 });
 const prefetched=new Set();document.addEventListener('pointerover',e=>{const a=e.target.closest?.('a[href]');if(!a||a.target)return;const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.hash||prefetched.has(u.pathname))return;prefetched.add(u.pathname);const l=document.createElement('link');l.rel='prefetch';l.href=u.href;document.head.append(l);},{passive:true});
 reduce.addEventListener('change',()=>{if(reduce.matches){active?.skipTransition();clean()}});
 window.PortfolioCodeFlow=Object.freeze({cancel:()=>{active?.skipTransition();clean()},dispose:()=>{active?.skipTransition();clean();seams.forEach(e=>e.remove());seams=[]}});
 window.__portfolioCodeFlow=Object.freeze({snapshot:()=>({active:!!active,starts,lastNavigation,mode:active?'aperture':null,directions:['up','down'],reducedMotion:reduce.matches})});
})();
