"use client";

import { Button } from "@/components/ui/button";

const pawPrints = [
  { top: "8%", left: "5%", size: 64, delay: "0s", dur: "7s", rot: "15deg" },
  {
    top: "14%",
    left: "88%",
    size: 48,
    delay: "1.2s",
    dur: "9s",
    rot: "-20deg",
  },
  { top: "32%", left: "3%", size: 36, delay: "2.1s", dur: "11s", rot: "5deg" },
  {
    top: "55%",
    left: "92%",
    size: 56,
    delay: "0.6s",
    dur: "8s",
    rot: "-10deg",
  },
  { top: "72%", left: "7%", size: 44, delay: "3s", dur: "10s", rot: "25deg" },
  {
    top: "80%",
    left: "80%",
    size: 52,
    delay: "1.8s",
    dur: "7.5s",
    rot: "-5deg",
  },
  { top: "88%", left: "45%", size: 32, delay: "4s", dur: "12s", rot: "12deg" },
  { top: "22%", left: "48%", size: 28, delay: "5s", dur: "14s", rot: "-18deg" },
  {
    top: "62%",
    left: "55%",
    size: 40,
    delay: "2.5s",
    dur: "9.5s",
    rot: "8deg",
  },
];

export default function Home() {
  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-nunito">
      {/* Background noise texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating background paw prints */}
      {pawPrints.map((p, i) => (
        <div
          key={i}
          className="paw-bg fixed pointer-events-none z-0"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.dur,
            transform: `rotate(${p.rot})`,
          }}
        >
          <PawIcon color="var(--chewy-orange)" opacity={1} />
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center p-8">
        {/* Chewy logo lockup */}
        <div
          className="animate-fade-up mb-10"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-[10px] justify-center">
            <div className="animate-wag w-[42px] h-[42px]">
              <PawIcon color="var(--chewy-blue)" opacity={1} />
            </div>
            <span className="font-fredoka text-[2rem] font-semibold text-chewy-blue tracking-[-0.01em] leading-none">
              chewy
            </span>
          </div>
        </div>

        {/* Eyebrow badge */}
        <div
          className="animate-fade-up mb-3"
          style={{ animationDelay: "0.25s" }}
        >
          <span className="font-nunito text-[0.85rem] font-bold tracking-[0.18em] uppercase text-chewy-orange bg-chewy-orange/10 border-[1.5px] border-chewy-orange/25 px-[14px] py-[4px] rounded-full">
            introducing
          </span>
        </div>

        {/* Hero title */}
        <div className="animate-pop-in mb-5" style={{ animationDelay: "0.4s" }}>
          <h1
            className="font-fredoka font-bold leading-[0.92] tracking-[-0.02em] text-text-dark relative"
            style={{ fontSize: "clamp(5rem, 18vw, 10rem)" }}
          >
            Scout
            {/* Orange accent dot */}
            <span className="inline-block w-[0.18em] h-[0.18em] bg-chewy-orange rounded-full align-top mt-[0.12em] ml-[0.04em]" />
          </h1>
        </div>

        {/* Subheadline */}
        <div
          className="animate-fade-up mb-4"
          style={{ animationDelay: "0.6s" }}
        >
          <p
            className="font-fredoka font-normal text-text-mid tracking-[-0.01em]"
            style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)" }}
          >
            is coming soon
          </p>
        </div>

        {/* CTA */}
        <div
          className="animate-fade-up mb-6"
          style={{ animationDelay: "0.95s" }}
        >
          <Button size="lg" className="rounded-full px-8 font-nunito font-bold">
            Join the waitlist
          </Button>
        </div>

        {/* Divider paws */}
        <div
          className="animate-fade-in flex gap-2 items-center my-5"
          style={{ animationDelay: "0.75s" }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-4 h-4 opacity-35">
              <PawIcon color="var(--chewy-blue)" opacity={1} />
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div
          className="animate-fade-up mb-10"
          style={{ animationDelay: "0.85s" }}
        >
          <p
            className="font-nunito font-semibold text-text-muted max-w-[420px] leading-relaxed"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)" }}
          >
            Your pet&apos;s new best friend is almost here.
            <br />
            We&apos;re building something good.
          </p>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        className="animate-fade-in fixed bottom-0 left-0 right-0 px-4 py-4 flex justify-center items-center gap-2 bg-cream/60 backdrop-blur-md border-t border-chewy-orange/10 z-20"
        style={{ animationDelay: "1.3s" }}
      >
        <div className="w-[14px] h-[14px] opacity-50">
          <PawIcon color="var(--chewy-orange)" opacity={1} />
        </div>
        <p className="font-nunito text-[0.8rem] font-bold text-text-muted tracking-[0.06em]">
          a chewy product &nbsp;·&nbsp; good things take time
        </p>
        <div className="w-[14px] h-[14px] opacity-50">
          <PawIcon color="var(--chewy-orange)" opacity={1} />
        </div>
      </div>
    </div>
  );
}

interface PawIconProps {
  color: string;
  opacity: number;
}

function PawIcon({ color, opacity }: PawIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", opacity }}
    >
      {/* Toe pads */}
      <ellipse cx="24" cy="28" rx="11" ry="13" fill={color} />
      <ellipse cx="47" cy="18" rx="11" ry="13" fill={color} />
      <ellipse cx="70" cy="22" rx="11" ry="13" fill={color} />
      <ellipse cx="85" cy="44" rx="10" ry="12" fill={color} />
      {/* Main pad */}
      <ellipse cx="52" cy="68" rx="28" ry="24" fill={color} />
    </svg>
  );
}
