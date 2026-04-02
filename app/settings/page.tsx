"use client";

import { useState } from "react";
import { UserPlus, LogOut, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "./components/SettingsSection";
import { ProfileSettingsForm } from "./components/ProfileSettingsForm";
import { SitterInviteModal } from "./components/SitterInviteModal";
import type { SettingsFormValues, SitterInvitePayload } from "./types";

// ---------------------------------------------------------------------------
// Mock data — replace with real fetch from /api/settings when ready
// ---------------------------------------------------------------------------
const MOCK_SETTINGS: SettingsFormValues = {
  ownerName: "Alex",
  email: "alex@example.com",
  notifications: {
    dailyReminders: true,
    missedTaskAlerts: true,
    sitterUpdates: false,
    weeklyDigest: true,
  },
};

const MOCK_SITTERS = [
  {
    id: "s1",
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "Full Access" as const,
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SettingsPage() {
  const [formValues, setFormValues] =
    useState<SettingsFormValues>(MOCK_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  function handleFormChange(updated: Partial<SettingsFormValues>) {
    setFormValues((prev) => ({ ...prev, ...updated }));
    setSaveStatus("idle");
  }

  async function handleSave() {
    setIsSaving(true);

    try {
      // TODO: replace with fetch("/api/settings", { method: "PATCH", body: JSON.stringify(formValues) })
      await new Promise((res) => setTimeout(res, 800));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSendInvite(payload: SitterInvitePayload) {
    // TODO: replace with fetch("/api/sitters/invite", { method: "POST", body: JSON.stringify(payload) })
    await new Promise((res) => setTimeout(res, 1000));
    console.warn("Invite sent:", payload);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-fredoka text-3xl font-semibold text-chewy-dark">
            Settings
          </h1>
          <p className="font-nunito text-sm text-gray-400 mt-0.5">
            Manage your profile, sitters, and preferences
          </p>
        </div>

        {/* Profile + Notifications */}
        <SettingsSection
          title="Your Profile"
          description="Update your name, email, and notification preferences"
        >
          <ProfileSettingsForm
            values={formValues}
            onChange={handleFormChange}
            isSaving={isSaving}
          />
          <div className="flex items-center gap-3 mt-5">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full bg-chewy-blue text-white font-fredoka hover:bg-chewy-blue/90 disabled:opacity-50"
            >
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
            {saveStatus === "saved" && (
              <span className="font-nunito text-sm text-green-600 font-semibold animate-in fade-in">
                ✓ Saved
              </span>
            )}
          </div>
        </SettingsSection>

        {/* Sitters */}
        <SettingsSection
          title="Sitters & Family"
          description="People who can help care for your pet"
        >
          <div className="space-y-3">
            {/* Existing sitters list */}
            {MOCK_SITTERS.map((sitter) => (
              <div
                key={sitter.id}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="flex flex-col">
                  <span className="font-nunito text-sm font-semibold text-chewy-dark">
                    {sitter.name}
                  </span>
                  <span className="font-nunito text-xs text-gray-400">
                    {sitter.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-nunito text-xs text-chewy-blue font-medium">
                    {sitter.role}
                  </span>
                  <button
                    type="button"
                    className="rounded-full p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${sitter.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Invite button */}
            <button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              className="flex w-full items-center justify-between rounded-2xl border border-dashed border-chewy-blue/40 bg-blue-50/50 px-4 py-3 transition-colors hover:bg-blue-50"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="size-4 text-chewy-blue" />
                <span className="font-nunito text-sm font-semibold text-chewy-blue">
                  Invite a sitter or family member
                </span>
              </div>
              <ChevronRight className="size-4 text-chewy-blue/60" />
            </button>
          </div>
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="Account" className="border border-gray-100">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-nunito"
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 font-nunito"
            >
              <Trash2 className="mr-2 size-4" />
              Delete account
            </Button>
          </div>
        </SettingsSection>
      </div>

      {/* Sitter Invite Modal */}
      <SitterInviteModal
        petId="pet_mock_id"
        petName="Biscuit"
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleSendInvite}
      />
    </main>
  );
}
