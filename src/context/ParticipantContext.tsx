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
  /** Set when the last refresh failed. The session is kept; offer a retry. */
  error: Error | null;
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
  const [error, setError] = useState<Error | null>(null);

  const setParticipantId = useCallback((id: string | null) => {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
    setId(id);
  }, []);

  const refresh = useCallback(async () => {
    if (!participantId) {
      setRecord(null);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rec = await store.getRecord(participantId);
      if (rec) {
        setRecord(rec);
        setError(null);
      } else {
        // The query SUCCEEDED and returned nothing, so the record really is
        // gone (deleted from admin, or a stale id from another event). Only
        // here is it right to drop the session.
        setParticipantId(null);
        setRecord(null);
        setError(null);
      }
    } catch (err) {
      // The query FAILED — offline, a dropped request, a Supabase hiccup. We
      // have no idea whether the record exists, so keep the participant signed
      // in and let them retry. Signing out here is what used to lose people's
      // sessions the moment the network blinked.
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [participantId, setParticipantId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Come back from a dropped connection or a backgrounded tab and re-sync,
  // so a failed load repairs itself instead of sitting stale.
  useEffect(() => {
    if (!participantId) return;
    const retry = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener("online", retry);
    document.addEventListener("visibilitychange", retry);
    return () => {
      window.removeEventListener("online", retry);
      document.removeEventListener("visibilitychange", retry);
    };
  }, [participantId, refresh]);

  const signOut = useCallback(() => {
    setParticipantId(null);
    setRecord(null);
    setError(null);
  }, [setParticipantId]);

  const value = useMemo<ParticipantValue>(
    () => ({
      participantId,
      record,
      loading,
      error,
      setParticipantId,
      refresh,
      signOut,
    }),
    [participantId, record, loading, error, setParticipantId, refresh, signOut]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useParticipant(): ParticipantValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useParticipant must be used within ParticipantProvider");
  return ctx;
}
