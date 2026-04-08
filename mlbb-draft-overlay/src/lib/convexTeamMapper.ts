import type { ConvexTeam } from "../hooks/useConvexTeams";
import type { Team } from "../types";

// Picks the longest word in the team name as a tag. Works for most esports names:
//   "1738 SQUAD"  → "SQUAD"
//   "AP BREN"     → "BREN"
//   "FALCON"      → "FALCON"
//   "ECHO"        → "ECHO"
// Capped at 6 chars so the 22px header font stays readable.
function autoTag(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const longest = words.reduce((a, b) => (b.length >= a.length ? b : a));
  return longest.toUpperCase().slice(0, 6);
}

// Normalizes member array into exactly 5 uppercase IGN slots for the overlay.
// Teams can register up to 6 members (starter + sub); we take the first 5.
// Missing slots are padded with empty strings so the UI never sees undefined.
function formatPlayers(members: ConvexTeam["members"]): string[] {
  const igns = (members ?? [])
    .slice(0, 5)
    .map((m) => (m.ign ?? "").trim().toUpperCase());
  while (igns.length < 5) igns.push("");
  return igns;
}

// Converts a raw Convex team record into the overlay's `Team` shape.
// The second arg preserves the current picks/bans — loading a team config
// should NEVER wipe an in-progress draft.
export function convexTeamToTeam(ct: ConvexTeam, current: Team): Team {
  return {
    name: (ct.teamName ?? "TEAM").trim().toUpperCase(),
    tag: autoTag(ct.teamName ?? ""),
    logo: ct.teamLogoUrl ?? "",
    players: formatPlayers(ct.members),
    picks: current.picks,
    bans: current.bans,
  };
}
