import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { DRACOLoader } from './DRACOLoader.js';
const canvas=document.getElementById('scene'),host=document.getElementById('hero-art');
try {
 const mobile=()=>window.innerWidth<700;
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile(),powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile()?1.35:1.65));renderer.setClearColor(0x080808,1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,80);camera.position.set(0,0,12);
 scene.add(new THREE.AmbientLight(0xced0cd,.55));
 const key=new THREE.DirectionalLight(0xffffff,1.5);key.position.set(-3,6,5);scene.add(key);
 const rim=new THREE.PointLight(0xf0f4ec,35,24,2);rim.position.set(5,2,3);scene.add(rim);
 const fill=new THREE.DirectionalLight(0xd4d8d5,1.1);fill.position.set(-5,-2,2);scene.add(fill);
 const back=new THREE.PointLight(0xffffff,45,24,2);back.position.set(-4,4,-2);scene.add(back);
 // Studio softboxes supply real reflections on the metallic lens ribs.
 const environment=new THREE.Scene();environment.background=new THREE.Color(0x101111);
 function softbox(w,h,x,y,z,power){const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(power,power,power),side:THREE.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,0,0);environment.add(panel)}
 softbox(3,12,-5,2,4,5);softbox(1.2,10,6,0,1,8);softbox(9,1.5,0,6,2,4);softbox(3,6,1,-4,-5,1.3);
 const pmrem=new THREE.PMREMGenerator(renderer);const studioMap=pmrem.fromScene(environment,.06);scene.environment=studioMap.texture;pmrem.dispose();environment.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});
 // Low-contrast volumetric-looking studio light, rendered behind the geometry.
 const haze=new THREE.Mesh(new THREE.PlaneGeometry(38,28),new THREE.ShaderMaterial({depthWrite:false,uniforms:{uTime:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 vUv;uniform float uTime;float beam(float center,float width){float distance=abs(vUv.x-center);return exp(-distance*distance/width);}void main(){float y=vUv.y;float a=beam(.25+(1.-y)*.29,.001+(1.-y)*.025);float b=beam(.78-(1.-y)*.22,.001+(1.-y)*.016);float variation=.88+.12*sin(y*13.+uTime*.09);float light=(a*.065+b*.045)*pow(y,1.7)*variation;gl_FragColor=vec4(vec3(.017)+vec3(light),1.);}' }));haze.position.z=-12;scene.add(haze);
 // Textured Camera 01 model, Rajil Jose Macatangay / Poly Haven (CC0).
 const sculpture=new THREE.Group();scene.add(sculpture);
 const materials=new Map();let modelReady=false;
 const draco=new DRACOLoader();draco.setDecoderPath('./');draco.setDecoderConfig({type:'wasm'});draco.setWorkerLimit(1);
 const loader=new GLTFLoader();loader.setDRACOLoader(draco);
 loader.load('./real-camera.glb',gltf=>{
  const model=gltf.scene;model.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(model),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
  const pivot=new THREE.Group();model.position.sub(center);pivot.add(model);pivot.scale.setScalar(4.6/size.x);sculpture.add(pivot);
  model.traverse(o=>{if(!o.isMesh)return;const list=Array.isArray(o.material)?o.material:[o.material];list.forEach(m=>{
   m.envMapIntensity=.85;
   for(const k of ['map','normalMap','roughnessMap','metalnessMap'])if(m[k])m[k].anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
   if(m.name==='Camera_01_lens'){m.transmission=.22;m.roughness=.075;m.metalness=.12;m.ior=1.52;m.thickness=.02;m.color.setHex(0x8ba6a9);}
   materials.set(m,{opacity:m.opacity,transparent:m.transparent,depthWrite:m.depthWrite});
  })});
  modelReady=true;compose();host.classList.add('scene-loaded');draco.dispose();
 },undefined,error=>{console.info('Camera image fallback active:',error.message);draco.dispose();});
 // A ribbed optical structure: an original CGI interpretation of a cinema lens.
 const lensWorld=new THREE.Group();scene.add(lensWorld);
 const ribMaterial=new THREE.MeshStandardMaterial({color:0x777b79,metalness:1,roughness:.2,envMapIntensity:1.35,transparent:true});
 const ribCount=mobile()?104:148;
 const shape=new THREE.Shape();shape.moveTo(-.49,-.037);shape.lineTo(.49,-.037);shape.lineTo(.49,.037);shape.lineTo(-.49,.037);shape.closePath();
 const ribGeometry=new THREE.ExtrudeGeometry(shape,{depth:.68,bevelEnabled:true,bevelSegments:2,bevelSize:.025,bevelThickness:.025,steps:1});ribGeometry.center();
 const ribs=new THREE.InstancedMesh(ribGeometry,ribMaterial,ribCount);ribs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);lensWorld.add(ribs);
 const helper=new THREE.Object3D();
 for(let i=0;i<ribCount;i++){const angle=i/ribCount*Math.PI*2;helper.position.set(Math.cos(angle)*3.65,Math.sin(angle)*3.65,Math.sin(angle*2)*.17);helper.rotation.set(0,0,angle);helper.rotateY(Math.sin(angle)*.24);helper.scale.set(1,1,1);helper.updateMatrix();ribs.setMatrixAt(i,helper.matrix)}ribs.instanceMatrix.needsUpdate=true;
 const railMaterial=new THREE.MeshStandardMaterial({color:0x373b38,metalness:1,roughness:.23,envMapIntensity:1.6,transparent:true});
 const railMesh=new THREE.Mesh(new THREE.TorusGeometry(3.65,.055,10,128),railMaterial);railMesh.position.z=-.36;lensWorld.add(railMesh);
 const particleGeometry=new THREE.BufferGeometry();const positions=[];for(let i=0;i<85;i++){positions.push(Math.sin(i*15.43)*9,Math.cos(i*5.71)*6,-2-(i%7))}particleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
 const particles=new THREE.Points(particleGeometry,new THREE.PointsMaterial({color:0xd2d7cd,size:.012,transparent:true,opacity:.3,depthWrite:false}));scene.add(particles);
 const stages=[
  {id:'.hero',x:0,y:-4.0,z:-1.7,rx:.06,ry:.09,rz:.05,s:1.35,a:.42,cx:0,cy:-1.5,cs:.95,ca:1},
  {id:'.intro',x:4.4,y:0,z:-2.2,rx:.3,ry:.9,rz:1.2,s:1.22,a:.82,cx:4.2,cy:-.5,cs:.48,ca:.5},
  {id:'.work',x:4.1,y:-.6,z:-4,rx:1.2,ry:1.7,rz:2.6,s:1.3,a:.2,cx:5,cy:0,cs:.4,ca:0},
  {id:'.services',x:4.4,y:0,z:-2.8,rx:.6,ry:1.3,rz:3.4,s:1.5,a:.4,cx:5,cy:0,cs:.4,ca:0},
  {id:'.statement',x:0,y:-.25,z:-4,rx:.5,ry:.1,rz:4.3,s:1.3,a:.85,cx:0,cy:-.5,cs:.5,ca:0},
  {id:'.model',x:4.5,y:-1,z:-3,rx:.4,ry:1.3,rz:5.5,s:1.4,a:.28,cx:4,cy:-.6,cs:.4,ca:0},
  {id:'.contact',x:-3.1,y:0,z:-3,rx:.3,ry:.65,rz:6.6,s:1.1,a:.72,cx:-3.3,cy:0,cs:.43,ca:.18},
  {id:'footer',x:0,y:-3,z:-4,rx:.1,ry:.4,rz:7,s:1.3,a:.32,cx:0,cy:0,cs:.4,ca:0}
 ];
 let width=0,height=0,paused=window.luzMotionPaused??matchMedia('(prefers-reduced-motion: reduce)').matches,raf=0,time=0,last=0,targetX=0,targetY=0,scrollTarget=scrollY,scrollCurrent=scrollY,offsets=[];
 function measure(){offsets=stages.map(s=>document.querySelector(s.id).getBoundingClientRect().top+scrollY);}
 function transition(){let index=0;while(index<stages.length-2&&scrollCurrent>=offsets[index+1])index++;const next=index+1;let t=THREE.MathUtils.clamp((scrollCurrent-offsets[index])/(offsets[next]-offsets[index]||1),0,1);t=t*t*(3-2*t);const a=stages[index],b=stages[next];const state={};for(const k of ['x','y','z','rx','ry','rz','s','a','cx','cy','cs','ca'])state[k]=THREE.MathUtils.lerp(a[k],b[k],t);return state;}
 function compose(){const v=transition(),isMobile=mobile();lensWorld.position.set(v.x*(isMobile?.56:1),v.y,v.z);lensWorld.rotation.set(v.rx+targetY*.025,v.ry+targetX*.045,v.rz+time*.032);lensWorld.scale.setScalar(v.s*(isMobile?.72:1));ribMaterial.opacity=v.a;railMaterial.opacity=v.a;
 sculpture.position.set(v.cx*(isMobile?.45:1),v.cy-(isMobile?.65:Math.max(0,850-height)/500)+(paused?0:Math.sin(time*.6)*.05),.25);sculpture.scale.setScalar(v.cs*(isMobile?.79:1));sculpture.rotation.set(.12+targetY*.065,-.38+targetX*.13+Math.sin(time*.2)*.04,-.025);materials.forEach((original,m)=>{const transparent=original.transparent||v.ca<.995;if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true;}m.opacity=original.opacity*v.ca;m.depthWrite=original.depthWrite&&v.ca>.65;});sculpture.visible=modelReady&&v.ca>.005;
 haze.material.uniforms.uTime.value=time;particles.rotation.z=time*.003;renderer.render(scene,camera);}
 function resize(){width=host.clientWidth;height=host.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.position.z=mobile()?14:12;camera.updateProjectionMatrix();measure();compose();}
 function animate(now){raf=0;if(paused||document.hidden)return;const delta=last?Math.min((now-last)/1000,.05):.016;last=now;time+=delta;scrollCurrent+=(scrollTarget-scrollCurrent)*Math.min(1,delta*7);compose();raf=requestAnimationFrame(animate);}
 function start(){if(!raf&&!paused&&!document.hidden){last=0;raf=requestAnimationFrame(animate);}}
 window.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&!paused){targetX=e.clientX/window.innerWidth*2-1;targetY=e.clientY/window.innerHeight*2-1}},{passive:true});
 window.addEventListener('scroll',()=>{scrollTarget=scrollY;if(paused){scrollCurrent=scrollTarget;compose()}},{passive:true});
 window.addEventListener('luz:motion',e=>{paused=e.detail.paused;if(paused){cancelAnimationFrame(raf);raf=0;scrollCurrent=scrollTarget;compose()}else start()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else start()});
 new ResizeObserver(resize).observe(host);new ResizeObserver(()=>{measure();if(paused)compose()}).observe(document.body);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;host.classList.remove('scene-loaded')});canvas.addEventListener('webglcontextrestored',()=>{resize();host.classList.add('scene-loaded');start()});
 resize();start();
} catch(error) {host.classList.remove('scene-loaded');console.info('Static visual active:',error.message)}
