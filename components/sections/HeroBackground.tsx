"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform vec2 uMouse;
  
  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Base wave
    float elevation = sin(modelPosition.x * 0.15 + uTime) * 0.2 +
                      sin(modelPosition.z * 0.15 + uTime) * 0.2;
    
    // Mouse Interaction: Warp grid based on cursor position
    float distanceToMouse = distance(modelPosition.xz, uMouse * 35.0);
    float mouseStrength = smoothstep(12.0, 0.0, distanceToMouse);
    elevation += mouseStrength * 2.5;
    
    modelPosition.y += elevation;
    vElevation = elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec2 uMouse;

  void main() {
    // High-fidelity grid pattern
    vec2 gridUv = fract(vUv * 60.0);
    float lineX = step(0.96, gridUv.x);
    float lineY = step(0.96, gridUv.y);
    float strength = lineX + lineY;
    
    // Dynamic data flow animation
    float flow = sin(vUv.y * 15.0 - uTime * 3.0) * 0.5 + 0.5;
    
    // Cursor glow effect
    float distToMouse = distance(vUv, (uMouse + 1.0) / 2.0);
    float glow = smoothstep(0.15, 0.0, distToMouse);
    
    // Color mixing: Deep navy base with neon cyan highlights
    vec3 baseColor = vec3(0.005, 0.02, 0.05);
    vec3 color = mix(baseColor, uColor, strength * (flow + glow * 3.0));
    
    // Add elevation-based lighting
    color += vElevation * 0.4 * uColor;
    
    // Extra brightness for the cursor area
    color += glow * uColor * 0.8;
    
    gl_FragColor = vec4(color, strength * 0.6 + 0.1 + glow * 0.4);
  }
`;

function NetworkGrid() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { mouse } = useThree();
    const lerpMouse = useRef(new THREE.Vector2(0, 0));

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
            // Smoothly follow the mouse with lerping
            lerpMouse.current.lerp(mouse, 0.05);
            materialRef.current.uniforms.uMouse.value.copy(lerpMouse.current);
        }
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#00f3ff") },
        uMouse: { value: new THREE.Vector2(0, 0) }
    }), []);

    return (
        <mesh rotation={[-Math.PI / 2.1, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[120, 120, 180, 180]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
            />
        </mesh>
    );
}

function DataPackets({ count = 150 }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                t: Math.random() * 100,
                factor: 15 + Math.random() * 80,
                speed: 0.005 + Math.random() * 0.01,
                pos: [
                    (Math.random() - 0.5) * 80,
                    (Math.random() - 0.5) * 5,
                    (Math.random() - 0.5) * 80
                ]
            });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!meshRef.current) return;

        particles.forEach((p, i) => {
            p.t += p.speed;
            const s = Math.cos(p.t);
            dummy.position.set(
                p.pos[0] + Math.sin(p.t),
                p.pos[1] + Math.cos(p.t) * 0.5,
                p.pos[2] + p.t * 2 % 80 - 40 // Move forward along Z
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s, s, s);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[0.08, 0.08, 0.3]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={3} transparent opacity={0.8} />
        </instancedMesh>
    );
}

function ThreatDetectionFlash() {
    const lightRef = useRef<THREE.PointLight>(null);
    const [status, setStatus] = React.useState({ active: false, pos: [0, 0, 0] });

    useFrame((state) => {
        if (!status.active && Math.random() < 0.003) {
            setStatus({
                active: true,
                pos: [(Math.random() - 0.5) * 50, 2, (Math.random() - 0.5) * 50]
            });
            setTimeout(() => setStatus(prev => ({ ...prev, active: false })), 600);
        }

        if (lightRef.current) {
            lightRef.current.intensity = status.active ? (Math.sin(state.clock.getElapsedTime() * 25) + 1.2) * 8 : 0;
        }
    });

    return (
        <pointLight
            ref={lightRef}
            position={status.pos as [number, number, number]}
            color="#ff3300"
            distance={25}
            decay={2}
        />
    );
}

export default function HeroBackground() {
    return (
        <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 8, 25], fov: 40 }}>
                <color attach="background" args={['#020617']} />
                <fog attach="fog" args={['#020617', 10, 55]} />

                <ambientLight intensity={0.2} />
                <pointLight position={[20, 20, 20]} intensity={1.5} color="#00f3ff" />

                <NetworkGrid />
                <DataPackets count={200} />
                <ThreatDetectionFlash />

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
            </Canvas>
            {/* Noise overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
