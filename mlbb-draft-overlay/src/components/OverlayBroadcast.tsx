import { useEffect, useState } from "react";
import type { ActionType, AppState, DraftStep, Hero, TeamSide } from "../types";

interface OverlayBroadcastProps {
  s: AppState;
  cur: DraftStep | null;
}

// Pick the best available portrait for a hero. Same fallback chain as PickCard
// so hero art stays consistent when the user switches themes mid-draft.
function heroPortrait(h: Hero): string | null {
  return h.image ?? h.smallmap ?? h.head ?? null;
}

// Who's currently acting, on which side, for which slot index?
// Covers BOTH ban and pick phases — previously this only returned
// pick slots, which meant ban phase had no visual indicator at all.
function activeSlot(
  cur: DraftStep | null,
  s: AppState,
): { side: TeamSide; type: ActionType; idx: number } | null {
  if (!cur) return null;
  const arr = cur.type === "pick" ? s[cur.team].picks : s[cur.team].bans;
  return { side: cur.team, type: cur.type, idx: arr.length };
}

// Shrink player-name font-size tiers by character length so long
// esports IGNs fit inside the 160px player cell without truncating.
// Mirrors the tiered approach used by PlayersRow.tsx in the classic
// theme (which scales the team tag indicator based on tag length).
function pnameStyle(name: string): { fontSize: number; letterSpacing: number } {
  const len = name.length;
  if (len <= 10) return { fontSize: 13, letterSpacing: 2 };
  if (len <= 12) return { fontSize: 11, letterSpacing: 1.5 };
  if (len <= 14) return { fontSize: 10, letterSpacing: 1 };
  if (len <= 17) return { fontSize: 9,  letterSpacing: 0.75 };
  return           { fontSize: 8,  letterSpacing: 0.5 };
}

//
// ─── USER CONTRIBUTION #1 ────────────────────────────────────────────
// Decide what label sits under the big center timer ("BANNING", "PICKING",
// "WAITING", "COMPLETE", etc.) based on the current draft state.
//
// The classic theme uses `cur?.label` directly, which shows things like
// "BAN 1" / "PICK 3" — very procedural. The broadcast design has room
// for a SHORTER, more broadcast-friendly label. You decide what fits.
//
// Constraints:
//   - Return a string, all caps
//   - Keep it short (the ban-label is only 10px wide)
//   - Handle: not started, between picks, ban phase, pick phase, complete
//
// Example approaches:
//   (a) Always show cur?.type.toUpperCase() — "BAN" or "PICK"
//   (b) Show phase-specific: "BAN 1" / "PICK 2" etc. like classic
//   (c) Show match-state: "WAITING" / "BANNING" / "PICKING" / "COMPLETE"
//
// TODO(you): fill in the body of this function with your preferred wording.
//
function phaseLabel(cur: DraftStep | null, s: AppState): string {
  if (s.done) return "COMPLETE";
  if (!s.started) return "WAITING";
  if (!cur) return "READY";
  return cur.type === "ban" ? "BANNING" : "PICKING";
}
// ─────────────────────────────────────────────────────────────────────

