/* Menu */
const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
if (menu && nav) {
  menu.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

/* Theme toggle */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('chisto-theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? '' : 'dark';
    if (next) root.setAttribute('data-theme', next);
    else root.removeAttribute('data-theme');
    localStorage.setItem('chisto-theme', next);
  });
}

/* Custom cursor */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
if (cursor && follower && window.matchMedia('(pointer:fine)').matches) {
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  (function anim() {
    fx += (mx - fx) * 0.18;
    fy += (my - fy) * 0.18;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(anim);
  })();
  document.querySelectorAll('a, button, .ba-slider, .file-drop, summary').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width = '52px';
      follower.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width = '36px';
      follower.style.height = '36px';
    });
  });
}

/* Calculator */
const calcService = document.getElementById('calcService');
const calcSize = document.getElementById('calcSize');
const calcArea = document.getElementById('calcArea');
const calcDirt = document.getElementById('calcDirt');
const calcPrice = document.getElementById('calcPrice');
const sizeLabel = document.getElementById('sizeLabel');
const areaLabel = document.getElementById('areaLabel');

const basePrices = {
  sofa: null, // uses size select
  mattress: 1800,
  carpet: 900, // per m2
  car: 3500
};

function updateCalcUI() {
  const svc = calcService.value;
  if (svc === 'sofa') {
    sizeLabel.classList.remove('hidden');
    areaLabel.classList.add('hidden');
  } else if (svc === 'carpet') {
    sizeLabel.classList.add('hidden');
    areaLabel.classList.remove('hidden');
  } else {
    sizeLabel.classList.add('hidden');
    areaLabel.classList.add('hidden');
  }
  updatePrice();
}

function updatePrice() {
  const svc = calcService.value;
  const dirt = parseFloat(calcDirt.value) || 1;
  let price = 0;
  if (svc === 'sofa') {
    price = parseInt(calcSize.value, 10) || 2500;
  } else if (svc === 'carpet') {
    const area = parseFloat(calcArea.value) || 6;
    price = Math.round(basePrices.carpet * area);
  } else {
    price = basePrices[svc] || 2000;
  }
  price = Math.round(price * dirt);
  calcPrice.textContent = price.toLocaleString('ru-RU') + ' ₽';
}

if (calcService) {
  calcService.addEventListener('change', updateCalcUI);
  calcSize.addEventListener('change', updatePrice);
  calcArea.addEventListener('input', updatePrice);
  calcDirt.addEventListener('change', updatePrice);
  updateCalcUI();
}

/* Sync calculator service to form */
const calcToForm = document.getElementById('calcToForm');
const formService = document.getElementById('formService');
if (calcToForm && formService) {
  calcToForm.addEventListener('click', () => {
    const map = {
      sofa: 'Диван или кресло',
      mattress: 'Матрас',
      carpet: 'Ковёр',
      car: 'Салон автомобиля'
    };
    formService.value = map[calcService.value] || 'Другое';
  });
}

/* Before/After sliders */
document.querySelectorAll('[data-ba]').forEach(slider => {
  const after = slider.querySelector('.ba-after');
  const handle = slider.querySelector('.ba-handle');
  let dragging = false;

  function setPos(x) {
    const rect = slider.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  slider.addEventListener('pointerdown', e => {
    dragging = true;
    slider.setPointerCapture(e.pointerId);
    setPos(e.clientX);
  });
  slider.addEventListener('pointermove', e => {
    if (!dragging) return;
    setPos(e.clientX);
  });
  slider.addEventListener('pointerup', () => { dragging = false; });
  slider.addEventListener('pointercancel', () => { dragging = false; });
});

/* File upload preview */
const photoInput = document.getElementById('photoInput');
const filePreview = document.getElementById('filePreview');
const fileDrop = document.getElementById('fileDrop');
const fileText = fileDrop?.querySelector('.file-text');

if (photoInput && filePreview) {
  photoInput.addEventListener('change', () => {
    filePreview.innerHTML = '';
    const files = Array.from(photoInput.files || []).slice(0, 4);
    if (files.length && fileText) fileText.style.display = 'none';
    else if (fileText) fileText.style.display = '';
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      filePreview.appendChild(img);
    });
  });
  ['dragenter', 'dragover'].forEach(ev => {
    fileDrop.addEventListener(ev, e => {
      e.preventDefault();
      fileDrop.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(ev => {
    fileDrop.addEventListener(ev, e => {
      e.preventDefault();
      fileDrop.classList.remove('dragover');
    });
  });
  fileDrop.addEventListener('drop', e => {
    const dt = e.dataTransfer;
    if (dt?.files?.length) {
      photoInput.files = dt.files;
      photoInput.dispatchEvent(new Event('change'));
    }
  });
}

/* Form → WhatsApp */
const form = document.querySelector('#leadForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const photoCount = photoInput?.files?.length || 0;
    const photoNote = photoCount ? `\nФото: ${photoCount} шт. (прикреплены на сайте, отправьте отдельно)` : '';
    const msg = `Заявка с сайта ЧИСТО\nИмя: ${d.get('name')}\nТелефон: ${d.get('phone')}\nУслуга: ${d.get('service')}\nКомментарий: ${d.get('comment') || '—'}${photoNote}`;
    const result = form.querySelector('.form-result');
    result.textContent = 'Подготавливаем заявку…';
    const url = 'https://wa.me/79990000000?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener');
    result.textContent = 'Заявка подготовлена в WhatsApp. Нажмите «Отправить» в открывшемся окне.';
  });
}

/* Scroll reveal */
const reveal = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      reveal.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.service-card, .step, .review-grid blockquote, .manifesto-copy, .why-card, .ba-item, .faq-item, .calc-card, .zone-card, .guarantee-inner').forEach(el => {
  el.classList.add('reveal-ready');
  reveal.observe(el);
});

/* Light parallax on hero visual */
const heroVisual = document.querySelector('[data-parallax]');
const heroPhoto = document.querySelector('.hero-photo');
if (heroVisual && heroPhoto && window.matchMedia('(pointer:fine)').matches) {
  heroVisual.addEventListener('mousemove', e => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroPhoto.style.transform = `scale(1.06) translate(${x * 12}px, ${y * 10}px)`;
  });
  heroVisual.addEventListener('mouseleave', () => {
    heroPhoto.style.transform = '';
  });
}
