/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO, MeshTransmissionMaterial, Text } from '@react-three/drei';
import { easing } from 'maath';

/* ── In-memory GLB substitute — same shape as useGLTF output ── */
const geometries = {
  Cylinder: new THREE.CylinderGeometry(4, 4, 0.4, 64),
  Cube: new THREE.BoxGeometry(2.5, 2.5, 2.5, 4, 4, 4),
  BarCube: new THREE.BoxGeometry(8, 0.6, 0.4, 8, 2, 2),
};

function useGLTFCompat(glb) {
  return useMemo(() => {
    const key = glb.includes('lens') ? 'Cylinder' : glb.includes('bar') ? 'BarCube' : 'Cube';
    const geo = geometries[key];
    geo.computeBoundingBox();
    return { nodes: { [key === 'BarCube' ? 'Cube' : key]: { geometry: geo } } };
  }, [glb]);
}

/* ── FluidGlass ── */
export default function FluidGlass({ mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {} }) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  const { navItems, ...modeProps } = rawOverrides;

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      {mode === 'bar' && navItems && <NavItems items={navItems} />}
      <Wrapper modeProps={modeProps} />
    </Canvas>
  );
}

/* ── ModeWrapper ── */
function ModeWrapper({
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
}) {
  const ref = useRef();
  const { nodes } = useGLTFCompat(glb);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    const geo = nodes[geometryKey]?.geometry;
    if (!geo) return;
    geo.computeBoundingBox();
    geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom
      ? -v.height / 2 + 0.2
      : followPointer
        ? (pointer.y * v.height) / 2
        : 0;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if (modeProps.scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    gl.setClearColor(0x5227ff, 1);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={nodes[geometryKey]?.geometry}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...extraMat}
        />
      </mesh>
    </>
  );
}

function Lens({ modeProps }) {
  return <ModeWrapper glb="lens" geometryKey="Cylinder" followPointer modeProps={modeProps} />;
}

function Cube({ modeProps }) {
  return <ModeWrapper glb="cube" geometryKey="Cube" followPointer modeProps={modeProps} />;
}

function Bar({ modeProps = {} }) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25,
  };

  return (
    <ModeWrapper
      glb="bar"
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
    />
  );
}

/* ── NavItems ── */
function NavItems({ items }) {
  const group = useRef();
  const { viewport, camera } = useThree();

  const DEVICE = {
    mobile: { max: 639, spacing: 0.2, fontSize: 0.035 },
    tablet: { max: 1023, spacing: 0.24, fontSize: 0.035 },
    desktop: { max: Infinity, spacing: 0.3, fontSize: 0.035 },
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= DEVICE.mobile.max ? 'mobile' : w <= DEVICE.tablet.max ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { spacing, fontSize } = DEVICE[device];

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);
    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing;
    });
  });

  const handleNavigate = (link) => {
    if (!link) return;
    link.startsWith('#') ? (window.location.hash = link) : (window.location.href = link);
  };

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text
          key={label}
          fontSize={fontSize}
          color="white"
          anchorX="center"
          anchorY="middle"
          depthWrite={false}
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000"
          outlineOpacity={0.5}
          depthTest={false}
          renderOrder={10}
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate(link);
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}
