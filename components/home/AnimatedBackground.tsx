'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Animated Gradient Orbs */}
            <motion.div
                className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gold-400/30 to-maroon-400/30 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -20, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gold-300/10 via-transparent to-maroon-300/10 rounded-full blur-3xl"
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />

            {/* Floating Rings */}
            <motion.div
                className="absolute top-20 right-20 w-32 h-32 border-2 border-gold-300/30 rounded-full"
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            <motion.div
                className="absolute bottom-32 left-32 w-24 h-24 border border-maroon-300/20 rounded-full"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [360, 180, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />

            {/* Sparkle Stars */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gold-400 rounded-full"
                    style={{
                        left: `${15 + i * 12}%`,
                        top: `${20 + (i % 3) * 25}%`,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </div>
    );
}
