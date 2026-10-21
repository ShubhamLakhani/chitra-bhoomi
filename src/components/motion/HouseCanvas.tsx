"use client";

/**
 * Architecture in Motion — an original study model.
 *
 * A narrow, multi-storey urban residence in the language of the studio's
 * work (white planes, dark vertical louvers, glass balconies, timber
 * soffits, a stone fin). It is an interpretation, not a survey of any
 * specific building. Scroll progress (0–1) drives the camera path, the
 * layer "explode", the interior reveal, landscape growth and dusk.
 *
 * Units are metres. The front of the plot faces +Z, ground is y = 0.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";

type V3 = [number, number, number];

export type HouseCanvasProps = {
  progress: RefObject<number>;
  quality: "high" | "low";
  active: boolean;
  onReady: () => void;
};

export default function HouseCanvas({ progress, quality, active, onReady }: HouseCanvasProps) {
  return (
    <Canvas
      // PCF honours shadow.radius for a soft edge (PCFSoftShadowMap no longer exists in three)
      shadows="percentage"
      dpr={quality === "high" ? [1, 1.75] : [1, 1.35]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: 30, near: 0.5, far: 260, position: [21, 9, 36] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.05;
        onReady();
      }}
      aria-hidden
    >
      <Scene progress={progress} quality={quality} />
    </Canvas>
  );
}

/* ── Shared geometry & textures ───────────────────────────────────────── */

const UNIT = new THREE.BoxGeometry(1, 1, 1);
const UNIT_EDGES = new THREE.EdgesGeometry(UNIT);
const BLOB = new THREE.IcosahedronGeometry(1, 1);
const TRUNK = new THREE.CylinderGeometry(0.09, 0.13, 1, 7);
const CONE = new THREE.ConeGeometry(0.85, 2.6, 24, 1, true);
const DISC = new THREE.CylinderGeometry(0.07, 0.07, 0.03, 12);

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function makeTextures() {
  const rand = seeded(7);

  // Stone — random coursed blocks with grout
  const stone = document.createElement("canvas");
  stone.width = stone.height = 256;
  const s = stone.getContext("2d")!;
  s.fillStyle = "#857c70";
  s.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; ) {
    const h = 18 + rand() * 22;
    for (let x = -rand() * 40; x < 256; ) {
      const w = 26 + rand() * 54;
      const l = 66 + rand() * 14;
      s.fillStyle = `hsl(${32 + rand() * 10}, ${8 + rand() * 8}%, ${l}%)`;
      s.fillRect(x + 1.5, y + 1.5, w - 3, h - 3);
      x += w;
    }
    y += h;
  }
  const stoneTex = new THREE.CanvasTexture(stone);
  stoneTex.colorSpace = THREE.SRGBColorSpace;
  stoneTex.wrapS = stoneTex.wrapT = THREE.RepeatWrapping;
  stoneTex.anisotropy = 4;

  // Timber — fine grain stripes along U
  const wood = document.createElement("canvas");
  wood.width = 256;
  wood.height = 128;
  const w = wood.getContext("2d")!;
  w.fillStyle = "#a8774f";
  w.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 90; i++) {
    const y = rand() * 128;
    w.fillStyle = `rgba(${70 + rand() * 40},${40 + rand() * 20},${20 + rand() * 10},${0.08 + rand() * 0.18})`;
    w.fillRect(0, y, 256, 0.6 + rand() * 1.6);
  }
  for (let y = 0; y < 128; y += 16) {
    w.fillStyle = "rgba(40,24,12,0.35)";
    w.fillRect(0, y, 256, 1);
  }
  const woodTex = new THREE.CanvasTexture(wood);
  woodTex.colorSpace = THREE.SRGBColorSpace;
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;

  // Vertical fade for light cones (alpha map: white top → black bottom)
  const fade = document.createElement("canvas");
  fade.width = 4;
  fade.height = 128;
  const f = fade.getContext("2d")!;
  const g = f.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, "#fff");
  g.addColorStop(1, "#000");
  f.fillStyle = g;
  f.fillRect(0, 0, 4, 128);
  const fadeTex = new THREE.CanvasTexture(fade);

  return { stone: stoneTex, wood: woodTex, fade: fadeTex };
}

/** Box geometry whose UVs repeat every `tile` metres on every face. */
function tiledBox(w: number, h: number, d: number, tile: number) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  const faces: [number, number][] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let f = 0; f < 6; f++) {
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v;
      uv.setXY(i, (uv.getX(i) * faces[f][0]) / tile, (uv.getY(i) * faces[f][1]) / tile);
    }
  }
  uv.needsUpdate = true;
  return g;
}

