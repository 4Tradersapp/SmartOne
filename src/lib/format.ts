export const fmt = (n: number) => n.toLocaleString("pt-BR");

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const mil = (n: number) => `R$ ${Math.round(n / 1000).toLocaleString("pt-BR")} mil`;

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

export function fmtMin(m: number): string {
  if (m < 1) return "agora";
  if (m < 60) return `${m} min`;
  if (m < 1440) {
    const h = Math.floor(m / 60);
    const r = m % 60;
    return `${h}h${r ? String(r).padStart(2, "0") : ""}`;
  }
  return `${Math.floor(m / 1440)} d`;
}

export const shortCondoName = (name: string) =>
  name.replace(/^(Residencial|Condomínio|Edifício) /, "");

/** Gerador pseudoaleatório determinístico (mulberry32). Mesmo resultado no servidor e no cliente. */
export function rng(seed: number) {
  let s = seed;
  return function next() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");
