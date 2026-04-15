import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const STRIPS = 7;

function createProceduralHelmetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const s = 1024;
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, s, s);

  const cx = s * 0.5;
  const cy = s * 0.38;

  ctx.fillStyle = "#ffd505";
  ctx.beginPath();
  ctx.ellipse(cx, cy, s * 0.27, s * 0.31, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0a0a0a";
  for (let i = 0; i < 55; i++) {
    ctx.beginPath();
    ctx.arc(
      cx + (Math.random() - 0.5) * s * 0.45,
      cy + (Math.random() - 0.5) * s * 0.48,
      Math.random() * 10 + 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.fillStyle = "#0d0d0d";
  ctx.beginPath();
  ctx.ellipse(cx, cy + s * 0.04, s * 0.2, s * 0.045, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffd505";
  ctx.beginPath();
  ctx.ellipse(cx, cy + s * 0.14, s * 0.18, s * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function cloneStripTexture(
  base: THREE.Texture,
  stripIndex: number,
  total: number
): THREE.Texture {
  const t = base.clone();
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.repeat.set(1, 1 / total);
  t.offset.set(0, stripIndex / total);
  t.needsUpdate = true;
  return t;
}

function HelmetStrip({
  texture,
  width,
  height,
  stripIndex,
  total,
  intro,
}: {
  texture: THREE.Texture;
  width: number;
  height: number;
  stripIndex: number;
  total: number;
  intro: React.MutableRefObject<number>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const map = useMemo(
    () => cloneStripTexture(texture, stripIndex, total),
    [texture, stripIndex, total]
  );

  useEffect(() => {
    return () => {
      map.dispose();
    };
  }, [map]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const p = intro.current;
    const phase = stripIndex * 0.65;
    m.position.z =
      THREE.MathUtils.lerp(0.28, 0.018 * stripIndex, p) +
      Math.sin(t * 1.15 + phase) * 0.014 * p;
    m.position.x = Math.sin(t * 0.85 + phase) * 0.012 * p;
  });

  return (
    <mesh ref={mesh} position={[0, 0, stripIndex * 0.003]}>
      <planeGeometry args={[width, height, 1, 1]} />
      <meshStandardMaterial
        map={map}
        transparent
        alphaTest={0.08}
        side={THREE.DoubleSide}
        roughness={0.42}
        metalness={0.12}
      />
    </mesh>
  );
}

function HelmetSceneContent({
  aspect,
  helmetTexture,
}: {
  aspect: number;
  helmetTexture: THREE.Texture;
}) {
  const group = useRef<THREE.Group>(null);
  const intro = useRef(0);
  const { viewport } = useThree();

  const { w, h } = useMemo(() => {
    const maxW = viewport.width * 0.92;
    const maxH = viewport.height * 0.92;
    let width = maxW;
    let height = width / aspect;
    if (height > maxH) {
      height = maxH;
      width = height * aspect;
    }
    return { w: width, h: height };
  }, [viewport.width, viewport.height, aspect]);

  useFrame((state, delta) => {
    intro.current = THREE.MathUtils.damp(intro.current, 1, 2.4, delta);
    const g = group.current;
    if (!g) return;
    const px = state.pointer.x;
    const py = state.pointer.y;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, px * 0.2, 0.07);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -py * 0.14, 0.07);
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 8]} intensity={1.15} />
      <directionalLight position={[-3, -2, 4]} intensity={0.38} color="#fff8e0" />
      {Array.from({ length: STRIPS }, (_, i) => (
        <HelmetStrip
          key={`${helmetTexture.uuid}-${i}`}
          texture={helmetTexture}
          width={w}
          height={h}
          stripIndex={i}
          total={STRIPS}
          intro={intro}
        />
      ))}
    </group>
  );
}

function HelmetScene({ aspect }: { aspect: number }) {
  const [helmetTexture, setHelmetTexture] = useState<THREE.Texture>(
    () => createProceduralHelmetTexture()
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let cancelled = false;
    loader.load(
      "/images/helmet-overlay.png",
      (tex) => {
        if (cancelled) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        setHelmetTexture(tex);
      },
      undefined,
      () => {}
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return <HelmetSceneContent aspect={aspect} helmetTexture={helmetTexture} />;
}

function CanvasFallback() {
  return null;
}

export type HelmetHeroProps = {
  portraitUrl: string;
  portraitAlt?: string;
};

export function HelmetHero({ portraitUrl, portraitAlt = "" }: HelmetHeroProps) {
  const [aspect, setAspect] = useState(0.75);

  return (
    <div className="helmet-hero-stage">
      <img
        src={portraitUrl}
        alt={portraitAlt}
        className="helmet-hero-portrait"
        draggable={false}
        onLoad={(e) => {
          const el = e.currentTarget;
          setAspect(el.naturalWidth / el.naturalHeight);
        }}
      />
      <div className="helmet-hero-canvas" aria-hidden>
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 42 }}
          gl={{
            alpha: true,
            antialias: true,
            premultipliedAlpha: false,
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={<CanvasFallback />}>
            <HelmetScene aspect={aspect} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
