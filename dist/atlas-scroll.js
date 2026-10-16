import { siteURL } from './site-paths.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=v=>Math.max(0,Math.min(1,v)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t);
const BASE='/assets/atlas-scroll-original/';
const SOURCES=[['mineral','矿物','Mineral','mineral-azurite.jpg'],['plant','草木','Plant','plant-indigo.jpg'],['literary','典籍','Literary','literary-book.png'],['nature','自然','Nature','nature-huangshan.jpg']];
let dataPromise;
const loadData=()=>dataPromise||(dataPromise=fetch(siteURL(BASE+'native-data.json')).then(r=>{if(!r.ok)throw Error('Color archive unavailable');return r.json()}));
// English summaries preserve the original color IDs, values, origins and cited records.
const ENGLISH={
 zhusha:['Cinnabar','A red pigment from mercury sulfide, also called chensha or dansha.'],
 shiqing:['Azurite blue','Ground azurite gives this deep mineral blue.'],
 shilu:['Malachite green','Ground malachite produces a green compared with kingfisher feathers.'],
 zheshi:['Red ochre','An iron-oxide pigment among the oldest pigments used in China.'],
 qianbai:['Lead white','Lead treated with vinegar forms the white pigment once called hufen.'],
 yanzhi:['Rouge','A red color obtained from safflower petals.'],
 tenghuang:['Gamboge','A golden yellow made from tree resin.'],
 dianlan:['Indigo','Blue dye produced by fermenting and settling indigo-bearing plants.'],
 qian:['Madder red','Boiled madder roots yield a vivid red dye.'],
 zhizi:['Gardenia yellow','Gardenia fruit produces a warm yellow dye.'],
 dai:['Eyebrow blue-black','Indigo was finely ground with stone and mixed with fat for eyebrow pigment.'],
 luodai:['Luodai blue-black','A blue-black mineral pigment shaped like a spiral, ground for the eyebrows.'],
 tianqing:['Sky blue','The color of the sky clearing after rain.'],
 yuebai:['Moon white','Pale blue with a white cast, named after moonlight.'],
 piao:['Pale silk blue','Shuowen Jiezi describes piao as the blue-white color of silk.'],
 jiang:['Deep crimson','A deep red associated with repeated madder dyeing.'],
 xuan:['Reddish black','Shuowen Jiezi describes xuan as black with a reddish cast.'],
 kongqing:['Kongqing blue','A translucent blue associated with hollow azurite formations.'],
 songhua:['Pine-pollen yellow-green','A gentle yellow-green named after pine pollen.'],
 mo:['Ink black','Pine soot or oil soot combined with glue to make writing ink.'],
 ouhe:['Lotus pink-purple','A soft pink-purple named for lotus roots and flowers.'],
 tianshuibi:['Sky-and-water turquoise','An account of Southern Tang dyeing names this blue-green after fabric exposed to evening dew.'],
 cui:['Kingfisher green','Named for the blue-green feathers of the kingfisher.'],
 yuse:['Jade white-green','A warm, translucent pale green-white named after jade.'],
 chenxiang:['Agarwood brown','A quiet dark brown named after agarwood.']
};
const SOURCE_TITLES={
 '《神农本草经》':'Divine Farmer’s Materia Medica','《本草纲目》':'Compendium of Materia Medica',
 '《历代名画记》':'Records of Famous Paintings Through the Ages','《芥子园画传》':'Mustard Seed Garden Painting Manual',
 '《千里江山图》':'A Thousand Li of Rivers and Mountains','《画史》':'History of Painting',
 '《考工记》':'Record of Crafts','《天工开物》':'Exploitation of the Works of Nature',
 '《释名》':'Explanation of Names','《齐民要术》':'Essential Techniques for the People',
 '《史记》':'Records of the Grand Historian','《博物志》':'Records of Diverse Matters',
 '《荀子·劝学》':'Xunzi · Encouraging Learning','《诗经·小雅》':'Book of Songs · Lesser Odes',
 '《诗经·郑风》':'Book of Songs · Airs of Zheng','《汉官仪》':'Institutions of Han Officials',
 '《楚辞·大招》':'Songs of Chu · The Great Summons','《隋唐嘉话》':'Anecdotes of the Sui and Tang',
 '《开元天宝遗事》':'Anecdotes of the Kaiyuan and Tianbao Eras','《格古要论》':'Guide to the Study of Antiquities',
 '《清波杂志》':'Miscellaneous Records of Qingbo','《红楼梦》':'Dream of the Red Chamber',
 '《扬州画舫录》':'Record of Yangzhou Pleasure Boats','《说文解字》':'Shuowen Jiezi · Explaining Written Characters',
 '《洛神赋》':'Rhapsody on the Luo River Goddess','《周易》':'Book of Changes','《道德经》':'Dao De Jing',
 '《千字文》':'Thousand Character Classic','《薛涛笺》':'Xue Tao’s Colored Paper',
 '《墨经》':'Treatise on Ink','《东坡题跋》':'Dongpo’s Inscriptions and Colophons',
 '《十国春秋》':'Spring and Autumn Annals of the Ten Kingdoms','《梦溪笔谈》':'Dream Pool Essays',
 '《长恨歌》':'Song of Everlasting Sorrow','《礼记·玉藻》':'Book of Rites · Jade Beads','《诗经·秦风》':'Book of Songs · Airs of Qin'
};
const translated=c=>ENGLISH[c.id]||[c.pinyin,c.origin];
const chip=c=>`<span class="atlas-color-token" data-color="${c.id}" style="--color:${c.hex}"><i aria-hidden="true"></i><span>${esc(c.name)}<small>${c.hex}</small></span></span>`;
const chapterHeading=c=>`<div class="atlas-native-heading"><h3>${esc(c?.title||'From origins to color families')}</h3><p>${esc(c?.body?.[0]||'Trace 100 colors from four origins into eight color families. English notes explain the selected Chinese color record.')}</p></div>`;
export function renderAtlasScroll(chapter){return `<div class="atlas-native" data-atlas-scroll><div class="atlas-native-sticky">${chapterHeading(chapter)}<div class="atlas-native-label"><strong data-atlas-phase>Four origins</strong><span>Scroll to follow the connections ↓</span></div><div class="atlas-native-field" data-atlas-field></div><div class="atlas-native-record" data-atlas-record></div></div><div class="atlas-native-mobile" data-atlas-mobile></div></div>`;}
export function renderAtlasCompose(){return `<div class="atlas-compose" data-atlas-compose><p>Opening the original design briefs…</p></div>`;}
function sourceHeader(s){return `<img src="${siteURL(BASE+'assets/source-photos/'+s[3])}" alt="${s[2]} color origins"><h4>${s[1]}<span>${s[2]}</span></h4>`;}
function mobileGroups(data){const focus=['shiqing','yanzhi','piao','tianshuibi'];return `<div class="atlas-mobile-origins">${SOURCES.map((s,i)=>`<section class="atlas-native-mobile-group" data-atlas-reveal><header>${sourceHeader(s)}</header><div class="atlas-native-token-grid">${data.colors.filter(c=>c.cat===s[0]).map(chip).join('')}</div><div class="atlas-native-record atlas-mobile-record">${record(data.colors.find(c=>c.id===focus[i]))}</div></section>`).join('')}</div><h4 class="atlas-native-mobile-title">The same colors, eight families</h4><div class="atlas-mobile-families">${Object.entries(data.families).map(([id,f])=>`<section class="atlas-native-mobile-group" data-atlas-reveal><h4 style="--family:${id==='white'?'#766c57':id==='yellow'?'#98721d':f.accent}">${f.cn}<span>${f.en}</span></h4><div class="atlas-native-token-grid">${data.colors.filter(c=>data.relations[c.id]?.family?.[0]===id).map(chip).join('')}</div></section>`).join('')}</div>`;}
function record(c){if(!c)return '';const [name,origin]=translated(c);return `<div class="atlas-record-name"><i style="background:${c.hex}" aria-hidden="true"></i><div><h4>${esc(c.name)}</h4><strong>${esc(name)}</strong><small>${c.hex} · ${esc(c.pinyin)}</small></div></div><div class="atlas-record-origin"><span>Origin</span><p>${esc(origin)}</p></div><div class="atlas-native-citation"><span>Source record</span><p>${c.cites.map(v=>`<span title="${esc(v)}">${esc(SOURCE_TITLES[v]||v)}</span>`).join(' · ')}</p></div>`;}
export function setupAtlasScroll(host){
 const wrap=host?.matches?.('[data-atlas-scroll]')?host:host?.querySelector?.('[data-atlas-scroll]');if(!wrap)return()=>{};
 const abort=new AbortController();let disposed=false,frame=0,data=null,tokens=[],lastRecord='',sizes=[];const field=wrap.querySelector('[data-atlas-field]'),sticky=wrap.querySelector('.atlas-native-sticky'),mobile=wrap.querySelector('[data-atlas-mobile]'),recordBox=wrap.querySelector('[data-atlas-record]'),phase=wrap.querySelector('[data-atlas-phase]'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const sourceIndex=new Map(),familyIndex=new Map();
 function measure(){if(!data)return;const W=field.clientWidth,H=field.clientHeight,gap=32,sourceW=(W-gap)/2,rowH=H/2,photoW=Math.min(145,sourceW*.24),familyW=(W-gap*3)/4;
  wrap.querySelectorAll('.atlas-native-source').forEach((el,i)=>{el.style.left=(i%2)*(sourceW+gap)+'px';el.style.top=Math.floor(i/2)*rowH+'px';el.style.width=photoW+'px'});
  wrap.querySelectorAll('.atlas-native-family').forEach((el,i)=>{el.style.left=(i%4)*(familyW+gap)+'px';el.style.top=Math.floor(i/4)*rowH+'px';el.style.width=familyW+'px'});
  sizes=data.colors.map(c=>{const s=sourceIndex.get(c.id),f=familyIndex.get(c.id),sw=(sourceW-photoW-20-20)/5,fw=(familyW-12)/3,ch=Math.min(42,(rowH-70)/5);return{sx:(s.group%2)*(sourceW+gap)+photoW+20+(s.local%5)*(sw+5),sy:Math.floor(s.group/2)*rowH+45+Math.floor(s.local/5)*(ch+5),sw,syh:ch,fx:(f.group%4)*(familyW+gap)+(f.local%3)*(fw+6),fy:Math.floor(f.group/4)*rowH+45+Math.floor(f.local/3)*(ch+5),fw}});queue();
 }
 function update(){frame=0;if(disposed||!data)return;if(innerWidth<=700){wrap.querySelectorAll('[data-atlas-reveal]').forEach(el=>{const p=reduce.matches?1:clamp((innerHeight*.95-el.getBoundingClientRect().top)/(innerHeight*.28));el.style.setProperty('--enter',p)});return;}
  const stickyTop=parseFloat(getComputedStyle(sticky).top)||82,p=clamp((stickyTop-wrap.getBoundingClientRect().top)/Math.max(1,wrap.offsetHeight-sticky.offsetHeight)),m=ease(clamp((p-.43)/.35));wrap.dataset.atlasProgress=p.toFixed(4);wrap.dataset.atlasTime=(8+p*30).toFixed(3);phase.textContent=p<.43?'Four origins':p<.78?'From origins to color families':'Eight color families';
  // Clear the labels before colors leave their rows, then restore them after landing.
  const originsVisible=1-clamp((p-.36)/.06),familiesVisible=clamp((p-.78)/.06),labelsVisible=Math.max(originsVisible,clamp((p-.8)/.06));
  field.style.setProperty('--atlas-label-opacity',labelsVisible);
  wrap.querySelectorAll('.atlas-native-source').forEach(el=>el.style.opacity=originsVisible);wrap.querySelectorAll('.atlas-native-family').forEach(el=>el.style.opacity=familiesVisible);
  tokens.forEach((el,i)=>{const a=sizes[i];if(!a)return;el.style.transform=`translate(${mix(a.sx,a.fx,m)}px,${mix(a.sy,a.fy,m)}px)`;el.style.width=mix(a.sw,a.fw,m)+'px';el.style.height=a.syh+'px';});
  const focus=p<.43?['shiqing','shilu','yanzhi','tenghuang','piao','xuan','tianshuibi','cui'][Math.min(7,Math.floor(p/.43*8))]:['qian','zhizi','songhua','dianlan','ouhe','qianbai','mo','zheshi'][Math.min(7,Math.floor(clamp((p-.43)/.57)*8))];if(focus!==lastRecord){lastRecord=focus;recordBox.innerHTML=record(data.colors.find(c=>c.id===focus));}tokens.forEach(el=>el.classList.toggle('is-current',el.dataset.color===focus));
 }
 function queue(){if(!frame&&!disposed)frame=requestAnimationFrame(update)}
 const observer=new ResizeObserver(measure);observer.observe(field);
 loadData().then(d=>{if(disposed)return;data=d;SOURCES.forEach((s,group)=>d.colors.filter(c=>c.cat===s[0]).forEach((c,local)=>sourceIndex.set(c.id,{group,local})));Object.keys(d.families).forEach((id,group)=>d.colors.filter(c=>d.relations[c.id]?.family?.[0]===id).forEach((c,local)=>familyIndex.set(c.id,{group,local})));
  field.innerHTML=SOURCES.map(s=>`<div class="atlas-native-source">${sourceHeader(s)}</div>`).join('')+Object.entries(d.families).map(([id,f])=>`<h4 class="atlas-native-family" style="--family:${id==='white'?'#766c57':id==='yellow'?'#98721d':f.accent}">${f.cn}<span>${f.en}</span></h4>`).join('')+d.colors.map(chip).join('');tokens=[...field.querySelectorAll('.atlas-color-token')];mobile.innerHTML=mobileGroups(d);wrap.dataset.atlasReady='true';measure();
 }).catch(e=>{if(!disposed){phase.textContent='The color archive could not load';console.error(e)}});
 addEventListener('scroll',queue,{passive:true,signal:abort.signal});addEventListener('resize',measure,{passive:true,signal:abort.signal});reduce.addEventListener('change',queue,{signal:abort.signal});
 return()=>{disposed=true;abort.abort();observer.disconnect();cancelAnimationFrame(frame)};
}
function paletteCard(c){const [name,origin]=translated(c);return `<article class="atlas-preset-color" style="--color:${c.hex}"><div class="atlas-preset-swatch"></div><h5>${esc(c.name)}</h5><p class="atlas-preset-english">${esc(name)}</p><p class="atlas-preset-value">${c.hex}</p><p class="atlas-preset-pinyin">${esc(c.pinyin)}</p><p class="atlas-preset-origin">${esc(origin)}</p><p class="atlas-preset-origin-cn" lang="zh">${esc(c.origin)}</p></article>`;}
// This reading aid is an editorial explanation of the visible preset and its archived records,
// not a reconstruction of an AI retrieval trace or a participant's design rationale.
const paletteReading=()=>`<div class="atlas-preset-reading"><h4>Why this palette fits</h4><div class="atlas-reading-steps"><article><span>Brief</span><p>Spring rain, simple and warm.</p></article><article><span>Color record</span><p><i class="atlas-reading-chip" style="--color:#6E9CB3" aria-hidden="true"></i><strong>Tianqing / 天青</strong> recalls a sky clearing after rain.</p></article><article><span>Design choice</span><p>Blue-greens suggest rain; pale white and lotus pink soften the palette.</p></article></div><p class="atlas-reading-scope">An interpretation of this example, not a historically documented combination.</p></div>`;
function presetMarkup(p,i,data,primary=false){return `<section class="atlas-preset ${primary?'atlas-preset-primary':''}" data-preset-index="${i}"><div class="atlas-preset-brief"><span class="atlas-preset-number">Example ${String(i+1).padStart(2,'0')}</span><h4>${esc(p.title)}</h4><p>${esc(p.translation)}</p><div class="atlas-preset-input"><span class="atlas-preset-input-label">Design brief / 召色</span><span class="atlas-preset-reserve" aria-hidden="true">${esc(p.prompt)}</span><span data-preset-typed data-prompt="${esc(p.prompt)}"></span></div></div><div class="atlas-preset-palette">${p.ids.map(id=>paletteCard(data.colors.find(c=>c.id===id))).join('')}</div>${primary?paletteReading():''}</section>`;}
export function setupAtlasCompose(host){
 const wrap=host?.querySelector?.('[data-atlas-compose]');if(!wrap)return()=>{};const abort=new AbortController(),reduce=matchMedia('(prefers-reduced-motion: reduce)');let disposed=false,frame=0;
 function update(){frame=0;if(disposed)return;wrap.querySelectorAll('.atlas-preset').forEach(el=>{const disclosure=el.closest('details');if(disclosure&&!disclosure.open)return;const p=reduce.matches?1:clamp((innerHeight*.82-el.getBoundingClientRect().top)/(innerHeight*.6));el.dataset.progress=p.toFixed(4);const text=el.querySelector('[data-preset-typed]');text.textContent=text.dataset.prompt.slice(0,Math.ceil(text.dataset.prompt.length*clamp(p/.38)));el.querySelectorAll('.atlas-preset-color').forEach((card,i)=>{const enter=reduce.matches?1:ease(clamp((p-.24-i*.075)/.27));card.style.setProperty('--enter',enter)});});}
 const queue=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(update)};
 loadData().then(data=>{if(disposed)return;wrap.innerHTML=presetMarkup(data.presets[0],0,data,true)+`<div class="atlas-secondary-presets"><h4>Three more briefs</h4>${data.presets.slice(1).map((p,i)=>`<details class="atlas-preset-disclosure"><summary><span>${esc(p.title)}</span><span class="atlas-preset-summary-swatches" aria-hidden="true">${p.ids.map(id=>`<i style="background:${data.colors.find(c=>c.id===id).hex}"></i>`).join('')}</span><span class="atlas-preset-disclosure-label">View colors + records</span></summary>${presetMarkup(p,i+1,data)}</details>`).join('')}</div>`;wrap.dataset.composeReady='true';queue()}).catch(e=>{if(!disposed){wrap.innerHTML='<p>The original palettes could not load.</p>';console.error(e)}});
 wrap.addEventListener('toggle',queue,{capture:true,signal:abort.signal});addEventListener('scroll',queue,{passive:true,signal:abort.signal});addEventListener('resize',queue,{passive:true,signal:abort.signal});reduce.addEventListener('change',queue,{signal:abort.signal});return()=>{disposed=true;abort.abort();cancelAnimationFrame(frame)};
}
