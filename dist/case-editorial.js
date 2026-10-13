const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function emphasize(text, phrases = []) {
  const source = String(text ?? ''), ranges = [];
  for (const phrase of [...phrases].sort((a,b) => b.length-a.length)) {
    const start = source.indexOf(phrase), end = start+phrase.length;
    if (start < 0 || ranges.some(range => start < range.end && end > range.start)) continue;
    ranges.push({start, end});
  }
  let cursor = 0, result = '';
  for (const {start,end} of ranges.sort((a,b) => a.start-b.start).slice(0,2)) {
    result += esc(source.slice(cursor,start)) + `<strong class="text-emphasis">${esc(source.slice(start,end))}</strong>`;
    cursor = end;
  }
  return result + esc(source.slice(cursor));
}

export function rolePanel(role) {
  if (!role?.value) return '';
  return `<aside class="project-role" aria-label="My role"><h2>My role</h2><p class="role-value">${esc(role.value)}</p>${role.details?`<p class="role-detail">${esc(role.details)}</p>`:''}</aside>`;
}

// A story panel is original artwork plus live, reflowable copy, never an exported page.
export function comicPanel(panel, hero = false) {
  return `<figure class="project-figure comic-panel ${hero?'hero-figure':''} reveal">
    <div class="figure-media"><img src="${esc(panel.src)}" alt="${esc(panel.alt)}" width="${Number(panel.width)||1024}" height="${Number(panel.height)||1024}" ${hero?'fetchpriority="high"':'loading="lazy"'} decoding="async"></div>
    <figcaption><span class="comic-step">${esc(panel.step)}</span><div><strong>${esc(panel.title)}</strong>${(panel.paragraphs?.length?panel.paragraphs:[panel.caption]).filter(Boolean).map(text=>`<p>${emphasize(text,panel.highlights||[])}</p>`).join('')}</div></figcaption>
  </figure>`;
}

export function publicLink(url) {
  try {
    const parsed = new URL(url);
    return ['https:','http:'].includes(parsed.protocol) && !/(^|\.)figma\.com$/i.test(parsed.hostname);
  } catch { return false; }
}
