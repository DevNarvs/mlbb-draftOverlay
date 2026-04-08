import type { Team } from "../types";

interface HeaderProps { blue: Team; red: Team; }

export default function Header({ blue, red }: HeaderProps) {
  return (
    <div className="header-row">
      <div className="header-blue">
        {blue.logo && <img src={blue.logo} className="header-bg-logo" />}
        <span className="header-text">{blue.name}</span>
      </div>
      <div className="header-gap" />
      <div className="header-red">
        <span className="header-text">{red.name}</span>
        {red.logo && <img src={red.logo} className="header-bg-logo" />}
      </div>
    </div>
  );
}
