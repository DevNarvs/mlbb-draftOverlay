// Hash a string id to a hue (0-359) for deterministic per-hero color avatars
export function hu(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % 360;
}

export function hc(id: string): string  { return `hsl(${hu(id)},50%,35%)`; }
export function hcl(id: string): string { return `hsl(${hu(id)},55%,55%)`; }
export function hcv(id: string): string { return `hsl(${hu(id)},65%,50%)`; }

export function ini(n: string): string {
  return n.split(/[\s\-']+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}
