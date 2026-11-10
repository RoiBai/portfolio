// The whole homepage shares one sky. It redraws only on resize or scroll,
// so the background uses no idle animation loop and never captures a pointer.
if (document.querySelector('.profile-home') && !document.querySelector('.home-starfield')) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', {alpha: true});
  if (context) {
    canvas.className = 'home-starfield';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    document.body.classList.add('has-home-starfield');

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, scale = 1, stars = [], frame = 0;
    let needsResize = true;

    function seedRandom(seed) {
      return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
    }

    function resize() {
      needsResize = false;
      width = document.documentElement.clientWidth;
      height = window.innerHeight;
      scale = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const random = seedRandom(110826);
      const count = Math.min(650, Math.max(120, Math.round(width * height / 3000)));
      stars = Array.from({length: count}, (_, index) => ({
        x: random() * width,
        y: random() * (height + 80) - 40,
        radius: index % 43 === 0 ? .95 + random() * .35 : .35 + random() * .48,
        alpha: index % 43 === 0 ? .36 + random() * .12 : .11 + random() * .21,
        depth: .012 + random() * .026,
        mint: random() > .84,
        glint: index % 97 === 0
      }));
    }

    function draw() {
      frame = 0;
      if (document.hidden) return;
      if (needsResize) resize();
      context.clearRect(0, 0, width, height);
      const offset = reduced.matches ? 0 : scrollY;
      const span = height + 80;
      for (const star of stars) {
        const y = ((star.y - offset * star.depth + 40) % span + span) % span - 40;
        const color = star.mint ? '177,211,201' : '210,220,226';
        context.fillStyle = `rgba(${color},${star.alpha})`;
        context.beginPath();
        context.arc(star.x, y, star.radius, 0, Math.PI * 2);
        context.fill();
        if (star.glint) {
          context.strokeStyle = `rgba(${color},${star.alpha * .35})`;
          context.lineWidth = .55;
          context.beginPath();
          context.moveTo(star.x - 2.4, y); context.lineTo(star.x + 2.4, y);
          context.moveTo(star.x, y - 2.4); context.lineTo(star.x, y + 2.4);
          context.stroke();
        }
      }
    }

    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
    }

    addEventListener('scroll', () => {if (!reduced.matches) schedule();}, {passive: true});
    addEventListener('resize', () => {needsResize = true; schedule();}, {passive: true});
    addEventListener('pageshow', schedule);
    addEventListener('pagehide', () => {cancelAnimationFrame(frame); frame = 0;});
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {cancelAnimationFrame(frame); frame = 0;}
      else schedule();
    });
    reduced.addEventListener('change', schedule);
    schedule();
  }
}
