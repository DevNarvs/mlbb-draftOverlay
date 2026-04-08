import { useEffect, useState } from "react";
import type { AppState, DraftStep } from "../types";

interface CenterPanelProps {
  s: AppState;
  cur: DraftStep | null;
}

export default function CenterPanel({ s, cur }: CenterPanelProps) {
  const [spIdx, setSpIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(
      () => setSpIdx(p => (p + 1) % Math.max(s.sponsors.length, 1)),
      3000
    );
    return () => clearInterval(iv);
  }, [s.sponsors.length]);

  const tp = s.td > 0 ? s.timer / s.td : 0;

  return (
    <div className="picks-center">
      {s.started && !s.done && (
        <>
          <div style={{
            fontSize:12,letterSpacing:3,fontFamily:"'Barlow Condensed'",fontWeight:700,
            color: cur?.team === "blue" ? "#4dabff" : "#ff5577",marginBottom:3,
          }}>
            {cur?.label}
          </div>
          <div style={{
            fontSize:56,fontFamily:"'Bebas Neue'",lineHeight:1,
            color: tp > .5 ? "#fff" : tp > .2 ? "#ffaa00" : "#ff2244",
            textShadow: tp <= .2 ? "0 0 24px rgba(255,30,50,.6)" : "none",
          }}>
            {s.timer}
          </div>
          <div className="timer-bar">
            <div className="timer-fill" style={{
              width: `${tp * 100}%`,
              background: tp > .5 ? "#00cc66" : tp > .2 ? "#ffaa00" : "#ff2244",
            }} />
          </div>
        </>
      )}
      <div style={{ marginTop: s.started && !s.done ? 12 : 0, textAlign:"center" }}>
        <div style={{ fontSize:12,letterSpacing:3,color:"#8a95b8",fontFamily:"'Barlow Condensed'",fontWeight:700,textTransform:"uppercase" }}>
          {s.matchType}
        </div>
        <div style={{ fontSize:11,letterSpacing:2,color:"#6a7590",fontFamily:"'Barlow Condensed'",fontWeight:600,marginTop:2 }}>
          {s.matchWeek}
        </div>
      </div>
      <div style={{
        marginTop:14,height:110,width:184,position:"relative",
        display:"flex",alignItems:"center",justifyContent:"center",
      }}>
        {s.sponsorLogos[spIdx] ? (
          <img
            key={spIdx}
            src={s.sponsorLogos[spIdx]}
            style={{ maxWidth:"100%",maxHeight:"100%",objectFit:"contain",animation:"sponsorFade 3s ease" }}
          />
        ) : (
          <span
            key={spIdx}
            style={{ fontSize:16,letterSpacing:3,color:"#5a6478",fontFamily:"'Barlow Condensed'",fontWeight:700,animation:"sponsorFade 3s ease" }}
          >
            {s.sponsors[spIdx] || "SPONSOR"}
          </span>
        )}
      </div>
      {s.done && (
        <div style={{
          marginTop:10,padding:"4px 16px",borderRadius:4,
          background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)",
          fontSize:11,letterSpacing:4,fontFamily:"'Barlow Condensed'",fontWeight:700,color:"#556",
        }}>
          LOCKED
        </div>
      )}
    </div>
  );
}
