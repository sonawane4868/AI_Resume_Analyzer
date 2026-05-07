"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BackgroundAnimation() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bgRef.current;

    gsap.to(el, {
      y: -200,
      rotate: 10,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={bgRef}
        className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl"
      />
    </div>
  );
}