
'use strict';
/* N° 01 — a standalone, offline-capable cocktail atelier. No external packages. */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
const esc = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const el = (tag,attrs={}) => {const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n};
const STORAGE = 'n01_atelier_v1';
const GLASSES = {rocks:{name:'Rocks',cn:'古典杯',cap:280},highball:{name:'Highball',cn:'高球杯',cap:360},martini:{name:'Martini',cn:'马天尼杯',cap:180},coupe:{name:'Coupe',cn:'浅碟杯',cap:200}};
Object.assign(GLASSES,{
doubleRocks:{name:'Double Rocks',cn:'双份古典杯',cap:340,shape:'low'},
collins:{name:'Collins',cn:'柯林斯杯',cap:390,shape:'tall'},
nicknora:{name:'Nick & Nora',cn:'尼克诺拉杯',cap:150,shape:'stem'},
flute:{name:'Flute',cn:'香槟笛形杯',cap:180,shape:'flute'},
tulip:{name:'Tulip',cn:'郁金香杯',cap:210,shape:'tulip'},
snifter:{name:'Snifter',cn:'白兰地杯',cap:240,shape:'snifter'},
cordial:{name:'Cordial',cn:'利口小杯',cap:85,shape:'stem'},
shot:{name:'Shot',cn:'烈酒杯',cap:70,shape:'low'},
margarita:{name:'Margarita',cn:'玛格丽特杯',cap:280,shape:'wide'},
hurricane:{name:'Hurricane',cn:'飓风杯',cap:430,shape:'hourglass'},
pilsner:{name:'Pilsner',cn:'皮尔森杯',cap:410,shape:'tall'},
irish:{name:'Irish Coffee',cn:'爱尔兰咖啡杯',cap:280,shape:'tall'},
wine:{name:'Wine',cn:'葡萄酒杯',cap:320,shape:'snifter'},
saucer:{name:'Champagne Saucer',cn:'香槟浅碟杯',cap:200,shape:'wide'},
goblet:{name:'Goblet',cn:'高脚杯',cap:360,shape:'snifter'},
tiki:{name:'Tiki',cn:'提基杯',cap:410,shape:'tall'},
julep:{name:'Julep',cn:'朱利普杯',cap:340,shape:'low'},
sling:{name:'Sling',cn:'斯令杯',cap:390,shape:'tall'},
fizz:{name:'Fizz',cn:'菲士杯',cap:270,shape:'tall'},
sour:{name:'Sour',cn:'酸酒杯',cap:160,shape:'stem'}
});
const DRINKS = [
{id:'whisky',name:'Single Malt',label:'Whisky',cn:'单一麦芽威士忌',cat:'spirit',abv:43,color:'#b36d2f',origin:'Scotland',notes:'Oak / Honey / Dried Fruit',description:'A rounded single malt with honeyed oak and a long, warming finish.',shape:'square'},
{id:'gin',name:'London Dry',label:'Gin',cn:'伦敦干金酒',cat:'spirit',abv:40,color:'#c5dcc5',origin:'England',notes:'Juniper / Citrus / Herbs',description:'Dry, botanical, and clean. An essential spirit for a crisp Martini or a lively highball.',shape:'tall'},
{id:'vodka',name:'Pure Grain',label:'Vodka',cn:'伏特加',cat:'spirit',abv:40,color:'#d8e4ea',origin:'Poland',notes:'Clean / Mineral / Soft',description:'A delicate neutral spirit that lets citrus, coffee and fruit take center stage.',shape:'tall'},
{id:'rum',name:'Aged Rum',label:'Rum',cn:'陈年朗姆酒',cat:'spirit',abv:40,color:'#a45927',origin:'Caribbean',notes:'Molasses / Caramel / Spice',description:'Rich golden rum with caramel sweetness and a warm, faintly spiced finish.',shape:'square'},
{id:'tequila',name:'Blanco',label:'Tequila',cn:'银龙舌兰',cat:'spirit',abv:40,color:'#d5d4a4',origin:'Mexico',notes:'Agave / Pepper / Lime',description:'Vibrant blue agave character with a bright and gently peppery profile.',shape:'round'},
{id:'brandy',name:'Fine Cognac',label:'Brandy',cn:'干邑白兰地',cat:'spirit',abv:40,color:'#b46a31',origin:'France',notes:'Vanilla / Fruit / Oak',description:'Elegant grape spirit with orchard fruit, vanilla and restrained oak.',shape:'round'},
{id:'bourbon',name:'Small Batch',label:'Bourbon',cn:'波本威士忌',cat:'spirit',abv:45,color:'#c67d34',origin:'United States',notes:'Vanilla / Corn / Toast',description:'A soft, rounded bourbon with a toasted vanilla finish.',shape:'square'},
{id:'rye',name:'Straight Rye',label:'Rye Whisky',cn:'黑麦威士忌',cat:'spirit',abv:46,color:'#ae5a23',origin:'United States',notes:'Pepper / Spice / Oak',description:'A bold, dry whiskey with notable spice and a firm finish.',shape:'square'},
{id:'mezcal',name:'Espadín',label:'Mezcal',cn:'梅斯卡尔',cat:'spirit',abv:42,color:'#e0c99c',origin:'Mexico',notes:'Smoke / Agave / Earth',description:'Gently smoky agave spirit with earthy, herbal complexity.',shape:'round'},
{id:'cointreau',name:'Orange Triple Sec',label:'Orange Liqueur',cn:'橙味利口酒',cat:'liqueur',abv:40,color:'#d8954a',origin:'France',notes:'Orange Peel / Zest',description:'An aromatic orange liqueur, a classic counterpart to lime and agave.',shape:'square'},
{id:'campari',name:'Red Bitter',label:'Aperitivo',cn:'红苦酒',cat:'liqueur',abv:25,color:'#c4382a',origin:'Italy',notes:'Bitter Orange / Herbs',description:'A bold, vibrant bitter aperitivo for Negroni-style drinks.',shape:'tall'},
{id:'sweetvermouth',name:'Rosso Vermouth',label:'Vermouth',cn:'甜味美思',cat:'liqueur',abv:16,color:'#8b372b',origin:'Italy',notes:'Wine / Spice / Botanicals',description:'Fortified aromatized wine with warming spices and a bittersweet finish.',shape:'tall'},
{id:'dryvermouth',name:'Dry Vermouth',label:'Vermouth',cn:'干味美思',cat:'liqueur',abv:18,color:'#d3bc81',origin:'France',notes:'Herbs / White Wine',description:'Pale and herbal aromatized wine with a delicate dry finish.',shape:'tall'},
{id:'coffee',name:'Coffee Liqueur',label:'Liqueur',cn:'咖啡利口酒',cat:'liqueur',abv:20,color:'#4f2b1c',origin:'Mexico',notes:'Roasted Coffee / Cocoa',description:'Dark roasted coffee notes with a soft, bittersweet sweetness.',shape:'square'},
{id:'elderflower',name:'Elderflower',label:'Liqueur',cn:'接骨木花利口酒',cat:'liqueur',abv:20,color:'#eadca3',origin:'France',notes:'Floral / Pear / Honey',description:'Delicate floral aroma that brings fragrant softness to citrus cocktails.',shape:'round'},
{id:'amaretto',name:'Amaretto',label:'Liqueur',cn:'杏仁利口酒',cat:'liqueur',abv:28,color:'#a2602f',origin:'Italy',notes:'Almond / Vanilla',description:'An almond-scented liqueur, rounded and gently sweet.',shape:'square'},
{id:'lemon',name:'Fresh Lemon',label:'Juice',cn:'鲜榨柠檬汁',cat:'mixer',abv:0,color:'#e3c34e',origin:'Fresh Pressed',notes:'Bright / Sour',description:'Fresh tart lemon juice gives balance and lift.',shape:'tall'},
{id:'lime',name:'Fresh Lime',label:'Juice',cn:'鲜榨青柠汁',cat:'mixer',abv:0,color:'#a7bc49',origin:'Fresh Pressed',notes:'Zesty / Sour',description:'Sharp, fragrant lime for refreshing and balanced drinks.',shape:'tall'},
{id:'cranberry',name:'Cranberry',label:'Juice',cn:'蔓越莓汁',cat:'mixer',abv:0,color:'#a8273d',origin:'Fruit',notes:'Tart / Red Berry',description:'Distinctive tart red berry character with a vivid hue.',shape:'tall'},
{id:'soda',name:'Soda Water',label:'Mixer',cn:'苏打水',cat:'mixer',abv:0,color:'#d6e7e8',origin:'Sparkling',notes:'Neutral / Effervescent',description:'Fine bubbles bring length and a lifted finish.',shape:'tall'},
{id:'tonic',name:'Tonic Water',label:'Mixer',cn:'汤力水',cat:'mixer',abv:0,color:'#d6ddc5',origin:'Sparkling',notes:'Quinine / Bitter',description:'Bitter quinine and carbonation, especially good with gin.',shape:'tall'},
{id:'ginger',name:'Ginger Beer',label:'Mixer',cn:'姜汁汽水',cat:'mixer',abv:0,color:'#c8a56b',origin:'Sparkling',notes:'Ginger / Spicy',description:'Fiery ginger with a sparkling, refreshing edge.',shape:'tall'},
{id:'syrup',name:'Simple Syrup',label:'Syrup',cn:'单糖浆',cat:'mixer',abv:0,color:'#ddd3bb',origin:'House Made',notes:'Sweet / Smooth',description:'An essential sweetener to balance bitters and citrus.',shape:'round'},
{id:'grenadine',name:'Grenadine',label:'Syrup',cn:'石榴糖浆',cat:'mixer',abv:0,color:'#a32935',origin:'House Made',notes:'Pomegranate / Sweet',description:'Deep ruby syrup adding color and gentle fruitiness.',shape:'round'},
{id:'bitters',name:'Aromatic Bitters',label:'Bitters',cn:'芳香苦精',cat:'mixer',abv:44,color:'#6f2e16',origin:'Botanical',notes:'Spice / Bitter',description:'Intensely aromatic bitters, traditionally added in very small amounts.',shape:'round'}
];
const byId = id => DRINKS.find(x=>x.id===id);
const SHELF = ['whisky','gin','vodka','rum','tequila','brandy','bourbon','rye','mezcal','cointreau','campari','sweetvermouth','dryvermouth','coffee'];
const DEFAULT_SESSION = () => ({glass:'rocks',x:620,y:626,volume:0,ice:0,stirs:0,shakes:0,garnish:null,decorations:[],ingredients:{},color:'#a7b1b4',selected:null});
let state={session:DEFAULT_SESSION(),archive:[],name:'User',sessions:0,sound:true};
try {const stored=JSON.parse(localStorage.getItem(STORAGE)||'null');if(stored&&typeof stored==='object'){state={...state,...stored};state.session={...DEFAULT_SESSION(),...(stored.session||{})};state.archive=Array.isArray(stored.archive)?stored.archive:[];}} catch(e){}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch(e){}}
let toastTimer,helpTimer,activePage='home';
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2600)}
function helper(msg,dim=false,timeout=0){const e=$('#scene-helper');e.textContent=msg;e.classList.toggle('dim',dim);clearTimeout(helpTimer);if(timeout)helpTimer=setTimeout(()=>defaultHelper(),timeout)}
function defaultHelper(){const s=state.session;if(!s.glass)helper('左右滑动中央酒杯切换杯型，也可打开 GLASSWARE 总览。',true);else if(!s.volume)helper('从后方酒柜拖动酒瓶到杯口，停留即可倒酒。',true);else helper('可以继续倒酒、加入冰块、搅拌，或保存你的作品。',true)}
let audioCtx;
function ding(type='tap'){if(!state.sound)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sine';osc.frequency.setValueAtTime(type==='ice'?1050:type==='pour'?360:800,audioCtx.currentTime);osc.frequency.exponentialRampToValueAtTime(type==='ice'?530:430,audioCtx.currentTime+.16);gain.gain.setValueAtTime(.022,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.18);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.2)}catch(e){}}
function updateHome(){const active=!!state.session.glass;$('#continue-btn').style.display=active?'inline-flex':'none';}
function navigate(id,fromHistory=false){if(!$('#page-'+id))return;if(!fromHistory&&window.location.hash!=='#page-'+id)(()=>{try{history.pushState(null,'','#page-'+id)}catch(e){}})();activePage=id;$$('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+id));$$('.nav-link').forEach(n=>n.classList.toggle('active',n.dataset.go===id));window.scrollTo(0,0);if(id==='bar'){renderGlass();updateHUD();defaultHelper();window.N01Scene?.sync?.()}if(id==='cellar')renderCellar();if(id==='archive')renderArchive();if(id==='profile')renderProfile();if(id==='home')updateHome();persist()}
$$('[data-go]').forEach(e=>e.addEventListener('click',ev=>{ev.preventDefault();if(e.closest('.home-copy')&&e.dataset.go==='bar'&&activePage==='home'){const stage=$('.home-stage');stage.classList.add('zooming');setTimeout(()=>{navigate('bar');stage.classList.remove('zooming')},325)}else navigate(e.dataset.go)}));
const rgb = h => {h=h.replace('#','');return [parseInt(h.substring(0,2),16)||0,parseInt(h.substring(2,4),16)||0,parseInt(h.substring(4,6),16)||0]};
const hex = a => '#'+a.map(c=>Math.round(clamp(c,0,255)).toString(16).padStart(2,'0')).join('');
const mix = (a,b,t) => hex(rgb(a).map((v,i)=>v*(1-t)+rgb(b)[i]*t));
const lighten = (v,t=.25)=>mix(v,'#ffffff',t);
const darken = (v,t=.25)=>mix(v,'#070604',t);
function getColor(session=state.session){let n=0,col=[0,0,0];for(const [id,ml] of Object.entries(session.ingredients||{})){const d=byId(id);if(!d)continue;const c=rgb(d.color);col=col.map((v,i)=>v+c[i]*ml);n+=ml;}return n?hex(col.map(v=>v/n)):session.color||'#b36d2f'}
function sumVolume(s=state.session){return Math.round(Object.values(s.ingredients||{}).reduce((a,b)=>a+b,0))}
function estimatedABV(s=state.session){let total=0,ethanol=0;for(const [id,ml] of Object.entries(s.ingredients)){const d=byId(id);if(d){total+=ml;ethanol+=ml*d.abv/100}}return total?Math.round(ethanol/total*100):0}
function iconMarkup(name){const paths={sparkle:'<path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',trash:'<path d="M4 7h16M9 7V4h6v3m-8 0 1 14h8l1-14M10 11v6m4-6v6"/>'};return `<svg class="icon" viewBox="0 0 24 24">${paths[name]||paths.sparkle}</svg>`}
/* A deliberately layered 2.5D environment: stone, walnut, copper, glass and reflection. */
function bottleShape(d,prefix,scale=1,role='shelf'){
 const w = d.shape==='square'?25:d.shape==='round'?24:20;
 const shoulder=d.shape==='square'?95:d.shape==='round'?88:93;
 const body=d.shape==='round'?`M-${w-3} -${shoulder} Q-${w+8} -79 -${w+5} -62 L-${w+5} -19 Q-${w+4} 0 -12 0 H12 Q${w+4} 0 ${w+5} -19 L${w+5} -62 Q${w+8} -79 ${w-3} -${shoulder}Z`:`M-${w-3} -${shoulder} L-${w} -${shoulder-10} L-${w} -6 Q-${w} 0 -${w-6} 0 H${w-6} Q${w} 0 ${w} -6 L${w} -${shoulder-10} L${w-3} -${shoulder}Z`;
 const color=d.color||'#b66a35';
 return `<g class="bottle-lift" transform="scale(${scale})">
  <ellipse cx="0" cy="3" rx="${w+11}" ry="6" fill="#000" opacity=".37"/>
  <path d="M-8 -91 L-8 -117 Q-8 -121 -5 -121 H5 Q8 -121 8 -117 L8 -91Z" fill="url(#${prefix}-bottleGlass)" stroke="#d6d6bd" stroke-opacity=".36" stroke-width="1"/>
  <path d="M-9 -117 L9 -117 L9 -108 L-9 -108Z" fill="${d.cat==='mixer'?'#6a665b':'#30241b'}" stroke="#b69c70" stroke-opacity=".65" stroke-width="1"/>
  <path d="${body}" fill="url(#${prefix}-bottleGlass)" stroke="#b9a898" stroke-opacity=".46" stroke-width="1.3"/>
  <path d="${body}" fill="${color}" opacity=".50"/>
  <path d="M-${w-11} -${shoulder-9}L-${w-10} -17" fill="none" stroke="#fff6df" stroke-width="3.2" stroke-opacity=".23" stroke-linecap="round"/>
  <path d="M${w-9} -${shoulder-7}L${w-10} -18" fill="none" stroke="#eee4cc" stroke-width="2" stroke-opacity=".15" stroke-linecap="round"/>
  <rect x="-${w-6}" y="-63" width="${(w-6)*2}" height="43" rx="1.7" fill="${d.cat==='mixer'?'#ded8c9':'#1a1916'}" fill-opacity="${d.cat==='mixer'?.80:.88}" stroke="#9f845e" stroke-opacity=".65" stroke-width=".7"/>
  <path d="M-${w-9} -56 H${w-9}" stroke="${d.cat==='mixer'?'#797065':'#ac9070'}" stroke-opacity=".65" stroke-width="1"/>
  <text x="0" y="-45" fill="${d.cat==='mixer'?'#4d4a44':'#e8d8c0'}" font-family="Georgia,serif" font-size="${d.name.length>12?6:7}" text-anchor="middle" letter-spacing=".6">${esc(d.name.length>17?d.name.slice(0,13):d.name).toUpperCase()}</text>
  <text x="0" y="-29" fill="${d.cat==='mixer'?'#7b6e62':'#9c835f'}" font-size="5.1" text-anchor="middle" letter-spacing=".8">N° 01</text>
  <path d="M-${w-3} -7 Q0 -4 ${w-3} -7" stroke="#fff" opacity=".11" fill="none"/>
 </g>`;
}
function bottleAt(id,x,y,scale,prefix,interactive=false){const d=byId(id);return `<g ${interactive?`class="hit-bottle" data-bottle="${id}"`:''} transform="translate(${x} ${y}) scale(${scale})">${bottleShape(d,prefix,1)}${interactive?'<rect x="-34" y="-126" width="68" height="135" fill="transparent" pointer-events="all"/>':''}</g>`}
function rackGlass(type,x,y,prefix,interactive=false){let base='';
 if(type==='rocks')base=`<path d="M-27 -57 L-22 -4Q0 4 22 -4L27 -57Z" fill="url(#${prefix}-glass)" stroke="#d6e0db" stroke-opacity=".67" stroke-width="1.3"/><ellipse cx="0" cy="-57" rx="27" ry="6.5" fill="none" stroke="#ece8dc" stroke-opacity=".65" stroke-width="2"/>`;
 if(type==='highball')base=`<path d="M-18 -85 L-16 -4 Q0 3 16 -4L18 -85Z" fill="url(#${prefix}-glass)" stroke="#d6e0db" stroke-opacity=".7" stroke-width="1.4"/><ellipse cx="0" cy="-85" rx="18" ry="4.5" stroke="#e1e4db" stroke-opacity=".73" fill="none" stroke-width="1.7"/>`;
 if(type==='martini')base=`<path d="M-34 -70L-3 -31L-3 -6L-22 -2H22L3 -6L3 -31L34 -70Z" fill="url(#${prefix}-glass)" stroke="#e6e4dc" stroke-opacity=".6" stroke-width="1.4"/><ellipse cx="0" cy="-70" rx="34" ry="6" fill="none" stroke="#e1e4dd" stroke-opacity=".8" stroke-width="1.5"/>`;
 if(type==='coupe')base=`<path d="M-33 -72Q-29 -40 0 -38Q29 -40 33 -72L3 -35 L3 -7L22 -2H-22L-3 -7L-3 -35Z" fill="url(#${prefix}-glass)" stroke="#e6e4dc" stroke-opacity=".63" stroke-width="1.4"/><ellipse cx="0" cy="-72" rx="33" ry="7.3" fill="none" stroke="#e6e4dd" stroke-opacity=".85" stroke-width="1.6"/>`;
 return `<g ${interactive?`class="rack-item" data-glass="${type}"`:''} transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="33" ry="5" fill="#090a09" opacity=".6"/><g class="rack-lift">${base}</g>${interactive?'<rect x="-37" y="-96" width="75" height="102" fill="transparent" pointer-events="all"/>':''}</g>`;
}
function sceneSVG(prefix,interactive){
 const low=interactive?'':'',shelfX=[196,278,360,443,526,609,692,775];
 const upper=SHELF.slice(0,8).map((id,i)=>bottleAt(id,shelfX[i],235,.88,prefix,interactive)).join('');
 const bottom=SHELF.slice(8).map((id,i)=>bottleAt(id,214+i*90,392,.86,prefix,interactive)).join('');
 const racks=Object.keys(GLASSES).map((type,i)=>rackGlass(type,838+i*84,397,prefix,interactive)).join('');
 const strips=Array.from({length:32},(_,i)=>`<path d="M${86+i*34} 40v415" stroke="${i%3?'#b39762':'#130f0c'}" stroke-opacity="${i%3?.035:.15}" stroke-width="${i%3?1:2}"/>`).join('');
 const stoneVeins=Array.from({length:19},(_,i)=>{const x=30+i*71,y=440+(i%5)*45;return `<path d="M${x} ${y}q${i%2?24:-27} 11 47 5t65 ${i%3?22:-21}" fill="none" stroke="${i%3===0?'#ae9979':'#908b86'}" stroke-opacity="${i%3===0?.12:.053}" stroke-width="${i%2?1.5:.8}"/>`}).join('');
 return `<svg class="scene-visual" id="${prefix}-scene-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" role="img" aria-label="夜间深色石材与黑胡桃木私人吧台，后方陈列可选酒瓶，右侧玻璃杯架">
 <defs>
  <linearGradient id="${prefix}-wall" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#0d0d0c"/><stop offset=".45" stop-color="#271e17"/><stop offset="1" stop-color="#100f0e"/></linearGradient>
  <linearGradient id="${prefix}-cabinet" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#0b0a09"/><stop offset=".22" stop-color="#27180f"/><stop offset=".5" stop-color="#3d291b"/><stop offset=".82" stop-color="#251911"/><stop offset="1" stop-color="#0b0908"/></linearGradient>
  <linearGradient id="${prefix}-stone" x1="0" y1="0" x2=".1" y2="1"><stop stop-color="#474643"/><stop offset=".12" stop-color="#292724"/><stop offset=".54" stop-color="#161513"/><stop offset="1" stop-color="#0e0e0d"/></linearGradient>
  <linearGradient id="${prefix}-stoneFace" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#28231d"/><stop offset=".22" stop-color="#191714"/><stop offset="1" stop-color="#070707"/></linearGradient>
  <linearGradient id="${prefix}-shelf" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#a58d64"/><stop offset=".2" stop-color="#443a2d"/><stop offset=".8" stop-color="#140f0c"/><stop offset="1" stop-color="#080807"/></linearGradient>
  <linearGradient id="${prefix}-backLight" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#a87a42" stop-opacity=".24"/><stop offset=".37" stop-color="#8c6036" stop-opacity=".14"/><stop offset="1" stop-color="#2c1e14" stop-opacity="0"/></linearGradient>
  <linearGradient id="${prefix}-bottleGlass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#f0dec5" stop-opacity=".24"/><stop offset=".15" stop-color="#25150c" stop-opacity=".2"/><stop offset=".75" stop-color="#1c1a15" stop-opacity=".42"/><stop offset="1" stop-color="#fff0cc" stop-opacity=".39"/></linearGradient>
  <linearGradient id="${prefix}-glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#dbe5e2" stop-opacity=".25"/><stop offset=".21" stop-color="#c7e0e6" stop-opacity=".035"/><stop offset=".70" stop-color="#b9d8e8" stop-opacity=".04"/><stop offset="1" stop-color="#eaf4f2" stop-opacity=".29"/></linearGradient>
  <linearGradient id="${prefix}-liquid" x1="0" y1="0" x2=".4" y2="1"><stop id="${prefix}-liquid-top" stop-color="#f3bb6b" stop-opacity=".92"/><stop id="${prefix}-liquid-bottom" offset="1" stop-color="#7a2b0b" stop-opacity=".91"/></linearGradient>
  <radialGradient id="${prefix}-glow"><stop stop-color="#f8b75e" stop-opacity=".35"/><stop offset=".3" stop-color="#ab6d32" stop-opacity=".13"/><stop offset="1" stop-color="#b57736" stop-opacity="0"/></radialGradient>
  <radialGradient id="${prefix}-water"><stop stop-color="#849699" stop-opacity=".14"/><stop offset="1" stop-color="#232c2d" stop-opacity="0"/></radialGradient>
  <filter id="${prefix}-blur"><feGaussianBlur stdDeviation="11"/></filter>
  <filter id="${prefix}-tinyblur"><feGaussianBlur stdDeviation="2.7"/></filter>
  <filter id="${prefix}-glowfilter" x="-40%" y="-50%" width="180%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
  <pattern id="${prefix}-grain" width="89" height="63" patternUnits="userSpaceOnUse"><path d="M1 29q20-8 41 2t41-1" fill="none" stroke="#d2c5b1" stroke-opacity=".016"/></pattern>
  <clipPath id="${prefix}-tableClip"><path d="M0 439H1200L1320 724H-120Z"/></clipPath>
  <linearGradient id="${prefix}-glassShine" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#fff" stop-opacity=".75"/><stop offset=".35" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity=".4"/></linearGradient>
 </defs>
 <!-- Architecture: blackened limestone and walnut panels -->
 <rect width="1200" height="720" fill="url(#${prefix}-wall)"/>
 <rect width="1200" height="405" fill="url(#${prefix}-cabinet)" opacity=".7"/>
 <rect x="40" y="35" width="1120" height="418" rx="2" fill="#0d0c0b" stroke="#6c5741" stroke-opacity=".33" stroke-width="3"/>
 <rect x="60" y="44" width="1080" height="390" fill="url(#${prefix}-cabinet)" stroke="#7d6547" stroke-opacity=".15"/>
 ${strips}
 <rect x="136" y="112" width="925" height="312" fill="#0b0b0a" stroke="#ab8857" stroke-opacity=".22" stroke-width="2"/>
 <rect x="148" y="122" width="902" height="295" fill="url(#${prefix}-backLight)"/>
 <ellipse cx="610" cy="194" rx="460" ry="171" fill="url(#${prefix}-glow)"/>
 <!-- the engraved club mark -->
 <text x="600" y="88" text-anchor="middle" font-family="Georgia,serif" font-size="39" letter-spacing="1" fill="#c5ac85" fill-opacity=".67">N° 01</text>
 <text x="600" y="102" text-anchor="middle" font-family="sans-serif" font-size="6.5" letter-spacing="4.2" fill="#9c8261" fill-opacity=".62">PRIVATE COCKTAIL ATELIER</text>
 <!-- recessed backlighting -->
 <path d="M156 127H1043" stroke="#e1b272" stroke-opacity=".65" stroke-width="3" filter="url(#${prefix}-tinyblur)"/>
 <rect x="154" y="132" width="890" height="101" fill="url(#${prefix}-backLight)"/>
 <path d="M154 258H1044" stroke="#bd8d54" stroke-opacity=".76" stroke-width="4" filter="url(#${prefix}-tinyblur)"/>
 <rect x="155" y="260" width="891" height="109" fill="url(#${prefix}-backLight)"/>
 <path d="M154 409H1044" stroke="#c7a170" stroke-opacity=".54" stroke-width="3" filter="url(#${prefix}-tinyblur)"/>
 <!-- Shelf horizontal stone and copper -->
 <rect x="154" y="234" width="890" height="17" rx="1" fill="url(#${prefix}-shelf)"/>
 <path d="M154 235H1044" stroke="#b59a6b" stroke-opacity=".57" stroke-width="2"/>
 <rect x="154" y="390" width="890" height="20" fill="url(#${prefix}-shelf)"/>
 <path d="M154 390H1044" stroke="#a78e61" stroke-opacity=".59" stroke-width="2"/>
 <path d="M810 254v143" stroke="#614c36" stroke-opacity=".5" stroke-width="3"/>
 <rect x="817" y="280" width="312" height="132" fill="#191612" fill-opacity=".62" stroke="#8e7551" stroke-opacity=".35"/>
 <text x="971" y="293" text-anchor="middle" fill="#a68c6c" fill-opacity=".7" font-size="8" font-weight="600" letter-spacing="3">GLASSWARE</text>
 ${upper}${bottom}
 <rect x="166" y="265" width="620" height="3" fill="#e8bd80" opacity=".17" filter="url(#${prefix}-tinyblur)"/>
 ${racks}
 <!-- limestone columns, visible in foreground -->
 <rect x="21" y="0" width="61" height="440" fill="#141310"/><path d="M74 0V430" stroke="#806344" stroke-opacity=".35" stroke-width="2"/>
 <rect x="1122" y="0" width="72" height="440" fill="#10100e"/><path d="M1125 0V430" stroke="#826c4f" stroke-opacity=".35" stroke-width="2"/>
 <!-- glimpse of the B1 reflecting water -->
 <ellipse cx="45" cy="372" rx="180" ry="170" fill="url(#${prefix}-water)"/>
 <path d="M8 369Q82 364 125 372M-5 381Q71 376 119 382M12 391Q81 385 139 391" stroke="#b4c7c1" stroke-opacity=".1" fill="none"/>
 <!-- Pendant lighting -->
 <path d="M282 0v83M598 0v60M918 0v81" stroke="#8c7451" stroke-width="1.8" opacity=".4"/>
 <ellipse cx="282" cy="91" rx="91" ry="89" fill="url(#${prefix}-glow)"/><ellipse cx="598" cy="68" rx="88" ry="76" fill="url(#${prefix}-glow)"/><ellipse cx="918" cy="91" rx="92" ry="89" fill="url(#${prefix}-glow)"/>
 <path d="M256 83Q282 58 308 83L303 98H261Z" fill="#211b14" stroke="#876b47" stroke-opacity=".7"/><ellipse cx="282" cy="98" rx="20" ry="3" fill="#dfac66" fill-opacity=".58"/>
 <path d="M572 61Q598 36 624 61L619 76H577Z" fill="#201911" stroke="#876b47" stroke-opacity=".7"/><ellipse cx="598" cy="76" rx="20" ry="3" fill="#e1b77b" fill-opacity=".54"/>
 <path d="M892 83Q918 58 944 83L939 98H897Z" fill="#211b14" stroke="#876b47" stroke-opacity=".7"/><ellipse cx="918" cy="98" rx="20" ry="3" fill="#dfac66" fill-opacity=".5"/>
 <!-- Back edge and projecting stone counter -->
 <path d="M0 431L1200 431L1310 720H-110Z" fill="url(#${prefix}-stone)" stroke="#aaa08c" stroke-opacity=".2"/>
 <g clip-path="url(#${prefix}-tableClip)">${stoneVeins}<rect width="1200" height="720" fill="url(#${prefix}-grain)"/><ellipse cx="590" cy="520" rx="345" ry="69" fill="#9e6d3c" opacity=".065" filter="url(#${prefix}-blur)"/></g>
 <path d="M0 438H1200" stroke="#d2b99a" stroke-opacity=".28" stroke-width="2"/>
 <path d="M-50 668H1250L1260 720H-60Z" fill="url(#${prefix}-stoneFace)"/>
 <path d="M-50 668H1250" stroke="#b1a18e" stroke-opacity=".17" stroke-width="3"/>
 <!-- Inlaid work zone ring, engravings in stone -->
 <ellipse cx="620" cy="604" rx="194" ry="71" fill="none" stroke="#8c795f" stroke-opacity=".13" stroke-width="1.8"/>
 <ellipse cx="620" cy="605" rx="161" ry="54" fill="none" stroke="#c7b293" stroke-opacity=".07" stroke-width="1" stroke-dasharray="2 5"/>
 <path d="M463 613H440 M797 613H775" stroke="#a99173" stroke-opacity=".3" stroke-width="1.2"/>
 <text x="620" y="689" text-anchor="middle" font-size="8" font-weight="600" fill="#9d8972" fill-opacity=".43" letter-spacing="5">HANDCRAFTED IN PRIVATE</text>
 <!-- Ice bucket: deep concave ellipse and individually graspable ice -->
 <g id="${prefix}-ice-bucket"><ellipse cx="218" cy="595" rx="85" ry="28" fill="#030303" opacity=".55" filter="url(#${prefix}-blur)"/>
 <path d="M151 534L163 600Q214 629 275 597L286 534Z" fill="#2d3331" stroke="#92958e" stroke-opacity=".6" stroke-width="2"/>
 <path d="M152 548L164 601Q215 624 272 601L282 548" fill="#8a9996" fill-opacity=".15"/>
 <ellipse cx="218" cy="534" rx="67" ry="22" fill="#0a1518" stroke="#c2c8be" stroke-opacity=".55" stroke-width="3"/>
 <ellipse cx="218" cy="535" rx="59" ry="16" fill="#6b8a8b" fill-opacity=".25"/>
 <g class="tool-object" data-tool="ice"><g transform="translate(190 526) rotate(-19)"><rect x="-13" y="-13" width="27" height="26" rx="4" fill="#d4e8e8" fill-opacity=".43" stroke="#d3f2ed" stroke-opacity=".8"/><path d="M-7 -8L6 -7 8 7" stroke="#fff" opacity=".62" fill="none"/></g><rect x="-0" y="0" width="1" height="1" fill="transparent"/></g>
 <g class="tool-object" data-tool="ice"><g transform="translate(223 526) rotate(13)"><rect x="-13" y="-14" width="27" height="27" rx="5" fill="#d8e6e7" fill-opacity=".42" stroke="#def1ee" stroke-opacity=".78"/><path d="M-6 -9L6 -7 8 8" stroke="#fff" opacity=".61" fill="none"/></g></g>
 <g class="tool-object" data-tool="ice"><g transform="translate(248 534) rotate(30)"><rect x="-11" y="-11" width="24" height="24" rx="4" fill="#d1e6e8" fill-opacity=".42" stroke="#d4e8e3" stroke-opacity=".78"/></g></g>
 <rect class="tool-object" data-tool="ice" x="155" y="514" width="123" height="50" fill="transparent" pointer-events="all"/>
 <text x="218" y="632" text-anchor="middle" font-size="8" fill="#9f937f" letter-spacing="2.8">ICE / 01</text></g>
 <!-- Citrus, cherries, and bar tools -->
 <ellipse cx="991" cy="607" rx="113" ry="21" fill="#020202" opacity=".5"/>
 <path d="M905 584Q992 562 1084 585L1062 603Q992 613 921 602Z" fill="#1e1d1a" stroke="#8e8171" stroke-opacity=".61" stroke-width="1.3"/>
 <ellipse cx="991" cy="585" rx="86" ry="16" fill="#161511" stroke="#a98e69" stroke-opacity=".5"/>
 <g class="tool-object" data-tool="garnish" data-garnish="rose"><g transform="translate(946 576)"><circle r="21" fill="#833d52" stroke="#c895a1" stroke-width="3"/><circle r="17" fill="#e8a64b"/><g stroke="#f8d79b" stroke-opacity=".75" stroke-width="1.2"><path d="M0 0V-17M0 0L15 -8M0 0L15 8M0 0V17M0 0L-15 9M0 0L-15 -8"/></g><circle r="2.5" fill="#ffddb1"/></g><rect x="-22" y="-22" width="44" height="44" fill="transparent" pointer-events="all" transform="translate(946 576)"/></g>
 <g class="tool-object" data-tool="garnish" data-garnish="cherry"><circle cx="1010" cy="578" r="13" fill="#942628" stroke="#e56a4f" stroke-width="1.4"/><path d="M1007 567Q1015 546 1033 558" fill="none" stroke="#6c7c39" stroke-width="2"/><circle cx="1005" cy="573" r="3" fill="#fb8c7e" opacity=".65"/><circle cx="1010" cy="578" r="22" fill="transparent" pointer-events="all"/></g>
 <g class="tool-object" data-tool="garnish" data-garnish="mint"><path d="M1046 588Q1024 567 1045 549Q1064 555 1046 588Z" fill="#526e43" stroke="#b0aa70" stroke-opacity=".7"/><path d="M1044 587Q1070 567 1062 550Q1049 556 1044 587Z" fill="#607b45"/><path d="M1047 584 1061 556M1047 579 1040 553" stroke="#c1b988" stroke-opacity=".5"/><circle cx="1050" cy="572" r="22" fill="transparent" pointer-events="all"/></g>
 <text x="991" y="632" text-anchor="middle" font-size="8" fill="#9f937f" letter-spacing="2.8">GARNISH / 03</text>
 <!-- real tools: barspoon, shaker -->
 <g class="tool-object" data-tool="spoon"><path d="M365 632L415 482" stroke="#a5a9a7" stroke-width="5" stroke-linecap="round"/><path d="M365 632L415 482" stroke="#fff" stroke-width="1" stroke-opacity=".63"/><ellipse cx="415" cy="482" rx="10" ry="16" transform="rotate(18 415 482)" fill="#929996" stroke="#e0ddd5" stroke-opacity=".75"/><rect x="365" y="478" width="64" height="155" fill="transparent" pointer-events="all"/></g>
 <g class="tool-object" data-tool="shaker"><path d="M1122 537L1114 610Q1111 620 1135 622Q1157 620 1153 610L1146 537Z" fill="#5d6261" stroke="#a8ada8" stroke-opacity=".7" stroke-width="1.5"/><path d="M1122 540H1145L1149 559H1119Z" fill="#414744" stroke="#c6c9c1" stroke-opacity=".55"/><path d="M1124 534Q1135 523 1144 534L1147 540H1120Z" fill="#5c635f" stroke="#bdbdb0" stroke-opacity=".62"/><path d="M1126 555L1122 606" stroke="#eff4ed" stroke-opacity=".43" stroke-width="4"/><rect x="1103" y="520" width="64" height="110" fill="transparent" pointer-events="all"/></g>
 ${interactive?'<g id="bar-glass-layer"></g><g id="bar-held-layer" pointer-events="none"></g>':`<g>${glassMarkup({glass:'rocks',x:688,y:628,volume:150,ice:2,garnish:'rose',color:'#a8a9b1',ingredients:{whisky:150}},prefix,false)}</g>`}
 <!-- Front lip reflection -->
 <path d="M-40 698Q580 686 1240 698" fill="none" stroke="#be9b6f" stroke-opacity=".1" stroke-width="3"/>
 </svg>`;
}
function iceMarkup(x,y,n=0){let r=(n*31)%45-22;return `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-17" y="-16" width="34" height="33" rx="6" fill="#d4e5e5" fill-opacity=".3" stroke="#eef6f4" stroke-opacity=".58" stroke-width="1.6"/><path d="M-9 -8L6 -10 11 5" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><path d="M-8 11L6 10" stroke="#9cced2" stroke-opacity=".43"/></g>`}
function glassMarkup(s,prefix,isActive=true){if(!s.glass)return '';
 const cap=GLASSES[s.glass].cap,ratio=clamp(s.volume/cap,0,1),wave=(drag&&(drag.pouring||drag.kind==='glass-move')?Math.sin(performance.now()/130)*2.6:0);
 const idattr=isActive?'id="active-glass" class="active-glass" data-glass-active="1"':'';
 const styles=`fill="url(#${prefix}-glass)" stroke="#d8e0db" stroke-opacity=".71" stroke-width="2"`;
 let glass='', liquid='', ice='',rim='',reflections='',garnish='';
 if(s.glass==='rocks'||s.glass==='highball'){
  const hi=s.glass==='rocks'?174:239,wt=s.glass==='rocks'?79:58,wb=s.glass==='rocks'?64:51;
  glass=`<path d="M-${wt} -${hi}L-${wb} -11Q-${wb-1} 0 -${wb-13} 0H${wb-13}Q${wb-1} 0 ${wb} -11L${wt} -${hi}Z" ${styles}/>`;
  const h=ratio*(hi-30),topY=-10-h,ww=wb+(wt-wb)*(h/(hi-14));
  if(ratio>0){liquid=`<path d="M-${ww} ${topY}Q0 ${topY+wave*1.2} ${ww} ${topY}L${wb-6} -12Q0 -2 -${wb-6} -12Z" fill="url(#${prefix}-liquid)" opacity=".91"/><ellipse cx="0" cy="${topY}" rx="${ww}" ry="${Math.max(5,ww*.17)}" fill="${lighten(s.color,.29)}" opacity=".8" stroke="${lighten(s.color,.55)}" stroke-opacity=".38" stroke-width="1"/>`;}
  ice=Array.from({length:Math.min(s.ice,7)},(_,i)=>iceMarkup((-1)**i * (9+(i%3)*18),-24-(i%3)*22,i)).join('');
  rim=`<ellipse cx="0" cy="-${hi}" rx="${wt}" ry="${wt*.17}" fill="#d1d9d8" fill-opacity=".045" stroke="#e9e7dc" stroke-opacity=".83" stroke-width="3"/><ellipse cx="0" cy="-${hi}" rx="${wt-5}" ry="${wt*.13}" fill="none" stroke="#ddeae4" stroke-opacity=".36" stroke-width=".9"/>`;
  reflections=`<path d="M-${wt-6} -${hi-9}L-${wb-6} -20" fill="none" stroke="#fcffff" stroke-opacity=".43" stroke-width="5" stroke-linecap="round"/><path d="M${wt-7} -${hi-6}L${wb-8} -19" fill="none" stroke="#f8ffff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round"/><path d="M-${wb-15} -8Q0 1 ${wb-15} -8" fill="none" stroke="#ecf0e8" stroke-opacity=".4" stroke-width="5"/>`;
 }else if(s.glass==='martini'){
   glass=`<path d="M-96 -205L-7 -82L-6 -16L-49 -4Q0 1 49 -4L6 -16L7 -82L96 -205Z" ${styles}/>`;
   const f=Math.cbrt(ratio),Y=-85-111*f,W=90*f;
   if(ratio>0)liquid=`<path d="M-${W} ${Y}Q0 ${Y+wave} ${W} ${Y}L0 -87Z" fill="url(#${prefix}-liquid)" opacity=".89"/><ellipse cx="0" cy="${Y}" rx="${W}" ry="${W*.125}" fill="${lighten(s.color,.3)}" fill-opacity=".75"/>`;
   rim=`<ellipse cx="0" cy="-205" rx="96" ry="12" fill="none" stroke="#e7eee9" stroke-opacity=".84" stroke-width="2.5"/>`;
   reflections=`<path d="M-87 -198L-8 -85M87 -198L9 -85" stroke="#f7ffff" stroke-opacity=".32" stroke-width="3"/><path d="M-5 -80L-5 -15" stroke="#fff" stroke-opacity=".23" stroke-width="2"/>`;
 }else{
   glass=`<path d="M-92 -198Q-85 -112 0 -106Q85 -112 92 -198L6 -104L6 -17L48 -4Q0 1 -48 -4L-6 -17L-6 -104Z" ${styles}/>`;
   const f=Math.sqrt(ratio),Y=-112-80*f,W=86*f;
   if(ratio>0)liquid=`<path d="M-${W} ${Y}Q0 ${Y+wave} ${W} ${Y}Q${W*.8} -111 0 -111Q-${W*.8} -111 -${W} ${Y}Z" fill="url(#${prefix}-liquid)" opacity=".88"/><ellipse cx="0" cy="${Y}" rx="${W}" ry="${Math.max(4,W*.13)}" fill="${lighten(s.color,.28)}" fill-opacity=".74"/>`;
   rim=`<ellipse cx="0" cy="-198" rx="92" ry="13" fill="none" stroke="#e7eee9" stroke-opacity=".84" stroke-width="2.5"/>`;
   reflections=`<path d="M-88 -192Q-82 -127 -10 -110M88 -192Q82 -127 10 -110" stroke="#f7ffff" stroke-opacity=".31" stroke-width="3"/><path d="M-5 -107L-5 -15" stroke="#fff" stroke-opacity=".24" stroke-width="2"/>`;
 }
 if(false)garnish=`<g transform="translate(68 ${s.glass==='rocks'?'-163':'-193'}) rotate(-27)"><circle r="25" fill="#ac5721" stroke="#ffba62" stroke-width="2"/><circle r="20" fill="#df963a"/><g stroke="#ffe1a7" stroke-width="1.1"><path d="M0-19V19M-19 0H19M-13 -13L13 13M-13 13L13 -13"/></g><circle r="3" fill="#f5d49c"/></g>`;
 if(s.garnish==='cherry')garnish=`<g><path d="M15 -${s.glass==='rocks'?197:220}q12 -33 36 -15" stroke="#618142" stroke-width="3" fill="none"/><circle cx="18" cy="-${s.glass==='rocks'?185:206}" r="15" fill="#9a2528" stroke="#d94e3a" stroke-width="1.5"/><ellipse cx="12" cy="-${s.glass==='rocks'?189:210}" rx="4" ry="3" fill="#d98c7b"/></g>`;
 if(s.garnish==='mint')garnish=`<g transform="translate(31 -${s.glass==='rocks'?175:216})"><path d="M0 22Q-26 -9 -7 -34Q21 -23 0 22Z" fill="#42683f" stroke="#a6a67b" stroke-opacity=".5"/><path d="M0 22Q19 -11 30 -25Q38 8 0 22Z" fill="#5f7945"/><path d="M0 22L-7 -31M0 22L30 -25" stroke="#b5ba79" stroke-opacity=".4"/></g>`;
 return `<g ${idattr} transform="translate(${s.x} ${s.y})"><ellipse cx="0" cy="9" rx="82" ry="15" fill="#050504" opacity=".65"/><ellipse cx="0" cy="9" rx="57" ry="7" fill="#c0a17f" opacity=".09"/>${glass}${liquid}${ice}${reflections}${rim}${garnish}<rect x="-90" y="-${s.glass==='rocks'?180:243}" width="180" height="${s.glass==='rocks'?181:245}" fill="transparent" pointer-events="all"/></g>`;
}
let barSvg,drag=null,raf=0,prevTime=0;
function renderGlass(){if(!barSvg)return;const layer=barSvg.querySelector('#bar-glass-layer');if(layer){if(state.session.glass){state.session.color=getColor();layer.innerHTML=glassMarkup(state.session,'bar',true)}else layer.innerHTML=`<g pointer-events="none"><ellipse cx="620" cy="635" rx="108" ry="23" stroke="#b9a17e" stroke-opacity=".32" stroke-dasharray="4 8" fill="none"/><path d="M620 582v39m-19-19h38" stroke="#a58e70" stroke-opacity=".48" stroke-width="1.4"/><text x="620" y="661" text-anchor="middle" fill="#a9987d" font-size="9" letter-spacing="2.5">PLACE GLASSWARE HERE</text></g>`;const top=barSvg.querySelector('#bar-liquid-top'),btm=barSvg.querySelector('#bar-liquid-bottom');if(top){top.setAttribute('stop-color',lighten(state.session.color,.37));btm.setAttribute('stop-color',darken(state.session.color,.38))}}}
function renderHeld(){if(!barSvg)return;const layer=barSvg.querySelector('#bar-held-layer');if(!layer)return;if(!drag||!['bottle','pour-selected','ice','garnish','spoon','shaker'].includes(drag.kind)){layer.innerHTML='';return}let svg='';
 if(drag.kind==='bottle'||drag.kind==='pour-selected'){const d=byId(drag.id);if(!d)return;const pouring=drag.pouring;const dx=drag.kind==='pour-selected'?state.session.x-166:drag.x,dy=drag.kind==='pour-selected'?state.session.y-132:drag.y;
 const tilt=pouring?68:12;
 svg+=`<g transform="translate(${dx} ${dy}) rotate(${tilt}) scale(1.56)">${bottleShape(d,'bar',1)}</g>`;
 if(pouring){const rimY=state.session.y-(state.session.glass==='rocks'?170:state.session.glass==='highball'?230:200);const sx=dx+65,sy=dy-75;
 svg+=`<path d="M${sx} ${sy}Q${(sx+state.session.x)/2} ${rimY-45} ${state.session.x+7} ${rimY+4}" fill="none" stroke="${lighten(d.color,.35)}" stroke-width="5" stroke-linecap="round" opacity=".84"/><path d="M${sx+2} ${sy}Q${(sx+state.session.x)/2+3} ${rimY-45} ${state.session.x+9} ${rimY+4}" fill="none" stroke="#ffe2b0" stroke-opacity=".47" stroke-width="1.5"/>`}
 }else if(drag.kind==='ice'){svg+=iceMarkup(drag.x,drag.y,1)}
 else if(drag.kind==='garnish'){svg+=`<g transform="translate(${drag.x} ${drag.y})"><circle r="22" fill="${drag.id==='mint'?'#597442':drag.id==='cherry'?'#ac3235':'#bd712b'}" stroke="#e9c58d" stroke-opacity=".8" stroke-width="2"/></g>`}
 else if(drag.kind==='spoon'){svg+=`<g transform="translate(${drag.x} ${drag.y}) rotate(37)"><path d="M0 60V-100" stroke="#cad0ca" stroke-width="6"/><ellipse cy="-110" rx="13" ry="19" fill="#858e8b" stroke="#d5d2c9"/></g>`;if(drag.circleCount>0&&state.session.glass)svg+=`<ellipse cx="${state.session.x}" cy="${state.session.y-70}" rx="50" ry="10" fill="none" stroke="#dec090" stroke-opacity=".5" stroke-width="2" stroke-dasharray="7 5"/>`}
 else if(drag.kind==='shaker')svg+=`<g transform="translate(${drag.x} ${drag.y}) rotate(${(drag.shifts||0)%2?15:-15})"><path d="M-25 -72H25L18 15Q0 32 -18 15Z" fill="#6e7772" stroke="#d7dad2" stroke-opacity=".6" stroke-width="2"/><path d="M-21 -77H21V-60H-21Z" fill="#4c5551"/><path d="M-19 -54L-14 15" stroke="#eff9f7" stroke-opacity=".3" stroke-width="5"/></g>`;
 layer.innerHTML=svg;
}
function svgPoint(e){const m=barSvg.getScreenCTM();if(!m)return{x:0,y:0};const pt=barSvg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const p=pt.matrixTransform(m.inverse());return{x:p.x,y:p.y}}
function nearGlass(x,y,threshold=117){const s=state.session;if(!s.glass)return false;const targetY=s.y-(s.glass==='rocks'?155:s.glass==='highball'?213:184);return Math.hypot(x-s.x,(y-62)-targetY)<threshold}
function glassHit(x,y){const s=state.session;return s.glass&&Math.abs(x-s.x)<125&&Math.abs(y-(s.y-110))<150}
function setSelected(id){if(!byId(id))return;state.session.selected=id;helper(`${byId(id).name} · 将酒瓶拖至杯口，或在杯口长按倾倒。`,false,4100);updateHUD();persist()}
function startDrag(kind,e,extras={}){if(!barSvg)return;const p=svgPoint(e);drag={kind,x:p.x,y:p.y,startX:p.x,startY:p.y,startTime:performance.now(),pointerId:e.pointerId,moved:false,pouring:false,added:0,circleCount:0,...extras};barSvg.setPointerCapture(e.pointerId);e.preventDefault();renderHeld()}
function onSceneDown(e){if(!barSvg)return;const p=svgPoint(e);const bottle=e.target.closest('[data-bottle]'),rack=e.target.closest('[data-glass]'),tool=e.target.closest('[data-tool]'),glass=e.target.closest('[data-glass-active]');
 if(rack){startDrag('glass-new',e,{id:rack.dataset.glass});helper(`正在取用 ${GLASSES[rack.dataset.glass].name}，拖向中央台面。`);return}
 if(bottle){if(!state.session.glass){toast('请先从右侧杯架取出酒杯');return}setSelected(bottle.dataset.bottle);startDrag('bottle',e,{id:bottle.dataset.bottle});return}
 if(tool){if(!state.session.glass){toast('请先取一只酒杯');return}const kind=tool.dataset.tool;startDrag(kind,e,{id:tool.dataset.garnish||kind,lastAngle:null,accAngle:0,lastX:p.x,shifts:0});if(kind==='ice')helper('将冰块拖入杯中，松手即可落下。');if(kind==='spoon')helper('将吧勺移到杯中，绕着杯子画圈搅拌。');if(kind==='shaker')helper('按住雪克壶，左右往返摇动。');return}
 if(glass){if(state.session.selected&&p.y<state.session.y-55){startDrag('pour-selected',e,{id:state.session.selected});helper('持续按住杯口，酒液将随时间倒入。');return}startDrag('glass-move',e,{offsetX:p.x-state.session.x,offsetY:p.y-state.session.y});helper('正在移动酒杯。松手后停留在台面上。');return}
}
function onSceneMove(e){if(!drag||drag.pointerId!==e.pointerId)return;const p=svgPoint(e);drag.x=p.x;drag.y=p.y;drag.moved ||= Math.hypot(p.x-drag.startX,p.y-drag.startY)>9;
 if(drag.kind==='glass-move'){state.session.x=clamp(p.x-drag.offsetX,430,815);state.session.y=clamp(p.y-drag.offsetY,555,655);renderGlass()}
 if(drag.kind==='glass-new'){if(drag.moved)helper(`松手放置 ${GLASSES[drag.id].name}。`)}
 if(drag.kind==='bottle'){drag.pouring=nearGlass(p.x,p.y);if(drag.pouring&&!drag.lastPourAt)drag.lastPourAt=performance.now();if(!drag.pouring)drag.lastPourAt=null}
 if(drag.kind==='ice'||drag.kind==='garnish'){drag.near=glassHit(p.x,p.y)}
 if(drag.kind==='spoon'&&state.session.glass){const cx=state.session.x,cy=state.session.y-100;if(Math.hypot(p.x-cx,p.y-cy)<140){const angle=Math.atan2(p.y-cy,p.x-cx);if(drag.lastAngle!==null){let delta=angle-drag.lastAngle;while(delta>Math.PI)delta-=2*Math.PI;while(delta<-Math.PI)delta+=2*Math.PI;drag.accAngle+=Math.abs(delta);drag.circleCount=Math.floor(drag.accAngle/(Math.PI*1.35))}drag.lastAngle=angle}else drag.lastAngle=null}
 if(drag.kind==='shaker'){if(Math.abs(p.x-(drag.lastX||p.x))>12){const dir=Math.sign(p.x-drag.lastX);if(drag.lastDir&&dir!==drag.lastDir)drag.shifts++;drag.lastDir=dir;drag.lastX=p.x}}
 if(drag.kind==='pour-selected'){drag.pouring=true;if(!drag.lastPourAt)drag.lastPourAt=performance.now()}
 renderHeld();}
function onSceneUp(e){if(!drag||drag.pointerId!==e.pointerId)return;const d=drag,p=svgPoint(e),s=state.session;
 if(d.kind==='glass-new'){
  if(!s.glass||s.volume===0){if(!s.glass)state.sessions=(state.sessions||0)+1;s.glass=d.id;s.x=620;s.y=626;if(s.volume===0){s.ingredients={};s.ice=0;s.garnish=null;s.stirs=0;s.shakes=0}s.volume=sumVolume();ding();toast(`${GLASSES[d.id].name} 已放置到操作台`)}else{toast('当前杯中已有酒液。请保存或清空后换杯。')}
 }else if(d.kind==='bottle'){
  if(!d.moved){setSelected(d.id);toast(`${byId(d.id).name} 已选中 · 在酒杯上按住可倒酒`)}else if(d.added<1){helper('将瓶口靠近酒杯，稍作停留即可倒酒。',true,2800)}
 }else if(d.kind==='ice'){
  if(d.near||glassHit(p.x,p.y)){s.ice=Math.min(7,s.ice+1);ding('ice');toast(`加入冰块 · ${s.ice}`)}else if(!d.moved){helper('从冰桶按住冰块，拖动到酒杯中。',true,2300)}
 }else if(d.kind==='garnish'){
  if(d.near||glassHit(p.x,p.y)){s.garnish=d.id;ding();toast(`${{rose:'Rose · 玫瑰',mint:'Mint · 薄荷',cherry:'Cherry · 樱桃'}[d.id]} 装饰已放入`)}else if(!d.moved)toast('将装饰拖至酒杯上方即可添加');
 }else if(d.kind==='spoon'){
  if(d.circleCount>=1){s.stirs+=d.circleCount;ding();toast(`已搅拌 ${d.circleCount} 圈`)}else if(!d.moved)helper('按住吧勺，移到杯中并画圈搅拌。',true,2300);else toast('继续绕圈搅拌，直至完成一圈');
 }else if(d.kind==='shaker'){
  if(d.shifts>=3){s.shakes++;ding();toast(`摇酒完成 · ${d.shifts} 次往返`)}else toast('左右来回摇动雪克壶至少三次');
 }else if(d.kind==='glass-move'){if(s.volume===0&&s.x>780&&s.y<575){s.glass=null;toast('已归还空酒杯')}else ding()}
 if(d.kind==='pour-selected'&&d.added<1&&s.glass){/* short taps remain non-pouring: hold is required */helper('长按杯口，让酒液连续注入。',true,2200)}
 drag=null;renderHeld();s.volume=sumVolume();s.color=getColor();renderGlass();updateHUD();defaultHelper();persist();}
function cancelScene(e){if(!drag)return;drag=null;renderHeld();renderGlass();updateHUD()}
function frame(t){if(drag&&drag.pouring&&['bottle','pour-selected'].includes(drag.kind)&&state.session.glass){const d=byId(drag.id),s=state.session,elapsed=Math.min(45,t-(prevTime||t));if(d&&t-(drag.lastPourAt||t)>210){const cap=GLASSES[s.glass].cap,old=sumVolume();const amount=Math.min(cap-old,elapsed*.057);if(amount>0){s.ingredients[d.id]=(s.ingredients[d.id]||0)+amount;drag.added+=amount;s.volume=sumVolume();s.color=getColor();renderGlass();updateHUD();if(drag.added>3)helper(`${d.name} · ${Math.round(drag.added)} ML 倒入中…`)}else if(old>=cap){drag.pouring=false;helper('酒杯已满，请保存或清空当前饮品。',false,3500)}}}prevTime=t;requestAnimationFrame(frame)}
function initScene(){
 $('#home-scene').innerHTML=sceneSVG('home',false);
 $('#bar-scene').innerHTML=sceneSVG('bar',true);
 barSvg=$('#bar-scene-svg');barSvg.addEventListener('pointerdown',onSceneDown);barSvg.addEventListener('pointermove',onSceneMove);barSvg.addEventListener('pointerup',onSceneUp);barSvg.addEventListener('pointercancel',cancelScene);barSvg.addEventListener('lostpointercapture',cancelScene);
 renderGlass();updateHUD();defaultHelper();requestAnimationFrame(frame);
}
function updateHUD(){const s=state.session;const cap=s.glass?GLASSES[s.glass].cap:280;s.volume=sumVolume();
 $('#current-title').textContent=s.glass?GLASSES[s.glass].name+' Glass':'An empty canvas';
 $('#status-detail').textContent=s.glass?`${GLASSES[s.glass].cn} · ${s.ice} ice · ${Object.keys(s.ingredients).length} ingredients`:'Choose your glass to begin';
 $('#level-meter').style.width=(s.glass?clamp(s.volume/cap*100,0,100):0)+'%';
 $('#volume-display').innerHTML=String(s.volume).padStart(3,'0')+'<small>ML / '+cap+'</small>';
 $('#selected-tip').textContent=s.selected?`${byId(s.selected)?.name.toUpperCase()||''} · HOLD TO POUR`:'SELECT A BOTTLE TO POUR';
 $('#status-abv').textContent=s.volume?`· ~${estimatedABV(s)}% ABV`:'';
 $('#tool-count').textContent=`ICE ${s.ice.toString().padStart(2,'0')} / STIR ${s.stirs.toString().padStart(2,'0')}`;
 $('#btn-save').disabled=!s.glass||s.volume<5;
 $('#btn-recipe').disabled=!s.glass;
 $('#continue-btn').style.display=s.glass?'inline-flex':'none';
}
/* Ingredient and archive data UI */
function drinkThumb(d){const color=d.color;const w=d.shape==='square'?30:26;return `<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="thumb-${d.id}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${lighten(color,.5)}" stop-opacity=".8"/><stop offset=".22" stop-color="${color}" stop-opacity=".94"/><stop offset=".75" stop-color="${darken(color,.45)}" stop-opacity=".91"/><stop offset="1" stop-color="${lighten(color,.48)}" stop-opacity=".78"/></linearGradient><linearGradient id="label-${d.id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#29241e"/><stop offset="1" stop-color="#10100e"/></linearGradient></defs><ellipse cx="60" cy="195" rx="35" ry="7" fill="#000" opacity=".5"/><path d="M51 55V25H69V55Q${60+w} 65 ${60+w} 87V181Q${60+w} 190 77 191H43Q${60-w} 190 ${60-w} 181V87Q${60-w} 65 51 55Z" fill="url(#thumb-${d.id})" stroke="#e2d9cc" stroke-opacity=".33" stroke-width="2"/><rect x="49" y="20" width="22" height="22" rx="2" fill="#393027" stroke="#9b8667"/><rect x="${60-w+7}" y="112" width="${2*w-14}" height="56" rx="2" fill="url(#label-${d.id})" stroke="#c1a47d" stroke-opacity=".74"/><path d="M${60-w+14} 123H${60+w-14}" stroke="#bba47f" stroke-opacity=".53"/><text x="60" y="141" fill="#e7dac7" font-family="Georgia,serif" font-size="${d.name.length>14?7:9}" text-anchor="middle">${esc(d.name.length>18?d.name.slice(0,15):d.name)}</text><text x="60" y="153" fill="#9a8260" font-size="6" text-anchor="middle" letter-spacing="1.5">N° 01</text><path d="M${60-w+6} 89V175" stroke="#fff" stroke-opacity=".42" stroke-width="4" stroke-linecap="round"/><path d="M${60+w-6} 91V178" stroke="#fff" stroke-opacity=".19" stroke-width="3"/></svg>`}
let cellarCategory='all';
function renderCellar(){const query=$('#cellar-search').value.trim().toLowerCase();const products=DRINKS.filter(d=>(cellarCategory==='all'||d.cat===cellarCategory)&&(!query||[d.name,d.label,d.cn,d.notes,d.origin].some(v=>v.toLowerCase().includes(query))));$('#cellar-count').textContent=DRINKS.length.toString().padStart(2,'0');$('#cellar-grid').innerHTML=products.length?products.map((d,i)=>`<button class="cellar-card" data-drink="${d.id}" aria-label="查看 ${esc(d.name)} 详情"><div class="cellar-art"><span class="cellar-number">N° ${String(DRINKS.indexOf(d)+1).padStart(3,'0')}</span>${drinkThumb(d)}</div><div class="cellar-card-text"><small>${d.cat.toUpperCase()} · ${d.abv}% ABV</small><h3>${esc(d.name)}</h3><p>${esc(d.cn)}</p><div class="cellar-item-bottom"><span>${esc(d.origin)}</span><span>VIEW +</span></div></div></button>`).join(''):'<div class="empty-state" style="grid-column:1/-1">没有找到匹配的酒品。试试其他名称或分类。</div>';$$('[data-drink]').forEach(b=>b.addEventListener('click',()=>showDrink(b.dataset.drink)))}
function showDrink(id){const d=byId(id);if(!d)return;$('#detail-content').innerHTML=`<div class="detail-illustration">${drinkThumb(d)}</div><div class="eyebrow">${d.cat.toUpperCase()} / ${esc(d.label.toUpperCase())}</div><h2>${esc(d.name)}</h2><p class="detail-description">${esc(d.cn)}<br>${esc(d.description)}</p><dl class="detail-dl"><div><dt>ORIGIN</dt><dd>${esc(d.origin)}</dd></div><div><dt>ALCOHOL</dt><dd>${d.abv}% ABV</dd></div><div style="grid-column:1/-1"><dt>TASTING NOTES</dt><dd>${esc(d.notes)}</dd></div></dl><button class="solid-btn detail-use" id="detail-use">USE AT THE BAR ${iconMarkup('arrow')}</button>`;$('#detail-overlay').classList.add('open');$('#detail-use').addEventListener('click',()=>{closeDetail();navigate('bar');if(!state.session.glass){toast('先从右侧杯架取一只酒杯');helper(`${d.name} 已选中。先选择酒杯，随后长按杯口倒酒。`)}setSelected(id)})}
function closeDetail(){$('#detail-overlay').classList.remove('open')}
$('#detail-close').addEventListener('click',closeDetail);$('#detail-overlay').addEventListener('pointerdown',e=>{if(e.target===$('#detail-overlay'))closeDetail()});
$('#cellar-search').addEventListener('input',renderCellar);$$('[data-category]').forEach(b=>b.addEventListener('click',()=>{cellarCategory=b.dataset.category;$$('[data-category]').forEach(v=>v.classList.toggle('active',v===b));renderCellar()}));
function openDrawer(mode='mixers'){const items=mode==='glass'?Object.entries(GLASSES).map(([id,g])=>({id,name:g.name,cn:g.cn,mark:({rocks:'▯',highball:'▮',martini:'▽',coupe:'⌣'})[id]})):mode==='garnish'?[
 {id:'rose',name:'Rose',cn:'玫瑰',mark:'❀'},{id:'cherry',name:'Cherry',cn:'樱桃',mark:'●'},{id:'mint',name:'Mint',cn:'薄荷叶',mark:'❧'}
 ]:DRINKS.filter(d=>d.cat==='mixer').map(d=>({id:d.id,name:d.name,cn:d.cn,mark:d.id==='bitters'?'⌁':d.id==='soda'||d.id==='tonic'?'◌':'◍'}));
 $('#ingredients-drawer').querySelector('h2').textContent=mode==='glass'?'Glassware / Choose a Glass':mode==='garnish'?'Finish & Garnish':'Mixers & Ingredients';$('#ingredient-list').innerHTML=items.map(d=>`<button class="ingredient-tile" data-ingredient="${d.id}"><div class="ingredient-icon">${d.mark}</div><div class="ingredient-name">${esc(d.name)}</div><div class="ingredient-sub">${esc(d.cn)}</div></button>`).join('');$('#drawer-shade').classList.add('open');$('#ingredients-drawer').classList.add('open');$$('[data-ingredient]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.ingredient;closeDrawer();if(!state.session.glass&&mode!=='glass'){toast('先从杯架取一个酒杯');return}if(mode==='glass'){if(state.session.volume>GLASSES[id].cap){toast('新杯容量不足，请选择容量更大的酒杯');return}if(!state.session.glass)state.sessions=(state.sessions||0)+1;state.session.glass=id;state.session.x=620;state.session.y=626;renderGlass();defaultHelper();ding();toast(GLASSES[id].name+' 已放置到操作台')}else if(mode==='garnish'){state.session.garnish=id;toast('装饰已放入酒杯 · '+id);renderGlass();persist()}else{setSelected(id);helper(`已选择 ${byId(id)?.name}。在杯口按住即可倒入。`,false,3800)}updateHUD()}))}
function closeDrawer(){$('#drawer-shade').classList.remove('open');$('#ingredients-drawer').classList.remove('open')}
$('#drawer-shade').addEventListener('click',closeDrawer);$('#drawer-close').addEventListener('click',closeDrawer);
$('#btn-mixers').addEventListener('click',()=>openDrawer('mixers'));
$('#btn-glasses').addEventListener('click',()=>openDrawer('glass'));
$('#btn-garnish').addEventListener('click',()=>openDrawer('garnish'));
const isCompact=()=>window.matchMedia('(max-width:750px)').matches;
$('#btn-ice').addEventListener('click',()=>{if(isCompact()){if(!state.session.glass)return toast('请先选择酒杯');state.session.ice=Math.min(7,state.session.ice+1);ding('ice');renderGlass();updateHUD();persist();toast('冰块已放入 · '+state.session.ice);return}helper('按住吧台左侧冰桶中的冰块，拖进酒杯。',false,4000);toast('ICE / 从左侧冰桶拖动冰块')});
$('#btn-stir').addEventListener('click',()=>{if(isCompact()){if(!state.session.glass)return toast('请先选择酒杯');state.session.stirs++;ding();renderGlass();updateHUD();persist();toast('已搅拌一圈');return}helper('按住吧勺，移入杯内，绕圈搅拌。',false,4000);toast('STIR / 拖动吧勺绕圈')});
$('#btn-shake').addEventListener('click',()=>{if(isCompact()){if(!state.session.glass)return toast('请先选择酒杯');state.session.shakes++;ding();updateHUD();persist();toast('已完成一次摇酒');return}helper('按住右侧金属雪克壶，左右往返摇动至少三次。',false,4000);toast('SHAKE / 左右往返摇动')});
$('#sound-toggle').addEventListener('click',()=>{state.sound=!state.sound;$('#sound-toggle').style.color=state.sound?'#a99e92':'#4a4640';toast(state.sound?'音效已开启':'音效已关闭');persist()});
function archiveCardSvg(item){if(item.preview)return '<img class="archive-preview" loading="lazy" alt="" src="'+esc(item.preview)+'">';return `<svg viewBox="0 0 220 225" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ar-${item.id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${lighten(item.color,.3)}"/><stop offset="1" stop-color="${darken(item.color,.35)}"/></linearGradient><linearGradient id="glass-ar-${item.id}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#f3ffff" stop-opacity=".36"/><stop offset=".48" stop-color="#d3e4e6" stop-opacity=".04"/><stop offset="1" stop-color="#edffff" stop-opacity=".41"/></linearGradient></defs><ellipse cx="110" cy="205" rx="66" ry="9" fill="#000" opacity=".48"/>${item.glass==='martini'?`<path d="M31 30 101 131v55l-40 12h98l-40-12v-55l70-101Z" fill="url(#glass-ar-${item.id})" stroke="#e2e4dd" stroke-opacity=".75" stroke-width="2"/><path d="M45 47h130L110 133Z" fill="url(#ar-${item.id})" opacity=".9"/><ellipse cx="110" cy="30" rx="79" ry="12" fill="none" stroke="#e6e5de" stroke-width="2"/>`:item.glass==='coupe'?`<path d="M32 45Q35 133 110 135Q185 133 188 45H116v140l38 11H65l38-11V45Z" fill="url(#glass-ar-${item.id})" stroke="#e2e4dd" stroke-opacity=".75" stroke-width="2"/><path d="M36 63Q43 124 110 128Q177 124 184 63Z" fill="url(#ar-${item.id})" opacity=".9"/><ellipse cx="110" cy="45" rx="79" ry="12" fill="none" stroke="#e6e5de" stroke-width="2"/>`:`<path d="M${item.glass==='highball'?72:57} ${item.glass==='highball'?8:54}L${item.glass==='highball'?78:72} 197Q110 211 ${item.glass==='highball'?142:148} 197L${item.glass==='highball'?148:163} ${item.glass==='highball'?8:54}Z" fill="url(#glass-ar-${item.id})" stroke="#e2e4dd" stroke-opacity=".75" stroke-width="2"/><path d="M${item.glass==='highball'?77:67} ${item.glass==='highball'?82:113}H${item.glass==='highball'?143:153}L145 193Q110 201 75 193Z" fill="url(#ar-${item.id})" opacity=".91"/><ellipse cx="110" cy="${item.glass==='highball'?8:54}" rx="${item.glass==='highball'?38:53}" ry="9" fill="none" stroke="#e6e5de" stroke-width="2"/>`}${false?'<circle cx="159" cy="64" r="16" fill="#cc7b2a" stroke="#f9bc75" stroke-width="3"/>':''}</svg>`}
function renderArchive(){const arr=state.archive;$('#archive-count').textContent=String(arr.length).padStart(2,'0');$('#archive-items').innerHTML=arr.length?`<div class="archive-grid">${arr.map((item,i)=>`<article class="archive-card"><div class="archive-visual">${archiveCardSvg(item)}</div><div class="archive-card-content"><small>CREATION / ${String(i+1).padStart(3,'0')} · ${esc(item.date||'PRIVATE')}</small><h3>${esc(item.name)}</h3><p>${esc(item.recipe.map(v=>v.name).join(' · ')||'Unspecified')}</p><div class="archive-controls"><button data-remake="${item.id}">REMAKE ↗</button><span style="font:11px Georgia,serif;color:#a99683;padding:9px 0">${Math.round(item.volume)} ML</span><button data-delete="${item.id}" aria-label="删除配方">DELETE</button></div></div></article>`).join('')}</div>`:`<div class="archive-empty"><div class="empty-sigil">N° 01</div><span class="eyebrow">YOUR FIRST CREATION AWAITS</span><h2>Nothing saved. Yet.</h2><p>Every remarkable drink starts with an empty glass. Make something your own and save it here.</p><button class="solid-btn" data-go="bar">START MIXING ${iconMarkup('arrow')}</button></div>`;
 $('#archive-items').querySelectorAll('[data-go]').forEach(e=>e.addEventListener('click',()=>navigate(e.dataset.go)));
 $('#archive-items').querySelectorAll('[data-remake]').forEach(e=>e.addEventListener('click',()=>{const item=state.archive.find(a=>a.id===e.dataset.remake);if(!item)return;state.session={...DEFAULT_SESSION(),glass:item.glass,decorations:(item.decorations||[]).map(d=>({...d})),ingredients:Object.fromEntries(item.recipe.map(a=>[a.id,a.ml])),volume:item.volume,ice:item.ice,stirs:item.stirs,shakes:item.shakes,garnish:item.garnish,decorations:item.decorations||[],color:item.color};state.session.selected=null;persist();navigate('bar');toast(`重新调制 · ${item.name}`)}));
 $('#archive-items').querySelectorAll('[data-delete]').forEach(e=>e.addEventListener('click',()=>{const item=state.archive.find(a=>a.id===e.dataset.delete);if(!item)return;openModal('delete',{item})}));
}
function recipeRows(){const s=state.session,entries=Object.entries(s.ingredients).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);return `<div style="margin:15px 0;border-top:1px solid #3f372e">${entries.map(([id,vol])=>`<div style="padding:12px 0;border-bottom:1px solid #342d27;display:flex;align-items:center;justify-content:space-between;gap:10px"><span style="color:#d6c6b4">${esc(byId(id)?.name||id)}</span><b style="color:#baa286;font-weight:500">${Math.round(vol)} ML</b></div>`).join('')}<div style="padding:12px 0;color:#84796d;font-size:11px">${GLASSES[s.glass]?.name||'—'} · Ice ×${s.ice} · Stir ×${s.stirs} · Shake ×${s.shakes} · ${s.garnish||'No garnish'}</div></div>`}
let modalAction=()=>{};
function openModal(mode,data={}){
 const input=$('#modal-input'),confirm=$('#modal-confirm'),cancel=$('#modal-cancel'),title=$('#modal-title'),desc=$('#modal-description');input.style.display='block';cancel.style.display='';confirm.style.display='';
 if(mode==='save'){
  title.textContent='Name your creation';desc.textContent=`${state.session.volume} ml · ${Object.keys(state.session.ingredients).length} ingredients · ${GLASSES[state.session.glass]?.name||'Glass'}. Your personal recipe will be preserved.`;input.style.display='block';input.value=`No. ${String(state.archive.length+1).padStart(3,'0')}`;confirm.textContent='SAVE RECIPE';modalAction=()=>saveCreation(input.value.trim());
 }else if(mode==='recipe'){
  title.textContent='Current recipe';desc.innerHTML=state.session.volume?recipeRows():'Choose a glass and start pouring.';input.style.display='none';cancel.style.display='none';confirm.textContent='CLOSE';modalAction=()=>{};
 }else if(mode==='reset'){
  title.textContent='Clear the bar?';desc.textContent='Your unfinished cocktail will be cleared. Saved creations in The Archive are unaffected.';input.style.display='none';confirm.textContent='CLEAR GLASS';modalAction=()=>{state.session=DEFAULT_SESSION();renderGlass();updateHUD();defaultHelper();persist();toast('操作台已清空')};
 }else if(mode==='delete'){
  title.textContent='Remove this record?';desc.textContent=`Delete “${data.item.name}” from The Archive? This cannot be undone.`;input.style.display='none';confirm.textContent='DELETE RECORD';modalAction=()=>{state.archive=state.archive.filter(a=>a.id!==data.item.id);persist();renderArchive();toast('作品已从档案中移除')};
 }else if(mode==='info'){
  title.textContent='How to mix';desc.innerHTML=`<div style="color:#c5b6a6;font-size:12px;line-height:2.3">01 &nbsp; 拖动右侧杯架上的杯子到中央。<br>02 &nbsp; 从后方酒柜拖酒瓶至杯口，停留倒酒。<br>03 &nbsp; 点击酒瓶后，也可在酒杯上长按倾倒。<br>04 &nbsp; 从左侧拖入冰块；从右侧拖入装饰。<br>05 &nbsp; 拿起吧勺绕圈搅拌，或左右摇动雪克壶。<br>06 &nbsp; 保存到 The Archive，可随时重新制作。<br><br><span style="color:#847565">桌面端支持鼠标，iPad / 手机支持触屏。液面及操作采用实时视觉模拟。</span></div>`;input.style.display='none';cancel.style.display='none';confirm.textContent='UNDERSTOOD';modalAction=()=>{};
 }else if(mode==='profile'){
  title.textContent='Your private page';desc.textContent='轻点头像或横幅，选择系统相册里的图片。姓名可以直接在原位置编辑，按完成或收起键盘后自动保存。';input.style.display='none';cancel.style.display='none';confirm.textContent='CLOSE';modalAction=()=>{};
 }
 $('#modal-backdrop').classList.add('open');if(mode==='save')setTimeout(()=>{input.focus();input.select()},60)
}
function closeModal(){$('#modal-backdrop').classList.remove('open')}
$('#modal-cancel').addEventListener('click',closeModal);$('#modal-confirm').addEventListener('click',()=>{const action=modalAction;closeModal();action()});$('#modal-input').addEventListener('keydown',e=>{if(e.key==='Enter')$('#modal-confirm').click()});$('#modal-backdrop').addEventListener('click',e=>{if(e.target===$('#modal-backdrop'))closeModal()});
$('#btn-recipe').addEventListener('click',()=>openModal('recipe'));$('#btn-save').addEventListener('click',()=>{if(state.session.volume>=5)openModal('save')});$('#reset-btn').addEventListener('click',()=>openModal('reset'));$('#bar-info').addEventListener('click',()=>openModal('info'));
function saveCreation(name){const s=state.session;if(!s.glass||s.volume<5){toast('请先调制至少 5 ML 酒液');return}const item={id:'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:(name||`No. ${String(state.archive.length+1).padStart(3,'0')}`).slice(0,50),date:new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}).toUpperCase(),glass:s.glass,volume:s.volume,ice:s.ice,stirs:s.stirs,shakes:s.shakes,garnish:s.garnish,decorations:(s.decorations||[]).map(d=>({...d})),preview:window.N01Scene?.capture?.()||null,color:s.color,recipe:Object.entries(s.ingredients).filter(([,ml])=>ml>0).map(([id,ml])=>({id,ml:Math.round(ml),name:byId(id)?.name||id}))};state.archive.unshift(item);persist();toast(`作品已保存 · ${item.name}`);navigate('archive')}
window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDrawer();closeDetail()}});
/* Profile: monochrome editorial atmosphere, native image picker and persistent user data. */
function defaultCoverSvg(){
 const fineBranches=Array.from({length:28},(_,i)=>{const x=70+i*12,y=24+i%5*7,endX=x+(i%2?60:-66),endY=136+(i%7)*12;return `<path d="M${x} ${y}Q${x+20} ${y+40} ${endX} ${endY}" stroke="#373b3b" stroke-width="${i%3===0?2:1}" stroke-opacity="${.13+(i%4)*.05}" fill="none"/>`}).join('');
 const willow=Array.from({length:75},(_,i)=>{const theta=i*2.399,rad=15+Math.sqrt(i)*23,cx=270+Math.cos(theta)*rad,cy=20+Math.sin(theta)*rad*.47;return `<path d="M${cx.toFixed(1)} ${cy.toFixed(1)}q${(i%3-1)*15} 45 ${(i%5-2)*8} ${75+(i%6)*11}" fill="none" stroke="#404542" stroke-width="${i%9===0?3:1.1}" stroke-opacity="${.08+(i%4)*.042}"/>`}).join('');
 return `<svg viewBox="0 0 1100 350" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="雾中水岸与垂柳"><defs><linearGradient id="coverFog" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d2d5d1"/><stop offset=".54" stop-color="#f2f2ed"/><stop offset="1" stop-color="#c3c7c3"/></linearGradient><radialGradient id="coverMist"><stop stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><filter id="coverBlur"><feGaussianBlur stdDeviation="15"/></filter><filter id="coverNoise"><feTurbulence baseFrequency=".37" numOctaves="3" seed="4" result="n"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".08"/></feComponentTransfer></filter></defs><rect width="1100" height="350" fill="url(#coverFog)"/><path d="M0 270Q230 226 466 260T1100 240V350H0Z" fill="#8d9692" opacity=".22"/><path d="M-50 45Q105 -54 291 -15Q386 7 497 47" fill="none" stroke="#474946" stroke-width="31" stroke-opacity=".55"/><path d="M120 -30Q80 50 60 122T-10 225" fill="none" stroke="#383936" stroke-width="36" stroke-opacity=".6"/><path d="M126 0Q222 43 354 32T570 57" fill="none" stroke="#434744" stroke-width="15" stroke-opacity=".48"/>${fineBranches}${willow}<g filter="url(#coverBlur)"><ellipse cx="683" cy="135" rx="370" ry="168" fill="url(#coverMist)"/><ellipse cx="810" cy="275" rx="450" ry="75" fill="#f7f7f3" opacity=".88"/></g><path d="M0 279Q260 279 520 276T1100 278" stroke="#a6aeab" stroke-width="1" opacity=".65" fill="none"/><g opacity=".18"><path d="M0 303Q130 300 250 305T560 304" fill="none" stroke="#454946" stroke-width="3"/><path d="M90 320Q260 314 430 324T780 320" fill="none" stroke="#535b56" stroke-width="1.5"/></g><rect width="1100" height="350" filter="url(#coverNoise)" opacity=".15"/></svg>`
}
function defaultAvatarSvg(){return `<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="雾中剪影"><defs><linearGradient id="avbg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e6e6e2"/><stop offset="1" stop-color="#aeb0ad"/></linearGradient><filter id="avblur"><feGaussianBlur stdDeviation="8"/></filter></defs><rect width="150" height="150" fill="url(#avbg)"/><ellipse cx="75" cy="96" rx="95" ry="34" fill="#f6f6f3" opacity=".62" filter="url(#avblur)"/><path d="M0 125Q75 109 150 125V150H0Z" fill="#9d9e9a" opacity=".4"/><g fill="#555854" opacity=".64"><ellipse cx="66" cy="77" rx="5" ry="7"/><path d="M62 84h9l5 26H58Z"/><path d="M62 106l-4 20h4l6-16 6 16h4l-6-20Z"/><ellipse cx="96" cy="81" rx="4.5" ry="6"/><path d="M91 88h9l4 23H88Z"/><path d="M91 107l-3 17h4l5-13 5 13h4l-5-17Z"/></g><path d="M56 131Q74 135 94 131" stroke="#696c67" opacity=".34"/><g filter="url(#avblur)"><ellipse cx="32" cy="96" rx="47" ry="34" fill="#f4f4f1" opacity=".65"/></g></svg>`}
$('#default-cover').innerHTML=defaultCoverSvg();$('#default-avatar').innerHTML=defaultAvatarSvg();
function renderProfile(){const name=(state.name||'User').trim()||'User';const input=$('#profile-name');if(document.activeElement!==input){input.value=name;input.style.width=clamp(name.length+2,8,24)+'ch';}const n=state.archive.length;$('#profile-creations').textContent=String(n).padStart(2,'0');$('#profile-sessions').textContent=String(state.sessions||0).padStart(2,'0');$('#profile-glasses').textContent=String(new Set(state.archive.map(a=>a.glass)).size).padStart(2,'0');$('#profile-session-desc').textContent=`${String(n).padStart(2,'0')} saved recipes · “Every glass has its own story.”`}
const nameEl=$('#profile-name');nameEl.value=state.name||'User';nameEl.style.width=clamp(nameEl.value.length+2,8,24)+'ch';
let nameBeforeFocus=state.name||'User';
nameEl.addEventListener('input',()=>{nameEl.style.width=clamp(nameEl.value.length+2,8,24)+'ch';state.name=nameEl.value.trim().slice(0,40)||'User';persist()});
nameEl.addEventListener('focus',()=>{nameBeforeFocus=state.name||'User';nameEl.select()});
nameEl.addEventListener('blur',()=>{state.name=nameEl.value.trim().slice(0,40)||'User';nameEl.value=state.name;nameEl.style.width=clamp(state.name.length+2,8,24)+'ch';persist();toast('姓名已保存')});
nameEl.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();nameEl.blur()}if(e.key==='Escape'){state.name=nameBeforeFocus;nameEl.value=nameBeforeFocus;persist();nameEl.blur()}});
$('#profile-more').addEventListener('click',()=>openModal('profile'));$('#profile-archive-open').addEventListener('click',()=>navigate('archive'));
function photoPickerTrigger(container,input){container.addEventListener('click',()=>input.click());container.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click()}})}
photoPickerTrigger($('#profile-cover'),$('#pick-cover'));photoPickerTrigger($('#profile-avatar'),$('#pick-avatar'));
let photoUrls={avatar:null,cover:null};
function applyPhoto(key,blob){if(photoUrls[key])URL.revokeObjectURL(photoUrls[key]);photoUrls[key]=URL.createObjectURL(blob);const node=$(key==='cover'?'#cover-img':'#avatar-img'),defaultNode=$(key==='cover'?'#default-cover':'#default-avatar');node.src=photoUrls[key];node.style.display='block';defaultNode.style.display='none';if(key==='avatar'){$('#header-avatar').innerHTML=`<img alt="用户头像" src="${photoUrls[key]}">`}}
function openPhotoDB(){return new Promise((resolve,reject)=>{if(!window.indexedDB)return reject(new Error('indexedDB unsupported'));let req;try{req=indexedDB.open('n01_profile_photos',1)}catch(e){reject(e);return}req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('images'))req.result.createObjectStore('images')};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function savePhoto(key,file){try{const db=await openPhotoDB();await new Promise((resolve,reject)=>{const tx=db.transaction('images','readwrite');tx.objectStore('images').put(file,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});db.close()}catch(e){try{if(file.size<1_300_000){const reader=new FileReader();reader.onload=()=>{try{localStorage.setItem('n01_photo_'+key,reader.result)}catch(err){}};reader.readAsDataURL(file)}}catch(ignore){}}applyPhoto(key,file);toast(key==='cover'?'横幅背景已更新':'个人头像已更新')}
async function restorePhotos(){for(const key of ['cover','avatar']){try{const db=await openPhotoDB();const blob=await new Promise((resolve,reject)=>{const req=db.transaction('images','readonly').objectStore('images').get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});db.close();if(blob){applyPhoto(key,blob);continue}}catch(e){}try{const src=localStorage.getItem('n01_photo_'+key);if(src){const res=await fetch(src);applyPhoto(key,await res.blob())}}catch(e){}}}
$('#pick-cover').addEventListener('change',e=>{const file=e.target.files?.[0];if(file&&file.type.startsWith('image/'))savePhoto('cover',file);e.target.value='' });
$('#pick-avatar').addEventListener('change',e=>{const file=e.target.files?.[0];if(file&&file.type.startsWith('image/'))savePhoto('avatar',file);e.target.value='' });
/* Preserve a sensible first render and never require a web connection. */
initScene();renderCellar();renderArchive();renderProfile();restorePhotos();updateHUD();
window.addEventListener('popstate',()=>{const page=window.location.hash.match(/^#page-(home|bar|cellar|archive|profile)$/)?.[1]||'home';navigate(page,true)});
const initialPage=window.location.hash.match(/^#page-(home|bar|cellar|archive|profile)$/)?.[1]||'home';
if(initialPage!=='home')navigate(initialPage,true);
document.documentElement.classList.add("js-ready");

window.N01Bridge={state,GLASSES,DRINKS,persist,toast,navigate,updateHUD,renderArchive,renderCellar,openDrawer,closeDrawer,closeDetail,openModal,byId,getColor,ding,saveCreation,defaultHelper,helper};
