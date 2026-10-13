// Original published games; Her Sound is a locally translated source build.
export const games = {
  ambulance: {
    title: 'Ambulance Rush',
    source: 'https://unisanewsgames.itch.io/ambulance-rush',
    embed: 'https://itch.io/embed-upload/11753425?color=111111',
    intro: 'Step into the pressures of ambulance ramping in Adelaide.',
    steps: ['Start the game, then follow its on-screen controls.', 'Manage emergency calls and the pressure on hospital capacity.', 'Use a desktop browser and full screen for the clearest view.'],
    label: 'Play Ambulance Rush',
  },
  loofasoup: {
    title: 'Taste of Connection · Loofa Soup',
    source: 'https://lufasoup.ruiyuanbai.com/',
    embed: 'https://lufasoup.ruiyuanbai.com/',
    intro: 'Take a seat at a shared table, where every choice is a social puzzle.',
    steps: ['Start the game and follow the instructions at the table.', 'Explore the relationships behind each dining choice.', 'For this Unity game, a desktop browser is recommended.'],
    label: 'Play Loofa Soup',
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

export function gameSection(id) {
  const game = games[id];
  if (!game || game.native) return '';
  return `<section id="play" class="play-section" aria-labelledby="play-title" data-game="${id}">
    <div class="play-heading"><div><p class="eyebrow">Interactive experience</p><h2 id="play-title">${id === 'hersound' ? 'Play the story. Uncover her voice.' : 'Step inside the project'}</h2><p>${escape(game.intro)}</p></div><a href="${game.source}" target="_blank" rel="noopener noreferrer" class="text-link">Open original ↗</a></div>
    <ol class="play-guide">${game.steps.map(step=>`<li>${escape(step)}</li>`).join('')}</ol>
    <div class="play-stage">
      <div class="play-cover"><span class="play-symbol" aria-hidden="true">▷</span><h3>${escape(game.title)}</h3><button class="play-start" type="button">${escape(game.label)} <span aria-hidden="true">→</span></button></div>
    </div>
    <div class="play-toolbar"><p class="play-status" role="status">${id === 'hersound' ? 'English edition · Original game and particle interaction' : 'Play here, or open the original in a new tab.'}</p><div><button class="play-fullscreen" type="button" hidden>Full screen ↗</button><button class="play-close" type="button" hidden>Close game ×</button></div></div>
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
      full.hidden = close.hidden = false;
      loadTimer = setTimeout(() => { status.textContent = 'Still loading? You can also use “Open original” above.'; }, 20000);
    },options);
    full.addEventListener('click', async () => {
      try { await stage.requestFullscreen(); }
      catch { status.textContent = 'Use “Open original” for a larger game window.'; }
    },options);
    close.addEventListener('click', async () => {
      clearTimeout(loadTimer);
      if (document.fullscreenElement) await document.exitFullscreen().catch(()=>{});
      frame?.remove(); frame = null;
      full.hidden = close.hidden = true;
      cover.hidden = false;
      status.textContent = initialStatus;
      start.focus({preventScroll:true});
    },options);
    cleanups.push(()=>{events.abort();clearTimeout(loadTimer);frame?.remove();});
  });
  return()=>cleanups.forEach(dispose=>dispose());
}
