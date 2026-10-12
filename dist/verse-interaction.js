// This example uses only the text and relationships visible in Figma 669:251.
// It is an interactive reading of that example, not an invented knowledge graph.
let instance = 0;
export function renderVerseInteraction() {
  const id = `verse-reading-${++instance}`;
  return `<figure class="project-figure verse-interaction reveal" data-verse-interaction data-selection="color" aria-labelledby="${id}-title">
    <div class="vi-heading"><span class="vi-kicker">An illustrative reading</span><h3 id="${id}-title">A color changes with its context.</h3><p>Drag “green” to a reading, or select one to trace its connection.</p></div>
    <div class="vi-canvas">
      <svg class="vi-connections" aria-hidden="true" focusable="false"><path data-vi-edge="rain" pathLength="1"/><path data-vi-edge="farewell" pathLength="1"/><path data-vi-edge="evidence" pathLength="1"/><path class="vi-live-connection"/><circle class="vi-live-point" r="3"/></svg>
      <div class="vi-poem vi-block" data-source-node="1349:261"><span class="vi-source-label">Wang Wei · A farewell poem</span><p><span class="vi-poem-fragment">By the inn,</span><br><button type="button" class="vi-word" data-vi-select="color" data-vi-node="color" aria-pressed="true" aria-label="Drag green to a reading, or select to trace both readings">green</button> <span class="vi-poem-fragment">willows</span> <span class="vi-poem-fragment">look fresh again.</span></p></div>
      <div class="vi-readings">
        <button type="button" class="vi-reading vi-block" data-vi-select="rain" data-vi-node="rain" data-source-node="1462:264" aria-pressed="false"><span class="vi-number" aria-hidden="true">01</span><span class="vi-card-title">Rain &amp; fresh willows</span><span class="vi-card-copy">Rain refreshes the green willows.</span><span class="vi-card-action" aria-hidden="true">Trace this reading ↗</span></button>
        <button type="button" class="vi-reading vi-block" data-vi-select="farewell" data-vi-node="farewell" data-source-node="1462:271" aria-pressed="false"><span class="vi-number" aria-hidden="true">02</span><span class="vi-card-title">Friends &amp; farewell</span><span class="vi-card-copy">The next lines turn this scene into a farewell between friends.</span><span class="vi-card-action" aria-hidden="true">Trace the next lines ↗</span></button>
      </div>
      <blockquote class="vi-evidence vi-block" data-vi-node="evidence" data-source-node="1349:272"><span class="vi-source-label">The next lines supply the farewell context</span><p><span class="vi-verse-line">“I urge you to drink another cup;</span><span class="vi-verse-line">beyond Yang Pass, no old friends remain.”</span></p></blockquote>
    </div>
    <p class="vi-status" aria-live="polite" aria-atomic="true">Green connects to fresh willows. The following lines supply the farewell context.</p>
    <figcaption>Read the color through its imagery and the lines that follow. Its meaning belongs to this poem.</figcaption>
  </figure>`;
}
export function setupVerseInteraction(root = document) {
  const cleanups = [];
  root.querySelectorAll('[data-verse-interaction]').forEach(figure => {
    if (figure._disposeVerse) figure._disposeVerse();
    const surface = figure.querySelector('.vi-canvas'), svg = figure.querySelector('.vi-connections');
    const buttons = [...figure.querySelectorAll('[data-vi-select]')], status = figure.querySelector('.vi-status');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, disposed = false, gesture = null, skipClickUntil = 0;
    const node = key => figure.querySelector(`[data-vi-node="${key}"]`);
    const draw = () => {
      frame = 0;
      if (disposed || !surface.isConnected) return;
      const box = surface.getBoundingClientRect();
      if (!box.width || !box.height) return;
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      const anchor = (key, bottom) => {const b=node(key).getBoundingClientRect();return {x:b.left-box.left+b.width/2,y:(bottom?b.bottom:b.top)-box.top+(bottom?5:-7)}};
      const connect = (key, from, to) => {
        const a=anchor(from,true),b=anchor(to,false),bend=Math.max(14,(b.y-a.y)*.55);
        const path=svg.querySelector(`[data-vi-edge="${key}"]`);
        const line=figure.querySelector('.vi-poem>p').getBoundingClientRect(),word=node('color').getBoundingClientRect();
        if(from==='color'&&line.bottom>word.bottom+8){
          // A wrapped poem must remain clear: route through its outside gutter.
          const startX=word.left-box.left-3,startY=word.top-box.top+word.height/2,safeY=line.bottom-box.top+14;
          path.setAttribute('d',`M ${startX} ${startY} L -10 ${startY} L -10 ${safeY} C -10 ${safeY+14}, ${b.x} ${b.y-18}, ${b.x} ${b.y}`);
        }else path.setAttribute('d',`M ${a.x} ${a.y} C ${a.x} ${a.y+bend}, ${b.x} ${b.y-bend}, ${b.x} ${b.y}`);
      };
      connect('rain','color','rain');connect('farewell','color','farewell');connect('evidence','farewell','evidence');
      const live=svg.querySelector('.vi-live-connection'),point=svg.querySelector('.vi-live-point');
      if(gesture?.dragging){
        const a=anchor('color',true),b={x:gesture.x-box.left,y:gesture.y-box.top};
        live.setAttribute('d',`M ${a.x} ${a.y} Q ${a.x} ${Math.max(a.y+24,(a.y+b.y)/2)}, ${b.x} ${b.y}`);
        point.setAttribute('cx',b.x);point.setAttribute('cy',b.y);
      }else live.removeAttribute('d');
    };
    const schedule = () => {if (!frame && !disposed) frame=requestAnimationFrame(draw)};
    const select = value => {
      figure.dataset.selection=value;
      buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.viSelect===value)));
      status.textContent=value==='rain'?'Rain refreshes the green willows. This reading stays with the scene in the quoted line.':value==='farewell'?'The next lines describe drinking together before parting. They supply the farewell context.':'Green connects to fresh willows. The following lines supply the farewell context.';
      schedule();
    };
    const onClick=event=>{if(event.detail!==0&&performance.now()<skipClickUntil){event.preventDefault();return}const button=event.target.closest('[data-vi-select]');if(button&&figure.contains(button))select(button.dataset.viSelect)};
    figure.addEventListener('click',onClick);
    const origin=node('color');
    const dropTarget=(x,y)=>['rain','farewell'].find(key=>{const b=node(key).getBoundingClientRect();return x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom})||'';
    const onDown=event=>{if(!event.isPrimary||event.button>0)return;gesture={id:event.pointerId,startX:event.clientX,startY:event.clientY,x:event.clientX,y:event.clientY,dragging:false};origin.setPointerCapture(event.pointerId)};
    const onMove=event=>{if(!gesture||event.pointerId!==gesture.id)return;gesture.x=event.clientX;gesture.y=event.clientY;if(Math.hypot(gesture.x-gesture.startX,gesture.y-gesture.startY)>5)gesture.dragging=true;if(gesture.dragging){event.preventDefault();figure.dataset.dragging='true';figure.dataset.dragTarget=dropTarget(gesture.x,gesture.y);schedule()}};
    const finish=(event,cancelled=false)=>{if(!gesture||event.pointerId!==gesture.id)return;const wasDragging=gesture.dragging,target=cancelled?'':dropTarget(event.clientX,event.clientY);gesture=null;delete figure.dataset.dragging;delete figure.dataset.dragTarget;if(origin.hasPointerCapture(event.pointerId))origin.releasePointerCapture(event.pointerId);if(wasDragging){skipClickUntil=performance.now()+250;if(target)select(target);else schedule()}};
    const onUp=event=>finish(event),onCancel=event=>finish(event,true);
    const onKey=event=>{if(event.key==='Escape'&&gesture){event.preventDefault();finish({pointerId:gesture.id},true)}};
    origin.addEventListener('pointerdown',onDown);origin.addEventListener('pointermove',onMove);origin.addEventListener('pointerup',onUp);origin.addEventListener('pointercancel',onCancel);origin.addEventListener('lostpointercapture',onCancel);figure.addEventListener('keydown',onKey);
    const observer=new ResizeObserver(schedule);observer.observe(surface);buttons.forEach(button=>observer.observe(button));observer.observe(node('evidence'));
    const entrance=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){figure.classList.add('vi-entered');entrance.disconnect();}},{threshold:.12});
    entrance.observe(figure);
    const onReduce=()=>{figure.classList.toggle('vi-reduced',reduce.matches);schedule()};reduce.addEventListener('change',onReduce);onReduce();
    if(document.fonts?.ready)document.fonts.ready.then(schedule);
    draw();
    const cleanup=()=>{disposed=true;if(gesture&&origin.hasPointerCapture(gesture.id))origin.releasePointerCapture(gesture.id);gesture=null;cancelAnimationFrame(frame);observer.disconnect();entrance.disconnect();figure.removeEventListener('click',onClick);origin.removeEventListener('pointerdown',onDown);origin.removeEventListener('pointermove',onMove);origin.removeEventListener('pointerup',onUp);origin.removeEventListener('pointercancel',onCancel);origin.removeEventListener('lostpointercapture',onCancel);figure.removeEventListener('keydown',onKey);reduce.removeEventListener('change',onReduce);delete figure._disposeVerse};
    figure._disposeVerse=cleanup;cleanups.push(cleanup);
  });
  return () => cleanups.forEach(cleanup=>cleanup());
}
