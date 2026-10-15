import {siteURL} from './site-paths.js';
import {emphasize} from './case-editorial.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img=(path,alt,cls='')=>`<img class="${cls}" src="${siteURL(path)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const text=(value,highlights=[])=>emphasize(Array.isArray(value)?value.join(' '):value,highlights);

// The icons are original exports; the explanations and reading layout stay native HTML.
export function setupIconEditorial(root,project,visuals={}){
 const abstract=root.querySelector('#abstract');
 if(abstract){abstract.querySelector('.section-visuals')?.remove();abstract.classList.add('icon-prose-abstract');}
 const problem=root.querySelector('#problem');
 if(problem){
  problem.querySelector('.section-visuals')?.remove();
  problem.insertAdjacentHTML('beforeend',`<div class="icon-context-comparison">
   <figure><div class="icon-desktop-context"><div class="icon-monitor"><span class="icon-screen-parking" aria-label="White parking symbol on blue">P</span></div><div class="icon-monitor-foot"></div></div><figcaption><h3>On a screen <span class="icon-result-check">✓</span></h3><small><strong>9.06 : 1</strong> calculated screen contrast · #0000F5 / #FFFFFF</small></figcaption></figure>
   <figure><div class="icon-ar-context">${img('/assets/icon-original-explorations/outdoor-prototype-source.png','Original outdoor street scene behind an AR parking symbol')}<span class="icon-ar-parking" aria-label="Parking symbol at 70 percent opacity">P</span></div><figcaption><h3>Through AR glasses <span class="icon-result-cross">×</span></h3><small>The real scene shows through the icon</small></figcaption></figure>
   <div class="icon-context-explanation"><p>On a screen, a white parking symbol stands out against an opaque blue background. Through AR glasses, <strong>the real scene also shines through</strong>.</p><p><strong>White can cause glare or blend into a bright background.</strong> Screen contrast alone cannot predict AR clarity.</p></div>
  </div><div class="icon-abstract-pairs">
   <figure><div class="icon-abstract-pair-art"><span class="icon-abstract-t-pair">${img('/assets/icon-original-explorations/abstract-cyan-foregrounds-original.svg','Original cyan letter T with black and white foregrounds')}</span><span class="icon-abstract-opposite">${visuals.oppositeForeground||''}</span></div><figcaption><h3>Compare foregrounds</h3><p>Black, white and opposite-color symbols</p></figcaption></figure>
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
 const meaning=root.querySelector('#meaning');
 if(meaning){meaning.querySelector('.icon-color-lab')?.insertAdjacentHTML('beforebegin',`<div class="icon-designer-consensus"><div class="icon-designer-count"><strong>8</strong><span>designers</span></div><p>Agreed on <strong>one icon per color</strong><span>The twelve shared meanings became the icon library for this study.</span></p></div>`);}
 const guidelines=root.querySelector('#guidelines'),data=project?.sections?.find(s=>s.id==='guidelines');
 if(guidelines&&data?.items?.some(item=>item.priority)){
  const heading=guidelines.querySelector('.section-heading');guidelines.replaceChildren(heading);guidelines.classList.add('icon-guidelines-combined');
  const content=document.createElement('div');content.className='icon-guidance-content';
  content.innerHTML=`${data.body?.length?`<div class="icon-guidance-intro">${[].concat(data.body).map(t=>`<p>${text(t,data.highlights)}</p>`).join('')}</div>`:''}<div class="icon-priority-guidance">${data.items.map(item=>`<article><span class="icon-priority-label">${esc(item.priority)} priority</span>${item.src?`<figure>${img(item.src,item.title)}</figure>`:''}<h3>${esc(item.title)}</h3><p>${text(item.body,data.highlights)}</p>${item.evidence?`<p class="icon-guidance-evidence">${text(item.evidence,data.highlights)}</p>`:''}${item.takeaway?`<p class="icon-guidance-takeaway">${text(item.takeaway,data.highlights)}</p>`:''}</article>`).join('')}</div>${data.findings?.length?`<div class="icon-guidance-findings">${data.findings.map(f=>`<article>${f.src?`<figure>${img(f.src,f.title)}</figure>`:''}<div><h3>${esc(f.title)}</h3>${f.metric?`<strong class="icon-guidance-metric">${esc(f.metric)}</strong>`:''}<p>${text(f.body,data.highlights)}</p></div></article>`).join('')}</div>`:''}${data.audience?`<aside class="icon-guidance-audience">${data.audience.figures?.length?`<div class="icon-guidance-audience-art">${data.audience.figures.map(f=>img(f.src,f.alt||data.audience.title)).join('')}</div>`:''}<div><h3>${esc(data.audience.title)}</h3><p>${text(data.audience.body,data.highlights)}</p></div></aside>`:''}`;
  guidelines.append(content);
 }
}