function makeMaterials(tex: ReturnType<typeof makeTextures>) {
  const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(o);
  return {
    facade: {
      plaster: std({ color: "#f9f6f0", roughness: 0.85 }),
      charcoal: std({ color: "#2f2c29", roughness: 0.55, metalness: 0.2 }),
      timber: std({ map: tex.wood, roughness: 0.62 }),
      stone: std({ map: tex.stone, roughness: 0.95 }),
      leaf: std({ color: "#73805a", roughness: 0.85, flatShading: true }),
      glass: std({
        color: "#9fb4ba",
        roughness: 0.04,
        metalness: 0.35,
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
      }),
    },
    env: {
      plaster: std({ color: "#e8e2d8", roughness: 0.94 }),
      window: std({ color: "#323b3f", roughness: 0.1, metalness: 0.6 }),
      band: std({ color: "#d5cdc0", roughness: 0.9 }),
    },
    struct: {
      slab: std({ color: "#ddd5c8", roughness: 0.9 }),
      column: std({ color: "#d3cabd", roughness: 0.9 }),
      plinth: std({ map: tex.stone, color: "#d8d2c8", roughness: 1 }),
    },
    int: {
      soft: std({ color: "#dad1c4", roughness: 0.9 }),
      sofa: std({ color: "#8a8278", roughness: 0.95 }),
      dark: std({ color: "#3a3633", roughness: 0.6 }),
      accent: std({ color: "#c4521f", roughness: 0.7 }),
      timber: std({ color: "#a47a56", roughness: 0.6 }),
      bed: std({ color: "#eeebe5", roughness: 0.95 }),
    },
    land: {
      ground: std({ color: "#efeae1", roughness: 1 }),
      paving: std({ color: "#d3cabd", roughness: 0.95 }),
      lawn: std({ color: "#a2a983", roughness: 1 }),
      leaf: std({ color: "#6f7d55", roughness: 0.85, flatShading: true }),
      leaf2: std({ color: "#8a9767", roughness: 0.85, flatShading: true }),
      trunk: std({ color: "#655546", roughness: 0.9 }),
    },
    lamp: std({ color: "#fff1dc", emissive: "#ffc58a", emissiveIntensity: 0.15 }),
    cone: new THREE.MeshBasicMaterial({
      color: "#ffb76a",
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      alphaMap: tex.fade,
      side: THREE.DoubleSide,
    }),
    windowGlow: new THREE.MeshBasicMaterial({ color: "#ffc78c", transparent: true, opacity: 0, depthWrite: false }),
    edges: new THREE.LineBasicMaterial({ color: "#1c1a18", transparent: true, opacity: 0, depthWrite: false }),
  };
}
type Mats = ReturnType<typeof makeMaterials>;

/* ── Primitives ───────────────────────────────────────────────────────── */

function Box({
  a,
  b,
  m,
  edges,
  cast = true,
  receive = true,
}: {
  a: V3;
  b: V3;
  m: THREE.Material;
  edges?: THREE.Material;
  cast?: boolean;
  receive?: boolean;
}) {
  const pos: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  const scl: V3 = [Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2])];
  return (
    <group position={pos} scale={scl}>
      <mesh geometry={UNIT} material={m} castShadow={cast} receiveShadow={receive} />
      {edges && <lineSegments geometry={UNIT_EDGES} material={edges} />}
    </group>
  );
}

/** Box with real-size, tiled UVs — for stone and timber surfaces. */
function TBox({ a, b, m, tile = 1.2 }: { a: V3; b: V3; m: THREE.Material; tile?: number }) {
  const w = Math.abs(b[0] - a[0]);
  const h = Math.abs(b[1] - a[1]);
  const d = Math.abs(b[2] - a[2]);
  const geo = useMemo(() => tiledBox(w, h, d, tile), [w, h, d, tile]);
  return (
    <mesh
      geometry={geo}
      material={m}
      position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]}
      castShadow
      receiveShadow
    />
  );
}

/** Repeated members (louver fins, gate slats, pergola battens, stair treads). */
function Repeat({ count, at, size, m }: { count: number; at: (i: number) => V3; size: V3; m: THREE.Material }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      o.position.set(...at(i));
      o.scale.set(...size);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [count, at, size]);
  return <instancedMesh ref={ref} args={[UNIT, m, count]} castShadow receiveShadow />;
}

/* ── Camera path & chapter timing ─────────────────────────────────────── */

