import {siteURL} from './site-paths.js';
import {emphasize} from './case-editorial.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=(src,alt,width,height)=>`<img src="${siteURL(src)}" alt="${esc(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">`;
export function setupHerEditorial(root,project){
 if(project.id!=='hersound')return()=>{};
 const sections=Object.fromEntries(project.sections.map(s=>[s.id,s]));
 const award=root.querySelector('.hero-outcome'),hero=root.querySelector('.case-hero');
 if(award&&hero){award.classList.add('her-award');hero.insertBefore(award,hero.querySelector('.stats'));}
 const abstract=root.querySelector('#abstract');
 if(abstract){
  abstract.className='case-section her-abstract';
  const heading=abstract.querySelector('.section-heading');
  abstract.replaceChildren(heading);
  const story=document.createElement('div');story.className='her-abstract-story';
  const s=sections.abstract;
  story.innerHTML=`<div class="her-abstract-copy">${[].concat(s.body).map(p=>`<p>${emphasize(p,s.highlights)}</p>`).join('')}<blockquote><p>“${esc(s.items[0].quote)}”</p><cite>Hackathon audience feedback</cite></blockquote></div><div class="her-abstract-portraits">${s.figures.map(f=>`<figure>${image(f.src,f.alt,f.width,f.height)}<figcaption>${esc(f.caption)}</figcaption></figure>`).join('')}</div>`;
  abstract.append(story);
 }
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
 return()=>{};
}
