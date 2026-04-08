import type { DraftStep, Hero, TeamSide } from "../types";
import { hc, hcl, ini } from "../utils";

interface BanCircleProps { hero: Hero | undefined; team: TeamSide; active: boolean; }

function BanCircle({ hero, team, active }: BanCircleProps) {
  const cls = hero ? "ban-circle filled" : active ? `ban-circle active-${team}` : "ban-circle empty";
  const bg: React.CSSProperties = hero
    ? { background: `linear-gradient(135deg,${hc(hero.id)}77,${hcl(hero.id)}33)` }
    : {};
  const avatar = hero ? (hero.smallmap || hero.head || hero.image) : null;
  return (
    <div className={cls} style={bg}>
      {hero ? (
        <>
          {avatar
            ? <img src={avatar} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%",position:"absolute"}} />
            : <span className="initials">{ini(hero.name)}</span>}
          <div className="ban-x" />
        </>
      ) : (
        <span className="empty-x">✕</span>
      )}
    </div>
  );
}

interface BansRowProps {
  blueBans: Hero[];
  redBans: Hero[];
  cur: DraftStep | null;
}

export default function BansRow({ blueBans, redBans, cur }: BansRowProps) {
  return (
    <div className="bans-row">
      <div className="bans-side">
        {Array.from({ length: 5 }).map((_, i) => (
          <BanCircle
            key={i}
            hero={blueBans[i]}
            team="blue"
            active={!blueBans[i] && blueBans.length === i && cur?.team === "blue" && cur?.type === "ban"}
          />
        ))}
      </div>
      <div className="bans-center">BANS</div>
      <div className="bans-side">
        {Array.from({ length: 5 }).map((_, i) => (
          <BanCircle
            key={i}
            hero={redBans[i]}
            team="red"
            active={!redBans[i] && redBans.length === i && cur?.team === "red" && cur?.type === "ban"}
          />
        ))}
      </div>
    </div>
  );
}
