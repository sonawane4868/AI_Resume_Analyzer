"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "../HomePage/Navbar";
import Hero from "../HomePage/Hero";
import Preview from "../HomePage/Preview";
import Features from "../HomePage/Features";
import Steps from "../HomePage/Steps";
import CTA from "../HomePage/CTA";
import ThreeBackground from "../HomePage/ThreeBackground";

gsap.registerPlugin(ScrollTrigger);


export default function HomeWrapper() {
  const sphereRef = useRef<any>(null);

  // ✅ GSAP will control THIS instead
  const animationState = useRef({
    x: 0,
    scale: 2,
  }).current;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "main",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5, // 🔥 smoothness (increase = smoother)
          // markers: true,
        },
      });

      // 🟣 initial → preview
      tl.to(animationState, {
        x: -6,
        scale: 2,
        ease: "power2.out",
      });

      // 🟣 preview → features
      tl.to(
        animationState,
        {
          x: 5,
          scale: 3.6,
          ease: "power2.inOut",
        },
        // "-=0.2",
      );

      // 🟣 features → steps
      tl.to(
        animationState,
        {
          x: -7,
          scale: 1.5,
          ease: "power2.out",
        },
        // "-=0.1",
      );

      tl.to(
        animationState,
        {
          x: 0,
          y:-4,
          scale: 1.5,
          ease: "power2.out",
        },
        "-=0.1",
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-[#0b0b0c] min-h-screen overflow-x-hidden relative z-0">
      <ThreeBackground sphereRef={sphereRef} animationState={animationState} />

      <Navbar />

      <section className="min-h-screen">
        <Hero />
      </section>

      <section className="preview-section md:min-h-screen">
        <Preview />
      </section>

      <section className="features-section md:min-h-screen">
        <Features />
      </section>

      <section className="steps-section min-h-screen">
        <Steps />
      </section>

      <section className="h-auto">
        <CTA />
      </section>
    </main>
  );
}
