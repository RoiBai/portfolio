/*
 * Reference observation, 18-second supplied recording:
 * at 13.31s a gray/white horizontal band of letters, digits and symbols flows
 * upward; by 14.09s the next scene's gray stippled smoke is exposed.
 * This implementation uses that upward band, not colored falling code.
 *
 * Bridge: dispatch a cancelable `portfolio-transition` with detail
 * {phase:'before', from, to, kind:'spa'|'native', commit:()=>void}.
 * If claimed, detail.finished is a Promise. SPA callers await it; commit is
 * called at most once, within 340ms. Native destinations consume one matching
 * session marker after `portfolio-transition` phase:'ready' or space-ready.
 * Reduced motion, hashes, history/reload and hidden documents skip the effect.
 * Debug: window.__portfolioCodeFlow.snapshot() is read-only. Public cancel()
 * and dispose() are on window.PortfolioCodeFlow. No continuous idle RAF.
 */
(() => {
  'use strict';
  if(window.PortfolioCodeFlow)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const MARKER='ruiyuan-bai.code-flow.entry.v1';
  const GLYPHS='ABCDEFGHJKLMNPRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789<>/:;+=-*#%&[]{}';
  let canvas=null,context=null,atlas=null,active=null,raf=0,commitTimer=0,sequence=0,frames=0,starts=0,cancels=0;
  let width=0,height=0,dpr=1,lastProjectId=null,currentPreviewId=null,lastPreviewLeftAt=-Infinity,lastCancelReason=null,lastNavigation=null,disposed=false;
  let incoming=null,ready=false;
  try{incoming=JSON.parse(sessionStorage.getItem(MARKER)||'null');sessionStorage.removeItem(MARKER);}catch{}
  const navigationType=performance.getEntriesByType('navigation')[0]?.type;
  if(navigationType==='back_forward'||navigationType==='reload')incoming=null;
  function targetURL(value){
    try{
      const url=new URL(value,location.href);
      if(url.origin!==location.origin||url.hash)return null;
      if(/\.[a-z0-9]+$/i.test(url.pathname)&&!url.pathname.endsWith('.html'))return null;
      return url;
    }catch{return null;}
  }
  function ensureSurface(){
    if(canvas)return !!context;
    disposed=false;canvas=document.createElement('canvas');canvas.id='portfolio-code-flow';canvas.hidden=true;canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
    context=canvas.getContext('2d',{alpha:true});
    if(!context){canvas.remove();canvas=null;return false;}
    atlas=document.createElement('canvas');atlas.width=GLYPHS.length*16;atlas.height=24;
    const ink=atlas.getContext('2d');
    if(!ink){dispose('canvas-unavailable');return false;}
    ink.font='500 15px ui-monospace, "SFMono-Regular", Consolas, monospace';ink.textAlign='center';ink.textBaseline='middle';ink.fillStyle='#eeeeec';
    [...GLYPHS].forEach((glyph,index)=>ink.fillText(glyph,index*16+8,12));
    return true;
  }
  function resize(){
    width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);
    if(!canvas)return;
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);
  }
  function createParticles(token,mode){
    let seed=(token*7027+13)>>>0;
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    const columns=Math.ceil(width/12),rows=mode==='hover'?16:24;
    const count=Math.min(2400,columns*rows),band=Math.min(330,Math.max(150,height*.3));
    return {band,particles:Array.from({length:count},(_,index)=>{
      const column=index%columns,row=Math.floor(index/columns),spread=random();
      return{x:(column+.5)*width/columns+(random()-.5)*10,offset:(row/rows-.5)*band,
        glyph:Math.floor(random()*GLYPHS.length),alpha:.24+random()*.76,
        drift:(random()-.5)*150,phase:random()*Math.PI*2,scale:.65+random()*.65,
        scatter:spread>.78?1:0};
    })};
  }
  function hideSurface(){
    if(!canvas)return;
    canvas.hidden=true;canvas.width=1;canvas.height=1;
  }
  function settle(reason='complete',commitPending=false){
    const previous=active;
    cancelAnimationFrame(raf);clearTimeout(commitTimer);commitTimer=0;raf=0;active=null;
    if(previous&&commitPending)commit(previous);
    hideSurface();document.documentElement.classList.remove('code-flow-active');
    if(previous){previous.particles.length=0;previous.resolve({completed:reason==='complete',canceled:reason!=='complete',reason});}
  }
  function cancel(reason='canceled'){
    if(active){cancels++;lastCancelReason=reason;}
    settle(reason,false);
  }
  function dispose(reason='disposed'){
    cancel(reason);canvas?.remove();canvas=null;context=null;atlas=null;disposed=true;
  }
  function commit(effect){
    if(effect.committed||!effect.commit)return;
    effect.committed=true;clearTimeout(commitTimer);commitTimer=0;lastNavigation={to:effect.to,kind:effect.kind,delayMs:Math.round(performance.now()-effect.started)};
    if(effect.kind==='native'){
      try{sessionStorage.setItem(MARKER,JSON.stringify({to:effect.to,createdAt:Date.now(),expiresAt:Date.now()+8000}));}catch{}
    }
    effect.commit();
  }
  function draw(effect,progress){
    context.clearRect(0,0,width,height);
    const center=height+effect.band*.6-progress*(height+effect.band*1.2);
    const envelope=Math.pow(Math.max(0,Math.sin(Math.PI*progress)),.45);
    // A soft, thin haze under the characters has no rectangular opaque fill.
    const haze=context.createLinearGradient(0,center-effect.band*.7,0,center+effect.band*.7);
    haze.addColorStop(0,'rgba(224,224,221,0)');haze.addColorStop(.5,`rgba(224,224,221,${.07*envelope})`);haze.addColorStop(1,'rgba(224,224,221,0)');
    context.fillStyle=haze;context.fillRect(0,center-effect.band*.7,width,effect.band*1.4);
    for(const particle of effect.particles){
      const drift=Math.sin(progress*Math.PI)*particle.drift*(particle.scatter?1.65:.3);
      const y=center+particle.offset+drift+Math.sin(particle.phase+progress*8)*12;
      if(y < -30||y > height+30)continue;
      const x=particle.x+Math.sin(particle.phase+progress*5)*(particle.scatter?22:4);
      const central=1-Math.min(1,Math.abs(particle.offset)/(effect.band*.6))*.5;
      context.globalAlpha=particle.alpha*central*envelope*(effect.mode==='hover'?.78:1);
      const glyph=(particle.glyph+Math.floor(progress*4))%GLYPHS.length;
      const w=16*particle.scale,h=24*particle.scale;
      context.drawImage(atlas,glyph*16,0,16,24,x-w/2,y-h/2,w,h);
    }
    context.globalAlpha=1;
  }
  function animate(now){
    raf=0;const effect=active;if(!effect)return;
    if(document.hidden||reduced.matches){settle('motion-skipped',true);return;}
    const elapsed=now-effect.started,local=Math.min(1,elapsed/effect.duration);
    effect.progress=effect.startProgress+(1-effect.startProgress)*local;frames++;
    draw(effect,effect.progress);
    if(effect.commit&&!effect.committed&&elapsed>=effect.commitAt)commit(effect);
    if(active!==effect)return;
    if(local>=1){settle('complete',true);return;}
    raf=requestAnimationFrame(animate);
  }
  function play(options){
    cancel('superseded');
    if(reduced.matches||document.hidden||!ensureSurface()){
      options.commit?.();return Promise.resolve({completed:true,skipped:true});
    }
    resize();const token=++sequence,generated=createParticles(token,options.mode);
    starts++;canvas.hidden=false;document.documentElement.classList.add('code-flow-active');
    return new Promise(resolve=>{
      active={token,mode:options.mode,kind:options.kind||null,to:options.to||null,started:performance.now(),duration:options.duration,startProgress:options.startProgress||0,progress:options.startProgress||0,commitAt:340,commit:options.commit||null,committed:false,resolve,...generated};
      const effect=active;
      if(effect.commit)commitTimer=setTimeout(()=>{if(active===effect)commit(effect);},340);
      draw(active,active.progress);raf=requestAnimationFrame(animate);
    });
  }
  function consumeIncoming(){
    if(!ready||!incoming)return;
    const marker=incoming;incoming=null;
    if(reduced.matches||document.hidden||!Number.isFinite(marker.expiresAt)||marker.expiresAt<Date.now()||marker.to!==location.pathname+location.search)return;
    play({mode:'entry',duration:520,startProgress:.42});
  }
  document.addEventListener('portfolio-transition',event=>{
    const detail=event.detail||{};
    if(detail.phase==='ready'){ready=true;consumeIncoming();return;}
    if(detail.phase!=='before'||!event.cancelable||typeof detail.commit!=='function')return;
    const url=targetURL(detail.to);
    if(!url||url.pathname+url.search===location.pathname+location.search||reduced.matches||document.hidden){cancel('navigation-without-motion');return;}
    event.preventDefault();
    detail.finished=play({mode:'navigation',kind:detail.kind||'native',to:url.pathname+url.search,duration:780,commit:detail.commit});
  });
  document.addEventListener('portfolio-preview',event=>{
    const id=event.detail?.id||null;
    if(!id){currentPreviewId=null;lastPreviewLeftAt=performance.now();if(active?.mode==='hover')cancel('preview-cleared');return;}
    const previous=lastProjectId,recent=!!currentPreviewId||performance.now()-lastPreviewLeftAt<2000;
    currentPreviewId=id;lastProjectId=id;
    if(id===previous)return;
    if(previous&&recent&&(!active||active.mode==='hover'))play({mode:'hover',duration:480});
  });
  // Native links that are intentionally outside app.js's SPA router.
  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest?.('a[href]');if(!link||link.target||link.hasAttribute('download')||link.getAttribute('aria-disabled')==='true')return;
    const url=targetURL(link.href);if(!url)return;
    const isUniverse=!!document.querySelector('.universe');
    if(!isUniverse&&!url.pathname.endsWith('.html'))return;
    if(url.pathname+url.search===location.pathname+location.search)return;
    const detail={phase:'before',from:location.pathname,to:url.pathname+url.search,source:'native-link',kind:'native',commit:()=>location.assign(url.href)};
    const transition=new CustomEvent('portfolio-transition',{cancelable:true,detail});
    if(!document.dispatchEvent(transition))event.preventDefault();
  });
  document.addEventListener('portfolio-space-ready',()=>{ready=true;consumeIncoming();});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){if(active?.mode==='navigation')settle('background-navigation',true);else cancel('background');incoming=null;}
  });
  reduced.addEventListener('change',()=>{if(reduced.matches)settle('reduced-motion',true);});
  window.addEventListener('resize',()=>{if(active){resize();const replacement=createParticles(active.token,active.mode);active.particles=replacement.particles;active.band=replacement.band;}});
  window.addEventListener('popstate',()=>cancel('history'));
  window.addEventListener('pagehide',()=>{incoming=null;dispose('pagehide');});
  window.addEventListener('pageshow',event=>{if(event.persisted){incoming=null;cancel('bfcache-return');}});
  const snapshot=()=>Object.freeze({active:!!active,running:raf!==0,mode:active?.mode||null,progress:active?.progress||0,token:active?.token||sequence,frame:frames,starts,cancels,lastCancelReason,lastProjectId,reducedMotion:reduced.matches,hidden:document.hidden,canvasConnected:!!canvas?.isConnected,canvasHidden:canvas?.hidden??true,canvasWidth:canvas?.width||0,canvasHeight:canvas?.height||0,particles:active?.particles.length||0,pendingNavigation:!!active?.commit&&!active?.committed,commitTimerActive:commitTimer!==0,lastNavigation,disposed});
  window.__portfolioCodeFlow=Object.freeze({snapshot});
  window.PortfolioCodeFlow=Object.freeze({cancel,dispose});
})();
