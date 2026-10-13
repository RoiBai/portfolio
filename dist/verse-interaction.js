// This example uses only the text and relationships visible in Figma 669:251.
// It is an interactive reading of that example, not an invented knowledge graph.
let instance = 0;
export function renderVerseInteraction() {
  const id = `verse-reading-${++instance}`;
  return `<figure class="project-figure verse-interaction reveal" data-verse-interaction data-selection="color" aria-labelledby="${id}-title">
    <div class="vi-heading"><h3 id="${id}-title">Example</h3><p>Illustrative reading · Wang Wei’s farewell poem</p></div>
    <div class="vi-canvas">
      <svg class="vi-connections" aria-hidden="true" focusable="false"><path data-vi-edge="rain"/><path data-vi-edge="farewell"/><path data-vi-edge="evidence"/><path class="vi-live-connection"/><circle class="vi-live-point" r="3"/></svg>
      <div class="vi-example">
        <div class="vi-poem vi-block" data-source-node="1835:6890"><p>By the inn,<br><button type="button" class="vi-word" data-vi-select="color" data-vi-node="color" aria-pressed="true" aria-label="Drag green to a reading, or select to trace both readings">green</button> willows look fresh again.</p></div>
        <div class="vi-readings" aria-label="The color in context">
          <button type="button" class="vi-reading vi-block" data-vi-select="rain" data-vi-node="rain" data-source-node="1835:6909" aria-pressed="false"><img src="/assets/research-readability/verse-rain.svg" alt="" width="56" height="56"><span>Rain refreshes the green willows.</span><span class="vi-trace" aria-hidden="true">↗</span></button>
          <button type="button" class="vi-reading vi-block" data-vi-select="farewell" data-vi-node="farewell" data-source-node="1835:6916" aria-pressed="false"><img src="/assets/research-readability/verse-friends.svg" alt="" width="56" height="56"><span>The next lines turn this scene into a farewell between friends.</span><span class="vi-trace" aria-hidden="true">↗</span></button>
        </div>
        <p class="vi-instruction">Drag <strong>green</strong> to either reading, or select a row to trace the connection.</p>
      </div>
      <blockquote class="vi-evidence vi-block" data-vi-node="evidence" data-source-node="1835:6918"><span class="vi-source-label">The next lines supply the farewell context</span><p>“I urge you to drink another cup;<br>beyond Yang Pass, no old friends remain.”</p></blockquote>
    </div>
    <p class="vi-status" aria-live="polite" aria-atomic="true">Green connects to fresh willows. The following lines supply the farewell context.</p>
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
        const a=anchor(from,true),b=anchor(to,false),path=svg.querySelector(`[data-vi-edge="${key}"]`);
        if(from==='color'){
          const panel=figure.querySelector('.vi-readings').getBoundingClientRect(), word=node('color').getBoundingClientRect();
          const x=panel.left-box.left-12, y=panel.top-box.top-22, target=node(to).getBoundingClientRect();
          const startX=word.left-box.left+word.width/2, startY=word.bottom-box.top+8;
          const poem=figure.querySelector('.vi-poem>p').getBoundingClientRect();
          const route=poem.bottom>word.bottom+8 ? `M ${word.left-box.left-3} ${word.top-box.top+word.height/2} L ${x} ${word.top-box.top+word.height/2} L ${x} ${y}` : `M ${startX} ${startY} L ${startX} ${y} L ${x} ${y}`;
          path.setAttribute('d',`${route} L ${x} ${target.top-box.top+target.height/2} L ${panel.left-box.left+8} ${target.top-box.top+target.height/2}`);
        }else{
          const start=node(from).getBoundingClientRect(),end=node(to).getBoundingClientRect();
          if(end.left>start.right){const x1=start.right-box.left+8,y1=start.top-box.top+start.height/2,x2=end.left-box.left-16,y2=end.top-box.top+14;path.setAttribute('d',`M ${x1} ${y1} L ${(x1+x2)/2} ${y1} L ${(x1+x2)/2} ${y2} L ${x2} ${y2}`)}
          else{const x=box.width-8;path.setAttribute('d',`M ${start.right-box.left+4} ${start.top-box.top+start.height/2} L ${x} ${start.top-box.top+start.height/2} L ${x} ${b.y-15} L ${b.x} ${b.y-15} L ${b.x} ${b.y}`)}
        }
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
