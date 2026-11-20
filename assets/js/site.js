/* Site behaviour: theme toggle, header state, mobile menu, table of
   contents with scrollspy, scroll reveal and card spotlight. */
(() => {
  window.__siteReady = true;
  const root = document.documentElement;

  /* Theme toggle */
  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
      document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    });
  }

  /* Header gets a background once the page scrolls */
  const header = document.querySelector('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const navBtn = document.querySelector('[data-nav-toggle]');
  if (navBtn) {
    const setOpen = (open) => {
      document.body.classList.toggle('nav-open', open);
      navBtn.setAttribute('aria-expanded', String(open));
    };
    navBtn.addEventListener('click', () => setOpen(!document.body.classList.contains('nav-open')));
    document.querySelectorAll('.site-nav a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* Table of contents built from h2/h3 headings, with the current section highlighted */
  const toc = document.querySelector('[data-toc]');
  if (toc) {
    const heads = [...document.querySelectorAll('.prose h2[id], .prose h3[id]')];
    if (heads.length < 2) {
      toc.closest('.toc')?.remove();
      document.querySelector('.page')?.classList.remove('page--toc');
    } else {
      const pairs = heads.map((h) => {
        const a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        if (h.tagName === 'H3') a.className = 'toc--h3';
        toc.appendChild(a);
        return [h, a];
      });
      if ('IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            pairs.forEach(([h, a]) => a.classList.toggle('is-active', h === e.target));
          });
        }, { rootMargin: '-15% 0px -75% 0px' });
        heads.forEach((h) => spy.observe(h));
      }
    }
  }

  /* Scroll reveal. The hidden starting state comes from CSS under html.js-reveal. */
  if (root.classList.contains('js-reveal')) {
    const SEL = '.home > h2, .intro, .timeline__item, .card, .more-link, .prose > :not(.pub-list), .pub, .site-footer__cta, .social';
    const io = new IntersectionObserver((entries) => {
      let n = 0;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const delay = Math.min(n++, 8) * 70;
        el.style.setProperty('--reveal-delay', delay + 'ms');
        el.classList.add('is-in');
        io.unobserve(el);
        setTimeout(() => { el.classList.add('is-done'); el.style.removeProperty('--reveal-delay'); }, 900 + delay);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    document.querySelectorAll(SEL).forEach((el) => io.observe(el));
  }

  /* Card spotlight follows the pointer */
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();
