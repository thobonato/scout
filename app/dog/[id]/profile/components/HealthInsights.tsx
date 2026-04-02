"use client";

import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import type { DogProfile } from "@/app/create-dog/types";
import type { ActionLog } from "@/app/dog/[id]/home/types";

interface HealthInsight {
  category: string;
  title: string;
  body: string;
}

interface HealthInsightsProps {
  dog: DogProfile;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Nutrition: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  Exercise: {
    bg: "bg-chewy-blue/8",
    text: "text-chewy-blue",
    dot: "bg-chewy-blue",
  },
  Grooming: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-400",
  },
  "Preventive Care": {
    bg: "bg-chewy-orange/8",
    text: "text-chewy-orange",
    dot: "bg-chewy-orange",
  },
  Behaviour: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
};

function fallbackColors(): { bg: string; text: string; dot: string } {
  return { bg: "bg-cream", text: "text-text-mid", dot: "bg-text-muted" };
}

export function HealthInsights({ dog }: HealthInsightsProps) {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadMedicineLogs(): ActionLog[] {
    try {
      const raw = localStorage.getItem("scout_action_log");
      if (!raw) {
        return [];
      }
      const logs = JSON.parse(raw) as ActionLog[];
      return logs.filter((l) => l.category === "medicine");
    } catch {
      return [];
    }
  }

  async function fetchInsights() {
    setIsLoading(true);
    setError(null);

    const medicineLogs = loadMedicineLogs();

    try {
      const response = await fetch("/api/health-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dog.name,
          breed: dog.breed,
          age: dog.age,
          weight: dog.weight,
          gender: dog.gender,
          size: dog.size,
          coatColor: dog.coatColor,
          personality: dog.personality,
          medicalNotes: dog.medicalNotes,
          isSpayedNeutered: dog.isSpayedNeutered,
          medicineLogs,
        }),
      });

      const json = (await response.json()) as {
        data?: { insights: HealthInsight[] };
        error?: string;
      };

      if (!response.ok || json.error) {
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setInsights(json.data?.insights ?? []);
      setHasLoaded(true);
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-chewy-blue" />
          <h2 className="font-fredoka text-xl font-semibold text-text-dark">
            AI Health Insights
          </h2>
        </div>

        {hasLoaded && (
          <button
            onClick={fetchInsights}
            disabled={isLoading}
            className="flex items-center gap-1.5 font-nunito text-xs font-bold text-text-muted hover:text-chewy-blue transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        )}
      </div>

      {/* Initial state */}
      {!hasLoaded && !isLoading && !error && (
        <div className="bg-warm-white rounded-2xl border border-black/5 shadow-sm px-6 py-8 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-chewy-blue/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-chewy-blue" />
          </div>
          <div>
            <p className="font-fredoka text-lg font-semibold text-text-dark mb-1">
              Personalised for {dog.name}
            </p>
            <p className="font-nunito text-sm text-text-muted max-w-xs">
              Get breed-aware health tips tailored to {dog.name}&apos;s age,
              size, and medical notes.
            </p>
          </div>
          <button
            onClick={fetchInsights}
            className="flex items-center gap-2 bg-chewy-blue hover:bg-chewy-blue-dark text-white font-nunito font-bold px-6 py-3 rounded-full transition-colors shadow-md text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Generate Insights
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="bg-warm-white rounded-2xl border border-black/5 shadow-sm px-6 py-8 flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-chewy-blue animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="font-nunito text-sm text-text-muted">
            Generating insights for {dog.name}…
          </p>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="bg-red-50 rounded-2xl border border-red-100 px-6 py-5 flex flex-col gap-3">
          <p className="font-nunito text-sm text-red-600">{error}</p>
          <button
            onClick={fetchInsights}
            className="self-start font-nunito text-sm font-bold text-red-600 hover:text-red-700 underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {/* Insights */}
      {hasLoaded && !isLoading && insights.length > 0 && (
        <div className="flex flex-col gap-3">
          {insights.map((insight, i) => {
            const colors =
              CATEGORY_COLORS[insight.category] ?? fallbackColors();
            return (
              <div
                key={i}
                className="bg-warm-white rounded-2xl border border-black/5 shadow-sm px-5 py-4 flex flex-col gap-2 animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 font-nunito text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                    {insight.category}
                  </span>
                </div>
                <p className="font-fredoka text-base font-semibold text-text-dark leading-snug">
                  {insight.title}
                </p>
                <p className="font-nunito text-sm text-text-mid leading-relaxed">
                  {insight.body}
                </p>
              </div>
            );
          })}

          <p className="font-nunito text-xs text-text-muted text-center pt-1">
            AI-generated — always consult your vet for medical decisions.
          </p>
        </div>
      )}
    </div>
  );
}
