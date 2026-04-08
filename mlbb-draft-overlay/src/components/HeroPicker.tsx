import { useMemo } from "react";
import { ROLES, ROLE_ICONS } from "../constants";
import type { AppState, DraftStep, Hero, Role } from "../types";
import { hc, hcl, ini } from "../utils";

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
              return (
                <div
                  key={hero.id}
                  className={`hero-cell${act ? " available" : ""}${u ? " used" : ""}`}
                  onClick={() => act && onPick(hero)}
                >
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
