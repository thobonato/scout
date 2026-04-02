import { supabase } from '@/lib/supabase';
import type { DailyLog, Pet } from '@/lib/types/database';

/**
 * Health insights summary for a pet.
 */
export interface HealthInsights {
  summary: string;
  highlights: string[];
  concerns: string[];
  recommendations: string[];
  generatedAt: string;
}

/**
 * Get weekly health insights for a pet by analyzing recent activity logs.
 */
export async function generateHealthInsights(
  petId: string,
  pet: Pet
): Promise<HealthInsights> {
  // Fetch last 7 days of activity logs
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: logs, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('pet_id', petId)
    .gte('logged_at', sevenDaysAgo.toISOString())
    .order('logged_at', { ascending: false });

  if (error || !logs) {
    console.error('Error fetching activity logs:', error);
    return {
      summary: 'Unable to generate health insights at this time.',
      highlights: [],
      concerns: [],
      recommendations: [],
      generatedAt: new Date().toISOString(),
    };
  }

  // Summarize activity from logs
  const activitySummary = summarizeActivities(logs);

  // Generate insights using LLM
  const insights = await generateInsightsFromLLM(pet, activitySummary, logs);

  return insights;
}

/**
 * Summarize activities from logs for LLM context.
 */
function summarizeActivities(logs: DailyLog[]): Record<string, number> {
  const summary: Record<string, number> = {
    feeding: 0,
    walk: 0,
    medication: 0,
    play: 0,
  };

  logs.forEach((log) => {
    if (log.activity_type in summary) {
      summary[log.activity_type]++;
    }
  });

  return summary;
}

/**
 * Generate health insights using OpenRouter LLM.
 */
async function generateInsightsFromLLM(
  pet: Pet,
  activitySummary: Record<string, number>,
  recentLogs: DailyLog[]
): Promise<HealthInsights> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not configured');
    return getDefaultInsights(pet, activitySummary);
  }

  const prompt = buildHealthInsightsPrompt(pet, activitySummary, recentLogs);

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://scout-pet.vercel.app',
          'X-Title': 'Scout Pet Care',
        },
        body: JSON.stringify({
          model: 'groq/mixtral-8x7b-32768',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1200,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenRouter API error:', error);
      return getDefaultInsights(pet, activitySummary);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not extract JSON from LLM response');
      return getDefaultInsights(pet, activitySummary);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || '',
      highlights: parsed.highlights || [],
      concerns: parsed.concerns || [],
      recommendations: parsed.recommendations || [],
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating health insights:', error);
    return getDefaultInsights(pet, activitySummary);
  }
}

/**
 * Build a detailed prompt for health insights analysis.
 */
function buildHealthInsightsPrompt(
  pet: Pet,
  activitySummary: Record<string, number>,
  recentLogs: DailyLog[]
): string {
  const notesText = recentLogs
    .filter((log) => log.notes)
    .map((log) => `- ${log.activity_type}: ${log.notes}`)
    .slice(0, 5)
    .join('\n');

  return `You are a professional veterinary care consultant. Analyze this dog's activity and health patterns from the past 7 days and provide a weekly health summary.

DOG PROFILE:
- Name: ${pet.name}
- Breed: ${pet.breed || 'Mixed'}
- Age: ${calculateAge(pet.date_of_birth)} years
- Weight: ${pet.weight || 'Unknown'} lbs
- Health Notes: ${pet.medical_notes || 'None reported'}

LAST 7 DAYS ACTIVITY SUMMARY:
- Feedings logged: ${activitySummary.feeding || 0}
- Walks/Exercise: ${activitySummary.walk || 0}
- Medications given: ${activitySummary.medication || 0}
- Playtime: ${activitySummary.play || 0}

RECENT NOTES FROM LOGS:
${notesText || 'No specific notes logged.'}

Based on this information, provide a health assessment in JSON format with:
1. A 2-3 sentence summary of the dog's overall health status
2. Key highlights (positive things you notice)
3. Any concerns (areas that need attention)
4. Specific recommendations for the owner

RESPOND ONLY WITH THIS JSON FORMAT (no other text):
{
  "summary": "Overall health assessment...",
  "highlights": ["Positive observation 1", "Positive observation 2"],
  "concerns": ["Concern 1", "Concern 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;
}

/**
 * Default insights when LLM is unavailable.
 */
function getDefaultInsights(
  pet: Pet,
  activitySummary: Record<string, number>
): HealthInsights {
  const hasConcerns = activitySummary.walk < 3 || activitySummary.feeding < 4;

  return {
    summary: `${pet.name} is doing well with consistent care routines. ${hasConcerns ? 'Consider increasing exercise or feeding consistency.' : 'All major care categories are well maintained.'}`,
    highlights: [
      'Care routine is being logged consistently',
      'Owner is attentive to pet needs',
    ],
    concerns: hasConcerns ? ['Exercise or feeding frequency below ideal'] : [],
    recommendations: [
      'Continue current care routine',
      'Monitor for any health changes',
    ],
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate dog's age in years from date of birth.
 */
function calculateAge(dateOfBirth?: string): number {
  if (!dateOfBirth) {
    return 0;
  }

  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
