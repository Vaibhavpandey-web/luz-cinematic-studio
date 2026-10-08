(() => {
 const $ = (s) => document.querySelector(s);
 const menu = $('.menu-toggle'), nav = $('#navigation');
 function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape' && nav.classList.contains('open')){closeMenu();menu.focus()}});
 function readingProgress(){document.documentElement.style.setProperty('--reading-progress',String(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));}
 window.addEventListener('scroll',readingProgress,{passive:true});readingProgress();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches, animations=[];
 function syncMotion(){document.documentElement.classList.toggle('motion-paused',paused);$('#motion-toggle').setAttribute('aria-pressed',String(paused));$('#motion-toggle').innerHTML=paused?'<span aria-hidden="true">▶</span> Resume motion':'<span aria-hidden="true">Ⅱ</span> Pause motion';window.luzMotionPaused=paused;window.dispatchEvent(new CustomEvent('luz:motion',{detail:{paused}}));if(paused){animations.forEach(a=>a.progress(1));}}
 $('#motion-toggle').addEventListener('click',()=>{paused=!paused;syncMotion()});reduced.addEventListener('change',()=>{paused=reduced.matches;syncMotion()});syncMotion();
 if(window.gsap && window.ScrollTrigger && !paused){
  gsap.registerPlugin(ScrollTrigger);
  const revealHero=()=>animations.push(gsap.from('.hero-copy h1',{y:34,opacity:0,duration:1.6,ease:'power3.out',clearProps:'all'}));
  if(window.luzIntroActive)window.addEventListener('luz:intro-end',revealHero,{once:true});else revealHero();
  document.querySelectorAll('.intro h2,.section-heading h2,.model-head,.model-grid article').forEach(el=>animations.push(gsap.from(el,{scrollTrigger:{trigger:el,start:'top 92%',once:true},y:40,opacity:0,duration:1.05,ease:'power2.out',clearProps:'all'})));
 }
 document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
  document.querySelectorAll('.work-card').forEach(card=>{card.hidden=filter!=='all' && card.dataset.category!==filter});
  $('.work-grid').classList.toggle('filtered',filter!=='all');window.ScrollTrigger?.refresh();
 }));
 const concepts={film:{title:'The art of the frame',image:'assets/visual-3.webp',alt:'Cinematic studio and editing timeline',description:'A visual concept for the connected production process: from the camera and lighting on set to the rhythm of an edit and the final sound mix. Luz brings production and post-production together under one creative direction.'},fashion:{title:'Beyond the ordinary',image:'assets/visual-5.webp',alt:'Fashion silhouettes in an imaginative studio',description:'An exploration of fashion, atmosphere and visual identity. Art direction, model-led production and social-first storytelling come together to build a world around a brand.'},cgi:{title:'Reality, reimagined',image:'assets/visual-2.webp',alt:'Sculptural surfaces in a CGI environment',description:'A concept exploring form, material and the possibilities of advanced visuals. 3D design, CGI, motion and visual effects open up stories that would be difficult to capture with a camera alone.'},digital:{title:'Made for a moving world',image:'assets/visual-7.webp',alt:'Digital screens radiating from a point of light',description:'A visual exploration of connected digital storytelling. Campaign narratives, brand systems and social-first content help an idea move coherently across screens and platforms.'}};
 let activeOpener=null;
 function openDialog(dialog,opener){activeOpener=opener;dialog.showModal();document.body.classList.add('dialog-open')}
 document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const item=concepts[button.dataset.project];$('#dialog-title').textContent=item.title;$('#dialog-description').textContent=item.description;$('#dialog-image').src=item.image;$('#dialog-image').alt=item.alt;openDialog($('#project-dialog'),button)}));
 document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');if(dialog.id==='video-dialog')$('#video-container').replaceChildren();activeOpener?.focus()})});
 $('#dialog-contact').addEventListener('click',()=>{$('#project-dialog').close();setTimeout(()=>$('#project-form input').focus({preventScroll:true}),100)});
 $('#watch-film').addEventListener('click',()=>{const iframe=document.createElement('iframe');iframe.src='https://www.youtube-nocookie.com/embed/TZzAK-QlBss?autoplay=1&rel=0';iframe.title='Luz studio film';iframe.allow='autoplay; encrypted-media; picture-in-picture';iframe.allowFullscreen=true;$('#video-container').replaceChildren(iframe);openDialog($('#video-dialog'),$('#watch-film'))});
 $('#project-form').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;const data=new FormData(form);const name=String(data.get('name')).trim(), brief=String(data.get('brief')).trim();if(!name||brief.length<10){$('#form-status').textContent='Please add your name and at least 10 characters about your project.';return}const text=`Hello Luz! I’d like to discuss a project.\n\nName: ${name}\nEmail: ${String(data.get('email')).trim()}\n${data.get('phone')?'Phone: '+String(data.get('phone')).trim()+'\n':''}Interest: ${data.get('service')}\n\n${brief}`;const url='https://wa.me/917490808848?text='+encodeURIComponent(text);window.open(url,'_blank','noopener,noreferrer');$('#form-status').replaceChildren();const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open your WhatsApp draft';link.style.textDecoration='underline';$('#form-status').append('Your brief is ready. Nothing has been sent. ',link);});
 $('#year').textContent=new Date().getFullYear();
})();
