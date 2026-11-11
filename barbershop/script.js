const branches=[
{id:'rodionova',name:'РОДИОНОВА',address:'Челябинск, улица Героя России Родионова, 13'},
{id:'pobedy',name:'ПРОСПЕКТ ПОБЕДЫ',address:'Челябинск, проспект Победы, 180'},
{id:'8marta',name:'8 МАРТА',address:'Челябинск, улица 8 Марта, 34'}
];
const masters=[
{id:'oleg',name:'Олег',role:'TOP BARBER',description:'Мастер высшей категории. Максимальное внимание к форме, деталям и индивидуальному стилю.',price:'от 2 500 ₽',image:'assets/oleg.jpeg',specialty:'Сложные формы · Fade · Мужская классика'},
{id:'ivan',name:'Иван',role:'BARBER',description:'Уверенная техника, точные линии и сбалансированный подход к каждому образу.',price:'от 1 800 ₽',image:'assets/ivan.jpeg',specialty:'Мужские стрижки · Борода · Укладка'},
{id:'zhenya',name:'Женя',role:'JUNIOR BARBER',description:'Начинающий мастер, который внимательно относится к пожеланиям и деталям.',price:'от 1 200 ₽',image:'assets/zhenya.jpeg',specialty:'Мужские стрижки · Базовые формы'}
];
const services=['Мужская стрижка','Стрижка машинкой','Моделирование бороды','Комплекс: стрижка + борода'];
const servicePrices={
  'Мужская стрижка':{oleg:'2 500 ₽',ivan:'1 800 ₽',zhenya:'1 200 ₽'},
  'Стрижка машинкой':{oleg:'1 500 ₽',ivan:'1 200 ₽',zhenya:'900 ₽'},
  'Моделирование бороды':{oleg:'1 500 ₽',ivan:'1 100 ₽',zhenya:'800 ₽'},
  'Комплекс: стрижка + борода':{oleg:'3 500 ₽',ivan:'2 600 ₽',zhenya:'1 800 ₽'}
};
let selectedMaster=masters[0].id;
const $=s=>document.querySelector(s);

