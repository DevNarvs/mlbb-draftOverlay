import { useMemo } from "react";
import { HERO_TIER, ROLES, ROLE_ICONS } from "../constants";
import type { HeroTier } from "../constants";
import type { AppState, DraftStep, Hero, Role } from "../types";
import { hc, hcl, ini } from "../utils";

// Color coding for tier badges — follows MOBA community tier list
// conventions so viewers read them intuitively without a legend.
const TIER_COLOR: Record<HeroTier, string> = {
  S: "#F59E0B", // gold — meta-defining
  A: "#94A3B8", // silver — strong
  B: "#60A5FA", // muted blue — comfort
  C: "#6EE7B7", // muted green — niche
  D: "#FCA5A5", // muted red — rarely seen
};

interface HeroPickerProps {
  s: AppState;
  cur: DraftStep | null;
  loading: boolean;
  heroes: Hero[];
  used: Set<string>;
  search: string;
  setSearch: (v: string) => void;
  role: "All" | Role;
  setRole: (v: "All" | Role) => void;
  onPick: (h: Hero) => void;
}

export default function HeroPicker({
  s, cur, loading, heroes, used, search, setSearch, role, setRole, onPick,
}: HeroPickerProps) {
  const filtered = useMemo(
    () => heroes.filter(h =>
      (role === "All" || h.role === role) &&
      (!search || h.name.toLowerCase().includes(search.toLowerCase()))
    ),
    [search, role, heroes]
  );

  return (
    <div className="hero-picker-wrap">
      {loading ? (
        <div className="loading-msg">Loading heroes from API...</div>
      ) : (
        <>
          <div className="filters">
            <div style={{ position: "relative" }}>
              <input
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search hero..."
              />
              <span style={{
                position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",
                fontSize:13,color:"#3a4260",pointerEvents:"none",
              }}>⌕</span>
            </div>
            {ROLES.map(r => (
              <button
                key={r}
                className={`role-btn${role === r ? " active" : ""}`}
                onClick={() => setRole(r)}
              >
                {(r !== "All" ? (ROLE_ICONS[r] || "") + " " : "") + r.toUpperCase()}
              </button>
            ))}
            {cur && (
              <div
                className="turn-ind"
                style={{
                  background: cur.team === "blue" ? "rgba(0,100,255,.1)" : "rgba(255,30,60,.1)",
                  border: `1px solid ${cur.team === "blue" ? "rgba(0,100,255,.25)" : "rgba(255,30,60,.25)"}`,
                  color: cur.team === "blue" ? "#4dabff" : "#ff5577",
                }}
              >
                {(cur.team === "blue" ? s.blue.tag : s.red.tag) + " " + cur.type.toUpperCase()}
              </div>
            )}
          </div>
          <div className="hero-grid">
            {filtered.map(hero => {
              const u = used.has(hero.id);
              const act = s.started && !s.paused && !s.done && !u;
              // Prefer local smallmap (offline-safe), then remote head, then PORTRAIT_MAP override.
              const avatar = hero.smallmap || hero.head || hero.image;
              const tier = HERO_TIER[hero.name];
              return (
                <div
                  key={hero.id}
                  className={`hero-cell${act ? " available" : ""}${u ? " used" : ""}`}
                  onClick={() => act && onPick(hero)}
                >
                  {tier && (
                    <div
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        background: TIER_COLOR[tier],
                        color: "#0c1018",
                        fontSize: 10,
                        fontWeight: 900,
                        fontFamily: "'Inter', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    >
                      {tier}
                    </div>
                  )}
                  {avatar ? (
                    <img
                      src={avatar}
                      style={{
                        width:40,height:40,borderRadius:6,objectFit:"cover",
                        filter: u ? "grayscale(1)" : "none",
                        boxShadow: "0 2px 8px rgba(0,0,0,.3)",
                      }}
                    />
                  ) : (
                    <div
                      className="hero-mini-avatar"
                      style={{
                        width:40,height:40,fontSize:14,
                        background: `linear-gradient(135deg,${hc(hero.id)},${hcl(hero.id)})`,
                        boxShadow: `0 2px 8px ${hc(hero.id)}44`,
                        filter: u ? "grayscale(1)" : "none",
                      }}
                    >
                      {ini(hero.name)}
                    </div>
                  )}
                  <span className="hero-cell-name">{hero.name}</span>
                  {u && (
                    <div className="hero-used-line">
                      <div />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