export default function OverlayBroadcast({ s, cur }: OverlayBroadcastProps) {
  const active = activeSlot(cur, s);
  const activePick = active?.type === "pick" ? active : null;
  const activeBan = active?.type === "ban" ? active : null;
  const gameLabel = `${s.matchWeek} — GAME ${s.gameNum}`;
  const activeTeamSide = cur?.team ?? null;

  // Rotating sponsor — cycles through s.sponsors / s.sponsorLogos every
  // 3 seconds. The `key={spIdx}` on the rendered element re-triggers
  // the CSS fade animation automatically on each tick.
  const [spIdx, setSpIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(
      () => setSpIdx((p) => (p + 1) % Math.max(s.sponsors.length, 1)),
      3000,
    );
    return () => clearInterval(iv);
  }, [s.sponsors.length]);

  return (
    <div className="overlay-broadcast">
      <div className="draft-section">
        {/* Top team bar — blue team name on left, red team name on right.
            Class name `.coach-bar` is a legacy from the original HTML
            source; kept for CSS continuity but semantically this is now
            a team-name strip. */}
        <div className="coach-bar">
          <div className="coach">
            <span>{s.blue.name}</span>
          </div>
          <div className="coach">
            <span>{s.red.name}</span>
          </div>
        </div>

        {/* Bans row — mirrors the hero column layout exactly so each
            ban cell sits directly above its corresponding pick slot.
            NOTE: class names are .b-bans / .b-bans-half / .b-bans-label
            (prefixed with b-) to avoid collision with the classic theme's
            .bans-row / .bans-side / .bans-center which are unscoped. */}
        <div className="b-bans">
          <div className="b-bans-half left-side">
            {renderBanCells(s, "blue", activeBan)}
          </div>
          <div className="b-bans-label">BANS</div>
          <div className="b-bans-half right-side">
            {renderBanCells(s, "red", activeBan)}
          </div>
        </div>

        {/* Main draft row: 5 left heroes — center column — 5 right heroes */}
        <div className="draft-row">
          <div className="heroes left-side">
            {renderHeroColumn(s, "blue", activePick)}
          </div>

          <div className="center-col">
            <div className="team-row">
              <div className="t-badge lb">
                {s.blue.logo
                  ? <img src={s.blue.logo} alt={s.blue.tag} />
                  : s.blue.tag}
              </div>
              <div className="vs-label">VS</div>
              <div className="t-badge rb">
                {s.red.logo
                  ? <img src={s.red.logo} alt={s.red.tag} />
                  : s.red.tag}
              </div>
            </div>
            <div className="mtitle">{s.matchType}</div>
            <div className="msub2">{gameLabel}</div>
            <div className="ban-block">
              <div className={`ban-dot ld${activeTeamSide === "blue" ? " active" : ""}`} />
              <div className="ban-arrow">►</div>
              <div className="ban-info">
                <div className="ban-label">{phaseLabel(cur, s)}</div>
                <div className="ban-timer">{s.timer}</div>
              </div>
              <div className="ban-arrow">◄</div>
              <div className={`ban-dot rd${activeTeamSide === "red" ? " active" : ""}`} />
            </div>
          </div>

          <div className="heroes right-side">
            {renderHeroColumn(s, "red", activePick)}
          </div>
        </div>

        {/* Player name row */}
        <div className="player-row">
          <div className="pbar left-side">
            {s.blue.players.map((name, i) => (
              <div key={`bp${i}`} className="pcell">
                <span className="pname" style={pnameStyle(name)}>{name}</span>
              </div>
            ))}
          </div>
          <div className="center-player">
            {s.sponsorLogos[spIdx] ? (
              <img
                key={spIdx}
                src={s.sponsorLogos[spIdx]}
                alt={s.sponsors[spIdx] || "sponsor"}
                className="b-sponsor-img"
              />
            ) : (
              <span key={spIdx} className="b-sponsor-text">
                {s.sponsors[spIdx] || "SPONSOR"}
              </span>
            )}
          </div>
          <div className="pbar right-side">
            {s.red.players.map((name, i) => (
              <div key={`rp${i}`} className="pcell">
                <span className="pname" style={pnameStyle(name)}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Renders the 5-slot hero pick column for one side.
// Empty slots display the team logo (or tag fallback) on a team-tinted
// background, so viewers can see at-a-glance which side each empty pick
// slot belongs to. The `empty` CSS class also excludes the slot from
// the pick-in/float animations (see the :not(.empty) selector below).
function renderHeroColumn(
  s: AppState,
  side: TeamSide,
  activePick: { side: TeamSide; idx: number } | null,
) {
  const team = s[side];
  return Array.from({ length: 5 }).map((_, i) => {
    const hero = team.picks[i];
    const isActive = activePick?.side === side && activePick.idx === i;
    const portrait = hero ? heroPortrait(hero) : null;
    const emptyClass = hero ? "" : ` empty ${side}`;
    return (
      <div key={`${side}${i}`} className={`hcard${isActive ? " active" : ""}${emptyClass}`}>
        <div className="portrait">
          {portrait ? (
            <img src={portrait} alt={hero?.name ?? ""} />
          ) : team.logo ? (
            <img src={team.logo} alt={team.tag} className="empty-logo-img" />
          ) : (
            <div className="empty-tag">{team.tag}</div>
          )}
        </div>
        {hero && <div className="vname">{hero.name}</div>}
      </div>
    );
  });
}

// Renders the 5-slot ban cell column for one side. Mirrors hero column
// width-for-width so the ban row aligns perfectly with the hero row below.
// A red diagonal slash is drawn over any cell that has a portrait — it's
// the "banned / out of pool" visual cue.
function renderBanCells(
  s: AppState,
  side: TeamSide,
  activeBan: { side: TeamSide; idx: number } | null,
) {
  const team = s[side];
  return Array.from({ length: 5 }).map((_, i) => {
    const hero = team.bans[i];
    const isActive = activeBan?.side === side && activeBan.idx === i;
    const portrait = hero ? heroPortrait(hero) : null;
    return (
      <div key={`${side}b${i}`} className={`bcell${isActive ? " active" : ""}`}>
        {portrait ? (
          <>
            <img src={portrait} alt={hero?.name ?? ""} />
            <div className="bcell-slash" />
          </>
        ) : (
          <div className="bcell-empty">✕</div>
        )}
      </div>
    );
  });
}
