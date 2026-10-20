const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function emphasize(text, phrases = []) {
  const source = String(text ?? ''), ranges = [];
  for (const phrase of [...phrases].sort((a,b) => b.length-a.length)) {
    const start = source.indexOf(phrase), end = start+phrase.length;
    if (start < 0 || ranges.some(range => start < range.end && end > range.start)) continue;
    ranges.push({start, end});
  }
  let cursor = 0, result = '';
  for (const {start,end} of ranges.sort((a,b) => a.start-b.start).slice(0,3)) {
    result += esc(source.slice(cursor,start)) + `<strong class="text-emphasis">${esc(source.slice(start,end))}</strong>`;
    cursor = end;
  }
  return result + esc(source.slice(cursor));
}

export function rolePanel(role) {
  const contributions = Array.isArray(role?.contributions) ? role.contributions.filter(item => item?.label && item?.value) : [];
  const bullets = Array.isArray(role?.bullets) ? role.bullets.filter(item => typeof item === 'string' && item.trim()) : [];
  if (!role?.value && !role?.details && !contributions.length && !bullets.length) return '';
  return `<aside class="project-role${contributions.length?' has-contributions':''}${bullets.length?' has-role-points':''}" aria-label="My role"><h2>My role</h2>${role.value?`<p class="role-value">${esc(role.value)}</p>`:''}${role.details?`<p class="role-detail">${esc(role.details)}</p>`:''}${bullets.length?`<ul class="role-points">${bullets.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:''}${contributions.length?`<dl class="role-contributions">${contributions.map(item=>`<div><dt>${esc(item.label)}</dt><dd><p>${esc(item.value)}</p>${item.details?`<p class="role-contribution-detail">${esc(item.details)}</p>`:''}</dd></div>`).join('')}</dl>`:''}</aside>`;
}

export function outcomePanel(outcome) {
  const lines = (Array.isArray(outcome) ? outcome : [outcome]).filter(value => typeof value === 'string' && value.trim());
  if (!lines.length) return '';
  return `<div class="hero-outcome${Array.isArray(outcome)?' has-outcome-lines':''}"><span>Outcome</span>${Array.isArray(outcome)?`<ul class="outcome-lines">${lines.map(line=>`<li>${esc(line)}</li>`).join('')}</ul>`:`<p>${esc(lines[0])}</p>`}</div>`;
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

// Paragraph labels identify the job each passage does, after page-specific
// compositions have placed their copy. They never label captions or quotes.
export function labelAbstractParagraphs(root, project) {
  const section = project.sections.find(s => s.nav?.toLowerCase() === 'abstract')
    || (project.id === 'personamail' ? project.sections[0] : null);
  if (!section) return;
  const host = root.querySelector(`#${section.id}`);
  if (!host) return;
  const selectors = {
    ambulance: '.ar-news-copy > p',
    hersound: '.her-abstract-copy > p',
    'traditional-color': '.section-body > p, :scope > .color-abstract-finding'
  };
  const labels = {
    personamail: ['Problem', 'Approach'],
    loofasoup: ['Game background', 'Intent'],
    hersound: ['Context', 'Approach'],
    ourworld: ['Archive', 'Scope', 'Purpose'],
    ambulance: ['Problem', 'Approach', 'Return to the news']
  }[project.id] || ['Problem', 'Approach', 'Findings'];
  host.querySelectorAll(selectors[project.id] || '.section-body > p').forEach((paragraph, index) => {
    if (!labels[index] || paragraph.querySelector('.abstract-purpose')) return;
    paragraph.classList.add('abstract-paragraph');
    const label = document.createElement('span');
    label.className = 'abstract-purpose';
    label.textContent = `${labels[index]}:`;
    paragraph.prepend(label, document.createTextNode(' '));
  });
}
