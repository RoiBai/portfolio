import { siteURL } from './site-paths.js';
// Original image inspection for source-heavy research case studies.
const PROJECTS = new Set(['personamail', 'suzhou-scrollverse', 'versecolor']);
let detailSequence = 0;

export function setupResearchImageDetails(root = document, project = {}) {
  const projectId = typeof project === 'string' ? project : project.id;
  if (!PROJECTS.has(projectId)) return () => {};
  const entries = [];
  const anchors = new Map();
  let dialog, largeImage, viewport, sizeButton, closeButton, status;
  let previousFocus, previousOverflow = '', natural = false, disposed = false;

  function position(entry) {
    if (!entry.image.isConnected) return;
    const imageBox = entry.image.getBoundingClientRect();
    const parentBox = entry.parent.getBoundingClientRect();
    entry.button.hidden = imageBox.width === 0 || imageBox.height === 0;
    if (entry.button.hidden) return;
    const left = imageBox.right - parentBox.left + entry.parent.scrollLeft - entry.parent.clientLeft - entry.button.offsetWidth - 8;
    const top = imageBox.top - parentBox.top + entry.parent.scrollTop - entry.parent.clientTop + 8;
    entry.button.style.left = Math.max(0, left) + 'px';
    entry.button.style.top = Math.max(0, top) + 'px';
  }

  function setSize(useNatural) {
    natural = useNatural;
    dialog.classList.toggle('rid-natural', natural);
    largeImage.style.width = natural && largeImage.naturalWidth ? largeImage.naturalWidth + 'px' : '';
    largeImage.style.height = natural && largeImage.naturalHeight ? largeImage.naturalHeight + 'px' : '';
    sizeButton.textContent = natural ? 'Fit image' : 'Actual size';
    sizeButton.setAttribute('aria-pressed', String(natural));
    viewport.setAttribute('aria-label', natural ? 'Original image at actual size. Scroll or swipe to inspect.' : 'Image fitted to the screen');
    viewport.scrollTo(0, 0);
  }

  function restorePage() {
    document.documentElement.style.overflow = previousOverflow;
    if (!disposed && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  }

  function createDialog() {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.className = 'research-image-detail';
    dialog.setAttribute('aria-labelledby', 'research-image-detail-title-' + (++detailSequence));
    const header = document.createElement('div');
    header.className = 'rid-toolbar';
    const title = document.createElement('h2');
    title.id = dialog.getAttribute('aria-labelledby');
    title.textContent = 'Image detail';
    sizeButton = document.createElement('button');
    sizeButton.type = 'button';
    sizeButton.className = 'rid-size';
    sizeButton.textContent = 'Actual size';
    sizeButton.setAttribute('aria-pressed', 'false');
    closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'rid-close';
    closeButton.textContent = 'Close ×';
    closeButton.autofocus = true;
    header.append(title, sizeButton, closeButton);
    viewport = document.createElement('div');
    viewport.className = 'rid-viewport';
    viewport.tabIndex = 0;
    largeImage = document.createElement('img');
    largeImage.decoding = 'async';
    status = document.createElement('span');
    status.className = 'rid-status';
    status.setAttribute('role', 'status');
    viewport.append(largeImage, status);
    dialog.append(header, viewport);
    document.body.append(dialog);
    closeButton.addEventListener('click', () => dialog.close());
    sizeButton.addEventListener('click', () => setSize(!natural));
    dialog.addEventListener('close', restorePage);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
  }

  function openImage(entry) {
    createDialog();
    previousFocus = entry.button;
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const fallback = entry.image.currentSrc || entry.image.src;
    const full = entry.image.dataset.fullSrc;
    const fullSource = full ? (/^(https?:|data:|blob:)/i.test(full) ? full : siteURL(full)) : fallback;
    largeImage.alt = entry.image.alt || 'Original project image';
    sizeButton.disabled = true;
    status.textContent = 'Loading image…';
    largeImage.onload = () => {
      status.textContent = '';
      sizeButton.disabled = false;
      setSize(natural);
    };
    let triedFallback = false;
    largeImage.onerror = () => {
      if (!triedFallback && fullSource !== fallback) {
        triedFallback = true;
        largeImage.src = fallback;
      } else status.textContent = 'This image could not be loaded.';
    };
    setSize(false);
    largeImage.src = fullSource;
    dialog.showModal();
    closeButton.focus({ preventScroll: true });
  }

  const candidates = root.querySelectorAll('.project-figure img, .persona-original img');
  candidates.forEach(image => {
    if (image.closest('[data-verse-interaction], .rf-persona-opening, .persona-settings, button, a, [data-no-detail]') || !image.getAttribute('alt')?.trim()) return;
    const parent = image.parentElement;
    if (!parent) return;
    if (!anchors.has(parent)) {
      anchors.set(parent, parent.classList.contains('research-detail-anchor'));
      parent.classList.add('research-detail-anchor');
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'research-detail-trigger';
    button.textContent = 'View detail +';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-label', 'View image detail: ' + image.alt);
    const entry = { image, parent, button };
    const open = () => openImage(entry);
    const refresh = () => position(entry);
    button.addEventListener('click', open);
    image.addEventListener('load', refresh);
    image.after(button);
    const observer = new ResizeObserver(refresh);
    observer.observe(image);
    observer.observe(parent);
    position(entry);
    entries.push({ ...entry, open, refresh, observer });
  });
  document.fonts?.ready.then(() => { if (!disposed) entries.forEach(position); });
  return () => {
    disposed = true;
    if (dialog?.open) {
      dialog.removeEventListener('close', restorePage);
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
    }
    if (largeImage) { largeImage.onload = null; largeImage.onerror = null; }
    dialog?.remove();
    entries.forEach(entry => {
      entry.observer.disconnect();
      entry.image.removeEventListener('load', entry.refresh);
      entry.button.removeEventListener('click', entry.open);
      entry.button.remove();
    });
    anchors.forEach((hadClass, parent) => { if (!hadClass) parent.classList.remove('research-detail-anchor'); });
  };
}
