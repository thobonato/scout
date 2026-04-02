import type { SitterSession } from '@/types/views';

const STORAGE_KEY = 'scout_sitter_sessions';

export function loadSitterSessions(): SitterSession[] {
  const stored = globalThis.localStorage?.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  return JSON.parse(stored) as SitterSession[];
}

interface CreateSessionInput {
  dogId: string;
  label: string;
  startDate: string;
  endDate: string;
  dropOffTime: string;
  pickUpTime: string;
}

export function createSitterSession(input: CreateSessionInput): SitterSession {
  const session: SitterSession = {
    id: crypto.randomUUID(),
    token: crypto.randomUUID(),
    dogId: input.dogId,
    createdAt: new Date().toISOString(),
    label: input.label,
    startDate: input.startDate,
    endDate: input.endDate,
    dropOffTime: input.dropOffTime,
    pickUpTime: input.pickUpTime,
  };

  const sessions = loadSitterSessions();
  sessions.push(session);
  globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(sessions));

  return session;
}

export function revokeSitterSession(sessionId: string): void {
  const sessions = loadSitterSessions();
  const updated = sessions.filter((s) => s.id !== sessionId);
  globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(updated));
}
