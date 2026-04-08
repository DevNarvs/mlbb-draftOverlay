import { useCallback, useEffect, useState } from "react";

// Mirror of what the Convex `registrations:listForBroadcast` query returns
// after PII stripping. See convex/registrations.ts in the kahidlaw-youth
// Convex project — this type must stay in sync with the .map() projection there.
export interface ConvexTeamMember {
  ign: string;
  role?: string;
}

export interface ConvexTeam {
  _id: string;
  teamName: string;
  teamLogoUrl: string;
  status: string;
  tournamentId: string;
  members: ConvexTeamMember[];
}

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string | undefined;

// Calls the Convex `registrations:listForBroadcast` query over HTTP.
// No SDK required — this works even though the Convex project and this React
// app live in different folders. Trade-off: no real-time subscriptions
// (data only refreshes on refetch()).
export function useConvexTeams() {
  const [teams, setTeams] = useState<ConvexTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!CONVEX_URL) {
      setError("VITE_CONVEX_URL not set — check .env.local and restart `npm run dev`");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${CONVEX_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "registrations:listForBroadcast",
          args: {},
          format: "json",
        }),
      });
      const json = await res.json();
      if (json.status === "error") {
        throw new Error(json.errorMessage || "Convex query failed");
      }
      const list: ConvexTeam[] = (json.value ?? []).slice().sort(
        (a: ConvexTeam, b: ConvexTeam) => a.teamName.localeCompare(b.teamName)
      );
      setTeams(list);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      console.error("[useConvexTeams] fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { teams, loading, error, refetch };
}
