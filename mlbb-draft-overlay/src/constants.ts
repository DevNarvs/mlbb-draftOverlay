import type { DraftStep, Role } from "./types";

// Role map for heroes (fallback)
export const ROLE_MAP: Record<string, Role> = {
  "Miya":"Marksman","Balmond":"Fighter","Saber":"Assassin","Alice":"Mage","Nana":"Mage",
  "Tigreal":"Tank","Alucard":"Fighter","Karina":"Assassin","Akai":"Tank","Franco":"Tank",
  "Bane":"Fighter","Bruno":"Marksman","Clint":"Marksman","Rafaela":"Support","Eudora":"Mage",
  "Zilong":"Fighter","Fanny":"Assassin","Layla":"Marksman","Minotaur":"Tank","Lolita":"Tank",
  "Hayabusa":"Assassin","Freya":"Fighter","Gord":"Mage","Natalia":"Assassin","Kagura":"Mage",
  "Chou":"Fighter","Sun":"Fighter","Alpha":"Fighter","Ruby":"Fighter","Yi Sun-shin":"Marksman",
  "Moskov":"Marksman","Johnson":"Tank","Cyclops":"Mage","Estes":"Support","Hilda":"Fighter",
  "Aurora":"Mage","Lapu-Lapu":"Fighter","Vexana":"Mage","Roger":"Fighter","Karrie":"Marksman",
  "Gatotkaca":"Tank","Jawhead":"Fighter","Irithel":"Marksman","Grock":"Tank","Argus":"Fighter",
  "Odette":"Mage","Lancelot":"Assassin","Diggie":"Support","Hylos":"Tank","Zhask":"Mage",
  "Helcurt":"Assassin","Pharsa":"Mage","Lesley":"Marksman","Martis":"Fighter","Hanabi":"Marksman",
  "Chang'e":"Mage","Kaja":"Support","Selena":"Assassin","Barats":"Tank","Aldous":"Fighter",
  "Claude":"Marksman","Valir":"Mage","Badang":"Fighter","Khufra":"Tank","Granger":"Marksman",
  "Guinevere":"Fighter","Esmeralda":"Mage","Kadita":"Mage","Cecilion":"Mage","Carmilla":"Support",
  "Atlas":"Tank","Popol and Kupa":"Marksman","Yu Zhong":"Fighter","Luo Yi":"Mage",
  "Benedetta":"Assassin","Brody":"Marksman","Paquito":"Fighter","Lunox":"Mage","Belerick":"Tank",
  "Baxia":"Tank","Minsitthar":"Fighter","Thamuz":"Fighter","Khaleed":"Fighter","Wanwan":"Marksman",
  "Silvanna":"Fighter","X.Borg":"Fighter","Dyrroth":"Fighter","Harith":"Mage","Gusion":"Assassin",
  "Beatrix":"Marksman","Faramis":"Support","Leomord":"Fighter","Hanzo":"Assassin",
  "Terizla":"Fighter","Kimmy":"Marksman","Mathilda":"Support","Phoveus":"Fighter","Edith":"Tank",
  "Masha":"Fighter","Harley":"Assassin","Lylia":"Mage","Vale":"Mage","Angela":"Support",
  "Floryn":"Support","Valentina":"Mage","Aamon":"Assassin","Aulus":"Fighter","Natan":"Marksman",
  "Uranus":"Tank","Gloo":"Tank","Fredrinn":"Fighter","Joy":"Assassin","Xavier":"Mage",
  "Melissa":"Marksman","Yin":"Fighter","Arlott":"Fighter","Novaria":"Mage","Nolan":"Assassin",
  "Ixia":"Marksman","Cici":"Fighter","Chip":"Support","Julian":"Assassin","Zhuxin":"Mage",
  "Suyou":"Assassin","Lukas":"Fighter","Kalea":"Support","Zetian":"Mage","Obsidia":"Marksman",
  "Sora":"Fighter","Marcel":"Support",
};

// Portrait overrides (wiki full portraits)
export const PORTRAIT_MAP: Record<string, string> = {
  "Aamon":"https://static.wikia.nocookie.net/mobile-legends/images/c/c8/Hero1091-portrait.png/revision/latest?cb=20251225192214",
  "Diggie":"https://static.wikia.nocookie.net/mobile-legends/images/1/17/Hero481-portrait.png/revision/latest?cb=20241021141804",
  "Sora":"https://static.wikia.nocookie.net/mobile-legends/images/0/00/Hero1311-portrait.png/revision/latest?cb=20251218014024",
};

export const ROLES: ReadonlyArray<"All" | Role> = ["All","Tank","Fighter","Assassin","Mage","Marksman","Support"];
export const ROLE_ICONS: Record<Role, string> = {
  Tank:"🛡",Fighter:"⚔",Assassin:"🗡",Mage:"✦",Marksman:"◎",Support:"♥",
};

export const DRAFT_SEQ: DraftStep[] = [
  {phase:"ban1",type:"ban",team:"blue",label:"BAN PHASE 1"},{phase:"ban1",type:"ban",team:"red",label:"BAN PHASE 1"},
  {phase:"ban1",type:"ban",team:"blue",label:"BAN PHASE 1"},{phase:"ban1",type:"ban",team:"red",label:"BAN PHASE 1"},
  {phase:"pick1",type:"pick",team:"blue",label:"PICK PHASE 1"},{phase:"pick1",type:"pick",team:"red",label:"PICK PHASE 1"},
  {phase:"pick1",type:"pick",team:"red",label:"PICK PHASE 1"},{phase:"pick1",type:"pick",team:"blue",label:"PICK PHASE 1"},
  {phase:"ban2",type:"ban",team:"red",label:"BAN PHASE 2"},{phase:"ban2",type:"ban",team:"blue",label:"BAN PHASE 2"},
  {phase:"pick2",type:"pick",team:"red",label:"PICK PHASE 2"},{phase:"pick2",type:"pick",team:"blue",label:"PICK PHASE 2"},
  {phase:"pick2",type:"pick",team:"blue",label:"PICK PHASE 2"},{phase:"pick2",type:"pick",team:"red",label:"PICK PHASE 2"},
  {phase:"ban3",type:"ban",team:"red",label:"BAN PHASE 3"},{phase:"ban3",type:"ban",team:"blue",label:"BAN PHASE 3"},
  {phase:"pick3",type:"pick",team:"red",label:"PICK PHASE 3"},{phase:"pick3",type:"pick",team:"blue",label:"PICK PHASE 3"},
];

export const DT = 30;
