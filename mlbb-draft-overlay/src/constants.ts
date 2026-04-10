import type { DraftFormat, DraftStep, Role } from "./types";

// Role map for heroes (fallback)
export const ROLE_MAP: Record<string, Role> = {
  "Miya":"Marksman","Balmond":"Fighter","Saber":"Assassin","Alice":"Mage","Nana":"Mage",
  "Tigreal":"Tank","Alucard":"Fighter","Karina":"Assassin","Akai":"Tank","Franco":"Tank",
  "Bane":"Fighter","Bruno":"Marksman","Clint":"Marksman","Rafaela":"Support","Eudora":"Mage",
  "Zilong":"Fighter","Fanny":"Assassin","Layla":"Marksman","Minotaur":"Tank","Lolita":"Tank",
  "Hayabusa":"Assassin","Freya":"Fighter","Gord":"Mage","Natalia":"Assassin","Kagura":"Mage",
  "Chou":"Fighter","Sun":"Fighter","Alpha":"Fighter","Ruby":"Fighter","Yi Sun-shin":"Marksman",
  "Moskov":"Marksman","Johnson":"Tank","Cyclops":"Mage","Estes":"Support","Hilda":"Fighter",
  "Aurora":"Mage","Lapu-Lapu":"Fighter","Vexana":"Mage","Roger":"Fighter","Karrie":"Marksman",
  "Gatotkaca":"Tank","Jawhead":"Fighter","Irithel":"Marksman","Grock":"Tank","Argus":"Fighter",
  "Odette":"Mage","Lancelot":"Assassin","Diggie":"Support","Hylos":"Tank","Zhask":"Mage",
  "Helcurt":"Assassin","Pharsa":"Mage","Lesley":"Marksman","Martis":"Fighter","Hanabi":"Marksman",
  "Chang'e":"Mage","Kaja":"Support","Selena":"Assassin","Barats":"Tank","Aldous":"Fighter",
  "Claude":"Marksman","Valir":"Mage","Badang":"Fighter","Khufra":"Tank","Granger":"Marksman",
  "Guinevere":"Fighter","Esmeralda":"Mage","Kadita":"Mage","Cecilion":"Mage","Carmilla":"Support",
  "Atlas":"Tank","Popol and Kupa":"Marksman","Yu Zhong":"Fighter","Luo Yi":"Mage",
  "Benedetta":"Assassin","Brody":"Marksman","Paquito":"Fighter","Lunox":"Mage","Belerick":"Tank",
  "Baxia":"Tank","Minsitthar":"Fighter","Thamuz":"Fighter","Khaleed":"Fighter","Wanwan":"Marksman",
  "Silvanna":"Fighter","X.Borg":"Fighter","Dyrroth":"Fighter","Harith":"Mage","Gusion":"Assassin",
  "Beatrix":"Marksman","Faramis":"Support","Leomord":"Fighter","Hanzo":"Assassin",
  "Terizla":"Fighter","Kimmy":"Marksman","Mathilda":"Support","Phoveus":"Fighter","Edith":"Tank",
  "Masha":"Fighter","Harley":"Assassin","Lylia":"Mage","Vale":"Mage","Angela":"Support",
  "Floryn":"Support","Valentina":"Mage","Aamon":"Assassin","Aulus":"Fighter","Natan":"Marksman",
  "Uranus":"Tank","Gloo":"Tank","Fredrinn":"Fighter","Joy":"Assassin","Xavier":"Mage",
  "Melissa":"Marksman","Yin":"Fighter","Arlott":"Fighter","Novaria":"Mage","Nolan":"Assassin",
  "Ixia":"Marksman","Cici":"Fighter","Chip":"Support","Julian":"Assassin","Zhuxin":"Mage",
  "Suyou":"Assassin","Lukas":"Fighter","Kalea":"Support","Zetian":"Mage","Obsidia":"Marksman",
  "Sora":"Fighter","Marcel":"Support",
};

