import {siteURL} from './site-paths.js';
// An uninterrupted recording of the published Unity build; no simulated game state.
export function setupAmbulanceRecording(root=document,project){
 if((project?.id||document.body.dataset.project)!=='ambulance')return()=>{};
 const chapter=root.querySelector('#gameplay');if(!chapter||chapter.querySelector('.ar-real-playback'))return()=>{};
 const block=document.createElement('div');block.className='ar-real-playback';
 block.innerHTML=`<div class="ar-playback-heading"><p class="eyebrow">Inside the game</p><h3>Take a call. Check the beds. Drive</h3></div><div class="ar-playback-layout"><figure><video src="${siteURL('/assets/recordings/ambulance-original-gameplay.webm')}" poster="${siteURL('/assets/recordings/ambulance-original-gameplay-poster.png')}" width="1280" height="720" controls muted loop playsinline preload="metadata" aria-label="Original Ambulance Rush gameplay: choose a patient, inspect hospital capacity and drive through Adelaide"></video></figure><ol class="ar-playback-notes"><li><span>01</span><div><h4>Read the call</h4><p>Check urgency; accept or decline.</p></div></li><li><span>02</span><div><h4>Check hospital capacity</h4><p>Check available beds before choosing a hospital.</p></div></li><li><span>03</span><div><h4>Find your way</h4><p>Follow the minimap to your destination.</p></div></li></ol></div>`;
 chapter.append(block);const video=block.querySelector('video'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let visible=false;video.defaultPlaybackRate=2;video.playbackRate=2;
 const sync=()=>{if(visible&&!reduced.matches)video.play().catch(()=>{});else video.pause();};
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.3});observer.observe(video);reduced.addEventListener('change',sync);
 return()=>{observer.disconnect();reduced.removeEventListener('change',sync);video.pause();video.removeAttribute('src');video.load();block.remove();};
}
