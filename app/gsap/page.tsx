"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function GSAPDemo() {
  const heroRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<HTMLDivElement>(null);
  const staggerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero entrance animation
    const heroCtx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });
      gsap.from(".hero-subtitle", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
    }, heroRef);

    // Floating boxes animation
    const boxesCtx = gsap.context(() => {
      gsap.to(".floating-box", {
        y: -20,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.2,
          from: "random",
        },
      });
    }, boxesRef);

    // Stagger animation on scroll
    const staggerCtx = gsap.context(() => {
      gsap.from(".stagger-item", {
        scrollTrigger: {
          trigger: staggerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, staggerRef);

    // Timeline animation
    const timelineCtx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(".timeline-bar", {
        scaleX: 0,
        duration: 0.5,
        ease: "power2.inOut",
      })
        .from(
          ".timeline-circle",
          {
            scale: 0,
            duration: 0.3,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        )
        .from(
          ".timeline-label",
          {
            y: 20,
            opacity: 0,
            duration: 0.3,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.5"
        );
    }, timelineRef);

    // ScrollTrigger scrub animation
    const scrollCtx = gsap.context(() => {
      gsap.to(".scrub-box", {
        scrollTrigger: {
          trigger: scrollTriggerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        x: 300,
        rotation: 360,
        backgroundColor: "#10b981",
        ease: "none",
      });
    }, scrollTriggerRef);

    return () => {
      heroCtx.revert();
      boxesCtx.revert();
      staggerCtx.revert();
      timelineCtx.revert();
      scrollCtx.revert();
    };
  }, []);

  return (
    <main className="w-full bg-zinc-950 text-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="flex h-screen flex-col items-center justify-center overflow-hidden"
      >
        <h1 className="hero-title overflow-hidden text-7xl font-bold tracking-tight">
          GSAP Animations
        </h1>
        <p className="hero-subtitle mt-4 text-xl text-zinc-400">
          Scroll down to see various animation techniques
        </p>
      </section>

      {/* Floating Boxes */}
      <section
        ref={boxesRef}
        className="flex h-screen flex-col items-center justify-center"
      >
        <h2 className="mb-8 text-3xl font-semibold">Continuous Animation</h2>
        <div className="flex gap-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="floating-box h-16 w-16 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25"
            />
          ))}
        </div>
        <p className="mt-8 text-zinc-400">
          Infinite yoyo with randomized stagger
        </p>
      </section>

      {/* Stagger Animation */}
      <section
        ref={staggerRef}
        className="flex h-screen flex-col items-center justify-center"
      >
        <h2 className="mb-8 text-3xl font-semibold">Scroll-Triggered Stagger</h2>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="stagger-item flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-bold shadow-lg shadow-emerald-500/25"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Animation */}
      <section
        ref={timelineRef}
        className="flex h-screen flex-col items-center justify-center"
      >
        <h2 className="mb-12 text-3xl font-semibold">Timeline Sequence</h2>
        <div className="relative w-full max-w-2xl px-8">
          <div className="timeline-bar h-1 w-full origin-left rounded-full bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="mt-6 flex justify-between">
            {["Start", "Process", "Validate", "Complete"].map((label, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="timeline-circle h-4 w-4 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"
                  style={{ marginLeft: i === 3 ? "0" : "0" }}
                />
                <span className="timeline-label text-sm text-zinc-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ScrollTrigger Scrub */}
      <section
        ref={scrollTriggerRef}
        className="flex h-screen flex-col items-center justify-center"
      >
        <h2 className="mb-8 text-3xl font-semibold">Scrub Animation</h2>
        <div className="w-full overflow-hidden px-8">
          <div className="scrub-box h-24 w-24 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/25" />
        </div>
        <p className="mt-8 text-zinc-400">
          Box follows scroll position (scrub: 1)
        </p>
      </section>

      {/* Footer */}
      <section className="flex h-96 flex-col items-center justify-center">
        <p className="text-zinc-500">
          Built with GSAP {gsap.version} + Next.js
        </p>
      </section>
    </main>
  );
}
