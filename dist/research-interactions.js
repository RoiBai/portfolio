import { siteURL } from './site-paths.js';
// A local, authored example of context settings—not a connection to the research prototype.
let instance = 0;
export function renderPersonaIntent() {
 const id=`persona-intent-${++instance}`;
 return `<figure class="project-figure persona-intent-demo persona-flow" data-persona-demo aria-labelledby="${id}-title">
 <div class="persona-before"><span class="persona-step">01 / The situation</span><h3>You’re taking a day off</h3><p>You’re a PhD student. Your supervisor knows you well. You need a short, polite note—not a formal explanation.</p><div class="persona-bad-draft"><span class="persona-bad-label"><b aria-hidden="true">×</b> A generic draft</span><p>“I am writing to formally request your kind permission to be absent from the laboratory today…”</p><p>“I sincerely apologize for any inconvenience this may cause and would like to provide further context…”</p><strong>Still too long. Still unlike you.</strong></div><p class="persona-before-note">Rewriting the whole email misses the real issue: the AI needs your relationship and writing preferences.</p></div>
 <div class="persona-after"><span class="persona-step">02 / Try the settings</span><h3 id="${id}-title">Make it sound like you</h3><div class="persona-settings"><label for="${id}-relationship">Relationship<select id="${id}-relationship" data-persona-relationship><option value="familiar">Familiar supervisor</option><option value="new">New supervisor</option></select></label><label for="${id}-length">Length<select id="${id}-length" data-persona-length><option value="brief">Keep it brief</option><option value="detail">Add a little context</option></select></label><label class="persona-appreciation"><input type="checkbox" data-persona-appreciation checked><span>Show appreciation</span></label></div><div class="persona-draft" aria-live="polite" aria-atomic="true"><div class="persona-draft-heading"><span>Example email</span><span data-persona-task-label>Today · Lab leave</span></div><h4 data-persona-subject>Away from the lab today</h4><p data-persona-greeting>Hi Professor,</p><p data-persona-message>I’m taking a day off and won’t be in the lab today. Thank you for understanding.</p><p data-persona-signoff>Best,<br>[Your name]</p></div><div class="persona-reuse"><span class="persona-step">03 / Keep the style</span><p data-persona-reuse-caption>Next time, you need to miss a morning meeting. Keep these settings and change only the request.</p><button type="button" data-persona-reuse>Use this style for the next email <span aria-hidden="true">→</span></button></div></div>
 <details class="persona-original"><summary>See the original section editor</summary><div><img src="${siteURL('/assets/research-editorial/persona-intent-editor.png')}" width="1052" height="892" alt="The original PersonaMail interface for changing the intent of one email section" loading="lazy"><p>The prototype exposes the intent behind each communication unit, so a writer can change one section without regenerating the entire email.</p></div></details><figcaption class="persona-demo-note">Interactive example based on the author’s scenario. The original prototype also saves context anchors and learns from editing feedback.</figcaption></figure>`;
}
export function setupPersonaIntent(root=document){
 const demos=[...root.querySelectorAll('[data-persona-demo]')];
 function update(el){
  const familiar=el.querySelector('[data-persona-relationship]').value==='familiar';
  const brief=el.querySelector('[data-persona-length]').value==='brief';
  const appreciative=el.querySelector('[data-persona-appreciation]').checked;
  const meeting=el.dataset.personaTask==='meeting';
  const subject=meeting?'Tomorrow’s morning meeting':'Away from the lab today';
  let message=meeting?'I’ll miss tomorrow’s morning meeting.':'I’m taking a day off and won’t be in the lab today.';
  if(!brief)message+=meeting?' I wanted to let you know in advance so you can plan the meeting.':' I wanted to let you know so you’re aware of my schedule.';
  if(appreciative)message+=' Thank you for understanding.';
  el.querySelector('[data-persona-subject]').textContent=subject;
  el.querySelector('[data-persona-greeting]').textContent=familiar?'Hi Professor,':'Dear Professor,';
  el.querySelector('[data-persona-message]').textContent=message;
  el.querySelector('[data-persona-signoff]').textContent=(familiar?'Best,':'Kind regards,')+'\n[Your name]';
  el.querySelector('[data-persona-task-label]').textContent=meeting?'Next time · Morning meeting':'Today · Lab leave';
  el.querySelector('[data-persona-reuse-caption]').textContent=meeting?'The message changed. Your relationship, length and appreciation settings stayed the same.':'Next time, you need to miss a morning meeting. Keep these settings and change only the request.';
  el.querySelector('[data-persona-reuse]').innerHTML=meeting?'Back to the leave request <span aria-hidden="true">↶</span>':'Use this style for the next email <span aria-hidden="true">→</span>';
  el.querySelector('.persona-draft').classList.remove('is-updated');
  void el.offsetWidth;el.querySelector('.persona-draft').classList.add('is-updated');
 }
 function change(e){const el=e.target.closest('[data-persona-demo]');if(el&&e.target.matches('select,input'))update(el);}
 function click(e){const button=e.target.closest('[data-persona-reuse]');if(!button)return;const el=button.closest('[data-persona-demo]');el.dataset.personaTask=el.dataset.personaTask==='meeting'?'leave':'meeting';update(el);}
 root.addEventListener('change',change);root.addEventListener('click',click);demos.forEach(update);
 return()=>{root.removeEventListener('change',change);root.removeEventListener('click',click);};
}