function renderMasters(){
  $('#masterGrid').innerHTML=masters.map((m,i)=>`<article class="master-card reveal" tabindex="0" data-master="${m.id}">
    <div class="master-photo"><img src="${m.image}" alt="${m.name}" loading="lazy"></div>
    <div class="master-info"><small>${m.role} · 0${i+1}</small><h3>${m.name}</h3><p class="master-price-tag">${m.price}</p><button type="button">СМОТРЕТЬ ПРОФИЛЬ ↗︎</button></div>
  </article>`).join('');
  document.querySelectorAll('.master-card').forEach(card=>{
    const open=()=>openProfile(card.dataset.master);
    card.addEventListener('click',open);
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
}
function renderBranches(){
  $('#branchCards').innerHTML=branches.map((b,i)=>{
    const q=encodeURIComponent(b.address);
    return `<article class="branch-card reveal"><small>0${i+1}</small><h3>${b.name}</h3><p>${b.address}</p>
      <div class="mini-map"><iframe title="Карта: ${b.address}" loading="lazy" src="https://maps.google.com/maps?q=${q}&output=embed"></iframe></div>
      <a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">МАРШРУТ ↗︎</a>
      <button class="branch-book" data-branch-book="${b.id}">ЗАПИСАТЬСЯ В ФИЛИАЛ ↗︎</button></article>`;
  }).join('');
  document.querySelectorAll('[data-branch-book]').forEach(b=>b.addEventListener('click',()=>openBooking(null,b.dataset.branchBook)));
}
function openProfile(id){
  const m=masters.find(x=>x.id===id); if(!m)return;
  selectedMaster=id;
  $('#profileImage').src=m.image; $('#profileImage').alt=m.name;
  $('#profileRole').textContent=m.role; $('#profileName').textContent=m.name; $('#profilePrice').textContent=m.price;
  $('#profileDescription').textContent=m.description; $('#profileSpecialty').textContent=m.specialty;
  $('#profileModal').classList.add('open');document.body.style.overflow='hidden';
}
function closeProfile(){ $('#profileModal').classList.remove('open');document.body.style.overflow=''; }
function fillBookingMasters(){ $('#bookingMaster').innerHTML=masters.map(m=>`<option value="${m.id}" ${m.id===selectedMaster?'selected':''}>${m.name} — ${m.role}</option>`).join(''); }
function fillTimes(){
  const times=[];for(let h=10;h<=20;h++)for(const m of [0,30])if(!(h===20&&m===30))times.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
  $('#bookingTime').innerHTML=times.map(t=>`<option value="${t}">${t}</option>`).join('');
}
function updateBookingPrice(){
  const service=$('#bookingService').value, master=$('#bookingMaster').value;
  const price=(servicePrices[service]&&servicePrices[service][master])||'уточняется';
  const m=masters.find(x=>x.id===master);
  $('#bookingPrice').textContent=`${service} · ${m?m.name:''}: ${price}`;
}
function updateAvailabilityHint(){
  const date=$('#bookingDate').value;
  const day=date?new Date(date+'T12:00:00').toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'}):'';
  $('#bookingAvailability').textContent=day?`Предварительное расписание на ${day}. Выбранное время подтвердит администратор.`:'Выберите дату, чтобы посмотреть варианты времени.';
}
function openBooking(masterId=null,branchId=null){
  closeProfile();if(masterId)selectedMaster=masterId;
  fillBookingMasters();
  if(branchId)$('#bookingBranch').value=branchId;
  updateBookingPrice();
  $('#bookingModal').classList.add('open');document.body.style.overflow='hidden';
}
function closeBooking(){ $('#bookingModal').classList.remove('open');document.body.style.overflow=''; $('#bookingSuccess').classList.remove('show'); $('#bookingForm').style.display=''; }

/* Today slots — всегда 2–3 демо-окна на сегодня */
function renderSlots(){
  const list=$('#slotsList'); const dateEl=$('#slotsDate'); if(!list)return;
  const now=new Date();
  dateEl.textContent=now.toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
  const slots=[
    {t:'16:00',m:'Иван',mid:'ivan',b:'Родионова'},
    {t:'18:30',m:'Олег',mid:'oleg',b:'Пр. Победы'},
    {t:'20:00',m:'Женя',mid:'zhenya',b:'8 Марта'}
  ];
  list.innerHTML=slots.map(s=>`<button type="button" class="slot-chip" data-slot-time="${s.t}" data-slot-master="${s.mid}">
    <b>${s.t}</b><span>${s.m} · ${s.b}</span>
  </button>`).join('');
  list.querySelectorAll('.slot-chip').forEach(btn=>{
    btn.addEventListener('click',()=>{
      openBooking(btn.dataset.slotMaster);
      setTimeout(()=>{
        if($('#bookingTime'))$('#bookingTime').value=btn.dataset.slotTime;
        const d=new Date(); $('#bookingDate').value=d.toISOString().slice(0,10);
        updateAvailabilityHint(); updateBookingPrice();
      },50);
    });
  });
}

/* Service details */
const serviceDetails={
  'Мужская стрижка':{
    title:'МУЖСКАЯ СТРИЖКА',
    lead:'Форма под лицо, привычки и образ жизни.',
    duration:"45–60 мин",
    price:'от 1 200 ₽',
    tools:'Машинка · ножницы · расчёска · фен',
    care:'Преп / стайлинг по желанию',
    extra:'',
    desc:'Консультация, мытьё, стрижка ножницами и машинкой, укладка. Подбираем длину и силуэт так, чтобы стрижка держалась 3–4 недели.'
  },
  'Комплекс: стрижка + борода':{
    title:'СТРИЖКА + БОРОДА',
    lead:'Полный образ за один визит.',
    duration:'75–90 мин',
    price:'от 1 800 ₽',
    tools:'Машинка · ножницы · опасная бритва · горячее полотенце',
    care:'Масло / бальзам для бороды',
    extra:'',
    desc:'Стрижка + моделирование бороды, контур, уход. Идеально, если нужно обновить и голову, и лицо.'
  },
  'Моделирование бороды':{
    title:'БОРОДА',
    lead:'Чёткий контур и здоровый вид.',
    duration:'30–45 мин',
    price:'от 800 ₽',
    tools:'Машинка · триммер · опасная бритва · полотенце',
    care:'Масло, бальзам',
    extra:'',
    desc:'Коррекция длины, линия щек и шеи, горячее полотенце, уходовые средства. Борода выглядит свежо и аккуратно.'
  },
  'Стрижка машинкой':{
    title:'МАШИНКА',
    lead:'Быстро, ровно, без лишнего.',
    duration:'30 мин',
    price:'от 900 ₽',
    tools:'Машинка Wahl / Andis · насадки',
    care:'Лёгкий стайлинг по желанию',
    extra:'Насадки: 3–12 мм (№1–№4) и fade по запросу. Одна длина или переход — обсуждаем на консультации.',
    desc:'Стрижка машинкой под одну длину или с лёгким переходом. Подходит для коротких форм и регулярного обновления.'
  }
};

function openServiceDetail(name){
  const d=serviceDetails[name]; if(!d)return;
  $('#sdEyebrow').textContent='УСЛУГА · ДЕТАЛИ';
  $('#sdTitle').textContent=d.title;
  $('#sdLead').textContent=d.lead;
  $('#sdDuration').textContent=d.duration;
  $('#sdPrice').textContent=d.price;
  $('#sdTools').textContent=d.tools;
  $('#sdCare').textContent=d.care;
  $('#sdDesc').textContent=d.desc;
  if(d.extra){ $('#sdExtraWrap').style.display='block'; $('#sdExtra').textContent=d.extra; }
  else { $('#sdExtraWrap').style.display='none'; }
  $('#sdBook').onclick=()=>{ closeServiceDetail(); openBooking(); setTimeout(()=>{ $('#bookingService').value=name; updateBookingPrice(); },30); };
  $('#serviceDetailModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeServiceDetail(){
  $('#serviceDetailModal')?.classList.remove('open');
  document.body.style.overflow='';
}

/* Scroll reveal + mild kinetic */
function initMotion(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
    });
  },{threshold:.12});
  document.querySelectorAll('.reveal, .service-card, .work-card, .statement-copy, .manifesto-word').forEach(el=>{
    el.classList.add('reveal');
    io.observe(el);
  });
  // parallax-ish on manifesto word
  const word=$('.manifesto-word');
  if(word){
    window.addEventListener('scroll',()=>{
      const r=word.getBoundingClientRect();
      if(r.top<window.innerHeight && r.bottom>0){
        const p=(window.innerHeight-r.top)/window.innerHeight;
        word.style.transform=`translateY(${(0.5-p)*30}px)`;
      }
    },{passive:true});
  }
}

