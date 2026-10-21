/**
 * Architectural drawing plates.
 *
 * These line drawings stand in for photographs that have not been supplied
 * yet. They are original study drawings (not reproductions of a specific
 * project) and are rendered as inline SVG so they stay sharp and light.
 * All plates use a square 1000×1000 viewBox with "slice" so they crop
 * gracefully into portrait, square and landscape frames.
 */

import type { ReactNode } from "react";

export type PlateKind =
  | "facade"
  | "facade-night"
  | "facade-alt"
  | "interior-living"
  | "interior-bedroom"
  | "landscape"
  | "section";

type Palette = {
  bg: string;
  line: string;
  faint: string;
  wall: string;
  louver: string;
  fin: string;
  glass: string;
  glassLine: string;
  timber: string;
  stone: string;
  stoneLine: string;
  void: string;
  leaf: string;
  accent: string;
  label: string;
};

const DAY: Palette = {
  bg: "#F6F2EA",
  line: "#1D1B19",
  faint: "rgba(29,27,25,0.22)",
  wall: "#FDFBF7",
  louver: "#2A2826",
  fin: "rgba(253,251,247,0.28)",
  glass: "#C9D3D1",
  glassLine: "rgba(255,255,255,0.75)",
  timber: "#B88D66",
  stone: "#D3CABC",
  stoneLine: "rgba(29,27,25,0.28)",
  void: "#3A3734",
  leaf: "#E5E2D2",
  accent: "#C4521F",
  label: "#5E5952",
};

const NIGHT: Palette = {
  bg: "#191816",
  line: "rgba(244,240,232,0.62)",
  faint: "rgba(244,240,232,0.14)",
  wall: "#2A2724",
  louver: "#0F0E0D",
  fin: "rgba(255,196,130,0.22)",
  glass: "url(#cb-warm)",
  glassLine: "rgba(255,230,190,0.35)",
  timber: "#6E4E35",
  stone: "#3B3732",
  stoneLine: "rgba(244,240,232,0.16)",
  void: "#0D0C0B",
  leaf: "#23241F",
  accent: "#E2804F",
  label: "rgba(244,240,232,0.55)",
};

export function ArchPlate({
  kind,
  className,
  title,
}: {
  kind: PlateKind;
  className?: string;
  title?: string;
}) {
  const night = kind === "facade-night";
  const p = night ? NIGHT : DAY;
  const label = plateLabel(kind);
  let body: ReactNode;

  switch (kind) {
    case "facade":
      body = <Facade p={p} variant="louver" />;
      break;
    case "facade-night":
      body = <Facade p={p} variant="louver" night />;
      break;
    case "facade-alt":
      body = <Facade p={p} variant="jali" mirror />;
      break;
    case "interior-living":
      body = <Interior p={p} room="living" />;
      break;
    case "interior-bedroom":
      body = <Interior p={p} room="bedroom" />;
      break;
    case "landscape":
      body = <SitePlan p={p} />;
      break;
    case "section":
      body = <Section p={p} />;
      break;
  }

  return (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={title ?? `${label} — architectural drawing placeholder`}
      style={{ background: p.bg, display: "block", width: "100%", height: "100%" }}
    >
      <Defs />
      {body}
    </svg>
  );
}

export function plateLabel(kind: PlateKind) {
  return {
    facade: "Study elevation A",
    "facade-night": "Study elevation, dusk",
    "facade-alt": "Study elevation B",
    "interior-living": "Interior study, living",
    "interior-bedroom": "Interior study, bedroom",
    landscape: "Landscape study, plan",
    section: "Study section",
  }[kind];
}

function Defs() {
  return (
    <defs>
      <linearGradient id="cb-warm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F6C487" />
        <stop offset="1" stopColor="#B8692F" />
      </linearGradient>
      <radialGradient id="cb-glow">
        <stop offset="0" stopColor="#FFD9A8" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FFD9A8" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cb-wash" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFCF96" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FFCF96" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="cb-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141312" />
        <stop offset="1" stopColor="#2A2622" />
      </linearGradient>
      <linearGradient id="cb-cove" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F0B97E" stopOpacity="0.45" />
        <stop offset="1" stopColor="#F0B97E" stopOpacity="0" />
      </linearGradient>
      <pattern id="cb-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(29,27,25,0.35)" strokeWidth="1" />
      </pattern>
      <pattern id="cb-jali" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#2A2826" />
        <rect x="3" y="3" width="8" height="8" fill="#E9E1D3" />
      </pattern>
    </defs>
  );
}

