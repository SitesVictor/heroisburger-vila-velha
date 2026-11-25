/* Menu mobile */
(function(){
  var btn=document.querySelector('.menu-toggle');
  var nav=document.querySelector('.nav');
  if(!btn||!nav)return;
  btn.addEventListener('click',function(){
    var open=nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded',open);
  });
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){nav.classList.remove('is-open');btn.setAttribute('aria-expanded','false')});
  });
})();

/* Header com fundo ao rolar + barra de progresso */
(function(){
  var header=document.querySelector('.site-header');
  var bar=document.querySelector('.progress');
  function onScroll(){
    var y=window.scrollY;
    header.classList.toggle('is-scrolled',y>40);
    var max=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.transform='scaleX('+(max>0?y/max:0)+')';
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
})();

/* Fade-in ao rolar */
(function(){
  var els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('is-visible')});
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){en.target.classList.add('is-visible');io.unobserve(en.target)}
    });
  },{threshold:0.12});
  els.forEach(function(e){io.observe(e)});
})();

/* Contador animado dos números */
(function(){
  var els=document.querySelectorAll('[data-count]');
  if(!els.length)return;
  function run(el){
    var target=parseInt(el.getAttribute('data-count'),10);
    var suffix=el.getAttribute('data-suffix')||'';
    var start=performance.now(),dur=1600;
    function tick(now){
      var p=Math.min((now-start)/dur,1);
      var eased=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*eased).toLocaleString('pt-BR')+(p===1?suffix:'');
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){run(en.target);io.unobserve(en.target)}
    });
  },{threshold:0.4});
  els.forEach(function(e){io.observe(e)});
})();

/* Anatomia: clicar na camada */
(function(){
  var list=document.getElementById('anatList'),chip=document.getElementById('anatChip');
  if(!list)return;
  list.querySelectorAll('li').forEach(function(li){
    li.querySelector('button').addEventListener('click',function(){
      list.querySelector('.is-active').classList.remove('is-active');
      li.classList.add('is-active');
      chip.textContent=li.getAttribute('data-t')+' · '+li.querySelector('b').textContent;
    });
  });
})();

/* Abas do cardápio */
(function(){
  var tabs=document.querySelectorAll('.tab');
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      document.querySelectorAll('.tab.is-active,.panel.is-active').forEach(function(e){e.classList.remove('is-active')});
      t.classList.add('is-active');
      document.getElementById('tab-'+t.getAttribute('data-tab')).classList.add('is-active');
    });
  });
})();

