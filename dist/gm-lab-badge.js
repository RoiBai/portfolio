import { siteURL } from './site-paths.js';

// Collaboration credit; the logo is the lab's unchanged official asset.
export function setupGlanceLabBadge(root) {
  if (document.body.dataset.project !== 'glancemap') return;
  const pills = root.querySelector('.case-hero .project-pills');
  if (!pills || pills.querySelector('.gm-lab-badge')) return;
  const badge = document.createElement('a');
  badge.className = 'project-pill gm-lab-badge';
  badge.href = 'https://www.shengdongzhao.com/';
  badge.target = '_blank';
  badge.rel = 'noopener noreferrer';
  badge.setAttribute('aria-label', 'In collaboration with Synteraction Lab — open lab website');
  badge.innerHTML = `<img src="${siteURL('/assets/brand/synteraction-logo.jpeg')}" width="297" height="312" alt=""><span>Synteraction Lab</span><span class="gm-lab-arrow" aria-hidden="true">↗</span>`;
  pills.setAttribute('aria-label', 'Project themes and collaborating lab');
  pills.append(badge);
}