/* ── helpers ──────────────────────────────────────────────────────────────── */

const S = 40; // 1 m = 40 units
const GY = 780; // ground line

function range(a: number, b: number, step: number) {
  const out: number[] = [];
  for (let v = a; v <= b + 1e-6; v += step) out.push(v);
  return out;
}

/* ── Facade elevation ─────────────────────────────────────────────────────── */

function Facade({
  p,
  variant,
  night = false,
  mirror = false,
}: {
  p: Palette;
  variant: "louver" | "jali";
  night?: boolean;
  mirror?: boolean;
}) {
  // x in metres from centre line, y in metres above ground
  const X = (m: number) => 500 + (mirror ? -m : m) * S;
  const Y = (m: number) => GY - m * S;
  const rect = (x1: number, y1: number, x2: number, y2: number) => {
    const a = X(x1);
    const b = X(x2);
    return { x: Math.min(a, b), y: Y(y2), width: Math.abs(b - a), height: (y2 - y1) * S };
  };
  const sw = 1.6;
  const levels = [0.45, 3.75, 7.0, 10.25];

  return (
    <g>
      {night && <rect width="1000" height="1000" fill="url(#cb-sky)" />}

      {/* grid axes */}
      <g stroke={p.faint} strokeDasharray="2 6" strokeWidth="1">
        {[-4, 0, 4].map((g) => (
          <line key={g} x1={X(g)} y1={Y(14.6)} x2={X(g)} y2={GY + 34} />
        ))}
      </g>
      <g fontFamily="var(--font-mono), monospace" fontSize="11" fill={p.label} textAnchor="middle">
        {[-4, 0, 4].map((g, i) => (
          <g key={g}>
            <circle cx={X(g)} cy={GY + 50} r="11" fill="none" stroke={p.faint} />
            <text x={X(g)} y={GY + 54}>{"ABC"[i]}</text>
          </g>
        ))}
      </g>

      {/* stone fin */}
      <rect {...rect(-4, 0, -3.2, 12)} fill={p.stone} stroke={p.line} strokeWidth={sw} />
      <g stroke={p.stoneLine} strokeWidth="1">
        {range(0.3, 11.7, 0.3).map((y, i) => (
          <g key={y}>
            <line x1={X(-4)} y1={Y(y)} x2={X(-3.2)} y2={Y(y)} />
            <line
              x1={X(i % 2 ? -3.75 : -3.45)}
              y1={Y(y)}
              x2={X(i % 2 ? -3.75 : -3.45)}
              y2={Y(y - 0.3)}
            />
          </g>
        ))}
      </g>

      {/* main white volume + parapet */}
      <rect {...rect(-3.2, 0, 4, 11.45)} fill={p.wall} stroke={p.line} strokeWidth={sw} />
      {/* stair head */}
      <rect {...rect(1.8, 11.45, 4, 13.2)} fill={p.wall} stroke={p.line} strokeWidth={sw} />
      {/* plinth */}
      <rect {...rect(-3.2, 0, 4, 0.45)} fill={night ? "#221F1C" : "#E8E2D7"} stroke={p.line} strokeWidth="1" />

      {/* ground floor: car porch void + entrance */}
      <rect {...rect(-2.9, 0.45, 1.5, 3.25)} fill={p.void} />
      <rect {...rect(-2.9, 3.25, 1.5, 3.55)} fill={p.timber} />
      {night && <rect {...rect(-2.9, 0.45, 1.5, 3.25)} fill="url(#cb-wash)" opacity="0.5" />}
      <rect {...rect(2.2, 0.45, 3.4, 3.1)} fill={p.timber} stroke={p.line} strokeWidth="1" />
      <g stroke={night ? "rgba(0,0,0,0.35)" : "rgba(29,27,25,0.25)"}>
        {range(2.35, 3.25, 0.15).map((x) => (
          <line key={x} x1={X(x)} y1={Y(0.45)} x2={X(x)} y2={Y(3.1)} />
        ))}
      </g>

      {/* frame around F1–F2 */}
      <rect {...rect(-3.2, 3.75, 1.6, 10.25)} fill="none" stroke={p.line} strokeWidth={sw} />
      <rect {...rect(-2.85, 4.0, 1.25, 9.95)} fill="none" stroke={p.line} strokeWidth="1" />

      {/* glazing behind balconies */}
      {[
        [3.95, 6.55],
        [7.2, 9.75],
      ].map(([a, b]) => (
        <g key={a}>
          <rect {...rect(-2.85, a, 1.25, b)} fill={p.glass} />
          <g stroke={night ? "rgba(0,0,0,0.45)" : p.line} strokeWidth="1">
            {range(-2.85, 1.25, 1.025).map((x) => (
              <line key={x} x1={X(x)} y1={Y(a)} x2={X(x)} y2={Y(b)} />
            ))}
          </g>
          {!night && (
            <g stroke={p.glassLine} strokeWidth="2">
              <line x1={X(-2.2)} y1={Y(b - 0.3)} x2={X(-1.2)} y2={Y(a + 0.8)} />
              <line x1={X(-1.9)} y1={Y(b - 0.3)} x2={X(-1.1)} y2={Y(a + 1.6)} />
            </g>
          )}
        </g>
      ))}

      {/* slabs, balconies, timber soffits, downlights */}
      {[3.75, 7.0].map((y, i) => {
        const x2 = i === 0 ? 1.4 : 0.5;
        return (
          <g key={y}>
            <rect {...rect(-3.2, y - 0.22, x2 + 0.2, y)} fill={p.timber} stroke={p.line} strokeWidth="1" />
            <rect {...rect(-3.2, y, x2 + 0.2, y + 0.18)} fill={p.wall} stroke={p.line} strokeWidth={sw} />
            {/* glass railing */}
            <rect {...rect(-2.85, y + 0.18, x2, y + 1.2)} fill={night ? "rgba(255,214,160,0.08)" : "rgba(201,211,209,0.45)"} stroke={p.line} strokeWidth="1" />
            <line x1={X(-2.85)} y1={Y(y + 1.2)} x2={X(x2)} y2={Y(y + 1.2)} stroke={p.line} strokeWidth="2.4" />
            {range(-2.4, x2 - 0.3, 1.1).map((x) => (
              <g key={x}>
                {night && (
                  <polygon
                    points={`${X(x) - 3},${Y(y - 0.22)} ${X(x) + 3},${Y(y - 0.22)} ${X(x) + 26},${Y(y - 2.6)} ${X(x) - 26},${Y(y - 2.6)}`}
                    fill="url(#cb-wash)"
                  />
                )}
                <circle cx={X(x)} cy={Y(y - 0.24)} r={night ? 3 : 2.2} fill={night ? "#FFE3B8" : p.accent} />
              </g>
            ))}
          </g>
        );
      })}

      {/* louver / jali screen */}
      {variant === "louver" ? (
        <g>
          <rect {...rect(1.8, 3.75, 3.8, 11.45)} fill={p.louver} stroke={p.line} strokeWidth="1" />
          <g stroke={p.fin} strokeWidth="1.2">
            {range(1.95, 3.7, 0.18).map((x) => (
              <line key={x} x1={X(x)} y1={Y(3.75)} x2={X(x)} y2={Y(11.45)} />
            ))}
          </g>
        </g>
      ) : (
        <g>
          <rect {...rect(1.8, 3.75, 3.8, 10.25)} fill="url(#cb-jali)" stroke={p.line} strokeWidth="1.4" />
          <rect {...rect(1.8, 10.25, 3.8, 11.45)} fill={p.wall} stroke={p.line} strokeWidth="1" />
        </g>
      )}

      {/* terrace pergola + planters */}
      <g stroke={p.line} strokeWidth="1.4">
        <rect {...rect(-3.2, 12.9, 1.6, 13.15)} fill={p.louver} />
        <line x1={X(-2.9)} y1={Y(11.45)} x2={X(-2.9)} y2={Y(12.9)} />
        <line x1={X(1.3)} y1={Y(11.45)} x2={X(1.3)} y2={Y(12.9)} />
      </g>
      <g fill={p.leaf} stroke={p.line} strokeWidth="1">
        {range(-2.6, 1.0, 0.5).map((x, i) => (
          <circle key={x} cx={X(x)} cy={Y(11.65 + (i % 2) * 0.12)} r={9 + (i % 3) * 2} />
        ))}
      </g>

      {/* level annotations */}
      <g fontFamily="var(--font-mono), monospace" fontSize="11" fill={p.label}>
        {[...levels, 11.45].map((l) => (
          <g key={l}>
            <line x1={X(mirror ? -4.3 : 4.3)} y1={Y(l)} x2={X(mirror ? -5.6 : 5.6)} y2={Y(l)} stroke={p.faint} />
            <path
              d={`M${X(mirror ? -4.55 : 4.55)},${Y(l) - 7} l6,7 l6,-7 z`}
              fill="none"
              stroke={p.label}
              strokeWidth="1"
            />
            <text x={X(mirror ? -4.6 : 4.95)} y={Y(l) - 4} textAnchor={mirror ? "end" : "start"}>
              +{l.toFixed(2)}
            </text>
          </g>
        ))}
      </g>

      {/* dimension line */}
      <g stroke={p.label} strokeWidth="1">
        <line x1={X(-4)} y1={Y(14.3)} x2={X(4)} y2={Y(14.3)} />
        {[-4, 4].map((g) => (
          <line key={g} x1={X(g) - 5} y1={Y(14.3) + 5} x2={X(g) + 5} y2={Y(14.3) - 5} />
        ))}
      </g>

      {/* landscape */}
      <Tree x={X(-6.4)} base={GY} h={150} p={p} />
      <Tree x={X(-7.6)} base={GY} h={100} p={p} />
      <Palm x={X(6.6)} base={GY} h={250} p={p} flip={mirror} />
      <g fill={p.leaf} stroke={p.line} strokeWidth="1">
        {range(-5.2, -4.2, 0.35).map((x) => (
          <circle key={x} cx={X(x)} cy={GY - 10} r="12" />
        ))}
        {range(4.3, 5.4, 0.35).map((x) => (
          <circle key={x} cx={X(x)} cy={GY - 9} r="10" />
        ))}
      </g>

      {/* ground */}
      <line x1="40" y1={GY} x2="960" y2={GY} stroke={p.line} strokeWidth="2.4" />
      <rect x="40" y={GY + 1} width="920" height="14" fill="url(#cb-hatch)" opacity={night ? 0.4 : 1} />
    </g>
  );
}

