"use client";

import Link from "next/link";
import { PawIcon } from "@/components/PawIcon";
import { PageBackground } from "@/components/PageBackground";
import { BottomStrip } from "@/components/BottomStrip";

export default function NotFound() {
  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-nunito">
      <PageBackground />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center p-8">
        {/* Chewy logo lockup */}
        <div
          className="animate-fade-up mb-10"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-[10px] justify-center">
            <div className="animate-wag w-[42px] h-[42px]">
              <PawIcon color="var(--scout-primary)" opacity={1} />
            </div>
            <span className="font-fredoka text-[2rem] font-semibold text-scout-primary tracking-[-0.01em] leading-none">
              chewy
            </span>
          </div>
        </div>

        {/* 404 badge */}
        <div
          className="animate-fade-up mb-3"
          style={{ animationDelay: "0.25s" }}
        >
          <span className="font-nunito text-[0.85rem] font-bold tracking-[0.18em] uppercase text-scout-secondary bg-scout-secondary/10 border-[1.5px] border-scout-secondary/25 px-[14px] py-[4px] rounded-full">
            404
          </span>
        </div>

        {/* Headline */}
        <div className="animate-pop-in mb-4" style={{ animationDelay: "0.4s" }}>
          <h1
            className="font-fredoka font-semibold leading-[1.1] tracking-[-0.02em] text-text-dark"
            style={{ fontSize: "clamp(2.2rem, 7vw, 3.5rem)" }}
          >
            Uh oh! We couldn&apos;t find this page.
          </h1>
        </div>

        {/* Divider paws */}
        <div
          className="animate-fade-in flex gap-2 items-center my-4"
          style={{ animationDelay: "0.55s" }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-4 h-4 opacity-35">
              <PawIcon color="var(--scout-primary)" opacity={1} />
            </div>
          ))}
        </div>

        {/* Subtext */}
        <div
          className="animate-fade-up mb-8"
          style={{ animationDelay: "0.65s" }}
        >
          <p
            className="font-nunito font-semibold text-text-muted max-w-[380px] leading-relaxed"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.15rem)" }}
          >
            We couldn&apos;t sniff out what you were looking for.
          </p>
        </div>

        {/* CTA button */}
        <div className="animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-scout-secondary hover:bg-scout-secondary-dark text-white font-nunito font-bold px-7 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
          >
            <span className="w-4 h-4">
              <PawIcon color="#fff" opacity={1} />
            </span>
            Head Home
          </Link>
        </div>
      </div>

      <BottomStrip />
    </div>
  );
}
