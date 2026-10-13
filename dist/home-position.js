// Keep the index's reading position separate from a case study's fresh start.
const HOME_KEY = 'portfolio:home-position:v1';
const RETURN_KEY = 'portfolio:return-home:v1';
const PROJECT_PREFIX = 'portfolio:project-origin:v1:';
const read = (storage, key) => {
  try { return JSON.parse(storage.getItem(key) || 'null'); } catch { return null; }
};
const write = (storage, key, value) => {
  try { storage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be disabled. */ }
};
const valid = value => value && Number.isFinite(value.y) && value.y >= 0;

export function projectHomeOrigin() {
  const key = location.pathname.replace(/\/$/, '');
  return read(sessionStorage, HOME_KEY) || read(localStorage, PROJECT_PREFIX + key);
}

export function prepareHomeReturn(origin) {
  if (valid(origin)) write(sessionStorage, RETURN_KEY, origin);
}

export function setupHomePosition() {
  history.scrollRestoration = 'manual';
  let restoring = true, scrollFrame = 0;
  const snapshot = () => {
    const rows = [...document.querySelectorAll('.project-row,.group-row')];
    const row = rows.find(el => el.offsetTop <= scrollY + 80 && el.offsetTop + el.offsetHeight > scrollY + 80);
    return {y: scrollY, row: row?.id || row?.getAttribute('href') || '', offset: row ? scrollY - row.offsetTop : 0};
  };
  const save = () => { if (!restoring) write(sessionStorage, HOME_KEY, snapshot()); };
  const restore = async event => {
    restoring = true;
    const requested = read(sessionStorage, RETURN_KEY);
    try { sessionStorage.removeItem(RETURN_KEY); } catch {}
    const navigation = performance.getEntriesByType('navigation')[0]?.type;
    const saved = requested || ((event?.persisted || navigation === 'back_forward' || navigation === 'reload') ? read(sessionStorage, HOME_KEY) : null);
    await document.fonts.ready;
    requestAnimationFrame(() => {
      if (valid(saved) && !location.hash) {
        const row = [...document.querySelectorAll('.project-row,.group-row')].find(el => (el.id || el.getAttribute('href')) === saved.row);
        const top = row ? row.offsetTop + saved.offset : saved.y;
        window.scrollTo({top: Math.max(0, top), left: 0, behavior: 'instant'});
      }
      restoring = false;
      save();
      document.dispatchEvent(new CustomEvent('portfolio:home-restored',{detail:{historyReturn:!!event?.persisted||navigation==='back_forward'}}));
    });
  };
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(save);
  }, {passive: true});
  window.addEventListener('pagehide', save);
  window.addEventListener('pageshow', restore);
  // This also works for Ctrl/Cmd-click and separate tabs opened with noopener.
  const rememberDeparture = event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || destination.pathname === '/') return;
    const position = snapshot();
    write(sessionStorage, HOME_KEY, position);
    write(localStorage, PROJECT_PREFIX + destination.pathname.replace(/\/$/, ''), position);
  };
  document.addEventListener('click', rememberDeparture, true);
  document.addEventListener('auxclick', rememberDeparture, true);
}