function Tree({ x, base, h, p }: { x: number; base: number; h: number; p: Palette }) {
  const r = h * 0.28;
  const cy = base - h + r;
  return (
    <g>
      <line x1={x} y1={base} x2={x} y2={cy + r * 0.6} stroke={p.line} strokeWidth="1.6" />
      <g fill={p.leaf} stroke={p.line} strokeWidth="1" fillOpacity="0.9">
        <circle cx={x - r * 0.55} cy={cy + r * 0.25} r={r * 0.7} />
        <circle cx={x + r * 0.6} cy={cy + r * 0.3} r={r * 0.66} />
        <circle cx={x} cy={cy - r * 0.15} r={r * 0.8} />
      </g>
    </g>
  );
}

function Palm({ x, base, h, p, flip }: { x: number; base: number; h: number; p: Palette; flip?: boolean }) {
  const d = flip ? -1 : 1;
  const tx = x + d * 18;
  const ty = base - h;
  const fronds = [-150, -120, -95, -70, -40, -15, 15, 40];
  return (
    <g stroke={p.line} fill="none" strokeWidth="1.3">
      <path d={`M${x},${base} Q${x + d * 4},${base - h * 0.5} ${tx},${ty}`} strokeWidth="2.6" />
      {fronds.map((a) => {
        const r = (a * Math.PI) / 180;
        const ex = tx + Math.cos(r) * 70 * d;
        const ey = ty + Math.sin(r) * 50 + 30;
        const cx = tx + Math.cos(r) * 40 * d;
        const cy = ty + Math.sin(r) * 50 - 10;
        return <path key={a} d={`M${tx},${ty} Q${cx},${cy} ${ex},${ey}`} />;
      })}
    </g>
  );
}

