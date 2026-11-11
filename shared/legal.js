/* DUOFORM shared cookie notice. No analytics or advertising cookies are installed by this script. */
(() => {
  'use strict';
  const KEY = 'duoform_necessary_notice_v1';
  const legalUrl = '../legal.html';
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = '../shared/legal.css';
  document.head.appendChild(css);

  const footer = document.querySelector('footer');
  if (footer && !footer.querySelector('.site-legal-links')) {
    const links = document.createElement('nav');
    links.className = 'site-legal-links';
    links.setAttribute('aria-label', 'Юридическая информация');
    links.innerHTML = `<a href="${legalUrl}#privacy">Политика конфиденциальности</a><a href="${legalUrl}#terms">Пользовательское соглашение</a><a href="${legalUrl}#cookies">Файлы cookie</a>`;
    footer.appendChild(links);
  }

  let seen = false;
  try { seen = localStorage.getItem(KEY) === '1'; } catch (_) {}
  if (seen) return;

  const banner = document.createElement('aside');
  banner.className = 'site-cookie is-visible';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Уведомление о файлах cookie');
  banner.innerHTML = `<p>Этот сайт использует только необходимые локальные данные браузера — например, чтобы запоминать выбранную тему и не показывать уведомление повторно. Аналитические и рекламные cookie этим сайтом не устанавливаются. <a href="${legalUrl}#cookies">Подробнее</a>.</p><div class="site-cookie-actions"><button type="button" data-cookie-ok>Понятно</button><a class="site-cookie-link" href="${legalUrl}#privacy">Политика конфиденциальности</a></div>`;
  document.body.appendChild(banner);
  banner.querySelector('[data-cookie-ok]').addEventListener('click', () => {
    try { localStorage.setItem(KEY, '1'); } catch (_) {}
    banner.remove();
  });
})();
