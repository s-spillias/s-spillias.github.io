/* Homepage hero: a seascape drawn as mosaic tesserae.
   Each tile takes its colour from an animated scene underneath it: sky,
   sun (light theme) or moon and stars (dark theme), the sea surface, kelp,
   the seafloor, and a small food web of animals. Large animals are drawn
   as shapes; fish and jellyfish are single tiles. The animals swim towards
   the pointer; hungry predators chase nearby prey and prey flee. Who eats
   whom: dolphins, the humpback whale and the white shark eat fish; the
   green turtle eats jellyfish; the shark also takes the turtle; the orca
   takes dolphins and the shark. Eaten animals swim back in from the edge
   after a while. Tiles flip into place on load, catch the light under
   the pointer, and a click or tap sends a ripple through them.
   With prefers-reduced-motion the mosaic is drawn once and stays still. */
(() => {
  const canvas = document.getElementById('seascape');
  if (!canvas || !canvas.getContext) return;
  const hero = canvas.closest('[data-hero]') || canvas.parentElement;
  const ctx = canvas.getContext('2d', { alpha: false });
  const reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const touchOnly = !!(window.matchMedia && matchMedia('(hover: none)').matches);

  const PALETTES = {
    light: {
      grout: [234, 228, 216],
      skyTop: [242, 196, 160], skyLow: [251, 229, 202],
      sun: [255, 247, 218], glow: [255, 208, 138],
      surface: [120, 192, 188], mid: [40, 130, 140], deep: [14, 68, 86],
      kelp: [206, 162, 56], kelpDark: [148, 108, 34],
      glint: [255, 251, 238],
      floor: [205, 186, 146], rock: [136, 118, 88],
      stars: null, shimmer: 0.35, shaft: 0.14,
      fish: [16, 54, 66], fishGlint: 0.18,
      jelly: [236, 150, 196],
      turtleShell: [124, 112, 58], turtleScute: [90, 82, 40], turtleSkin: [156, 146, 96],
      dolphin: [104, 124, 138], dolphinBelly: [204, 212, 216],
      shark: [80, 94, 106], sharkBelly: [228, 232, 234],
      orca: [16, 20, 26], orcaWhite: [242, 244, 246],
      whale: [48, 60, 76], whaleBelly: [146, 156, 168], whaleFin: [206, 214, 220],
    },
    dark: {
      grout: [3, 10, 16],
      skyTop: [6, 16, 32], skyLow: [22, 44, 70],
      sun: [226, 234, 240], glow: [112, 152, 196],
      surface: [28, 80, 98], mid: [12, 48, 66], deep: [5, 20, 32],
      kelp: [104, 112, 44], kelpDark: [54, 62, 26],
      glint: [190, 225, 240],
      floor: [16, 34, 40], rock: [9, 22, 28],
      stars: [225, 236, 255], shimmer: 0.22, shaft: 0.07,
      fish: [128, 156, 170], fishGlint: 0.45,
      jelly: [226, 132, 206],
      turtleShell: [118, 120, 64], turtleScute: [86, 90, 46], turtleSkin: [150, 150, 98],
      dolphin: [104, 132, 150], dolphinBelly: [182, 198, 208],
      shark: [98, 116, 130], sharkBelly: [184, 196, 204],
      orca: [0, 0, 0], orcaWhite: [214, 226, 234],
      whale: [72, 96, 120], whaleBelly: [134, 156, 176], whaleFin: [180, 198, 212],
    },
  };
  const isLight = () => {
    const a = document.documentElement.getAttribute('data-theme');
    return a ? a === 'light' : !!(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
  };
  let pal = isLight() ? PALETTES.light : PALETTES.dark;

  /* Species. Sizes are in tiles; speeds in pixels per millisecond at 20 px tiles.
     tail/fluke: length and spread of the tail; dorsal: base, height and position of the dorsal fin. */
  const SPECIES = {
    whale:   { n: 1, L: 12, Wd: 3.0, sp: 0.034, k: 0.0007, depth: [0.2, 0.5], eats: ['fish'], hungerMs: 9000, follow: 0.5, cetacean: true, tail: 2.2, fluke: 0.6, dorsal: [0.8, 0.5, -0.4], pec: true, respawn: [9000, 14000] },
    orca:    { n: 1, L: 6.6, Wd: 2.1, sp: 0.1, k: 0.0016, depth: [0.12, 0.6], eats: ['dolphin', 'shark'], hungerMs: 16000, follow: 0.8, cetacean: true, tail: 1.3, fluke: 0.5, dorsal: [1.2, 2.0, 0.0], respawn: [9000, 14000] },
    shark:   { n: 1, L: 5.6, Wd: 1.7, sp: 0.085, k: 0.0016, depth: [0.25, 0.8], eats: ['turtle', 'fish'], hungerMs: 12000, follow: 0.8, tail: 1.5, fluke: 0.55, dorsal: [1.5, 1.4, 0.05], respawn: [8000, 13000] },
    turtle:  { n: 1, L: 3.4, Wd: 2.0, sp: 0.03, k: 0.0012, depth: [0.12, 0.6], eats: ['jelly'], hungerMs: 7000, follow: 0.6, respawn: [8000, 12000] },
    dolphin: { n: 2, L: 4.2, Wd: 1.25, sp: 0.12, k: 0.0022, depth: [0.05, 0.5], eats: ['fish'], hungerMs: 6000, follow: 1, cetacean: true, tail: 1.0, fluke: 0.5, dorsal: [1.0, 1.0, 0.0], respawn: [7000, 11000] },
    // Small animals are single tiles
    jelly:   { n: 8, L: 1, Wd: 1, sp: 0.01, k: 0.0008, depth: [0.08, 0.55], eats: [], follow: 0.1, speck: true, respawn: [5000, 9000] },
    fish:    { n: 36, L: 1, Wd: 1, sp: 0.1, k: 0.003, depth: [0.2, 0.7], eats: [], follow: 1.2, school: true, speck: true, respawn: [3000, 6000] },
  };
  const ORDER = ['whale', 'orca', 'shark', 'turtle', 'dolphin', 'jelly', 'fish'];

  // Seeded random numbers so the mosaic is laid the same way each visit
  let seed = 72026;
  const rand = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const between = (a, b) => a + Math.random() * (b - a);

  let W = 1, H = 1, dpr = 1, s = 20, mobile = false, hy = 0, rows = 0, rowLen = 0, sizeK = 1;
  let tiles = [], kelps = [], floor = [], owner = new Int16Array(0), part = new Uint8Array(0);
  let creatures = [];
  const bubbles = [];
  const sun = { x: 0, y: 0, r: 0 };
  const ripples = [];
  const pointer = { x: 0, y: 0, active: false, until: 0 };
  let assembled = false;

  function makeCreatures() {
    creatures = [];
    ORDER.forEach((key) => {
      const S = SPECIES[key];
      let n = S.n;
      if (mobile && key === 'fish') n = 22;
      if (mobile && key === 'jelly') n = 5;
      if (mobile && key === 'dolphin') n = 1;
      for (let i = 0; i < n; i++) {
        const c = { key, S, alive: true, respawnAt: 0, hunger: rand() * 0.6, cooldown: 0, ph: rand() * Math.PI * 2, f: 0.8 + rand() * 0.4, wa: rand() * Math.PI * 2, facing: rand() < 0.5 ? 1 : -1, pitch: 0, ang: 0, vx: 0, vy: 0, x: 0, y: 0 };
        place(c, true);
        creatures.push(c);
      }
    });
  }

  function place(c, initial) {
    const S = c.S, scale = s / 20;
    const d = S.depth[0] + rand() * (S.depth[1] - S.depth[0]);
    c.y = hy + (H - hy) * d;
    if (initial) {
      c.x = c.key === 'fish' ? W * 0.72 + (rand() - 0.5) * s * 8 : W * (mobile ? 0.1 + rand() * 0.8 : 0.5 + rand() * 0.45);
      if (c.key === 'fish') c.y = hy + (H - hy) * 0.45 + (rand() - 0.5) * s * 5;
      if (mobile) c.y = Math.max(c.y, H * (0.6 + rand() * 0.25));
    } else {
      c.facing = Math.random() < 0.5 ? 1 : -1;
      c.x = c.facing > 0 ? -S.L * s * sizeK : W + S.L * s * sizeK;
    }
    c.vx = c.facing * S.sp * scale * 0.8; c.vy = 0;
    c.ang = c.facing > 0 ? 0 : Math.PI;
  }

  function build() {
    const rect = hero.getBoundingClientRect();
    const wasW = W;
    W = Math.max(1, rect.width); H = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mobile = W < 760;
    sizeK = mobile ? 0.95 : 1.35;
    s = mobile ? 12 : Math.round(Math.max(14, Math.min(18, W / 80)));
    hy = H * (mobile ? 0.2 : 0.3);
    sun.x = W * (mobile ? 0.8 : 0.79); sun.y = hy * 0.5; sun.r = Math.max(s * 1.4, Math.min(W, H) * 0.05);

    seed = 72026;
    const gap = s * 0.1, h = s / 2 - gap / 2;
    const cols = Math.ceil(W / s) + 2;
    rows = Math.ceil(H / s) + 1; rowLen = cols + 1;
    tiles = [];
    for (let r = 0; r < rows; r++) {
      const shift = (rand() - 0.5) * s * 0.5;
      for (let c = -1; c < cols; c++) {
        const cx = c * s + s / 2 + shift + (rand() - 0.5) * s * 0.1;
        const cy = r * s + s / 2 + (rand() - 0.5) * s * 0.1;
        const ang = (rand() - 0.5) * 0.16, ca = Math.cos(ang), sa = Math.sin(ang);
        const pts = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([px, py]) => {
          px += (rand() - 0.5) * s * 0.12; py += (rand() - 0.5) * s * 0.12;
          return [px * ca - py * sa, px * sa + py * ca];
        });
        const sweep = (cx / W + (1 - cy / H)) / 2;
        tiles.push({ cx, cy, pts, j: rand() * 2 - 1, k: rand(), born: assembled || reduce ? 0 : 150 + sweep * 1500 + rand() * 260 });
      }
    }
    owner = new Int16Array(tiles.length);
    part = new Uint8Array(tiles.length);

    const kx = mobile ? [0.12, 0.62, 0.88] : [0.06, 0.2, 0.6, 0.9];
    kelps = kx.map((x) => ({
      x: x * W + (rand() - 0.5) * s * 2,
      top: hy + (H - hy) * (0.12 + rand() * 0.3),
      amp: s * (1.8 + rand() * 1.6),
      f: 0.7 + rand() * 0.6, ph: rand() * Math.PI * 2,
    }));
    const n = Math.ceil(W / s) + 3;
    floor = Array.from({ length: n }, (_, i) => H - s * (1.5 + 1.4 * (0.5 + 0.5 * Math.sin(i * 0.33 + rand() * 0.8)) + rand() * 0.7));

    if (!creatures.length || Math.abs(W - wasW) > 80) makeCreatures();
  }

  /* ---------- Behaviour ---------- */

  function eat(pred, prey, t) {
    prey.alive = false;
    const [a, b] = prey.S.respawn;
    prey.respawnAt = t + between(a, b);
    pred.cooldown = 2600; pred.hunger = 0;
    ripples.push({ x: prey.x, y: prey.y, t0: t, life: 1400, amp: 0.8 });
    for (let i = 0; i < 6; i++) bubbles.push({ x: prey.x + (Math.random() - 0.5) * s * 1.5, y: prey.y + (Math.random() - 0.5) * s, vy: -(0.02 + Math.random() * 0.03) * (s / 20), t0: t, life: 1400 + Math.random() * 900 });
  }

  function update(t, dt) {
    const scale = s / 20;
    const target = pointer.active && (t < pointer.until || !touchOnly) ? { x: pointer.x, y: Math.max(pointer.y, hy + s * 2) } : null;
    for (const c of creatures) {
      const S = c.S;
      if (!c.alive) { if (t > c.respawnAt) { c.alive = true; place(c, false); c.hunger = Math.random() * 0.4; } continue; }
      const maxV = S.sp * scale;
      let ax = 0, ay = 0, chasing = false, fleeing = false;

      // Wander, mostly horizontal
      c.wa += (Math.random() - 0.5) * dt * 0.0016;
      const ww = S.school ? 0.35 : 1;
      ax += Math.cos(c.wa) * ww; ay += Math.sin(c.wa) * 0.35 * ww;

      // Curious about the pointer
      if (target) {
        const dx = target.x - c.x, dy = target.y - c.y, d = Math.hypot(dx, dy) || 1;
        if (d > (S.L * 0.6 * sizeK + 3) * s) { ax += (dx / d) * 1.6 * S.follow; ay += (dy / d) * 1.6 * S.follow; }
      }

      // Flee nearby predators
      for (const p of creatures) {
        if (!p.alive || !p.S.eats.includes(c.key)) continue;
        const dx = c.x - p.x, dy = c.y - p.y, d = Math.hypot(dx, dy) || 1;
        const R = (p.S.L * 0.5 * sizeK + 5) * s;
        if (d < R) { const w = (1 - d / R) * 3.2; ax += (dx / d) * w; ay += (dy / d) * w * 0.7; fleeing = true; }
      }

      // Hunt
      c.hunger = Math.min(1, c.hunger + dt / (S.hungerMs || 1e12));
      c.cooldown = Math.max(0, c.cooldown - dt);
      if (S.eats.length && c.cooldown === 0) {
        const R = (c.hunger > 0.65 || target ? 14 : 6) * s;
        let best = null, bd = R;
        for (const q of creatures) {
          if (!q.alive || !S.eats.includes(q.key) || q.x < 0 || q.x > W) continue;
          const d = Math.hypot(q.x - c.x, q.y - c.y);
          if (d < bd) { bd = d; best = q; }
        }
        if (best) {
          chasing = true;
          const dx = best.x - c.x, dy = best.y - c.y;
          ax += (dx / bd) * 2.6; ay += (dy / bd) * 2.6;
          const reach = (S.L * 0.45 + best.S.L * 0.25) * s * sizeK;
          const facing = (dx * Math.cos(c.ang) + dy * Math.sin(c.ang)) / (bd || 1);
          if (bd < reach && facing > 0.2) eat(c, best, t);
        }
      }

      // Schooling fish stay together; everyone keeps a little space from their own kind
      let cx = 0, cy = 0, avx = 0, avy = 0, n = 0;
      for (const o of creatures) {
        if (o === c || !o.alive) continue;
        if (o.key !== c.key) {
          // Animals that don't eat each other keep their distance, so a crowd at the pointer stays readable
          if (S.eats.includes(o.key) || o.S.eats.includes(c.key)) continue;
          const dx = o.x - c.x, dy = o.y - c.y, d = Math.hypot(dx, dy) || 1;
          const sep = (S.L + o.S.L) * 0.42 * s * sizeK;
          if (d < sep) { const w = ((sep - d) / s) * 0.6; ax -= (dx / d) * w; ay -= (dy / d) * w; }
          continue;
        }
        const dx = o.x - c.x, dy = o.y - c.y, d = Math.hypot(dx, dy) || 1;
        const sep = (S.school ? 1.3 : S.L * 1.1) * s * sizeK;
        if (d < sep) { ax -= (dx / d) * (sep - d) / s * 1.5; ay -= (dy / d) * (sep - d) / s * 1.5; }
        if (S.school && d < 7 * s) { cx += o.x; cy += o.y; avx += o.vx; avy += o.vy; n++; }
      }
      if (S.school && n) {
        ax += ((cx / n - c.x) / s) * 0.12; ay += ((cy / n - c.y) / s) * 0.12;
        const am = Math.hypot(avx, avy) || 1; ax += (avx / am) * 0.8; ay += (avy / am) * 0.8;
      }

      // Without the pointer, keep to the open water beside (desktop) or below (phone) the text
      if (!target) {
        if (!mobile && c.x < W * 0.5) ax += ((W * 0.5 - c.x) / s) * 0.06;
        if (mobile && c.y < H * 0.6) ay += ((H * 0.6 - c.y) / s) * 0.06;
      }

      // Stay in the water and near the screen
      const top = hy + (S.Wd * 0.6 + 0.6) * s * sizeK, bottom = H - (S.Wd * 0.6 + 3) * s * sizeK;
      if (c.y < top) ay += (top - c.y) / s * 0.8;
      if (c.y > bottom) ay -= (c.y - bottom) / s * 0.8;
      const xm = S.L * s * sizeK * 0.3;
      if (c.x < -xm) ax += (-xm - c.x) / s * 0.3;
      if (c.x > W + xm) ax -= (c.x - W - xm) / s * 0.3;

      const boost = chasing ? 1.45 : fleeing ? 1.35 : 1;
      const m = Math.hypot(ax, ay) || 1;
      const kk = Math.min(1, S.k * dt * (chasing || fleeing ? 1.6 : 1));
      c.vx += ((ax / m) * maxV * boost - c.vx) * kk;
      c.vy += ((ay / m) * maxV * boost * 0.6 - c.vy) * kk;
      c.x += c.vx * dt; c.y += c.vy * dt;

      // Turn to face the direction of travel, with limited pitch
      if (c.vx * c.facing < -0.015 * scale) c.facing = -c.facing;
      const pitch = Math.max(-0.45, Math.min(0.45, Math.atan2(c.vy, Math.abs(c.vx) + 1e-6)));
      c.pitch += (pitch - c.pitch) * Math.min(1, dt * 0.004);
      c.ang = c.facing > 0 ? c.pitch : Math.PI - c.pitch;
    }
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.y += b.vy * dt; b.x += Math.sin(t * 0.006 + i) * 0.15;
      if (t - b.t0 > b.life || b.y < hy) bubbles.splice(i, 1);
    }
  }

  /* ---------- Shapes: which part of an animal covers a point ---------- */
  // Part codes: 1 body, 2 belly, 3 fin or tail, 4 pale patch, 5 shell, 6 turtle skin
  function segDist(px, py, ax, ay, bx, by) {
    const vx = bx - ax, vy = by - ay;
    const u = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy)));
    return [Math.hypot(px - ax - vx * u, py - ay - vy * u), u];
  }

  function shape(c, x, y, t) {
    const S = c.S, L = S.L * s * sizeK, Wd = S.Wd * s * sizeK;
    const dx = x - c.x, dy = y - c.y;
    const ca = Math.cos(c.ang), sa = Math.sin(c.ang);
    const u = dx * ca + dy * sa, v = -dx * sa + dy * ca;
    let up = c.facing > 0 ? -v : v;            // positive towards the animal's back
    const hl = L / 2;

    if (c.key === 'turtle') {
      const sl = L * 0.36, sw = Wd * 0.32, su = u + L * 0.04;
      if ((su / sl) ** 2 + (up / sw) ** 2 < 1) return 5;
      const hu = u - sl - s * 0.35 * sizeK;
      if (hu * hu + (up - s * 0.1) ** 2 < (s * 0.72 * sizeK) ** 2) return 6;
      const flap = Math.sin(t * 0.0035 + c.ph);
      const fa = -2.3 + flap * 0.55, bu = L * 0.14, bv = -sw * 0.3, fl = L * 0.55;
      if (segDist(u, up, bu, bv, bu + Math.cos(fa) * fl, bv + Math.sin(fa) * fl)[0] < s * 0.5 * sizeK) return 6;
      const ra = -2.7 + flap * 0.3, ru = -L * 0.28, rl = L * 0.22;
      if (segDist(u, up, ru, bv, ru + Math.cos(ra) * rl, bv + Math.sin(ra) * rl)[0] < s * 0.42 * sizeK) return 6;
      return 0;
    }

    // Whales and dolphins beat their tails up and down, which shows in side view
    if (S.cetacean && u < -hl * 0.4) up -= Math.sin(t * 0.005 * c.f + c.ph) * s * 0.45 * sizeK * ((-hl * 0.4 - u) / (hl * 0.6 + s));

    if (u > -hl && u < hl) {
      const xn = u / hl;
      const hw = (Wd / 2) * Math.sqrt(1 - xn * xn) * (xn < 0 ? 1 + 0.45 * xn : 1);
      if (Math.abs(up) < hw) {
        if (c.key === 'orca') {
          if (xn > 0.28 && xn < 0.62 && up > hw * 0.05 && up < hw * 0.55) return 4;   // eye patch
          if (up < -hw * 0.3 && xn > -0.35) return 2;                                 // white belly
          return 1;
        }
        if (c.key === 'whale' && up < -hw * 0.35 && xn > -0.25) return 2;
        if (c.key !== 'fish' && c.key !== 'whale' && up < -hw * 0.25) return 2;
        return 1;
      }
    }
    // Tail
    if (S.tail) {
      const tl = S.tail * s * sizeK, lead = s * 0.5;
      if (u <= -hl + lead && u > -hl - tl) {
        const k = (-hl - u + lead) / (tl + lead);
        if (Math.abs(up) < Wd * S.fluke * Math.max(0.2, k)) return 3;
      }
    }
    // Dorsal fin
    if (S.dorsal) {
      const [base, height, at] = S.dorsal;
      const fb = base * s * sizeK * 0.6, fu = u - at * hl;
      if (up > 0 && Math.abs(fu) < fb) {
        const xn = Math.max(-1, Math.min(1, u / hl));
        const hw = (Wd / 2) * Math.sqrt(1 - xn * xn);
        const hgt = up - hw;
        if (hgt > -s * 0.3 && hgt < height * s * sizeK * (1 - Math.abs(fu) / fb)) return c.key === 'whale' ? 1 : 3;
      }
    }
    // The humpback's long pale pectoral fin
    if (S.pec) {
      const fa = -2.55 + Math.sin(t * 0.0012 + c.ph) * 0.15, bu = hl * 0.3, bv = -Wd * 0.25, fl = L * 0.3;
      const [d, k] = segDist(u, up, bu, bv, bu + Math.cos(fa) * fl, bv + Math.sin(fa) * fl);
      if (d < s * 0.55 * sizeK * (1 - k * 0.5)) return 4;
    }
    return 0;
  }

  // Mark which tiles each animal covers this frame. Later animals in ORDER draw on top.
  function rasterise(t) {
    owner.fill(-1);
    for (let ci = 0; ci < creatures.length; ci++) {
      const c = creatures[ci];
      if (!c.alive) continue;
      const S = c.S;
      if (S.speck) {
        // Single tile: the one whose centre is nearest
        const r = Math.round((c.y - s / 2) / s);
        if (r < 0 || r >= rows) continue;
        const cc = Math.round((c.x - s / 2) / s);
        let best = -1, bd = 1e9;
        for (let k = cc - 1; k <= cc + 1; k++) {
          if (k < -1 || k > rowLen - 2) continue;
          const i = r * rowLen + (k + 1), tl = tiles[i];
          if (!tl || tl.cy < hy) continue;
          const d = Math.abs(tl.cx - c.x);
          if (d < bd) { bd = d; best = i; }
        }
        if (best >= 0) { owner[best] = ci; part[best] = 1; }
        continue;
      }
      const R = (S.L * 0.5 + (S.tail || 0) + 1.5) * s * sizeK;
      const r0 = Math.max(0, Math.floor((c.y - R) / s) - 1), r1 = Math.min(rows - 1, Math.floor((c.y + R) / s) + 1);
      const c0 = Math.max(-1, Math.floor((c.x - R) / s) - 1), c1 = Math.min(rowLen - 2, Math.floor((c.x + R) / s) + 1);
      for (let r = r0; r <= r1; r++) {
        for (let cc = c0; cc <= c1; cc++) {
          const i = r * rowLen + (cc + 1);
          const tl = tiles[i];
          if (!tl || tl.cy < hy) continue;
          const p = shape(c, tl.cx, tl.cy, t);
          if (p) { owner[i] = ci; part[i] = p; }
        }
      }
    }
    for (const b of bubbles) {
      const r = Math.floor(b.y / s), cc = Math.floor(b.x / s);
      if (r < 0 || r >= rows || cc < -1 || cc > rowLen - 2) continue;
      const i = r * rowLen + (cc + 1);
      if (tiles[i] && tiles[i].cy >= hy) { owner[i] = -2; part[i] = 0; }
    }
  }

  /* ---------- Colour ---------- */
  let R = 0, G = 0, B = 0;
  const set = (a, b, u) => { R = a[0] + (b[0] - a[0]) * u; G = a[1] + (b[1] - a[1]) * u; B = a[2] + (b[2] - a[2]) * u; };
  const copy = (a) => { R = a[0]; G = a[1]; B = a[2]; };
  const toward = (c, u) => { R += (c[0] - R) * u; G += (c[1] - G) * u; B += (c[2] - B) * u; };

  function water(x, y, t, tl) {
    const P = pal;
    const depth = (y - hy) / (H - hy);
    if (depth < 0.32) set(P.surface, P.mid, depth / 0.32);
    else set(P.mid, P.deep, Math.min(1, (depth - 0.32) / 0.68));
    const ys = y - hy;
    if (ys < s * 3.2) {
      const sh = 0.5 + 0.5 * Math.sin(x * 0.04 + t * 0.0015 + tl.k * 5);
      toward(P.glint, P.shimmer * sh * (1 - ys / (s * 3.2)));
    }
    const gx = Math.abs(x - sun.x) / (sun.r * 1.8 + ys * 0.25);
    if (gx < 1 && depth < 0.5) {
      const fl = Math.sin(t * 0.0035 + tl.k * 50);
      if (fl > 0.45) toward(P.glint, ((fl - 0.45) / 0.55) * 0.7 * (1 - gx) * (1 - depth / 0.5));
    }
    if (depth < 0.75) {
      const sh = Math.sin((x + y * 0.5) / (W * 0.075) + t * 0.0002);
      if (sh > 0.78) toward(P.glint, ((sh - 0.78) / 0.22) * P.shaft * (1 - depth / 0.75));
    }
  }

  function animal(c, p, tl, x, y, t) {
    const P = pal;
    switch (c.key) {
      case 'fish':
        // A subtle tint of the water; fish catch the light now and then as they turn
        water(x, y, t, tl); toward(P.fish, 0.55);
        if (Math.sin(t * 0.004 + c.ph * 7) > 0.8) toward(P.glint, P.fishGlint);
        break;
      case 'jelly': water(x, y, t, tl); toward(P.jelly, 0.4 + 0.15 * Math.sin(t * 0.002 + c.ph)); break;
      case 'turtle': copy(p === 5 ? (tl.k > 0.55 ? P.turtleScute : P.turtleShell) : P.turtleSkin); break;
      case 'dolphin': copy(p === 2 ? P.dolphinBelly : P.dolphin); break;
      case 'shark': copy(p === 2 ? P.sharkBelly : P.shark); break;
      case 'orca': copy(p === 2 || p === 4 ? P.orcaWhite : P.orca); break;
      case 'whale': copy(p === 4 ? P.whaleFin : p === 2 ? P.whaleBelly : P.whale); break;
      default: copy(P.fish);
    }
  }

  function scene(x, y, t, tl, i) {
    const P = pal;
    if (y < hy) {
      set(P.skyTop, P.skyLow, y / hy);
      const d = Math.hypot(x - sun.x, y - sun.y);
      if (d < sun.r) { copy(P.sun); return; }
      if (d < sun.r * 3.4) { const g = 1 - (d - sun.r) / (sun.r * 2.4); toward(P.glow, g * g * 0.75); }
      if (P.stars && tl.k > 0.986 && d > sun.r * 2.5) {
        const tw = 0.5 + 0.5 * Math.sin(t * 0.0018 + tl.k * 900);
        toward(P.stars, 0.12 + 0.4 * tw);
      }
      return;
    }
    const o = owner[i];
    if (o >= 0) { animal(creatures[o], part[i], tl, x, y, t); return; }
    if (o === -2) { water(x, y, t, tl); toward(P.glint, 0.6); return; }
    const col = Math.min(floor.length - 1, Math.max(0, Math.floor(x / s) + 1));
    if (y > floor[col]) { copy(tl.k > 0.55 ? P.rock : P.floor); return; }
    for (const k of kelps) {
      if (y < k.top) continue;
      const h = (H - y) / (H - k.top);
      const sx = k.x + Math.sin(t * 0.0006 * k.f + y * 0.006 + k.ph) * k.amp * Math.pow(h, 1.5)
                     + Math.sin(t * 0.00022 + k.ph) * k.amp * 0.6 * h;
      const dx = x - sx;
      if (Math.abs(dx) < s * 0.55) { set(P.kelpDark, P.kelp, 0.3 + 0.3 * h); return; }
      const lobe = Math.sin((y + Math.abs(dx) * 0.7) * 0.05 + k.ph);
      const reach = s * (0.5 + 1.4 * Math.abs(lobe)) * (0.55 + 0.45 * h);
      if (dx * lobe > 0 && Math.abs(dx) < reach + s * 0.3) { set(P.kelpDark, P.kelp, 0.55 + 0.45 * Math.abs(lobe)); return; }
    }
    water(x, y, t, tl);
  }


  /* ---------- Drawing ---------- */
  const easeOutBack = (u) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };

  function draw(t) {
    const P = pal;
    ctx.fillStyle = `rgb(${P.grout[0]},${P.grout[1]},${P.grout[2]})`;
    ctx.fillRect(0, 0, W, H);
    rasterise(t);
    const reach = mobile ? 80 : 120;
    const lit = pointer.active && (t < pointer.until || !touchOnly);
    for (let i = 0; i < tiles.length; i++) {
      const tl = tiles[i];
      const age = t - tl.born;
      if (age < 0) continue;
      const a = Math.min(1, age / 420);
      let sy = a < 1 ? Math.max(0.02, easeOutBack(a)) : 1;
      let sc = 1;
      let light = 1 + tl.j * 0.07 + (1 - a) * 0.45;
      if (lit) {
        const d = Math.hypot(tl.cx - pointer.x, tl.cy - pointer.y);
        if (d < reach) { const u = 1 - d / reach; light += 0.2 * u * u; sc += 0.1 * u * u; }
      }
      for (const rp of ripples) {
        const ra = t - rp.t0;
        const dd = Math.abs(Math.hypot(tl.cx - rp.x, tl.cy - rp.y) - ra * 0.5);
        if (dd < 42) {
          const u = (1 - dd / 42) * Math.max(0, 1 - ra / rp.life) * rp.amp;
          sy *= 1 - 0.85 * u; light += 0.32 * u;
        }
      }
      scene(tl.cx, tl.cy, t, tl, i);
      ctx.fillStyle = `rgb(${Math.min(255, R * light) | 0},${Math.min(255, G * light) | 0},${Math.min(255, B * light) | 0})`;
      const p = tl.pts;
      ctx.beginPath();
      ctx.moveTo(tl.cx + p[0][0] * sc, tl.cy + p[0][1] * sc * sy);
      ctx.lineTo(tl.cx + p[1][0] * sc, tl.cy + p[1][1] * sc * sy);
      ctx.lineTo(tl.cx + p[2][0] * sc, tl.cy + p[2][1] * sc * sy);
      ctx.lineTo(tl.cx + p[3][0] * sc, tl.cy + p[3][1] * sc * sy);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Animation loop, paused when the hero is off screen or the tab is hidden
  let running = false, visible = true, start = 0, raf = 0, now = 0, last = 0, nextDrop = 6000;
  function frame(ts) {
    if (!running) return;
    if (!start) start = ts - now;
    const prev = now;
    now = ts - start;
    const dt = Math.min(50, Math.max(0, now - (last ? prev : now)));
    last = ts;
    if (!assembled && now > 2600) assembled = true;
    for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t0 > ripples[i].life) ripples.splice(i, 1);
    if (now > nextDrop) {
      ripples.push({ x: W * (0.5 + Math.random() * 0.45), y: hy + (H - hy) * (0.05 + Math.random() * 0.5), t0: now, life: 1500, amp: 0.45 });
      nextDrop = now + 8000 + Math.random() * 6000;
    }
    update(now, dt);
    draw(now);
    raf = requestAnimationFrame(frame);
  }
  const play = () => { if (running || reduce) return; running = true; start = 0; last = 0; raf = requestAnimationFrame(frame); };
  const pause = () => { running = false; cancelAnimationFrame(raf); };
  const still = () => draw(reduce ? 0 : now);

  function setPointer(e) {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true;
  }
  if (!reduce) {
    hero.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') setPointer(e); });
    hero.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') pointer.active = false; });
    hero.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button')) return;
      setPointer(e);
      pointer.until = now + 5000;   // on touch screens the animals follow a tap for a few seconds
      if (ripples.length < 8) ripples.push({ x: pointer.x, y: pointer.y, t0: now, life: 1900, amp: 1 });
    });
  }

  const onTheme = () => { pal = isLight() ? PALETTES.light : PALETTES.dark; if (!running) still(); };
  new MutationObserver(onTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (window.matchMedia) matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', onTheme);

  build();
  if ('ResizeObserver' in window) new ResizeObserver(() => { build(); if (!running) still(); }).observe(hero);
  else window.addEventListener('resize', () => { build(); if (!running) still(); });

  if (reduce) { still(); return; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !document.hidden) play(); else pause(); }).observe(hero);
  } else {
    play();
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else if (visible) play(); });
})();
