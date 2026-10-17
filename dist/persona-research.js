import { siteURL } from './site-paths.js';

// Read-only HTML views transcribe the original prototype's labels and published
// selections (paper Figure 1). Anchor illustrations are unchanged native crops.
// No email output is generated here; the authored interactive demo follows below.
const nativeChoice=(text,selected=false)=>`<span class="persona-original-choice${selected?' is-selected':''}"><i aria-hidden="true">${selected?'●':'○'}</i>${text}</span>`;
function originalPrompt(){return `<div class="persona-original-ui persona-original-prompt"><h4>What can I help with?</h4><p>Help me write an email rejecting a dinner invitation that I initially accepted from a senior faculty member</p></div>`;}
function originalContext(){return `<div class="persona-original-ui persona-original-context"><h4>Relationship between sender and receiver</h4><div class="persona-original-field"><strong>Affiliation (Warmth / Friendliness)</strong><div>${['Hostile','Neutral','Friendly / Warm'].map((s,i)=>nativeChoice(s,i===2)).join('')}</div></div><div class="persona-original-field"><strong>Familiarity</strong><div>${['Strangers','Known but Unfamiliar','Superficially Familiar','Familiar','Close / Intimate'].map((s,i)=>nativeChoice(s,i===3)).join('')}</div></div><p class="persona-original-free-text">Since we are familiar, it should not be a cold professional email. However, since the recipient is more senior and the fault lies more with me, it should be respectful, sincere and apologetic.</p><div class="persona-original-field"><strong>Power, resource, status, hierarchy difference</strong><div>${nativeChoice('Receiver is higher',true)}</div></div></div>`;}
function originalUnits(){return `<div class="persona-original-ui persona-original-units"><h4>Email components</h4>${['Opening Salutation','Statement of Purpose','Justification','Call to Action — Reschedule','Closing Pleasantry'].map((text,i)=>`<div class="persona-original-unit${i===2?' is-selected':''}">${text}</div>`).join('')}</div>`;}
function originalIntent(){return `<div class="persona-original-ui persona-original-intent"><h4>Explanation Specificity</h4><div>${["Vague ‘family matter’",'Briefly hint at reason','No explanation given','Offer full disclosure'].map((s,i)=>nativeChoice(s,i===0)).join('')}</div><p class="persona-original-selection">A family matter has arisen unexpectedly that requires my immediate attention.</p></div>`;}
function originalQuickFix(){return `<div class="persona-original-ui persona-original-quickfix"><h4>Stylebook Recommendations</h4><article><strong>Soften Formality / Conversational Tone</strong><p>Something has come up with my family that I need to attend to immediately.</p></article><article><strong>Increase Professional Privacy</strong><p>Something unavoidable has come up that requires my immediate attention.</p></article></div>`;}
const originalAnchors=[
 {type:'Persona Anchor',title:'Academic Supervisor',description:'A supervisor who oversees research and academic progress.',x:39},
 {type:'Persona Anchor',title:'Senior Professional Acquaintance',description:'An established professional whose goodwill and future opportunities matter.',x:276},
 {type:'Situation Anchor',title:'Requesting Academic Extension Due to Illness',description:'A student requests an extension while explaining a recent health challenge.',x:521},
 {type:'Situation Anchor',title:'Unexpected Last-Minute Cancellation',description:'Decline a previously accepted event while preserving the relationship.',x:749}
];
function originalAnchor(index){const a=originalAnchors[index];return `<article class="persona-original-anchor"><span>${a.type}</span><div class="persona-original-anchor-art" style="--source-left:${-a.x/203*100}%"><img src="${siteURL('/assets/persona-research-original/reuse-native.png')}" width="1051" height="287" alt="Original ${a.title} illustration" loading="lazy"></div><h4>${a.title}</h4><p>${a.description}</p></article>`;}
function originalSaved(indices=[1,3]){return `<div class="persona-original-anchor-grid">${indices.map(originalAnchor).join('')}</div>`;}
function heading(letter, title) {
 return `<h3><span class="persona-research-letter" aria-hidden="true">${letter}</span>${title}</h3>`;
}
export function renderPersonaResearch() {
 return `<div class="persona-research-tour" data-persona-research>
 <article class="persona-research-step persona-research-purpose" aria-label="A: Start with the purpose">
 ${heading('A','Start with the purpose')}
 <p>Describe the task in a sentence. In the original example, the writer needs to <strong>decline a dinner invitation they had already accepted</strong> from a senior faculty member.</p>
 ${originalPrompt()}
 </article>
 <article class="persona-research-step persona-research-context" aria-label="B: Make the relationship explicit">
 ${heading('B','Make the relationship explicit')}
 <div class="persona-research-pair">
 ${originalContext()}
 <div class="persona-research-annotations"><p><strong>Choose the factors.</strong> Relationship, familiarity and power are separate. A recipient can know you well and still be more senior.</p><p><strong>Add the nuance.</strong> The writer adds that the email should be warm, but also respectful and apologetic. Free text covers what a preset cannot.</p></div>
 </div></article>
 <article class="persona-research-step persona-research-editor" aria-label="C: Change one intention at a time">
 ${heading('C','Change one intention at a time')}
 <div class="persona-research-editor-details">
 <div class="persona-research-note"><p><strong>C1 · Choose a communication unit.</strong> Opening, purpose, justification and closing are editable parts of the email.</p>${originalUnits()}</div>
 <div class="persona-research-note"><p><strong>C2 · Change its intent.</strong> If the justification feels too defensive, select a more private explanation. Only that part is rewritten; the rest stays intact.</p>${originalIntent()}</div>
 <div class="persona-research-note"><p><strong>C3 · Reuse editing preferences.</strong> The Adaptive Stylebook learns from edits and optional explanations of why they were made. QuickFix offers suggestions for the writer to choose.</p>${originalQuickFix()}</div>
 </div></article>
 <article class="persona-research-step persona-research-save" aria-label="D: Save the context that worked">
 ${heading('D','Save the context that worked')}
 <div class="persona-research-pair">
 ${originalSaved()}
 <div class="persona-research-annotations"><p><strong>Persona Anchors</strong> keep strategies for particular kinds of people. <strong>Situation Anchors</strong> keep strategies for recurring requests.</p><p>The writer chooses what to save—for example, declining a previously accepted event while preserving the relationship.</p></div>
 </div></article>
 <article class="persona-research-step persona-research-reuse" aria-label="E: Carry the strategy into the next email">
 ${heading('E','Carry the strategy into the next email')}
 <p>Apply a saved anchor to a similar request instead of explaining the context again. <strong>Anchors retain social context; the stylebook retains editing preferences.</strong> The writer decides what to reuse and what to change.</p>
 ${originalSaved([0,1,2,3])}
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