// Portrait overrides (wiki full portraits)
export const PORTRAIT_MAP: Record<string, string> = {
  "Aamon":"https://static.wikia.nocookie.net/mobile-legends/images/c/c8/Hero1091-portrait.png/revision/latest?cb=20251225192214",
  "Diggie":"https://static.wikia.nocookie.net/mobile-legends/images/1/17/Hero481-portrait.png/revision/latest?cb=20241021141804",
  "Sora":"https://static.wikia.nocookie.net/mobile-legends/images/0/00/Hero1311-portrait.png/revision/latest?cb=20251218014024",
};

export const ROLES: ReadonlyArray<"All" | Role> = ["All","Tank","Fighter","Assassin","Mage","Marksman","Support"];
export const ROLE_ICONS: Record<Role, string> = {
  Tank:"🛡",Fighter:"⚔",Assassin:"🗡",Mage:"✦",Marksman:"◎",Support:"♥",
};

// ─── Meta tier rankings ─────────────────────────────────────────────
// Source: MPL PH Season 17 competitive stats, scraped from
//   https://ph-mpl.com/data
//
// Tiers are derived from PRESENCE RATE = pick% + ban%, which measures
// how often a hero is CONTESTED in the draft (either picked or banned).
// This is the industry-standard competitive metric — a hero with 86%
// ban rate and 14% pick rate has 100% presence (Freya), meaning every
// draft had to account for them.
//
// Thresholds:
//   S-tier: ≥ 80% presence  (8 heroes — must-respect meta defining)
//   A-tier: 50-80% presence (12 heroes — strong meta picks)
//   B-tier: 20-50% presence (11 heroes — situational / comfort)
//   C-tier: 5-20% presence  (14 heroes — fringe / occasionally seen)
//   D-tier: < 5% presence   (10 heroes — appeared once in the split)
//   unranked: zero picks + zero bans in MPL PH (~77 heroes)
//
// Format of each comment: "pick% + ban% = presence% (win% over N picks)"
// so you can see the raw data per hero and judge tier boundaries if
// you want to adjust thresholds.
//
// To UPDATE after a new MPL PH patch/split: re-scrape ph-mpl.com/data
// and rewrite this object — the sort + badge logic reads from here
// and will automatically reflect changes.
export type HeroTier = "S" | "A" | "B" | "C" | "D";
export const HERO_TIER: Record<string, HeroTier> = {
  // ─── S-tier (presence ≥ 80%) — meta-defining, can't ignore ───
  "Freya":"S",      // 14% pick + 86% ban = 100% presence (60% wr)
  "Zhuxin":"S",     // 19% + 78% = 97% (57% wr)
  "Baxia":"S",      // 25% + 67% = 92% (78% wr — insane)
  "Yve":"S",        // 56% + 33% = 89% (55% wr)
  "Kalea":"S",      // 22% + 64% = 86% (75% wr)
  "Leomord":"S",    // 50% + 33% = 83% (39% wr)
  "Sora":"S",       // 50% + 31% = 81% (67% wr)
  "Valentina":"S",  // 42% + 39% = 81% (80% wr — highest in S-tier)
  // ─── A-tier (50-80% presence) — strong meta picks ───
  "Claude":"A",     // 61% + 11% = 72% (50% wr — most-picked hero)
  "Phoveus":"A",    // 42% + 31% = 73% (33% wr)
  "Karrie":"A",     // 39% + 33% = 72% (50% wr)
  "Hilda":"A",      // 22% + 47% = 69% (38% wr)
  "Khaleed":"A",    // 50% + 17% = 67% (39% wr)
  "Fredrinn":"A",   // 31% + 31% = 61% (45% wr)
  "Lapu-Lapu":"A",  // 47% + 11% = 58% (47% wr)
  "Guinevere":"A",  // 11% + 47% = 58% (75% wr)
  "Fanny":"A",      // 8% + 50% = 58% (0% wr — banned as respect pick)
  "Harith":"A",     // 25% + 28% = 53% (78% wr)
  "Suyou":"A",      // 31% + 19% = 50% (55% wr)
  "Hylos":"A",      // 22% + 28% = 50% (50% wr)
  // ─── B-tier (20-50% presence) — situational / comfort ───
  "Grock":"B",      // 19% + 28% = 47% (43% wr)
  "Harley":"B",     // 31% + 11% = 42% (55% wr)
  "Kimmy":"B",      // 25% + 14% = 39% (56% wr)
  "Pharsa":"B",     // 25% + 8% = 33% (11% wr)
  "Marcel":"B",     // 17% + 17% = 33% (50% wr)
  "Yi Sun-shin":"B",// 17% + 17% = 33% (33% wr)
  "Gatotkaca":"B",  // 11% + 22% = 33% (75% wr)
  "Gloo":"B",       // 22% + 8% = 31% (50% wr)
  "Moskov":"B",     // 17% + 8% = 25% (33% wr)
  "Chou":"B",       // 19% + 3% = 22% (43% wr)
  "Arlott":"B",     // 6% + 17% = 22% (50% wr)
  // ─── C-tier (5-20% presence) — fringe picks ───
  "Zetian":"C",     // 14% + 6% = 19% (40% wr)
  "Alice":"C",      // 14% + 6% = 19% (40% wr)
  "Yu Zhong":"C",   // 11% + 6% = 17% (100% wr — undefeated niche)
  "Cici":"C",       // 8% + 8% = 17% (33% wr)
  "Uranus":"C",     // 8% + 8% = 17% (33% wr)
  "Valir":"C",      // 6% + 3% = 8% (0% wr)
  "Chip":"C",       // 6% + 3% = 8% (50% wr)
  "Lylia":"C",      // 3% + 6% = 8% (100% wr)
  "Hayabusa":"C",   // 6% + 0% = 6% (50% wr)
  "Gord":"C",       // 6% + 0% = 6% (0% wr)
  "Nolan":"C",      // 6% + 0% = 6% (50% wr)
  "Kaja":"C",       // 3% + 3% = 6% (100% wr)
  "Granger":"C",    // 6% + 0% = 6% (100% wr)
  "Esmeralda":"C",  // 3% + 3% = 6% (0% wr)
  // ─── D-tier (< 5% presence) — one-game cameos ───
  "Balmond":"D",    // 3% + 0% = 3% (0% wr)
  "Vexana":"D",     // 3% + 0% = 3% (0% wr)
  "Lesley":"D",     // 3% + 0% = 3% (0% wr)
  "Hanabi":"D",     // 3% + 0% = 3% (0% wr)
  "Lunox":"D",      // 3% + 0% = 3% (0% wr)
  "Benedetta":"D",  // 3% + 0% = 3% (100% wr)
  "Brody":"D",      // 3% + 0% = 3% (100% wr)
  "Terizla":"D",    // 3% + 0% = 3% (0% wr)
  "Wanwan":"D",     // 3% + 0% = 3% (0% wr)
  "Obsidia":"D",    // 3% + 0% = 3% (0% wr)
  // All other ~77 heroes fall through to "unranked" — they had
  // zero picks and zero bans in MPL PH Season 17 and are outside
  // the current professional meta.
};

