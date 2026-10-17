import {siteURL} from './site-paths.js';
import {emphasize} from './case-editorial.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img=(path,alt,cls='')=>`<img class="${cls}" src="${siteURL(path)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const text=(value,highlights=[])=>emphasize(Array.isArray(value)?value.join(' '):value,highlights);

// Keep the three experiments within one chapter while preserving their deep links.
function groupIconStudies(root){
 const parent=root.querySelector('#study');
 if(!parent||parent.classList.contains('icon-study-group'))return;
 const stages=['baseline','meaning','refinement'].map(id=>root.querySelector('#'+id)).filter(Boolean);
 if(!stages.length)return;
 parent.classList.add('icon-study-group');parent.removeAttribute('data-reveal-group');
 parent.querySelector(':scope>.section-body:empty')?.remove();
 for(const[order,stage]of stages.entries()){
  stage.classList.add('icon-study-stage');stage.dataset.navParent='study';
  const heading=stage.querySelector(':scope>.section-heading');
  if(heading){
   heading.querySelector('.eyebrow')?.remove();
   const old=heading.querySelector('h2');
   if(old){const title=document.createElement('h3');title.textContent='Study '+(order+1)+' · '+old.textContent.replace(/^(?:Stage|Study)\s+\d\s*·\s*/, '');old.replaceWith(title);}
  }
  parent.append(stage);
 }
 // Major chapter numbers exclude the three subordinate studies.
 [...root.querySelectorAll('.case-study>.case-section')].forEach((section,index)=>{
  const number=section.querySelector(':scope>.section-heading .eyebrow>span');
  if(number)number.textContent=String(index+1).padStart(2,'0');
 });
}

// The icons are original exports; the explanations and reading layout stay native HTML.
export function setupIconEditorial(root,project,visuals={}){
 const abstract=root.querySelector('#abstract');
 if(abstract){abstract.querySelector('.section-visuals')?.remove();abstract.classList.add('icon-prose-abstract');}
 const problem=root.querySelector('#problem');
 if(problem){
  problem.querySelector('.section-visuals')?.remove();
  problem.insertAdjacentHTML('beforeend',`<div class="icon-context-comparison">
   <figure><div class="icon-desktop-context"><div class="icon-monitor"><span class="icon-screen-parking" aria-label="White parking symbol on blue">P</span></div><div class="icon-monitor-foot"></div><span class="icon-result-check" aria-label="Clear on screen">✓</span></div><figcaption><h3>On a screen</h3><small><strong>9.06 : 1</strong> calculated screen contrast · #0000F5 / #FFFFFF</small></figcaption></figure>
   <figure><div class="icon-ar-context">${img('/assets/icon-original-explorations/outdoor-prototype-source.png','Original outdoor street scene behind an AR parking symbol')}<span class="icon-ar-parking" aria-label="Parking symbol at 70 percent opacity">P</span><span class="icon-result-cross" aria-label="Screen contrast does not guarantee AR clarity">×</span></div><figcaption><h3>Through AR glasses</h3><small>The real scene shows through the icon</small></figcaption></figure>
  </div><div class="icon-context-explanation"><p>The screen’s blue background is opaque. In AR, <strong>the real scene shines through</strong>; white can glare or merge with a bright background. <strong>Test clarity through the glasses</strong>, alongside screen contrast.</p></div>
`);
 }
 const workshop=root.querySelector('#workshop');
 if(workshop){
  workshop.insertAdjacentHTML('beforeend',`<div class="icon-research-plan">
   <figure class="icon-workshop-library">${img('/assets/design-revision/icon-library.svg','The original twelve-icon library: dining, finance, light bulb, cycling, video call, weather, files, parking, yoga, bar, music and alert')}<figcaption>Twelve meanings selected by the designer workshop</figcaption></figure>
   <div class="icon-study-timeline"><p><strong>Three linked studies</strong><span>The same 20 participants completed Studies 1–3.</span></p><ol>
    <li><span>01</span><h3>Compare colors</h3><p>Fixed letter · clarity + comfort</p></li>
    <li><span>02</span><h3>Add meaning</h3><p>Workshop icons · how well the colors fit</p></li>
    <li><span>03</span><h3>Refine the design</h3><p>New treatments · perceived priority</p></li>
   </ol></div>
  </div>`);
 }
 // Put the evidence immediately after the material it explains, before the next study.
 for(const data of project.sections||[]){
  const section=root.querySelector('#'+data.id);
  if(!section)continue;
  if(data.studyFinding){
   const f=data.studyFinding;
   section.insertAdjacentHTML('beforeend',`<aside class="icon-study-finding"><small>${esc(f.label)}</small><p>${text(f.body,f.highlights)}</p></aside>`);
  }
  if(data.reasoning?.length){
   const bridge=document.createElement('div');bridge.className='icon-refinement-reasoning';
   bridge.innerHTML=data.reasoning.map((item,index)=>`<article class="icon-refinement-row"><div class="icon-refinement-copy"><h4>${esc(item.title)}</h4><p>${text(item.observation,item.highlights)}</p><p class="icon-refinement-decision"><span aria-hidden="true">↳</span><span>${text(item.decision,item.highlights)}</span></p></div><div class="icon-refinement-evidence-row"><div class="icon-refinement-before-after">${index===0?visuals.whiteRefinement||'':visuals.blackRefinement||''}</div>${item.evidence?`<p class="icon-refinement-evidence">${text(item.evidence,item.highlights)}</p>`:''}</div></article>`).join('');
   section.querySelector('.section-visuals')?.before(bridge);
  }
 }
 const guidelines=root.querySelector('#guidelines'),data=project?.sections?.find(s=>s.id==='guidelines');
 if(guidelines&&data?.items?.some(item=>item.priority)){
  const heading=guidelines.querySelector('.section-heading');guidelines.replaceChildren(heading);guidelines.classList.add('icon-guidelines-combined');
  const content=document.createElement('div');content.className='icon-guidance-content';
  content.innerHTML=`${data.body?.length?`<div class="icon-guidance-intro">${[].concat(data.body).map(t=>`<p>${text(t,data.highlights)}</p>`).join('')}</div>`:''}<div class="icon-priority-guidance">${data.items.map(item=>`<article><span class="icon-priority-label">${esc(item.priority)} prominence</span>${item.src?`<figure>${img(item.src,item.title)}</figure>`:''}<h3>${esc(item.title)}</h3><p>${text(item.body,data.highlights)}</p>${item.evidence?`<p class="icon-guidance-evidence">${text(item.evidence,data.highlights)}</p>`:''}${item.takeaway?`<p class="icon-guidance-takeaway">${text(item.takeaway,data.highlights)}</p>`:''}</article>`).join('')}</div>${data.findings?.length?`<div class="icon-guidance-findings${data.findings.length===1?' icon-guidance-findings-single':''}">${data.findings.map(f=>`<article>${f.src?`<figure>${img(f.src,f.title)}</figure>`:''}<div><h3>${esc(f.title)}</h3>${f.metric?`<strong class="icon-guidance-metric">${esc(f.metric)}</strong>`:''}<p>${text(f.body,data.highlights)}</p></div></article>`).join('')}</div>`:''}${data.audience?`<aside class="icon-guidance-audience">${data.audience.figures?.length?`<div class="icon-guidance-audience-art">${data.audience.figures.map(f=>img(f.src,f.alt||data.audience.title)).join('')}</div>`:''}<div><h3>${esc(data.audience.title)}</h3><p>${text(data.audience.body,data.highlights)}</p></div></aside>`:''}`;
  guidelines.append(content);
 }
 groupIconStudies(root);
}
