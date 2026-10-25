'use strict';
const fanCaption='风扇装配研究展示 · 全景 / 工件近景 · 3 倍速剪辑。20 类计分任务见下方任务目录。';
const scenes={
  overview:{label:'多机器人协作 · 2,000 条轨迹总览',asset:'collaboration-overview',ratio:'16 / 9',caption:'84 秒协作总览 · 20 类任务、2,000 条不同训练轨迹与 3 套风扇装配研究展示。约 216 路视频同屏持续滚动，呈现多种机器人组合与协作场景。'},
  heterogeneous:{label:'异构十机器人 · 风扇装配',asset:'fan-heterogeneous'},
  isomorphic:{label:'同构十机器人 · 风扇装配',asset:'fan-isomorphic'},
  humanoid:{label:'含人形机器人 · 十机器人风扇装配',asset:'fan-humanoid'}
};
const video=document.getElementById('hero-video');
let sceneToken=0;
async function chooseScene(name,play=false){
  if(!Object.hasOwn(scenes,name))return;
  const token=++sceneToken;
  const scene=scenes[name];
  video.pause();video.poster=`assets/${scene.asset}.jpg`;video.src=`assets/${scene.asset}.mp4`;video.style.aspectRatio=scene.ratio||'8 / 3';video.load();
  document.getElementById('demo-label').textContent=scene.label;video.setAttribute('aria-label',scene.label+'精选录像');
  document.getElementById('demo-caption').textContent=scene.caption||fanCaption;
  document.getElementById('demo-download').href=`assets/${scene.asset}.mp4`;
  document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scene===name)));
  if(play&&token===sceneToken){try{await video.play();}catch(_){/* Playback controls remain available when autoplay is restricted. */}}
}
document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>chooseScene(b.dataset.scene,true)));
let resumeAfterHidden=false;
document.addEventListener('visibilitychange',()=>{if(document.hidden){resumeAfterHidden=!video.paused;video.pause();}else if(resumeAfterHidden){resumeAfterHidden=false;video.play().catch(()=>{});}});
function safeURL(value){if(value===null)return null;if(typeof value!=='string'||!/^https?:\/\//.test(value)||/[\s\\]/.test(value))throw Error('项目链接暂时无法打开');const u=new URL(value);if(u.username||u.password||u.search||u.hash||!(u.protocol==='https:'||(u.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(u.hostname))))throw Error('项目链接暂时无法打开');return u;}
async function json(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error(`无法读取项目资料（${r.status}）`);return r.json();}
function disableLiveLinks(message){document.querySelectorAll('[data-live-path]').forEach(a=>{a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.title=message;});}
disableLiveLinks('线上测评服务即将上线');
async function init(){
  const config=await json('project-config.json');
  if(config.brand!=='Multidojo²'||!['local','static'].includes(config.deployment))throw Error('项目配置版本不符');
  const official=safeURL(config.official_site_url),github=safeURL(config.github_url),service=safeURL(config.live_benchmark_url);
  if(official){const canonical=document.createElement('link');canonical.rel='canonical';canonical.href=official.href;document.head.append(canonical);}
  if(github){document.querySelectorAll('[data-github]').forEach(a=>{a.href=github.href;a.hidden=false;a.target='_blank';a.rel='noopener';});document.querySelectorAll('[data-github-pending]').forEach(a=>a.hidden=true);}
  const live=config.deployment==='local'||Boolean(service);
  function redirectLegacy(){if(!['#tasks','#leaderboard','#submit'].includes(location.hash)||!live)return false;const target=service?new URL('leaderboard.html'+location.hash,service.href.endsWith('/')?service.href:service.href+'/').href:'leaderboard.html'+location.hash;location.replace(target);return true;}
  addEventListener('hashchange',redirectLegacy);if(redirectLegacy())return;
  for(const a of document.querySelectorAll('[data-live-path]')){
    if(!live){a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.title='线上测评服务即将上线';}
    else{const base=service?(service.href.endsWith('/')?service.href:service.href+'/'):location.href;a.href=new URL(a.dataset.livePath,base).href;a.removeAttribute('aria-disabled');a.removeAttribute('title');}
  }
  if(config.deployment==='static'){const note=document.getElementById('deployment-note');note.hidden=live;note.textContent=live?'':'线上测评服务即将上线。';}
  const payload=config.deployment==='static'?await json('featured-tasks.json'):await Promise.all([json('/api/catalog'),json('/api/showcase')]).then(([catalog,show])=>({tasks:catalog.tasks.filter(t=>[0,2,5,9,14,15].includes(t.number)).map(t=>({...t,poster:show.previews.find(p=>p.number===t.number)?.poster}))}));
  const grid=document.getElementById('featured-tasks');grid.replaceChildren();
  for(const task of payload.tasks){const card=document.createElement('article');card.className='featured-task';const image=document.createElement('img');image.src=task.poster;image.alt=task.title+'自然桌面示范';image.loading='lazy';image.width=640;image.height=480;const body=document.createElement('div'),label=document.createElement('small'),title=document.createElement('h3');label.textContent=`TASK ${String(task.number).padStart(2,'0')} / ${task.task.includes('OctaArm')?8:task.task.includes('QuadArm')?4:task.task.includes('TripleArm')?3:2} ARMS`;title.textContent=task.title;body.append(label,title);card.append(image,body);grid.append(card);}
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){video.play().catch(()=>{});}
}
init().catch(()=>{disableLiveLinks('页面加载遇到问题，请刷新重试');document.getElementById('featured-tasks').textContent='任务示范加载失败，请刷新重试。';const note=document.getElementById('deployment-note');note.hidden=false;note.classList.add('error');note.textContent='页面加载遇到问题，请稍后重试。';});