/* ── One-point perspective interiors ──────────────────────────────────────── */

function Interior({ p, room }: { p: Palette; room: "living" | "bedroom" }) {
  // back wall
  const bx1 = 250,
    bx2 = 750,
    by1 = 250,
    by2 = 640;
  const fx1 = -150,
    fx2 = 1150,
    fy1 = -120,
    fy2 = 1180;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const floorY = (t: number) => lerp(by2, fy2, t);
  const leftX = (t: number) => lerp(bx1, fx1, t);
  const rightX = (t: number) => lerp(bx2, fx2, t);
  const depthTs = [0.08, 0.18, 0.31, 0.48, 0.7];

  return (
    <g stroke={p.line} strokeWidth="1.3" fill="none">
      {/* surfaces */}
      <polygon points={`${bx1},${by1} ${bx2},${by1} ${bx2},${by2} ${bx1},${by2}`} fill="#FBF8F2" />
      <polygon points={`${fx1},${fy1} ${bx1},${by1} ${bx1},${by2} ${fx1},${fy2}`} fill="#EFE9DF" />
      <polygon points={`${fx2},${fy1} ${bx2},${by1} ${bx2},${by2} ${fx2},${fy2}`} fill="#F2EDE4" />
      <polygon points={`${fx1},${fy2} ${bx1},${by2} ${bx2},${by2} ${fx2},${fy2}`} fill="#E7E0D4" />
      <polygon points={`${fx1},${fy1} ${bx1},${by1} ${bx2},${by1} ${fx2},${fy1}`} fill="#F7F3EC" />

      {/* floor tiles */}
      <g stroke={p.faint} strokeWidth="1">
        {range(0, 1, 0.125).map((t) => (
          <line key={t} x1={lerp(bx1, bx2, t)} y1={by2} x2={lerp(fx1, fx2, t)} y2={fy2} />
        ))}
        {depthTs.map((t) => (
          <line key={t} x1={leftX(t)} y1={floorY(t)} x2={rightX(t)} y2={floorY(t)} />
        ))}
      </g>

      {/* ceiling cove + light */}
      <polygon
        points={`${bx1 - 40},${by1 - 30} ${bx2 + 40},${by1 - 30} ${bx2 + 40},${by1 + 30} ${bx1 - 40},${by1 + 30}`}
        fill="url(#cb-cove)"
        stroke="none"
      />
      <line x1={lerp(bx1, fx1, 0.18)} y1={lerp(by1, fy1, 0.18)} x2={lerp(bx2, fx2, 0.18)} y2={lerp(by1, fy1, 0.18)} />
      <line x1={bx1 - 2} y1={by1 + 16} x2={bx2 + 2} y2={by1 + 16} stroke="#E0A86C" strokeWidth="2" />

      {/* corner lines */}
      <line x1={bx1} y1={by1} x2={fx1} y2={fy1} />
      <line x1={bx2} y1={by1} x2={fx2} y2={fy1} />
      <line x1={bx1} y1={by2} x2={fx1} y2={fy2} />
      <line x1={bx2} y1={by2} x2={fx2} y2={fy2} />
      <rect x={bx1} y={by1} width={bx2 - bx1} height={by2 - by1} />

      {/* right wall: tall window with sheer curtain */}
      {(() => {
        const t1 = 0.12,
          t2 = 0.55;
        const xa = rightX(t1),
          xb = rightX(t2);
        const ya1 = lerp(by1, fy1, t1) + 40,
          ya2 = floorY(t1) - 2;
        const yb1 = lerp(by1, fy1, t2) + 70,
          yb2 = floorY(t2) - 4;
        return (
          <g>
            <polygon points={`${xa},${ya1} ${xb},${yb1} ${xb},${yb2} ${xa},${ya2}`} fill="#F9F2E6" />
            {range(0, 1, 0.08).map((t) => {
              const x = lerp(xa, xb, t);
              const y1 = lerp(ya1, yb1, t);
              const y2 = lerp(ya2, yb2, t);
              return <path key={t} d={`M${x},${y1} Q${x + 6},${(y1 + y2) / 2} ${x},${y2}`} stroke={p.faint} />;
            })}
          </g>
        );
      })()}

      {room === "living" ? <LivingBits p={p} bx1={bx1} bx2={bx2} by1={by1} by2={by2} /> : <BedroomBits p={p} bx1={bx1} bx2={bx2} by1={by1} by2={by2} />}
    </g>
  );
}

