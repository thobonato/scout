'use client';

import { useState } from 'react';
import { Copy, Check, Mail, UserCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { SitterInvitePayload, SitterRole } from '../types';

interface SitterInviteModalProps {
  petId: string;
  petName: string;
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (payload: SitterInvitePayload) => Promise<{ token: string }>;
}

const ROLE_OPTIONS: Array<{
  value: SitterRole;
  label: string;
  description: string;
}> = [
  {
    value: 'full_access',
    label: 'Full Access',
    description: 'Can log tasks, view schedule & health info',
  },
  {
    value: 'view_only',
    label: 'View Only',
    description: 'Can view schedule but cannot log tasks',
  },
];

const INVITE_LINK_BASE = 'https://scout-six-tan.vercel.app/invite';

export function SitterInviteModal({
  petId,
  petName,
  isOpen,
  onClose,
  onInvite,
}: SitterInviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<SitterRole>('full_access');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [inviteToken, setInviteToken] = useState('');

  function validateEmail(value: string): boolean {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isValid) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }

    return isValid;
  }

  async function handleSendInvite() {
    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onInvite?.({ email, role, petId });
      if (result?.token) {
        setInviteToken(result.token);
      }
      setIsSent(true);
    } catch {
      setEmailError('Failed to send invite. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopyLink() {
    const link = inviteToken
      ? `${INVITE_LINK_BASE}?token=${inviteToken}`
      : INVITE_LINK_BASE;
    await navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  function handleClose() {
    setEmail('');
    setRole('full_access');
    setIsSent(false);
    setInviteToken('');
    setEmailError('');
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-fredoka text-xl text-chewy-dark">
            Invite a Sitter 🐾
          </DialogTitle>
          <DialogDescription className="font-nunito text-sm text-gray-500">
            Share access to {petName}&apos;s care routine with a sitter or
            family member.
          </DialogDescription>
        </DialogHeader>

        {isSent ? (
          /* Success state */
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-100">
              <UserCheck className="size-7 text-green-600" />
            </div>
            <div>
              <p className="font-fredoka text-lg font-semibold text-chewy-dark">
                Invite sent!
              </p>
              <p className="font-nunito text-sm text-gray-500 mt-1">
                We emailed{' '}
                <span className="font-semibold text-chewy-dark">{email}</span>{' '}
                with access to {petName}&apos;s profile.
              </p>
            </div>
            {inviteToken && (
              <div className="w-full space-y-1.5">
                <p className="font-nunito text-xs font-semibold text-gray-500">
                  Or share this link directly
                </p>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${INVITE_LINK_BASE}?token=${inviteToken}`}
                    className="rounded-xl font-nunito text-xs text-gray-500 border-gray-200 bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    className="shrink-0 rounded-xl border-gray-200"
                    aria-label="Copy invite link"
                  >
                    {isCopied ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <Copy className="size-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            <Button
              onClick={handleClose}
              className="mt-2 rounded-full bg-chewy-blue text-white font-fredoka hover:bg-chewy-blue/90"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-5 py-2">
              {/* Email input */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="sitter-email"
                  className="font-nunito text-sm font-semibold text-chewy-dark"
                >
                  Sitter&apos;s email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="sitter-email"
                    type="email"
                    placeholder="sitter@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) {
                        validateEmail(e.target.value);
                      }
                    }}
                    className={cn(
                      'pl-9 rounded-xl font-nunito text-sm border-gray-200 focus-visible:ring-chewy-blue',
                      emailError && 'border-red-400 focus-visible:ring-red-400'
                    )}
                  />
                </div>
                {emailError && (
                  <p className="font-nunito text-xs text-red-500">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Role selector */}
              <div className="space-y-2">
                <p className="font-nunito text-sm font-semibold text-chewy-dark">
                  Access level
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={cn(
                        'flex flex-col items-start rounded-2xl border p-3 text-left transition-all duration-150',
                        role === option.value
                          ? 'border-chewy-blue bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      )}
                    >
                      <span
                        className={cn(
                          'font-nunito text-sm font-semibold',
                          role === option.value
                            ? 'text-chewy-blue'
                            : 'text-chewy-dark'
                        )}
                      >
                        {option.label}
                      </span>
                      <span className="font-nunito text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="rounded-full font-fredoka text-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvite}
                disabled={isSubmitting || !email}
                className="rounded-full bg-chewy-blue text-white font-fredoka hover:bg-chewy-blue/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending…' : 'Send Invite'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
