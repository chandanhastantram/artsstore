'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    color: string;
}

interface FloatingParticlesProps {
    count?: number;
    colors?: string[];
}

export default function FloatingParticles({ 
    count = 20, 
    colors = ['#D4AF37', '#FFD700', '#F0E68C', '#B8860B', '#DAA520'] 
}: FloatingParticlesProps) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const generatedParticles: Particle[] = [];
        for (let i = 0; i < count; i++) {
            generatedParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 8 + 4,
                duration: Math.random() * 20 + 15,
                delay: Math.random() * 10,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        setParticles(generatedParticles);
    }, [count, colors]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                        boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}
