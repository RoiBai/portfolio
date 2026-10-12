import { setupHomePosition } from './home-position.js';
import { setupHeroIntro } from './hero-intro.js';
const groups = [...document.querySelectorAll('.group-row')];
document.documentElement.classList.toggle('has-touch', navigator.maxTouchPoints > 0);
function setProject(group, choice) {
  const title = group.querySelector('h2');
  const open = group.querySelector('.group-open');
  const next = choice?.dataset.project || '';
  const description = group.querySelector('.group-description');
  const keywords = group.querySelector('.group-keywords');
  const category = group.querySelector('.category-tag');
  if ((group.dataset.active || '') === next) return;
  group.querySelectorAll('.project-choice').forEach(item => item.classList.toggle('is-active', item === choice));
  if (choice) {
    group.dataset.active = next;
    const [a, b] = choice.dataset.colors.split(',');
    group.style.setProperty('--active-a', a);
    group.style.setProperty('--active-b', b);
    title.textContent = choice.dataset.title;
    description.textContent = choice.dataset.description || '';
    category.hidden = false;
    keywords.replaceChildren(...(choice.dataset.keywords || '').split('|').filter(Boolean).map(text => {const pill=document.createElement('span');pill.textContent=text;return pill;}));
    open.href = choice.href;
    open.tabIndex = 0;
    open.removeAttribute('aria-hidden');
    open.setAttribute('aria-label', `Open ${choice.dataset.title}`);
  } else {
    delete group.dataset.active;
    title.textContent = title.dataset.defaultTitle;
    description.textContent = description.dataset.defaultDescription;
    category.hidden = true;
    keywords.replaceChildren();
    open.removeAttribute('href');
    open.tabIndex = -1;
    open.setAttribute('aria-hidden', 'true');
  }
  title.classList.remove('title-in');
  void title.offsetWidth;
  title.classList.add('title-in');
}
groups.forEach(group => {
  const choices = [...group.querySelectorAll('.project-choice')];
  choices.forEach(choice => {
    choice.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') setProject(group, choice); });
    choice.addEventListener('focus', () => {
      group.classList.toggle('keyboard-active', choice.matches(':focus-visible'));
      setProject(group, choice);
    });
    choice.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') setProject(group, choice); });
  });
  // A choice stays selected on the way to its Open link; leaving the complete
  // band restores the overview. Keyboard focus follows the same state model.
  group.addEventListener('pointerleave', () => {
    if (!group.querySelector(':focus-visible')) { group.classList.remove('keyboard-active'); setProject(group, null); }
  });
  group.addEventListener('focusout', event => {
    if (!group.contains(event.relatedTarget)) {
      group.classList.remove('keyboard-active');
      if (!group.matches(':hover')) setProject(group, null);
    }
  });
  group.addEventListener('keydown', event => { if (event.key === 'Escape') { document.activeElement?.blur(); setProject(group, null); } });
});
setupHeroIntro();
setupHomePosition();
window.addEventListener('pageshow', () => { groups.forEach(group => setProject(group, null)); });
