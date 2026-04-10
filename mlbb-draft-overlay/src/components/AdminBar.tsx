import type { AppState } from "../types";
import type { HeroSource } from "../hooks/useHeroes";
import { DT, nextDraftFormat, draftFormatLabel } from "../constants";

interface AdminBarProps {
  s: AppState;
  setS: React.Dispatch<React.SetStateAction<AppState>>;
  loading: boolean;
  heroCount: number;
  source: HeroSource;
  onUndo: () => void;
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  picker: boolean;
  setPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminBar({
  s, setS, loading, heroCount, source, onUndo, admin, setAdmin, picker, setPicker,
}: AdminBarProps) {
  return (
    <div className="admin-bar">
      <button
        className="abtn primary"
        disabled={s.started && !s.done}
        onClick={() => setS(p => ({ ...p, started: true, step: 0, timer: p.td, done: false, paused: false }))}
      >
        ▶ START
      </button>
      <button
        className="abtn warn"
        disabled={!s.started || s.done}
        onClick={() => setS(p => ({ ...p, paused: !p.paused }))}
      >
        {s.paused ? "▶ RESUME" : "⏸ PAUSE"}
      </button>
      <button
        className="abtn ghost"
        disabled={s.history.length === 0}
        onClick={onUndo}
        title="Undo the last ban or pick"
      >
        ↶ UNDO
      </button>
      <button
        className="abtn danger"
        onClick={() => setS(p => ({
          ...p, step: -1, started: false, paused: false, done: false, timer: p.td,
          blue: { ...p.blue, picks: [], bans: [] },
          red:  { ...p.red,  picks: [], bans: [] },
          history: [],
        }))}
      >
        ↺ RESET
      </button>
      <div className="sep" />
      <label>
        Timer{" "}
        <input
          type="number"
          min={5}
          max={120}
          value={s.td}
          onChange={e => setS(p => ({ ...p, td: +e.target.value || DT }))}
        />
      </label>
      <div className="sep" />
      {loading ? (
        <span style={{ fontSize:12,color:"#6acc8a" }}>⟳ Loading heroes...</span>
      ) : source === "local" ? (
        <span style={{ fontSize:12,color:"#6acc8a" }}>{heroCount} heroes loaded ✓ (local)</span>
      ) : source === "api" ? (
        <span style={{ fontSize:12,color:"#6acc8a" }}>{heroCount} heroes loaded ✓ (API)</span>
      ) : (
        <span style={{ fontSize:12,color:"#e09900" }}>⚠ {heroCount} heroes (fallback — no portraits)</span>
      )}
      <div style={{ marginLeft:"auto",display:"flex",gap:8 }}>
        <button
          className="abtn ghost"
          disabled={s.started && !s.done}
          onClick={() =>
            setS(p => ({ ...p, draftFormat: nextDraftFormat(p.draftFormat) }))
          }
          title="Switch draft format: 5-ban / 3-ban / custom lobby"
        >
          {draftFormatLabel(s.draftFormat)}
        </button>
        <button
          className="abtn ghost"
          onClick={() =>
            setS(p => ({ ...p, theme: p.theme === "classic" ? "broadcast" : "classic" }))
          }
          title="Switch between classic and broadcast overlay styles"
        >
          {s.theme === "classic" ? "◐ CLASSIC" : "◑ BROADCAST"}
        </button>
        <button className="abtn ghost" onClick={() => setAdmin(p => !p)}>
          {admin ? "✕ CLOSE SETTINGS" : "⚙ SETTINGS"}
        </button>
        <button className="abtn ghost" onClick={() => setPicker(p => !p)}>
          {picker ? "▼ HIDE HEROES" : "▲ SHOW HEROES"}
        </button>
      </div>
    </div>
  );
}
