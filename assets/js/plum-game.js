(() => {
  'use strict';

  const body = document.body;
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelectorAll('.nav-links a');
  const progress = document.querySelector('.page-progress span');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('p');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');

  const closeMenu = () => {
    body.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };

  toggle?.addEventListener('click', () => {
    const nextState = !body.classList.contains('nav-open');
    body.classList.toggle('nav-open', nextState);
    toggle.setAttribute('aria-expanded', String(nextState));
  });

  links.forEach((link) => link.addEventListener('click', closeMenu));

  const updateChrome = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 24);
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
    progress.style.width = `${ratio * 100}%`;
  };

  updateChrome();
  window.addEventListener('scroll', updateChrome, { passive: true });
  window.addEventListener('resize', updateChrome);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    reveals.forEach((element) => observer.observe(element));
  }

  const openLightbox = (trigger) => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const source = trigger.dataset.lightboxSrc;
    if (!source) return;
    lightboxImage.src = source;
    lightboxImage.alt = trigger.dataset.lightboxAlt || '';
    lightboxCaption.textContent = trigger.dataset.lightboxAlt || '';
    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    }
  };

  document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  const closeLightbox = () => {
    if (!lightbox?.open) return;
    lightbox.close();
    if (lightboxImage) lightboxImage.src = '';
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox?.addEventListener('cancel', () => {
    if (lightboxImage) lightboxImage.src = '';
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('nav-open')) closeMenu();
  });
})();
