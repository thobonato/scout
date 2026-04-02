'use client';

import type { ActionCategory } from '@/types/views';
import { useState } from 'react';

interface FloatingEmojiProps {
  category: ActionCategory | null;
  trigger: number;
}

const EMOJI_SETS: Record<ActionCategory, string[]> = {
  feed: ['🍖', '🦴', '🥩', '🍗', '😋'],
  play: ['🎾', '🐕', '⚡', '🏃', '🎉'],
  medicine: ['💊', '💪', '✨', '🩺', '❤️'],
};

interface FloatingItem {
  id: number;
  emoji: string;
  left: number;
  delay: number;
}

function generateItems(category: ActionCategory): FloatingItem[] {
  const emojis = EMOJI_SETS[category];
  const count = 6 + Math.floor(Math.random() * 3);

  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    left: 20 + Math.random() * 60,
    delay: Math.random() * 0.4,
  }));
}

export function FloatingEmoji({ category, trigger }: FloatingEmojiProps) {
  const [prevTrigger, setPrevTrigger] = useState(0);
  const [items, setItems] = useState<FloatingItem[]>([]);

  // Derive state from props change (no useEffect needed)
  if (trigger !== prevTrigger) {
    setPrevTrigger(trigger);

    if (trigger > 0 && category) {
      const newItems = generateItems(category);
      setItems(newItems);

      // Clear after animation completes
      setTimeout(() => setItems([]), 1400);
    }
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute text-2xl animate-float-emoji"
          style={{
            left: `${item.left}%`,
            bottom: '20%',
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