export const TIER_RANK: Record<HeroTier, number> = { S:0, A:1, B:2, C:3, D:4 };
export const UNRANKED_RANK = 99;
// Resolve a tier index for sorting. Lower = appears first.
export function tierRankOf(heroName: string): number {
  const t = HERO_TIER[heroName];
  return t ? TIER_RANK[t] : UNRANKED_RANK;
}

// ─── Raw MPL PH Season 17 stats ─────────────────────────────────────
// Source: https://ph-mpl.com/data (same as HERO_TIER above).
// Stored separately so the sort comparator can use the ban rate as a
// secondary sort key within each tier — more meta-accurate than
// alphabetical. Ordering within S-tier becomes "most feared first".
export interface HeroStats {
  pick: number; // pick rate as percentage 0-100
  ban:  number; // ban rate as percentage 0-100
  win:  number; // win rate as percentage 0-100
}
export const HERO_STATS: Record<string, HeroStats> = {
  "Freya":      { pick: 13.89, ban: 86.11, win: 60    },
  "Zhuxin":     { pick: 19.44, ban: 77.78, win: 57.14 },
  "Baxia":      { pick: 25.00, ban: 66.67, win: 77.78 },
  "Yve":        { pick: 55.56, ban: 33.33, win: 55    },
  "Kalea":      { pick: 22.22, ban: 63.89, win: 75    },
  "Leomord":    { pick: 50.00, ban: 33.33, win: 38.89 },
  "Sora":       { pick: 50.00, ban: 30.56, win: 66.67 },
  "Valentina":  { pick: 41.67, ban: 38.89, win: 80    },
  "Claude":     { pick: 61.11, ban: 11.11, win: 50    },
  "Phoveus":    { pick: 41.67, ban: 30.56, win: 33.33 },
  "Karrie":     { pick: 38.89, ban: 33.33, win: 50    },
  "Hilda":      { pick: 22.22, ban: 47.22, win: 37.5  },
  "Khaleed":    { pick: 50.00, ban: 16.67, win: 38.89 },
  "Fredrinn":   { pick: 30.56, ban: 30.56, win: 45.45 },
  "Lapu-Lapu":  { pick: 47.22, ban: 11.11, win: 47.06 },
  "Guinevere":  { pick: 11.11, ban: 47.22, win: 75    },
  "Fanny":      { pick:  8.33, ban: 50.00, win:  0    },
  "Harith":     { pick: 25.00, ban: 27.78, win: 77.78 },
  "Suyou":      { pick: 30.56, ban: 19.44, win: 54.55 },
  "Hylos":      { pick: 22.22, ban: 27.78, win: 50    },
  "Grock":      { pick: 19.44, ban: 27.78, win: 42.86 },
  "Harley":     { pick: 30.56, ban: 11.11, win: 54.55 },
  "Kimmy":      { pick: 25.00, ban: 13.89, win: 55.56 },
  "Pharsa":     { pick: 25.00, ban:  8.33, win: 11.11 },
  "Marcel":     { pick: 16.67, ban: 16.67, win: 50    },
  "Yi Sun-shin":{ pick: 16.67, ban: 16.67, win: 33.33 },
  "Gatotkaca":  { pick: 11.11, ban: 22.22, win: 75    },
  "Gloo":       { pick: 22.22, ban:  8.33, win: 50    },
  "Moskov":     { pick: 16.67, ban:  8.33, win: 33.33 },
  "Chou":       { pick: 19.44, ban:  2.78, win: 42.86 },
  "Arlott":     { pick:  5.56, ban: 16.67, win: 50    },
  "Zetian":     { pick: 13.89, ban:  5.56, win: 40    },
  "Alice":      { pick: 13.89, ban:  5.56, win: 40    },
  "Yu Zhong":   { pick: 11.11, ban:  5.56, win:100    },
  "Cici":       { pick:  8.33, ban:  8.33, win: 33.33 },
  "Uranus":     { pick:  8.33, ban:  8.33, win: 33.33 },
  "Valir":      { pick:  5.56, ban:  2.78, win:  0    },
  "Chip":       { pick:  5.56, ban:  2.78, win: 50    },
  "Lylia":      { pick:  2.78, ban:  5.56, win:100    },
  "Hayabusa":   { pick:  5.56, ban:  0,    win: 50    },
  "Gord":       { pick:  5.56, ban:  0,    win:  0    },
  "Nolan":      { pick:  5.56, ban:  0,    win: 50    },
  "Kaja":       { pick:  2.78, ban:  2.78, win:100    },
  "Granger":    { pick:  5.56, ban:  0,    win:100    },
  "Esmeralda":  { pick:  2.78, ban:  2.78, win:  0    },
  "Balmond":    { pick:  2.78, ban:  0,    win:  0    },
  "Vexana":     { pick:  2.78, ban:  0,    win:  0    },
  "Lesley":     { pick:  2.78, ban:  0,    win:  0    },
  "Hanabi":     { pick:  2.78, ban:  0,    win:  0    },
  "Lunox":      { pick:  2.78, ban:  0,    win:  0    },
  "Benedetta":  { pick:  2.78, ban:  0,    win:100    },
  "Brody":      { pick:  2.78, ban:  0,    win:100    },
  "Terizla":    { pick:  2.78, ban:  0,    win:  0    },
  "Wanwan":     { pick:  2.78, ban:  0,    win:  0    },
  "Obsidia":    { pick:  2.78, ban:  0,    win:  0    },
};
// Helper: ban rate for a hero, 0 if the hero isn't in MPL PH data.
export function banRateOf(heroName: string): number {
  return HERO_STATS[heroName]?.ban ?? 0;
}

