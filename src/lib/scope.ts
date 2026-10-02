import { CO, COMPANIES } from "@/lib/mock/companies";
import { CONDOS, POSTOS } from "@/lib/mock/condos";
import type { Alert, Company, CompanyId, Condo, Posto, PostoStatus, Role, Service } from "@/lib/types";

/** Condomínios visíveis para o perfil (escopo de local + empresa) */
export function scopeCondos(role: Role): Condo[] {
  return CONDOS.filter((c) => (!role.condos || role.condos.includes(c.id)) && (!role.company || c.svc[role.company]));
}

/** Condomínios para portaria (encomendas e acesso): ignora o filtro de empresa */
export function portariaCondos(role: Role): Condo[] {
  return CONDOS.filter((c) => !role.condos || role.condos.includes(c.id));
}

export function scopeCompanies(role: Role): Company[] {
  return role.company ? [CO[role.company]] : COMPANIES;
}

export function services(role: Role, c: Condo): Array<[CompanyId, Service]> {
  return (Object.entries(c.svc) as Array<[CompanyId, Service]>).filter(([id]) => !role.company || id === role.company);
}

export function postoStatus(p: Posto, isDay: boolean): PostoStatus {
  if (p.forced) return p.forced;
  return p.h24 || isDay ? "ok" : "idle";
}

export function scopePostos(role: Role): Posto[] {
  const ids = new Set(scopeCondos(role).map((c) => c.id));
  return POSTOS.filter((p) => ids.has(p.condo) && (!role.company || p.company === role.company));
}

export function scopeAlerts(role: Role, alerts: Alert[]): Alert[] {
  const ids = new Set(scopeCondos(role).map((c) => c.id));
  return alerts.filter((a) => ids.has(a.condo) && (!role.company || a.company === role.company));
}
