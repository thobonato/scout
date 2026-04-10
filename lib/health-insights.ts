import Groq, { RateLimitError } from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';
import type { Pet } from '@/app/create-dog/types';

export interface HealthInsight {
  category: string;
  title: string;
  body: string;
}

interface ActionLogRow {
  activity_type: string;
  item_name: string;
  logged_at: string;
}

function buildPetSummary(pet: Pet, logs: ActionLogRow[]): string {
  const ageYears = pet.ageMonths ? (pet.ageMonths / 12).toFixed(1) : null;
  const recentLogs = logs.slice(0, 30);

  const logSummary =
    recentLogs.length > 0
      ? `Recent activity (last ${recentLogs.length} events):\n${recentLogs
          .map(
            (l) =>
              `  - ${l.activity_type}: ${l.item_name} at ${new Date(l.logged_at).toLocaleString()}`
          )
          .join('\n')}`
      : null;

  return [
    `Name: ${pet.name}`,
    `Breed: ${pet.breed ?? 'mixed'}`,
    ageYears ? `Age: ${ageYears} years` : null,
    pet.weightLbs ? `Weight: ${pet.weightLbs} lbs` : null,
    pet.gender && pet.gender !== 'unknown' ? `Gender: ${pet.gender}` : null,
    pet.size ? `Size: ${pet.size}` : null,
    pet.coatColor ? `Coat: ${pet.coatColor}` : null,
    pet.isSpayedNeutered ? 'Spayed/neutered: yes' : null,
    pet.medicalNotes ? `Medical notes: ${pet.medicalNotes}` : null,
    logSummary,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function getHealthInsights(
  petId: string
): Promise<HealthInsight[]> {
  const supabase = await createClient();

  // Fetch pet profile.
  const { data: petRow, error: petError } = await supabase
    .from('pets')
    .select('*')
    .eq('id', petId)
    .single();

  if (petError || !petRow) {
    throw new Error('Pet not found');
  }

  // Fetch last 7 days of activity logs for context.
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data: logRows } = await supabase
    .from('action_logs')
    .select('activity_type, item_name, logged_at')
    .eq('pet_id', petId)
    .gte('logged_at', weekAgo.toISOString())
    .order('logged_at', { ascending: false });

  const pet = petRow as Pet;
  const logs = (logRows ?? []) as ActionLogRow[];

  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const client = new Groq();

  const prompt = `Given this dog's profile and recent care activity, return exactly 3 personalised health insights as a JSON array.

Each insight must have:
  - "category": one of "Nutrition", "Exercise", "Grooming", "Preventive Care", or "Behaviour"
  - "title": a short (4–7 word) actionable headline
  - "body": 1–2 sentences of concrete, breed/age-aware advice based on the activity data

Format: JSON array only — no markdown, no commentary.

Dog profile:
${buildPetSummary(pet, logs)}`;

  const response = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content:
          'You are a veterinary health advisor for Scout, a pet care app. Respond with ONLY valid JSON — no markdown, no code fences.',
      },
      { role: 'user', content: prompt },
    ],
  });

  const text = response.choices[0]?.message?.content ?? '';
  const cleaned = text
    .replace(/^```(?:json)?\n?/, '')
    .replace(/\n?```$/, '')
    .trim();

  const insights = JSON.parse(cleaned) as HealthInsight[];

  // Persist to health_insights table (replace previous entry for this pet).
  await supabase.from('health_insights').insert([
    {
      pet_id: petId,
      summary: insights.map((i) => i.title).join('; '),
      highlights: insights
        .filter((i) => ['Nutrition', 'Exercise'].includes(i.category))
        .map((i) => i.body),
      recommendations: insights.map((i) => `${i.title}: ${i.body}`),
    },
  ]);

  return insights;
}

export { RateLimitError };
