'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface BangleModelProps {
    threadColor: string;
    kundanColor: string;
    kundanShape: 'round' | 'oval' | 'square';
    kundanType: 'classic' | 'premium' | 'royal';
}

const BangleModel: React.FC<BangleModelProps> = ({
    threadColor,
    kundanColor,
    kundanShape,
    kundanType,
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Auto-rotate animation
    useFrame((state, delta) => {
        if (groupRef.current && !hovered) {
            groupRef.current.rotation.y += delta * 0.3;
        }
    });

    // Create bangle geometry
    const bangleGeometry = new THREE.TorusGeometry(2, 0.3, 16, 100);

    // Thread material
    const threadMaterial = new THREE.MeshStandardMaterial({
        color: threadColor,
        metalness: 0.6,
        roughness: 0.3,
    });

    // Kundan material (gemstones)
    const kundanMaterial = new THREE.MeshStandardMaterial({
        color: kundanColor,
        metalness: 0.9,
        roughness: 0.1,
        emissive: kundanColor,
        emissiveIntensity: 0.2,
    });

    // Create kundan stones based on type
    const getKundanCount = () => {
        switch (kundanType) {
            case 'royal':
                return 24;
            case 'premium':
                return 16;
            default:
                return 12;
        }
    };

    const getKundanSize = () => {
        switch (kundanType) {
            case 'royal':
                return 0.15;
            case 'premium':
                return 0.12;
            default:
                return 0.1;
        }
    };

    const getKundanGeometry = () => {
        switch (kundanShape) {
            case 'oval':
                return new THREE.SphereGeometry(getKundanSize(), 16, 16).scale(1, 0.7, 1);
            case 'square':
                return new THREE.BoxGeometry(getKundanSize() * 1.5, getKundanSize() * 1.5, getKundanSize() * 1.5);
            default:
                return new THREE.SphereGeometry(getKundanSize(), 16, 16);
        }
    };

    const kundanCount = getKundanCount();
    const kundanGeometry = getKundanGeometry();

    // Generate kundan positions around the bangle
    const kundanPositions = Array.from({ length: kundanCount }, (_, i) => {
        const angle = (i / kundanCount) * Math.PI * 2;
        const radius = 2;
        return {
            x: Math.cos(angle) * radius,
            y: 0,
            z: Math.sin(angle) * radius,
        };
    });

    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Main bangle */}
            <mesh geometry={bangleGeometry} material={threadMaterial} castShadow receiveShadow />

            {/* Kundan stones */}
            {kundanPositions.map((pos, index) => (
                <mesh
                    key={index}
                    geometry={kundanGeometry}
                    material={kundanMaterial}
                    position={[pos.x, pos.y, pos.z]}
                    castShadow
                />
            ))}
        </group>
    );
};

interface BangleViewer3DProps {
    threadColor?: string;
    kundanColor?: string;
    kundanShape?: 'round' | 'oval' | 'square';
    kundanType?: 'classic' | 'premium' | 'royal';
}

export const BangleViewer3D: React.FC<BangleViewer3DProps> = ({
    threadColor = '#D4AF37',
    kundanColor = '#50C878',
    kundanShape = 'round',
    kundanType = 'classic',
}) => {
    return (
        <div className="w-full h-[500px] bg-gradient-to-br from-ivory-100 to-ivory-200 rounded-lg overflow-hidden shadow-luxury">
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 2, 8]} />
                <OrbitControls
                    enablePan={false}
                    minDistance={5}
                    maxDistance={12}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.5}
                />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.5} />
                <spotLight
                    position={[0, 10, 0]}
                    angle={0.3}
                    penumbra={1}
                    intensity={0.5}
                    castShadow
                />

                {/* Environment for reflections */}
                <Environment preset="sunset" />

                {/* Bangle Model */}
                <BangleModel
                    threadColor={threadColor}
                    kundanColor={kundanColor}
                    kundanShape={kundanShape}
                    kundanType={kundanType}
                />

                {/* Ground plane for shadows */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <shadowMaterial opacity={0.2} />
                </mesh>
            </Canvas>

            {/* Controls hint */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600">
                Drag to rotate • Scroll to zoom
            </div>
        </div>
    );
};