// Seven keyframes; the five chapters live between them.
const KEYS: { t: number; pos: V3; tgt: V3 }[] = [
  { t: 0.0, pos: [21, 9, 36], tgt: [0, 5.8, -4] }, // exterior, three-quarter
  { t: 0.2, pos: [-23, 4.6, 28], tgt: [-0.5, 6.2, -2] }, // around the facade, low
  { t: 0.34, pos: [15, 9.5, 19], tgt: [0.8, 7.2, -1] }, // louvers & balconies
  { t: 0.5, pos: [30, 23, 25], tgt: [0, 6, -3.5] }, // exploded axonometric
  { t: 0.67, pos: [3.5, 7.2, 23], tgt: [0, 5.6, -6] }, // into the interior
  { t: 0.83, pos: [-26, 13, 29], tgt: [0, 4.6, -4] }, // landscape
  { t: 1.0, pos: [20, 7, 37], tgt: [0, 5.8, -4] }, // the complete composition
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b);
const windowed = (a: number, b: number, c: number, d: number, x: number) => smooth(a, b, x) * (1 - smooth(c, d, x));

/** Scroll held on the opening view before the camera starts to move. */
const OPENING_HOLD = 0.06;

/** Maps scroll progress to a curve parameter that lingers at each keyframe. */
function pathParam(raw: number) {
  const p = KEYS[1].t * THREE.MathUtils.clamp((raw - OPENING_HOLD) / (KEYS[1].t - OPENING_HOLD), 0, 1) + Math.max(0, raw - KEYS[1].t);
  for (let i = 0; i < KEYS.length - 1; i++) {
    const k0 = KEYS[i].t;
    const k1 = KEYS[i + 1].t;
    if (p <= k1 || i === KEYS.length - 2) {
      const local = THREE.MathUtils.clamp((p - k0) / (k1 - k0), 0, 1);
      return (i + ease(local)) / (KEYS.length - 1);
    }
  }
  return 1;
}

function setOpacity(m: THREE.Material, o: number) {
  m.opacity = o;
  const t = o < 0.995;
  if (m.transparent !== t) {
    m.transparent = t;
    m.depthWrite = !t;
    m.needsUpdate = true;
  }
}

const IVORY = new THREE.Color("#f4f0e8");
const DUSK = new THREE.Color("#1c1a18");
const SUN_DAY = new THREE.Color("#fff4e6");
const SUN_DUSK = new THREE.Color("#ff9a5c");
const SKY_DAY = new THREE.Color("#f6f1e8");
const SKY_DUSK = new THREE.Color("#3b4250");
const SLAB = new THREE.Color("#ddd5c8");
const SLAB_DIAGRAM = new THREE.Color("#cbbfae");
const COLUMN = new THREE.Color("#d3cabd");
const COLUMN_DIAGRAM = new THREE.Color("#c4521f");

/* ── Scene ────────────────────────────────────────────────────────────── */