// 5-ban format (standard MPL): 5 bans + 5 picks per side = 20 steps
const DRAFT_SEQ_5BAN: DraftStep[] = [
  // Ban phase 1 — 3 per side
  {phase:"ban1",type:"ban",team:"blue",label:"BAN PHASE 1"},{phase:"ban1",type:"ban",team:"red",label:"BAN PHASE 1"},
  {phase:"ban1",type:"ban",team:"blue",label:"BAN PHASE 1"},{phase:"ban1",type:"ban",team:"red",label:"BAN PHASE 1"},
  {phase:"ban1",type:"ban",team:"blue",label:"BAN PHASE 1"},{phase:"ban1",type:"ban",team:"red",label:"BAN PHASE 1"},
  // Pick phase 1 — 2 per side (snake)
  {phase:"pick1",type:"pick",team:"blue",label:"PICK PHASE 1"},{phase:"pick1",type:"pick",team:"red",label:"PICK PHASE 1"},
  {phase:"pick1",type:"pick",team:"red",label:"PICK PHASE 1"},{phase:"pick1",type:"pick",team:"blue",label:"PICK PHASE 1"},
  // Ban phase 2 — 2 per side
  {phase:"ban2",type:"ban",team:"red",label:"BAN PHASE 2"},{phase:"ban2",type:"ban",team:"blue",label:"BAN PHASE 2"},
  {phase:"ban2",type:"ban",team:"red",label:"BAN PHASE 2"},{phase:"ban2",type:"ban",team:"blue",label:"BAN PHASE 2"},
  // Pick phase 2 — 2 per side (snake)
  {phase:"pick2",type:"pick",team:"red",label:"PICK PHASE 2"},{phase:"pick2",type:"pick",team:"blue",label:"PICK PHASE 2"},
  {phase:"pick2",type:"pick",team:"blue",label:"PICK PHASE 2"},{phase:"pick2",type:"pick",team:"red",label:"PICK PHASE 2"},
  // Pick phase 3 — 1 per side
  {phase:"pick3",type:"pick",team:"red",label:"PICK PHASE 3"},{phase:"pick3",type:"pick",team:"blue",label:"PICK PHASE 3"},
];

