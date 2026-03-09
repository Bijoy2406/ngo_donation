"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { animate } from "framer-motion";

interface CounterProps {
  target: number;
  suffix?: string;
  label: string;
}

export default function Counter({ target, suffix = "+", label }: CounterProps) {
  const [count, setCount] = useState(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (!inView) return;
    animationRef.current = animate(0, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (value) => setCount(Math.round(value)),
    });
    return () => animationRef.current?.stop();
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-sage-600 leading-none">
        {count}
        {suffix}
      </div>
      <div className="text-xs text-gray-500 mt-1.5 font-medium tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
}
