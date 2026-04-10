import { createDogProfile, getPets } from '@/lib/dog-profile';
import { NextResponse } from 'next/server';
import type { DogProfile } from '@/app/create-dog/types';

export async function GET(): Promise<NextResponse> {
  try {
    const pets = await getPets();
    return NextResponse.json({ data: pets });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as Partial<DogProfile>;

  if (!body.name?.trim() || !body.breed?.trim()) {
    return NextResponse.json(
      { error: 'name and breed are required' },
      { status: 400 }
    );
  }

  try {
    const pet = await createDogProfile(body as DogProfile);
    return NextResponse.json({ data: pet }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
