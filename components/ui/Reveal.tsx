"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealDirection = "up" | "down" | "left" | "right";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  once?: boolean;
  direction?: RevealDirection;
  as?: ElementType;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.14,
  once = true,
  direction = "up",
  as: Component = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <Component
      ref={ref}
      className={`reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
      data-direction={direction}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}