import {resolve, dirname} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {readFile, writeFile} from 'node:fs/promises';
const root=dirname(fileURLToPath(import.meta.url));
const req=createRequire(process.env.HER_ENGLISH_DEPENDENCIES ? resolve(process.env.HER_ENGLISH_DEPENDENCIES,'../package.json') : import.meta.url);
const {build}=await import(pathToFileURL(req.resolve('vite')).href);
const {default:react}=await import(pathToFileURL(req.resolve('@vitejs/plugin-react')).href);
const reactDir=dirname(req.resolve('react/package.json')),reactDomDir=dirname(req.resolve('react-dom/package.json'));
await build({configFile:false,root,publicDir:false,define:{'process.env.NODE_ENV':JSON.stringify('production')},resolve:{alias:[{find:'@',replacement:resolve(root,'src')},{find:/^react-dom(\/.*)?$/,replacement:reactDomDir+'$1'},{find:/^react(\/.*)?$/,replacement:reactDir+'$1'}]},plugins:[react()],build:{outDir:resolve(root,'bundle'),emptyOutDir:true,target:'es2020',lib:{entry:resolve(root,'src/entry.tsx'),formats:['es'],fileName:()=> 'her-inline.js'},sourcemap:false}});
const postcss=req('postcss');
const ast=postcss.parse(await readFile(resolve(root,'src/original-game.css'),'utf8'));
ast.walkAtRules(rule=>{if(rule.name==='import'||rule.name==='font-face')rule.remove()});
ast.walkRules(rule=>{
  if(rule.parent?.type==='atrule'&&/keyframes/.test(rule.parent.name))return;
  rule.selectors=rule.selectors.map(s=>s===':root'||s==='body'||s==='html'?'.gx-her-island':'.gx-her-island '+s.replace(/^body\s+/,'').replace(/^html\s+/,''));
});
const css=ast.toString().replaceAll('/assets/game/','/assets/games-revision/her/game/').replaceAll('/assets/ui/','/assets/games-revision/her/ui/');
await writeFile(resolve(root,'original-scoped.css'),css);