type WallBox = { p: Palette; bx1: number; bx2: number; by1: number; by2: number };

function LivingBits({ p, bx1, bx2, by2 }: WallBox) {
  return (
    <g>
      {/* fluted panel */}
      <rect x={bx1 + 60} y={300} width={bx2 - bx1 - 120} height={by2 - 300} fill="#EEE6DA" />
      <g stroke={p.faint}>
        {range(bx1 + 70, bx2 - 70, 9).map((x) => (
          <line key={x} x1={x} y1={300} x2={x} y2={by2} />
        ))}
      </g>
      {/* round feature light */}
      <circle cx={590} cy={392} r={62} fill="url(#cb-glow)" stroke="none" />
      <circle cx={590} cy={392} r={44} fill="#2A2826" />
      {/* sofa */}
      <rect x={300} y={520} width={400} height={70} rx={10} fill="#B8AFA3" />
      <rect x={290} y={570} width={420} height={60} rx={8} fill="#CFC7BB" />
      <rect x={278} y={540} width={34} height={92} rx={8} fill="#B8AFA3" />
      <rect x={688} y={540} width={34} height={92} rx={8} fill="#B8AFA3" />
      <rect x={330} y={530} width={70} height={46} rx={6} fill={p.accent} fillOpacity="0.85" />
      {/* rug + table */}
      <polygon points="230,700 770,700 900,880 100,880" fill="#DAD1C3" />
      <rect x={380} y={690} width={240} height={22} fill="#2A2826" />
      <line x1={400} y1={712} x2={400} y2={770} />
      <line x1={600} y1={712} x2={600} y2={770} />
      {/* floor lamp */}
      <line x1={205} y1={420} x2={205} y2={720} />
      <path d="M180,420 L230,420 L218,380 L192,380 Z" fill="#F3DDBF" />
      {/* pendant */}
      <line x1={500} y1={120} x2={500} y2={230} />
      <ellipse cx={500} cy={238} rx={34} ry={9} fill="#2A2826" />
      {/* plant */}
      <path d="M820,820 L880,820 L870,900 L830,900 Z" fill="#D3CABC" />
      {[-60, -35, -10, 15, 40].map((a) => (
        <path key={a} d={`M850,820 Q${850 + a},${740} ${850 + a * 1.6},${690 + Math.abs(a)}`} />
      ))}
    </g>
  );
}

