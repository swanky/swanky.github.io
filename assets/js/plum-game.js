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
  const effectToggle = document.querySelector('.effect-toggle');
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const railIndex = document.querySelector('.rail-index');
  const railTitle = document.querySelector('.rail-title');
  const railProgress = document.querySelector('.rail-track i');
  const castLinks = [...document.querySelectorAll('.cast-index a')];
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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
    if (railProgress) railProgress.style.transform = `scaleY(${ratio})`;
  };

  updateChrome();
  window.addEventListener('scroll', updateChrome, { passive: true });
  window.addEventListener('resize', updateChrome);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  const setEffects = (enabled) => {
    body.dataset.effects = enabled ? 'on' : 'off';
    effectToggle?.setAttribute('aria-pressed', String(enabled));
    effectToggle?.setAttribute('aria-label', enabled ? '關閉沉浸效果' : '開啟沉浸效果');
    window.dispatchEvent(new CustomEvent('plum:effects', { detail: { enabled } }));
    try {
      sessionStorage.setItem('plum-effects', enabled ? 'on' : 'off');
    } catch {
      /* 訪客停用儲存時仍維持本次頁面狀態。 */
    }
  };

  let storedEffects = null;
  try {
    storedEffects = sessionStorage.getItem('plum-effects');
  } catch {
    /* 無儲存權限時使用系統動態偏好。 */
  }
  setEffects(storedEffects ? storedEffects === 'on' : !reducedMotion);
  effectToggle?.addEventListener('click', () => {
    setEffects(effectToggle.getAttribute('aria-pressed') !== 'true');
  });

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

  const activateScene = (section) => {
    if (!section) return;
    const scene = section.dataset.scene || 'hero';
    const index = scenes.indexOf(section);
    body.dataset.scene = scene;
    if (railIndex) railIndex.textContent = String(Math.max(0, index)).padStart(2, '0');
    if (railTitle) railTitle.textContent = section.dataset.chapter || '';
    window.dispatchEvent(new CustomEvent('plum:scene', { detail: { scene, index } }));
  };

  if ('IntersectionObserver' in window && scenes.length) {
    const sceneObserver = new IntersectionObserver((entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (active) activateScene(active.target);
    }, { rootMargin: '-44% 0px -44% 0px', threshold: [0, .01, .1] });
    scenes.forEach((section) => sceneObserver.observe(section));
  } else {
    activateScene(scenes[0]);
  }

  if ('IntersectionObserver' in window && castLinks.length) {
    const profileObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        castLinks.forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-30% 0px -58% 0px', threshold: 0 });
    document.querySelectorAll('.character-profile').forEach((profile) => profileObserver.observe(profile));
  }

  if (finePointer && !reducedMotion) {
    const tiltTargets = document.querySelectorAll('.promise-card, .mechanic, .outcome, .faction-grid article, .character-portrait, .gallery-card');
    tiltTargets.forEach((target) => {
      target.addEventListener('pointermove', (event) => {
        const rect = target.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
        const depth = target.matches('.character-portrait, .gallery-card') ? 3.2 : 2.2;
        target.style.setProperty('--card-rx', `${(0.5 - y) * depth}deg`);
        target.style.setProperty('--card-ry', `${(x - 0.5) * depth}deg`);
        target.style.setProperty('--pointer-x', `${x * 100}%`);
        target.style.setProperty('--pointer-y', `${y * 100}%`);
      }, { passive: true });
      target.addEventListener('pointerleave', () => {
        target.style.setProperty('--card-rx', '0deg');
        target.style.setProperty('--card-ry', '0deg');
      });
    });
  }

  document.querySelectorAll('[data-tactical-scan]').forEach((target) => {
    target.addEventListener('pointermove', (event) => {
      if (!finePointer) return;
      const rect = target.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      target.style.setProperty('--scan-x', `${x * 100}%`);
      target.style.setProperty('--scan-y', `${y * 100}%`);
    }, { passive: true });
  });

  if (typeof document.startViewTransition === 'function' && !reducedMotion) {
    document.querySelectorAll('.faq summary').forEach((summary) => {
      summary.addEventListener('click', (event) => {
        event.preventDefault();
        const details = summary.closest('details');
        document.startViewTransition(() => {
          details.open = !details.open;
        });
      });
    });
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

  requestAnimationFrame(() => document.documentElement.classList.add('experience-ready'));
})();
