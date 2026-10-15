/* =========================================================
   Feliz cumpleaños, tío Jadiel — interacción
   Sin dependencias. Funciona aunque falten fotos o música.
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Configuración ---------- */
  const DEF = {
    nombre: "Jadiel", tratamiento: "Tío", fecha: "", deParte: "tus sobrinos", musicaAlAbrir: true,
    musica: { archivo: "assets/audio/musica.mp3", titulo: "Nuestra canción para ti" },
    fotos: [{ src: "assets/images/foto-1.jpg", pie: "" }, { src: "assets/images/foto-2.jpg", pie: "" }, { src: "assets/images/foto-3.jpg", pie: "" }],
    carta: { saludo: "", parrafos: [], despedida: "", firma: "" },
    deseos: [], mensajes: { deseo: "Que se cumpla tu deseo", vino: "Salud", brindis: "¡Salud!" }
  };
  const C = Object.assign({}, DEF, window.GIFT_CONFIG || {});
  C.musica = Object.assign({}, DEF.musica, C.musica || {});
  C.mensajes = Object.assign({}, DEF.mensajes, C.mensajes || {});

  const year = new Date().getFullYear();
  $$("[data-name]").forEach((el) => (el.textContent = C.nombre));
  $$("[data-trato]").forEach((el) => (el.textContent = C.tratamiento));
  $$("[data-trato-lower]").forEach((el) => (el.textContent = C.tratamiento.toLowerCase()));
  $$("[data-from]").forEach((el) => (el.textContent = C.deParte));
  document.title = `Feliz cumpleaños, ${C.tratamiento.toLowerCase()} ${C.nombre}`;

  /* =========================================================
     Audio: efectos y caja musical (Web Audio, sin archivos)
     ========================================================= */
  let actx = null, sfxBus = null, reverb = null;
  function audio() {
    if (actx) { if (actx.state === "suspended") actx.resume(); return actx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    actx = new AC();
    // Reverberación suave generada
    reverb = actx.createConvolver();
    const len = actx.sampleRate * 2.6, ir = actx.createBuffer(2, len, actx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    reverb.buffer = ir;
    const wet = actx.createGain(); wet.gain.value = 0.32;
    reverb.connect(wet).connect(actx.destination);
    sfxBus = actx.createGain(); sfxBus.gain.value = 0.7;
    sfxBus.connect(actx.destination); sfxBus.connect(reverb);
    return actx;
  }
  function noiseBuffer(sec) {
    const b = actx.createBuffer(1, actx.sampleRate * sec, actx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function bell(freq, t, { gain = 0.18, decay = 1.8, dest = sfxBus } = {}) {
    [[1, 1], [2, 0.32], [4.07, 0.08]].forEach(([m, g]) => {
      const o = actx.createOscillator(), v = actx.createGain();
      o.type = "sine"; o.frequency.value = freq * m;
      v.gain.setValueAtTime(0.0001, t);
      v.gain.exponentialRampToValueAtTime(gain * g, t + 0.008);
      v.gain.exponentialRampToValueAtTime(0.0001, t + decay / m);
      o.connect(v).connect(dest); o.start(t); o.stop(t + decay + 0.1);
    });
  }
  const SFX = {
    chime() {
      if (!audio()) return; const t = actx.currentTime;
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => bell(f, t + i * 0.09, { gain: 0.14, decay: 2.2 }));
    },
    pop() {
      if (!audio()) return; const t = actx.currentTime;
      const n = actx.createBufferSource(); n.buffer = noiseBuffer(0.12);
      const bp = actx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1400; bp.Q.value = 0.9;
      const g = actx.createGain(); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      n.connect(bp).connect(g).connect(sfxBus); n.start(t);
      const o = actx.createOscillator(), og = actx.createGain();
      o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(110, t + 0.12);
      og.gain.setValueAtTime(0.5, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      o.connect(og).connect(sfxBus); o.start(t); o.stop(t + 0.2);
    },
    blow() {
      if (!audio()) return; const t = actx.currentTime;
      const n = actx.createBufferSource(); n.buffer = noiseBuffer(1);
      const lp = actx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(400, t); lp.frequency.linearRampToValueAtTime(1600, t + 0.3); lp.frequency.linearRampToValueAtTime(300, t + 0.9);
      const g = actx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.18); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      n.connect(lp).connect(g).connect(sfxBus); n.start(t);
    },
    pour(sec = 2.4) {
      if (!audio()) return; const t = actx.currentTime;
      const n = actx.createBufferSource(); n.buffer = noiseBuffer(sec);
      const bp = actx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 3;
      bp.frequency.setValueAtTime(500, t); bp.frequency.linearRampToValueAtTime(950, t + sec);
      const g = actx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.25);
      g.gain.setValueAtTime(0.16, t + sec - 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + sec);
      const lfo = actx.createOscillator(), lg = actx.createGain(); lfo.frequency.value = 9; lg.gain.value = 0.05;
      lfo.connect(lg).connect(g.gain); lfo.start(t); lfo.stop(t + sec);
      n.connect(bp).connect(g).connect(sfxBus); n.start(t);
    },
    clink() {
      if (!audio()) return; const t = actx.currentTime;
      [2637, 3520, 5274].forEach((f, i) => bell(f, t + i * 0.004, { gain: 0.09, decay: 1.6 }));
      [2794, 3729].forEach((f) => bell(f, t + 0.018, { gain: 0.07, decay: 1.4 }));
    },
    sparkle() {
      if (!audio()) return; const t = actx.currentTime;
      [1568, 2093, 2637].forEach((f, i) => bell(f, t + i * 0.06, { gain: 0.05, decay: 1 }));
    }
  };

  /* Caja musical: "Feliz cumpleaños" (melodía de dominio público) */
  const MusicBox = (() => {
    const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const hz = (n) => 440 * Math.pow(2, (12 * (+n.slice(-1) + 1) + NOTE[n[0]] - 69) / 12);
    const SEQ = [
      ["G4", .75], ["G4", .25], ["A4", 1, "C3"], ["G4", 1], ["C5", 1], ["B4", 2, "G2"], [null, 1],
      ["G4", .75], ["G4", .25], ["A4", 1, "G2"], ["G4", 1], ["D5", 1], ["C5", 2, "C3"], [null, 1],
      ["G4", .75], ["G4", .25], ["G5", 1, "C3"], ["E5", 1], ["C5", 1, "F2"], ["B4", 1], ["A4", 2, "F2"], [null, 1],
      ["F5", .75], ["F5", .25], ["E5", 1, "C3"], ["C5", 1], ["D5", 1, "G2"], ["C5", 3, "C3"], [null, 3]
    ];
    const BEAT = 0.62;
    let master = null, timer = null, next = 0, idx = 0, playing = false;
    function bass(f, t) {
      const o = actx.createOscillator(), v = actx.createGain();
      o.type = "triangle"; o.frequency.value = f;
      v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(0.12, t + 0.03); v.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      o.connect(v).connect(master); o.start(t); o.stop(t + 2.4);
    }
    function tick() {
      while (next < actx.currentTime + 0.35) {
        const [n, d, b] = SEQ[idx];
        if (n) {
          bell(hz(n), next, { gain: 0.2, decay: 2.4, dest: master });
          if (b) { bass(hz(b), next); bell(hz(b) * 4, next + 0.02, { gain: 0.03, decay: 1.6, dest: master }); }
        }
        next += d * BEAT; idx = (idx + 1) % SEQ.length;
      }
    }
    return {
      play() {
        if (!audio()) return false;
        if (!master) { master = actx.createGain(); master.connect(actx.destination); master.connect(reverb); }
        master.gain.cancelScheduledValues(actx.currentTime);
        master.gain.setValueAtTime(0.0001, actx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.75, actx.currentTime + 0.6);
        next = actx.currentTime + 0.12; playing = true;
        clearInterval(timer); timer = setInterval(tick, 90); tick();
        return true;
      },
      pause() {
        if (!playing) return; playing = false; clearInterval(timer);
        master.gain.cancelScheduledValues(actx.currentTime);
        master.gain.setValueAtTime(master.gain.value, actx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.5);
      }
    };
  })();

  /* =========================================================
     Cielo: destellos, bokeh y estela del cursor
     ========================================================= */
  const Sky = (() => {
    const cv = $("#sky"), ctx = cv.getContext("2d");
    const COLS = ["232,207,149", "245,239,227", "199,109,130", "134,176,150", "180,184,189"];
    let W, H, dpr, parts = [], trail = [], running = true;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(90, (W * H) / 16000));
      while (parts.length < target) parts.push(make(true));
      parts.length = target;
    }
    function make(anywhere) {
      const type = Math.random() < 0.22 ? "bokeh" : Math.random() < 0.35 ? "star" : "dot";
      return {
        x: rand(0, W), y: anywhere ? rand(0, H) : H + 30, type,
        r: type === "bokeh" ? rand(14, 46) : type === "star" ? rand(1.6, 3.2) : rand(.6, 1.8),
        vy: type === "bokeh" ? rand(.05, .18) : rand(.12, .45), vx: rand(-.12, .12),
        tw: rand(0, Math.PI * 2), ts: rand(.008, .03), c: type === "bokeh" ? pick(COLS.slice(0, 4)) : pick(COLS.slice(0, 2)),
        a: type === "bokeh" ? rand(.04, .1) : rand(.35, .9)
      };
    }
    function star(x, y, r, a, c) {
      ctx.strokeStyle = `rgba(${c},${a})`; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.moveTo(x - r * 3, y); ctx.lineTo(x + r * 3, y); ctx.moveTo(x, y - r * 3); ctx.lineTo(x, y + r * 3); ctx.stroke();
      ctx.fillStyle = `rgba(${c},${a})`; ctx.beginPath(); ctx.arc(x, y, r * .7, 0, 7); ctx.fill();
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        p.y -= p.vy; p.x += p.vx; p.tw += p.ts;
        if (p.y < -60) Object.assign(p, make(false));
        const tw = .55 + .45 * Math.sin(p.tw);
        if (p.type === "bokeh") {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(${p.c},${p.a * tw})`); g.addColorStop(.7, `rgba(${p.c},${p.a * .5 * tw})`); g.addColorStop(1, `rgba(${p.c},0)`);
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        } else if (p.type === "star") star(p.x, p.y, p.r, p.a * tw, p.c);
        else { ctx.fillStyle = `rgba(${p.c},${p.a * tw})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i]; t.life -= .025; t.y += t.vy; t.x += t.vx;
        if (t.life <= 0) { trail.splice(i, 1); continue; }
        star(t.x, t.y, t.r * t.life, t.life * .9, t.c);
      }
      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(frame);
    }
    addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden; if (running) requestAnimationFrame(frame);
    });
    if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
      let last = 0;
      addEventListener("pointermove", (e) => {
        const now = performance.now(); if (now - last < 28) return; last = now;
        trail.push({ x: e.clientX + rand(-4, 4), y: e.clientY + rand(-4, 4), vx: rand(-.3, .3), vy: rand(.2, .7), r: rand(.8, 1.8), life: 1, c: pick(["232,207,149", "245,239,227"]) });
        if (trail.length > 70) trail.shift();
      }, { passive: true });
    }
    resize();
    if (!reduceMotion) requestAnimationFrame(frame); else frame();
    return { burst(x, y, n = 18) { for (let i = 0; i < n; i++) trail.push({ x, y, vx: rand(-2.4, 2.4), vy: rand(-2.6, 1), r: rand(1.2, 2.6), life: 1, c: pick(["232,207,149", "245,239,227", "199,109,130"]) }); } };
  })();

  /* =========================================================
     Confeti
     ========================================================= */
  const Confetti = (() => {
    const cv = $("#confetti"), ctx = cv.getContext("2d");
    const COLS = ["#8a2338", "#b13a55", "#5a1424", "#2f5a45", "#86b096", "#f5efe3", "#c9a35c", "#e8cf95", "#b4b8bd"];
    let W, H, dpr, ps = [], raf = null;
    function resize() { dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    addEventListener("resize", resize); resize();
    function add(x, y, ang, spd) {
      const shape = Math.random() < .5 ? "rect" : Math.random() < .5 ? "circle" : Math.random() < .6 ? "ribbon" : "glitter";
      ps.push({
        x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, rot: rand(0, 6.28), vr: rand(-.25, .25),
        flip: rand(0, 6.28), vf: rand(.08, .22), w: shape === "glitter" ? rand(2, 3.5) : rand(6, 11), h: rand(4, 8),
        c: shape === "glitter" ? pick(["#e8cf95", "#f3dfac", "#c9a35c"]) : pick(COLS), shape, life: 0, ttl: rand(200, 340),
        drag: shape === "ribbon" ? .965 : .982, g: shape === "glitter" ? .05 : .13, sway: rand(.6, 1.6)
      });
    }
    function burst({ x = W / 2, y = H / 2, count = 120, angle = -Math.PI / 2, spread = Math.PI * 2, speed = [5, 13] } = {}) {
      if (reduceMotion) count = Math.round(count * .3);
      for (let i = 0; i < count; i++) add(x, y, angle + rand(-spread / 2, spread / 2), rand(speed[0], speed[1]));
      loop();
    }
    function cannons() {
      burst({ x: -10, y: H * .75, count: 90, angle: -Math.PI / 3.2, spread: .7, speed: [11, 20] });
      burst({ x: W + 10, y: H * .75, count: 90, angle: -Math.PI + Math.PI / 3.2, spread: .7, speed: [11, 20] });
    }
    function rain(ms = 2600) {
      const end = performance.now() + ms;
      (function spawn() {
        for (let i = 0; i < 4; i++) add(rand(0, W), -20, Math.PI / 2 + rand(-.3, .3), rand(1, 3));
        loop(); if (performance.now() < end) setTimeout(spawn, 50);
      })();
    }
    function loop() { if (!raf) raf = requestAnimationFrame(step); }
    function step() {
      ctx.clearRect(0, 0, W, H);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life++; p.vx *= p.drag; p.vy = p.vy * p.drag + p.g; p.x += p.vx + Math.sin(p.life * .05) * p.sway * .3; p.y += p.vy;
        p.rot += p.vr; p.flip += p.vf;
        if (p.y > H + 40 || p.life > p.ttl) { ps.splice(i, 1); continue; }
        const fade = p.life > p.ttl - 40 ? (p.ttl - p.life) / 40 : 1;
        ctx.save(); ctx.globalAlpha = fade; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.shape === "rect") { ctx.scale(1, Math.cos(p.flip)); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
        else if (p.shape === "circle") { ctx.scale(Math.cos(p.flip), 1); ctx.beginPath(); ctx.arc(0, 0, p.h / 2, 0, 7); ctx.fill(); }
        else if (p.shape === "ribbon") { ctx.scale(1, Math.cos(p.flip)); ctx.fillRect(-1.5, -p.w, 3, p.w * 2); }
        else { ctx.globalAlpha = fade * (.5 + .5 * Math.sin(p.flip * 2)); ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, 7); ctx.fill(); }
        ctx.restore();
      }
      raf = ps.length ? requestAnimationFrame(step) : null;
      if (!raf) ctx.clearRect(0, 0, W, H);
    }
    return { burst, cannons, rain };
  })();

  const centerOf = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, r }; };

  /* =========================================================
     Reproductor de música
     ========================================================= */
  const Player = (() => {
    const el = $("#player"), btn = $("#playBtn"), title = $("#trackTitle"), status = $("#trackStatus"), tip = $("#playerTip");
    const file = new Audio();
    let fileOk = null, mode = null, playing = false, fadeT = null;
    file.preload = "metadata"; file.loop = true; file.volume = 0;
    file.addEventListener("loadedmetadata", () => (fileOk = true));
    file.addEventListener("error", () => { fileOk = false; if (mode === "file" && playing) useBox(); });
    file.src = C.musica.archivo;
    title.textContent = C.musica.titulo;

    function setUI() {
      el.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-pressed", String(playing));
      btn.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
      status.textContent = playing ? (mode === "box" ? "Caja musical" : "Sonando") : (mode ? "En pausa" : "Toca para escuchar");
      if (mode === "box") title.textContent = "Feliz cumpleaños";
      if (playing) tip.classList.remove("is-on");
    }
    function fadeTo(v, ms = 1400) {
      clearInterval(fadeT); const start = file.volume, t0 = performance.now();
      fadeT = setInterval(() => {
        const k = Math.min(1, (performance.now() - t0) / ms); file.volume = start + (v - start) * k;
        if (k >= 1) { clearInterval(fadeT); if (v === 0) file.pause(); }
      }, 40);
    }
    function useBox() { file.pause(); mode = "box"; playing = MusicBox.play(); setUI(); }
    function play() {
      audio();
      if (mode === "box" || fileOk === false) return useBox();
      file.play().then(() => { mode = "file"; playing = true; fadeTo(.85); setUI(); }).catch(useBox);
    }
    function pause() {
      if (mode === "box") MusicBox.pause(); else fadeTo(0, 500);
      playing = false; setUI();
    }
    btn.addEventListener("click", () => (playing ? pause() : play()));
    return {
      show() { el.classList.add("is-visible"); },
      hint() { if (!playing) tip.classList.add("is-on"); setTimeout(() => tip.classList.remove("is-on"), 9000); },
      play, isPlaying: () => playing
    };
  })();

  /* =========================================================
     1. Abrir el regalo
     ========================================================= */
  const intro = $("#intro"), gift = $("#gift"), exp = $("#experience"), scene = $("#escena"), cake = $("#cake");
  const musicToggle = $("#openWithMusic");
  musicToggle.checked = !!C.musicaAlAbrir;
  let opened = false;

  function openGift() {
    if (opened) return; opened = true;
    audio(); SFX.chime();
    intro.classList.add("is-opening");
    const { x, y } = centerOf(gift);
    setTimeout(() => {
      Confetti.burst({ x, y: y - 20, count: 170, angle: -Math.PI / 2, spread: Math.PI * 1.3, speed: [7, 17] });
      Sky.burst(x, y, 30);
    }, 380);
    setTimeout(() => Confetti.cannons(), 700);
    setTimeout(() => {
      intro.classList.add("is-gone");
      exp.classList.add("is-on"); exp.removeAttribute("aria-hidden");
      document.body.classList.remove("is-locked");
      scene.classList.add("is-in");
      if (musicToggle.checked) Player.play();
    }, 1250);
    setTimeout(() => { cake.classList.add("is-lit"); SFX.sparkle(); }, 3200);
    setTimeout(() => { Player.show(); if (!Player.isPlaying()) Player.hint(); }, 3600);
    setTimeout(() => intro.remove(), 3000);
  }
  gift.addEventListener("click", openGift);

  /* =========================================================
     2. La vela y el vino
     ========================================================= */
  const wish = $("#wish"), hintCandle = $("#hintCandle"), hintWine = $("#hintWine");
  function say(text) {
    wish.classList.remove("is-on");
    setTimeout(() => { wish.textContent = text; wish.classList.add("is-on"); }, 250);
  }
  function blowCandle() {
    if (!cake.classList.contains("is-lit")) return;
    const flame = $("#flame").getBoundingClientRect();
    if (cake.classList.contains("is-blown")) {
      cake.classList.remove("is-blown"); SFX.sparkle(); Sky.burst(flame.left + flame.width / 2, flame.top + flame.height / 2, 14);
      say("Otra vez… ¡pide otro deseo!");
      return;
    }
    SFX.blow();
    cake.classList.add("is-blown");
    hintCandle.classList.add("is-done");
    cake.setAttribute("aria-label", "Volver a encender la vela");
    const fx = flame.left + flame.width / 2, fy = flame.top + flame.height / 2;
    setTimeout(() => {
      Confetti.burst({ x: fx, y: fy, count: 140, spread: Math.PI * 1.6, speed: [6, 15] });
      Sky.burst(fx, fy, 26); SFX.chime();
      say(C.mensajes.deseo);
    }, 350);
  }
  cake.addEventListener("click", blowCandle);
  hintCandle.addEventListener("click", blowCandle);

  const bottle = $("#bottle"), glass = $("#wineglass"), stream = $("#stream");
  let pouring = false;
  function pour() {
    if (pouring) return;
    if (glass.classList.contains("is-filled")) {
      const c = centerOf(glass); Sky.burst(c.x, c.r.top + c.r.height * .25, 18); SFX.clink(); say(C.mensajes.vino); return;
    }
    pouring = true;
    bottle.classList.add("is-open"); SFX.pop();
    const cork = $(".bottle__cork").getBoundingClientRect();
    Sky.burst(cork.left + cork.width / 2, cork.top, 20);
    setTimeout(() => {
      const b = bottle.getBoundingClientRect(), g = glass.getBoundingClientRect();
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      const m = b.height / 2 - b.height * (16 / 340); // centro → boca
      const deg = 108, th = (deg * Math.PI) / 180;
      const tipX = m * Math.sin(th), tipY = -m * Math.cos(th);           // rotación de (0,-m)
      const tx = g.left + g.width * .5, ty = g.top - g.height * .06;     // objetivo: sobre el borde de la copa
      const dx = tx - tipX - cx, dy = ty - tipY - cy;
      bottle.classList.add("is-pouring"); bottle.parentElement.style.zIndex = "10";
      bottle.style.transform = `translate(${dx}px, ${dy}px) rotate(${deg}deg)`;
      setTimeout(() => {
        const sx = tx + scrollX, sy = ty + scrollY;
        const surface = g.top + g.height * (64 / 232) + scrollY;
        stream.style.left = `${sx - 2.5}px`; stream.style.top = `${sy}px`;
        stream.style.height = `${Math.max(20, surface - sy + 20)}px`;
        stream.classList.remove("is-off"); stream.classList.add("is-on");
        glass.classList.add("is-filled"); SFX.pour(2.5);
      }, 1050);
      setTimeout(() => {
        stream.classList.add("is-off");
        bottle.style.transform = "";
        setTimeout(() => { bottle.classList.remove("is-pouring"); bottle.parentElement.style.zIndex = ""; stream.classList.remove("is-on", "is-off"); pouring = false; }, 1100);
        hintWine.classList.add("is-done");
        const c = centerOf(glass); Sky.burst(c.x, c.r.top + c.r.height * .25, 22); SFX.sparkle();
        say(C.mensajes.vino);
      }, 3700);
    }, 450);
  }
  bottle.addEventListener("click", pour);
  hintWine.addEventListener("click", pour);

  /* =========================================================
     3. Fecha editable
     ========================================================= */
  const dateText = $("#dateText"), dateInput = $("#dateInput"), dateBadge = $("#dateBadge"), dateBtn = $("#dateBtn");
  const KEY = `regalo-${C.nombre.toLowerCase()}-fecha`;
  const fmt = new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" });
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  function parse(iso) { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ""); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function iso(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
  function renderDate(v) {
    const d = parse(v) || new Date();
    dateInput.value = iso(d);
    dateText.textContent = fmt.format(d);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.round((d - today) / 86400000);
    dateBadge.textContent = diff === 0 ? "✦ Es hoy ✦" : diff === 1 ? "Mañana es el gran día" : diff > 1 && diff < 60 ? `Faltan ${diff} días` : "";
  }
  const urlDate = new URLSearchParams(location.search).get("fecha");
  renderDate(urlDate || store.get(KEY) || C.fecha);
  dateBtn.addEventListener("click", () => {
    try { if (dateInput.showPicker) { dateInput.showPicker(); return; } } catch (e) {}
    dateInput.style.pointerEvents = "auto"; dateInput.focus(); dateInput.click();
  });
  dateInput.addEventListener("change", () => {
    if (!dateInput.value) return;
    store.set(KEY, dateInput.value); renderDate(dateInput.value);
    const c = centerOf(dateBtn); Sky.burst(c.x, c.y, 16); SFX.sparkle();
  });

  $("#nameBtn").addEventListener("click", (e) => {
    const c = centerOf(e.currentTarget);
    Confetti.burst({ x: c.x, y: c.y, count: 60, speed: [4, 10] }); Sky.burst(c.x, c.y, 24); SFX.sparkle();
  });

  /* =========================================================
     4. La carta
     ========================================================= */
  const letter = $("#letter"), seal = $("#seal");
  $("#letterGreet").textContent = C.carta.saludo || `Querido ${C.tratamiento.toLowerCase()} ${C.nombre}:`;
  const paras = $("#letterParas");
  (C.carta.parrafos || []).forEach((t, i) => {
    const p = document.createElement("p"); p.textContent = t; p.style.transitionDelay = `${0.5 + i * 0.35}s`; paras.appendChild(p);
  });
  const closeEl = $("#letterClose"), signEl = $("#letterSign");
  closeEl.textContent = C.carta.despedida; signEl.textContent = C.carta.firma || C.deParte;
  const n = (C.carta.parrafos || []).length;
  $("#letterGreet").style.transitionDelay = ".3s";
  closeEl.style.transitionDelay = `${0.6 + n * 0.35}s`; signEl.style.transitionDelay = `${0.9 + n * 0.35}s`;
  seal.addEventListener("click", () => {
    letter.classList.add("is-open"); seal.setAttribute("aria-expanded", "true");
    const c = centerOf(seal); Sky.burst(c.x, c.y, 26); SFX.pop(); setTimeout(SFX.sparkle, 200);
    $("#letterBody").setAttribute("tabindex", "-1");
  });

  /* =========================================================
     5. Carrusel de fotos
     ========================================================= */
  const track = $("#track"), dots = $("#dots"), caption = $("#caption"), carousel = $("#carousel");
  const fotos = (C.fotos || []).slice(0, 3);
  let cur = 0, auto = null, inView = false;
  const slides = fotos.map((f, i) => {
    const s = document.createElement("figure");
    s.className = "slide"; s.setAttribute("role", "group"); s.setAttribute("aria-label", `Foto ${i + 1} de ${fotos.length}`);
    s.innerHTML = `<div class="slide__frame"><img alt="" loading="lazy" decoding="async"><div class="slide__ph"><div><span class="slide__ph-mono">${C.nombre.charAt(0)}</span><span class="slide__ph-text">Aquí irá un recuerdo</span><span class="slide__ph-file"></span></div></div></div>`;
    const img = $("img", s);
    img.alt = f.pie || `Recuerdo ${i + 1}`;
    $(".slide__ph-file", s).textContent = (f.src || "").split("/").pop();
    img.addEventListener("error", () => s.classList.add("is-empty"));
    if (f.src) img.src = f.src; else s.classList.add("is-empty");
    s.addEventListener("click", () => { const p = +s.dataset.pos; if (p) go(cur + p); });
    track.appendChild(s);
    const d = document.createElement("button");
    d.className = "carousel__dot"; d.type = "button"; d.setAttribute("role", "tab"); d.setAttribute("aria-label", `Ver foto ${i + 1}`);
    d.addEventListener("click", () => go(i)); dots.appendChild(d);
    return s;
  });
  function go(i) {
    const N = slides.length; if (!N) return;
    cur = (i + N) % N;
    slides.forEach((s, k) => {
      let p = k - cur; if (p > N / 2) p -= N; if (p < -N / 2) p += N;
      s.dataset.pos = String(p); s.setAttribute("aria-hidden", p !== 0 ? "true" : "false");
    });
    $$(".carousel__dot", dots).forEach((d, k) => d.setAttribute("aria-selected", String(k === cur)));
    caption.classList.add("is-fading");
    setTimeout(() => { caption.textContent = fotos[cur].pie || ""; caption.classList.remove("is-fading"); }, 300);
    restart();
  }
  function restart() { clearInterval(auto); if (inView && !reduceMotion) auto = setInterval(() => go(cur + 1), 5500); }
  $("#prev").addEventListener("click", () => go(cur - 1));
  $("#next").addEventListener("click", () => go(cur + 1));
  carousel.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") go(cur - 1); if (e.key === "ArrowRight") go(cur + 1); });
  carousel.addEventListener("mouseenter", () => clearInterval(auto));
  carousel.addEventListener("mouseleave", restart);
  let sx = null;
  carousel.addEventListener("pointerdown", (e) => (sx = e.clientX));
  carousel.addEventListener("pointerup", (e) => { if (sx === null) return; const dx = e.clientX - sx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; restart(); }, { threshold: .4 }).observe(carousel);
  go(0);

  /* =========================================================
     6. Deseos
     ========================================================= */
  const ICONS = {
    sol: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="16" cy="16" r="5.5"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M6.8 25.2l2.8-2.8M22.4 9.6l2.8-2.8"/></svg>',
    hoja: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 25C5 14 12 6 26 6c0 14-8 21-19 19z"/><path d="M7 25C11 19 15 15 21 11"/></svg>',
    brillo: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M14 4l2.2 7.8L24 14l-7.8 2.2L14 24l-2.2-7.8L4 14l7.8-2.2z"/><path d="M24.5 20l1 3.5 3.5 1-3.5 1-1 3.5-1-3.5-3.5-1 3.5-1z"/></svg>',
    corazon: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M16 27S4 19.5 4 11.5A6 6 0 0 1 16 9a6 6 0 0 1 12 2.5C28 19.5 16 27 16 27z"/></svg>'
  };
  const grid = $("#wishGrid");
  (C.deseos || []).forEach((w, i) => {
    const a = document.createElement("article");
    a.className = "wcard glass reveal"; a.style.setProperty("--i", i);
    a.innerHTML = `<div class="wcard__icon">${ICONS[w.icono] || ICONS.brillo}</div><h3></h3><p></p>`;
    $("h3", a).textContent = w.titulo; $("p", a).textContent = w.texto;
    a.addEventListener("pointermove", (e) => {
      const r = a.getBoundingClientRect();
      a.style.setProperty("--mx", `${e.clientX - r.left}px`); a.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
    grid.appendChild(a);
  });

  /* =========================================================
     7. Brindis
     ========================================================= */
  const glasses = $("#glasses"), cheersMsg = $("#cheersMsg");
  $("#cheersBtn").addEventListener("click", () => {
    glasses.classList.remove("is-cheers"); void glasses.offsetWidth; glasses.classList.add("is-cheers");
    setTimeout(() => {
      SFX.clink();
      const r = glasses.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height * .2;
      Sky.burst(x, y, 34);
      Confetti.burst({ x, y, count: 120, spread: Math.PI * 1.5, speed: [6, 14] });
      Confetti.rain(2400);
      cheersMsg.textContent = C.mensajes.brindis; cheersMsg.classList.add("is-on");
    }, 420);
    setTimeout(() => glasses.classList.remove("is-cheers"), 1800);
  });

  /* ---------- Revelado al hacer scroll ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }), { threshold: .18, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  $$("[data-year]").forEach((el) => (el.textContent = (parse(dateInput.value) || new Date()).getFullYear() || year));
})();
