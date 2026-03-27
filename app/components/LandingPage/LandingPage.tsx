import { Button } from "@/components/ui/button";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import { PageBackground } from "@/components/PageBackground/PageBackground";
import { BottomStrip } from "@/components/BottomStrip/BottomStrip";

export function LandingPage() {
  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-nunito">
      <PageBackground />

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
            Your pet&apos;s new best friend
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
            Create a routine for your dog, share it with your sitter, and watch
            them come to life.
          </p>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-up" style={{ animationDelay: "1s" }}>
          <a
            href="/create-dog"
            className="inline-flex items-center gap-2 bg-chewy-blue hover:bg-chewy-blue-dark text-white font-nunito font-bold px-8 py-4 rounded-full transition-colors text-lg shadow-md hover:shadow-lg"
          >
            <span className="w-5 h-5">
              <PawIcon color="#fff" opacity={1} />
            </span>
            Get Started
          </a>
        </div>
      </div>

      <BottomStrip />
    </div>
  );
}