function BedroomBits({ p, bx1, bx2, by2 }: WallBox) {
  return (
    <g>
      {/* channel-tufted headboard wall */}
      <rect x={bx1 + 40} y={330} width={bx2 - bx1 - 80} height={by2 - 330} fill="#D9D0C3" />
      <g stroke="rgba(29,27,25,0.18)">
        {range(bx1 + 70, bx2 - 60, 26).map((x) => (
          <line key={x} x1={x} y1={330} x2={x} y2={540} />
        ))}
      </g>
      {/* backlit circle */}
      <circle cx={395} cy={300} r={70} fill="url(#cb-glow)" stroke="none" />
      <circle cx={395} cy={300} r={48} fill="#F3E9DA" />
      {/* bed */}
      <rect x={310} y={500} width={380} height={46} rx={8} fill="#F1ECE4" />
      <rect x={330} y={482} width={110} height={40} rx={14} fill="#FBF8F2" />
      <rect x={560} y={482} width={110} height={40} rx={14} fill="#FBF8F2" />
      <polygon points="300,540 700,540 760,700 240,700" fill="#8C857C" />
      <polygon points="240,700 760,700 760,730 240,730" fill="#6F6962" />
      <g stroke="rgba(255,255,255,0.35)">
        <line x1={350} y1={560} x2={310} y2={690} />
        <line x1={650} y1={560} x2={690} y2={690} />
        <line x1={500} y1={545} x2={500} y2={698} />
      </g>
      <rect x={300} y={600} width={400} height={30} fill={p.accent} fillOpacity="0.8" />
      {/* side tables + lamps */}
      {[230, 770].map((x) => (
        <g key={x}>
          <rect x={x - 40} y={560} width={80} height={60} fill="#B88D66" />
          <line x1={x} y1={500} x2={x} y2={560} />
          <path d={`M${x - 22},500 L${x + 22},500 L${x + 14},470 L${x - 14},470 Z`} fill="#F3DDBF" />
        </g>
      ))}
      {/* pendant pair */}
      {[640, 700].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={100} x2={x} y2={250 + i * 30} />
          <circle cx={x} cy={262 + i * 30} r={11} fill="#F6D7AE" />
        </g>
      ))}
    </g>
  );
}

