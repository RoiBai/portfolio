import { siteURL } from './site-paths.js';

// Read-only HTML views transcribe the original prototype's labels and published
// selections (paper Figure 1). Anchor illustrations are unchanged native crops.
// No email output is generated here; the authored interactive demo follows below.
const nativeChoice=(text,selected=false)=>`<span class="persona-original-choice${selected?' is-selected':''}"><i aria-hidden="true">${selected?'●':'○'}</i>${text}</span>`;
function originalContext(){return `<div class="persona-original-ui persona-original-context"><h4>Relationship between sender and receiver</h4><div class="persona-original-field"><strong>Affiliation (Warmth / Friendliness)</strong><div>${['Hostile','Neutral','Friendly / Warm'].map((s,i)=>nativeChoice(s,i===2)).join('')}</div></div><div class="persona-original-field"><strong>Familiarity</strong><div>${['Strangers','Known but Unfamiliar','Superficially Familiar','Familiar','Close / Intimate'].map((s,i)=>nativeChoice(s,i===3)).join('')}</div></div><p class="persona-original-free-text">Since we are familiar, it should not be a cold professional email. However, since the recipient is more senior and the fault lies more with me, it should be respectful, sincere and apologetic.</p><div class="persona-original-field"><strong>Power, resource, status, hierarchy difference</strong><div>${nativeChoice('Receiver is higher',true)}</div></div></div>`;}
function originalIntent(){return `<div class="persona-original-ui persona-original-intent"><h4>Explanation Specificity</h4><div>${["Vague ‘family matter’",'Briefly hint at reason','No explanation given','Offer full disclosure'].map((s,i)=>nativeChoice(s,i===0)).join('')}</div><p class="persona-original-selection">A family matter has arisen unexpectedly that requires my immediate attention.</p></div>`;}
const originalAnchors=[
 {type:'Persona Anchor',title:'Senior Professional Acquaintance',description:'An established professional whose goodwill and future opportunities matter.',x:276},
 {type:'Situation Anchor',title:'Unexpected Last-Minute Cancellation',description:'Decline a previously accepted event while preserving the relationship.',x:749}
];
function originalAnchor(index){const a=originalAnchors[index];return `<article class="persona-original-anchor"><span>${a.type}</span><div class="persona-original-anchor-art" style="--source-left:${-a.x/203*100}%"><img src="${siteURL('/assets/persona-research-original/reuse-native.png')}" width="1051" height="287" alt="Original ${a.title} illustration" loading="lazy"></div><h4>${a.title}</h4><p>${a.description}</p></article>`;}
function originalSaved(indices=[0,1]){return `<div class="persona-original-anchor-grid">${indices.map(originalAnchor).join('')}</div>`;}
function heading(letter, title) {
 return `<h3><span class="persona-research-letter" aria-hidden="true">${letter}</span>${title}</h3>`;
}
const researchPair=(visual,letter,title,copy)=>`<div class="persona-research-pair"><div class="persona-research-visual">${visual}</div><div class="persona-research-explanation">${heading(letter,title)}${copy}</div></div>`;
export function renderPersonaResearch() {
 return `<div class="persona-research-tour" data-persona-research>
 <div class="persona-research-case"><span>Original research example</span><p>Decline a dinner invitation already accepted from a senior faculty member.</p></div>
 <article class="persona-research-step persona-research-context" aria-label="1: Make the relationship explicit">
 ${researchPair(originalContext(),'01','Make the relationship explicit','<p><strong>Familiarity, friendliness and power are separate.</strong> A recipient can know you well and still be more senior. Presets capture these factors; free text adds nuance, such as keeping a warm but respectful tone.</p>')}
 </article>
 <article class="persona-research-step persona-research-editor" aria-label="2: Edit one communication unit">
 ${researchPair(`<div class="persona-original-edit-selection"><span>Opening</span><span>Purpose</span><strong>Justification</strong><span>Closing</span></div>${originalIntent()}`,'02','Edit one communication unit','<p>The email is split into <strong>separate communication units</strong>. Select the justification and request a more private explanation: only that part changes, while the request and greeting stay intact.</p>')}
 </article>
 <article class="persona-research-step persona-research-save" aria-label="3: Save context and reuse preferences">
 ${researchPair(`${originalSaved()}<div class="persona-original-stylebook"><span>Adaptive Stylebook</span><p>Editing preference: <strong>keep explanations private</strong>.</p></div>`,'03','Save context; reuse preferences','<p><strong>Persona and Situation Anchors save social context</strong> for a recipient or recurring request. The <strong>Adaptive Stylebook learns editing preferences</strong>, such as a more private explanation.</p><p>On the next email, the writer chooses the anchors and suggested edits to reuse.</p>')}
 </article>
 </div>`;
}

export function setupPersonaResearch(root=document) {
 if(document.body.dataset.project!=='personamail')return()=>{};
 const research=root.querySelector('#research');
 if(!research||research.querySelector('[data-persona-research]'))return()=>{};
 research.querySelector('.section-visuals')?.remove();
 research.insertAdjacentHTML('beforeend',renderPersonaResearch());
 const tour=research.querySelector('[data-persona-research]');
 return()=>tour?.remove();
}
