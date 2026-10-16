import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'dist');
const arg=name=>{const i=process.argv.indexOf(name);return i<0?undefined:process.argv[i+1]};
const output=path.resolve(arg('--out')||path.join(root,'site'));
const base=('/'+(arg('--base')||'').replace(/^\/+|\/+$/g,'')).replace(/^\/$/,'');
if(output===source||source.startsWith(output+path.sep)||output.startsWith(source+path.sep)||!output.startsWith(root+path.sep))throw Error('Output must be a separate folder inside the project');
const files=new Set(),queue=[];
const stripAuthoring=text=>text.replace(/<script[^>]*data-authoring[^>]*>[\s\S]*?<\/script>/g,'');
function add(relative,allowDirectory=false){
 relative=relative.replace(/^\//,'').split(/[?#]/)[0];
 const full=path.resolve(source,relative);
 if(!full.startsWith(source+path.sep)||!fs.existsSync(full))return;
 if(fs.statSync(full).isDirectory()){
  if(!allowDirectory)return;
  for(const entry of fs.readdirSync(full))if(!['node_modules','.git','.DS_Store'].includes(entry))add(path.posix.join(relative,entry),true);
  return;
 }
 if(files.has(relative)||relative.endsWith('.map'))return;
 files.add(relative);queue.push(relative);
}
['universe.html','index.html','content.json'].forEach(f=>add(f));
// These excerpts address artwork dynamically by filename; include their original sprites.
for(const dir of ['assets/games-revision','assets/games-motion','assets/research-interactive','assets/scroll-story','assets/ambulance-editorial','assets/icon-original-explorations','assets/icon-study3-native','assets/atlas-scroll-original'])add(dir,true);
// Original images addressed through composed filenames in the case-study modules.
for(const file of ['assets/design-followup/color-agent-palace-a.jpg','assets/design-followup/color-agent-palace-b.jpg','assets/research-editorial/suzhou-scroll.png','assets/research-editorial/suzhou-perspectives.png','assets/research-editorial/suzhou-cultural-clues.png','assets/games-other-followup/ambulance-hospital-tab-all-three-names-and-capacity.png'])add(file);
// Original ScrollVerse excerpts and characters are selected by short filenames.
for(const file of ['suzhou-original-scroll-view.webp','suzhou-original-cultural-clue.webp','suzhou-original-scene-context.webp','suzhou-original-quiz.webp','suzhou-role-commoner-native.webp','suzhou-role-merchant-native.webp','suzhou-role-scholar-native.webp'])add('assets/research-clarity/'+file);
for(const f of fs.readdirSync(path.join(source,'assets/fonts')))if(/LICENSE|OFL|sources\.json/i.test(f))add('assets/fonts/'+f);
add('vendor/three/LICENSE');
while(queue.length){
 const relative=queue.shift();if(!/\.(html|js|css|json|svg)$/.test(relative))continue;
 const text=stripAuthoring(fs.readFileSync(path.join(source,relative),'utf8'));
 const absolute=/["'`(](\/(?:assets|website-assets|vendor)\/[\w./%+@-]+)/g;
 for(const match of text.matchAll(absolute))add(decodeURI(match[1]));
 for(const match of text.matchAll(/(?:src|href)=["'](\/(?!\/)[^"'#?]+)["']/g))add(match[1]);
 for(const match of text.matchAll(/(?:from\s*|import\s*\(|url\(\s*)["'](\.[^"']+)["']/g))add(path.posix.join(path.posix.dirname(relative),match[1]));
 for(const match of text.matchAll(/["'](\/[\w-]+\.(?:css|js|json))["']/g))add(match[1]);
}
const roots=new Set([...files].filter(f=>!f.includes('/')));
const transform=(text,ext)=>{
 text=stripAuthoring(text);
 text=text.replace(/(["'`(])(\/(?:assets|website-assets|vendor)(?:\/|(?=["'`])))/g,(_,q,p)=>q+base+p);
 text=text.replace(/(["'])(\/[\w-]+\.(?:css|js|json))(?=["'])/g,(all,q,p,offset)=>text.slice(offset-8,offset)==='siteURL('?all:roots.has(p.slice(1))?q+base+p:all);
 if(ext==='.html'){
  text=text.replace('<html lang="en">',`<html lang="en" data-base-path="${base}">`);
  text=text.replace(/(href=["'])(\/(?!\/)[^"']*)(["'])/g,(all,q,p,end)=>p.startsWith(base+'/')&&base?all:q+base+p+end);
 }
 return text;
};
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});
for(const relative of files){
 const to=path.join(output,relative);fs.mkdirSync(path.dirname(to),{recursive:true});
 const ext=path.extname(relative);
 if(/\.(html|js|css|json|svg)$/.test(relative))fs.writeFileSync(to,transform(fs.readFileSync(path.join(source,relative),'utf8'),ext));
 else fs.copyFileSync(path.join(source,relative),to);
}
const home=fs.readFileSync(path.join(output,'universe.html'),'utf8');
const caseHTML=fs.readFileSync(path.join(output,'index.html'),'utf8');
fs.writeFileSync(path.join(output,'index.html'),home);
fs.writeFileSync(path.join(output,'404.html'),caseHTML);
const data=JSON.parse(fs.readFileSync(path.join(source,'content.json'),'utf8'));
const routes=[...data.projects.map(p=>p.slug),'/gglancemap','/traditional-color','/traditionalcolor','/icon-color','/iconcolor','/games/loofa-soup','/research/gaze'];
for(const route of routes){const dir=path.join(output,route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),caseHTML);}
for(const route of ['games','research']){const dir=path.join(output,route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${base}/"><title>All projects</title></head><body><a href="${base}/">All projects</a></body></html>`);}
fs.writeFileSync(path.join(output,'.nojekyll'),'');
fs.writeFileSync(path.join(root,'.site-files.json'),JSON.stringify([...files].sort(),null,2)+'\n');
const bytes=[...files].reduce((sum,f)=>sum+fs.statSync(path.join(source,f)).size,0);
console.log(JSON.stringify({output,base,files:files.size,megabytes:+(bytes/1024/1024).toFixed(1),routes:routes.length}));
