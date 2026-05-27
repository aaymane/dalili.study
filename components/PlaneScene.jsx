'use client';

/**
 * PlaneScene — React Three Fiber scene
 * Uses plane.png: clean Illustrator export on pure-white background (no shadow).
 * Luma key is ultra-tight (bg = 100% white), so no artefacts.
 * Space colour grade + engine glow lights + float + mouse-tilt.
 */

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';

// ── GLSL shaders ─────────────────────────────────────────────
const vert = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */`
  uniform sampler2D uTexture;
  uniform float     uTime;
  varying vec2      vUv;

  void main() {
    vec4 texel = texture2D(uTexture, vUv);

    float luma = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
    float maxC = max(texel.r, max(texel.g, texel.b));
    float minC = min(texel.r, min(texel.g, texel.b));
    float sat  = maxC > 0.001 ? (maxC - minC) / maxC : 0.0;

    // ── Alpha from the pre-masked PNG (proper transparency, no luma key needed)
    float alpha = texel.a;
    if (alpha < 0.01) discard;

    // ── Keep original plane colours exactly — no darkening, no desaturation.
    //    Just a tiny cool blue breath to blend with the night sky.
    vec3 graded = texel.rgb;
    float blueShift = smoothstep(0.3, 0.9, luma) * 0.035;
    graded.b = min(1.0, graded.b + blueShift);

    // ── Engine shimmer: soft blue pulse on bright metallic surfaces
    float shimmer = sin(uTime * 1.7) * 0.02 + 0.02;
    graded.b = min(1.0, graded.b + shimmer * smoothstep(0.45, 0.80, luma));

    gl_FragColor = vec4(graded, alpha);
  }
`;

// ── Plane mesh with float + mouse tilt ───────────────────────
function PlaneMesh() {
  const meshRef = useRef();

  // plane_alpha.png = flood-fill cleaned PNG with real alpha channel (no fringe)
  const texture = useLoader(TextureLoader, '/plane-parts/plane_alpha.png');

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uTime:    { value: 0.0 },
  }), [texture]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;

    if (!meshRef.current) return;

    // Gentle float
    meshRef.current.position.y = Math.sin(t * 0.47) * 0.28;

    // Mouse tilt (smooth lerp)
    const { x, y } = state.mouse;
    meshRef.current.rotation.x += ((-y * 0.06) - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (( x * 0.09) - meshRef.current.rotation.y) * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      {/* 16:9 plane geometry matching the source image aspect ratio */}
      <planeGeometry args={[16, 9, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Engine point lights ───────────────────────────────────────
function EngineLights() {
  const lights = useRef([]);
  const positions = [
    [-5.6, -0.4, 1.0],
    [-7.0, -0.2, 1.0],
    [ 3.2,  1.1, 1.0],
    [ 5.0,  0.9, 1.0],
  ];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.7);
    lights.current.forEach((l) => {
      if (l) l.intensity = 0.4 + 0.3 * pulse;
    });
  });

  return (
    <>
      {positions.map((pos, i) => (
        <pointLight
          key={i}
          ref={el => { lights.current[i] = el; }}
          position={pos}
          color="#5ab4ff"
          intensity={0.5}
          distance={4}
          decay={2}
        />
      ))}
    </>
  );
}

// ── Atmospheric particle dust ─────────────────────────────────
function DustParticles({ count = 150 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i*3]   = (Math.random() - 0.5) * 30;
      arr[i*3+1] = (Math.random() - 0.5) * 20;
      arr[i*3+2] = (Math.random() - 0.5) * 10 - 2;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.0008;
      ref.current.rotation.x = t * 0.0004;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#6ab4ff"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Root export ───────────────────────────────────────────────
export default function PlaneScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 52 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent', display: 'block', width: '100%', height: '100%', willChange: 'transform' }}
    >
      <Suspense fallback={null}>
        <PlaneMesh />
        <EngineLights />
        <DustParticles />
        <ambientLight intensity={0.08} color="#1a3060" />
      </Suspense>
    </Canvas>
  );
}
