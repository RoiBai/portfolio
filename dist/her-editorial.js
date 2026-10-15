import {siteURL} from './site-paths.js';
import {emphasize} from './case-editorial.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const keepQuoteEnding=value=>esc(value).replace(/games of our own\./,'<span class="her-quote-ending">games of our own.</span>');
const image=(src,alt,width,height)=>`<img src="${siteURL(src)}" alt="${esc(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">`;
export function setupHerEditorial(root,project){
 if(project.id!=='hersound')return()=>{};
 const sections=Object.fromEntries(project.sections.map(s=>[s.id,s]));
 const awardStat=[...root.querySelectorAll('.case-hero .stats>div')].find(stat=>stat.querySelector('strong')?.textContent.trim()==='Audience Choice'&&stat.querySelector(':scope>span')?.textContent.trim()==='Award');
 awardStat?.classList.add('her-audience-award');
 const award=root.querySelector('.hero-outcome'),hero=root.querySelector('.case-hero');
 if(award&&hero){award.classList.add('her-award');hero.insertBefore(award,hero.querySelector('.stats'));}
 const abstract=root.querySelector('#abstract');
 if(abstract){
  abstract.className='case-section her-abstract';
  const heading=abstract.querySelector('.section-heading');
  abstract.replaceChildren(heading);
  const story=document.createElement('div');story.className='her-abstract-story';
  const s=sections.abstract;
  story.innerHTML=`<div class="her-abstract-copy">${[].concat(s.body).map(p=>`<p>${emphasize(p,s.highlights)}</p>`).join('')}</div><div class="her-abstract-portraits">${s.figures.map(f=>`<figure>${image(f.src,f.alt,f.width,f.height)}<figcaption>${esc(f.caption)}</figcaption></figure>`).join('')}</div><blockquote class="her-audience-quote"><p>“${keepQuoteEnding(s.items[0].quote)}”</p><cite>Hackathon audience feedback</cite></blockquote>`;
  abstract.append(story);
 }
 const assembleSection=root.querySelector('#assemble');
 assembleSection?.classList.add('her-assemble');
 // The chapter heading belongs to the sticky canvas: it remains visible throughout erasure.
 const erase=root.querySelector('#erase'),panel=erase?.querySelector('.gx-wind-panel'),eraseHeading=erase?.querySelector(':scope>.section-heading');
 if(panel&&eraseHeading){erase.classList.add('her-erase');eraseHeading.classList.remove('reveal');panel.prepend(eraseHeading);erase.querySelector(':scope>.section-body')?.remove();}
 const question=root.querySelector('#question');
 if(question){
  question.className='case-section her-question';
  const heading=question.querySelector('.section-heading');question.replaceChildren(heading);
  const s=sections.question,body=document.createElement('div');body.className='her-accusations';
  body.innerHTML=`<p class="her-question-deck">${emphasize(s.body,s.highlights)}</p><div class="her-accusation-pair">${s.items.map((item,i)=>`<figure class="her-accusation">${image(s.figures[i].src,s.figures[i].alt,s.figures[i].width,s.figures[i].height)}<figcaption><span>${esc(item.title)}</span><p>${emphasize(item.body,s.highlights)}</p></figcaption></figure>`).join('')}</div><p class="her-question-transition">What changes when they hold the power to tell their own stories?</p>`;
  question.append(body);
 }
 const evidence=root.querySelector('#evidence');
 if(evidence){
  evidence.className='case-section her-evidence';
  const heading=evidence.querySelector('.section-heading'),s=sections.evidence;
  heading?.querySelector('h2')?.remove();
  evidence.replaceChildren(heading);
  const story=document.createElement('div');story.className='her-evidence-story';
  const f=s.figures[0];
  story.innerHTML=`<div class="her-evidence-copy"><h2 class="her-evidence-subtitle">${esc(s.title)}</h2>${[].concat(s.body).filter(Boolean).map(p=>`<p>${emphasize(p,s.highlights)}</p>`).join('')}${s.source?`<a class="her-evidence-source" href="${esc(s.source.url)}" target="_blank" rel="noopener noreferrer">${esc(s.source.label)} ↗</a>`:''}</div><figure class="her-evidence-art">${image(f.src,f.alt,f.width,f.height)}</figure>`;
  evidence.append(story);
 }
 const wish=root.querySelector('#wish');
 if(wish){
  wish.className='case-section her-wish';
  const heading=wish.querySelector('.section-heading'),s=sections.wish;
  wish.replaceChildren(heading);
  const words=document.createElement('div');words.className='her-wish-words';
  words.innerHTML=`<p class="her-farewell">${emphasize(s.body,s.highlights)}</p><p class="her-farewell-context">${emphasize(s.context,['Taiping’s farewell'])}</p>`;
  heading.append(words);
  const art=document.createElement('figure');art.className='her-farewell-art';const f=s.figures[0];art.innerHTML=image(f.src,f.alt,f.width,f.height);wish.append(art);
 }
 const assemble=root.querySelector('[data-experience="hersound-assemble"]');
 const host=assemble?.querySelector('[data-her-part="assemble"]');
 const guide=assemble?.querySelector('.gx-her-guide');
 const steps=guide?[...guide.children]:[];
 let measureFrame=0;
 const updateGuide=event=>{
  const completed=event?.detail?.completedSteps||[true,false,false];
  const current=completed.every(Boolean)?-1:completed[1]?2:1;
  steps.forEach((step,index)=>{
   step.dataset.stepState=completed[index]?'complete':index===current?'current':'upcoming';
   if(index===current)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');
   step.querySelector('.her-step-status')?.remove();
   const title=step.querySelector('strong');
   let mark=title?.querySelector('.her-step-check');
   if(!mark&&title){mark=document.createElement('i');mark.className='her-step-check';mark.setAttribute('aria-hidden','true');mark.textContent='✓';title.append(mark);}
   if(mark)mark.hidden=!completed[index];
   step.setAttribute('aria-label',`${title?.textContent.replace('✓','').trim()}: ${completed[index]?'completed':index===current?'current step':'upcoming'}`);
  });
  if(guide){
   guide.dataset.hasCurrent=String(current>=0);
   cancelAnimationFrame(measureFrame);
   measureFrame=requestAnimationFrame(()=>{
    if(current<0)return;
    guide.style.setProperty('--guide-current-y',`${steps[current].offsetTop}px`);
    guide.style.setProperty('--guide-current-height',`${steps[current].offsetHeight}px`);
   });
  }
  const instruction=assemble?.querySelector('.gx-play-guide>.gx-instruction');
  if(instruction){
   const second=event?.detail?.scenes?.[1]||['banquet','waner'];
   instruction.textContent=current<0?'All three scenes are complete. Select a frame to clear it and try again.':current===2?'Choose Poetry, Waner and Taiping, then place each in the last frame.':second.includes('banquet')&&second.includes('waner')?'The first frame is complete. Choose Taiping and place her in the second frame.':'Rebuild the second frame with Banquet, Waner and Taiping.';
  }
 };
 host?.addEventListener('portfolio:her-progress',updateGuide);
 updateGuide();
 return()=>{cancelAnimationFrame(measureFrame);host?.removeEventListener('portfolio:her-progress',updateGuide);};
}
