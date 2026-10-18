import {siteURL} from './site-paths.js';
// Original published games; Loofa uses its original build with a local language-aware player.
export const games = {
  ambulance: {
    title: 'Ambulance Rush',
    source: 'https://unisanewsgames.itch.io/ambulance-rush',
    embed: siteURL('/assets/ambulance-game/index.html'),
    intro: '',
    steps: [],
    label: 'Play Ambulance Rush',
  },
  loofasoup: {
    title: 'Taste of Connection · Loofa Soup',
    source: 'https://lufasoup.ruiyuanbai.com/',
    embed: siteURL('/assets/loofa-game/index.html'),
    intro: 'Join Lufa at his next business dinner.',
    steps: [],
    label: 'Play Taste of Connection',
  },
  hersound: {
    title: 'Her Sound, Re-sound',
    source: 'https://she.ruiyuanbai.com/',
    native: true,
    intro: 'Reconstruct Wan’er and Taiping’s stories through words, fragments, and erasure.',
    steps: ['Choose the guided story or try the disappearance interaction.', 'Follow the English instructions to explore the original puzzles.', 'Scroll through the disappearance scene to watch the original artwork disperse into particles.'],
    label: 'Play in English',
  },
  ourworld: {
    title: 'Our World',
    source: 'https://www.ruiyuanbai.com/art/Earth-is-not-humanitys-alone/demo',
    native: true,
    intro: 'Enter an interactive memorial to the animals who share our world.',
    steps: ['Explore the animals and choose a story to read.', 'Follow the experience’s prompts to discover each life and its context.', 'Open full screen to give the memorial room to unfold.'],
    label: 'Explore Our World',
  },
};

const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function gameCover(id,game){
  const button=`<button class="play-start" type="button" aria-label="${escape(game.label)}" aria-controls="play-stage-${id}" aria-expanded="false">Play game <span aria-hidden="true">→</span></button>`;
  if(id==='ambulance')return `<div class="play-cover play-cover-poster"><img class="play-cover-art" src="${siteURL('/website-assets/ambulance-display.svg')}" alt="The original low-poly Adelaide game scene" width="360" height="190" loading="lazy" decoding="async"><div class="play-launch-actions"><h3>Ambulance<br> Rush</h3>${button}</div></div>`;
  if(id==='loofasoup')return `<div class="play-cover play-cover-poster"><img class="play-cover-art" src="${siteURL('/assets/games-motion/loofa-ensemble-cutout.png')}" alt="Lufa and the Taste of Connection cast" width="1672" height="941" loading="lazy" decoding="async"><div class="play-launch-actions"><h3 class="play-title-art"><img src="${siteURL('/assets/game-launchers/taste-of-connection-title.png')}" alt="Taste of Connection" width="3222" height="1164" loading="lazy" decoding="async"></h3>${button}</div></div>`;
  return `<div class="play-cover"><h3>${escape(game.title)}</h3>${button}</div>`;
}

export function gameSection(id) {
  const game = games[id];
  if (!game || game.native) return '';
  return `<section id="play" class="play-section" aria-labelledby="play-title" data-game="${id}">
    <div class="play-heading"><div><p class="eyebrow">Interactive experience</p><h2 id="play-title">${id === 'hersound' ? 'Play the story. Uncover her voice.' : 'Step inside the project'}</h2>${game.intro?`<p>${escape(game.intro)}</p>`:''}</div>${id==='ambulance'?'':`<a href="${game.source}" target="_blank" rel="noopener noreferrer" class="text-link">Open original ↗</a>`}</div>
    ${game.steps.length?`<ol class="play-guide">${game.steps.map(step=>`<li>${escape(step)}</li>`).join('')}</ol>`:''}
    <div class="play-stage" id="play-stage-${id}">
      ${gameCover(id,game)}
    </div>
    <div class="play-toolbar"><p class="play-status" role="status">${id === 'hersound' ? 'English edition · Original game and particle interaction' : 'Play here, or use full screen after the game opens.'}</p><div><button class="play-fullscreen" type="button" hidden>Full screen ↗</button><button class="play-close" type="button" hidden>Close game ×</button></div></div>
  </section>`;
}

export function setupGames(root=document) {
  const cleanups=[];
  root.querySelectorAll('[data-game]').forEach(section => {
    const game = games[section.dataset.game];
    if (!game) return;
    const stage = section.querySelector('.play-stage');
    const cover = section.querySelector('.play-cover');
    const status = section.querySelector('.play-status');
    const start = section.querySelector('.play-start');
    const full = section.querySelector('.play-fullscreen');
    const close = section.querySelector('.play-close');
    const initialStatus = status.textContent;
    let frame, loadTimer;
    const events=new AbortController(),options={signal:events.signal};
    start.addEventListener('click', () => {
      if (frame) return;
      section.classList.add('is-game-open');
      start.setAttribute('aria-expanded','true');
      cover.hidden = true;
      status.textContent = 'Opening the game…';
      frame = document.createElement('iframe');
      frame.title = `${game.title} — interactive game`;
      frame.allow = 'autoplay; fullscreen; gamepad; clipboard-write';
      frame.allowFullscreen = true;
      frame.src = game.embed;
      frame.addEventListener('load', () => {
        clearTimeout(loadTimer);
        status.textContent = 'Game window opened. Click inside to begin.';
      });
      stage.append(frame);
      requestAnimationFrame(()=>{
        if(!frame)return;
        const bounds=stage.getBoundingClientRect();
        if(bounds.top<80||bounds.bottom>innerHeight-70)stage.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      });
      full.hidden = close.hidden = false;
      loadTimer = setTimeout(() => { status.textContent = section.dataset.game==='ambulance'?'Still loading? Try the browser-build link at the top of this page.':'Still loading? You can also use “Open original” above.'; }, 20000);
    },options);
    full.addEventListener('click', async () => {
      try { await stage.requestFullscreen(); }
      catch { status.textContent = section.dataset.game==='ambulance'?'Use the browser-build link at the top for a larger game window.':'Use “Open original” for a larger game window.'; }
    },options);
    close.addEventListener('click', async () => {
      clearTimeout(loadTimer);
      if (document.fullscreenElement) await document.exitFullscreen().catch(()=>{});
      frame?.remove(); frame = null;
      full.hidden = close.hidden = true;
      cover.hidden = false;
      section.classList.remove('is-game-open');
      start.setAttribute('aria-expanded','false');
      status.textContent = initialStatus;
      start.focus({preventScroll:true});
      const bounds=stage.getBoundingClientRect();
      if(bounds.top<80||bounds.bottom>innerHeight-40)stage.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    },options);
    cleanups.push(()=>{events.abort();clearTimeout(loadTimer);frame?.remove();});
  });
  return()=>cleanups.forEach(dispose=>dispose());
}
