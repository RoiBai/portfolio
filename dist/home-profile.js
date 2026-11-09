const portrait=document.querySelector('.profile-portrait');
if(portrait){
 const reveal=()=>{portrait.classList.add('is-color');portrait.setAttribute('aria-pressed','true');portrait.setAttribute('aria-label','Portrait revealed in color');};
 portrait.addEventListener('pointerenter',reveal,{once:true});
 portrait.addEventListener('click',reveal,{once:true});
 portrait.addEventListener('focus',reveal,{once:true});
}

// Project questions are no longer filters: the full list is always visible.
try{sessionStorage.removeItem("portfolio:project-question:v1");}catch{}
