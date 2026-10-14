import {siteURL} from './site-paths.js';
const img=(path,alt,cls='')=>`<img class="${cls}" src="${siteURL(path)}" alt="${alt}" loading="lazy" decoding="async">`;

// These are the project's exported icons; the surrounding comparison is native HTML.
export function setupIconEditorial(root){
 const abstract=root.querySelector('#abstract');
 if(abstract){
  abstract.querySelector('.section-visuals')?.remove();
  abstract.insertAdjacentHTML('beforeend',`<div class="icon-abstract-comparisons">
   <figure><div class="icon-bulb-pair">${img('/website-assets/icon-before.svg','White bulb without a shadow')}${img('/website-assets/icon-after.svg','The same bulb with a shadow')}</div><figcaption><h3>Clearer edges</h3><p>A shadow makes the white symbol easier to see.</p></figcaption></figure>
   <figure><div class="icon-abstract-art">${img('/assets/design-revision/icon-controls.svg','Three original outlined icon examples')}</div><figcaption><h3>Meaningful colors</h3><p>An outline helps separate the symbol from its color.</p></figcaption></figure>
   <figure><div class="icon-abstract-art">${img('/assets/design-revision/icon-status.svg','Three original icons on gray backplates')}</div><figcaption><h3>Less intrusion</h3><p>A gray backplate keeps status information quieter.</p></figcaption></figure>
  </div>`);
 }
 const problem=root.querySelector('#problem');
 if(problem){
  problem.querySelector('.section-visuals')?.remove();
  problem.insertAdjacentHTML('beforeend',`<div class="icon-context-comparison">
   <figure><div class="icon-desktop-context"><div class="icon-monitor"><span class="icon-screen-parking" aria-label="White parking symbol on blue">P</span></div><div class="icon-monitor-foot"></div></div><figcaption><h3>On a screen <span class="icon-result-check">✓</span></h3><p><strong>9.06 : 1</strong> blue–white contrast ratio</p><small>Calculated screen contrast · #0000F5 / #FFFFFF</small></figcaption></figure>
   <figure><div class="icon-ar-context">${img('/assets/icon-original-explorations/outdoor-prototype-source.png','Original outdoor street scene behind an AR parking symbol')}<span class="icon-ar-parking" aria-label="Parking symbol at 70 percent opacity">P</span></div><figcaption><h3>Through AR glasses <span class="icon-result-cross">×</span></h3><p><strong>Clarity is not guaranteed</strong> by screen contrast</p><small>The real scene adds changing light and visual detail</small></figcaption></figure>
  </div>`);
 }
 const analysis=root.querySelector('#analysis');
 if(analysis){
  analysis.insertAdjacentHTML('beforeend',`<div class="icon-evidence-bridge">
   <article><span class="icon-evidence-label">01 · Shadow</span><div class="icon-evidence-number">+0.88–1.62 <small>/ 5</small></div><p>Clarity gains across four hues</p><div class="icon-evidence-rule"><h3>Make alerts noticeable</h3><p>Use a shadow when the white symbol needs attention.</p></div></article>
   <article><span class="icon-evidence-label">02 · Outline</span><div class="icon-evidence-number">3.71 <span>→</span> 4.13 <small>/ 5</small></div><p>Mean meaning rating, original → outlined</p><div class="icon-evidence-rule"><h3>Clarify everyday controls</h3><p>Keep the color while giving the symbol a clearer edge.</p></div></article>
   <article><span class="icon-evidence-label">03 · Gray backplate</span><div class="icon-evidence-number">30% <small>brightness</small></div><p>Balanced clarity and lower intrusion</p><div class="icon-evidence-rule"><h3>Keep status in view</h3><p>20% was too faint; 40% introduced more color mixing.</p></div></article>
  </div><p class="icon-analysis-method">Within-hue paired comparisons + participant explanations → guidance for different interface roles</p>`);
 }
 const reflection=root.querySelector('#reflection');
 if(reflection){
  reflection.querySelector('.section-visuals')?.remove();
  reflection.insertAdjacentHTML('beforeend',`<div class="icon-audience-comparison">
   <figure><div class="icon-audience-crop icon-audience-bar">${img('/assets/design-revision/icon-audience.svg','Original bar icon')}</div><figcaption><h3>Bar</h3><p><strong>Opposite colors can still fit.</strong> A conventional color match is not the only meaningful choice.</p></figcaption></figure>
   <figure><div class="icon-audience-crop icon-audience-music">${img('/assets/design-revision/icon-audience.svg','Original music icon')}</div><figcaption><h3>Music</h3><p><strong>Test the association with your audience.</strong> Culture, genre and context shape the reading.</p></figcaption></figure>
  </div><p class="icon-audience-note"><strong>Another reading:</strong> blue–yellow parking recalled IKEA, competing with the parking meaning. These findings cover 20 participants and static 2D icons.</p>`);
 }
}
