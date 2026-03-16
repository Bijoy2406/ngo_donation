"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const [mounted, setMounted] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const initial = {
    opacity: 0,
    y: direction === "up" ? 28 : 0,
    x: direction === "left" ? -28 : direction === "right" ? 28 : 0,
  };

  // Keep SSR and initial client markup identical to avoid hydration attribute mismatch.
  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
