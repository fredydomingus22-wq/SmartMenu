"use client";

import { useEffect, useRef } from "react";
import { useSpring, useTransform, motion } from "framer-motion";

interface AnimatedCounterProps {
    value: number;
    duration?: number;
}

export function AnimatedCounter({ value }: AnimatedCounterProps) {
    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 30,
        restDelta: 0.001
    });

    const rounded = useTransform(springValue, (latest) => Math.round(latest));
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
}
