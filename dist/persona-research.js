import { siteURL } from './site-paths.js';

// The A–E order follows the original PersonaMail paper, Figure 1 (printed p. 162).
// These are native, unresampled interface crops, not reconstructed UI or Figma pages.
function picture(src, width, height, alt, extra='') {
 return `<figure class="persona-research-image ${extra}"><img src="${siteURL(src)}" width="${width}" height="${height}" alt="${alt}" loading="lazy" decoding="async"></figure>`;
}
function editorDetail(x,y,w,h,alt) {
 const style=`--detail-ratio:${w}/${h};--detail-width:${988/w*100}%;--detail-left:${-x/w*100}%;--detail-top:${-y/h*100}%;--detail-max:${w}px`;
 return `<div class="persona-editor-detail" style="${style}"><img src="${siteURL('/assets/persona-research-original/editor-native.png')}" width="988" height="808" alt="${alt}" loading="lazy" decoding="async"></div>`;
}
function heading(letter, title) {
 return `<h3><span class="persona-research-letter" aria-hidden="true">${letter}</span>${title}</h3>`;
}
export function renderPersonaResearch() {
 return `<div class="persona-research-tour" data-persona-research>
 <article class="persona-research-step persona-research-purpose" aria-label="A: Start with the purpose">
 ${heading('A','Start with the purpose')}
 <p>Describe the task in a sentence. In the original example, the writer needs to <strong>decline a dinner invitation they had already accepted</strong> from a senior faculty member.</p>
 ${picture('/assets/persona-research-original/purpose-native.png',843,174,'Original PersonaMail task input: declining a previously accepted dinner invitation')}
 </article>
 <article class="persona-research-step persona-research-context" aria-label="B: Make the relationship explicit">
 ${heading('B','Make the relationship explicit')}
 <div class="persona-research-pair">
 ${picture('/assets/persona-research-original/context-native.png',471,384,'Original Factor Exploration Panel showing warmth, familiarity, free-text context and power or status')}
 <div class="persona-research-annotations"><p><strong>Choose the factors.</strong> Relationship, familiarity and power are separate. A recipient can know you well and still be more senior.</p><p><strong>Add the nuance.</strong> The writer adds that the email should be warm, but also respectful and apologetic. Free text covers what a preset cannot.</p></div>
 </div></article>
 <article class="persona-research-step persona-research-editor" aria-label="C: Change one intention at a time">
 ${heading('C','Change one intention at a time')}
 <div class="persona-research-pair">
 ${picture('/assets/persona-research-original/editor-native.png',988,808,'Original PersonaMail editor with communication units, explanation-specificity controls and Stylebook QuickFix suggestions')}
 <div class="persona-research-annotations"><div class="persona-research-note"><p><strong>C1 · Choose a communication unit.</strong> Opening, purpose, justification and closing are editable parts of the email.</p>${editorDetail(744,26,225,258,'Original list of email communication units, with Justification selected')}</div><div class="persona-research-note"><p><strong>C2 · Change its intent.</strong> If the justification feels too defensive, select a more private explanation. Only that part is rewritten; the rest stays intact.</p>${editorDetail(15,559,294,246,'Original explanation-specificity control, with a vague family matter selected')}</div><div class="persona-research-note"><p><strong>C3 · Reuse editing preferences.</strong> The Adaptive Stylebook learns from edits and optional explanations of why they were made. QuickFix offers suggestions for the writer to choose.</p>${editorDetail(160,244,462,190,'Original Stylebook recommendations for a conversational tone or greater professional privacy')}</div></div>
 </div></article>
 <article class="persona-research-step persona-research-save" aria-label="D: Save the context that worked">
 ${heading('D','Save the context that worked')}
 <div class="persona-research-pair">
 ${picture('/assets/persona-research-original/save-native.png',474,205,'Original Persona Anchor and Situation Anchor save cards')}
 <div class="persona-research-annotations"><p><strong>Persona Anchors</strong> keep strategies for particular kinds of people. <strong>Situation Anchors</strong> keep strategies for recurring requests.</p><p>The writer chooses what to save—for example, declining a previously accepted event while preserving the relationship.</p></div>
 </div></article>
 <article class="persona-research-step persona-research-reuse" aria-label="E: Carry the strategy into the next email">
 ${heading('E','Carry the strategy into the next email')}
 <p>Apply a saved anchor to a similar request instead of explaining the context again. <strong>Anchors retain social context; the stylebook retains editing preferences.</strong> The writer decides what to reuse and what to change.</p>
 ${picture('/assets/persona-research-original/reuse-native.png',1051,287,'Original saved-anchor library, including academic supervisor and unexpected cancellation examples','persona-research-reuse-image')}
 </article>
 <p class="persona-research-boundary"><strong>What the evidence shows:</strong> a working prototype and formative findings. This demonstration paper does not establish comparative effectiveness.</p>
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
