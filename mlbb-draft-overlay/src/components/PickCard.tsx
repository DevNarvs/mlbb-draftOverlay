import type { Hero, TeamSide } from "../types";
import { hc, hcl, hcv, ini } from "../utils";

interface PickCardProps {
  hero: Hero | undefined;
  team: TeamSide;
  index: number;
  active: boolean;
  teamLogo: string;
  teamTag: string;
}

export default function PickCard({ hero, team, index, active, teamLogo, teamTag }: PickCardProps) {
  const isB = team === "blue";
  const accent = isB ? "#0060dd" : "#cc1525";
  const bright = isB ? "#0090ff" : "#ff4466";

  // Any of these triggers the cinematic full-card portrait treatment.
  // Priority: wiki portrait override → local smallmap → remote head.
  const fullArt = hero ? (hero.image || hero.smallmap || hero.head) : null;

  const bg: React.CSSProperties = hero
    ? {
        background: fullArt
          ? "#0a0c14"
          : `linear-gradient(${isB ? "165deg" : "195deg"},${hc(hero.id)}55 0%,${hc(hero.id)}15 50%,#0a0c1400 100%)`,
        borderTopColor: hcv(hero.id) + "66",
      }
    : active
    ? { background: `linear-gradient(170deg,${accent}22 0%,${accent}08 100%)`, borderTopColor: bright }
    : {};

  return (
    <div className={`pick-card${hero ? " filled" : ""}${active ? " active" : ""}`} style={bg}>
      {hero ? (
        <div
          className={`pick-card-inner${fullArt ? " has-img" : ""}`}
          style={{ padding: fullArt ? 0 : "10px 4px" }}
        >
          {fullArt ? (
            <img
              src={fullArt}
              className="pick-card-img"
              style={{ animationDelay: index * 0.6 + "s" }}
            />
          ) : (hero.smallmap || hero.head) ? (
            <img
              src={hero.smallmap || hero.head!}
              style={{
                width: 72,
                height: 72,
                borderRadius: 10,
                objectFit: "cover",
                boxShadow: "0 4px 20px rgba(0,0,0,.4)",
                border: "2px solid rgba(255,255,255,.1)",
              }}
            />
          ) : (
            <div
              className="pick-avatar"
              style={{
                width: 72,
                height: 72,
                fontSize: 26,
                letterSpacing: 1,
                marginBottom: 0,
                background: `linear-gradient(135deg,${hc(hero.id)},${hcv(hero.id)},${hcl(hero.id)})`,
                boxShadow: `0 4px 20px ${hc(hero.id)}55,inset 0 -3px 8px rgba(0,0,0,.3)`,
                border: `2px solid ${hcl(hero.id)}55`,
              }}
            >
              {ini(hero.name)}
            </div>
          )}
        </div>
      ) : (
        <div className="pick-card-inner" style={{ justifyContent: "center", alignItems: "center" }}>
          {active ? (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:"pulse 2s ease-in-out infinite" }}>
              {teamLogo ? (
                <img
                  src={teamLogo}
                  style={{
                    width:140,height:140,objectFit:"contain",opacity:.5,
                    filter:"drop-shadow(0 0 18px " + bright + "66)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width:140,height:140,borderRadius:16,
                    background:`linear-gradient(135deg,${accent}44,${accent}22)`,
                    border:`2px solid ${accent}44`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:56,fontWeight:900,fontFamily:"'Bebas Neue'",color:accent+"aa",
                  }}
                >
                  {teamTag ? teamTag[0] : "?"}
                </div>
              )}
              <div style={{ fontSize:9,letterSpacing:3,fontFamily:"'Barlow Condensed'",fontWeight:700,color:bright,textTransform:"uppercase" }}>
                PICKING...
              </div>
            </div>
          ) : teamLogo ? (
            <img
              src={teamLogo}
              alt=""
              style={{
                width: 140,
                height: 140,
                objectFit: "contain",
                opacity: 0.18,
                filter: `drop-shadow(0 0 6px ${accent}66)`,
                pointerEvents: "none",
              }}
            />
          ) : (
            <span
              style={{
                fontSize: 32,
                fontFamily: "'Bebas Neue'",
                color: `${accent}35`,
                letterSpacing: 2,
              }}
            >
              {teamTag ? teamTag[0] : "?"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
