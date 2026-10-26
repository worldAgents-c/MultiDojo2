'use strict';
const english=document.documentElement.lang==='en';
const copy=english?{
  fanCaption:'Complete fan assembly · Follow the process from individual parts to the finished fan, with scene and close-up views.',
  overview:'Multi-robot collaboration · 2,000+ trajectories',
  overviewCaption:'From fan assembly to parallel manipulation: collaboration across homogeneous, heterogeneous, and humanoid robot teams.',
  heterogeneous:'Ten heterogeneous robots · Fan assembly',
  isomorphic:'Ten homogeneous robots · Fan assembly',
  humanoid:'Ten robots, including humanoids · Fan assembly',
  recording:' · Demonstration video',
  badLink:'This project link is temporarily unavailable',
  fetchError:'Unable to load project resources',
  badConfig:'Project configuration version mismatch',
  comingSoon:'Online evaluation is coming soon.',
  retry:'Unable to load the page. Please refresh and try again.',
  taskError:'Unable to load task demonstrations. Please refresh and try again.',
  poster:' · Natural-tabletop demonstration'
}:{
  fanCaption:'风扇装配全流程 · 从零件就位到完成装配，全景与工件近景同步呈现。',
  overview:'多机器人协作 · 2,000+ 条轨迹总览',
  overviewCaption:'从风扇装配到多工位操作，持续呈现同构、异构与跨形态机器人的协作过程。',
  heterogeneous:'异构十机器人 · 风扇装配',
  isomorphic:'同构十机器人 · 风扇装配',
  humanoid:'含人形机器人 · 十机器人风扇装配',
  recording:'精选录像',
  badLink:'项目链接暂时无法打开',
  fetchError:'无法读取项目资料',
  badConfig:'项目配置版本不符',
  comingSoon:'线上测评服务即将上线。',
  retry:'页面加载遇到问题，请刷新重试。',
  taskError:'任务示范加载失败，请刷新重试。',
  poster:'自然桌面示范'
};
const scenes={
  overview:{label:copy.overview,asset:'collaboration-overview',ratio:'16 / 9',caption:copy.overviewCaption},
  heterogeneous:{label:copy.heterogeneous,asset:'fan-heterogeneous'},
  isomorphic:{label:copy.isomorphic,asset:'fan-isomorphic'},
  humanoid:{label:copy.humanoid,asset:'fan-humanoid'}
};
const video=document.getElementById('hero-video');
const assetVersion=new URL(document.currentScript.src).searchParams.get('v');
function assetURL(path){
  const url=new URL(path,location.href);
  if(assetVersion)url.searchParams.set('v',assetVersion);
  return url.href;
}
let sceneToken=0;
async function chooseScene(name,play=false){
  if(!Object.hasOwn(scenes,name))return;
  const token=++sceneToken,scene=scenes[name];
  video.pause();video.poster=assetURL(`assets/${scene.asset}.jpg`);video.src=assetURL(`assets/${scene.asset}.mp4`);
  video.style.aspectRatio=scene.ratio||'8 / 3';video.load();
  document.getElementById('demo-label').textContent=scene.label;
  video.setAttribute('aria-label',scene.label+copy.recording);
  document.getElementById('demo-caption').textContent=scene.caption||copy.fanCaption;
  document.getElementById('demo-download').href=assetURL(`assets/${scene.asset}.mp4`);
  document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scene===name)));
  if(play&&token===sceneToken){try{await video.play();}catch(_){/* Native controls remain available if autoplay is restricted. */}}
}
document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>chooseScene(b.dataset.scene,true)));
let resumeAfterHidden=false;
document.addEventListener('visibilitychange',()=>{if(document.hidden){resumeAfterHidden=!video.paused;video.pause();}else if(resumeAfterHidden){resumeAfterHidden=false;video.play().catch(()=>{});}});
function languageLinks(){
  document.querySelectorAll('.site-language a').forEach(a=>{const url=new URL(a.href);url.hash=location.hash;a.href=url.href;});
}
languageLinks();addEventListener('hashchange',languageLinks);
function safeURL(value){
  if(value===null)return null;
  if(typeof value!=='string'||!/^https?:\/\//.test(value)||/[\s\\]/.test(value))throw Error(copy.badLink);
  const u=new URL(value);
  if(u.username||u.password||u.search||u.hash||!(u.protocol==='https:'||(u.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(u.hostname))))throw Error(copy.badLink);
  return u;
}
async function json(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error(`${copy.fetchError} (${r.status})`);return r.json();}
function disableLiveLinks(message){document.querySelectorAll('[data-live-path]').forEach(a=>{a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.title=message;});}
disableLiveLinks(copy.comingSoon);
async function init(){
  const config=await json('project-config.json');
  if(config.brand!=='MultiDojo²'||!['local','static'].includes(config.deployment))throw Error(copy.badConfig);
  const official=safeURL(config.official_site_url),github=safeURL(config.github_url),service=safeURL(config.live_benchmark_url);
  if(official){
    const base=official.href.endsWith('/')?official.href:official.href+'/';
    const canonical=document.createElement('link');canonical.rel='canonical';canonical.href=new URL(english?'index.en.html':'./',base).href;document.head.append(canonical);
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(a=>{a.href=new URL(a.hreflang==='en'?'index.en.html':'./',base).href;});
  }
  if(github){document.querySelectorAll('[data-github]').forEach(a=>{a.href=github.href;a.hidden=false;a.target='_blank';a.rel='noopener';});document.querySelectorAll('[data-github-pending]').forEach(a=>a.hidden=true);}
  const live=config.deployment==='local'||Boolean(service);
  function redirectLegacy(){if(!['#tasks','#leaderboard','#submit'].includes(location.hash)||!live)return false;const target=service?new URL('leaderboard.html'+location.hash,service.href.endsWith('/')?service.href:service.href+'/').href:'leaderboard.html'+location.hash;location.replace(target);return true;}
  addEventListener('hashchange',redirectLegacy);if(redirectLegacy())return;
  for(const a of document.querySelectorAll('[data-live-path]')){
    if(!live){a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.title=copy.comingSoon;}
    else{const base=service?(service.href.endsWith('/')?service.href:service.href+'/'):location.href;a.href=new URL(a.dataset.livePath,base).href;a.removeAttribute('aria-disabled');a.removeAttribute('title');}
  }
  if(config.deployment==='static'){const note=document.getElementById('deployment-note');note.hidden=live;note.textContent=live?'':copy.comingSoon;}
  const payload=config.deployment==='static'?await json('featured-tasks.json'):await Promise.all([json('/api/catalog'),json('/api/showcase')]).then(([catalog,show])=>({tasks:catalog.tasks.filter(t=>[0,2,5,9,14,15].includes(t.number)).map(t=>({...t,poster:show.previews.find(p=>p.number===t.number)?.poster}))}));
  const englishTitles=new Map(english&&config.deployment==='local'?(await json('assets/task-catalog.json')).tasks.map(t=>[Number(t.id),t.title]):[]);
  const cards=[];
  for(const task of payload.tasks){
    const name=english?(task.title_en||englishTitles.get(task.number)):task.title;
    if(!name)throw Error(copy.taskError);
    const arms=task.task.includes('OctaArm')?8:task.task.includes('QuadArm')?4:task.task.includes('TripleArm')?3:2;
    const card=document.createElement('article');card.className='featured-task';
    const image=document.createElement('img');image.src=assetURL(task.poster);image.alt=name+copy.poster;image.loading='lazy';image.width=640;image.height=480;
    const body=document.createElement('div'),label=document.createElement('small'),title=document.createElement('h3');
    label.textContent=english?`TASK ${String(task.number).padStart(2,'0')} / ${arms} ARMS`:`任务 ${String(task.number).padStart(2,'0')} / ${arms} 臂`;
    title.textContent=name;body.append(label,title);card.append(image,body);cards.push(card);
  }
  document.getElementById('featured-tasks').replaceChildren(...cards);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){video.play().catch(()=>{});}
}
init().catch(()=>{disableLiveLinks(copy.retry);document.getElementById('featured-tasks').textContent=copy.taskError;const note=document.getElementById('deployment-note');note.hidden=false;note.classList.add('error');note.textContent=copy.retry;});
