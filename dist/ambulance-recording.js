import {siteURL} from './site-paths.js';
// The user’s complete original gameplay recording, played at 1.5× speed.
export function setupAmbulanceRecording(root=document,project){
 if((project?.id||document.body.dataset.project)!=='ambulance')return()=>{};
 const chapter=root.querySelector('#gameplay');if(!chapter||chapter.querySelector('.ar-real-playback'))return()=>{};
 const block=document.createElement('div');block.className='ar-real-playback';
 block.innerHTML=`<div class="ar-playback-heading"><p class="eyebrow">Inside the game</p><h3>Take a call. Check the beds. Drive</h3></div><div class="ar-playback-layout"><figure><video src="${siteURL('/assets/recordings/ambulance-user-gameplay.mp4')}" poster="${siteURL('/assets/recordings/ambulance-original-gameplay-poster.png')}" width="1440" height="908" controls muted loop playsinline preload="metadata" aria-label="Original Ambulance Rush gameplay recorded by the project creator, playing at 1.5 times the recorded speed"></video></figure><ol class="ar-playback-notes"><li><span>01</span><div><h4>Read the call</h4><p>Read the patient’s condition and urgency.</p></div></li><li><span>02</span><div><h4>Check hospital capacity</h4><p>Check available beds before choosing a hospital.</p></div></li><li><span>03</span><div><h4>Find your way</h4><p>Follow the minimap to your destination.</p></div></li></ol></div>`;
 chapter.append(block);const video=block.querySelector('video'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let visible=false;video.defaultMuted=true;video.muted=true;video.defaultPlaybackRate=1.5;video.playbackRate=1.5;
 const sync=()=>{if(visible&&!reduced.matches)video.play().catch(()=>{});else video.pause();};
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.3});observer.observe(video);reduced.addEventListener('change',sync);
 return()=>{observer.disconnect();reduced.removeEventListener('change',sync);video.pause();video.removeAttribute('src');video.load();block.remove();};
}
