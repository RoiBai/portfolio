/* Adapted from the Chrome View Transitions examples: https://view-transitions.chrome.dev/
   Use the browser's brief cross-fade; no code overlay, split screen, or navigation timer. */
(()=>{const reduce=matchMedia('(prefers-reduced-motion:reduce)');let transition=null;
try{sessionStorage.removeItem('portfolio:aperture:v3');sessionStorage.removeItem('portfolio:aperture-origin:v3')}catch{}
document.documentElement.classList.remove('project-opening');
document.addEventListener('portfolio-transition',e=>{const d=e.detail;if(!d||d.phase!=='before'||d.kind!=='spa'||!e.cancelable||typeof d.commit!=='function'||reduce.matches||!document.startViewTransition)return;e.preventDefault();transition?.skipTransition();transition=document.startViewTransition(d.commit);d.finished=transition.finished.catch(()=>{});d.finished.finally(()=>{transition=null})});
window.addEventListener('pagereveal',()=>window.PortfolioRestoreHome?.());
window.PortfolioPageTransition={cancel:()=>transition?.skipTransition()};
})();
