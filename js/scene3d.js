
(async function(){
  'use strict';
  const B=window.N01Bridge;
  if(!B)return;
  const stage=document.getElementById('bar-scene'),shell=document.getElementById('scene-holder');
  if(!stage||!shell)return;
  let THREE;
  try{THREE=await import('https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js')}
  catch(error){console.warn('3D engine could not load',error);return;}
  let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:true})}
  catch(error){console.warn('WebGL unavailable',error);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.18;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.className='n01-webgl';
  renderer.domElement.setAttribute('aria-label','可拖动酒杯、倾倒酒液的三维调酒场景');
  stage.appendChild(renderer.domElement);
  stage.classList.add('has-3d');
  document.documentElement.classList.add('n01-3d-ready');
  const scene=new THREE.Scene();scene.background=new THREE.Color('#101113');
  const camera=new THREE.PerspectiveCamera(37,1,.1,80);
  const target=new THREE.Vector3(0,2.13,1.1);
  let yaw=0,zoom=10.4,roomW=1080,roomH=610;
  const look=()=>{camera.position.set(Math.sin(yaw)*zoom,3.65,Math.cos(yaw)*zoom+1.6);camera.lookAt(target)};
  look();
  const ambience=new THREE.HemisphereLight(0xa5b2c3,0x17181b,2.05);scene.add(ambience);
  const fill=new THREE.DirectionalLight(0xe8eef9,2.35);fill.position.set(-3,8,6);fill.castShadow=true;fill.shadow.mapSize.set(1024,1024);fill.shadow.camera.left=-9;fill.shadow.camera.right=9;fill.shadow.camera.top=8;fill.shadow.camera.bottom=-8;scene.add(fill);
  const rimLight=new THREE.PointLight(0xc4d4ee,60,16);rimLight.position.set(3.7,4.8,1.5);scene.add(rimLight);
  const shelfLight=new THREE.PointLight(0xffe2bf,18,10);shelfLight.position.set(-1.4,4.6,-2.6);scene.add(shelfLight);
  const makeMat=(col,metal=0,rough=.7)=>new THREE.MeshStandardMaterial({color:col,metalness:metal,roughness:rough});
  const stone=makeMat('#2e3135',.13,.24),wall=makeMat('#181b1e',.1,.75),wood=makeMat('#1b1d1f',.15,.5),metal=makeMat('#555a62',.78,.2);
  const obj=(geom,mat,pos,shadow=true)=>{const o=new THREE.Mesh(geom,mat);o.position.set(...pos);o.castShadow=shadow;o.receiveShadow=true;scene.add(o);return o};
  const cube=(w,h,d,mat,x,y,z,shadow=true)=>obj(new THREE.BoxGeometry(w,h,d),mat,[x,y,z],shadow);
  cube(30,.06,30,makeMat('#141619'),0,-.12,0,false);
  cube(13,8,.18,wall,0,3.45,-4.7,false);
  for(let i=0;i<39;i++){const x=-6.55+i*.345;cube(.034,6,.12,i%4===0?makeMat('#292d32',.14,.6):wood,x,3.15,-4.47,false)}
  for(const x of [-6.5,6.5])cube(.22,7,8,makeMat('#171a1e'),x,3,-.5,false);
  const shelfMat=makeMat('#363a3d',.57,.29);
  for(const h of [2.18,3.2,4.27]){cube(9.4,.105,.73,shelfMat,0,h,-3.93);const bar=cube(9.25,.017,.045,new THREE.MeshBasicMaterial({color:'#e5d8c8'}),0,h-.055,-3.51,false)}
  const counter=cube(11.8,.42,2.9,stone,0,1.02,2.37);
  cube(11.2,1.15,2.15,makeMat('#191c1f',.14,.7),0,.24,2.55);
  const edge=cube(11.8,.025,2.9,makeMat('#5a5e61',.42,.25),0,1.25,2.37);
  const veining=new THREE.MeshBasicMaterial({color:'#b6bbc2',transparent:true,opacity:.13});
  for(let i=0;i<13;i++){const a=-5.6+i*.88;const mesh=cube(.008,.004,2.65,veining,a,1.269,2.35,false);mesh.rotation.y=(i%4-2)*.21}
  const glowy=new THREE.MeshBasicMaterial({color:'#e8edf7',transparent:true,opacity:.42});
  for(let i=0;i<4;i++)cube(1.2,.015,.025,glowy,-4.1+i*2.65,5.15,-3.5,false);
  const labelTexture=(name)=>{const c=document.createElement('canvas');c.width=256;c.height=160;const x=c.getContext('2d');x.fillStyle='#14191e';x.fillRect(0,0,256,160);x.strokeStyle='#646d79';x.lineWidth=3;x.strokeRect(8,8,240,144);x.fillStyle='#f1eee8';x.font='23px Georgia';x.textAlign='center';x.fillText(name.substring(0,17),128,73);x.fillStyle='#9cabbc';x.font='15px sans-serif';x.fillText('N° 01   /   RESERVE',128,110);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t};
  const bottleMeshes=[];
  function makeBottle(d,x,y,z,size=.77,selectable=true){
    const group=new THREE.Group();group.position.set(x,y,z);group.scale.setScalar(size);
    const color=new THREE.Color(d.color||'#b7c1c9');
    const body=new THREE.Mesh(new THREE.CylinderGeometry(d.shape==='square'?.22:.195,d.shape==='square'?.22:.195,.82,12),new THREE.MeshPhysicalMaterial({color:color,transparent:true,opacity:.87,roughness:.11,metalness:.07,clearcoat:.8}));
    body.position.y=.49;body.castShadow=true;group.add(body);
    const shoulder=new THREE.Mesh(new THREE.CylinderGeometry(.09,.18,.17,12),new THREE.MeshPhysicalMaterial({color:color,roughness:.17,transparent:true,opacity:.83}));shoulder.position.y=.98;group.add(shoulder);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(.083,.083,.27,14),new THREE.MeshStandardMaterial({color:'#40454a',metalness:.48,roughness:.25}));neck.position.y=1.19;group.add(neck);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.12,12),metal);cap.position.y=1.34;group.add(cap);
    const tag=new THREE.Mesh(new THREE.PlaneGeometry(.37,.31),new THREE.MeshBasicMaterial({map:labelTexture(d.name),side:THREE.DoubleSide}));tag.position.set(0,.53,.224);group.add(tag);
    group.traverse(o=>{if(o.isMesh){o.userData.drink=d.id;if(selectable)bottleMeshes.push(o)}});
    scene.add(group);return group;
  }
  const shelfItems=B.DRINKS.filter(d=>d.cat==='spirit'||d.cat==='liqueur').slice(0,16);
  shelfItems.forEach((d,i)=>makeBottle(d,-4.15+(i%8)*1.18, i<8?3.25:2.23,-3.88,.77,true));
  for(const x of [-4.9,4.9]){cube(.08,5,.08,metal,x,2.45,-3.48,false)}
  const smallLight=new THREE.PointLight(0xbacbdb,16,7);smallLight.position.set(0,5,2.2);scene.add(smallLight);
  const glassMaterial=new THREE.MeshPhysicalMaterial({color:'#e6f3fa',metalness:0,roughness:.045,transmission:.86,thickness:.18,ior:1.47,transparent:true,opacity:.74,side:THREE.DoubleSide,clearcoat:1,clearcoatRoughness:.03});
  const glassEdge=new THREE.MeshPhysicalMaterial({color:'#f3faff',roughness:.06,transmission:.4,thickness:.1,transparent:true,opacity:.82});
  const iceMaterial=new THREE.MeshPhysicalMaterial({color:'#eaf7ff',metalness:0,roughness:.13,transmission:.45,thickness:.25,transparent:true,opacity:.8,flatShading:true});
  const specs={
    rocks:['low',.50,.91,.12],highball:['tall',.38,1.52,.1],martini:['cone',.60,.85,.58],coupe:['wide',.65,.62,.68],
    doubleRocks:['low',.62,.98,.12],collins:['tall',.37,1.74,.07],nicknora:['bowl',.43,.70,.65],flute:['flute',.28,1.15,.72],
    tulip:['tulip',.40,.99,.57],snifter:['snifter',.59,.92,.34],cordial:['bowl',.32,.50,.52],shot:['low',.27,.54,.03],
    margarita:['wide',.68,.78,.62],hurricane:['hourglass',.46,1.4,.25],pilsner:['tall',.42,1.75,.12],irish:['tall',.42,1.3,.13],
    wine:['snifter',.48,.86,.62],saucer:['wide',.73,.43,.65],goblet:['snifter',.53,.91,.60],tiki:['tall',.49,1.56,.02],
    julep:['low',.50,1.12,.02],sling:['tall',.44,1.74,.05],fizz:['tall',.38,1.18,.02],sour:['bowl',.46,.62,.62]
  };
  const ordered=Object.keys(B.GLASSES);
  let activeId=B.state.session.glass&&B.GLASSES[B.state.session.glass]?B.state.session.glass:'rocks';
  if(!B.state.session.glass)B.state.session.glass=activeId;
  const glassAnchor=new THREE.Group();glassAnchor.position.set(.2,1.30,3.15);scene.add(glassAnchor);
  let drinkGroup=null,liquidMesh=null,liquidSurface=null,surfaceBase=null,iceMeshes=[],flowerMeshes=[],form={radius:.5,bottom:.45,height:.9,stem:.1,base:.0},mode='glass',heldBottle=null,heldId=null,spoon=null,gesture=null,swirl=0,ripple=0,visualPour=0,transfer=null;
  function shapeAt(t,id=activeId){const spec=specs[id]||specs.rocks;let [shape,r,h,stem]=spec;let radius=r;
    if(shape==='cone')radius=.07+(r-.07)*t;
    if(shape==='wide')radius=r*(.78+.22*Math.sin(t*Math.PI*.72));
    if(shape==='snifter')radius=r*(.40+.63*Math.sin(t*Math.PI*.72));
    if(shape==='bowl')radius=r*(.26+.79*Math.sin(t*Math.PI*.82));
    if(shape==='flute')radius=r*(.54+.48*Math.sin(t*Math.PI*.83));
    if(shape==='tulip')radius=r*(.50+.55*Math.sin(t*Math.PI*.74));
    if(shape==='hourglass')radius=r*(.76+.23*Math.cos(t*Math.PI*2));
    if(shape==='tall')radius=r*(.86+.14*t);
    if(shape==='low')radius=r*(.92+.08*t);
    return radius;
  }
  function buildGlass(){
    if(drinkGroup){glassAnchor.remove(drinkGroup);drinkGroup.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material!==glassMaterial&&o.material!==glassEdge&&o.material!==iceMaterial&&!Array.isArray(o.material))o.material.dispose()})}
    activeId=B.state.session.glass||'rocks';
    const [shape,r,h,stem]=specs[activeId]||specs.rocks;
    form={shape,radius:r,height:h,stem,bottom:shapeAt(0,activeId),top:shapeAt(1,activeId)};
    drinkGroup=new THREE.Group();glassAnchor.add(drinkGroup);
    if(stem>.22){
      const foot=new THREE.Mesh(new THREE.CylinderGeometry(r*.71,r*.78,.055,48),glassMaterial);foot.position.y=.045;drinkGroup.add(foot);
      const leg=new THREE.Mesh(new THREE.CylinderGeometry(.06,.082,stem-.06,24),glassMaterial);leg.position.y=stem/2+.02;drinkGroup.add(leg);
    }
    const profile=[new THREE.Vector2(0,stem+.015),new THREE.Vector2(shapeAt(0,activeId)*.93,stem+.015)];
    for(let i=0;i<=40;i++){const t=i/40;profile.push(new THREE.Vector2(shapeAt(t,activeId),stem+.04+h*t))}
    const inner=profile.slice(-1)[0];profile.push(new THREE.Vector2(inner.x-.027,inner.y-.006));
    for(let i=40;i>=0;i--){const t=i/40;profile.push(new THREE.Vector2(Math.max(.03,shapeAt(t,activeId)-.027),stem+.04+h*t))}
    const walls=new THREE.Mesh(new THREE.LatheGeometry(profile,100),glassMaterial);walls.castShadow=true;walls.receiveShadow=true;drinkGroup.add(walls);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(form.top,.012,8,96),glassEdge);ring.rotation.x=Math.PI/2;ring.position.y=stem+.04+h;drinkGroup.add(ring);
    const glint=new THREE.Mesh(new THREE.CylinderGeometry(.013,.013,h*.79,8),new THREE.MeshBasicMaterial({color:'#e8f3ff',transparent:true,opacity:.16}));glint.position.set(-r*.89,stem+h*.48,.08);drinkGroup.add(glint);
    rebuildLiquid();rebuildIce();rebuildFlowers();B.updateHUD();
    updateLabel();
  }
  function surfaceGeometry(radius){
    const rings=13,segs=60,positions=[],indices=[];
    for(let i=0;i<=rings;i++)for(let j=0;j<segs;j++){const a=j/segs*Math.PI*2;const rr=radius*i/rings;positions.push(rr*Math.cos(a),0,rr*Math.sin(a))}
    for(let i=0;i<rings;i++)for(let j=0;j<segs;j++){const a=i*segs+j,b=i*segs+(j+1)%segs,c=(i+1)*segs+j,d=(i+1)*segs+(j+1)%segs;indices.push(a,c,b,b,c,d)}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
  }
  function rebuildLiquid(){
    if(liquidMesh){drinkGroup.remove(liquidMesh);liquidMesh.geometry.dispose();liquidMesh.material.dispose()}
    if(liquidSurface){drinkGroup.remove(liquidSurface);liquidSurface.geometry.dispose();liquidSurface.material.dispose()}
    liquidMesh=liquidSurface=null;surfaceBase=null;
    const s=B.state.session,cap=B.GLASSES[activeId]?.cap||280,ratio=Math.max(0,Math.min(.97,(s.volume||0)/cap));if(!ratio)return;
    const height=Math.max(.027,form.height*Math.pow(ratio,form.shape==='cone'?.37:form.shape==='wide'?.53:.85));
    const bottomY=form.stem+.05,r1=Math.max(.07,shapeAt(.04,activeId)-.038),r2=Math.max(.07,shapeAt(height/form.height,activeId)-.038);
    const lmat=new THREE.MeshPhysicalMaterial({color:new THREE.Color(s.color||'#bac5c9'),metalness:.09,roughness:.13,transparent:true,opacity:.79,clearcoat:1,clearcoatRoughness:.05,side:THREE.DoubleSide});
    liquidMesh=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,height,64,1),lmat);
    liquidMesh.position.y=bottomY+height/2;drinkGroup.add(liquidMesh);
    const surfaceMat=new THREE.MeshPhysicalMaterial({color:new THREE.Color(s.color||'#bec4cc'),metalness:.1,roughness:.09,transparent:true,opacity:.92,side:THREE.DoubleSide,clearcoat:1});
    const g=surfaceGeometry(r2);surfaceBase=Array.from(g.attributes.position.array);
    liquidSurface=new THREE.Mesh(g,surfaceMat);liquidSurface.position.y=bottomY+height+.007;drinkGroup.add(liquidSurface);
  }
  function rebuildIce(){
    for(const o of iceMeshes){drinkGroup.remove(o);o.geometry.dispose()}iceMeshes=[];
    const s=B.state.session;
    for(let i=0;i<Math.min(9,s.ice||0);i++){
      const e=new THREE.Mesh(new THREE.BoxGeometry(.19,.19,.19),iceMaterial);
      e.userData.seed=i*.81;
      e.position.set((i%3-1)*.18,form.stem+.22+Math.floor(i/3)*.16,(Math.floor(i/3)-1)*.13);
      e.rotation.set(i*.37,i*.61,i*.28);drinkGroup.add(e);iceMeshes.push(e);
    }
  }
  const flowerTypes={
    redRose:{name:'Red Rose',cn:'深红玫瑰',kind:'rose',color:'#842f46'},
    ivoryRose:{name:'Ivory Rose',cn:'象牙白玫瑰',kind:'rose',color:'#ebe6de'},
    blushRose:{name:'Blush Rose',cn:'浅粉玫瑰',kind:'rose',color:'#d49cad'},
    babyBreath:{name:'Baby’s Breath',cn:'满天星',kind:'tiny',color:'#e8e9e7'},
    orchid:{name:'Orchid',cn:'兰花',kind:'petal',color:'#cbb7dd'},
    camellia:{name:'Camellia',cn:'山茶',kind:'rose',color:'#e2c1c7'},
    petals:{name:'Rose Petals',cn:'玫瑰花瓣',kind:'petal',color:'#9c4154'},
    mint:{name:'Mint',cn:'薄荷',kind:'leaf',color:'#426757'},
    shiso:{name:'Shiso',cn:'紫苏',kind:'leaf',color:'#637264'},
    rosemary:{name:'Rosemary',cn:'迷迭香',kind:'sprig',color:'#5b6b60'},
    cherry:{name:'Cherry',cn:'樱桃',kind:'berry',color:'#872b3b'},
    berries:{name:'Berries',cn:'浆果',kind:'berry',color:'#5d354d'}
  };
  function flowerObject(dec,i){
    const info=flowerTypes[dec.id]||flowerTypes.redRose,group=new THREE.Group();
    const petals=new THREE.MeshStandardMaterial({color:info.color,roughness:.78,side:THREE.DoubleSide});
    const petal=(x,y,z,rx,ry,rz)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(1,12,9),petals);o.scale.set(rx,ry,rz);o.position.set(x,y,z);group.add(o)};
    const green=makeMat('#536959',0,.82);
    if(info.kind==='rose'){
      for(let tier=0;tier<3;tier++)for(let j=0;j<6+tier*2;j++){const a=j/(6+tier*2)*Math.PI*2;const rr=.07+tier*.06;petal(Math.sin(a)*rr,.055+tier*.025,Math.cos(a)*rr,.08+tier*.014,.045,.032);group.children[group.children.length-1].rotation.y=a}
      const bud=new THREE.Mesh(new THREE.SphereGeometry(.067,16,12),petals);bud.position.y=.11;group.add(bud);
      const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),green);leaf.scale.set(.06,.012,.09);leaf.position.set(.11,-.04,0);group.add(leaf);
    } else if(info.kind==='tiny'){
      for(let j=0;j<12;j++){const a=j*2.399,r=.05+.018*j;petal(Math.cos(a)*r,(j%3)*.04,Math.sin(a)*r,.026,.026,.027)}
    } else if(info.kind==='leaf'||info.kind==='sprig'){
      const count=info.kind==='sprig'?11:3;
      for(let j=0;j<count;j++){const a=j*2.6,rr=.06+(.025*j);petal(Math.sin(a)*rr,.016*j,Math.cos(a)*rr,.053,.012,.11)}
    } else if(info.kind==='berry'){
      for(let j=0;j<3;j++){const o=new THREE.Mesh(new THREE.SphereGeometry(.075,12,9),petals);o.position.set((j-1)*.084,.055,Math.sin(j)*.05);group.add(o)}
    } else for(let j=0;j<5;j++){const a=j/5*Math.PI*2;petal(Math.cos(a)*.08,.01,Math.sin(a)*.08,.075,.018,.041)}
    group.position.set(dec.x??(i%2?-.15:.15),form.stem+form.height*.91+(dec.y??0),dec.z??.07);
    group.rotation.y=dec.rotation||0;group.scale.setScalar(dec.scale||1);group.userData.decIndex=i;
    drinkGroup.add(group);return group;
  }
  function rebuildFlowers(){
    for(const m of flowerMeshes)drinkGroup.remove(m);
    flowerMeshes=[];const arr=B.state.session.decorations||[];
    arr.forEach((d,i)=>flowerMeshes.push(flowerObject(d,i)));
  }
  const led=document.createElement('div');led.className='n01-scene-controls';led.innerHTML=
    '<div class="n01-glass-switch"><span class="n01-switch-overline">GLASSWARE · SWIPE THE GLASS</span><strong id="n01-glass-name">ROCKS</strong><small id="n01-glass-count">01 / 24</small><button type="button" id="n01-view-all" aria-label="一览所有杯型" title="全部杯型">▦</button></div>'+
    '<div class="n01-toolsbar"><button data-tray="glasses">GLASSWARE</button><button data-tray="spirits">SPIRITS</button><button data-tray="tools">TOOLS</button><button data-tray="floral">GARNISH</button><button data-action="save">SAVE</button></div>'+
    '<div class="n01-tray" id="n01-tray" hidden><div class="n01-tray-head"><span id="n01-tray-title">COLLECTION</span><button data-action="close" aria-label="关闭">×</button></div><div class="n01-tray-body" id="n01-tray-body"></div></div>'+
    '<div class="n01-flower-edit" id="n01-flower-edit" hidden><span>GARNISH</span><button data-action="smaller" aria-label="缩小">−</button><button data-action="rotate" aria-label="旋转">↻</button><button data-action="bigger" aria-label="放大">＋</button><button data-action="remove" aria-label="删除">×</button></div>'+
    '<div class="n01-scene-hint" id="n01-scene-hint">左右滑动中央酒杯 · 选择 SPIRITS 后拖瓶倒酒</div>';
  shell.appendChild(led);
  const find=id=>document.getElementById(id);
  let trayMode=null,selectedFlower=-1;
  function note(txt){find('n01-scene-hint').textContent=txt}
  function updateLabel(){if(!find('n01-glass-name'))return;find('n01-glass-name').textContent=B.GLASSES[activeId].name;find('n01-glass-count').textContent=String(ordered.indexOf(activeId)+1).padStart(2,'0')+' / '+ordered.length}
  function closeTray(){find('n01-tray').hidden=true;trayMode=null;}
  function tile(type,id,title,sub,mark){return '<button class="n01-tile" data-kind="'+type+'" data-id="'+id+'"><span class="n01-tile-icon">'+mark+'</span><strong>'+title+'</strong><small>'+sub+'</small></button>'}
  function showTray(type){
    trayMode=type;find('n01-tray').hidden=false;find('n01-tray-title').textContent=({glasses:'GLASSWARE / 24',spirits:'SPIRITS / SELECT A BOTTLE',tools:'TOOLS / HANDCRAFTED',floral:'GARNISH / OPTIONAL'})[type];
    let content='';
    if(type==='glasses')content=ordered.map(id=>tile('glass',id,B.GLASSES[id].name,B.GLASSES[id].cn,'◡')).join('');
    if(type==='spirits')content=B.DRINKS.map(d=>tile('drink',d.id,d.name,d.label+' · '+d.abv+'%','◍')).join('');
    if(type==='tools')content=[['ice','Ice Bucket','拖动冰块入杯','◇'],['stir','Bar Spoon','在液面画圈搅拌','⌁'],['shake','Shaker','左右往返摇酒','⇄'],['resetcam','Reset View','恢复默认镜头','◎']].map(d=>tile('tool',...d)).join('');
    if(type==='floral')content=Object.entries(flowerTypes).map(([id,d])=>tile('flower',id,d.name,d.cn,'✿')).join('');
    find('n01-tray-body').innerHTML=content;
  }
  function switchGlass(next){
    if(!B.GLASSES[next]||next===activeId||transfer)return;
    const vol=B.state.session.volume||0,cap=B.GLASSES[next].cap;
    if(vol>cap){B.toast('新杯容量不足：'+cap+' ML；当前饮品 '+Math.round(vol)+' ML。请选择更大的杯型。');return}
    transfer={start:performance.now(),old:drinkGroup,next,volume:vol};
    B.state.session.glass=next;B.persist();
    if(!vol){buildGlass();transfer=null;B.ding();return}
    note('正在把当前酒液转入 '+B.GLASSES[next].name+'…');
    setTimeout(()=>{buildGlass();transfer=null;ripple=1;B.ding('pour');note('酒液已转移，配方与用量保持不变');},710);
  }
  function turnGlass(steps){switchGlass(ordered[(ordered.indexOf(activeId)+steps+ordered.length)%ordered.length])}
  function chooseDrink(id){if(!B.byId(id))return;B.state.session.selected=id;B.persist();B.updateHUD();makeHeld(id);mode='pour';note('拖动前景酒瓶至酒杯上方，保持按住即可倒酒');closeTray();}
  function makeHeld(id){
    if(heldBottle){scene.remove(heldBottle);heldBottle=null}
    if(!id||!B.byId(id))return;
    heldId=id;heldBottle=makeBottle(B.byId(id),-1.6,1.38,3.2,.82,false);heldBottle.rotation.z=-.12;
  }
  function volumeAdd(ml){
    const s=B.state.session,d=B.byId(heldId);if(!d)return;
    const cap=B.GLASSES[activeId].cap,left=cap-(s.volume||0);const delta=Math.max(0,Math.min(left,ml));
    if(delta<=0){note('酒杯容量已满');return}
    s.ingredients[d.id]=(s.ingredients[d.id]||0)+delta;
    s.volume=Object.values(s.ingredients).reduce((a,b)=>a+b,0);
    s.color=B.getColor();if(s.volume%3<delta)rebuildLiquid();
    B.updateHUD();B.persist();ripple=Math.min(1,ripple+.19);
  }
  function addIce(){const s=B.state.session;s.ice=Math.min(9,(s.ice||0)+1);rebuildIce();ripple=.9;B.persist();B.updateHUD();B.ding('ice');note('冰块已投入酒杯 · '+s.ice)}
  function addFlower(id){const s=B.state.session;if(!flowerTypes[id])return;s.decorations=s.decorations||[];s.decorations.push({id,x:(Math.random()-.5)*.33,y:0,z:(Math.random()-.5)*.25,rotation:Math.random()*2,scale:1});selectedFlower=s.decorations.length-1;rebuildFlowers();showFlowerEdit();B.persist();note('可拖动装饰调整位置，点击下方按钮旋转、缩放或删除');closeTray()}
  function showFlowerEdit(){find('n01-flower-edit').hidden=selectedFlower<0}
  led.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    if(b.id==='n01-view-all'){showTray('glasses');return}
    if(b.dataset.tray){showTray(b.dataset.tray);return}
    const action=b.dataset.action;
    if(action==='close'){closeTray();return}
    if(action==='save'){document.getElementById('btn-save').click();closeTray();return}
    if(action==='rotate'||action==='bigger'||action==='smaller'||action==='remove'){
      const arr=B.state.session.decorations||[];if(selectedFlower<0||!arr[selectedFlower])return;
      if(action==='remove'){arr.splice(selectedFlower,1);selectedFlower=-1;showFlowerEdit()}
      else if(action==='rotate')arr[selectedFlower].rotation=(arr[selectedFlower].rotation||0)+Math.PI/8;
      else arr[selectedFlower].scale=Math.max(.4,Math.min(2.5,(arr[selectedFlower].scale||1)+(action==='bigger'?.15:-.15)));
      rebuildFlowers();B.persist();return;
    }
    if(b.dataset.kind==='glass'){switchGlass(b.dataset.id);closeTray();return}
    if(b.dataset.kind==='drink'){chooseDrink(b.dataset.id);return}
    if(b.dataset.kind==='flower'){addFlower(b.dataset.id);return}
    if(b.dataset.kind==='tool'){
      if(b.dataset.id==='resetcam'){yaw=0;zoom=10.4;look();closeTray();return}
      mode=b.dataset.id;closeTray();note(({ice:'从左侧冰桶拖动冰块到中央酒杯',stir:'按住酒杯在液面画圈，酒液随手势旋转',shake:'按住杯子左右往返晃动'})[mode]);
    }
  });
  function pointerXY(e){const r=renderer.domElement.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top,w:r.width,h:r.height}}
  function project(point){const v=point.clone().project(camera),r=renderer.domElement.getBoundingClientRect();return{x:(v.x+1)*r.width/2,y:(1-v.y)*r.height/2}}
  function nearGlass(e){const p=pointerXY(e),q=project(new THREE.Vector3(glassAnchor.position.x,2.2,glassAnchor.position.z));return Math.abs(p.x-q.x)<p.w*.19&&Math.abs(p.y-q.y)<p.h*.29}
  function nearBottle(e){if(!heldBottle)return false;const p=pointerXY(e),q=project(new THREE.Vector3(-1.6,2.14,3.2));return Math.hypot(p.x-q.x,p.y-q.y)<Math.min(p.w*.2,150)}
  function onDown(e){
    if(e.button!==0)return;
    const p=pointerXY(e);let kind='orbit';
    if(mode==='stir'&&nearGlass(e))kind='stir';
    else if(mode==='shake'&&nearGlass(e))kind='shake';
    else if(mode==='ice'&&(p.x<p.w*.49||nearGlass(e)))kind='ice';
    else if(heldId&&(nearBottle(e)||nearGlass(e)))kind='pour';
    else if(nearGlass(e))kind='swipe';
    else if(flowerMeshes.length&&nearGlass(e)&&mode==='garnish')kind='flower';
    gesture={kind,start:p,last:p,startTime:performance.now(),lastTime:performance.now(),angle:null,circle:0,changes:0,lastDx:0,velocity:0};
    renderer.domElement.setPointerCapture(e.pointerId);e.preventDefault();
  }
  function onMove(e){
    if(!gesture)return;const p=pointerXY(e),g=gesture,dx=p.x-g.start.x,dy=p.y-g.start.y;const ms=Math.max(1,performance.now()-g.lastTime);
    if(g.kind==='swipe'){glassAnchor.position.x=.2+dx/p.w*3.2;glassAnchor.rotation.z=-dx/p.w*.24}
    if(g.kind==='orbit'){yaw=Math.max(-.22,Math.min(.22,yaw+(p.x-g.last.x)*.002));look()}
    if(g.kind==='pour'){
      if(heldBottle){heldBottle.position.x=-1.6+(p.x-g.start.x)/p.w*5.5;heldBottle.position.y=1.38-(p.y-g.start.y)/p.h*2.4;heldBottle.rotation.z=-.14}
    }
    if(g.kind==='stir'){
      const a=Math.atan2(p.y-p.h*.52,p.x-p.w*.5);if(g.angle!==null){let da=a-g.angle;while(da>Math.PI)da-=Math.PI*2;while(da<-Math.PI)da+=Math.PI*2;g.circle+=Math.abs(da);swirl=Math.max(-3,Math.min(3,swirl+da*1.3));ripple=Math.min(1,ripple+.06);}
      g.angle=a;
    }
    if(g.kind==='shake'){if(Math.sign(p.x-g.last.x)!==Math.sign(g.lastDx)&&Math.abs(p.x-g.last.x)>2)g.changes++;g.lastDx=p.x-g.last.x;swirl=Math.min(3,Math.abs(dx)/80);ripple=.8;glassAnchor.position.x=.2+dx/p.w*.9}
    if(g.kind==='ice'){}
    if(g.kind==='flower'){const d=B.state.session.decorations?.[selectedFlower];if(d){d.x=Math.max(-.5,Math.min(.5,(p.x-p.w/2)/p.w*2));d.z=Math.max(-.4,Math.min(.4,(p.y-p.h/2)/p.h));rebuildFlowers();}}
    g.last=p;g.lastTime=performance.now();
  }
  function onUp(e){
    if(!gesture)return;const g=gesture,p=pointerXY(e),dx=p.x-g.start.x,dy=p.y-g.start.y;
    if(g.kind==='swipe'){const fast=Math.abs(dx)>42||Math.abs(dx)/(performance.now()-g.startTime+1)>.42;if(fast)turnGlass(dx<0?1:-1);glassAnchor.position.x=.2;glassAnchor.rotation.z=0}
    if(g.kind==='stir'){if(g.circle>Math.PI*.6){B.state.session.stirs=(B.state.session.stirs||0)+Math.max(1,Math.round(g.circle/(Math.PI*2)));B.persist();B.updateHUD();B.ding();note('已完成搅拌 · 酒液将逐渐恢复平静')}}
    if(g.kind==='shake'){glassAnchor.position.x=.2;if(g.changes>=3){B.state.session.shakes=(B.state.session.shakes||0)+1;B.persist();B.updateHUD();B.ding();note('摇酒完成')}}
    if(g.kind==='ice'){if(nearGlass(e)||Math.abs(dx)>25){addIce()}else note('将冰块拖向杯口后松开')}
    if(g.kind==='pour'&&heldBottle){heldBottle.position.set(-1.6,1.38,3.2);heldBottle.rotation.z=-.12;visualPour=0;}
    if(g.kind==='flower')B.persist();
    gesture=null;
  }
  renderer.domElement.addEventListener('pointerdown',onDown);
  renderer.domElement.addEventListener('pointermove',onMove);
  renderer.domElement.addEventListener('pointerup',onUp);
  renderer.domElement.addEventListener('pointercancel',onUp);
  renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(8.4,Math.min(12.7,zoom+e.deltaY*.007));look()},{passive:false});
  let last=performance.now(),liquidSync=0,previousVolume=-1;
  function paint(t){
    const dt=Math.min(.06,(t-last)/1000);last=t;
    const s=B.state.session;
    if(s.glass&&s.glass!==activeId&&!transfer)buildGlass();
    if(!transfer&&s.volume!==previousVolume){previousVolume=s.volume;rebuildLiquid()}
    if(gesture&&gesture.kind==='pour'&&heldId){
      const hold=t-gesture.startTime>220;
      if(hold){
        const p=gesture.last,q=project(new THREE.Vector3(glassAnchor.position.x,2.15,glassAnchor.position.z));
        if(Math.abs(p.x-q.x)<p.w*.24&&Math.abs(p.y-q.y)<p.h*.36){
          heldBottle.rotation.z=-1.02;volumeAdd(dt*34);visualPour=1;
        }else visualPour=0;
      }
    }
    if(transfer&&transfer.volume){const f=Math.min(1,(t-transfer.start)/700);glassAnchor.rotation.z=-Math.sin(f*Math.PI)*.52;glassAnchor.position.x=.2-Math.sin(f*Math.PI)*.19}
    else if(!gesture||gesture.kind!=='swipe'&&gesture.kind!=='shake'){glassAnchor.rotation.z*=.88;glassAnchor.position.x+=(.2-glassAnchor.position.x)*.17}
    if(liquidSurface&&surfaceBase){
      const a=liquidSurface.geometry.attributes.position,arr=a.array;const strength=Math.min(2.8,Math.abs(swirl));
      for(let i=0;i<arr.length/3;i++){
        const x=surfaceBase[i*3],z=surfaceBase[i*3+2],r=Math.sqrt(x*x+z*z),ang=Math.atan2(z,x);
        arr[i*3+1]=-.035*strength*Math.exp(-r*3)+Math.min(.06,r*.04)*strength+(.018*ripple*Math.sin(21*r-t*.012+ang*2)+.010*ripple*Math.sin(34*r+t*.008+ang*3));
      }
      a.needsUpdate=true;liquidSurface.geometry.computeVertexNormals();
      for(const ice of iceMeshes){const v=ice.userData.seed||0;ice.position.x+=Math.cos(t*.0014+v)*.00023*strength;ice.position.z+=Math.sin(t*.0014+v)*.00023*strength;ice.rotation.y+=.0032*strength;ice.position.y+=Math.sin(t*.002+v)*.00015*ripple}
    }
    swirl*=Math.pow(.968,dt*60);ripple*=Math.pow(.977,dt*60);
    renderer.render(scene,camera);
    requestAnimationFrame(paint);
  }
  function resize(){
    const r=stage.getBoundingClientRect();roomW=Math.max(450,Math.round(r.width)||1100);roomH=Math.max(320,Math.round(r.height)||650);
    renderer.setSize(roomW,roomH,false);camera.aspect=roomW/roomH;camera.updateProjectionMatrix();look();
  }
  new ResizeObserver(resize).observe(stage);
  function snapshot(){
    try{const src=renderer.domElement;const c=document.createElement('canvas');c.width=460;c.height=280;const ctx=c.getContext('2d');const w=src.width,h=src.height;const crop=Math.min(w/1.64,h/1);ctx.drawImage(src,(w-crop*1.64)/2,(h-crop)/2,crop*1.64,crop,0,0,460,280);return c.toDataURL('image/webp',.62)}catch(e){return null}
  }
  const shared={
    active:true,
    sync(){const id=B.state.session.glass||'rocks';if(id!==activeId){buildGlass()}else{rebuildLiquid();rebuildIce();rebuildFlowers()}updateLabel()},
    capture:snapshot
  };
  window.N01Scene=shared;
  const oldHUD=document.querySelector('.bar-bottom');if(oldHUD)oldHUD.classList.add('bar-bottom-legacy');
  if(!B.state.session.decorations)B.state.session.decorations=[];
  buildGlass();resize();paint(performance.now());
  if(B.state.session.selected)makeHeld(B.state.session.selected);
  setTimeout(()=>{try{const cover=document.getElementById('home-scene');const picture=snapshot();if(cover&&picture){cover.style.backgroundImage='linear-gradient(90deg,rgba(4,5,6,.88),rgba(5,6,7,.18)),url('+picture+')';cover.classList.add('n01-home-picture')}}catch(e){}},750);
  B.persist();B.updateHUD();
  note('直接左右滑动中央酒杯 · 四宫格总览全部杯型 · GARNISH 可选');
})();