/* Cursor */
function initCursor(){
  const c=document.querySelector('.cursor'); if(!c)return;
  if(!matchMedia('(pointer:fine)').matches){c.style.display='none';return;}
  window.addEventListener('mousemove',e=>{
    c.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;
  });
  document.querySelectorAll('a,button,.service-card,.master-card,.ba-slider,.slot-chip').forEach(el=>{
    el.addEventListener('mouseenter',()=>c.classList.add('grow'));
    el.addEventListener('mouseleave',()=>c.classList.remove('grow'));
  });
}

/* Boot */
document.addEventListener('DOMContentLoaded',()=>{
  renderMasters(); renderBranches(); renderSlots(); initMotion(); initCursor();
  $('#bookingBranch').innerHTML=branches.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
  $('#bookingService').innerHTML=services.map(s=>`<option value="${s}">${s}</option>`).join('');
  fillBookingMasters(); fillTimes();
  const today=new Date(); today.setHours(12); $('#bookingDate').min=new Date().toISOString().slice(0,10);
  $('#bookingDate').addEventListener('change',updateAvailabilityHint);
  $('#bookingService').addEventListener('change',updateBookingPrice);
  $('#bookingMaster').addEventListener('change',updateBookingPrice);
  document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>openBooking()));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeBooking));
  document.querySelectorAll('[data-profile-close]').forEach(b=>b.addEventListener('click',closeProfile));
  $('#profileBook')?.addEventListener('click',()=>openBooking(selectedMaster));
  document.querySelectorAll('[data-service-card]').forEach(card=>{
    card.addEventListener('click',e=>{
      if(e.target.closest('button') && e.target.closest('button').hasAttribute('data-book')){
        e.stopPropagation();
        openBooking();
        $('#bookingService').value=card.dataset.serviceCard;
        updateBookingPrice();
        return;
      }
      openServiceDetail(card.dataset.serviceCard);
    });
  });
  document.querySelectorAll('[data-service-close]').forEach(b=>b.addEventListener('click',closeServiceDetail));
  $('.burger')?.addEventListener('click',()=>$('.header nav')?.classList.toggle('show'));
  $('.header nav')?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>$('.header nav').classList.remove('show')));
  $('#bookingForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('#clientName').value, phone=$('#clientPhone').value;
    const service=$('#bookingService').value, master=$('#bookingMaster').selectedOptions[0]?.text||'';
    const branch=$('#bookingBranch').selectedOptions[0]?.text||'';
    const date=$('#bookingDate').value, time=$('#bookingTime').value;
    const price=$('#bookingPrice').textContent;
    const msg=`Запись в Бородатую Мафию\nИмя: ${name}\nТелефон: ${phone}\nФилиал: ${branch}\nМастер: ${master}\nУслуга: ${service}\nДата: ${date} ${time}\n${price}`;
    const wa='https://wa.me/79000000000?text='+encodeURIComponent(msg);
    window.open(wa,'_blank','noopener');
    $('#bookingForm').style.display='none';
    $('#successText').textContent=`${name}, заявка на ${date} в ${time} подготовлена в WhatsApp. Подтверди отправку в открывшемся окне.`;
    $('#bookingSuccess').classList.add('show');
  });
});


