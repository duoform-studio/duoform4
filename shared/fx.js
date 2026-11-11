(()=>{try{
const D=document,R=D.documentElement,$=(s,c=D)=>[...c.querySelectorAll(s)],clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine) and (hover:hover)').matches;
if(reduce)return;
const P=location.pathname,C={
 aurum:{c:'200,255,61',hex:'#c8ff3d',shape:'tor',tilt:'.car-card,.manifesto-visual'},
 beauty:{c:'217,164,160',hex:'#d9a4a0',shape:'ico',tilt:'.intro img,.manifesto img,.works img'},
 coffee:{c:'62,127,136',hex:'#3e7f88',shape:'tor',tilt:'.menu-card,.gallery-small,.visit-panel'},
 pole:{c:'234,69,1',hex:'#ea4501',shape:'ico',tilt:'.product,.review'}
}[(P.match(/\/(aurum|beauty|coffee|pole)\//)||[])[1]]||{c:'216,198,164',hex:'#d8c6a4',shape:'ico',tilt:'.card'};
R.style.setProperty('--fx',C.hex);
const mk=(t,c)=>{const e=D.createElement(t);if(c)e.className=c;return e};
/* back to studio */
const back=mk('a','fx-back');back.href='../index.html';back.textContent='← DUOFORM';back.setAttribute('aria-label','Вернуться на главную DUOFORM');D.body.appendChild(back);
/* progress */
const bar=mk('div','fx-progress');D.body.appendChild(bar);
/* parallax targets: media inside overflow-hidden frames */
const media=$('img,video').filter(m=>!m.closest('.modal,[role=dialog],.modal-backdrop,header,nav,.toast')&&m.parentElement&&getComputedStyle(m.parentElement).overflow==='hidden'&&getComputedStyle(m).position!=='fixed');
media.forEach(m=>{m.classList.add('fx-par');m.style.scale='1.1'});
/* tilt + glare */
const tiltEls=[...new Set($(C.tilt).map(e=>e.tagName==='IMG'?e.parentElement:e))];
if(fine)tiltEls.forEach(el=>{
 if(getComputedStyle(el).position==='static')el.style.position='relative';
 el.classList.add('fx-tilt');const sp=mk('span','fx-spot');sp.setAttribute('aria-hidden','true');el.appendChild(sp);
 el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  el.style.transition='transform .2s ease-out';el.style.transform=`perspective(900px) rotateX(${((.5-y)*7).toFixed(2)}deg) rotateY(${((x-.5)*9).toFixed(2)}deg) translateY(-4px)`;
  el.style.setProperty('--px',(x*100)+'%');el.style.setProperty('--py',(y*100)+'%')},{passive:true});
 el.addEventListener('pointerleave',()=>{el.style.transition='transform .6s cubic-bezier(.2,.7,.2,1)';el.style.transform='';setTimeout(()=>{el.style.transition=''},650)})});
/* magnetic buttons */
if(fine)$('.btn,.button,.primary,.round-link,.nav-cta,.submit-btn,.details-link').filter(b=>!b.classList.contains('magnetic')).forEach(b=>{
 b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${((e.clientX-r.left-r.width/2)*.12).toFixed(1)}px,${((e.clientY-r.top-r.height/2)*.18).toFixed(1)}px)`},{passive:true});
 b.addEventListener('pointerleave',()=>{b.style.transform=''})});
/* ambient layers: film grain + cursor bloom */
const grain=mk('div','fx-grain'),aura=mk('div','fx-aura');aura.style.setProperty('--fc',C.c);D.body.append(grain,aura);
const tc=mk('canvas');tc.id='fx-trail';tc.setAttribute('aria-hidden','true');if(fine)D.body.appendChild(tc);const tx=tc.getContext('2d');
let W,H,sy=scrollY,px=-99,py=-99,rx=-99,ry=-99,ax=-99,ay=-99,trail=[],on=false,run=true;
const cur=mk('div','fx-cur');cur.setAttribute('aria-hidden','true');cur.innerHTML='<svg width="0" height="0" style="position:absolute"><filter id="fxgoo" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"/></filter></svg><div class="fx-goo"><i></i><i></i><i></i><i></i></div>';if(fine)D.body.appendChild(cur);
const orbs=$('.fx-goo i',cur),gooEl=$('.fx-goo',cur)[0],OR=[0,1,2,3].map(()=>({x:0,y:0}));let hs=1;
function size(){W=innerWidth;H=innerHeight;const d=Math.min(devicePixelRatio||1,1.5);tc.width=W*d;tc.height=H*d;tx.setTransform(d,0,0,d,0,0);}
size();let lw=innerWidth;addEventListener('resize',()=>{if(innerWidth!==lw){lw=innerWidth;size()}});
function loop(t){if(!run)return;
 if(fine){const n=performance.now();tx.clearRect(0,0,W,H);while(trail.length&&n-trail[0].t>600)trail.shift();
  tx.globalCompositeOperation='lighter';for(let i=0;i<trail.length;i++){const q=trail[i],k=1-(n-q.t)/600,r=8+k*30,g=tx.createRadialGradient(q.x,q.y,0,q.x,q.y,r);g.addColorStop(0,`rgba(${C.c},${(k*.28).toFixed(3)})`);g.addColorStop(1,`rgba(${C.c},0)`);tx.fillStyle=g;tx.fillRect(q.x-r,q.y-r,r*2,r*2)}tx.globalCompositeOperation='source-over';
  rx+=(px-rx)*.18;ry+=(py-ry)*.18;ax+=(px-ax)*.08;ay+=(py-ay)*.08;aura.style.setProperty('--ax',ax+'px');aura.style.setProperty('--ay',ay+'px');hs+=((R.classList.contains('fx-hot')?2.4:1)-hs)*.14;let lx=px,ly=py;orbs.forEach((o,i)=>{const c=OR[i],k=[.55,.3,.19,.12][i];c.x+=(lx-c.x)*k;c.y+=(ly-c.y)*k;lx=c.x;ly=c.y;o.style.transform=`translate3d(${(c.x-px+200).toFixed(1)}px,${(c.y-py+200).toFixed(1)}px,0) translate(-50%,-50%) scale(${i?1:hs.toFixed(3)})`});gooEl.style.transform=`translate3d(${px-200}px,${py-200}px,0)`}
 requestAnimationFrame(loop)}
requestAnimationFrame(loop);D.addEventListener('visibilitychange',()=>{run=!D.hidden;if(run)requestAnimationFrame(loop)});
if(fine){addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;trail.push({x:px,y:py,t:performance.now()});if(trail.length>36)trail.shift();
  if(!on){on=true;R.classList.add('fx-on');rx=px;ry=py;ax=px;ay=py;OR.forEach(c=>{c.x=px;c.y=py})}},{passive:true});
 D.addEventListener('pointerleave',()=>{on=false;R.classList.remove('fx-on')});
 D.addEventListener('pointerover',e=>R.classList.toggle('fx-hot',!!e.target.closest('a,button,[role=button],input,textarea,select,summary,.car-card,.product,.menu-card')))}
/* scroll: progress + parallax */
let tk=false;
function onScroll(){tk=false;sy=scrollY;const m=document.documentElement.scrollHeight-innerHeight;bar.style.width=(m>0?sy/m*100:0)+'%';
 media.forEach(el=>{const f=el.parentElement,r=f.getBoundingClientRect();if(r.bottom<-80||r.top>innerHeight+80)return;const amp=Math.min(r.height*.045,34);el.style.translate='0 '+(-((r.top+r.height/2-innerHeight/2)/innerHeight)*amp*2).toFixed(1)+'px'})}
addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
}catch(e){console.warn('fx',e)}})();
