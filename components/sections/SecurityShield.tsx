"use client";

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function ShieldModel({ hovered }: { hovered: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    const ring3Ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.15;
            const targetScale = hovered ? 1.25 : 1.0;
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
        }

        // Independent ring rotation for "scanning" feel
        if (ring1Ref.current) ring1Ref.current.rotation.x = t * 0.4;
        if (ring2Ref.current) {
            ring2Ref.current.rotation.y = t * -0.6;
            ring2Ref.current.rotation.z = t * 0.2;
        }
        if (ring3Ref.current) {
            ring3Ref.current.rotation.x = t * 0.2;
            ring3Ref.current.rotation.y = t * 0.8;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Central Core - High fidelity distorted material */}
            <Sphere args={[1, 100, 100]}>
                <MeshDistortMaterial
                    color={hovered ? "#00f3ff" : "#1e1b4b"}
                    emissive={hovered ? "#00f3ff" : "#4338ca"}
                    emissiveIntensity={hovered ? 2 : 0.5}
                    metalness={1}
                    roughness={0.1}
                    distort={hovered ? 0.45 : 0.2}
                    speed={hovered ? 4 : 1.5}
                />
            </Sphere>

            {/* Primary Protection Ring */}
            <mesh ref={ring1Ref}>
                <torusGeometry args={[1.5, 0.03, 16, 100]} />
                <meshStandardMaterial
                    color="#00f3ff"
                    emissive="#00f3ff"
                    emissiveIntensity={hovered ? 8 : 2}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Inner Data Ring */}
            <mesh ref={ring2Ref}>
                <torusGeometry args={[1.3, 0.015, 16, 100]} />
                <meshStandardMaterial
                    color="#4f46e5"
                    emissive="#4f46e5"
                    emissiveIntensity={hovered ? 12 : 3}
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Particle Shell / Outer Defense */}
            <mesh ref={ring3Ref}>
                <torusGeometry args={[1.8, 0.005, 16, 100]} />
                <meshStandardMaterial
                    color="#00f3ff"
                    emissive="#00f3ff"
                    emissiveIntensity={hovered ? 15 : 5}
                    transparent
                    opacity={0.2}
                />
            </mesh>
        </group>
    );
}

export default function SecurityShield() {
    const [hovered, setHovered] = useState(false);

    // Industry standard: The 3D element should lead to action.
    const handleClick = () => {
        const section = document.getElementById('gap-assessment-trigger');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback: scroll to the nearest visible CTA button
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    };

    return (
        <div
            className="w-full h-[450px] cursor-pointer group relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleClick}
        >
            {/* Interactive Label that appears on hover */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 pointer-events-none ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bg-brand-accent/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                    Initialize Secure Protocol
                </div>
            </div>

            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 35 }}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={2.5} color="#00f3ff" />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#4f46e5" />

                <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.6}>
                    <ShieldModel hovered={hovered} />
                </Float>

                <ContactShadows
                    position={[0, -2.5, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2.5}
                    far={4.5}
                />
            </Canvas>

            {/* Decorative pulse ring behind the canvas */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-brand-accent/20 rounded-full transition-all duration-1000 ${hovered ? 'scale-[2.5] opacity-0' : 'scale-100 opacity-50'}`} />
        </div>
    );
}
