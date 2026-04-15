import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, useTexture } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

function DistortImageMesh({ url }: { url: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  const [hover, setHover] = useState(false);
  const { viewport } = useThree();

  const w = texture.image.width;
  const h = texture.image.height;
  const aspect = w / h;

  const maxW = viewport.width * 0.85;
  const maxH = viewport.height * 0.85;
  let width = maxW;
  let height = width / aspect;
  if (height > maxH) {
    height = maxH;
    width = height * aspect;
  }

  useFrame((state) => {
    const m = meshRef.current;
    if (!m) return;
    const px = state.pointer.x;
    const py = state.pointer.y;
    const tiltX = THREE.MathUtils.lerp(m.rotation.x, -py * 0.18, 0.08);
    const tiltY = THREE.MathUtils.lerp(m.rotation.y, px * 0.22, 0.08);
    m.rotation.x = tiltX;
    m.rotation.y = tiltY;
    const targetZ = hover ? 0.35 : 0;
    m.position.z = THREE.MathUtils.lerp(m.position.z, targetZ, 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <planeGeometry args={[width, height, 96, 96]} />
      <MeshDistortMaterial
        map={texture}
        roughness={0.4}
        metalness={0.06}
        distort={hover ? 0.55 : 0.14}
        speed={hover ? 4.2 : 1.4}
        radius={0.85}
      />
    </mesh>
  );
}

function Fallback() {
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial color="#1a1a1a" />
    </mesh>
  );
}

export function DistortImageCanvas({ imageUrl }: { imageUrl: string }) {
  return (
    <Canvas
      className="distort-canvas"
      camera={{ position: [0, 0, 5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 6]} intensity={1.35} />
      <directionalLight position={[-4, -2, 4]} intensity={0.35} color="#c8ff00" />
      <Suspense fallback={<Fallback />}>
        <DistortImageMesh url={imageUrl} />
      </Suspense>
    </Canvas>
  );
}
