import {siteURL} from './site-paths.js';
import {imageVariant} from './image-variants.js';

const order=['glancemap','traditional-color','icon-colors','ambulance','loofasoup','hersound','ourworld','personamail','beyond-the-gaze','suzhou-scrollverse','versecolor'];
const palettes={glancemap:'#384c24','traditional-color':'#4a6266','icon-colors':'#225865',ambulance:'#3f5577',loofasoup:'#43664e',hersound:'#6c6660',ourworld:'#496154',personamail:'#526779','beyond-the-gaze':'#47636b','suzhou-scrollverse':'#696b4c',versecolor:'#3c6558'};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function cover(project){
 if(project.id==='hersound')return `<span class="project-neighbor-art neighbor-palace" aria-hidden="true"><img class="neighbor-palace-building" src="${siteURL('/assets/her-1018/after2-palace-original.png')}" alt="" loading="lazy"><img class="neighbor-palace-waner" src="${siteURL('/assets/games-revision/her/game/shangguan-waner-close-side.png')}" alt="" loading="lazy"><img class="neighbor-palace-taiping" src="${siteURL('/assets/games-revision/her/game/princess-taiping-close-side.png')}" alt="" loading="lazy"></span>`;
 const hero=project.hero;
 const source=hero.researchFigure?.image||hero.comic?.src||hero.src;
 return `<span class="project-neighbor-art"><img src="${siteURL(imageVariant(source))}" alt="" loading="lazy" decoding="async"></span>`;
}

export function renderProjectNavigation(project,projects){
 const sequence=order.map(id=>projects.find(item=>item.id===id)).filter(Boolean);
 const index=sequence.findIndex(item=>item.id===project.id);
 if(index<0||sequence.length<2)return '';
 const previous=sequence[(index-1+sequence.length)%sequence.length];
 const next=sequence[(index+1)%sequence.length];
 const card=(item,direction)=>`<a class="project-neighbor neighbor-${direction}" href="${siteURL(item.slug)}" aria-label="${direction==='previous'?'Previous':'Next'} project: ${esc(item.title)}"><span class="project-neighbor-direction">${direction==='previous'?'<span aria-hidden="true">←</span> Previous project':'Next project <span aria-hidden="true">→</span>'}</span>${cover(item)}<h3>${esc(item.title)}</h3></a>`;
 return `<nav class="project-neighbors" aria-label="Previous and next projects" style="--neighbor-left:${palettes[previous.id]};--neighbor-right:${palettes[next.id]}">${card(previous,'previous')}${card(next,'next')}</nav>`;
}
