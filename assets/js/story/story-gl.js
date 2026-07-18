/* /story/ P2 — WebGL 增強層（漸進、非破壞）。
   硬底線：任何環境下 GL 失敗都無痕退回 P1 靜態版。
   three 只在所有護欄通過後才動態載入（saveData / reduced-motion / 無 WebGL2 / ?nogl=1 一律不下載）。
   三特效：1) hero 粒子聚焦（含 2) 片內底片顆粒）  3) 〈光〉開場 displacement 序曲。 */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;

  /* ---------- 護欄：全過才跑 ---------- */
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('nogl') === '1') return;
    if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (navigator.connection && navigator.connection.saveData) return;
    if (innerWidth < 360) return;
    var probe = doc.createElement('canvas').getContext('webgl2');
    if (!probe) return;
    probe = null;
  } catch (e) { return; }

  var MOBILE = innerWidth < 768;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var ric = window.requestIdleCallback || function (fn) { return setTimeout(fn, 300); };

  /* 主執行緒禮貌：延到 idle 後、three 動態載入成功才初始化 */
  ric(function () {
    import('three').then(function (THREE) { init(THREE); })['catch'](function () {/* 靜默退回 P1 */});
  });

  /* ================================================================= */
  function init(THREE) {
    startHeroWhenReady(THREE);
    setupOverture(THREE);
  }

  /* ===== 特效 1+2：hero 粒子聚焦 ＋ 片內底片顆粒 ===== */
  var HERO_VS = [
    'uniform float uProgress,uTime,uSize,uPR;uniform vec2 uSpread;',
    'attribute vec3 aColor,aSeed;varying vec3 vColor;varying float vA;',
    'void main(){vColor=aColor;vec3 tgt=position;',
    'vec3 start=tgt+vec3(aSeed.xy*uSpread,0.);',
    'float p=uProgress;vec3 pos=mix(start,tgt,p);float turb=1.-p;',
    'pos.x+=sin(uTime*1.7+aSeed.x*9.)*26.*turb;',
    'pos.y+=cos(uTime*1.9+aSeed.y*9.)*26.*turb;',
    'vA=smoothstep(0.,.16,p);',
    'gl_PointSize=uSize*uPR*(.65+aSeed.z*.5);',
    'gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);}'
  ].join('');
  var HERO_FS = [
    'uniform float uTime;varying vec3 vColor;varying float vA;',
    'float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}',
    'void main(){vec2 uv=gl_PointCoord*2.-1.;float d=dot(uv,uv);if(d>1.)discard;',
    'float edge=smoothstep(1.,.25,d);',
    'float g=hash(gl_FragCoord.xy+uTime);',            // 時間驅動底片顆粒
    'vec3 c=vColor*(.82+.34*g);',
    'gl_FragColor=vec4(c,edge*vA);}'
  ].join('');

  function startHeroWhenReady(THREE) {
    var img = doc.querySelector('.act-hero .media-img');
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) startHero(THREE, img);
    else img.addEventListener('load', function () { startHero(THREE, img); }, { once: true });
  }

  function startHero(THREE, img) {
    try { if (sessionStorage.getItem('storyGlHero') === '1') return; } catch (e) {}   // 只播一次
    var canvas = doc.getElementById('story-hero-gl');
    var host = canvas && canvas.parentNode;                                            // .hero-media
    if (!canvas || !host) return;
    var W = host.clientWidth, H = host.clientHeight;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    if (!W || !H || !iw || !ih) return;

    /* 取樣：把 hero 圖降到 COLS×ROWS 網格，每像素一顆粒 */
    var COLS = MOBILE ? 134 : 232, ROWS = Math.round(COLS * ih / iw);
    var off = doc.createElement('canvas'); off.width = COLS; off.height = ROWS;
    var octx = off.getContext('2d'); if (!octx) return;
    octx.drawImage(img, 0, 0, COLS, ROWS);
    var data;
    try { data = octx.getImageData(0, 0, COLS, ROWS).data; } catch (e) { return; }

    var scale = Math.max(W / iw, H / ih), dw = iw * scale, dh = ih * scale;            // object-fit:cover
    var N = COLS * ROWS, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), seed = new Float32Array(N * 3);
    var k = 0;
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
      var u = COLS > 1 ? x / (COLS - 1) : .5, v = ROWS > 1 ? y / (ROWS - 1) : .5, di = (y * COLS + x) * 4;
      pos[k] = (u - .5) * dw; pos[k + 1] = (.5 - v) * dh; pos[k + 2] = 0;
      col[k] = data[di] / 255; col[k + 1] = data[di + 1] / 255; col[k + 2] = data[di + 2] / 255;
      seed[k] = Math.random() * 2 - 1; seed[k + 1] = Math.random() * 2 - 1; seed[k + 2] = Math.random();
      k += 3;
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3));
    var uni = {
      uProgress: { value: 0 }, uTime: { value: 0 },
      uSize: { value: Math.max(dw / COLS, dh / ROWS) * 1.45 }, uPR: { value: DPR },
      uSpread: { value: new THREE.Vector2(W * .75, H * .75) }
    };
    var mat = new THREE.ShaderMaterial({
      uniforms: uni, transparent: true, depthTest: false, depthWrite: false,
      vertexShader: HERO_VS, fragmentShader: HERO_FS
    });
    var pts = new THREE.Points(geo, mat); pts.frustumCulled = false;
    var scene = new THREE.Scene(); scene.add(pts);
    var cam = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -1, 1);

    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { geo.dispose(); mat.dispose(); return; }
    renderer.setPixelRatio(DPR); renderer.setSize(W, H, false);

    try { sessionStorage.setItem('storyGlHero', '1'); } catch (e) {}
    root.classList.add('gl-hero'); canvas.hidden = false;

    var DUR = 2.8, t0 = 0, last = 0, ended = false, gone = false, raf = 0, vis = true, inView = true;

    function dispose() {
      if (gone) return; gone = true;
      if (raf) cancelAnimationFrame(raf);
      geo.dispose(); mat.dispose(); renderer.dispose();
      var gl = renderer.getContext && renderer.getContext(), lc = gl && gl.getExtension && gl.getExtension('WEBGL_lose_context');
      if (lc) lc.loseContext();
    }
    function tick(t) {
      raf = 0; if (gone) return;
      if (!last) last = t; var dt = Math.min((t - last) / 1000, .05); last = t;
      if (vis && inView) {
        t0 += dt; var p = Math.min(t0 / DUR, 1), e = 1 - Math.pow(1 - p, 3);   // easeOutCubic
        uni.uProgress.value = e; uni.uTime.value += dt;
        renderer.render(scene, cam);
        if (p >= 1 && !ended) {
          ended = true;
          root.classList.add('gl-hero-done');                                   // CSS 淡出 canvas、淡入靜態 hero
          setTimeout(function () { canvas.hidden = true; dispose(); }, 820);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { inView = es[0].isIntersecting; last = 0; }, { threshold: 0 }).observe(host);
    }
    doc.addEventListener('visibilitychange', function () { vis = !doc.hidden; last = 0; });
    canvas.addEventListener('webglcontextlost', function (ev) {                  // 靜默退回：直接顯示靜態 hero
      ev.preventDefault(); root.classList.add('gl-hero-done'); canvas.hidden = true; dispose();
    }, false);
    window.addEventListener('pagehide', dispose, { once: true });
  }

  /* ===== 特效 3：〈光〉開場 displacement 序曲（sticky 300vh，3 張溶接） ===== */
  var OV_VS = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.);}';
  var OV_FS = [
    'uniform sampler2D uTexA,uTexB;uniform float uMix,uAspA,uAspB,uCanvas,uAmt;varying vec2 vUv;',
    'vec2 cover(vec2 p,float a){vec2 s=uCanvas<a?vec2(uCanvas/a,1.):vec2(1.,a/uCanvas);return(p-.5)*s+.5;}',
    'float hash(vec2 p){return fract(sin(dot(p,vec2(41.,289.)))*43758.5453);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
    'float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));',
    'return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}',
    'void main(){vec2 ua=cover(vUv,uAspA),ub=cover(vUv,uAspB);float m=smoothstep(0.,1.,uMix);',
    'float lum=dot(texture2D(uTexA,ua).rgb,vec3(.299,.587,.114));',              // 由亮度＋程序噪聲生成位移
    'float disp=mix(noise(vUv*4.),lum,.6);vec2 dd=vec2(disp-.5)*uAmt;',
    'vec3 A=texture2D(uTexA,ua+dd*m).rgb,B=texture2D(uTexB,ub-dd*(1.-m)).rgb;',
    'gl_FragColor=vec4(mix(A,B,m),1.);}'
  ].join('');

  function setupOverture(THREE) {
    var sec = doc.querySelector('[data-gl-overture]');
    var canvas = sec && sec.querySelector('.overture-gl');
    if (!canvas) return;
    var urls = [sec.dataset.img0, sec.dataset.img1, sec.dataset.img2];
    if (!urls[0] || !urls[1] || !urls[2]) return;

    root.classList.add('gl-overture');   // 先給 section 300vh 版面（GPU 資源仍延後建立）；失敗時再收回

    var built = false, dead = false, ren, scene, cam, mat, geo, tex = [], seg = -1, asp = [1, 1, 1],
        raf = 0, act = false, vis = true, watchdog = 0;

    function collapse() { teardown(); root.classList.remove('gl-overture'); }   // 徹底退回 P1（長卷承接）
    function teardown() {
      dead = true; built = false; act = false; if (raf) cancelAnimationFrame(raf); raf = 0;
      clearTimeout(watchdog);
      tex.forEach(function (t) { t && t.dispose(); }); tex = [];
      if (geo) geo.dispose(); if (mat) mat.dispose();
      if (ren) { ren.dispose(); var gl = ren.getContext && ren.getContext(), lc = gl && gl.getExtension && gl.getExtension('WEBGL_lose_context'); if (lc) lc.loseContext(); }
      ren = scene = cam = mat = geo = null; seg = -1;
    }
    function build() {
      if (built) return; built = true; dead = false;
      try { ren = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, powerPreference: 'high-performance' }); }
      catch (e) { built = false; return collapse(); }
      ren.setPixelRatio(DPR);
      scene = new THREE.Scene();
      cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      geo = new THREE.PlaneGeometry(2, 2);
      mat = new THREE.ShaderMaterial({
        uniforms: { uTexA: { value: null }, uTexB: { value: null }, uMix: { value: 0 }, uAspA: { value: 1 }, uAspB: { value: 1 }, uCanvas: { value: 1 }, uAmt: { value: .16 } },
        vertexShader: OV_VS, fragmentShader: OV_FS
      });
      scene.add(new THREE.Mesh(geo, mat));
      var loader = new THREE.TextureLoader();
      urls.forEach(function (u, i) {
        loader.load(u, function (tx) {
          tx.colorSpace = THREE.SRGBColorSpace; tx.minFilter = THREE.LinearFilter; tx.generateMipmaps = false;
          tex[i] = tx; asp[i] = tx.image.width / tx.image.height; seg = -1;
        }, null, function () { collapse(); });                                   // 任一張載不到→收回，不留空洞
      });
      watchdog = setTimeout(function () { if (!(tex[0] && tex[1] && tex[2])) collapse(); }, 6000);
      resize();
      canvas.addEventListener('webglcontextlost', function (ev) { ev.preventDefault(); collapse(); }, false);
    }
    function resize() {
      if (!ren) return; var w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
      ren.setSize(w, h, false); mat.uniforms.uCanvas.value = w / h;
    }
    function prog() {
      var r = sec.getBoundingClientRect(), travel = sec.offsetHeight - innerHeight;
      return travel <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / travel));
    }
    function frame() {
      raf = 0; if (dead) return;
      if (act && vis && tex[0] && tex[1] && tex[2]) {
        var p = prog() * 2, s = p < 1 ? 0 : 1, t = p < 1 ? p : p - 1;
        if (s !== seg) { seg = s; mat.uniforms.uTexA.value = tex[s]; mat.uniforms.uTexB.value = tex[s + 1]; mat.uniforms.uAspA.value = asp[s]; mat.uniforms.uAspB.value = asp[s + 1]; }
        mat.uniforms.uMix.value = t; ren.render(scene, cam);
      }
      raf = requestAnimationFrame(frame);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { build(); if (dead) return; act = true; if (!raf) raf = requestAnimationFrame(frame); }
        else { act = false; teardown(); }                                       // 捲離視口→釋放 GPU 資源（版面保留）
      }, { rootMargin: '200px 0px 200px 0px', threshold: 0 }).observe(sec);
    } else { build(); act = true; raf = requestAnimationFrame(frame); }

    doc.addEventListener('visibilitychange', function () { vis = !doc.hidden; });
    window.addEventListener('resize', resize);
    window.addEventListener('pagehide', teardown, { once: true });
  }
})();
