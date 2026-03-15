"use client";

import Link from "next/link";

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

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #fff8f0 0%, #fef3e2 50%, #fff0e8 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-nunito)",
      }}
    >
      {/* Background noise texture */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.4,
        }}
      />

      {/* Floating background paw prints */}
      {pawPrints.map((p, i) => (
        <div
          key={i}
          className="paw-bg"
          style={{
            position: "fixed",
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.dur,
            transform: `rotate(${p.rot})`,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <PawIcon color="#f4791f" opacity={1} />
        </div>
      ))}

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem",
          gap: "0rem",
        }}
      >
        {/* Chewy logo lockup */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.1s", marginBottom: "2.5rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <div className="animate-wag" style={{ width: 42, height: 42 }}>
              <PawIcon color="#00aeef" opacity={1} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-fredoka)",
                fontSize: "2rem",
                fontWeight: 600,
                color: "#00aeef",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              chewy
            </span>
          </div>
        </div>

        {/* 404 badge */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.25s", marginBottom: "0.75rem" }}
        >
          <span
            style={{
              fontFamily: "var(--font-nunito)",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#f4791f",
              background: "rgba(244,121,31,0.10)",
              border: "1.5px solid rgba(244,121,31,0.25)",
              padding: "4px 14px",
              borderRadius: "999px",
            }}
          >
            404
          </span>
        </div>

        {/* Headline */}
        <div
          className="animate-pop-in"
          style={{ animationDelay: "0.4s", marginBottom: "1rem" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-fredoka)",
              fontSize: "clamp(2.2rem, 7vw, 3.5rem)",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#1a1a2e",
            }}
          >
            Uh oh! We couldn&apos;t find this page.
          </h1>
        </div>

        {/* Divider paws */}
        <div
          className="animate-fade-in"
          style={{
            animationDelay: "0.55s",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            margin: "1rem 0",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 16, height: 16, opacity: 0.35 }}>
              <PawIcon color="#00aeef" opacity={1} />
            </div>
          ))}
        </div>

        {/* Subtext */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.65s", marginBottom: "2rem" }}
        >
          <p
            style={{
              fontFamily: "var(--font-nunito)",
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              fontWeight: 600,
              color: "#7a7a9a",
              maxWidth: "380px",
              lineHeight: 1.6,
            }}
          >
            We couldn&apos;t sniff out what you were looking for.
          </p>
        </div>

        {/* CTA button */}
        <div className="animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-nunito)",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#fff",
              background: "#f4791f",
              border: "none",
              borderRadius: "999px",
              padding: "12px 28px",
              textDecoration: "none",
              letterSpacing: "0.02em",
              boxShadow: "0 4px 16px rgba(244,121,31,0.25)",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "#d96310";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "#f4791f";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(0)";
            }}
          >
            <span style={{ width: 16, height: 16, display: "inline-flex" }}>
              <PawIcon color="#fff" opacity={1} />
            </span>
            Head Home
          </Link>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        className="animate-fade-in"
        style={{
          animationDelay: "1.3s",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255,248,240,0.6)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(244,121,31,0.1)",
          zIndex: 20,
        }}
      >
        <div style={{ width: 14, height: 14, opacity: 0.5 }}>
          <PawIcon color="#f4791f" opacity={1} />
        </div>
        <p
          style={{
            fontFamily: "var(--font-nunito)",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#9a9ab0",
            letterSpacing: "0.06em",
          }}
        >
          a chewy product &nbsp;·&nbsp; good things take time
        </p>
        <div style={{ width: 14, height: 14, opacity: 0.5 }}>
          <PawIcon color="#f4791f" opacity={1} />
        </div>
      </div>
    </div>
  );
}

function PawIcon({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", opacity }}
    >
      <ellipse cx="24" cy="28" rx="11" ry="13" fill={color} />
      <ellipse cx="47" cy="18" rx="11" ry="13" fill={color} />
      <ellipse cx="70" cy="22" rx="11" ry="13" fill={color} />
      <ellipse cx="85" cy="44" rx="10" ry="12" fill={color} />
      <ellipse cx="52" cy="68" rx="28" ry="24" fill={color} />
    </svg>
  );
}
