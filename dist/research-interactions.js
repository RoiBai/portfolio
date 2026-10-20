import { setupPersonaResearch } from './persona-research.js';
// Authored local examples; this demo does not call the research prototype or an AI API.
let instance = 0;
export function renderPersonaIntent() {
 const id=`persona-intent-${++instance}`;
 return `<figure class="project-figure persona-intent-demo persona-flow persona-refined persona-direct-demo" data-persona-demo aria-labelledby="${id}-title">
 <div class="persona-controls"><h3 id="${id}-title">Adjust the context</h3><div class="persona-relationship-context"><span>You<br><strong>PhD student</strong></span><i aria-hidden="true">→</i><span>To<br><strong>Familiar supervisor</strong></span></div><div class="persona-settings"><label for="${id}-relationship">Relationship<select id="${id}-relationship" data-persona-relationship><option value="familiar">Familiar supervisor</option><option value="new">New supervisor</option></select></label><label for="${id}-tone">Tone<select id="${id}-tone" data-persona-tone><option value="polite">Polite & direct</option><option value="formal">Formal</option></select></label><label for="${id}-length">Length<select id="${id}-length" data-persona-length><option value="brief">Keep it brief</option><option value="detail">Add context</option></select></label><label class="persona-appreciation"><input type="checkbox" data-persona-appreciation checked><span>Show appreciation</span></label></div>
</div>
 <div class="persona-after"><div class="persona-style-memory" data-persona-memory hidden role="status"><strong data-persona-memory-label>Style saved · settings unchanged</strong><div class="persona-memory-chips" data-persona-memory-chips></div></div><div class="persona-draft" aria-live="polite" aria-atomic="true"><div class="persona-draft-heading"><span><b aria-hidden="true">✓</b> Your example</span><span data-persona-task-label>Today · Leave request</span></div><div class="persona-email-subject"><span>Subject</span><h4 data-persona-subject></h4></div><p data-persona-greeting></p><p data-persona-message></p><p data-persona-signoff></p></div></div>
 <div class="persona-actions"> <div class="persona-local-edit"><span class="persona-step">Edit one part</span><p>The request and greeting stay unchanged.</p><button type="button" data-persona-edit aria-pressed="false">Shorten only the explanation</button><p data-persona-edit-status role="status" hidden></p></div>
 <div class="persona-reuse"><span class="persona-step">Save & reuse</span><p data-persona-reuse-caption>Try the saved context on a <strong>morning-meeting request</strong>.</p><button type="button" data-persona-reuse>Save style & write the next email <span aria-hidden="true">→</span></button></div></div>
 </figure>`;
}
// Each task has all eight authored combinations. Relationship changes the request's
// social assumptions and handover, not only its greeting; no private reason is invented.
const personaDrafts = {
 leave: {
  'familiar|polite|brief': {
   request: 'Could I take today off? I won’t be in the lab.',
   context: 'I’ll send you a short progress update, so we can pick up from the same point when I’m back.',
   thanks: 'Thanks for understanding.'
  },
  'familiar|polite|detail': {
   request: 'Could I take today off? I won’t be in the lab.',
   context: 'I wanted to let you know before the day gets going. I’ll send you a short note on what I’ve finished and what I’m working on next, so you have the context without needing a meeting. If there’s anything you need from me before I’m away, please let me know.',
   thanks: 'Thanks for understanding and for your support.'
  },
  'familiar|formal|brief': {
   request: 'I would like to take leave from the laboratory today.',
   context: 'I will send a brief progress update so that our next discussion can continue from the current work. Please let me know if you need any additional information.',
   thanks: 'Thank you for your understanding.'
  },
  'familiar|formal|detail': {
   request: 'I would like to take leave from the laboratory today.',
   context: 'To keep you informed, I will send a concise summary of my current progress and next steps. This should allow us to resume our discussion when I return without repeating the background. Please let me know whether there is anything you would like me to hand over before my absence.',
   thanks: 'Thank you for your understanding and continued guidance.'
  },
  'new|polite|brief': {
   request: 'Could I take today off from the lab?',
   context: 'I’m still getting familiar with how you prefer to handle absences. Please let me know if I should record the leave or send anyone else an update.',
   thanks: 'Thank you for considering my request.'
  },
  'new|polite|detail': {
   request: 'Could I take today off from the lab?',
   context: 'As I’m new to the group, I don’t want to assume that an email is the only step needed. Please let me know how you prefer leave to be recorded and whether I should notify anyone else. I can also send a short progress update if that would help you plan around my absence.',
   thanks: 'Thank you for considering this and helping me understand the process.'
  },
  'new|formal|brief': {
   request: 'I would like to request one day of leave from the laboratory today.',
   context: 'As I am new to your supervision, please let me know the appropriate approval and notification process. I will follow any arrangements required by the group.',
   thanks: 'Thank you for your consideration.'
  },
  'new|formal|detail': {
   request: 'I would like to request one day of leave from the laboratory today.',
   context: 'As I have recently joined the group, I would appreciate clarification of your expectations for reporting an absence. Please let me know whether a formal leave record or notification to another team member is required. I can provide a brief update on my work to support any scheduling decisions.',
   thanks: 'Thank you for considering my request and advising me on the appropriate arrangements.'
  }
 },
 meeting: {
  'familiar|polite|brief': {
   request: 'I’m sorry, I won’t be able to join tomorrow’s morning meeting.',
   context: 'I’ll send my update beforehand and catch up on the notes afterward. Please flag anything you’d like me to follow up on.',
   thanks: 'Thanks for understanding.'
  },
  'familiar|polite|detail': {
   request: 'I’m sorry, I won’t be able to join tomorrow’s morning meeting.',
   context: 'I’ll send you a short update beforehand, including my progress and the questions I’d hoped to discuss. Afterward, I’ll catch up on the notes and any decisions that affect my work. If one of my questions needs a conversation, we can find another time rather than hold up the group.',
   thanks: 'Thanks for understanding and keeping me in the loop.'
  },
  'familiar|formal|brief': {
   request: 'I will be unable to attend tomorrow’s morning meeting.',
   context: 'I will circulate my progress update in advance and review the meeting notes afterward. Please let me know if there are any particular actions I should follow up on.',
   thanks: 'Thank you for your understanding.'
  },
  'familiar|formal|detail': {
   request: 'I will be unable to attend tomorrow’s morning meeting.',
   context: 'I will send a concise progress update and any questions in advance, so that my absence does not interrupt the discussion. After the meeting, I will review the notes and follow up on decisions relevant to my work. If further discussion is needed, I would be happy to arrange a separate time.',
   thanks: 'Thank you for your understanding and continued guidance.'
  },
  'new|polite|brief': {
   request: 'I’m sorry, I won’t be able to attend tomorrow’s morning meeting.',
   context: 'As I’m still learning the group’s routine, would you prefer a written update beforehand or a separate check-in? Please also let me know how best to catch up.',
   thanks: 'Thank you for your guidance.'
  },
  'new|polite|detail': {
   request: 'I’m sorry, I won’t be able to attend tomorrow’s morning meeting.',
   context: 'I’m still getting familiar with how the group shares updates, so I wanted to check what would work best. I can send my progress and questions in advance, or arrange a brief check-in if you prefer. Please let me know where I should find the meeting notes and whether anyone else needs to know I’ll be absent.',
   thanks: 'Thank you for helping me stay involved while I learn the group’s routine.'
  },
  'new|formal|brief': {
   request: 'I regret that I will be unable to attend tomorrow’s morning meeting.',
   context: 'As I have recently joined the group, please advise whether you would prefer a written update or an alternative check-in, and how I should obtain any decisions or follow-up tasks.',
   thanks: 'Thank you for your guidance and understanding.'
  },
  'new|formal|detail': {
   request: 'I regret that I will be unable to attend tomorrow’s morning meeting.',
   context: 'As I am still becoming familiar with the group’s reporting arrangements, I would appreciate your advice on an appropriate alternative. I can provide a written progress update in advance or arrange a brief check-in. Please let me know how I should access the meeting record and whether I need to notify any other colleagues.',
   thanks: 'Thank you for your consideration and guidance on the group’s expectations.'
  }
 }
};
// A local shortening keeps the relationship assumptions and selected tone.
const personaShortContexts = {
 leave: {
  'familiar|polite': 'I’ll send you a short progress update.',
  'familiar|formal': 'I will send you a brief progress update.',
  'new|polite': 'Please let me know how to record the leave.',
  'new|formal': 'Please advise how I should record this absence.'
 },
 meeting: {
  'familiar|polite': 'I’ll send my update beforehand and read the notes afterward.',
  'familiar|formal': 'I will send my update in advance and review the notes afterward.',
  'new|polite': 'Would you prefer an update or a check-in, and how should I catch up?',
  'new|formal': 'Please advise on an alternative update and how I should catch up.'
 }
};
function settings(el){return {relationship:el.querySelector('[data-persona-relationship]').value,tone:el.querySelector('[data-persona-tone]').value,length:el.querySelector('[data-persona-length]').value,appreciation:el.querySelector('[data-persona-appreciation]').checked};}
export function setupPersonaIntent(root=document){
 const researchCleanup=setupPersonaResearch(root);
 const demos=[...root.querySelectorAll('[data-persona-demo]')];
 function update(el){
  const s=settings(el),familiar=s.relationship==='familiar',brief=s.length==='brief',polite=s.tone==='polite',meeting=el.dataset.personaTask==='meeting';
  const draft=personaDrafts[meeting?'meeting':'leave'][`${s.relationship}|${s.tone}|${s.length}`];
  const message=el.querySelector('[data-persona-message]');message.replaceChildren();
  const requestSpan=document.createElement('span');requestSpan.className='persona-email-request';requestSpan.textContent=draft.request;
  message.append(requestSpan,document.createTextNode(' '));
  const localEdit=el.dataset.personaLocalEdit==='short';
  const explanation=document.createElement(localEdit?'mark':'span');explanation.className='persona-email-explanation';
  explanation.textContent=localEdit?personaShortContexts[meeting?'meeting':'leave'][`${s.relationship}|${s.tone}`]:draft.context;
  message.append(explanation);
  el.querySelector('[data-persona-edit]').textContent=localEdit?'Restore the fuller explanation':'Shorten only the explanation';
  el.querySelector('[data-persona-edit]').setAttribute('aria-pressed',String(localEdit));
  const editStatus=el.querySelector('[data-persona-edit-status]');
  editStatus.hidden=!localEdit;
  const savedShortPreference=el.dataset.personaSaved&&JSON.parse(el.dataset.personaSaved).localEdit==='short';
  editStatus.textContent=localEdit?(meeting?(savedShortPreference?'Your preference for shorter explanations carries over.':'Only the highlighted explanation changed.'):'Ready to reuse your preference for shorter explanations.'):'';
  el.querySelector('.persona-relationship-context>span:last-child strong').textContent=familiar?'Familiar supervisor':'New supervisor';
  if(s.appreciation){const thanks=document.createElement(localEdit?'span':'mark');thanks.textContent=draft.thanks;message.append(document.createTextNode(' '),thanks);}
  el.querySelector('[data-persona-subject]').textContent=meeting?'Tomorrow’s morning meeting':'Away from the lab today';
  el.querySelector('[data-persona-greeting]').textContent=familiar?'Hi Professor,':'Dear Professor,';
  el.querySelector('[data-persona-signoff]').textContent=(familiar&&polite?'Best,':'Kind regards,')+'\n[Your name]';
  el.querySelector('[data-persona-task-label]').textContent=meeting?'Next request · Morning meeting':'Today · Leave request';
  el.querySelector('[data-persona-reuse-caption]').innerHTML=meeting?(localEdit?'The new request keeps your <strong>relationship settings</strong> and your edit preference: <strong>shorter explanations</strong>.':'A new request with the same saved relationship and writing settings.'):'Try the saved context on a <strong>morning-meeting request</strong>.';
  el.querySelector('[data-persona-reuse]').innerHTML=meeting?'Return to the leave request <span aria-hidden="true">↶</span>':'Save style & write the next email <span aria-hidden="true">→</span>';
  const memory=el.querySelector('[data-persona-memory]');memory.hidden=!el.dataset.personaSaved;
  if(el.dataset.personaSaved){const unchanged=el.dataset.personaSaved===JSON.stringify({...s,localEdit:el.dataset.personaLocalEdit||''});el.querySelector('[data-persona-memory-label]').textContent=unchanged?'Style saved · settings unchanged':'Style adjusted · ready for the next request';el.querySelector('[data-persona-reuse-caption]').innerHTML=meeting?(unchanged?(localEdit?'The new request keeps your <strong>relationship settings</strong> and your edit preference: <strong>shorter explanations</strong>.':'A new request with the same saved relationship and writing settings.'):'Your <strong>updated settings</strong> now shape this meeting email.'):'Try the saved context on a <strong>morning-meeting request</strong>.';const chips=el.querySelector('[data-persona-memory-chips]');chips.replaceChildren();for(const label of[familiar?'Familiar supervisor':'New supervisor',polite?'Polite & direct':'Formal',brief?'Brief':'Added context',s.appreciation?'Appreciative':'No appreciation line',...(localEdit?['Learned preference: shorter explanations']:[])]){const chip=document.createElement('span');chip.textContent=label;chips.append(chip);}}
  el.querySelector('.persona-draft').classList.remove('is-updated');void el.offsetWidth;el.querySelector('.persona-draft').classList.add('is-updated');
 }
 function change(e){const el=e.target.closest('[data-persona-demo]');if(el&&e.target.matches('select,input'))update(el);}
 function click(e){const edit=e.target.closest('[data-persona-edit]');if(edit){const el=edit.closest('[data-persona-demo]');el.dataset.personaLocalEdit=el.dataset.personaLocalEdit==='short'?'':'short';update(el);return;}const button=e.target.closest('[data-persona-reuse]');if(!button)return;const el=button.closest('[data-persona-demo]');el.dataset.personaSaved=JSON.stringify({...settings(el),localEdit:el.dataset.personaLocalEdit||''});el.dataset.personaTask=el.dataset.personaTask==='meeting'?'leave':'meeting';update(el);if(matchMedia('(max-width:760px)').matches)el.querySelector('[data-persona-memory]').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 root.addEventListener('change',change);root.addEventListener('click',click);demos.forEach(update);
 return()=>{root.removeEventListener('change',change);root.removeEventListener('click',click);researchCleanup();};
}
