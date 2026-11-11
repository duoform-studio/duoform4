const body = document.body;
const toggle = document.querySelector('.menu-toggle');
toggle?.addEventListener('click', () => body.classList.toggle('menu-open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => body.classList.remove('menu-open')));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const dot = document.querySelector('.cursor-dot');
if (dot && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  });
  document.querySelectorAll('a,button,.menu-card,figure,.today-card,.faq-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '34px';
      dot.style.height = '34px';
      dot.style.background = 'rgba(220,165,170,.3)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.background = 'transparent';
    });
  });
}

document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('pointermove', e => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * .12;
    const y = (e.clientY - r.top - r.height / 2) * .12;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener('pointerleave', () => el.style.transform = '');
});

const heroImg = document.querySelector('.hero-card img');
window.addEventListener('scroll', () => {
  if (!heroImg || window.innerWidth < 760) return;
  const y = Math.min(window.scrollY * .08, 30);
  heroImg.style.transform = `scale(1.02) translateY(${y}px)`;
}, {passive:true});

/* Theme: morning / evening */
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem('soloko-theme');
  if (saved === 'evening') root.setAttribute('data-theme', 'evening');
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const evening = root.getAttribute('data-theme') === 'evening';
    if (evening) {
      root.removeAttribute('data-theme');
      localStorage.setItem('soloko-theme', 'morning');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#dce2c9');
    } else {
      root.setAttribute('data-theme', 'evening');
      localStorage.setItem('soloko-theme', 'evening');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#1c1916');
    }
  });
})();

/* Menu tabs — show panel */
(function(){
  const tabs = document.getElementById('menuTabs');
  if (!tabs) return;
  tabs.querySelectorAll('.mtab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelectorAll('.menu-panel').forEach(panel => {
        panel.classList.toggle('active', panel.dataset.panel === tab);
      });
      // re-observe reveals in newly shown panel
      panel = document.querySelector(`.menu-panel[data-panel="${tab}"]`);
      panel?.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        el.classList.add('visible');
      });
    });
  });
})();

/* Item details */
const itemData = {
  macaron: {cat:'десерт', title:'Макарон', desc:'Нежная оболочка, кремовая начинка. Вкусы: фисташка, малина, ваниль, шоколад.', price:'от 190 ₽', allergens:'яйцо, миндаль, молочные продукты', notes:'Лучше съесть в день покупки.'},
  cake: {cat:'десерт', title:'Пирожное дня', desc:'Меняем рецепт. Спроси на витрине.', price:'320 ₽', allergens:'уточняйте', notes:'Пока есть.'},
  cheesecake: {cat:'десерт', title:'Чизкейк', desc:'Нежный, холодный, с ягодным топпингом.', price:'350 ₽', allergens:'молоко, глютен, яйцо', notes:'Кусок ~150 г.'},
  tart: {cat:'десерт', title:'Тарталетка', desc:'Хрустящая основа и сезонный крем.', price:'290 ₽', allergens:'глютен, молоко, яйцо', notes:'Ассортимент дня.'},
  wafer: {cat:'десерт', title:'Вафельная трубочка', desc:'Хруст и нежный крем.', price:'180 ₽', allergens:'глютен, молоко', notes:'Хрупкая — аккуратно.'},
  brownie: {cat:'десерт', title:'Брауни', desc:'Плотный шоколадный брауни.', price:'270 ₽', allergens:'глютен, яйцо, молоко, орехи', notes:'Можно разогреть.'},
  cappuccino: {cat:'кофе', title:'Капучино', desc:'Двойной эспрессо, вспененное молоко.', price:'240 ₽', allergens:'молоко', notes:'Альтернативное молоко — да.'},
  latte: {cat:'кофе', title:'Латте', desc:'Больше молока, мягче вкус.', price:'270 ₽', allergens:'молоко', notes:'Рисунок на пенке — как повезёт.'},
  americano: {cat:'кофе', title:'Американо', desc:'Эспрессо и горячая вода.', price:'190 ₽', allergens:'—', notes:'Можно со льдом.'},
  espresso: {cat:'кофе', title:'Эспрессо', desc:'Короткий и крепкий.', price:'160 ₽', allergens:'—', notes:'Основа меню.'},
  flatwhite: {cat:'кофе', title:'Флэт уайт', desc:'Эспрессо и микропена.', price:'280 ₽', allergens:'молоко', notes:'Для ценителей.'},
  raf: {cat:'кофе', title:'Раф', desc:'Эспрессо, сливки, ваниль. Розовый — с ягодой.', price:'от 300 ₽', allergens:'молоко', notes:'Десерт в чашке.'},
  matcha: {cat:'кофе', title:'Матча латте', desc:'Японский чай матча на молоке.', price:'290 ₽', allergens:'молоко', notes:'Яркий зелёный цвет.'},
  pumpkin: {cat:'кофе', title:'Тыквенный латте', desc:'Пряный сезонный напиток.', price:'340 ₽', allergens:'молоко', notes:'До воскресенья.'},
  'rose-tea': {cat:'чай', title:'Розовый чай', desc:'Ягодная нота, красивый цвет.', price:'260 ₽', allergens:'—', notes:'Можно холодным.'},
  'green-tea': {cat:'чай', title:'Зелёный чай', desc:'Сенча или жасмин — по наличию.', price:'220 ₽', allergens:'—', notes:'Горячий или холодный.'},
  jasmine: {cat:'чай', title:'Жасмин', desc:'Цветочный аромат.', price:'230 ₽', allergens:'—', notes:'Мягкий.'},
  cacao: {cat:'чай', title:'Какао', desc:'Густой, на молоке.', price:'250 ₽', allergens:'молоко', notes:'С маршмеллоу по желанию.'},
  lemonade: {cat:'чай', title:'Лимонад дня', desc:'Домашний, сезонная рецептура.', price:'280 ₽', allergens:'—', notes:'Спроси вкус у бариста.'},
  ginger: {cat:'чай', title:'Имбирный чай', desc:'Согревает. Мёд по желанию.', price:'240 ₽', allergens:'—', notes:'Острый и тёплый.'},
  croissant: {cat:'выпечка', title:'Круассан', desc:'Слоёное тесто, масло, хруст.', price:'220 ₽', allergens:'глютен, молоко, яйцо', notes:'Лучше тёплым.'},
  almond: {cat:'выпечка', title:'Миндальный круассан', desc:'С миндальным кремом.', price:'280 ₽', allergens:'глютен, молоко, яйцо, миндаль', notes:'Сытный.'},
  bun: {cat:'выпечка', title:'Булочка / слойка дня', desc:'Свежая из печи.', price:'230 ₽', allergens:'глютен, молоко', notes:'Ассортимент меняется.'},
  bread: {cat:'выпечка', title:'Хлеб на закваске', desc:'Кусок свежего хлеба.', price:'от 120 ₽', allergens:'глютен', notes:'С маслом или сыром.'},
  sandwich: {cat:'выпечка', title:'Сэндвич дня', desc:'На чиабатте, начинка дня.', price:'390 ₽', allergens:'глютен, уточняйте', notes:'Спроси состав.'},
  cinnamon: {cat:'выпечка', title:'Синнабон', desc:'Корица и глазурь.', price:'260 ₽', allergens:'глютен, молоко, яйцо', notes:'Тёплый.'}
};

