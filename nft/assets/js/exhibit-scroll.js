/* Optional controls for native scrollable exhibits. Touch and keyboard still
   work when JavaScript is unavailable. Called again after UCX data renders. */
(function () {
 'use strict';
 window.initExhibitScroll = function () {
  document.querySelectorAll('[data-scroll-for]').forEach(function (controls) {
   if (controls.dataset.ready) return;
   var track = document.getElementById(controls.dataset.scrollFor);
   if (!track) return;
   controls.dataset.ready = 'true';
   var buttons = controls.querySelectorAll('button');
   function update() {
    var limit = track.scrollWidth - track.clientWidth;
    controls.hidden = limit <= 2;
    buttons[0].disabled = track.scrollLeft <= 2;
    buttons[1].disabled = track.scrollLeft >= limit - 2;
   }
   buttons.forEach(function (button) {
    button.addEventListener('click', function () {
     var first = track.firstElementChild;
     var second = first && first.nextElementSibling;
     var step = second ? second.offsetLeft - first.offsetLeft : track.clientWidth;
     track.scrollBy({left: Number(button.dataset.step) * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    });
   });
   track.addEventListener('scroll', update, {passive: true});
   if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
   else window.addEventListener('resize', update);
   update();
  });
 };
})();