/* Quiz: qual herói é você? */
(function(){
  var stage=document.getElementById('quizStage'),bar=document.getElementById('quizBar');
  if(!stage)return;
  var heroes={
    hulk:{n:'Hulk',img:'hulk',d:'Intenso e sem medo de exagerar. Você pede dois blends, muito bacon e queijo, e esmaga a fome.'},
    thor:{n:'Thor',img:'thor',d:'Forte e clássico. Bacon ao forno, cheddar e costela para quem gosta de sabor de verdade.'},
    spiderman:{n:'Spider-Man',img:'spiderman',d:'Divertido e cheio de estilo. Cheddar e bacon num burger que chama atenção na mesa.'},
    wandinha:{n:'Wandinha',img:'wandinha',d:'Diferentão e com personalidade. Pão australiano, queijo minas e geleia: doce e salgado.'},
    aqua:{n:'Aqua',img:'aqua',d:'Sofisticado e aventureiro. Steak Angus, camarão e cream cheese, direto de Atlantis.'},
    morcego:{n:'Homem Morcego',img:'morcego',d:'Misterioso e defumado. Queijo derretido, bacon e molho barbecue no escuro.'},
    tonystark:{n:'Tony Stark',img:'tonystark',d:'Gênio e estiloso. Angus, molho Billy Jack e farofa de bacon.'},
    viuva:{n:'Viúva Negra',img:'viuva',d:'Elegante e implacável. Frango empanado crocante, com sofisticação no prato.'}
  };
  var qs=[
    {q:'Como está a sua fome hoje?',o:[['Gigante, quero me esbaldar',{hulk:2,thor:1}],['Boa, quero algo equilibrado',{tonystark:2,spiderman:1}],['Quero algo diferente',{wandinha:2,aqua:1}],['Moderada e mais leve',{viuva:2,morcego:1}]]},
    {q:'Qual sabor te atrai mais?',o:[['Bacon e queijo derretido',{hulk:2,spiderman:2}],['Defumado e barbecue',{morcego:2,thor:2,tonystark:1}],['Doce com salgado',{wandinha:3}],['Frutos do mar e cremosidade',{aqua:3}]]},
    {q:'Que tipo de herói você é?',o:[['Poderoso e direto',{hulk:2,thor:2}],['Misterioso e reservado',{morcego:2,wandinha:1}],['Genial e estiloso',{tonystark:2,aqua:1}],['Ágil e divertido',{spiderman:2,viuva:2}]]}
  ];
  var i,score;
  function start(){i=0;score={};step()}
  function step(){
    bar.style.width=(i/qs.length*100)+'%';
    var q=qs[i];
    stage.innerHTML='<span class="q-step">PERGUNTA '+(i+1)+' DE '+qs.length+'</span><h3 class="q-title">'+q.q+'</h3><div class="q-opts"></div>';
    var box=stage.querySelector('.q-opts');
    q.o.forEach(function(o){
      var b=document.createElement('button');b.type='button';b.className='q-opt';b.textContent=o[0];
      b.addEventListener('click',function(){
        for(var k in o[1])score[k]=(score[k]||0)+o[1][k];
        i++; i<qs.length?step():result();
      });
      box.appendChild(b);
    });
  }
  function result(){
    bar.style.width='100%';
    var best=Object.keys(score).sort(function(a,b){return score[b]-score[a]})[0],h=heroes[best];
    stage.innerHTML='<div class="q-result"><img src="img/'+h.img+'.webp" alt="Hambúrguer '+h.n+'" width="900" height="640"><div><span class="q-step">SEU HERÓI É</span><h3>'+h.n+'</h3><p>'+h.d+'</p><div class="q-actions"><a class="btn btn-primary" target="_blank" rel="noopener" href="https://www.hubt.com.br/herois-vila-velha/">Pedir agora</a><button type="button" class="btn btn-ghost" id="quizAgain">Refazer</button></div></div></div>';
    document.getElementById('quizAgain').addEventListener('click',start);
  }
  start();
})();

/* Tela de abertura */
(function(){
  var l=document.getElementById('loader');
  if(!l)return;
  function hide(){l.classList.add('is-done')}
  window.addEventListener('load',function(){setTimeout(hide,350)});
  setTimeout(hide,3000);
})();

/* Menu: destaca a seção atual */
(function(){
  var links=[].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var map=links.map(function(a){return{a:a,s:document.querySelector(a.getAttribute('href'))}}).filter(function(x){return x.s});
  if(!map.length||!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        map.forEach(function(x){x.a.classList.toggle('is-current',x.s===en.target)});
      }
    });
  },{rootMargin:'-45% 0px -50% 0px'});
  map.forEach(function(x){io.observe(x.s)});
})();

/* Brilho que segue o mouse */
(function(){
  document.querySelectorAll('.tile,.step').forEach(function(el){
    el.addEventListener('mousemove',function(e){
      var r=el.getBoundingClientRect();
      el.style.setProperty('--mx',(e.clientX-r.left)+'px');
      el.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
  });
})();

/* Inclinação 3D nos cards (só com mouse e sem "reduzir movimento") */
(function(){
  if(!window.matchMedia('(hover:hover)').matches||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  document.querySelectorAll('.hero-card').forEach(function(c){
    c.addEventListener('mousemove',function(e){
      var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.classList.add('is-tilting');
      c.style.transform='perspective(800px) rotateY('+(x*10)+'deg) rotateX('+(-y*10)+'deg) translateY(-10px)';
    });
    c.addEventListener('mouseleave',function(){c.classList.remove('is-tilting');c.style.transform=''});
  });
})();

/* Parallax suave da colagem do topo */
(function(){
  var col=document.querySelector('.collage');
  if(!col||!window.matchMedia('(hover:hover)').matches||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var imgs=col.querySelectorAll('img');
  document.querySelector('.hero').addEventListener('mousemove',function(e){
    var x=e.clientX/window.innerWidth-.5,y=e.clientY/window.innerHeight-.5;
    imgs.forEach(function(im,i){var d=(i+1)*10;im.style.translate=(x*d)+'px '+(y*d)+'px'});
  });
})();

/* Botão de voltar ao topo */
(function(){
  var b=document.getElementById('toTop');
  if(!b)return;
  window.addEventListener('scroll',function(){b.classList.toggle('is-show',window.scrollY>900)},{passive:true});
})();
