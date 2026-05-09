import { useEffect, useRef } from 'react';

// ── types ──────────────────────────────────────────────

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  pulse: number; pulseSpeed: number;
  depth: number; // 0=far, 1=near
  driftAmp: number; driftFreq: number; driftSeed: number;
}

interface Trail {
  from: number; to: number;
  alpha: number; alphaDir: number;
}

interface FlowParticle {
  trailIdx: number;
  progress: number;
  speed: number;
  size: number;
}

interface Molecule {
  x: number; y: number;
  radius: number;
  rotation: number; rotSpeed: number;
  depth: number;
  pulse: number; pulseSpeed: number;
}

interface DustMote {
  x: number; y: number;
  size: number;
  depth: number;
  twinkle: number; twinkleSpeed: number;
  vx: number; vy: number;
}

interface Star {
  x: number; y: number;
  size: number;
  twinkle: number; twinkleSpeed: number;
}

interface HazeBlob {
  x: number; y: number;
  radius: number;
  color: number[];
  alpha: number;
  vx: number; vy: number;
}

interface LiquidStream {
  // control points define a flowing bezier path
  points: { x: number; y: number }[];
  phase: number; phaseSpeed: number;
  amplitude: number;
  color: number[];
  alpha: number;
  lineWidth: number;
  depth: number;
}

interface FloatingParticle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  depth: number;
  color: number[];
  alpha: number;
  pulse: number; pulseSpeed: number;
}

// ── palette: blue-purple-cyan gradient ─────────────────

const ABYSS      = [2, 6, 20];
const NAVY       = [6, 16, 45];
const DEEP_BLUE  = [10, 30, 80];
const MID_BLUE   = [20, 70, 150];
const AZURE      = [30, 120, 220];
const CYAN       = [0, 200, 230];
const VIOLET     = [80, 40, 180];
const PURPLE     = [120, 30, 200];
const WHITE_BLUE = [180, 215, 255];

