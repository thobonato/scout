"use client";

import { PawIcon } from "@/components/PawIcon/PawIcon";

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
  {
    top: "22%",
    left: "48%",
    size: 28,
    delay: "5s",
    dur: "14s",
    rot: "-18deg",
  },
  {
    top: "62%",
    left: "55%",
    size: 40,
    delay: "2.5s",
    dur: "9.5s",
    rot: "8deg",
  },
];

export function PageBackground() {
  return (
    <>
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
    </>
  );
}