/* ── Landscape site plan ──────────────────────────────────────────────────── */

function SitePlan({ p }: { p: Palette }) {
  const trees = [
    [240, 260, 70],
    [330, 200, 46],
    [760, 280, 58],
    [810, 690, 74],
    [210, 720, 52],
    [690, 820, 40],
  ];
  return (
    <g stroke={p.line} strokeWidth="1.3" fill="none">
      {/* plot boundary */}
      <rect x="130" y="130" width="740" height="740" strokeDasharray="10 6" />
      {/* lawn texture */}
      <rect x="160" y="160" width="680" height="680" fill="#E6E2D2" stroke="none" />
      <g fill={p.faint} stroke="none">
        {range(180, 820, 22).flatMap((x) =>
          range(180, 820, 22).map((y) => <circle key={`${x}-${y}`} cx={x + ((y / 22) % 2) * 11} cy={y} r="1.1" />),
        )}
      </g>
      {/* building footprint */}
      <rect x="380" y="300" width="300" height="380" fill="url(#cb-hatch)" />
      <rect x="380" y="300" width="300" height="380" strokeWidth="2.4" />
      {/* terrace deck */}
      <rect x="300" y="430" width="80" height="250" fill="#D7C2A8" />
      <g stroke="rgba(29,27,25,0.25)">
        {range(440, 680, 12).map((y) => (
          <line key={y} x1="300" y1={y} x2="380" y2={y} />
        ))}
      </g>
      {/* stepping stones + path */}
      {range(0, 6, 1).map((i) => (
        <rect key={i} x={520 - 14 + (i % 2) * 18} y={700 + i * 26} width="40" height="16" fill="#F6F2EA" />
      ))}
      {/* trees */}
      {trees.map(([x, y, r]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r={r} fill="#C9CDB3" fillOpacity="0.75" />
          {range(0, 330, 30).map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={x + Math.cos(rad) * r * 0.2}
                y1={y + Math.sin(rad) * r * 0.2}
                x2={x + Math.cos(rad) * r * 0.85}
                y2={y + Math.sin(rad) * r * 0.85}
                stroke={p.faint}
              />
            );
          })}
          <circle cx={x} cy={y} r="2.5" fill={p.line} />
        </g>
      ))}
      {/* water / pool */}
      <rect x="170" y="430" width="110" height="200" fill="#C9D6D5" />
      <g stroke="rgba(255,255,255,0.8)">
        {range(450, 610, 24).map((y) => (
          <path key={y} d={`M185,${y} q12,-6 24,0 t24,0 t24,0 t24,0`} />
        ))}
      </g>
      {/* north arrow */}
      <g transform="translate(820,180)">
        <circle r="22" />
        <path d="M0,-18 L7,10 L0,4 L-7,10 Z" fill={p.accent} stroke="none" />
        <text y="-30" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="11" fill={p.label} stroke="none">
          N
        </text>
      </g>
      {/* scale bar */}
      <g transform="translate(560,900)" fontFamily="var(--font-mono), monospace" fontSize="10" fill={p.label}>
        <rect width="40" height="6" fill={p.line} stroke="none" />
        <rect x="40" width="40" height="6" stroke={p.line} />
        <rect x="80" width="80" height="6" fill={p.line} stroke="none" />
        <text x="0" y="22" stroke="none">0</text>
        <text x="76" y="22" stroke="none">2</text>
        <text x="152" y="22" stroke="none">5 m</text>
      </g>
    </g>
  );
}

