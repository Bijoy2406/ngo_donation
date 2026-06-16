"use client";

import { ReactNode, useSyncExternalStore } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

const subscribe = () => () => {};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

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
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        initial={initial}
        animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
        transition={{ duration: 0.55, delay, ease: "easeOut" }}
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
