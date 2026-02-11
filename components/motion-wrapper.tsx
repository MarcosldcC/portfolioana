"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface MotionWrapperProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

export function MotionWrapper({
    children,
    className = "",
    delay = 0,
    direction = "up",
}: MotionWrapperProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const directionOffset = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
    };

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                x: directionOffset[direction].x,
                y: directionOffset[direction].y,
            }}
            animate={
                isInView
                    ? { opacity: 1, x: 0, y: 0 }
                    : {
                        opacity: 0,
                        x: directionOffset[direction].x,
                        y: directionOffset[direction].y,
                    }
            }
            transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
