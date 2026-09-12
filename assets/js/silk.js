/**
 * silk.js — 深色帶的「流動絲綢」背景（WebGL fragment shader）。
 *
 * 用法：在深色區塊加 `data-silk="ink|blue|gold"`（可選 `data-silk-speed="0.6"`），
 * 本檔會插入 <canvas class="silk"> 並在有 WebGL 時繪製；下列情況一律安全退回純 CSS 背景：
 *   - 無 WebGL／建立 context 失敗／context lost
 *   - `prefers-reduced-motion: reduce`：只畫一張靜態畫面，不做動畫
 *   - 網址帶 ?nogl=1（與 /story/ 慣例一致）
 * 效能守則：DPR 上限 1.5、內部解析度 0.6 倍（絲綢本來就柔，看不出差）、
 * 不在視窗內或分頁隱藏時停止 rAF、ResizeObserver 只在尺寸真的變動時重設。
 * 純裝飾層：aria-hidden、pointer-events:none，內容仍在上層 DOM，與無障礙無關。
 */

const PALETTES = {
  ink: { a: [0.137, 0.125, 0.125], b: [0.235, 0.2, 0.16], c: [0.898, 0.639, 0.0], glow: 0.55 },
  blue: { a: [0.027, 0.067, 0.122], b: [0.06, 0.16, 0.34], c: [0.09, 0.42, 1.0], glow: 0.5 },
  gold: { a: [0.98, 0.95, 0.88], b: [0.99, 0.9, 0.7], c: [0.898, 0.639, 0.0], glow: 0.35 },
};

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_a;
uniform vec3 u_b;
uniform vec3 u_c;
uniform float u_glow;

float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.-2.*f);
  float a = hash(i), b = hash(i+vec2(1.,0.)), c = hash(i+vec2(0.,1.)), d = hash(i+vec2(1.,1.));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){
  float v = 0., amp = .5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for(int i=0;i<4;i++){ v += amp*noise(p); p = r*p*2.02 + vec2(1.7, 9.2); amp *= .5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv * vec2(u_res.x/u_res.y, 1.) * 1.6;
  float t = u_time * .06;
  // 兩層 domain warp → 絲綢摺痕
  vec2 q = vec2(fbm(p + vec2(0., t)), fbm(p + vec2(5.2, 1.3) - t*.7));
  vec2 r = vec2(fbm(p + 2.6*q + vec2(1.7, 9.2) + t*.4), fbm(p + 2.6*q + vec2(8.3, 2.8) - t*.3));
  float f = fbm(p + 2.2*r);
  float band = smoothstep(.25, .85, f);
  float sheen = pow(smoothstep(.55, .95, fbm(p*1.8 + r + t)), 3.);
  vec3 col = mix(u_a, u_b, band);
  col = mix(col, u_c, sheen * u_glow * (0.35 + 0.65*uv.y));
  // 角落暗角，讓文字區更乾淨
  float vig = smoothstep(1.35, .35, length((uv - .5) * vec2(1.15, 1.)));
  col *= mix(.78, 1., vig);
  // 微顆粒，避免色帶
  col += (hash(gl_FragCoord.xy + fract(u_time)) - .5) * .012;
  gl_FragColor = vec4(col, 1.);
}`;

const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const noGl = () => /(?:\?|&)nogl=1(?:&|$)/.test(location.search);

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function mount(host) {
  if (host.__silk || noGl()) return null;
  const palette = PALETTES[host.dataset.silk] || PALETTES.ink;
  const speed = Number(host.dataset.silkSpeed || 1) || 1;
  const canvas = document.createElement('canvas');
  canvas.className = 'silk';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(prog, 'u_res'),
    time: gl.getUniformLocation(prog, 'u_time'),
    a: gl.getUniformLocation(prog, 'u_a'),
    b: gl.getUniformLocation(prog, 'u_b'),
    c: gl.getUniformLocation(prog, 'u_c'),
    glow: gl.getUniformLocation(prog, 'u_glow'),
  };
  gl.uniform3fv(u.a, palette.a);
  gl.uniform3fv(u.b, palette.b);
  gl.uniform3fv(u.c, palette.c);
  gl.uniform1f(u.glow, palette.glow);

  host.classList.add('silk-host');
  host.insertBefore(canvas, host.firstChild);

  const state = { raf: 0, visible: false, hidden: document.hidden, lost: false, w: 0, h: 0, start: performance.now(), staticDrawn: false };

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (w === state.w && h === state.h) return;
    state.w = w; state.h = h;
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(u.res, w, h);
    state.staticDrawn = false;
  };

  const draw = (t) => {
    gl.uniform1f(u.time, t * speed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!canvas.classList.contains('is-ready')) canvas.classList.add('is-ready');
  };

  const frame = () => {
    state.raf = 0;
    if (state.lost || !state.visible || state.hidden) return;
    resize();
    if (reduceMotion()) {
      if (!state.staticDrawn) { draw(12); state.staticDrawn = true; }
      return;
    }
    draw((performance.now() - state.start) / 1000);
    state.raf = requestAnimationFrame(frame);
  };

  const schedule = () => { if (!state.raf) state.raf = requestAnimationFrame(frame); };

  const io = new IntersectionObserver((entries) => {
    state.visible = entries.some((e) => e.isIntersecting);
    if (state.visible) schedule();
  }, { rootMargin: '80px' });
  io.observe(host);

  const onVis = () => { state.hidden = document.hidden; if (!state.hidden) schedule(); };
  document.addEventListener('visibilitychange', onVis);

  const ro = new ResizeObserver(() => { resize(); state.staticDrawn = false; schedule(); });
  ro.observe(host);

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onMq = () => { state.staticDrawn = false; schedule(); };
  mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq);

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); state.lost = true; canvas.classList.remove('is-ready'); });
  canvas.addEventListener('webglcontextrestored', () => { state.lost = false; state.w = 0; schedule(); });

  host.__silk = {
    destroy() {
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      if (state.raf) cancelAnimationFrame(state.raf);
      canvas.remove();
      host.classList.remove('silk-host');
      delete host.__silk;
    },
  };
  return host.__silk;
}

function mountAll(root = document) {
  root.querySelectorAll('[data-silk]').forEach((el) => mount(el));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => mountAll());
else mountAll();

window.SwankySilk = { mount, mountAll, PALETTES };
export { mount, mountAll, PALETTES };
