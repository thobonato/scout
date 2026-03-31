import { type NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RecommendedProduct {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  chewyUrl: string;
  price: number;
  originalPrice?: number;
  confidenceScore: number;
  reasonSnippet: string;
}

interface GetRecommendationsResponse {
  data?: RecommendedProduct[];
  error?: string;
}

// ---------------------------------------------------------------------------
// GET /api/recommendations?petId=...
// ---------------------------------------------------------------------------
export async function GET(
  request: NextRequest,
): Promise<NextResponse<GetRecommendationsResponse>> {
  const petId = request.nextUrl.searchParams.get("petId");

  if (!petId) {
    return NextResponse.json({ error: "Missing petId" }, { status: 400 });
  }

  // TODO: replace with lib/recommendations.ts call, e.g. getAIRecommendations(petId)
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
