// Exact option labels from original PersonaMail intent panel, Figma 1835:637.
// This local control demonstrates the selection UI; it does not call an AI model.
let instance = 0;
const choices = ["Vague, ‘family matter’", 'Briefly hint at reason', 'No explanation given', 'Offer full disclosure'];
export function renderPersonaIntent() {
  const id = `persona-intent-${++instance}`;
  return `<figure class="project-figure persona-intent-demo" aria-labelledby="${id}-title">
    <fieldset class="persona-intent-panel"><legend id="${id}-title">Explanation Specificity</legend>${choices.map((label,i)=>`<label><input type="radio" name="${id}" value="${i}" ${i===0?'checked':''}><span>${label}</span></label>`).join('')}</fieldset>
    <figcaption><strong>Change one section’s intent</strong><p>Select how much to explain. In PersonaMail, this control revises the selected justification while preserving the rest of the email.</p><small>Interactive interface excerpt · selection only</small></figcaption>
  </figure>`;
}
export function setupPersonaIntent() {
  // Native radio controls support pointer, touch and arrow-key selection without listeners.
  return () => {};
}