// ── helpers ────────────────────────────────────────────

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const lerpC = (a: number[], b: number[], t: number): number[] =>
  [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
const rgba = (c: number[], a: number) =>
  `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;

function depthColor(depth: number): number[] {
  if (depth < 0.15) return lerpC(NAVY, DEEP_BLUE, depth / 0.15);
  if (depth < 0.35) return lerpC(DEEP_BLUE, MID_BLUE, (depth - 0.15) / 0.2);
  if (depth < 0.55) return lerpC(MID_BLUE, AZURE, (depth - 0.35) / 0.2);
  if (depth < 0.75) return lerpC(AZURE, CYAN, (depth - 0.55) / 0.2);
  if (depth < 0.9)  return lerpC(CYAN, VIOLET, (depth - 0.75) / 0.15);
  return lerpC(VIOLET, PURPLE, (depth - 0.9) / 0.1);
}

// smooth plasma-like wobble using layered sine waves
function plasmaWobble(t: number, seed: number, amp: number) {
  return (
    Math.sin(t * 0.35 + seed) * amp +
    Math.cos(t * 0.52 + seed * 1.3) * amp * 0.6 +
    Math.sin(t * 0.28 + seed * 0.7) * amp * 0.35
  );
}

// ── component ──────────────────────────────────────────

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const trailsRef = useRef<Trail[]>([]);
  const flowRef = useRef<FlowParticle[]>([]);
  const moleculesRef = useRef<Molecule[]>([]);
  const dustRef = useRef<DustMote[]>([]);
  const starsRef = useRef<Star[]>([]);
  const hazeRef = useRef<HazeBlob[]>([]);
  const streamsRef = useRef<LiquidStream[]>([]);
  const floatersRef = useRef<FloatingParticle[]>([]);
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let scrollY = 0;

    // ── init ────────────────────────────────────────────

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initAll();
    };

    const initAll = () => {
      const w = canvas.width;
      const h = canvas.height;
      const area = w * h;

      // ── nodes ─────────────────────────────────────────
      const nodeCount = Math.floor(area / 15000);
      const nodes: Node[] = [];
      for (let i = 0; i < nodeCount; i++) {
        const depth = Math.random();
        nodes.push({
          x: rand(-40, w + 40),
          y: rand(-40, h + 40),
          vx: rand(-0.05, 0.05) * (0.15 + depth * 0.85),
          vy: rand(-0.04, 0.04) * (0.15 + depth * 0.85),
          radius: rand(0.35, 1.6) * (0.35 + depth * 0.65),
          pulse: rand(0, Math.PI * 2),
          pulseSpeed: rand(0.0015, 0.006),
          depth,
          driftAmp: rand(0.5, 2.0) * (1 - depth * 0.55),
          driftFreq: rand(0.2, 0.6),
          driftSeed: rand(0, Math.PI * 2),
        });
      }
      nodesRef.current = nodes;

      // ── trails ───────────────────────────────────────
      const trailCount = Math.floor(nodeCount * 1.4);
      const trails: Trail[] = [];
      for (let i = 0; i < trailCount; i++) {
        let from = Math.floor(Math.random() * nodeCount);
        let to = Math.floor(Math.random() * nodeCount);
        let tries = 0;
        while (to === from && tries < 20) { to = Math.floor(Math.random() * nodeCount); tries++; }
        if (Math.abs(nodes[from].depth - nodes[to].depth) > 0.3 && Math.random() < 0.75) {
          to = Math.floor(Math.random() * nodeCount);
          tries = 0;
          while (to === from && tries < 20) { to = Math.floor(Math.random() * nodeCount); tries++; }
        }
        trails.push({
          from, to,
          alpha: rand(0.01, 0.18),
          alphaDir: Math.random() > 0.5 ? 1 : -1,
        });
      }
      trailsRef.current = trails;

      // ── flow particles (light traveling fibers) ──────
      const fpCount = Math.floor(trailCount * 0.55);
      const fps: FlowParticle[] = [];
      for (let i = 0; i < fpCount; i++) {
        fps.push({
          trailIdx: Math.floor(Math.random() * trailCount),
          progress: Math.random(),
          speed: rand(0.0004, 0.0018),
          size: rand(0.5, 1.7),
        });
      }
      flowRef.current = fps;

      // ── molecular hex rings ──────────────────────────
      const molCount = Math.floor(area / 95000);
      const mols: Molecule[] = [];
      for (let i = 0; i < molCount; i++) {
        mols.push({
          x: rand(0, w), y: rand(0, h),
          radius: rand(16, 45),
          rotation: rand(0, Math.PI * 2),
          rotSpeed: rand(0.00025, 0.0012) * (Math.random() > 0.5 ? 1 : -1),
          depth: rand(0.12, 0.78),
          pulse: rand(0, Math.PI * 2),
          pulseSpeed: rand(0.002, 0.008),
        });
      }
      moleculesRef.current = mols;

      // ── dust motes (tiny sparkles with depth DOF) ────
      const dustCount = Math.floor(area / 20000);
      const dust: DustMote[] = [];
      for (let i = 0; i < dustCount; i++) {
        dust.push({
          x: rand(0, w), y: rand(0, h),
          size: rand(0.25, 1.2),
          depth: rand(0.4, 1),
          twinkle: rand(0, Math.PI * 2),
          twinkleSpeed: rand(0.008, 0.035),
          vx: rand(-0.04, 0.04), vy: rand(-0.04, 0.04),
        });
      }
      dustRef.current = dust;

      // ── starfield ────────────────────────────────────
      const starCount = Math.floor(area / 7500);
      const stars: Star[] = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: rand(0, w), y: rand(0, h),
          size: rand(0.15, 1.0),
          twinkle: rand(0, Math.PI * 2),
          twinkleSpeed: rand(0.004, 0.02),
        });
      }
      starsRef.current = stars;

      // ── organic haze blobs ───────────────────────────
      const hazeBlobs: HazeBlob[] = [
        { x: w * 0.22, y: h * 0.18, radius: w * 0.48, color: DEEP_BLUE, alpha: 0.03, vx: 0.025, vy: 0.018 },
        { x: w * 0.72, y: h * 0.32, radius: w * 0.38, color: MID_BLUE, alpha: 0.022, vx: -0.02, vy: 0.025 },
        { x: w * 0.5, y: h * 0.55, radius: w * 0.42, color: NAVY, alpha: 0.028, vx: 0.018, vy: -0.012 },
        { x: w * 0.33, y: h * 0.68, radius: w * 0.32, color: DEEP_BLUE, alpha: 0.02, vx: -0.028, vy: -0.018 },
        { x: w * 0.82, y: h * 0.62, radius: w * 0.28, color: [25, 15, 70], alpha: 0.018, vx: 0.012, vy: -0.025 },
        { x: w * 0.6, y: h * 0.8, radius: w * 0.35, color: [15, 10, 55], alpha: 0.017, vx: -0.015, vy: 0.02 },
      ];
      hazeRef.current = hazeBlobs;

      // ── liquid light streams ─────────────────────────
      const streamCount = Math.floor(area / 350000) + 3;
      const streams: LiquidStream[] = [];
      for (let i = 0; i < streamCount; i++) {
        const numPts = Math.floor(rand(4, 8));
        const points: { x: number; y: number }[] = [];
        for (let j = 0; j < numPts; j++) {
          points.push({
            x: rand(-w * 0.1, w * 1.1),
            y: rand(-h * 0.1, h * 1.1),
          });
        }
        const hueRoll = Math.random();
        streams.push({
          points,
          phase: rand(0, Math.PI * 2),
          phaseSpeed: rand(0.0003, 0.0008),
          amplitude: rand(20, 55),
          color: hueRoll < 0.35 ? AZURE : hueRoll < 0.65 ? CYAN : hueRoll < 0.85 ? VIOLET : PURPLE,
          alpha: rand(0.015, 0.04),
          lineWidth: rand(1, 2.8),
          depth: rand(0.15, 0.7),
        });
      }
      streamsRef.current = streams;

      // ── ambient floating particles ───────────────────
      const floaterCount = Math.floor(area / 28000);
      const floaters: FloatingParticle[] = [];
      for (let i = 0; i < floaterCount; i++) {
        const d = Math.random();
        floaters.push({
          x: rand(0, w), y: rand(0, h),
          vx: rand(-0.06, 0.06) * (1 - d * 0.6),
          vy: rand(-0.06, 0.06) * (1 - d * 0.6),
          size: rand(0.4, 2.2) * (0.4 + d * 0.6),
          depth: d,
          color: depthColor(d),
          alpha: rand(0.08, 0.25),
          pulse: rand(0, Math.PI * 2),
          pulseSpeed: rand(0.005, 0.025),
        });
      }
      floatersRef.current = floaters;
    };

    // ── event handlers ─────────────────────────────────

    const handleScroll = () => { scrollY = window.scrollY; };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ── animate ────────────────────────────────────────

    const animate = (timestamp: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const maxDim = Math.max(w, h);

      // ── background ───────────────────────────────────
      const bgGrad = ctx.createRadialGradient(w * 0.45, h * 0.38, 0, w * 0.5, h * 0.5, maxDim * 0.72);
      bgGrad.addColorStop(0, '#050d26');
      bgGrad.addColorStop(0.4, '#03081a');
      bgGrad.addColorStop(0.75, '#020510');
      bgGrad.addColorStop(1, '#010206');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const breathePhase = (elapsed % 6) / 6;
      const breathe = 0.45 + 0.55 * Math.sin(breathePhase * Math.PI * 2);
      const scrollOff = scrollY * 0.01;

      const nodes = nodesRef.current;
      const trails = trailsRef.current;
      const flowParticles = flowRef.current;
      const molecules = moleculesRef.current;
      const dustMotes = dustRef.current;
      const stars = starsRef.current;
      const hazeBlobs = hazeRef.current;
      const streams = streamsRef.current;
      const floaters = floatersRef.current;

      // ── starfield (deepest, DOF: softest) ────────────
      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        const alpha = 0.18 + Math.sin(s.twinkle) * 0.18 + breathe * 0.12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = rgba(WHITE_BLUE, alpha);
        ctx.fill();
      }

      // ── organic haze blobs ───────────────────────────
      for (const hb of hazeBlobs) {
        hb.x += hb.vx * 0.07;
        hb.y += hb.vy * 0.07;
        if (hb.x < -w * 0.4) hb.x = w * 1.4; else if (hb.x > w * 1.4) hb.x = -w * 0.4;
        if (hb.y < -h * 0.4) hb.y = h * 1.4; else if (hb.y > h * 1.4) hb.y = -h * 0.4;

        const ba = hb.alpha * (0.55 + breathe * 0.45);
        const grad = ctx.createRadialGradient(hb.x, hb.y, 0, hb.x, hb.y, hb.radius);
        grad.addColorStop(0, rgba(hb.color, ba));
        grad.addColorStop(0.5, rgba(hb.color, ba * 0.35));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // ── node positions ───────────────────────────────
      const ndX = new Float64Array(nodes.length);
      const ndY = new Float64Array(nodes.length);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const driftX = Math.sin(elapsed * n.driftFreq + n.driftSeed) * n.driftAmp;
        const driftY = Math.cos(elapsed * n.driftFreq * 0.7 + n.driftSeed + 1.7) * n.driftAmp * 0.7;
        n.x += n.vx + driftX * 0.01 + driftY * 0.006;
        n.y += n.vy + driftY * 0.008 + driftX * 0.005 + scrollOff * (0.15 + n.depth * 0.85);
        n.pulse += n.pulseSpeed;
        if (n.x < -60) n.x = w + 60; else if (n.x > w + 60) n.x = -60;
        if (n.y < -60) n.y = h + 60; else if (n.y > h + 60) n.y = -60;
        ndX[i] = n.x; ndY[i] = n.y;
      }

      // ── bioluminescent trails (double-pass for glow) ─
      for (let i = 0; i < trails.length; i++) {
        const t = trails[i];
        const fx = ndX[t.from], fy = ndY[t.from];
        const tx = ndX[t.to], ty = ndY[t.to];
        const dx = tx - fx, dy = ty - fy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 250;
        if (dist > maxDist) continue;

        t.alpha += t.alphaDir * rand(0.0006, 0.0016);
        if (t.alpha >= 0.25) t.alphaDir = -1;
        if (t.alpha <= 0.015) t.alphaDir = 1;

        const alphaScale = (1 - dist / maxDist) * (0.45 + breathe * 0.55);
        const depth = (nodes[t.from].depth + nodes[t.to].depth) / 2;
        const color = depthColor(depth);

        // DOF: far = wider softer line, near = tighter brighter
        const dofSpread = 1 + (1 - depth) * 2.5;  // far depth = more spread
        const dofAlpha = 0.3 + depth * 0.7;        // near depth = brighter

        // ── pass 1: outer glow (bioluminescent halo) ──
        const midX = (fx + tx) / 2, midY = (fy + ty) / 2;
        const perpX = -(ty - fy) * 0.08, perpY = (tx - fx) * 0.08;
        const w1 = plasmaWobble(elapsed, i * 0.6, 12);
        const w2 = plasmaWobble(elapsed, i * 0.55 + 1.5, 9);
        const cp1x = fx + dx * 0.33 + perpX + w1 * 0.5;
        const cp1y = fy + dy * 0.33 + perpY + w1 * 0.35;
        const cp2x = fx + dx * 0.67 - perpX + w2 * 0.45;
        const cp2y = fy + dy * 0.67 - perpY + w2 * 0.35;

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tx, ty);
        ctx.strokeStyle = rgba(color, t.alpha * alphaScale * dofAlpha * 0.35);
        ctx.lineWidth = (0.4 + depth * 0.5) * dofSpread * (0.5 + breathe * 0.5);
        ctx.lineCap = 'round';
        ctx.stroke();

        // ── pass 2: bright core filament ───────────────
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tx, ty);
        ctx.strokeStyle = rgba(WHITE_BLUE, t.alpha * alphaScale * dofAlpha * 0.2);
        ctx.lineWidth = (0.12 + depth * 0.18) * (0.5 + breathe * 0.5);
        ctx.stroke();
      }

      // ── flow particles (bioluminescent light travel) ─
      for (const fp of flowParticles) {
        const t = trails[fp.trailIdx];
        fp.progress += fp.speed * (0.55 + breathe * 0.45);
        if (fp.progress > 1) fp.progress -= 1;

        const from = nodes[t.from], to = nodes[t.to];
        const px = from.x + (to.x - from.x) * fp.progress;
        const py = from.y + (to.y - from.y) * fp.progress;
        const depth = (from.depth + to.depth) / 2;
        const color = depth < 0.4 ? AZURE : depth < 0.7 ? CYAN : VIOLET;
        const glowR = fp.size * 3 * (0.45 + breathe * 0.55);
        const dofSoftness = 1 + (1 - depth) * 1.8;

        // outer bloom (DOF: far = larger softer bloom)
        const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR * 2.5 * dofSoftness);
        grad.addColorStop(0, rgba(color, 0.45 * (0.45 + breathe * 0.55)));
        grad.addColorStop(0.35, rgba(color, 0.08));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(px, py, glowR * 2.5 * dofSoftness, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // bright core
        ctx.beginPath();
        ctx.arc(px, py, fp.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = rgba(WHITE_BLUE, 0.55 * (0.45 + breathe * 0.55));
        ctx.fill();
      }

      // ── liquid light streams ─────────────────────────
      for (const stream of streams) {
        stream.phase += stream.phaseSpeed;
        const pts = stream.points;

        // build a smooth bezier path through the control points
        ctx.beginPath();
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = i > 0 ? pts[i - 1] : pts[i];
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

          // organic displacement using plasma wobble
          const displaceX = plasmaWobble(elapsed, stream.phase + i * 2.3, stream.amplitude);
          const displaceY = plasmaWobble(elapsed, stream.phase + i * 2.7 + 1, stream.amplitude * 0.8);

          // Catmull-Rom to Bezier conversion for smooth curves
          const cp1x = p1.x + (p2.x - p0.x) / 6 + displaceX * 0.3;
          const cp1y = p1.y + (p2.y - p0.y) / 6 + displaceY * 0.3;
          const cp2x = p2.x - (p3.x - p1.x) / 6 + displaceX * 0.3;
          const cp2y = p2.y - (p3.y - p1.y) / 6 + displaceY * 0.3;

          if (i === 0) ctx.moveTo(p1.x + displaceX * 0.15, p1.y + displaceY * 0.15);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x + displaceX * 0.15, p2.y + displaceY * 0.15);
        }

        const sAlpha = stream.alpha * (0.5 + breathe * 0.5);
        const dofW = stream.lineWidth * (1 + (1 - stream.depth) * 2);

        // outer liquid glow
        ctx.strokeStyle = rgba(stream.color, sAlpha * 0.5);
        ctx.lineWidth = dofW * 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // inner bright stream
        ctx.strokeStyle = rgba(WHITE_BLUE, sAlpha * 0.35);
        ctx.lineWidth = dofW * 0.5;
        ctx.stroke();
      }

      // ── nodes with DOF bloom ─────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulseScale = (1 + Math.sin(n.pulse) * 0.16) * (0.5 + breathe * 0.5);
        const alpha = 0.18 + Math.sin(n.pulse) * 0.1;
        const color = depthColor(n.depth);
        const dofGlow = n.radius * 3 * (1 + (1 - n.depth) * 2.5); // far = larger softer glow
        const glowR = dofGlow * pulseScale;

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        grad.addColorStop(0, rgba(color, alpha * (0.25 + n.depth * 0.2)));
        grad.addColorStop(0.4, rgba(color, alpha * (0.04 + n.depth * 0.06)));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // core (nearer = sharper)
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * pulseScale * (0.6 + n.depth * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = rgba(WHITE_BLUE, alpha * (0.2 + n.depth * 0.35));
        ctx.fill();
      }

      // ── molecular hex rings ──────────────────────────
      for (const mol of molecules) {
        mol.rotation += mol.rotSpeed;
        mol.pulse += mol.pulseSpeed;
        mol.x += Math.sin(elapsed * 0.18 + mol.pulse) * 0.04;
        mol.y += Math.cos(elapsed * 0.22 + mol.pulse) * 0.04 + scrollOff * (0.08 + mol.depth * 0.28);
        if (mol.x < -60) mol.x = w + 60; else if (mol.x > w + 60) mol.x = -60;
        if (mol.y < -60) mol.y = h + 60; else if (mol.y > h + 60) mol.y = -60;

        const molAlpha = 0.04 + breathe * 0.05 + Math.sin(mol.pulse) * 0.015;
        const ringR = mol.radius * (0.8 + breathe * 0.2);
        const color = mol.depth > 0.5 ? VIOLET : AZURE;
        const N = 6;
        const dofLW = (0.2 + mol.depth * 0.25) * (1 + (1 - mol.depth) * 2);

        ctx.beginPath();
        for (let j = 0; j <= N; j++) {
          const a = (j / N) * Math.PI * 2 + mol.rotation;
          const rx = mol.x + Math.cos(a) * ringR;
          const ry = mol.y + Math.sin(a) * ringR;
          if (j === 0) ctx.moveTo(rx, ry); else ctx.lineTo(rx, ry);
        }
        ctx.strokeStyle = rgba(color, molAlpha);
        ctx.lineWidth = dofLW;
        ctx.stroke();

        for (let j = 0; j < N; j++) {
          const a = (j / N) * Math.PI * 2 + mol.rotation;
          const nx = mol.x + Math.cos(a) * ringR;
          const ny = mol.y + Math.sin(a) * ringR;
          const dotR = 1 + mol.depth * 1.5;
          const dg = ctx.createRadialGradient(nx, ny, 0, nx, ny, dotR * 2.5);
          dg.addColorStop(0, rgba(WHITE_BLUE, molAlpha * 2));
          dg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(nx, ny, dotR * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = dg;
          ctx.fill();
        }

        const cg = ctx.createRadialGradient(mol.x, mol.y, 0, mol.x, mol.y, 2.5);
        cg.addColorStop(0, rgba(WHITE_BLUE, molAlpha * 1.4));
        cg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(mol.x, mol.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
      }

      // ── ambient floating particles ───────────────────
      for (const fp of floaters) {
        fp.pulse += fp.pulseSpeed;
        fp.x += fp.vx + Math.sin(elapsed * 0.3 + fp.pulse) * 0.025;
        fp.y += fp.vy + Math.cos(elapsed * 0.25 + fp.pulse) * 0.025 + scrollOff * (0.1 + fp.depth * 0.35);
        if (fp.x < -20) fp.x = w + 20; else if (fp.x > w + 20) fp.x = -20;
        if (fp.y < -20) fp.y = h + 20; else if (fp.y > h + 20) fp.y = -20;

        const fa = fp.alpha * (0.5 + Math.sin(fp.pulse) * 0.3 + breathe * 0.2);
        const dofR = fp.size * (1 + (1 - fp.depth) * 2);

        const fg = ctx.createRadialGradient(fp.x, fp.y, 0, fp.x, fp.y, dofR * 3);
        fg.addColorStop(0, rgba(fp.color, fa));
        fg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(fp.x, fp.y, dofR * 3, 0, Math.PI * 2);
        ctx.fillStyle = fg;
        ctx.fill();
      }

      // ── dust motes (near-depth DOF: sharper) ─────────
      for (const d of dustMotes) {
        d.twinkle += d.twinkleSpeed;
        d.x += d.vx;
        d.y += d.vy + scrollOff * (0.12 + d.depth * 0.55);
        if (d.x < -10) d.x = w + 10; else if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10; else if (d.y > h + 10) d.y = -10;
        const alpha = 0.12 + Math.sin(d.twinkle) * 0.14 + breathe * 0.08;
        const softR = d.size * (1.5 - d.depth * 0.8);

        const dg = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, softR * 2);
        dg.addColorStop(0, rgba(WHITE_BLUE, alpha));
        dg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(d.x, d.y, softR * 2, 0, Math.PI * 2);
        ctx.fillStyle = dg;
        ctx.fill();
      }

      // ── god rays ─────────────────────────────────────
      const rayAlpha = 0.013 + breathe * 0.011;

      const r1 = ctx.createRadialGradient(w * 0.18, h * -0.12, 0, w * 0.28, h * 0.35, maxDim * 1.15);
      r1.addColorStop(0, `rgba(25, 70, 160, ${rayAlpha})`);
      r1.addColorStop(0.4, `rgba(10, 30, 80, ${rayAlpha * 0.45})`);
      r1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = r1;
      ctx.fillRect(0, 0, w, h);

      const r2 = ctx.createRadialGradient(w * 0.85, h * -0.08, 0, w * 0.7, h * 0.22, maxDim * 0.82);
      r2.addColorStop(0, `rgba(0, 150, 200, ${rayAlpha * 0.45})`);
      r2.addColorStop(0.5, `rgba(30, 60, 150, ${rayAlpha * 0.25})`);
      r2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = r2;
      ctx.fillRect(0, 0, w, h);

      const r3 = ctx.createRadialGradient(w * 0.5, h * 0.25, 0, w * 0.5, h * 0.45, maxDim * 0.6);
      r3.addColorStop(0, `rgba(70, 30, 170, ${rayAlpha * 0.3})`);
      r3.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = r3;
      ctx.fillRect(0, 0, w, h);

      // ── vignette ─────────────────────────────────────
      const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, maxDim * 0.3, w * 0.5, h * 0.5, maxDim * 0.76);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(1,2,10,0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