function Scene({ progress, quality }: { progress: RefObject<number>; quality: "high" | "low" }) {
  const { camera, scene, size } = useThree();
  const tex = useMemo(makeTextures, []);
  const m = useMemo(() => makeMaterials(tex), [tex]);

  const facade = useRef<THREE.Group>(null);
  const wallL = useRef<THREE.Group>(null);
  const wallR = useRef<THREE.Group>(null);
  const wallB = useRef<THREE.Group>(null);
  const interior = useRef<THREE.Group>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const warm = useRef<THREE.Group>(null);
  const trees = useRef<THREE.Group[]>([]);
  const p = useRef(0);

  const curves = useMemo(
    () => ({
      pos: new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.pos)), false, "centripetal"),
      tgt: new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.tgt)), false, "centripetal"),
    }),
    [],
  );
  const tmp = useMemo(() => ({ pos: new THREE.Vector3(), tgt: new THREE.Vector3(), bg: new THREE.Color() }), []);

  // Keep the house clear of the chapter captions: on wide screens shift the
  // frame so it sits right of centre; on portrait screens lift it upward.
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    if (aspect > 1.2) {
      cam.setViewOffset(size.width, size.height, -size.width * 0.09, 0, size.width, size.height);
    } else if (aspect < 0.9) {
      cam.setViewOffset(size.width, size.height, 0, size.height * 0.09, size.width, size.height);
    } else {
      cam.clearViewOffset();
    }
  }, [camera, size]);

  useLayoutEffect(() => {
    scene.background = tmp.bg.copy(IVORY);
    scene.fog = new THREE.Fog(IVORY.clone(), 38, 105);
  }, [scene, tmp]);

  const facadeMats = Object.values(m.facade).filter((x) => x !== m.facade.glass);
  const envMats = [m.env.plaster, m.env.window, m.env.band];
  const intMats = Object.values(m.int);

  useFrame((_, dt) => {
    // Ease toward the scroll position so motion stays fluid on any input.
    p.current = THREE.MathUtils.damp(p.current, progress.current ?? 0, 4.5, Math.min(dt, 0.1));
    const t = p.current;

    // Camera — pull back on tall/narrow screens so the house stays framed.
    const u = pathParam(t);
    curves.pos.getPoint(u, tmp.pos);
    curves.tgt.getPoint(u, tmp.tgt);
    const aspect = size.width / Math.max(size.height, 1);
    const fit = aspect < 1.25 ? Math.pow(1.25 / aspect, 0.6) : 1;
    tmp.pos.sub(tmp.tgt).multiplyScalar(fit).add(tmp.tgt);
    const fog = scene.fog as THREE.Fog;
    fog.near = 38 * fit;
    fog.far = 105 * fit;
    camera.position.copy(tmp.pos);
    camera.lookAt(tmp.tgt);

    // 03 Structure — facade lifts away, envelope opens, linework appears
    const explode = windowed(0.36, 0.47, 0.77, 0.85, t);
    const open = windowed(0.39, 0.5, 0.76, 0.84, t);
    if (facade.current) {
      facade.current.position.set(0, explode * 1.4, explode * 6.5);
      facade.current.visible = explode < 0.97;
    }
    facadeMats.forEach((mat) => setOpacity(mat, 1 - explode));
    m.facade.glass.opacity = 0.32 * (1 - explode);
    if (wallL.current) wallL.current.position.x = -open * 3.2;
    if (wallR.current) wallR.current.position.x = open * 3.2;
    if (wallB.current) wallB.current.position.z = -open * 3.2;
    envMats.forEach((mat) => setOpacity(mat, 1 - open * 0.93));
    const diagram = windowed(0.38, 0.48, 0.6, 0.7, t);
    m.edges.opacity = windowed(0.37, 0.47, 0.78, 0.86, t) * 0.7;
    m.struct.slab.color.lerpColors(SLAB, SLAB_DIAGRAM, diagram);
    m.struct.column.color.lerpColors(COLUMN, COLUMN_DIAGRAM, diagram * 0.85);

    // 04 Interior
    const inside = smooth(0.54, 0.65, t);
    if (interior.current) interior.current.visible = inside > 0.01;
    intMats.forEach((mat) => setOpacity(mat, inside));

    // 05 Landscape — trees grow in a gentle stagger
    const grow = smooth(0.66, 0.84, t);
    trees.current.forEach((g, i) => {
      if (!g) return;
      const local = THREE.MathUtils.clamp((grow - i * 0.06) / 0.55, 0, 1);
      const s = local === 0 ? 0.0001 : 1 - Math.pow(1 - local, 3);
      g.scale.setScalar(s * (g.userData.size ?? 1));
      g.visible = local > 0;
    });

    // Dusk — sky darkens, sun drops and warms, architectural lighting comes up
    const dusk = smooth(0.8, 0.96, t);
    tmp.bg.lerpColors(IVORY, DUSK, dusk);
    fog.color.copy(tmp.bg);
    scene.environmentIntensity = THREE.MathUtils.lerp(1, 0.22, dusk);
    if (sun.current) {
      sun.current.intensity = THREE.MathUtils.lerp(2.6, 0.18, dusk);
      sun.current.color.lerpColors(SUN_DAY, SUN_DUSK, dusk);
    }
    if (hemi.current) {
      hemi.current.intensity = THREE.MathUtils.lerp(0.85, 0.22, dusk);
      hemi.current.color.lerpColors(SKY_DAY, SKY_DUSK, dusk);
    }
    m.lamp.emissiveIntensity = THREE.MathUtils.lerp(0.15, 3.2, dusk);
    m.cone.opacity = dusk * 0.2;
    m.windowGlow.opacity = dusk * 0.85;
    if (warm.current) {
      warm.current.visible = dusk > 0.02;
      warm.current.children.forEach((l) => ((l as THREE.PointLight).intensity = dusk * (l.userData.peak ?? 8)));
    }
  });

  const registerTree = (i: number) => (g: THREE.Group | null) => {
    if (g) trees.current[i] = g;
  };

  const hi = quality === "high";

  return (
    <>
      <hemisphereLight ref={hemi} args={["#f6f1e8", "#cfc5b6", 1]} />
      <directionalLight
        ref={sun}
        position={[14, 22, 16]}
        intensity={2.3}
        castShadow
        shadow-mapSize={hi ? [2048, 2048] : [1024, 1024]}
        shadow-radius={hi ? 5 : 3}
        shadow-blurSamples={hi ? 12 : 8}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={20}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={70}
      />
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={1.4} position={[0, 6, 10]} scale={[20, 6, 1]} color="#fff6ea" />
        <Lightformer intensity={0.8} position={[-10, 3, -4]} rotation-y={Math.PI / 2} scale={[20, 4, 1]} color="#e9eef2" />
        <Lightformer intensity={0.5} position={[10, 3, -4]} rotation-y={-Math.PI / 2} scale={[20, 4, 1]} color="#ffe9d2" />
      </Environment>

      <Ground m={m} />
      <Structure m={m} />
      <group ref={wallL}>
        <Box a={[-4, 0.45, -12]} b={[-3.7, 11.45, -1.2]} m={m.env.plaster} edges={m.edges} />
        {[3.55, 6.8, 10.05].map((y) => (
          <Box key={y} a={[-4.03, y, -12]} b={[-4, y + 0.06, -1.2]} m={m.env.band} cast={false} />
        ))}
      </group>
      <group ref={wallR}>
        <Box a={[3.7, 0.45, -12]} b={[4, 11.45, -1.2]} m={m.env.plaster} edges={m.edges} />
        {[3.55, 6.8, 10.05].map((y) => (
          <Box key={y} a={[4, y, -12]} b={[4.03, y + 0.06, -1.2]} m={m.env.band} cast={false} />
        ))}
        {/* stair-head room on the terrace */}
        <Box a={[1.8, 10.25, -7]} b={[4, 13.2, -1.2]} m={m.env.plaster} edges={m.edges} />
      </group>
      <group ref={wallB}>
        <Box a={[-3.7, 0.45, -12]} b={[3.7, 11.45, -11.7]} m={m.env.plaster} edges={m.edges} />
        {[4.6, 7.9].map((y) => (
          <Box key={y} a={[-2.6, y, -12.05]} b={[0.6, y + 1.6, -11.95]} m={m.env.window} />
        ))}
      </group>
      <FrontEnvelope m={m} />
      <group ref={interior}>
        <Interior m={m} />
      </group>
      <group ref={facade}>
        <Facade m={m} />
      </group>
      <Lamps m={m} />
      <Landscape m={m} register={registerTree} />

      <group ref={warm} visible={false}>
        <pointLight position={[-0.8, 2.6, 0.6]} distance={9} decay={2} userData={{ peak: 9 }} color="#ffc287" />
        <pointLight position={[-3.1, 0.6, 1.6]} distance={8} decay={2} userData={{ peak: 6 }} color="#ffc287" />
        <pointLight position={[-0.8, 5.6, -0.4]} distance={8} decay={2} userData={{ peak: 5 }} color="#ffc287" />
        <pointLight position={[2.8, 1.2, 1.8]} distance={7} decay={2} userData={{ peak: 5 }} color="#ffc287" />
      </group>
    </>
  );
}