/* ── Building section ─────────────────────────────────────────────────────── */

function Section({ p }: { p: Palette }) {
  const X = (m: number) => 500 + m * S * 0.62;
  const Y = (m: number) => GY - m * S;
  const levels = [0.45, 3.75, 7.0, 10.25];
  return (
    <g stroke={p.line} strokeWidth="1.3">
      {/* cut walls */}
      <rect x={X(-7)} y={Y(11.45)} width="10" height={11 * S} fill={p.line} />
      <rect x={X(7) - 10} y={Y(11.45)} width="10" height={11 * S} fill={p.line} />
      {/* slabs */}
      {levels.map((l) => (
        <rect key={l} x={X(-7.6)} y={Y(l) - 2} width={X(7.4) - X(-7.6)} height="9" fill={p.line} />
      ))}
      {/* stair */}
      {[0, 1, 2].map((f) => {
        const y0 = levels[f];
        const y1 = levels[f + 1];
        const steps = 11;
        let d = `M${X(-6.4)},${Y(y0)}`;
        for (let i = 0; i < steps; i++) {
          const x = X(-6.4 + (i * 2.6) / steps);
          const y = Y(y0 + ((i + 1) * (y1 - y0)) / steps);
          d += ` L${x},${y} L${X(-6.4 + ((i + 1) * 2.6) / steps)},${y}`;
        }
        return <path key={f} d={d} fill="none" />;
      })}
      {/* furniture silhouettes */}
      <g fill="#CFC7BB" stroke="none">
        <rect x={X(0)} y={Y(4.35)} width="120" height="24" />
        <rect x={X(0)} y={Y(4.85)} width="20" height="44" />
        <rect x={X(3)} y={Y(4.5)} width="70" height="8" fill={p.line} />
        <rect x={X(-1)} y={Y(7.55)} width="150" height="22" />
        <rect x={X(-1)} y={Y(8.2)} width="12" height="48" />
        <rect x={X(4.6)} y={Y(9.4)} width="34" height="90" fill="#B88D66" />
      </g>
      {/* warm light pools */}
      {[3.75, 7.0, 10.25].map((l) => (
        <ellipse key={l} cx={X(1.5)} cy={Y(l) + 10} rx="90" ry="10" fill="url(#cb-glow)" stroke="none" />
      ))}
      {/* parapet + pergola */}
      <rect x={X(-7.6)} y={Y(11.45)} width="10" height={1.2 * S} fill={p.line} />
      <line x1={X(-3)} y1={Y(13)} x2={X(6)} y2={Y(13)} strokeWidth="5" />
      <line x1={X(-2.5)} y1={Y(10.25)} x2={X(-2.5)} y2={Y(13)} />
      <line x1={X(5.5)} y1={Y(10.25)} x2={X(5.5)} y2={Y(13)} />
      {/* ground */}
      <line x1="40" y1={GY} x2="960" y2={GY} strokeWidth="2.4" />
      <rect x="40" y={GY + 1} width="920" height="16" fill="url(#cb-hatch)" stroke="none" />
      <Tree x={X(-10)} base={GY} h={170} p={p} />
      <Tree x={X(9.6)} base={GY} h={130} p={p} />
      <g fontFamily="var(--font-mono), monospace" fontSize="11" fill={p.label} stroke="none">
        {levels.map((l) => (
          <text key={l} x={X(7.8)} y={Y(l) + 4}>
            +{l.toFixed(2)}
          </text>
        ))}
      </g>
    </g>
  );
}