// 3-ban format: 3 bans + 5 picks per side = 16 steps
const DRAFT_SEQ_3BAN: DraftStep[] = [
  // Ban phase 1 — 2 per side
  {phase:"ban1",type:"ban",team:"blue",label:"BAN PHASE 1"},{phase:"ban1",type:"ban",team:"red",label:"BAN PHASE 1"},
  {phase:"ban1",type:"ban",team:"blue",label:"BAN PHASE 1"},{phase:"ban1",type:"ban",team:"red",label:"BAN PHASE 1"},
  // Pick phase 1 — 3 per side (snake: 1-2-2-1)
  {phase:"pick1",type:"pick",team:"blue",label:"PICK PHASE 1"},{phase:"pick1",type:"pick",team:"red",label:"PICK PHASE 1"},
  {phase:"pick1",type:"pick",team:"red",label:"PICK PHASE 1"},{phase:"pick1",type:"pick",team:"blue",label:"PICK PHASE 1"},
  {phase:"pick1",type:"pick",team:"blue",label:"PICK PHASE 1"},{phase:"pick1",type:"pick",team:"red",label:"PICK PHASE 1"},
  // Ban phase 2 — 1 per side
  {phase:"ban2",type:"ban",team:"blue",label:"BAN PHASE 2"},{phase:"ban2",type:"ban",team:"red",label:"BAN PHASE 2"},
  // Pick phase 2 — 2 per side (alternating)
  {phase:"pick2",type:"pick",team:"blue",label:"PICK PHASE 2"},{phase:"pick2",type:"pick",team:"red",label:"PICK PHASE 2"},
  {phase:"pick2",type:"pick",team:"blue",label:"PICK PHASE 2"},{phase:"pick2",type:"pick",team:"red",label:"PICK PHASE 2"},
];

export function getDraftSeq(format: DraftFormat): DraftStep[] {
  return format === "3ban" ? DRAFT_SEQ_3BAN : DRAFT_SEQ_5BAN;
}

export function getBansPerSide(format: DraftFormat): number {
  return format === "3ban" ? 3 : 5;
}

export const DT = 30;