/* ── Model parts ──────────────────────────────────────────────────────── */

function Ground({ m }: { m: Mats }) {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -4]} receiveShadow material={m.land.ground}>
        <planeGeometry args={[260, 260]} />
      </mesh>
      {/* driveway, side lawns, street edge */}
      <Box a={[-2.8, 0, -1.2]} b={[2.4, 0.04, 5.5]} m={m.land.paving} cast={false} />
      <Box a={[-11, 0, -14]} b={[-4.6, 0.03, 4.8]} m={m.land.lawn} cast={false} />
      <Box a={[4.6, 0, -14]} b={[11, 0.03, 4.8]} m={m.land.lawn} cast={false} />
      <Box a={[-14, 0, 6.2]} b={[14, 0.02, 9.5]} m={m.land.paving} cast={false} />
    </group>
  );
}

function Structure({ m }: { m: Mats }) {
  const slabs = [3.55, 6.8, 10.05];
  const cols: [number, number][] = [];
  [-3.5, 3.5].forEach((x) => [-1.45, -6.5, -11.5].forEach((z) => cols.push([x, z])));
  return (
    <group>
      <TBox a={[-4.6, 0, -12.6]} b={[4.6, 0.45, -1.2]} m={m.struct.plinth} tile={1.4} />
      {slabs.map((y) => (
        <Box key={y} a={[-3.7, y, -12]} b={[3.7, y + 0.2, -1.2]} m={m.struct.slab} edges={m.edges} />
      ))}
      {cols.map(([x, z]) => (
        <Box key={`${x}${z}`} a={[x - 0.15, 0.45, z - 0.15]} b={[x + 0.15, 10.05, z + 0.15]} m={m.struct.column} edges={m.edges} />
      ))}
    </group>
  );
}

