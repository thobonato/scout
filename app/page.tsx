"use client";

import { useState } from "react";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { OwnerHome } from "./components/OwnerHome/OwnerHome";
import { loadDogProfile } from "@/lib/dog-profile";
import type { DogProfile } from "@/app/create-dog/types";

export default function Home() {
  const [dog] = useState<DogProfile | null>(() =>
    typeof window !== "undefined" ? loadDogProfile() : null,
  );

  if (!dog) {
    return <LandingPage />;
  }

  return <OwnerHome dog={dog} />;
}