/* Theme */
(function initTheme(){
  const root=document.documentElement;
  const saved=localStorage.getItem('bm-theme');
  if(saved) root.setAttribute('data-theme', saved);
  const btn=document.getElementById('themeToggle');
  if(!btn) return;
  btn.addEventListener('click',()=>{
    const next=root.getAttribute('data-theme')==='dark'?'':'dark';
    if(next) root.setAttribute('data-theme', next); else root.removeAttribute('data-theme');
    localStorage.setItem('bm-theme', next);
  });
})();

/* Works filters */
(function initWorksFilters(){
  const filters=document.getElementById('worksFilters');
  const grid=document.getElementById('worksGrid');
  if(!filters||!grid) return;
  filters.querySelectorAll('.wf').forEach(btn=>{
    btn.addEventListener('click',()=>{
      filters.querySelectorAll('.wf').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.filter;
      grid.querySelectorAll('.work-card').forEach(card=>{
        const show=f==='all'||card.dataset.cat===f;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });
})();

/* 3D tilt on pointer */
(function initTilt(){
  if(!matchMedia('(pointer:fine)').matches) return;
  document.querySelectorAll('.tilt-3d').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-0.5;
      const y=(e.clientY-r.top)/r.height-0.5;
      card.classList.add('is-tilting');
      card.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*8}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave',()=>{
      card.classList.remove('is-tilting');
      card.style.transform='';
    });
  });
})();
