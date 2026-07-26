(() => {
  'use strict';

  const canvas = document.querySelector('#plum-field');
  if (!canvas) return;

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: coarsePointerQuery.matches ? 'low-power' : 'high-performance',
    premultipliedAlpha: true,
    preserveDrawingBuffer: false
  });

  if (!gl) {
    document.documentElement.classList.add('webgl-fallback');
    return;
  }

  const vertexSource = `#version 300 es
    in vec2 a_position;
    out vec2 v_uv;

    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `#version 300 es
    precision highp float;

    in vec2 v_uv;
    out vec4 outColor;

    uniform vec2 u_resolution;
    uniform vec2 u_pointer;
    uniform float u_time;
    uniform float u_scroll;
    uniform float u_scene;
    uniform float u_energy;

    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
        mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),
        f.y
      );
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.52;
      mat2 turn = mat2(0.82, -0.57, 0.57, 0.82);
      for (int octave = 0; octave < 5; octave++) {
        value += amplitude * noise(p);
        p = turn * p * 2.03 + 8.17;
        amplitude *= 0.49;
      }
      return value;
    }

    mat2 rotate2d(float angle) {
      float c = cos(angle);
      float s = sin(angle);
      return mat2(c, -s, s, c);
    }

    float flower(vec2 p, float size, float phase) {
      float angle = atan(p.y, p.x);
      float radius = length(p);
      float lobe = 0.68 + 0.32 * cos(angle * 5.0 + phase);
      float edge = size * lobe;
      float petals = smoothstep(edge, edge - size * 0.16, radius);
      float core = smoothstep(size * 0.26, 0.0, radius);
      return max(petals * 0.78, core);
    }

    float perspectiveGrid(vec2 p, float sceneMask) {
      p.y += 0.22;
      float depth = max(0.12, p.y + 1.1);
      vec2 gridUv = vec2(p.x / depth, 1.0 / depth) * vec2(6.0, 2.8);
      vec2 grid = abs(fract(gridUv - 0.5) - 0.5) / max(fwidth(gridUv), vec2(0.001));
      float line = 1.0 - min(min(grid.x, grid.y), 1.0);
      float fade = smoothstep(-0.45, 0.55, p.y) * (1.0 - smoothstep(0.5, 1.35, p.y));
      return line * fade * sceneMask;
    }

    void main() {
      vec2 frag = gl_FragCoord.xy;
      vec2 uv = (frag - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
      vec2 pointer = (u_pointer - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
      vec2 fromPointer = uv - pointer;
      float time = u_time * (0.22 + 0.78 * u_energy);

      float sceneGame = exp(-pow((u_scene - 0.34) * 8.0, 2.0));
      float sceneFire = smoothstep(0.68, 0.88, u_scene) * (1.0 - smoothstep(0.94, 1.02, u_scene));
      float sceneFilm = exp(-pow((u_scene - 0.62) * 8.0, 2.0));

      float pointerPulse = exp(-dot(fromPointer, fromPointer) * 5.5);
      vec2 drift = vec2(
        fbm(uv * 1.35 + vec2(time * 0.035, -time * 0.021)),
        fbm(uv * 1.22 + vec2(-time * 0.018, time * 0.028) + 11.7)
      );
      vec2 warped = uv + (drift - 0.5) * (0.28 + pointerPulse * 0.08);
      float ink = fbm(warped * 1.7 + vec2(0.0, u_scroll * 0.9));
      float silk = fbm(warped * 4.4 - vec2(time * 0.028, time * 0.014));
      float wash = smoothstep(0.34, 0.83, ink + silk * 0.18 + pointerPulse * 0.1);
      float vein = pow(max(0.0, 1.0 - abs(silk - 0.54) * 14.0), 3.0);

      vec3 jade = vec3(0.035, 0.17, 0.145);
      vec3 plum = vec3(0.43, 0.075, 0.20);
      vec3 ember = vec3(0.78, 0.22, 0.08);
      vec3 gold = vec3(0.96, 0.69, 0.24);
      vec3 film = vec3(0.18, 0.34, 0.31);

      vec3 sceneColor = mix(jade, plum, smoothstep(0.12, 0.55, u_scene));
      sceneColor = mix(sceneColor, film, sceneFilm * 0.65);
      sceneColor = mix(sceneColor, ember, sceneFire * 0.72);
      vec3 color = sceneColor * wash * 0.58;
      color += gold * vein * (0.045 + sceneFire * 0.09);
      color += mix(plum, gold, pointerPulse) * pointerPulse * 0.08 * u_energy;

      float grid = perspectiveGrid(uv, sceneGame);
      color += mix(vec3(0.12, 0.52, 0.46), gold, 0.22) * grid * 0.34;

      float blossoms = 0.0;
      for (int index = 0; index < 9; index++) {
        float fi = float(index);
        float seed = hash21(vec2(fi + 2.3, fi * 7.17));
        float driftSeed = hash21(vec2(fi * 3.1, fi + 9.4));
        vec2 position = vec2(
          mix(-1.15, 1.15, seed) + sin(time * 0.16 + fi) * 0.08,
          1.25 - mod(time * mix(0.035, 0.075, driftSeed) + seed * 2.4 + u_scroll * 0.16, 2.5)
        );
        vec2 petalUv = rotate2d(time * 0.09 * mix(-1.0, 1.0, seed) + fi) * (uv - position);
        blossoms += flower(petalUv, mix(0.018, 0.045, driftSeed), fi);
      }
      color += mix(vec3(0.86, 0.23, 0.42), gold, sceneFire * 0.55) * blossoms * 0.44;

      float vignette = 1.0 - smoothstep(0.5, 1.18, length(uv * vec2(0.82, 1.0)));
      float alpha = (wash * 0.24 + vein * 0.04 + grid * 0.16 + blossoms * 0.24) * vignette * u_energy;
      alpha *= 0.72 + 0.28 * sin(v_uv.y * 3.14159);
      outColor = vec4(color, clamp(alpha, 0.0, 0.72));
    }
  `;

  const compileShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || 'Shader compilation failed');
    }
    return shader;
  };

  let program;
  try {
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Shader link failed');
    }
  } catch (error) {
    console.warn('《梅香境》沉浸背景已切換為靜態模式。', error);
    document.documentElement.classList.add('webgl-fallback');
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);

  gl.useProgram(program);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    pointer: gl.getUniformLocation(program, 'u_pointer'),
    time: gl.getUniformLocation(program, 'u_time'),
    scroll: gl.getUniformLocation(program, 'u_scroll'),
    scene: gl.getUniformLocation(program, 'u_scene'),
    energy: gl.getUniformLocation(program, 'u_energy')
  };

  const sceneValues = {
    hero: 0.03,
    promise: 0.1,
    story: 0.2,
    gameplay: 0.34,
    choice: 0.42,
    affinity: 0.5,
    cast: 0.56,
    cinematic: 0.62,
    world: 0.69,
    gallery: 0.73,
    boss: 0.84,
    development: 0.9,
    accessibility: 0.93,
    faq: 0.96,
    final: 1
  };

  const lowPower = coarsePointerQuery.matches || (navigator.deviceMemory && navigator.deviceMemory <= 4);
  const pixelRatioCap = lowPower ? 0.85 : 1.35;
  const frameInterval = lowPower ? 1000 / 30 : 1000 / 50;
  const pointerTarget = { x: 0.72, y: 0.58 };
  const pointerCurrent = { ...pointerTarget };
  let targetScene = sceneValues.hero;
  let currentScene = targetScene;
  let effectsEnabled = true;
  let lastFrame = 0;
  let animationFrame = 0;
  let scrollProgress = 0;
  let staticFrameDirty = true;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, pixelRatioCap);
    const width = Math.max(1, Math.floor(window.innerWidth * ratio));
    const height = Math.max(1, Math.floor(window.innerHeight * ratio));
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    staticFrameDirty = true;
  };

  const updateScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    if (reducedMotionQuery.matches) staticFrameDirty = true;
  };

  const render = (timestamp, force = false) => {
    animationFrame = requestAnimationFrame(render);
    const staticMode = reducedMotionQuery.matches || !effectsEnabled;
    if (!force && (document.hidden || (staticMode && !staticFrameDirty) || timestamp - lastFrame < frameInterval)) return;
    lastFrame = timestamp;
    staticFrameDirty = false;

    const motionEnergy = reducedMotionQuery.matches ? 0.38 : 1;
    const targetEnergy = effectsEnabled ? motionEnergy : 0;
    currentScene += (targetScene - currentScene) * (reducedMotionQuery.matches ? 1 : 0.045);
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.065;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.065;

    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.pointer, pointerCurrent.x, pointerCurrent.y);
    gl.uniform1f(uniforms.time, reducedMotionQuery.matches ? 0 : timestamp * 0.001);
    gl.uniform1f(uniforms.scroll, scrollProgress);
    gl.uniform1f(uniforms.scene, currentScene);
    gl.uniform1f(uniforms.energy, targetEnergy);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  window.addEventListener('pointermove', (event) => {
    if (coarsePointerQuery.matches || reducedMotionQuery.matches) return;
    pointerTarget.x = event.clientX / window.innerWidth;
    pointerTarget.y = 1 - event.clientY / window.innerHeight;
  }, { passive: true });

  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', resize);
  window.addEventListener('plum:scene', (event) => {
    targetScene = sceneValues[event.detail?.scene] ?? targetScene;
    staticFrameDirty = true;
  });
  window.addEventListener('plum:effects', (event) => {
    effectsEnabled = Boolean(event.detail?.enabled);
    canvas.classList.toggle('is-disabled', !effectsEnabled);
    staticFrameDirty = true;
  });
  reducedMotionQuery.addEventListener('change', () => { staticFrameDirty = true; });

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    cancelAnimationFrame(animationFrame);
    document.documentElement.classList.add('webgl-fallback');
  });

  resize();
  updateScroll();
  document.documentElement.classList.add('has-webgl');
  animationFrame = requestAnimationFrame(render);
})();
