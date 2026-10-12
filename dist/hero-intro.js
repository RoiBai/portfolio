// The scene contracts by exactly the distance scrolled. Its stage keeps a
// stable document height, so project rows and saved return positions never jump.
export function setupHeroIntro() {
  const stage = document.querySelector('.hero-stage');
  const hero = stage?.querySelector('#name-hero');
  const cue = hero?.querySelector('.hero-scroll-cue');
  const projects = document.querySelector('#selected-work');
  if (!stage || !hero || !cue || !projects) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let expandedHeight = 0, compactHeight = 0, stageTop = 0;
  let frame = 0, needsMeasure = true, lastHeight = -1, lastProgress = -1;

  const update = () => {
    frame = 0;
    if (needsMeasure) {
      expandedHeight = stage.offsetHeight;
      compactHeight = Math.min(expandedHeight, innerWidth < 700 ? 520 : 420);
      stageTop = stage.getBoundingClientRect().top + scrollY;
      needsMeasure = false;
    }
    const distance = Math.max(0, expandedHeight - compactHeight);
    const traveled = Math.min(distance, Math.max(0, scrollY - stageTop));
    const progress = distance ? traveled / distance : (scrollY > stageTop ? 1 : 0);
    const height = expandedHeight - traveled;
    if (height === lastHeight && progress === lastProgress) return;
    lastHeight = height; lastProgress = progress;

    hero.style.setProperty('--intro-scene-height', `${height}px`);
    hero.style.setProperty('--intro-cue-opacity', String(Math.max(0, 1 - progress * 2.5)));
    hero.dataset.introProgress = progress.toFixed(4);
    hero.dataset.introActive = String(progress < 1);
    cue.inert = progress >= .4;
    cue.tabIndex = progress >= .4 ? -1 : 0;
    cue.setAttribute('aria-hidden', String(progress >= .4));
    hero.dispatchEvent(new CustomEvent('portfolio:hero-intro', {
      bubbles: true,
      detail: {progress, height, expandedHeight, compactHeight}
    }));
  };
  const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
  const resize = () => { needsMeasure = true; requestUpdate(); };
  window.addEventListener('scroll', requestUpdate, {passive: true});
  window.addEventListener('resize', resize, {passive: true});
  window.addEventListener('pageshow', resize);
  cue.addEventListener('click', event => {
    event.preventDefault();
    const distance = expandedHeight - compactHeight;
    projects.focus({preventScroll: true});
    window.scrollTo({
      top: stageTop + (distance > 0 ? distance : expandedHeight),
      behavior: reduced.matches ? 'instant' : 'smooth'
    });
  });
  update();
}
