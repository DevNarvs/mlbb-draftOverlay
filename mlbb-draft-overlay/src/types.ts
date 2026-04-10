export type Role = "Tank" | "Fighter" | "Assassin" | "Mage" | "Marksman" | "Support";
export type TeamSide = "blue" | "red";
export type ActionType = "ban" | "pick";
export type OverlayTheme = "classic" | "broadcast";
export type DraftFormat = "5ban" | "3ban";

export interface Hero {
  id: string;
  name: string;
  heroId?: number;
  role: Role;
  head: string | null;     // remote thumbnail URL from API
  image: string | null;    // optional override (PORTRAIT_MAP wiki portraits)
  smallmap: string | null; // local /heroes/{id}-{slug}.png from public/heroes.json
}

export interface Team {
  picks: Hero[];
  bans: Hero[];
  name: string;
  tag: string;
  logo: string;
  players: string[];
}

export type DraftPhase = "ban1" | "pick1" | "ban2" | "pick2" | "ban3" | "pick3";

export interface DraftStep {
  phase: DraftPhase;
  type: ActionType;
  team: TeamSide;
  label: string;
}

export interface HistoryEntry {
  hero: Hero;
  action: ActionType;
  team: TeamSide;
}

export interface AppState {
  step: number;
  blue: Team;
  red: Team;
  timer: number;
  td: number;
  started: boolean;
  paused: boolean;
  done: boolean;
  history: HistoryEntry[];
  gameNum: number;
  matchType: string;
  matchWeek: string;
  sponsors: string[];
  sponsorLogos: string[];
  // Which overlay skin to render. Toggled from the admin bar.
  theme: OverlayTheme;
  draftFormat: DraftFormat;
  // Broadcast-theme-only fields. Classic theme ignores these.
  mapName: string;
  scoreBlue: number;
  scoreRed: number;
  bestOf: number;
}
