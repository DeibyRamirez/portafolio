"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "./gsap";

export default function LineHeading({
  lines,
  id,
  className = "",
  as = "h2",
}: {
  lines: string[];
  id?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const inners = ref.current?.querySelectorAll(".line-inner");
      if (!inners?.length) return;
      gsap.from(inners, {
        yPercent: 115,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          once: true,
        },
      });
    },
    { scope: ref },
  );

  const Tag = as;

  return (
    <Tag id={id} ref={ref} className={`font-semibold leading-[1.05] tracking-[-0.025em] ${className}`}>
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden">
          <span className="line-inner block">{line} </span>
        </span>
      ))}
    </Tag>
  );
}
