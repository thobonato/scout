/**
 * Healthcare Module
 *
 * Server-side healthcare features: health insights and product recommendations.
 * All functions use Supabase and OpenRouter LLM.
 */

export { generateHealthInsights } from './health-insights';
export type { HealthInsights } from './health-insights';

export { getOrGenerateRecommendations } from './recommendations';
export type { ProductRecommendation } from './recommendations';
