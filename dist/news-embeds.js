// Publisher previews use titles and source links already present in the portfolio.
// Third-party pages load only when the visitor chooses to expand a preview.
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const articles = [
  { id:'abc-ramping', section:'abstract', outlet:'ABC News', date:'6 December 2023', title:'Ambulance ramping outside South Australian public hospitals hits record high', url:'https://www.abc.net.au/news/2023-12-06/november-ambulance-ramping-hits-record-high-in-south-australia/103194476' },
  { id:'indaily-game', section:'publication', outlet:'InDaily', date:'5 November 2024', title:'What if South Australia’s ramping crisis was a video game? Now it is', url:'https://www.indailysa.com.au/news/in-depth/2024/11/05/what-if-south-australias-ramping-crisis-was-a-video-game-now-it-is' }
];
function preview(article, compact=false, allowEmbed=true) {
  const wrapper=document.createElement('article');
  wrapper.className=`news-preview${compact?' news-preview-compact':''}`;
  if(article.id)wrapper.dataset.news=article.id;
  const canEmbed=allowEmbed&&!/(^|\.)londonmuseum\.org\.uk$/.test(new URL(article.url).hostname);
  wrapper.innerHTML=`<div class="news-preview-meta"><span>${esc(article.outlet)}</span>${article.date?`<time>${esc(article.date)}</time>`:''}</div><h4>${esc(article.title)}</h4><div class="news-preview-actions"><a href="${esc(article.url)}" target="_blank" rel="noopener noreferrer">Open original article ↗</a>${canEmbed?`<details class="news-inline-reader" data-source-url="${esc(article.url)}"><summary><span>Read here</span><span aria-hidden="true">＋</span></summary><div class="news-reader-content"><p>The original link stays available if the publisher does not allow an embedded view.</p><div class="news-reader-frame"></div><a href="${esc(article.url)}" target="_blank" rel="noopener noreferrer">Open on ${esc(article.outlet)} ↗</a></div></details>`:''}</div>`;
  return wrapper;
}
export function setupNewsEmbeds(root=document) {
  const body=root.ownerDocument?.body || document.body;
  const added=[],observers=[];
  if(body.dataset.project==='ambulance') {
    for(const article of articles) {
      const section=root.querySelector(`#${article.section} .section-body`);
      if(!section || section.querySelector(`[data-news="${article.id}"]`))continue;
      const original=[...section.querySelectorAll('a[href]')].find(a=>a.href===article.url);
      const card=preview(article);
      if(original?.closest('.insight'))original.closest('.insight').replaceWith(card);
      else section.append(card);
      added.push(card);
    }
  }
  const enhanceSources=record=> {
    const sources=record.querySelector('.gx-sources');
    if(!sources || sources.dataset.newsReady)return;
    sources.dataset.newsReady='true';sources.classList.add('news-source-list');
    for(const link of [...sources.querySelectorAll(':scope > a[href]')]) {
      const url=new URL(link.href);if(url.protocol!=='https:')continue;
      const label=link.textContent.replace(/\s*↗\s*$/,'').trim();
      const parts=label.split(' · '),outlet=parts.length>1?parts.shift():url.hostname.replace(/^www\./,'');
      const card=preview({outlet,title:parts.length?parts.join(' · '):label,url:link.href},true,body.dataset.project!=='ourworld');
      link.replaceWith(card);
    }
  };
  for(const record of root.querySelectorAll('.gx-animal-record')) {
    enhanceSources(record);
    const observer=new MutationObserver(()=>enhanceSources(record));
    observer.observe(record,{childList:true});observers.push(observer);
  }
  const toggle=event=> {
    const details=event.target;
    if(!details.matches?.('.news-inline-reader'))return;
    const holder=details.querySelector('.news-reader-frame');
    details.querySelector('summary span:last-child').textContent=details.open?'−':'＋';
    if(!details.open){holder.replaceChildren();return;}
    if(holder.firstChild)return;
    const iframe=document.createElement('iframe');
    iframe.title=`Original article: ${details.closest('.news-preview').querySelector('h4').textContent}`;
    iframe.loading='lazy';iframe.referrerPolicy='no-referrer';
    iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups');
    iframe.src=details.dataset.sourceUrl;holder.append(iframe);
  };
  root.addEventListener('toggle',toggle,true);
  return()=>{root.removeEventListener('toggle',toggle,true);observers.forEach(o=>o.disconnect());root.querySelectorAll('.news-reader-frame').forEach(x=>x.replaceChildren());};
}
