import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DRAFT_SEQ, DT } from "./constants";
import { useHeroes } from "./hooks/useHeroes";
import type { AppState, Hero, Role } from "./types";

import Header from "./components/Header";
import BansRow from "./components/BansRow";
import PicksRow from "./components/PicksRow";
import PlayersRow from "./components/PlayersRow";
import AdminBar from "./components/AdminBar";
import AdminPanel from "./components/AdminPanel";
import HeroPicker from "./components/HeroPicker";
import OverlayBroadcast from "./components/OverlayBroadcast";

// Apply a draft action (ban/pick) to state, advance step
function sel(st: AppState, hero: Hero): AppState {
  const a = DRAFT_SEQ[st.step];
  if (!a) return { ...st, done: true };
  const k = a.type === "ban" ? "bans" : "picks";
  const nx = st.step + 1;
  return {
    ...st,
    [a.team]: { ...st[a.team], [k]: [...st[a.team][k], hero] },
    step: nx,
    timer: st.td,
    done: nx >= DRAFT_SEQ.length,
    history: [...st.history, { hero, action: a.type, team: a.team }],
  };
}

export default function App() {
  const { heroes, loading, source, setHeroes } = useHeroes();

  const [s, setS] = useState<AppState>({
    step: -1,
    blue: { picks: [], bans: [], name: "AURORA", tag: "RORA", logo: "", players: ["DOMENGKITE","YUE","DEMONKITE","EDWARD","LIGHT"] },
    red:  { picks: [], bans: [], name: "FALCON", tag: "FLCN", logo: "", players: ["KYLE","FLAP","SUPERMARCO","OWOWEN","HADJI"] },
    timer: DT, td: DT, started: false, paused: false, done: false, history: [],
    gameNum: 2,
    matchType: "REGULAR SEASON",
    matchWeek: "MATCH 1 • BO5",
    sponsors: ["Smart","Globe","Moonton"],
    sponsorLogos: ["","",""],
    // ─── Theme + broadcast-mode fields ───────────────────────────
    // "classic" = existing dark dramatic look | "broadcast" = light/compact
    theme: "classic",
    // Broadcast-theme scoreboard defaults. The top strip shows team
    // names (from s.blue.name / s.red.name — the same names used by
    // the classic theme's header), so no separate captain fields
    // are needed here anymore.
    mapName:   "FLYING CLOUD",
    scoreBlue: 0,
    scoreRed:  0,
    bestOf:    5,
    // ─────────────────────────────────────────────────────────────
  });

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"All" | Role>("All");
  const [admin, setAdmin] = useState(false);
  const [picker, setPicker] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [imgJson, setImgJson] = useState("");
  const [teamsJson, setTeamsJson] = useState("");
  const [obsMode] = useState(
    () => new URLSearchParams(window.location.search).get("obs") === "true"
  );

  const tRef  = useRef<number | null>(null);
  const ttRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.classList.toggle("obs-mode", obsMode);
  }, [obsMode]);

  const cur = s.step >= 0 && s.step < DRAFT_SEQ.length ? DRAFT_SEQ[s.step] : null;

  const used = useMemo(() => {
    const st = new Set<string>();
    (["blue","red"] as const).forEach(t => {
      s[t].picks.forEach(h => st.add(h.id));
      s[t].bans.forEach(h => st.add(h.id));
    });
    return st;
  }, [s.blue, s.red]);

  const flash = useCallback((m: string) => {
    setToast(m);
    if (ttRef.current) clearTimeout(ttRef.current);
    ttRef.current = window.setTimeout(() => setToast(null), 2000);
  }, []);

  function loadImages(json: string) {
    try {
      const map = JSON.parse(json) as Record<string, string>;
      const next = heroes.map(h => {
        const hit = Object.entries(map).find(
          ([k]) => h.name.toLowerCase() === k.toLowerCase() || h.id === k
        );
        return hit ? { ...h, image: hit[1] } : h;
      });
      setHeroes(next);
      flash("Loaded " + Object.keys(map).length + " images");
      setImgJson(json);
    } catch {
      flash("Invalid JSON");
    }
  }

  // Loads team config from a JSON blob. Shape:
  //   { "blue": { name?, tag?, logo?, players? }, "red": { ... } }
  // Any missing field is preserved from current state (partial updates).
  function loadTeams(json: string) {
    try {
      const data = JSON.parse(json) as {
        blue?: Partial<{ name: string; tag: string; logo: string; players: string[] }>;
        red?:  Partial<{ name: string; tag: string; logo: string; players: string[] }>;
      };
      if (!data || (typeof data.blue !== "object" && typeof data.red !== "object")) {
        return flash("JSON needs a 'blue' or 'red' key");
      }
      let touched = 0;
      setS(p => {
        const next = { ...p };
        (["blue", "red"] as const).forEach(side => {
          const src = data[side];
          if (!src || typeof src !== "object") return;
          touched++;
          next[side] = {
            ...p[side],
            ...(typeof src.name    === "string" ? { name:    src.name    } : {}),
            ...(typeof src.tag     === "string" ? { tag:     src.tag     } : {}),
            ...(typeof src.logo    === "string" ? { logo:    src.logo    } : {}),
            ...(Array.isArray(src.players)      ? { players: src.players } : {}),
          };
        });
        return next;
      });
      flash(touched === 2 ? "Loaded both teams" : "Loaded 1 team");
      setTeamsJson(json);
    } catch {
      flash("Invalid JSON");
    }
  }

  // Countdown timer with auto-pick on timeout
  useEffect(() => {
    if (tRef.current) clearInterval(tRef.current);
    if (!s.started || s.paused || s.done || s.step < 0 || !heroes.length) return;
    tRef.current = window.setInterval(() => {
      setS(p => {
        if (p.timer <= 1) {
          const u = new Set(
            [...p.blue.picks, ...p.red.picks, ...p.blue.bans, ...p.red.bans].map(x => x.id)
          );
          const av = heroes.filter(h => !u.has(h.id));
          if (!av.length || p.step >= DRAFT_SEQ.length) return { ...p, done: true };
          return sel(p, av[Math.floor(Math.random() * av.length)]);
        }
        return { ...p, timer: p.timer - 1 };
      });
    }, 1000);
    return () => {
      if (tRef.current) clearInterval(tRef.current);
    };
  }, [s.started, s.paused, s.done, s.step, heroes]);

  function pick(hero: Hero) {
    if (!s.started || s.paused || s.done) return flash("Draft not active");
    if (used.has(hero.id)) return flash("Hero unavailable");
    setSearch("");
    setS(p => sel(p, hero));
  }

  // Reverses the most recent ban or pick. Timer is intentionally NOT touched —
  // it keeps ticking from wherever it was, so undoing doesn't grant free time.
  function undo() {
    if (s.history.length === 0) return flash("Nothing to undo");
    setS(p => {
      if (p.history.length === 0) return p;
      const last = p.history[p.history.length - 1];
      const key = last.action === "ban" ? "bans" : "picks";
      return {
        ...p,
        [last.team]: {
          ...p[last.team],
          [key]: p[last.team][key].slice(0, -1),
        },
        step: Math.max(0, p.step - 1),
        history: p.history.slice(0, -1),
        done: false,
      };
    });
  }

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}

      {s.theme === "classic" ? (
        <div className="overlay">
          <Header blue={s.blue} red={s.red} />
          <BansRow blueBans={s.blue.bans} redBans={s.red.bans} cur={cur} />
          <PicksRow s={s} cur={cur} />
          <PlayersRow blue={s.blue} red={s.red} cur={cur} />
        </div>
      ) : (
        <OverlayBroadcast s={s} cur={cur} />
      )}

      <AdminBar
        s={s}
        setS={setS}
        loading={loading}
        heroCount={heroes.length}
        source={source}
        onUndo={undo}
        admin={admin}
        setAdmin={setAdmin}
        picker={picker}
        setPicker={setPicker}
      />

      {admin && (
        <AdminPanel
          s={s}
          setS={setS}
          imgJson={imgJson}
          setImgJson={setImgJson}
          loadImages={loadImages}
          teamsJson={teamsJson}
          setTeamsJson={setTeamsJson}
          loadTeams={loadTeams}
        />
      )}

      {picker && (
        <HeroPicker
          s={s}
          cur={cur}
          loading={loading}
          heroes={heroes}
          used={used}
          search={search}
          setSearch={setSearch}
          role={role}
          setRole={setRole}
          onPick={pick}
        />
      )}
    </div>
  );
}
