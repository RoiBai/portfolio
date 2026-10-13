/* Split code curtains start exactly on a project's two horizontal boundaries. */
(() => {
  if(window.PortfolioCodeFlow)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const KEY='portfolio:code-curtain:v2', ORIGIN='portfolio:code-origin:v2';
  const glyphs='01{}[]<>/+=*;:RUIYUANBAIabcdefghijklmn';
  let canvas,ctx,raf=0,active=null,sequence=0,starts=0,frames=0,lastNavigation=null;
  let ready=false,incoming=null;
  const read=key=>{try{return JSON.parse(sessionStorage.getItem(key)||'null');}catch{return null;}};
  const write=(key,value)=>{try{sessionStorage.setItem(key,JSON.stringify(value));}catch{}};
  incoming=read(KEY);try{sessionStorage.removeItem(KEY);}catch{}
  const home=()=>!!document.querySelector('#name-hero');
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function bounds(element){
    const row=element?.closest?.('.project-row,.group-row,.project-next');
    const b=row?.getBoundingClientRect();
    if(b)return {top:clamp(b.top,12,innerHeight-48),bottom:clamp(b.bottom,48,innerHeight-12),row:row.id||row.getAttribute('href')||''};
    return {top:innerHeight*.35,bottom:innerHeight*.65,row:''};
  }
  function homeBounds(){
    const stored=read(ORIGIN);
    const row=[...document.querySelectorAll('.project-row,.group-row')].find(e=>(e.id||e.getAttribute('href'))===stored?.row);
    return row?bounds(row):bounds(null);
  }
  function surface(){
    if(!canvas){canvas=document.createElement('canvas');canvas.id='portfolio-code-flow';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);ctx=canvas.getContext('2d');}
    const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;ctx?.setTransform(dpr,0,0,dpr,0,0);canvas.hidden=false;
    return !!ctx;
  }
  function commit(effect){
    if(effect.committed||!effect.commit)return;
    effect.committed=true;clearTimeout(effect.timer);
    lastNavigation={to:effect.to,kind:effect.kind,delayMs:Math.round(performance.now()-effect.started)};
    if(effect.kind==='native')write(KEY,{to:effect.to,at:Date.now()});
    effect.commit();
  }
  function cancel(reason='cancelled',finish=false){
    const previous=active;active=null;cancelAnimationFrame(raf);raf=0;
    if(previous){clearTimeout(previous.timer);if(finish)commit(previous);previous.resolve?.({reason,completed:reason==='complete'});}
    if(canvas)canvas.hidden=true;
    document.documentElement.classList.remove('code-flow-active');
  }
  function draw(effect,p){
    const w=innerWidth,h=innerHeight;
    ctx.clearRect(0,0,w,h);
    const eased=1-Math.pow(1-p,2),fade=1-Math.pow(p,2);
    ctx.font='12px ui-monospace, SFMono-Regular, Consolas, monospace';ctx.textAlign='center';
    for(const side of [-1,1]){
      const origin=side<0?effect.bounds.top:effect.bounds.bottom;
      const end=side<0?-95:h+95,front=origin+(end-origin)*eased;
      ctx.globalAlpha=.38*fade;ctx.strokeStyle='#d6d6d6';ctx.beginPath();ctx.moveTo(0,front);ctx.lineTo(w,front);ctx.stroke();
      for(const particle of effect.particles){
        const y=front-side*particle.trail*(.35+.65*Math.sin(Math.PI*p));
        if(y<0||y>h)continue;
        ctx.globalAlpha=particle.opacity*fade;
        ctx.fillStyle=particle.ink;
        ctx.fillText(glyphs[(particle.char+Math.floor(p*9))%glyphs.length],particle.x+Math.sin(p*4+particle.phase)*3,y);
      }
    }
    ctx.globalAlpha=1;
  }
  function tick(now){
    raf=0;if(!active)return;
    if(document.hidden||reduced.matches){cancel('motion-skipped',true);return;}
    const effect=active,p=clamp((now-effect.started)/effect.duration,0,1);effect.progress=p;frames++;draw(effect,p);
    if(!effect.committed&&effect.commit&&p>=.48)commit(effect);
    if(active!==effect)return;
    if(p===1){cancel('complete',true);return;}
    raf=requestAnimationFrame(tick);
  }
  function play(options={}){
    cancel('superseded');
    if(reduced.matches||document.hidden||!surface()){options.commit?.();return Promise.resolve({skipped:true});}
    starts++;const token=++sequence;let seed=token*1723+19;
    const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
    const particles=Array.from({length:Math.ceil(innerWidth/13)*7},(_,i)=>({x:(i%Math.ceil(innerWidth/13))*13+6,trail:random()*80,opacity:.25+random()*.7,char:Math.floor(random()*glyphs.length),phase:random()*6.28,ink:random()>.5?'#eeeeee':'#8e8e8e'}));
    document.documentElement.classList.add('code-flow-active');
    return new Promise(resolve=>{
      active={...options,token,started:performance.now(),duration:options.duration||660,bounds:options.bounds||bounds(null),particles,resolve,committed:false,progress:0};
      const effect=active;
      if(effect.commit)effect.timer=setTimeout(()=>{if(active===effect)commit(effect);},320);
      draw(effect,0);raf=requestAnimationFrame(tick);
    });
  }
  function enter(historyReturn=false){
    if(!ready)return;
    const marker=incoming;incoming=null;
    if(!historyReturn&&(!marker||Date.now()-marker.at>10000||marker.to!==location.pathname+location.search))return;
    requestAnimationFrame(()=>requestAnimationFrame(()=>play({mode:'entry',duration:520,bounds:home()?homeBounds():bounds(null)})));
  }
  document.addEventListener('portfolio-transition',event=>{
    const d=event.detail||{};
    if(d.phase==='ready'){ready=true;if(!home())enter();return;}
    if(d.phase!=='before'||!event.cancelable||typeof d.commit!=='function')return;
    const to=new URL(d.to,location.href);if(to.origin!==location.origin||reduced.matches||document.hidden)return;
    event.preventDefault();
    const origin=bounds(d.sourceElement);
    if(home())write(ORIGIN,origin);
    d.finished=play({mode:'navigation',kind:d.kind,to:to.pathname+to.search,bounds:origin,commit:d.commit});
  });
  document.addEventListener('click',event=>{
    if(!home()||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest?.('a[href]');if(!link||link.target||link.hasAttribute('download'))return;
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin||url.hash||url.pathname===location.pathname)return;
    const detail={phase:'before',to:url.href,kind:'native',sourceElement:link,commit:()=>location.assign(url.href)};
    if(!document.dispatchEvent(new CustomEvent('portfolio-transition',{cancelable:true,detail})))event.preventDefault();
  });
  document.addEventListener('portfolio:home-restored',event=>{ready=true;enter(event.detail?.historyReturn);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel('hidden',true);});
  reduced.addEventListener('change',()=>{if(reduced.matches)cancel('reduced-motion',true);});
  window.addEventListener('pagehide',()=>cancel('pagehide'));
  window.addEventListener('pageshow',event=>{if(event.persisted&&!home()){ready=true;enter(true);}});
  window.addEventListener('resize',()=>{if(active){surface();active.bounds=bounds(null);}});
  window.PortfolioCodeFlow=Object.freeze({cancel,dispose:()=>{cancel();canvas?.remove();canvas=null;}});
  window.__portfolioCodeFlow=Object.freeze({snapshot:()=>({active:!!active,mode:active?.mode||null,progress:active?.progress||0,bounds:active?.bounds||null,directions:['up','down'],starts,frame:frames,running:!!raf,particles:active?.particles.length||0,pendingNavigation:!!active?.commit&&!active.committed,lastNavigation,reducedMotion:reduced.matches})});
})();
