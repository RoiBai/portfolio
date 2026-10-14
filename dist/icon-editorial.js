import {siteURL} from './site-paths.js';
const img=(path,alt,cls='')=>`<img class="${cls}" src="${siteURL(path)}" alt="${alt}" loading="lazy" decoding="async">`;

// These are the project's exported icons; the surrounding comparison is native HTML.
export function setupIconEditorial(root){
 const abstract=root.querySelector('#abstract');
 if(abstract){
  abstract.querySelector('.section-visuals')?.remove();
  abstract.classList.add('icon-prose-abstract');
  abstract.insertAdjacentHTML('beforeend',`<div class="icon-abstract-pairs">
   <figure><div class="icon-abstract-pair-art"><span class="icon-abstract-t-pair">${img('/assets/design-revision/icon-baseline.svg','Original cyan letter T with black and white foregrounds')}</span></div><figcaption><h3>Compare foregrounds</h3><p>Same color, different contrast</p></figcaption></figure>
   <figure><div class="icon-abstract-pair-art">${img('/website-assets/icon-before.svg','Original yellow bulb without shadow')}${img('/website-assets/icon-after.svg','Original yellow bulb with shadow')}</div><figcaption><h3>Sharpen the edge</h3><p>White symbol, with and without shadow</p></figcaption></figure>
   <figure><div class="icon-abstract-pair-art">${img('/website-assets/icon-comic-panel-2-icon-2.svg','Original white files icon on blue')}${img('/website-assets/icon-comic-panel-3-icon-6.svg','Original blue files icon with an outline')}</div><figcaption><h3>Clarify the symbol</h3><p>Solid background or colored outline</p></figcaption></figure>
  </div>`);
 }
 const workshop=root.querySelector('#workshop');
 if(workshop){
  workshop.insertAdjacentHTML('beforeend',`<div class="icon-research-plan">
   <figure class="icon-workshop-library">${img('/assets/design-revision/icon-library.svg','The original twelve-icon library: dining, finance, light bulb, cycling, video call, weather, files, parking, yoga, bar, music and alert')}<figcaption>Twelve meanings selected by the designer workshop</figcaption></figure>
   <div class="icon-study-timeline"><p><strong>Three linked studies</strong><span>The same 20 participants completed Studies 1–3.</span></p><ol>
    <li><span>01</span><h3>Compare colors</h3><p>Fixed letter · clarity + comfort</p></li>
    <li><span>02</span><h3>Add meaning</h3><p>Workshop icons · how well the colors fit</p></li>
    <li><span>03</span><h3>Refine the design</h3><p>New treatments · attention and priority</p></li>
   </ol></div>
  </div>`);
 }
 const problem=root.querySelector('#problem');
 if(problem){
  problem.querySelector('.section-visuals')?.remove();
  problem.insertAdjacentHTML('beforeend',`<div class="icon-context-comparison">
   <figure><div class="icon-desktop-context"><div class="icon-monitor"><span class="icon-screen-parking" aria-label="White parking symbol on blue">P</span></div><div class="icon-monitor-foot"></div></div><figcaption><h3>On a screen <span class="icon-result-check">✓</span></h3><p>A white parking symbol stands out against an opaque blue background. The screen controls both colors.</p><small><strong>9.06 : 1</strong> calculated screen contrast · #0000F5 / #FFFFFF</small></figcaption></figure>
   <figure><div class="icon-ar-context">${img('/assets/icon-original-explorations/outdoor-prototype-source.png','Original outdoor street scene behind an AR parking symbol')}<span class="icon-ar-parking" aria-label="Parking symbol at 70 percent opacity">P</span></div><figcaption><h3>Through AR glasses <span class="icon-result-cross">×</span></h3><p><strong>The background is no longer controlled.</strong> Real-world light and detail show through, changing the icon’s appearance.</p><small>Screen contrast alone cannot predict how clear it will look in AR</small></figcaption></figure>
  </div>`);
 }
 const analysis=root.querySelector('#analysis');
 if(analysis){
  analysis.insertAdjacentHTML('beforeend',`<div class="icon-evidence-bridge">
   <article><span class="icon-evidence-label">01 · Shadow</span><div class="icon-evidence-art"><span class="icon-source-detail icon-source-outline">${img('/assets/design-revision/icon-refinement-white.svg','Original cyan weather icon before and after adding a shadow')}</span></div><div class="icon-evidence-number">+0.88–1.62 <small>/ 5</small></div><p>Clarity gains across four hues</p><div class="icon-evidence-rule"><h3>Make alerts noticeable</h3><p>Use a shadow when the white symbol needs attention.</p></div></article>
   <article><span class="icon-evidence-label">02 · Outline</span><div class="icon-evidence-art"><span class="icon-source-detail icon-source-outline">${img('/assets/design-revision/icon-refinement-black.svg','Original parking icon and outlined refinement')}</span></div><div class="icon-evidence-number">3.71 <span>→</span> 4.13 <small>/ 5</small></div><p>Mean meaning rating, original → outlined</p><div class="icon-evidence-rule"><h3>Clarify everyday controls</h3><p>Keep the color while giving the symbol a clearer edge.</p></div></article>
   <article><span class="icon-evidence-label">03 · Gray backplate</span><div class="icon-evidence-art"><span class="icon-source-detail icon-source-gray">${img('/assets/design-revision/icon-refinement-black.svg','Parking icon on the original gray backplate')}</span></div><div class="icon-evidence-number">30% <small>brightness</small></div><p>Balanced clarity and lower intrusion</p><div class="icon-evidence-rule"><h3>Keep status in view</h3><p>20% was too faint; 40% introduced more color mixing.</p></div></article>
  </div><p class="icon-analysis-method">Ratings are on a 1–5 scale. The 3.71 → 4.13 values are rounded from 3.708 → 4.125; examples above show the original design treatments.</p>`);
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
