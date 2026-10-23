import {siteURL} from './site-paths.js';
// One continuous capacity dilemma from the user’s original recording (02:43–03:40), played at 1.5×.
export function setupAmbulanceRecording(root=document,project){
 if((project?.id||document.body.dataset.project)!=='ambulance')return()=>{};
 const chapter=root.querySelector('#gameplay');if(!chapter||chapter.querySelector('.ar-real-playback'))return()=>{};
 const block=document.createElement('div');block.className='ar-real-playback';
 block.innerHTML=`<div class="ar-playback-heading"><p class="eyebrow">Inside the game</p><h3>One patient, two competing demands</h3></div><div class="ar-playback-layout"><figure><video src="${siteURL('/assets/recordings/ambulance-capacity-sequence.mp4')}" poster="${siteURL('/assets/recordings/ambulance-capacity-poster.jpg')}" width="1440" height="908" controls muted loop playsinline preload="metadata" aria-label="An uninterrupted Ambulance Rush recording excerpt: Lucas encounters full hospitals before a bed opens at Flinders Medical Centre. Playing at 1.5 times the recorded speed."></video></figure><div class="ar-playback-dilemma"><span class="ar-outcome-label">One recorded rescue</span><h4>Lucas is aboard. All three hospitals are full.</h4><p>When a bed opens at Flinders Medical Centre, the driver reroutes and delivers Lucas before time runs out. Players control the route, <strong>not the supply of beds.</strong></p></div></div>`;
 chapter.append(block);const video=block.querySelector('video'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let visible=false;video.defaultMuted=true;video.muted=true;video.defaultPlaybackRate=1.5;video.playbackRate=1.5;
 const sync=()=>{if(visible&&!reduced.matches)video.play().catch(()=>{});else video.pause();};
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.3});observer.observe(video);reduced.addEventListener('change',sync);
 return()=>{observer.disconnect();reduced.removeEventListener('change',sync);video.pause();video.removeAttribute('src');video.load();block.remove();};
}
