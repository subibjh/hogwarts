/* Hogwarts — book-accurate, subtle */
(function(){
  'use strict';
  var KEY='hogwarts_v3';
  var HOUSES={gryff:'گریفیندور',slyth:'اسلیترین',raven:'ریونکلا',huff:'هافلپاف'};
  function def(){return {name:'',house:null,wand:null,patronus:null,points:{gryff:126,slyth:118,raven:104,huff:98},earned:0,streak:0,lastCheckin:'',onboarded:false,tickets:[],cast:[],read:[],started:Date.now()};}
  function load(){try{var s=JSON.parse(localStorage.getItem(KEY));if(s&&s.points)return Object.assign(def(),s);}catch(e){}return def();}
  var S=load();
  function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
  window.HW={S:S,HOUSES:HOUSES,save:save,
    today:function(){return new Date().toISOString().slice(0,10);},
    toast:function(m){var w=document.getElementById('toasts');if(!w){w=document.createElement('div');w.id='toasts';document.body.appendChild(w);}var d=document.createElement('div');d.className='toast';d.textContent=m;w.appendChild(d);setTimeout(function(){d.remove();},3000);},
    award:function(h,n,why){if(!HOUSES[h])return;S.points[h]+=n;S.earned+=n;save();this.toast('+'+n+' امتیاز برای '+HOUSES[h]+(why?' — '+why:''));if(this.renderBadge)this.renderBadge();},
    renderBadge:function(){var el=document.getElementById('meBadge');if(!el)return;var h=S.house?HOUSES[S.house]:'بدون خانه';el.innerHTML='خوش آمدی، <b>'+esc(S.name)||'جادوگر'+'</b> · '+h+' · '+S.earned+' امتیاز';},
    leader:function(){return Object.keys(HOUSES).map(function(k){return {k:k,n:HOUSES[k],p:S.points[k]};}).sort(function(a,b){return b.p-a.p;});},
    steps:function(){
      var c=(S.cast||[]).length,r=(S.read||[]).length;
      return [
        {id:'name',t:'۱. نامه هاگوارتز',d:'ثبت در طومار',href:'index.html#journey',done:!!S.name},
        {id:'house',t:'۲. کلاه گروهبندی',d:'سرود کلاه — ۸ سؤال کتابی',href:'sorting.html',done:!!S.house},
        {id:'wand',t:'۳. اولیواندر',d:'چوب و مغز دقیق از کتاب',href:'wand.html',done:!!(S.wand&&S.patronus)},
        {id:'class',t:'۴. کلاسها',d:'۳ طلسم یا ۱ کتاب — امتیاز فقط سر کلاس',href:'spells.html',done:(c>=3||r>=1)},
        {id:'cup',t:'۵. تالار بزرگ',d:'سقف جادویی و جام',href:'greathall.html',done:(c>=3||r>=1)}
      ];
    },
    need:function(ok,msg){if(ok)return true;this.toast(msg||'قدم قبلی را کامل کن');setTimeout(function(){location.href='index.html#journey';},900);return false;}
  };
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  window.escHtml=esc;
  function stars(){var cv=document.getElementById('stars');if(!cv)return;var cx=cv.getContext('2d');function sz(){cv.width=innerWidth;cv.height=innerHeight}sz();addEventListener('resize',sz);var P=[];for(var i=0;i<70;i++)P.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.1+.25,s:Math.random()*.18+.06,o:Math.random()*.5+.2});(function loop(){cx.clearRect(0,0,cv.width,cv.height);for(var j=0;j<P.length;j++){var p=P[j];p.y-=p.s;if(p.y<0){p.y=innerHeight;p.x=Math.random()*innerWidth}cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fillStyle='rgba(232,197,71,'+p.o.toFixed(2)+')';cx.fill()}requestAnimationFrame(loop)})();}
  function reveal(){var els=document.querySelectorAll('.rv');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('vis')});return}var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');ro.unobserve(e.target)}})},{threshold:.12});els.forEach(function(e){ro.observe(e)})}
  function checkin(){var t=HW.today();if(S.lastCheckin===t)return;var y=new Date(Date.now()-864e5).toISOString().slice(0,10);S.streak=(S.lastCheckin===y)?S.streak+1:1;S.lastCheckin=t;if(S.house){S.points[S.house]+=5;S.earned+=5}save()}
  document.addEventListener('DOMContentLoaded',function(){stars();reveal();checkin();HW.renderBadge();var f=document.getElementById('flash');if(!f){f=document.createElement('div');f.id='flash';document.body.appendChild(f)}});
  HW.flash=function(){var f=document.getElementById('flash');if(!f)return;f.classList.add('go');setTimeout(function(){f.classList.remove('go')},200)};
})();
