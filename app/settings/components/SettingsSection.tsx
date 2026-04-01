import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section
      className={cn("rounded-3xl bg-white p-5 shadow-sm space-y-4", className)}
    >
      <div>
        <h2 className="font-fredoka text-lg font-semibold text-chewy-dark">
          {title}
        </h2>
        {description && (
          <p className="font-nunito text-xs text-gray-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}
