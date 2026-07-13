import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { store } from "../data/store";
import type { ParticipantRecord } from "../data/types";

const SESSION_KEY = "attendify:currentParticipantId";

interface ParticipantValue {
  participantId: string | null;
  record: ParticipantRecord | null;
  loading: boolean;
  setParticipantId: (id: string | null) => void;
  refresh: () => Promise<void>;
  signOut: () => void;
}

const Ctx = createContext<ParticipantValue | null>(null);

export function ParticipantProvider({ children }: { children: React.ReactNode }) {
  const [participantId, setId] = useState<string | null>(
    () => localStorage.getItem(SESSION_KEY)
  );
  const [record, setRecord] = useState<ParticipantRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(participantId));

  const setParticipantId = useCallback((id: string | null) => {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
    setId(id);
  }, []);

  const refresh = useCallback(async () => {
    if (!participantId) {
      setRecord(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rec = await store.getRecord(participantId);
      setRecord(rec);
      // If the id points at nothing (e.g. cleared data), reset the session.
      if (!rec) setParticipantId(null);
    } finally {
      setLoading(false);
    }
  }, [participantId, setParticipantId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signOut = useCallback(() => {
    setParticipantId(null);
    setRecord(null);
  }, [setParticipantId]);

  const value = useMemo<ParticipantValue>(
    () => ({ participantId, record, loading, setParticipantId, refresh, signOut }),
    [participantId, record, loading, setParticipantId, refresh, signOut]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useParticipant(): ParticipantValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useParticipant must be used within ParticipantProvider");
  return ctx;
}
