import type { AppState, DraftStep } from "../types";
import CenterPanel from "./CenterPanel";
import PickCard from "./PickCard";

interface PicksRowProps {
  s: AppState;
  cur: DraftStep | null;
}

export default function PicksRow({ s, cur }: PicksRowProps) {
  return (
    <div className="picks-row">
      <div className="picks-side">
        {Array.from({ length: 5 }).map((_, i) => (
          <PickCard
            key={i}
            hero={s.blue.picks[i]}
            team="blue"
            index={i}
            active={!s.blue.picks[i] && s.blue.picks.length === i && cur?.team === "blue" && cur?.type === "pick"}
            teamLogo={s.blue.logo}
            teamTag={s.blue.tag}
          />
        ))}
      </div>
      <CenterPanel s={s} cur={cur} />
      <div className="picks-side">
        {Array.from({ length: 5 }).map((_, i) => (
          <PickCard
            key={i}
            hero={s.red.picks[i]}
            team="red"
            index={i}
            active={!s.red.picks[i] && s.red.picks.length === i && cur?.team === "red" && cur?.type === "pick"}
            teamLogo={s.red.logo}
            teamTag={s.red.tag}
          />
        ))}
      </div>
    </div>
  );
}
