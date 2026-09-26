/* Keep Flickr as the primary source; use the reviewed local copy on CDN errors. */
(() => {
  const base = new URL('../../', document.currentScript.src);
  const pending = new WeakSet();
  let copies;

  async function recover(img) {
    if (!(img instanceof HTMLImageElement) || pending.has(img)) return;
    const match = /^https:\/\/live\.staticflickr\.com\/\d+\/(\d+)_/.exec(img.currentSrc || img.src);
    if (!match) return;
    pending.add(img);
    try {
      copies ||= fetch(new URL('assets/data/flickr-fallbacks.json', base))
        .then(response => {
          if (!response.ok) throw new Error('Image fallback map unavailable');
          return response.json();
        });
      const local = (await copies)[match[1]];
      if (!local?.startsWith('/') || local.startsWith('//')) return;
      img.dataset.flickrFallback = match[1];
      img.closest('picture')?.querySelectorAll('source').forEach(source => source.removeAttribute('srcset'));
      img.removeAttribute('srcset');
      // Isotope may have measured the grid before this asynchronous recovery.
      img.addEventListener('load', () => window.dispatchEvent(new Event('resize')), { once: true });
      img.src = new URL(local.slice(1), base).href;
    } catch { /* Do not loop or retry against an unavailable image service. */ }
  }

  document.addEventListener('error', event => recover(event.target), true);
  // Deferred scripts can start after an above-the-fold image has already failed.
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && !img.naturalWidth) recover(img);
  });
})();
