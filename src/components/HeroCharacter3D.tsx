// @ts-nocheck
import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  MeshTransmissionMaterial,
  Environment,
} from '@react-three/drei';
import * as THREE from 'three';

// ── smooth mouse lerp helper ──────────────────────────

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ── biomechanical crystal base ────────────────────────

function BiomechBase() {
  const mainRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mainRef.current) {
      mainRef.current.rotation.y = Math.sin(t * 0.2) * 0.15;
      mainRef.current.rotation.x = Math.sin(t * 0.15) * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.15;
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <group position={[0, -1.9, 0]}>
      {/* Main crystal */}
      <mesh ref={mainRef} scale={[0.85, 0.6, 0.85]}>
        <icosahedronGeometry args={[0.9, 2]} />
        <MeshTransmissionMaterial
          transmission={0.92}
          thickness={0.8}
          roughness={0.08}
          ior={1.4}
          chromaticAberration={0.06}
          anisotropy={0.25}
          distortion={0.15}
          distortionScale={0.4}
          temporalDistortion={0.08}
          color="#4dd0e1"
          background={new THREE.Color('#020817')}
        />
      </mesh>

      {/* Energy ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[0.85, 0.03, 16, 80]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00b8d4"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Organic tendrils */}
      {[0, Math.PI / 3, -Math.PI / 3, Math.PI * 0.7].map((angle, i) => {
        const curve = useMemo(() => {
          const r = 0.55;
          const startY = 0.15;
          const endY = 1.1;
          const sx = Math.cos(angle) * r;
          const sz = Math.sin(angle) * r;
          const mx = Math.cos(angle) * r * 0.5;
          const mz = Math.sin(angle) * r * 0.5;
          return new THREE.CatmullRomCurve3([
            new THREE.Vector3(sx, startY, sz),
            new THREE.Vector3(mx + (Math.random() - 0.5) * 0.3, startY + 0.45, mz + (Math.random() - 0.5) * 0.3),
            new THREE.Vector3(0, endY, 0),
          ]);
        }, [angle]);

        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 20, 0.018, 8, false]} />
            <meshStandardMaterial
              color="#80deea"
              emissive="#4dd0e1"
              emissiveIntensity={0.6}
              roughness={0.3}
              metalness={0.2}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}

      {/* Floating crystal shards */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.1 + Math.random() * 0.4;
        const yOffset = (Math.random() - 0.5) * 0.8;
        const size = 0.06 + Math.random() * 0.1;
        const speed = 0.3 + Math.random() * 0.5;

        return (
          <CrystalShard
            key={i}
            baseAngle={angle}
            radius={radius}
            yOffset={yOffset}
            size={size}
            speed={speed}
          />
        );
      })}
    </group>
  );
}

function CrystalShard({ baseAngle, radius, yOffset, size, speed }: {
  baseAngle: number; radius: number; yOffset: number; size: number; speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const angle = baseAngle + t * speed;
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
    ref.current.position.y = yOffset + Math.sin(t * 0.8 + baseAngle) * 0.2;
    ref.current.rotation.x += 0.005;
    ref.current.rotation.y += 0.008;
  });

  return (
    <mesh ref={ref} scale={size}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#b2ebf2"
        emissive="#4dd0e1"
        emissiveIntensity={0.8}
        roughness={0.15}
        metalness={0.1}
      />
    </mesh>
  );
}

// ── character head ────────────────────────────────────

function CharacterHead() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.06;
      groupRef.current.rotation.x = Math.sin(t * 0.25) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.65, 0]}>
      {/* Head base — egg shaped for anime proportion */}
      <mesh position={[0, 0, 0]} scale={[0.7, 0.82, 0.68]}>
        <sphereGeometry args={[0.52, 48, 48]} />
        <meshStandardMaterial color="#f5e1d4" roughness={0.55} metalness={0} />
      </mesh>

      {/* Jaw */}
      <mesh position={[0, -0.15, 0.28]} scale={[0.58, 0.1, 0.12]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#f0dccf" roughness={0.5} metalness={0} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, -0.02, 0.48]} scale={[0.08, 0.1, 0.06]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#f2ded2" roughness={0.5} metalness={0} />
      </mesh>

      {/* Eyes */}
      {[-0.16, 0.16].map((x, i) => (
        <group key={i} position={[x, 0.05, 0.42]}>
          <mesh scale={[0.1, 0.06, 0.02]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <meshStandardMaterial color="#2a1f1a" roughness={0.3} metalness={0} />
          </mesh>
          <mesh position={[0, 0.05, -0.02]} scale={[0.09, 0.015, 0.01]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#3a2a20" roughness={0.4} metalness={0} />
          </mesh>
        </group>
      ))}

      {/* Mouth */}
      <mesh position={[0, -0.18, 0.42]} scale={[0.12, 0.015, 0.01]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d4a99a" roughness={0.4} metalness={0} />
      </mesh>

      {/* Ears */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 0.42, 0.02, 0]} rotation={[0, 0, side * 0.2]} scale={[0.08, 0.18, 0.06]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#f0dacb" roughness={0.5} metalness={0} />
        </mesh>
      ))}

      {/* Earring */}
      <group position={[-0.46, -0.08, 0.04]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.06, 0.012, 8, 16]} />
          <meshStandardMaterial color="#ffd700" roughness={0.15} metalness={0.95} />
        </mesh>
      </group>

      <Hair />
    </group>
  );
}

