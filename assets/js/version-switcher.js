(function () {
  var pageMap = {
    '/': { modern: '/index.html', classic: '/index-classic.html' },
    '/index.html': { modern: '/index.html', classic: '/index-classic.html' },
    '/index-classic.html': { modern: '/index.html', classic: '/index-classic.html' },
    '/technical-adviser.html': { modern: '/technical-adviser.html', classic: '/technical-adviser-classic.html' },
    '/technical-adviser-classic.html': { modern: '/technical-adviser.html', classic: '/technical-adviser-classic.html' },
    '/education-training.html': { modern: '/education-training.html', classic: '/education-training-classic.html' },
    '/education-training-classic.html': { modern: '/education-training.html', classic: '/education-training-classic.html' },
    '/photography/': { modern: '/photography/index.html', classic: '/photography/index-classic.html' },
    '/photography/index.html': { modern: '/photography/index.html', classic: '/photography/index-classic.html' },
    '/photography/index-classic.html': { modern: '/photography/index.html', classic: '/photography/index-classic.html' }
  };

  function normalize(pathname) {
    if (!pathname) return '/';
    return pathname.endsWith('/') ? pathname : pathname;
  }

  function resolvePair(pathname) {
    var path = normalize(pathname);
    return pageMap[path] || null;
  }

  function getMode(pathname) {
    return pathname.indexOf('-classic.html') > -1 ? 'classic' : 'modern';
  }

  function applySwitcher() {
    var pair = resolvePair(window.location.pathname);
    var switcher = document.getElementById('version-switcher');
    if (!switcher || !pair) return;

    var currentMode = getMode(window.location.pathname);
    var targetMode = currentMode === 'modern' ? 'classic' : 'modern';
    var targetHref = targetMode === 'classic' ? pair.classic : pair.modern;

    var statusNode = switcher.querySelector('[data-version-status]');
    var linkNode = switcher.querySelector('[data-version-link]');

    if (statusNode) {
      statusNode.textContent = currentMode === 'modern' ? '目前：新版體驗' : '目前：經典版';
    }

    if (linkNode) {
      linkNode.setAttribute('href', targetHref);
      linkNode.textContent = currentMode === 'modern' ? '切換到經典版' : '切換到新版體驗';
      linkNode.addEventListener('click', function () {
        localStorage.setItem('site-version-preference', targetMode);
      });
    }
  }

  function autoRedirectByPreference() {
    var pref = localStorage.getItem('site-version-preference');
    if (pref !== 'classic' && pref !== 'modern') return;
    var pair = resolvePair(window.location.pathname);
    if (!pair) return;

    var currentMode = getMode(window.location.pathname);
    if (currentMode === pref) return;

    var target = pref === 'classic' ? pair.classic : pair.modern;
    if (window.location.pathname !== target) {
      window.location.replace(target);
    }
  }

  autoRedirectByPreference();
  document.addEventListener('DOMContentLoaded', applySwitcher);
})();
