(() => {
 const shell=document.getElementById('opening-sequence');
 if(!shell)return;
 const skip=document.getElementById('skip-opening');
 const replay=document.getElementById('replay-opening');
 const stage=document.getElementById('opening-stage');
 const timecode=document.getElementById('opening-timecode');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const page=[document.querySelector('.header'),document.querySelector('main'),document.querySelector('footer')];
 let frame=0,timer=0,started=0,running=false,returnFocus=null;
 const duration=3400;
 function remember(){try{sessionStorage.setItem('luz-opening-seen','1')}catch{}}
 function finish(){
  if(!running)return;
  running=false;window.luzIntroActive=false;cancelAnimationFrame(frame);clearTimeout(timer);remember();
  shell.classList.add('leaving');
  page.forEach(el=>el.inert=false);document.documentElement.classList.remove('opening-active');
  window.dispatchEvent(new Event('luz:intro-end'));
  setTimeout(()=>{shell.hidden=true;shell.classList.remove('leaving','playing');if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});else if(document.activeElement===skip){const main=document.getElementById('main');main.setAttribute('tabindex','-1');main.focus({preventScroll:true})}},450);
 }
 function update(now){
  if(!running)return;
  const elapsed=now-started,p=Math.min(1,elapsed/duration);
  shell.style.setProperty('--edit-progress',p);
  const frames=Math.min(81,Math.floor(elapsed/1000*24));timecode.textContent=`00:00:${String(Math.floor(frames/24)).padStart(2,'0')}:${String(frames%24).padStart(2,'0')}`;
  const phase=p<.33?'assemble':p<.68?'grade':p<.90?'finish':'reveal';
  if(shell.dataset.phase!==phase){shell.dataset.phase=phase;stage.textContent={assemble:'Assemble the story',grade:'Find the colour',finish:'Shape the final frame',reveal:'Welcome to Luz'}[phase]}
  if(p===1){finish();return}frame=requestAnimationFrame(update);
 }
 function start(manual=false){
  if(running)return;
  if(reduced.matches){remember();shell.hidden=true;window.dispatchEvent(new Event('luz:intro-end'));return}
  returnFocus=manual?replay:null;shell.hidden=false;shell.dataset.phase='assemble';shell.classList.remove('leaving');shell.style.setProperty('--edit-progress',0);
  document.documentElement.classList.add('opening-active');page.forEach(el=>el.inert=true);running=true;window.luzIntroActive=true;
  window.dispatchEvent(new Event('luz:intro-start'));skip.focus({preventScroll:true});
  started=performance.now();shell.classList.add('playing');frame=requestAnimationFrame(update);
  // An independent escape hatch prevents a stalled animation from blocking the page.
  timer=setTimeout(finish,4300);
 }
 skip.addEventListener('click',finish);replay.addEventListener('click',()=>start(true));
 document.addEventListener('keydown',e=>{if(!running)return;if(e.key==='Escape')finish();else if(e.key==='Tab'){e.preventDefault();skip.focus({preventScroll:true})}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)finish()});
 reduced.addEventListener('change',()=>{if(reduced.matches&&running)finish();replay.hidden=reduced.matches});
 replay.hidden=reduced.matches;
 let seen=false;try{seen=sessionStorage.getItem('luz-opening-seen')==='1'}catch{}
 if(!seen&&!location.hash&&!reduced.matches)start();else{shell.hidden=true;window.dispatchEvent(new Event('luz:intro-end'))}
})();
