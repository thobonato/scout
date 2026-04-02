import {
  createPet,
  deletePet,
  getUserPets,
  updatePet,
} from '@/lib/queries/pets';
import type {
  CreatePetRequest,
  DeletePetResponse,
  PetResponse,
  PetsListResponse,
  UpdatePetRequest,
} from '@/types/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/pets?userId=...
 * Fetch all pets owned by a user.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<PetsListResponse>> {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId query parameter' },
      { status: 400 }
    );
  }

  const pets = await getUserPets(userId);
  return NextResponse.json({ data: pets });
}

/**
 * POST /api/pets
 * Create a new pet.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<PetResponse>> {
  const body = (await request.json()) as Partial<CreatePetRequest>;

  if (!body.ownerId || !body.name || !body.species) {
    return NextResponse.json(
      { error: 'Missing required fields: ownerId, name, species' },
      { status: 400 }
    );
  }

  const pet = await createPet(
    body.ownerId,
    body.name,
    body.species,
    body.breed,
    body.dateOfBirth,
    body.gender,
    body.weight,
    body.avatarUrl
  );

  if (!pet) {
    return NextResponse.json(
      { error: 'Failed to create pet' },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: pet }, { status: 201 });
}

/**
 * PATCH /api/pets
 * Update a pet's profile.
 */
export async function PATCH(
  request: NextRequest
): Promise<NextResponse<PetResponse>> {
  const body = (await request.json()) as Partial<UpdatePetRequest>;

  if (!body.petId) {
    return NextResponse.json({ error: 'Missing petId' }, { status: 400 });
  }

  const pet = await updatePet(body.petId, {
    name: body.name,
    breed: body.breed,
    dateOfBirth: body.dateOfBirth,
    gender: body.gender,
    weight: body.weight,
    coatColor: body.coatColor,
    size: body.size,
    personality: body.personality,
    medicalNotes: body.medicalNotes,
    isSpayedNeutered: body.isSpayedNeutered,
    avatarUrl: body.avatarUrl,
    healthContext: body.healthContext,
  });

  if (!pet) {
    return NextResponse.json(
      { error: 'Failed to update pet' },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: pet });
}

/**
 * DELETE /api/pets?petId=...
 * Delete a pet and all associated data.
 */
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<DeletePetResponse>> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json(
      { error: 'Missing petId query parameter' },
      { status: 400 }
    );
  }

  const success = await deletePet(petId);

  if (!success) {
    return NextResponse.json(
      { error: 'Failed to delete pet' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