function openItem(id){
  const d = itemData[id]; if(!d) return;
  document.getElementById('itemCat').innerHTML = `<span></span> ${d.cat}`;
  document.getElementById('itemTitle').textContent = d.title;
  document.getElementById('itemDesc').textContent = d.desc;
  document.getElementById('itemPrice').textContent = d.price;
  document.getElementById('itemAllergens').textContent = d.allergens;
  document.getElementById('itemNotes').textContent = d.notes;
  document.getElementById('itemModal').classList.add('open');
  body.style.overflow = 'hidden';
  document.getElementById('itemOrderBtn').onclick = () => {
    closeItem();
    document.getElementById('order')?.scrollIntoView({behavior:'smooth'});
  };
}
function closeItem(){
  document.getElementById('itemModal')?.classList.remove('open');
  body.style.overflow = '';
}
document.querySelectorAll('[data-close-item]').forEach(el => el.addEventListener('click', closeItem));
document.querySelectorAll('.menu-card[data-item]').forEach(card => {
  card.addEventListener('click', () => openItem(card.dataset.item));
});

/* Order → WhatsApp */
const WA_NUMBER = '79000000000'; // замените на свой
const orderForm = document.querySelector('#order-form');
const drinkSelect = document.querySelector('#drink');
const pastrySelect = document.querySelector('#pastry');
const totalLabel = document.querySelector('#order-total');
const orderFeedback = document.querySelector('#order-feedback');

function updateOrderTotal() {
  const total = Number(drinkSelect?.selectedOptions[0]?.dataset.price || 0) + Number(pastrySelect?.selectedOptions[0]?.dataset.price || 0);
  if (totalLabel) totalLabel.textContent = `${total} ₽`;
}
drinkSelect?.addEventListener('change', updateOrderTotal);
pastrySelect?.addEventListener('change', updateOrderTotal);
updateOrderTotal();

orderForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#customer-name').value.trim();
  const phone = document.querySelector('#customer-phone').value.trim();
  const pickup = document.querySelector('#pickup')?.value || '30 минут';
  if (!name || !phone) {
    orderFeedback.textContent = 'Заполни имя и телефон.';
    return;
  }
  const message = [
    'Здравствуйте! Заказ в SOLOKO:',
    `Напиток: ${drinkSelect.value}`,
    `К напитку: ${pastrySelect.value}`,
    `Заберу через: ${pickup}`,
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Итого: ${totalLabel.textContent}`
  ].join('\n');
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
  orderFeedback.textContent = 'Открыли WhatsApp с готовым заказом. Подтверди отправку в чате.';
});
