import { type NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { RateLimitError } from "groq-sdk";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface HealthInsight {
  category: string;
  title: string;
  body: string;
}

interface GetHealthInsightsResponse {
  data?: { insights: HealthInsight[] };
  error?: string;
}

interface MedicineLog {
  id: string;
  itemName: string;
  timestamp: string;
}

interface DogProfilePayload {
  name: string;
  breed: string;
  age: string;
  weight?: string;
  gender?: string;
  size?: string;
  coatColor?: string;
  personality?: string;
  medicalNotes?: string;
  isSpayedNeutered?: boolean;
  medicineLogs?: MedicineLog[];
}

// ---------------------------------------------------------------------------
// POST /api/health-insights
// ---------------------------------------------------------------------------
export async function POST(
  request: NextRequest,
): Promise<NextResponse<GetHealthInsightsResponse>> {
  let dog: DogProfilePayload;

  try {
    dog = (await request.json()) as DogProfilePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!dog.name || !dog.breed) {
    return NextResponse.json(
      { error: "Missing required fields: name, breed" },
      { status: 400 },
    );
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const client = new Groq();

  const dogSummary = [
    `Name: ${dog.name}`,
    `Breed: ${dog.breed}`,
    `Age: ${dog.age} year(s)`,
    dog.weight ? `Weight: ${dog.weight} lbs` : null,
    dog.gender && dog.gender !== "unknown" ? `Gender: ${dog.gender}` : null,
    dog.size ? `Size: ${dog.size}` : null,
    dog.coatColor ? `Coat color: ${dog.coatColor}` : null,
    dog.isSpayedNeutered !== undefined
      ? `Spayed/neutered: ${dog.isSpayedNeutered ? "yes" : "no"}`
      : null,
    dog.personality ? `Personality: ${dog.personality}` : null,
    dog.medicalNotes ? `Medical notes: ${dog.medicalNotes}` : null,
    dog.medicineLogs && dog.medicineLogs.length > 0
      ? `Recent medication history (last ${dog.medicineLogs.length} logged):\n${dog.medicineLogs
          .slice(-10)
          .map((l) => `  - ${l.itemName} at ${new Date(l.timestamp).toLocaleString()}`)
          .join("\n")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `Given a dog's profile, return exactly 3 personalized health insights as a JSON array.
Each insight must have:
  - "category": one of "Nutrition", "Exercise", "Grooming", "Preventive Care", or "Behaviour"
  - "title": a short (4–7 word) actionable headline
  - "body": 1–2 sentences of concrete, breed/age-aware advice

Format: [{"category":"...","title":"...","body":"..."},...]

Dog profile:
${dogSummary}`;

  let text: string | null;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable veterinary health advisor for Scout, a pet care app.
Always respond with ONLY valid JSON — no markdown, no commentary, no code fences.`,
        },
        { role: "user", content: prompt },
      ],
    });
    text = response.choices[0]?.message?.content ?? null;
  } catch (err) {
    console.error("[health-insights] Groq error:", err);
    if (err instanceof RateLimitError) {
      return NextResponse.json(
        { error: "Too many requests — please wait a moment and try again." },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Failed to reach the AI service. Please try again." },
      { status: 500 },
    );
  }

  if (!text) {
    return NextResponse.json(
      { error: "Unexpected response from AI" },
      { status: 500 },
    );
  }

  const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  let insights: HealthInsight[];

  try {
    insights = JSON.parse(cleaned) as HealthInsight[];
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: { insights } });
}