/** Walls on the front line that stay with the building when the facade lifts. */
function FrontEnvelope({ m }: { m: Mats }) {
  return (
    <group>
      {/* ground floor wall around the entrance */}
      <Box a={[1.6, 0.45, -1.4]} b={[2.2, 3.55, -1.2]} m={m.env.plaster} edges={m.edges} />
      <Box a={[3.4, 0.45, -1.4]} b={[3.7, 3.55, -1.2]} m={m.env.plaster} edges={m.edges} />
      <Box a={[2.2, 3.1, -1.4]} b={[3.4, 3.55, -1.2]} m={m.env.plaster} edges={m.edges} />
      {/* back of the car porch */}
      <Box a={[-3.7, 0.45, -6.4]} b={[1.6, 3.55, -6.2]} m={m.env.plaster} edges={m.edges} />
      {/* upper floors behind the louver screen */}
      {[3.75, 7.0].map((y) => (
        <group key={y}>
          <Box a={[1.6, y, -1.4]} b={[3.7, y + 0.6, -1.2]} m={m.env.plaster} edges={m.edges} />
          <Box a={[1.6, y + 0.6, -1.4]} b={[1.9, y + 3.05, -1.2]} m={m.env.plaster} />
          <Box a={[1.9, y + 0.6, -1.36]} b={[3.4, y + 2.7, -1.24]} m={m.env.window} />
          <Box a={[3.4, y + 0.6, -1.4]} b={[3.7, y + 3.05, -1.2]} m={m.env.plaster} />
          <Box a={[1.9, y + 2.7, -1.4]} b={[3.4, y + 3.05, -1.2]} m={m.env.plaster} />
        </group>
      ))}
      {/* terrace parapet */}
      <Box a={[-3.7, 10.25, -12]} b={[-3.5, 11.25, -1.2]} m={m.env.plaster} />
      <Box a={[-3.7, 10.25, -12]} b={[1.8, 11.25, -11.8]} m={m.env.plaster} />
    </group>
  );
}

function Facade({ m }: { m: Mats }) {
  const f = m.facade;
  const fins = useMemo(() => (i: number): V3 => [1.92 + i * 0.235, 7.6, 0.05], []);
  const slats = useMemo(() => (i: number): V3 => [-2.7 + i * 0.13, 1.05, 3.2], []);
  const battens = useMemo(() => (i: number): V3 => [-3.0 + i * 0.3, 13.0, -1.8], []);
  return (
    <group>
      {/* stone fin running the full height */}
      <TBox a={[-4, 0, -1.2]} b={[-3.2, 12, 0.9]} m={f.stone} />

      {/* white picture frame around the first and second floors */}
      <Box a={[-3.2, 10.0, -1.2]} b={[1.6, 10.4, 0.7]} m={f.plaster} />
      <Box a={[-3.2, 3.75, -1.2]} b={[-2.85, 10.0, 0.7]} m={f.plaster} />
      <Box a={[1.25, 3.75, -1.2]} b={[1.6, 10.0, 0.7]} m={f.plaster} />
      <Box a={[-3.2, 3.35, -1.2]} b={[1.6, 3.75, 0.7]} m={f.plaster} />

      {/* timber soffits */}
      <TBox a={[-3.2, 3.25, -1.2]} b={[1.6, 3.35, 0.7]} m={f.timber} tile={1.6} />
      <TBox a={[-2.85, 9.9, -1.2]} b={[1.25, 10.0, 0.7]} m={f.timber} tile={1.6} />
      <TBox a={[-2.85, 6.7, -1.2]} b={[1.25, 6.8, 0.25]} m={f.timber} tile={1.6} />

      {/* second-floor balcony slab */}
      <Box a={[-2.85, 6.8, -1.2]} b={[1.25, 7.0, 0.25]} m={f.plaster} />

      {/* glazing — sliding doors behind the balconies */}
      {[3.75, 7.0].map((y) => (
        <group key={y}>
          <Box a={[-2.85, y, -1.3]} b={[1.25, y + 2.9, -1.26]} m={f.glass} cast={false} />
          {[-2.85, -1.82, -0.8, 0.22, 1.2].map((x) => (
            <Box key={x} a={[x, y, -1.32]} b={[x + 0.05, y + 2.9, -1.24]} m={f.charcoal} />
          ))}
          <Box a={[-2.85, y + 2.85, -1.32]} b={[1.25, y + 2.9, -1.24]} m={f.charcoal} />
        </group>
      ))}

      {/* glass balustrades with slim charcoal handrails */}
      <Box a={[-2.85, 3.75, 0.58]} b={[1.25, 4.8, 0.62]} m={f.glass} cast={false} />
      <Box a={[-2.85, 4.8, 0.55]} b={[1.25, 4.85, 0.65]} m={f.charcoal} />
      <Box a={[-2.85, 7.0, 0.13]} b={[1.25, 8.05, 0.17]} m={f.glass} cast={false} />
      <Box a={[-2.85, 8.05, 0.1]} b={[1.25, 8.1, 0.2]} m={f.charcoal} />
      <Box a={[-3.2, 10.4, 0.58]} b={[1.6, 11.3, 0.62]} m={f.glass} cast={false} />

      {/* vertical louver screen */}
      <Repeat count={8} at={fins} size={[0.06, 7.7, 0.22]} m={f.charcoal} />
      <Box a={[1.75, 11.45, -1.2]} b={[3.75, 11.6, 0.25]} m={f.charcoal} />
      <Box a={[1.75, 3.65, -1.2]} b={[3.75, 3.75, 0.25]} m={f.charcoal} />

      {/* entrance door */}
      <TBox a={[2.2, 0.45, -1.32]} b={[3.4, 3.1, -1.22]} m={f.timber} tile={1} />

      {/* compound wall + slatted gate */}
      <TBox a={[-4.6, 0, 3.1]} b={[-2.8, 1.3, 3.3]} m={f.stone} />
      <TBox a={[2.4, 0, 3.1]} b={[4.6, 1.3, 3.3]} m={f.stone} />
      <Repeat count={40} at={slats} size={[0.05, 2.0, 0.06]} m={f.charcoal} />
      <Box a={[-2.8, 2.0, 3.15]} b={[2.4, 2.08, 3.25]} m={f.charcoal} />

      {/* terrace planter and the hedge behind the compound wall */}
      <Box a={[-2.9, 10.25, -0.1]} b={[1.2, 10.6, 0.45]} m={f.timber} />
      {FACADE_SHRUBS.map((s, k) => (
        <mesh key={k} geometry={BLOB} material={f.leaf} position={s} scale={[0.34, 0.3, 0.34]} castShadow />
      ))}

      {/* terrace pergola */}
      <Repeat count={16} at={battens} size={[0.06, 0.22, 4.6]} m={f.charcoal} />
      <Box a={[-3.1, 10.4, 0.3]} b={[-2.95, 12.9, 0.45]} m={f.charcoal} />
      <Box a={[1.3, 10.4, 0.3]} b={[1.45, 12.9, 0.45]} m={f.charcoal} />
    </group>
  );
}

