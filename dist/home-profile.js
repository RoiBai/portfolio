const portrait=document.querySelector('.profile-portrait');
if(portrait){
 const reveal=()=>{portrait.classList.add('is-color');portrait.setAttribute('aria-pressed','true');portrait.setAttribute('aria-label','Portrait revealed in color');};
 portrait.addEventListener('pointerenter',reveal,{once:true});
 portrait.addEventListener('click',reveal,{once:true});
 portrait.addEventListener('focus',reveal,{once:true});
}
const themes={
 'glancemap':['everyday'],'color-in-context':['culture','ai'],'icon-colors':['everyday'],
 ambulance:['play'],loofasoup:['play','culture'],hersound:['play','culture'],ourworld:['play'],
 personamail:['ai'],'beyond-the-gaze':['culture'],'suzhou-scrollverse':['culture'],versecolor:['culture','ai']
};
const choices=[...document.querySelectorAll('#selected-work :is(.project-row,.project-choice)')];
const groups=[...document.querySelectorAll('#selected-work .group-row')];
const filters=[...document.querySelectorAll('.project-filters button')];
const status=document.querySelector('.filter-status');
const FILTER_KEY='portfolio:project-question:v1';
function selectFilter(filter){
 try{sessionStorage.setItem(FILTER_KEY,filter);}catch{}
 filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
 choices.forEach(choice=>{choice.hidden=filter!=='all'&&!themes[choice.dataset.project]?.includes(filter);});
 groups.forEach(group=>{const count=[...group.querySelectorAll('.project-choice')].filter(c=>!c.hidden).length;group.hidden=count===0;group.dataset.filtered=String(filter!=='all');group.style.setProperty('--visible-choices',count||1);group.dispatchEvent(new Event('pointerleave'));});
 const count=choices.filter(c=>!c.hidden).length;
 if(status)status.textContent=`${count} ${count===1?'project':'projects'}`;
}
filters.forEach(button=>button.addEventListener('click',()=>selectFilter(button.dataset.filter)));

try{const saved=sessionStorage.getItem(FILTER_KEY);if(filters.some(b=>b.dataset.filter===saved))selectFilter(saved);}catch{}