function Hair() {
  const strands = useMemo(() => {
    const result: { pos: [number, number, number]; rot: [number, number, number]; scale: [number, number, number] }[] = [];

    for (let i = 0; i < 30; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.4;
      const r = 0.52 + Math.random() * 0.08;
      result.push({
        pos: [Math.sin(phi) * Math.cos(theta) * r, Math.cos(phi) * r + 0.02, Math.sin(phi) * Math.sin(theta) * r],
        rot: [(Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, Math.random() * Math.PI],
        scale: [0.03 + Math.random() * 0.06, 0.08 + Math.random() * 0.2, 0.02 + Math.random() * 0.05],
      });
    }

    for (let i = 0; i < 20; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const y = -0.1 + Math.random() * 0.35;
      result.push({
        pos: [side * (0.44 + Math.random() * 0.12), y, (Math.random() - 0.5) * 0.2],
        rot: [0, side * (0.3 + Math.random() * 0.5), (Math.random() - 0.5) * 0.5],
        scale: [0.02 + Math.random() * 0.04, 0.06 + Math.random() * 0.18, 0.015 + Math.random() * 0.04],
      });
    }

    for (let i = 0; i < 15; i++) {
      result.push({
        pos: [-0.2 + Math.random() * 0.4, 0.35 + Math.random() * 0.08, 0.4 + Math.random() * 0.06],
        rot: [0.3 + Math.random() * 0.3, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3],
        scale: [0.03 + Math.random() * 0.07, 0.06 + Math.random() * 0.14, 0.02 + Math.random() * 0.03],
      });
    }

    return result;
  }, []);

  return (
    <group>
      {strands.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.75} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

// ── shoulders ─────────────────────────────────────────

function Shoulders() {
  return (
    <group position={[0, 0.02, 0]}>
      <mesh position={[0, 0.38, 0]} scale={[0.22, 0.15, 0.2]}>
        <cylinderGeometry args={[0.5, 0.45, 1, 24]} />
        <meshStandardMaterial color="#efd8c8" roughness={0.5} metalness={0} />
      </mesh>

      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.5, 0.06, 8, 32]} />
        <meshStandardMaterial color="#1e1e2a" roughness={0.5} metalness={0.1} />
      </mesh>

      <mesh position={[0, -0.15, 0]} scale={[1.1, 0.55, 0.55]}>
        <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#1e1e2a" roughness={0.45} metalness={0.08} />
      </mesh>

      <mesh position={[0, 0.08, 0.35]} scale={[0.6, 0.25, 0.06]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#252530" roughness={0.5} metalness={0.05} />
      </mesh>
    </group>
  );
}

// ── character group with mouse follow + float ─────────

function CharacterGroup({ mouseRef }: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const smooth = useRef({ rotX: 0, rotY: 0, floatY: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Smooth mouse follow — lerp toward target
    const targetRotY = mouseRef.current.x * 0.25;
    const targetRotX = mouseRef.current.y * 0.12;
    smooth.current.rotY = lerp(smooth.current.rotY, targetRotY, 0.04);
    smooth.current.rotX = lerp(smooth.current.rotX, targetRotX, 0.04);

    // Gentle float bobbing
    const floatTarget = Math.sin(t * 1.2) * 0.18;
    smooth.current.floatY = lerp(smooth.current.floatY, floatTarget, 0.03);

    if (groupRef.current) {
      groupRef.current.rotation.y = smooth.current.rotY;
      groupRef.current.rotation.x = smooth.current.rotX;
      groupRef.current.position.y = 0.25 + smooth.current.floatY;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.25, 0]}>
      <BiomechBase />
      <Shoulders />
      <CharacterHead />
    </group>
  );
}

// ── cinematic lighting ────────────────────────────────

function SceneLights() {
  const bottomRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (bottomRef.current) {
      bottomRef.current.intensity = 1.8 + Math.sin(state.clock.elapsedTime * 0.6) * 0.4;
    }
  });

  return (
    <>
      <directionalLight position={[4, 3, 5]} intensity={5} color="#ffe8d6" />
      <directionalLight position={[-2, 2, -3]} intensity={6} color="#4dd0e1" />
      <directionalLight position={[0, 3, -1]} intensity={3} color="#7c4dff" />
      <directionalLight position={[0, 1, 4]} intensity={2} color="#b0c4de" />
      <pointLight ref={bottomRef} position={[0, -1.5, 0]} intensity={2} color="#4dd0e1" distance={3} />
      <ambientLight intensity={0.6} color="#1a3050" />
    </>
  );
}

// ── main component ────────────────────────────────────

interface Props {
  className?: string;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

export default function HeroCharacter3D({ className = '', mouseRef }: Props) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0.3, 4.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneLights />
          <CharacterGroup mouseRef={mouseRef} />
          <Environment preset="night" environmentIntensity={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