function Lamps({ m }: { m: Mats }) {
  // Downlights in the timber soffits with soft light cones beneath them
  const spots: V3[] = [];
  [-2.3, -0.7, 0.9].forEach((x) => {
    spots.push([x, 3.24, -0.3]);
    spots.push([x, 6.69, -0.5]);
    spots.push([x, 9.89, -0.3]);
  });
  return (
    <group>
      {spots.map((s) => (
        <group key={s.join()}>
          <mesh geometry={DISC} material={m.lamp} position={s} />
          <mesh geometry={CONE} material={m.cone} position={[s[0], s[1] - 1.3, s[2]]} />
        </group>
      ))}
      {/* interior warmth behind the glass at dusk */}
      {[3.75, 7.0].map((y) => (
        <mesh key={y} material={m.windowGlow} position={[-0.8, y + 1.45, -1.5]}>
          <planeGeometry args={[4.1, 2.9]} />
        </mesh>
      ))}
      <mesh material={m.windowGlow} position={[2.65, 1.8, -6.1]}>
        <planeGeometry args={[1.6, 2.4]} />
      </mesh>
    </group>
  );
}

function Interior({ m }: { m: Mats }) {
  const i = m.int;
  const treads = useMemo(
    () =>
      (k: number): V3 => {
        const flight = Math.floor(k / 18);
        const step = k % 18;
        const base = [0.45, 3.75, 7.0][flight];
        return [2.75, base + (step + 0.5) * 0.18, -6.7 - (step + 0.5) * 0.25];
      },
    [],
  );
  return (
    <group>
      {/* stair — three stacked flights against the right party wall */}
      <Repeat count={54} at={treads} size={[1.6, 0.18, 0.27]} m={i.timber} />
      {[0.45, 3.75, 7.0].map((y) => (
        <Box key={y} a={[1.85, y, -11.7]} b={[1.95, y + 3.1, -6.4]} m={i.soft} />
      ))}

      {/* ground floor: dining at the back */}
      <Box a={[-2.6, 0.45, -9.6]} b={[0.2, 1.2, -8.6]} m={i.timber} />
      <Box a={[-3.5, 0.45, -11.7]} b={[0.6, 2.4, -11.1]} m={i.soft} />

      {/* first floor: living */}
      <group position={[0, 3.75, 0]}>
        <Box a={[-3.3, 0, -4.6]} b={[0.4, 0.42, -3.7]} m={i.sofa} />
        <Box a={[-3.3, 0.42, -4.6]} b={[0.4, 0.85, -4.35]} m={i.sofa} />
        <Box a={[-3.3, 0, -3.7]} b={[-2.4, 0.42, -2.2]} m={i.sofa} />
        <Box a={[-1.8, 0, -3.2]} b={[-0.4, 0.36, -2.4]} m={i.dark} />
        <Box a={[-3.6, 0, -6.2]} b={[1.7, 0.02, -2.0]} m={i.soft} cast={false} />
        <Box a={[0.4, 0, -1.9]} b={[1.0, 0.75, -1.5]} m={i.accent} />
        {/* kitchen island + back counter */}
        <Box a={[-2.6, 0, -9.4]} b={[0.4, 0.9, -8.5]} m={i.bed} />
        <Box a={[-3.6, 0, -11.7]} b={[0.8, 0.9, -11.1]} m={i.dark} />
        <Box a={[-3.6, 1.5, -11.7]} b={[0.8, 2.3, -11.35]} m={i.timber} />
        {/* partition with a timber-clad face */}
        <Box a={[-3.7, 0, -6.6]} b={[0.4, 3.05, -6.45]} m={i.timber} />
      </group>

      {/* second floor: bedroom */}
      <group position={[0, 7.0, 0]}>
        <Box a={[-3.4, 0, -4.9]} b={[0.3, 2.4, -4.75]} m={i.timber} />
        <Box a={[-2.6, 0, -4.75]} b={[-0.6, 0.45, -2.6]} m={i.bed} />
        <Box a={[-2.6, 0.45, -3.3]} b={[-0.6, 0.55, -2.6]} m={i.accent} />
        <Box a={[-3.2, 0, -4.75]} b={[-2.75, 0.5, -4.3]} m={i.dark} />
        <Box a={[-0.45, 0, -4.75]} b={[0, 0.5, -4.3]} m={i.dark} />
        <Box a={[-3.65, 0, -9.5]} b={[-3.05, 2.6, -5.4]} m={i.soft} />
        <Box a={[0.8, 0, -3.6]} b={[1.3, 0.75, -2.4]} m={i.sofa} />
      </group>
    </group>
  );
}

