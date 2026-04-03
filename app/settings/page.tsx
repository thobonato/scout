'use client';

import { useEffect, useState } from 'react';
import { UserPlus, LogOut, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsSection } from './components/SettingsSection';
import { ProfileSettingsForm } from './components/ProfileSettingsForm';
import { SitterInviteModal } from './components/SitterInviteModal';
import type { Pet } from '@/app/create-dog/types';
import type { SettingsFormValues, SitterInvitePayload } from './types';

const MOCK_SETTINGS: SettingsFormValues = {
  ownerName: '',
  email: '',
  notifications: {
    dailyReminders: true,
    missedTaskAlerts: true,
    sitterUpdates: false,
    weeklyDigest: true,
  },
};

export default function SettingsPage() {
  const [formValues, setFormValues] =
    useState<SettingsFormValues>(MOCK_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    async function loadPet() {
      const response = await fetch('/api/pets');
      if (!response.ok) {
        return;
      }
      const json = (await response.json()) as { data?: Pet[] };
      setPet(json.data?.[0] ?? null);
    }

    void loadPet();
  }, []);

  function handleFormChange(updated: Partial<SettingsFormValues>) {
    setFormValues((prev) => ({ ...prev, ...updated }));
    setSaveStatus('idle');
  }

  async function handleSave() {
    setIsSaving(true);

    try {
      // TODO: wire to PATCH /api/settings when settings route is implemented
      await new Promise((res) => setTimeout(res, 800));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSendInvite(
    payload: SitterInvitePayload
  ): Promise<{ token: string }> {
    const response = await fetch('/api/sitters/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const json = (await response.json()) as { error?: string };
      throw new Error(json.error ?? 'Failed to send invite');
    }

    const json = (await response.json()) as { data: { token: string } };
    return { token: json.data.token };
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="font-fredoka text-3xl font-semibold text-chewy-dark">
            Settings
          </h1>
          <p className="font-nunito text-sm text-gray-400 mt-0.5">
            Manage your profile, sitters, and preferences
          </p>
        </div>

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
              {isSaving ? 'Saving…' : 'Save changes'}
            </Button>
            {saveStatus === 'saved' && (
              <span className="font-nunito text-sm text-green-600 font-semibold animate-in fade-in">
                ✓ Saved
              </span>
            )}
          </div>
        </SettingsSection>

        <SettingsSection
          title="Sitters & Family"
          description="People who can help care for your pet"
        >
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              disabled={!pet}
              className="flex w-full items-center justify-between rounded-2xl border border-dashed border-chewy-blue/40 bg-blue-50/50 px-4 py-3 transition-colors hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="size-4 text-chewy-blue" />
                <span className="font-nunito text-sm font-semibold text-chewy-blue">
                  {pet
                    ? 'Invite a sitter or family member'
                    : 'Create a pet profile first'}
                </span>
              </div>
              <ChevronRight className="size-4 text-chewy-blue/60" />
            </button>
          </div>
        </SettingsSection>

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

      {pet && (
        <SitterInviteModal
          petId={pet.id}
          petName={pet.name}
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          onInvite={handleSendInvite}
        />
      )}
    </main>
  );
}
