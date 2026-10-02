import { clamp, rng } from "@/lib/format";
import type { CompanyId, Condo, Posto, Service } from "@/lib/types";
import { CO, COMPANIES, LETTER_TO_COMPANY } from "./companies";

/** Dados ilustrativos: 18 condomínios fictícios. Substituir pelo cadastro real. */
const RAW: Array<[string, string, string, number, Condo["kind"]]> = [
  ["c1", "Residencial Ipê Amarelo", "ILBS", 240, "Residencial"],
  ["c2", "Condomínio Jardim das Acácias", "IL", 180, "Residencial"],
  ["c3", "Edifício Mirante do Vale", "ILB", 320, "Residencial"],
  ["c4", "Residencial Parque dos Ventos", "I", 96, "Residencial"],
  ["c5", "Condomínio Villa Toscana", "ILS", 150, "Residencial"],
  ["c6", "Edifício Solar das Palmeiras", "I", 64, "Residencial"],
  ["c7", "Residencial Grand Brasil", "ILBS", 410, "Residencial"],
  ["c8", "Condomínio Recanto Verde", "I", 120, "Residencial"],
  ["c9", "Edifício Atlântico Office", "IB", 180, "Comercial"],
  ["c10", "Residencial Bosque Imperial", "IL", 200, "Residencial"],
  ["c11", "Condomínio Alto da Serra", "I", 88, "Residencial"],
  ["c12", "Edifício Portal do Sol", "IS", 72, "Residencial"],
  ["c13", "Residencial Vila Romana", "IL", 160, "Residencial"],
  ["c14", "Condomínio Reserva das Flores", "I", 110, "Residencial"],
  ["c15", "Edifício Torre Azul Corporate", "ILB", 220, "Comercial"],
  ["c16", "Residencial Morada do Lago", "IS", 140, "Residencial"],
  ["c17", "Condomínio Quinta da Mata", "I", 52, "Residencial"],
  ["c18", "Residencial Nova Aliança", "ILB", 260, "Residencial"],
];

const TASKS_PER_POSTO: Record<CompanyId, number> = { infraseg: 14, fortslimp: 18, fortsbravo: 10, fortservice: 6 };

function buildService(id: CompanyId, size: number, kind: Condo["kind"], r: () => number): Service {
  let postos = 1;
  let colab = 1;
  let desc = "";
  let h24 = false;
  if (id === "infraseg") {
    postos = size > 250 ? 3 : size > 120 ? 2 : 1;
    colab = postos * 4;
    desc = "Portaria 24h · escala 12x36";
    h24 = true;
  } else if (id === "fortslimp") {
    postos = Math.max(1, Math.ceil(size / 90));
    colab = postos;
    desc = "Limpeza diurna · 44h semanais";
  } else if (id === "fortsbravo") {
    h24 = size > 300 || kind === "Comercial";
    colab = h24 ? 4 : 2;
    desc = h24 ? "Bombeiro civil 24h · 12x36" : "Bombeiro civil diurno";
  } else {
    desc = "Zeladoria técnica diurna";
  }
  const ipo = clamp(Math.round(CO[id].base + (r() * 8 - 4)), 70, 99);
  const tasks = postos * TASKS_PER_POSTO[id];
  return { postos, colab, desc, h24, ipo, tasks, done: 0, missed: 0, pending: 0 };
}

function build(): Condo[] {
  const r = rng(20261002);
  const condos: Condo[] = RAW.map(([id, name, code, size, kind]) => {
    const svc: Condo["svc"] = {};
    for (const ch of code) {
      const cid = LETTER_TO_COMPANY[ch];
      svc[cid] = buildService(cid, size, kind, r);
    }
    return { id, name, code, size, kind, svc, pk: { recv: 0, wait: 0, over: 0, avgH: 0 }, acc: { visit: 0, auto: 0, entries: 0 } };
  });
  const byId = Object.fromEntries(condos.map((c) => [c.id, c]));
  byId.c13.svc.infraseg!.ipo = 74;
  byId.c11.svc.infraseg!.ipo = 81;
  byId.c16.svc.fortservice!.ipo = 79;
  for (const c of condos) {
    for (const s of Object.values(c.svc)) {
      if (!s) continue;
      s.done = Math.round(((s.tasks * s.ipo) / 100) * 0.93);
      s.missed = Math.round(((s.tasks * (100 - s.ipo)) / 100) * 0.6);
      s.pending = Math.max(0, s.tasks - s.done - s.missed);
    }
  }
  const r2 = rng(777);
  for (const c of condos) {
    c.pk = { recv: Math.round(c.size * 0.11 + r2() * 4), wait: Math.round(c.size * 0.07 + r2() * 3), avgH: +(5 + r2() * 7).toFixed(1), over: 0 };
    c.pk.over = Math.max(0, Math.round(c.pk.wait * 0.12 + r2() * 1.4));
    c.acc = { visit: Math.round(2 + c.size / 45 + r2() * 3), auto: Math.round(88 + r2() * 9), entries: Math.round(c.size * 1.9 + r2() * 40) };
  }
  byId.c1.pk = { recv: 27, wait: 11, over: 1, avgH: 9.6 };
  byId.c1.acc = { visit: 6, auto: 94, entries: 468 };
  return condos;
}

export const CONDOS: Condo[] = build();
export const CD: Record<string, Condo> = Object.fromEntries(CONDOS.map((c) => [c.id, c]));

function buildPostos(): Posto[] {
  const list: Posto[] = [];
  for (const c of CONDOS) {
    for (const [id, s] of Object.entries(c.svc) as Array<[CompanyId, Service]>) {
      for (let i = 1; i <= s.postos; i++) list.push({ condo: c.id, company: id, idx: i, desc: s.desc, h24: s.h24 });
    }
  }
  const force = (condo: string, company: CompanyId, idx: number, st: Posto["forced"]) => {
    const p = list.find((x) => x.condo === condo && x.company === company && x.idx === idx);
    if (p) p.forced = st;
  };
  force("c13", "infraseg", 2, "crit");
  force("c17", "infraseg", 1, "warn");
  force("c9", "fortsbravo", 1, "warn");
  return list;
}

export const POSTOS: Posto[] = buildPostos();

/** Cumprimento diário dos últimos 14 dias por empresa (%) */
export const TREND: Record<CompanyId, number[]> = Object.fromEntries(
  COMPANIES.map((co) => {
    const r = rng(co.base * 97);
    return [co.id, Array.from({ length: 14 }, (_, i) => clamp(Math.round(co.base - 2 + r() * 5 + (i > 9 ? 1 : 0)), 70, 100))];
  }),
) as Record<CompanyId, number[]>;
TREND.infraseg[13] = 91;

export const totalCombos = CONDOS.length * COMPANIES.length;
export const activeContracts = CONDOS.reduce((a, c) => a + Object.keys(c.svc).length, 0);
