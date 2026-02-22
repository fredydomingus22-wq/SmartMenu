"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: [12, -2, 0],
    transition: {
      duration: 0.8,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  }
};

interface LandingHeroAnimationsProps {
  children: ReactNode;
}

/**
 * Isolated Client Component to handle Framer Motion animations
 * while keeping the parent Hero component as a Server Component for SEO and Performance.
 */
export default function LandingHeroAnimations({ children }: LandingHeroAnimationsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-2"
    >
      {/* We iterate over children, assuming they are the specific elements we want to animate.
          For a simple implementation without cloning, we just wrap them in motion items.
      */}
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants} className="w-full flex justify-center">
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants} className="w-full flex justify-center">
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
