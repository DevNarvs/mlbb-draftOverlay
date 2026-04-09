import type { AppState, TeamSide } from "../types";
import { useConvexTeams } from "../hooks/useConvexTeams";
import { convexTeamToTeam } from "../lib/convexTeamMapper";

interface AdminPanelProps {
  s: AppState;
  setS: React.Dispatch<React.SetStateAction<AppState>>;
  imgJson: string;
  setImgJson: (v: string) => void;
  loadImages: (json: string) => void;
  teamsJson: string;
  setTeamsJson: (v: string) => void;
  loadTeams: (json: string) => void;
}

export default function AdminPanel({
  s, setS, imgJson, setImgJson, loadImages, teamsJson, setTeamsJson, loadTeams,
}: AdminPanelProps) {
  const { teams: convexTeams, loading: convexLoading, error: convexError, refetch } = useConvexTeams();

  // Apply a Convex team to one side, preserving current picks/bans.
  function applyConvexTeam(side: TeamSide, teamId: string) {
    if (!teamId) return;
    const ct = convexTeams.find((t) => t._id === teamId);
    if (!ct) return;
    setS((p) => ({ ...p, [side]: convexTeamToTeam(ct, p[side]) }));
  }

  // Reorders a player within the same team's roster. Used by drag-and-drop.
  // No-op if from/to are equal. Cross-team moves are rejected by the caller.
  function reorderPlayer(side: TeamSide, fromIdx: number, toIdx: number) {
    if (fromIdx === toIdx) return;
    setS((p) => {
      const np = [...p[side].players];
      const [moved] = np.splice(fromIdx, 1);
      np.splice(toIdx, 0, moved);
      return { ...p, [side]: { ...p[side], players: np } };
    });
  }

  return (
    <div className="admin-panel">
      {(["blue", "red"] as TeamSide[]).map(t => (
        <div
          key={t}
          className="admin-card"
          style={{ borderColor: t === "blue" ? "rgba(0,100,255,.15)" : "rgba(255,30,60,.15)" }}
        >
          <div className="card-title" style={{ color: t === "blue" ? "#4dabff" : "#ff6677" }}>
            {t.toUpperCase() + " TEAM"}
          </div>
          <input
            value={s[t].name}
            onChange={e => setS(p => ({ ...p, [t]: { ...p[t], name: e.target.value } }))}
            placeholder="Team Name"
            style={{
              padding: "8px 12px",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              fontFamily: "'Barlow Condensed', 'Inter', sans-serif",
            }}
          />
          <input
            value={s[t].tag}
            onChange={e => setS(p => ({ ...p, [t]: { ...p[t], tag: e.target.value } }))}
            placeholder="Tag"
            style={{
              padding: "8px 12px",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              fontFamily: "'Barlow Condensed', 'Inter', sans-serif",
            }}
          />
          <input
            value={s[t].logo}
            onChange={e => setS(p => ({ ...p, [t]: { ...p[t], logo: e.target.value } }))}
            placeholder="Logo URL (png/svg)"
          />
          <div style={{ fontSize:9,color:"#6a7590",fontWeight:600,letterSpacing:1,marginTop:4 }}>
            PLAYERS <span style={{ opacity: 0.6, fontWeight: 400 }}>(drag ⋮⋮ to reorder)</span>
          </div>
          {s[t].players.map((pn, pi) => (
            <div
              key={pi}
              onDragOver={(e) => {
                // Allow drop only if drag source is from the same team
                const data = e.dataTransfer.types.includes("text/plain");
                if (data) {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                const raw = e.dataTransfer.getData("text/plain");
                const [fromTeam, fromIdxStr] = raw.split(":");
                if (fromTeam !== t) return; // reject cross-team drag
                const fromIdx = parseInt(fromIdxStr, 10);
                if (Number.isNaN(fromIdx)) return;
                reorderPlayer(t, fromIdx, pi);
              }}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <span
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", `${t}:${pi}`);
                  e.dataTransfer.effectAllowed = "move";
                }}
                style={{
                  color: t === "blue" ? "#4dabff" : "#ff6677",
                  fontSize: 14,
                  lineHeight: 1,
                  cursor: "grab",
                  userSelect: "none",
                  padding: "0 6px",
                  opacity: 0.55,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
                title="Drag to reorder"
              >
                ⋮⋮
              </span>
              <input
                value={pn}
                onChange={e => {
                  const np = [...s[t].players];
                  np[pi] = e.target.value;
                  setS(p => ({ ...p, [t]: { ...p[t], players: np } }));
                }}
                style={{ flex: 1 }}
              />
            </div>
          ))}
        </div>
      ))}

      <div className="admin-card" style={{ minWidth: 240 }}>
        <div className="card-title" style={{ color: "#6acc8a" }}>HERO PORTRAITS</div>
        <textarea
          rows={5}
          value={imgJson}
          onChange={e => setImgJson(e.target.value)}
          placeholder='{"Sora":"https://...","Aamon":"https://..."}'
        />
        <button
          className="abtn"
          style={{ background: "#1a8855", color: "#fff", marginTop: 4 }}
          onClick={() => loadImages(imgJson)}
        >
          LOAD PORTRAITS
        </button>
      </div>

      <div className="admin-card" style={{ minWidth: 280 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="card-title" style={{ color: "#b478ff" }}>CONVEX TEAMS</div>
          <button
            className="abtn"
            style={{
              background: "rgba(255,255,255,.08)",
              color: "#a0aac0",
              fontSize: 10,
              padding: "3px 8px",
            }}
            onClick={refetch}
            disabled={convexLoading}
            title="Re-fetch teams from Convex"
          >
            ↻
          </button>
        </div>

        {convexLoading && (
          <div style={{ fontSize: 11, color: "#6acc8a" }}>⟳ Loading from Convex…</div>
        )}
        {convexError && (
          <div style={{ fontSize: 11, color: "#ff6677", wordBreak: "break-word" }}>
            ⚠ {convexError}
          </div>
        )}
        {!convexLoading && !convexError && (
          <div style={{ fontSize: 11, color: "#6acc8a" }}>
            ✓ {convexTeams.length} team{convexTeams.length === 1 ? "" : "s"} available
          </div>
        )}

        {(["blue", "red"] as TeamSide[]).map((side) => (
          <div key={side} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label
              style={{
                fontSize: 10,
                letterSpacing: 1,
                fontWeight: 600,
                color: side === "blue" ? "#4dabff" : "#ff6677",
              }}
            >
              {side.toUpperCase()} TEAM
            </label>
            <select
              value=""
              onChange={(e) => {
                applyConvexTeam(side, e.target.value);
                e.target.value = ""; // reset so re-picking the same team still fires
              }}
              disabled={convexLoading || convexTeams.length === 0}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: `1px solid ${side === "blue" ? "rgba(77,171,255,.25)" : "rgba(255,102,119,.25)"}`,
                background: side === "blue" ? "rgba(20,40,80,.6)" : "rgba(60,15,25,.6)",
                color: "#e8ecf4",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'Inter',sans-serif",
                outline: "none",
                cursor: convexTeams.length === 0 ? "not-allowed" : "pointer",
                colorScheme: "dark",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M3 4.5l3 3 3-3' stroke='${side === "blue" ? "%234dabff" : "%23ff6677"}' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
                paddingRight: 28,
              }}
            >
              <option value="" style={{ background: "#15192a", color: "#8a95b8" }}>
                — select to load into {side} —
              </option>
              {convexTeams.map((t) => (
                <option
                  key={t._id}
                  value={t._id}
                  style={{ background: "#15192a", color: "#e8ecf4" }}
                >
                  {t.teamName}{t.status !== "confirmed" ? ` (${t.status})` : ""}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ minWidth: 280 }}>
        <div className="card-title" style={{ color: "#4dabff" }}>TEAMS LOADER</div>
        <textarea
          rows={7}
          value={teamsJson}
          onChange={e => setTeamsJson(e.target.value)}
          placeholder={
            '{\n' +
            '  "blue": {"name":"AP BREN","tag":"BREN","logo":"https://...",\n' +
            '           "players":["KARL","OHEB","PHEW","OWGWEN","KYXY"]},\n' +
            '  "red":  {"name":"FALCON","tag":"FLCN","logo":"https://...",\n' +
            '           "players":["KYLE","FLAP","SUPERMARCO","OWOWEN","HADJI"]}\n' +
            '}'
          }
        />
        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
          <button
            className="abtn"
            style={{ background: "#1e4d8e", color: "#fff", flex: 1 }}
            onClick={() => loadTeams(teamsJson)}
          >
            LOAD TEAMS
          </button>
          <button
            className="abtn"
            style={{ background: "rgba(255,255,255,.08)", color: "#a0aac0" }}
            title="Fill the textarea with the current teams so you can tweak and reload"
            onClick={() => setTeamsJson(JSON.stringify({
              blue: { name: s.blue.name, tag: s.blue.tag, logo: s.blue.logo, players: s.blue.players },
              red:  { name: s.red.name,  tag: s.red.tag,  logo: s.red.logo,  players: s.red.players  },
            }, null, 2))}
          >
            COPY CURRENT
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ minWidth: 220 }}>
        <div className="card-title" style={{ color: "#ccaa44" }}>SPONSORS</div>
        {s.sponsors.map((sp, si) => (
          <div key={si} style={{ display: "flex", gap: 4 }}>
            <input
              value={sp}
              onChange={e => {
                const ns = [...s.sponsors];
                ns[si] = e.target.value;
                setS(p => ({ ...p, sponsors: ns }));
              }}
              placeholder="Name"
              style={{ flex: 1 }}
            />
            <input
              value={s.sponsorLogos[si] || ""}
              onChange={e => {
                const nl = [...s.sponsorLogos];
                nl[si] = e.target.value;
                setS(p => ({ ...p, sponsorLogos: nl }));
              }}
              placeholder="Logo URL"
              style={{ flex: 1 }}
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
          <button
            className="abtn"
            style={{ background: "#886611", color: "#fff" }}
            onClick={() => setS(p => ({
              ...p,
              sponsors: [...p.sponsors, ""],
              sponsorLogos: [...p.sponsorLogos, ""],
            }))}
          >
            + ADD
          </button>
          {s.sponsors.length > 1 && (
            <button
              className="abtn"
              style={{ background: "#663333", color: "#fff" }}
              onClick={() => setS(p => ({
                ...p,
                sponsors: p.sponsors.slice(0, -1),
                sponsorLogos: p.sponsorLogos.slice(0, -1),
              }))}
            >
              − REMOVE
            </button>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div className="card-title" style={{ color: "#7a8aaa" }}>MATCH INFO</div>
        <input
          value={s.matchType}
          onChange={e => setS(p => ({ ...p, matchType: e.target.value }))}
          placeholder="Match type"
        />
        <input
          value={s.matchWeek}
          onChange={e => setS(p => ({ ...p, matchWeek: e.target.value }))}
          placeholder="Match week"
        />
        <label style={{
          fontSize:12,color:"#8a95b8",display:"flex",alignItems:"center",
          gap:6,fontWeight:500,marginTop:2,
        }}>
          Game #{" "}
          <input
            type="number"
            min={1}
            max={9}
            value={s.gameNum}
            onChange={e => setS(p => ({ ...p, gameNum: +e.target.value || 1 }))}
            style={{
              width:40,padding:"5px 6px",borderRadius:4,
              border:"1px solid rgba(255,255,255,.12)",
              background:"rgba(255,255,255,.06)",color:"#d0d8ee",
              fontSize:12,fontFamily:"'Inter'",
            }}
          />
        </label>
      </div>
    </div>
  );
}
