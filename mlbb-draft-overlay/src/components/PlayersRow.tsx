import type { DraftStep, Team } from "../types";

interface PlayersRowProps { blue: Team; red: Team; cur: DraftStep | null; }

export default function PlayersRow({ blue, red, cur }: PlayersRowProps) {
  const activeTeam = cur ? (cur.team === "blue" ? blue : red) : null;
  const teamColor = cur?.team === "blue" ? "#4dabff" : "#ff5577";
  const teamDotBg = cur?.team === "blue" ? "#4dabff" : "#ff4466";

  // Scale the indicator font/spacing down for long team tags so they always
  // fit on a single line inside the 200px-wide players-center container.
  // Tiers tuned for Barlow Condensed Bold: ~14px wide per char at fontSize 22.
  const tagLen = activeTeam?.tag.length ?? 0;
  const tagFontSize =
    tagLen <= 6  ? 22 :
    tagLen <= 9  ? 18 :
    tagLen <= 12 ? 15 :
    tagLen <= 16 ? 12 :
                   11;
  const tagLetterSpacing =
    tagLen <= 6  ? 4 :
    tagLen <= 9  ? 3 :
    tagLen <= 12 ? 2 :
                   1;

  return (
    <div className="players-row">
      <div className="players-side">
        {blue.players.map((n, i) => (
          <div
            key={i}
            className="player-name"
            style={{
              background: blue.picks[i]
                ? "linear-gradient(180deg,#0050bb,#003080)"
                : "linear-gradient(180deg,#0a1030,#080c22)",
              borderBottom: `3px solid ${blue.picks[i] ? "#0070ee" : "#0a1030"}`,
              color: blue.picks[i] ? "#fff" : "#2a3a5a",
            }}
          >
            {n}
          </div>
        ))}
      </div>
      <div
        className="players-center"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {activeTeam && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: teamDotBg,
                boxShadow: `0 0 12px ${teamDotBg}aa`,
                animation: "pulse 1s infinite",
              }}
            />
            <span
              style={{
                fontSize: tagFontSize,
                fontWeight: 800,
                letterSpacing: tagLetterSpacing,
                fontFamily: "'Barlow Condensed'",
                color: teamColor,
                textShadow: `0 0 12px ${teamDotBg}55`,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 170,
                lineHeight: 1.1,
              }}
            >
              {activeTeam.tag}
            </span>
          </div>
        )}
      </div>
      <div className="players-side">
        {red.players.map((n, i) => (
          <div
            key={i}
            className="player-name"
            style={{
              background: red.picks[i]
                ? "linear-gradient(180deg,#aa1525,#771020)"
                : "linear-gradient(180deg,#1a0c10,#120810)",
              borderBottom: `3px solid ${red.picks[i] ? "#dd2244" : "#1a0c10"}`,
              color: red.picks[i] ? "#fff" : "#5a2a3a",
            }}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}
