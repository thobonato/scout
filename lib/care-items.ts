import type { ActionCategory, CareItem } from '@/app/dog/[id]/home/types';

export const DEFAULT_ITEMS: CareItem[] = [
  { id: 'feed-kibble', category: 'feed', name: 'Kibble', icon: '🍖' },
  { id: 'feed-wet', category: 'feed', name: 'Wet Food', icon: '🥫' },
  { id: 'feed-treat', category: 'feed', name: 'Treat', icon: '🦴' },
  { id: 'feed-custom', category: 'feed', name: 'Custom', icon: '🍽️' },
  { id: 'play-fetch', category: 'play', name: 'Fetch', icon: '🎾' },
  { id: 'play-tug', category: 'play', name: 'Tug', icon: '🪢' },
  { id: 'play-walk', category: 'play', name: 'Walk', icon: '🚶' },
  { id: 'play-free', category: 'play', name: 'Free Play', icon: '🐕' },
  { id: 'med-morning', category: 'medicine', name: 'Morning Meds', icon: '💊' },
  { id: 'med-evening', category: 'medicine', name: 'Evening Meds', icon: '💊' },
  {
    id: 'med-supplement',
    category: 'medicine',
    name: 'Supplement',
    icon: '🧴',
  },
  { id: 'med-custom', category: 'medicine', name: 'Custom', icon: '🩺' },
];

export function getItemsByCategory(category: ActionCategory): CareItem[] {
  return DEFAULT_ITEMS.filter((item) => item.category === category);
}