function Tree({
  at,
  size = 1,
  m,
  columnar = false,
  register,
}: {
  at: V3;
  size?: number;
  m: Mats;
  columnar?: boolean;
  register: (g: THREE.Group | null) => void;
}) {
  const blobs: { p: V3; s: V3; alt?: boolean }[] = columnar
    ? [
        { p: [0, 3.2, 0], s: [0.9, 2.2, 0.9] },
        { p: [0.1, 4.8, 0.05], s: [0.65, 1.3, 0.65], alt: true },
      ]
    : [
        { p: [0, 4.2, 0], s: [1.9, 1.5, 1.9] },
        { p: [1.1, 3.6, 0.4], s: [1.3, 1.1, 1.3], alt: true },
        { p: [-1.0, 3.7, -0.3], s: [1.4, 1.1, 1.4] },
        { p: [0.2, 5.1, -0.2], s: [1.1, 0.9, 1.1], alt: true },
      ];
  return (
    <group ref={register} position={at} userData={{ size }} visible={false}>
      <mesh geometry={TRUNK} material={m.land.trunk} position={[0, 1.6, 0]} scale={[1, 3.2, 1]} castShadow />
      {blobs.map((b, k) => (
        <mesh
          key={k}
          geometry={BLOB}
          material={b.alt ? m.land.leaf2 : m.land.leaf}
          position={b.p}
          scale={b.s}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

const FACADE_SHRUBS: V3[] = (() => {
  const out: V3[] = [];
  for (let x = -4.4; x <= -3.0; x += 0.45) out.push([x, 0.35, 2.6]);
  for (let x = 2.6; x <= 4.4; x += 0.45) out.push([x, 0.35, 2.6]);
  for (let x = -2.6; x <= 1.0; x += 0.5) out.push([x, 10.75, 0.15]);
  return out;
})();

function Landscape({ m, register }: { m: Mats; register: (i: number) => (g: THREE.Group | null) => void }) {
  return (
    <group>
      <Tree at={[-6.6, 0, 1.6]} size={1.15} m={m} register={register(0)} />
      <Tree at={[6.9, 0, 0.8]} size={0.95} m={m} register={register(1)} />
      <Tree at={[-7.6, 0, -6]} size={1.3} m={m} register={register(2)} />
      <Tree at={[7.6, 0, -8]} size={1.1} m={m} columnar register={register(3)} />
      <Tree at={[5.6, 0, 4.4]} size={0.8} m={m} columnar register={register(4)} />
      <Tree at={[-5.6, 0, 5.2]} size={0.7} m={m} register={register(5)} />
    </group>
  );
}
