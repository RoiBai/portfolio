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
 const cards=document.createElement('div');cards.className='icon-study-cards';
 parent.querySelector(':scope>.section-body:empty')?.remove();
 for(const[order,stage]of stages.entries()){
  stage.classList.add('icon-study-stage');stage.dataset.navParent='study';
  const heading=stage.querySelector(':scope>.section-heading');
  if(heading){
   heading.querySelector('.eyebrow')?.remove();
   const old=heading.querySelector('h2');
   if(old){const title=document.createElement('h3');title.innerHTML='<span class="icon-study-number">Study '+(order+1)+'</span>'+esc(old.textContent.replace(/^(?:Stage|Study)\s+\d\s*·\s*/, ''));old.replaceWith(title);}
  }
  cards.append(stage);
 }
 parent.append(cards);
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
   <figure><div class="icon-desktop-context"><div class="icon-monitor"><span class="icon-parking-pair"><span class="icon-screen-parking" aria-label="White parking symbol on blue">P</span><span class="icon-result-check" aria-label="Clear on screen"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 33 26 47 54 16"/></svg></span></span></div><div class="icon-monitor-foot"></div></div><figcaption><h3>On a screen</h3><small><strong>9.06 : 1</strong> calculated screen contrast · #0000F5 / #FFFFFF</small></figcaption></figure>
   <figure><div class="icon-ar-context">${img('/assets/icon-original-explorations/outdoor-prototype-source.png','Original outdoor street scene behind an AR parking symbol')}<span class="icon-parking-pair icon-parking-pair-ar"><span class="icon-ar-parking" aria-label="Parking symbol at 70 percent opacity">P</span><span class="icon-result-cross" aria-label="Screen contrast does not guarantee AR clarity"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="m16 16 32 32m0-32L16 48"/></svg></span></span></div><figcaption><h3>Through AR glasses</h3><small>The real scene shows through the icon</small></figcaption></figure>
  </div><div class="icon-context-explanation"><p>The screen’s blue background is opaque. In AR, <strong>the real scene shines through</strong>; white can glare or merge with a bright background. <strong>Test clarity through the glasses</strong>, alongside screen contrast.</p></div>
`);
 }
 const setup=root.querySelector('#setup'),setupData=project.sections?.find(s=>s.id==='setup');
 if(setup&&setupData?.studySetup){
  setup.querySelector('.section-body')?.remove();
  setup.querySelector('.section-heading')?.insertAdjacentHTML('afterend',`<div class="icon-shared-setup">${setupData.studySetup.map(item=>`<article><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('')}</div>${setupData.hardwareCheck?`<p class="icon-hardware-check">${esc(setupData.hardwareCheck)}</p>`:''}`);
 }
 const workshop=root.querySelector('#workshop');
 if(workshop){
  workshop.insertAdjacentHTML('beforeend',`<div class="icon-research-plan">
   <div class="icon-workshop-brief"><h3>From color choices to design alternatives</h3><p>Designers paired twelve hues with familiar functions. After Studies 1 and 2, they explored treatments for edges and backgrounds.</p></div>
   <div class="icon-workshop-library" aria-label="Twelve meanings selected by the designer workshop">${visuals.workshopLibrary||''}</div>
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
  if(data.studyNext){
   section.insertAdjacentHTML('beforeend',`<p class="icon-study-next"><strong>${esc(data.studyNext.label)}</strong> ${esc(data.studyNext.body)}</p>`);
  }
  if(data.studyComparisons?.length){
   section.insertAdjacentHTML('beforeend',`<details class="icon-study3-results"><summary>Retesting results</summary><div class="icon-study3-comparisons">${data.studyComparisons.map(item=>`<article><h5>${esc(item.treatment)}</h5><span>${esc(item.comparison)}</span><p>${esc(item.result)}</p></article>`).join('')}</div></details>`);
  }
  if(data.reasoning?.length){
   const bridge=document.createElement('div');bridge.className='icon-refinement-reasoning';
   bridge.innerHTML=data.reasoning.map((item,index)=>`<article class="icon-refinement-row"><div class="icon-refinement-copy"><h4>${esc(item.title)}</h4><p>${text(item.observation,item.highlights)}</p><p class="icon-refinement-decision"><span aria-hidden="true">↳</span><span>${text(item.decision,item.highlights)}</span></p></div><div class="icon-refinement-evidence-row"><div class="icon-refinement-before-after">${index===0?visuals.whiteRefinement||'':visuals.blackRefinement||''}</div>${item.evidence?`<div class="icon-refinement-evidence"><p>${text(item.evidence,item.highlights)}</p>${index===0&&visuals.whiteGradientEvidence?`<p>${esc(visuals.whiteGradientEvidence)}</p>`:''}</div>`:''}</div></article>`).join('');
   workshop?.append(bridge);
  }
 }
 if(workshop&&visuals.designAlternatives){const gallery=document.createElement('div');gallery.className='icon-workshop-alternatives';gallery.innerHTML=visuals.designAlternatives;workshop.append(gallery);}
 const guidelines=root.querySelector('#guidelines'),data=project?.sections?.find(s=>s.id==='guidelines');
 if(guidelines&&data?.items?.some(item=>item.priority)){
  const heading=guidelines.querySelector('.section-heading');guidelines.replaceChildren(heading);guidelines.classList.add('icon-guidelines-combined');
  const content=document.createElement('div');content.className='icon-guidance-content';
  content.innerHTML=`${data.body?.length?`<div class="icon-guidance-intro">${[].concat(data.body).map(t=>`<p>${text(t,data.highlights)}</p>`).join('')}</div>`:''}
   <section class="icon-guideline-section" aria-labelledby="icon-guideline-prominence"><h3 id="icon-guideline-prominence"><span>01</span> Prominence</h3><div class="icon-priority-guidance">${data.items.map(item=>`<article><span class="icon-priority-label">${esc(item.priority)} prominence</span>${item.src?`<figure>${img(item.src,item.title)}</figure>`:''}<h4>${esc(item.title)}</h4><p>${text(item.body,data.highlights)}</p>${item.evidence?`<p class="icon-guidance-evidence">${text(item.evidence,data.highlights)}</p>`:''}${item.takeaway?`<p class="icon-guidance-takeaway">${text(item.takeaway,data.highlights)}</p>`:''}</article>`).join('')}</div></section>
   ${data.findings?.length?`<section class="icon-guideline-section" aria-labelledby="icon-guideline-gradients"><h3 id="icon-guideline-gradients"><span>02</span> Gradients</h3><div class="icon-guidance-findings${data.findings.length===1?' icon-guidance-findings-single':''}">${data.findings.map(f=>`<article>${f.src?`<figure>${img(f.src,f.title)}</figure>`:''}<div><h4>${esc(f.title)}</h4>${f.metric?`<strong class="icon-guidance-metric">${esc(f.metric)}</strong>`:''}<p>${text(f.body,data.highlights)}</p></div></article>`).join('')}</div></section>`:''}
   ${data.audience?`<section class="icon-guideline-section" aria-labelledby="icon-guideline-pairings"><h3 id="icon-guideline-pairings"><span>03</span> Unexpected pairings</h3><aside class="icon-guidance-audience">${data.audience.figures?.length?`<div class="icon-guidance-audience-art">${visuals.audienceExamples||data.audience.figures.map(f=>img(f.src,f.alt||data.audience.title)).join('')}</div>`:''}<div><h4>${esc(data.audience.title)}</h4><p>${text(data.audience.body,data.highlights)}</p></div></aside></section>`:''}`;
  guidelines.append(content);
 }
 groupIconStudies(root);
 return()=>{};
}
