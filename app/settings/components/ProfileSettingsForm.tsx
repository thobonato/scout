'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { NotificationSettings, SettingsFormValues } from '@/types/views';

interface ProfileSettingsFormProps {
  values: SettingsFormValues;
  onChange: (updated: Partial<SettingsFormValues>) => void;
  isSaving?: boolean;
}

interface NotificationToggleItem {
  key: keyof NotificationSettings;
  label: string;
  description: string;
}

const NOTIFICATION_ITEMS: NotificationToggleItem[] = [
  {
    key: 'dailyReminders',
    label: 'Daily reminders',
    description: "Get a nudge when it's time to feed, medicate, or exercise",
  },
  {
    key: 'missedTaskAlerts',
    label: 'Missed task alerts',
    description: 'Notify me when a task was not completed by end of day',
  },
  {
    key: 'sitterUpdates',
    label: 'Sitter updates',
    description: "See what your sitter logs while you're away",
  },
  {
    key: 'weeklyDigest',
    label: 'Weekly digest',
    description: "A summary of your pet's weekly care activity",
  },
];

export function ProfileSettingsForm({
  values,
  onChange,
  isSaving,
}: ProfileSettingsFormProps) {
  function handleNotificationToggle(
    key: keyof NotificationSettings,
    checked: boolean
  ) {
    onChange({
      notifications: { ...values.notifications, [key]: checked },
    });
  }

  return (
    <div
      className={cn(
        'space-y-6 transition-opacity duration-200',
        isSaving && 'opacity-60 pointer-events-none'
      )}
    >
      {/* Profile Fields */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label
            htmlFor="owner-name"
            className="font-nunito text-sm font-semibold text-chewy-dark"
          >
            Your name
          </Label>
          <Input
            id="owner-name"
            value={values.ownerName}
            onChange={(e) => onChange({ ownerName: e.target.value })}
            placeholder="e.g. Alex"
            className="rounded-xl font-nunito text-sm border-gray-200 focus-visible:ring-chewy-blue"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="owner-email"
            className="font-nunito text-sm font-semibold text-chewy-dark"
          >
            Email
          </Label>
          <Input
            id="owner-email"
            type="email"
            value={values.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="you@example.com"
            className="rounded-xl font-nunito text-sm border-gray-200 focus-visible:ring-chewy-blue"
          />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Notification Toggles */}
      <div className="space-y-4">
        <p className="font-fredoka text-base font-semibold text-chewy-dark">
          Notifications
        </p>
        <div className="space-y-4">
          {NOTIFICATION_ITEMS.map((item) => (
            <div
              key={item.key}
              className="flex items-start justify-between gap-4"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-nunito text-sm font-semibold text-chewy-dark">
                  {item.label}
                </span>
                <span className="font-nunito text-xs text-gray-400 leading-relaxed">
                  {item.description}
                </span>
              </div>
              <Switch
                id={`notif-${item.key}`}
                checked={values.notifications[item.key]}
                onCheckedChange={(checked) =>
                  handleNotificationToggle(item.key, checked)
                }
                className="data-[state=checked]:bg-chewy-blue shrink-0 mt-0.5"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
