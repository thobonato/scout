import { PawIcon } from "@/components/PawIcon/PawIcon";

export function BottomStrip() {
  return (
    <div className="animate-fade-in fixed bottom-0 left-0 right-0 px-4 py-4 flex justify-center items-center gap-2 bg-cream/60 backdrop-blur-md border-t border-chewy-orange/10 z-20">
      <div className="w-[14px] h-[14px] opacity-50">
        <PawIcon color="var(--chewy-orange)" opacity={1} />
      </div>
      <p className="font-nunito text-[0.8rem] font-bold text-text-muted tracking-[0.06em]">
        a chewy product &nbsp;&middot;&nbsp; good things take time
      </p>
      <div className="w-[14px] h-[14px] opacity-50">
        <PawIcon color="var(--chewy-orange)" opacity={1} />
      </div>
    </div>
  );
}
