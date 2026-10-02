/**
 * Tipos de domínio do Smart One.
 * Hoje alimentados por dados ilustrativos em `src/lib/mock`.
 * Cada interface corresponde a uma futura tabela (ou view) no Supabase.
 */

export type CompanyId = "infraseg" | "fortslimp" | "fortsbravo" | "fortservice";
export type CompanyColor = "c1" | "c2" | "c3" | "c4";

export interface Company {
  id: CompanyId;
  name: string;
  tag: string;
  short: string;
  color: CompanyColor;
  letter: "I" | "L" | "B" | "S";
  /** Índice base usado para gerar dados ilustrativos */
  base: number;
}

export interface Service {
  postos: number;
  colab: number;
  desc: string;
  h24: boolean;
  /** Índice de performance operacional do mês (%) */
  ipo: number;
  tasks: number;
  done: number;
  missed: number;
  pending: number;
}

export interface CondoPackages {
  recv: number;
  wait: number;
  over: number;
  avgH: number;
}

export interface CondoAccess {
  visit: number;
  auto: number;
  entries: number;
}

export interface Condo {
  id: string;
  name: string;
  /** Letras das empresas que atendem: I, L, B, S */
  code: string;
  size: number;
  kind: "Residencial" | "Comercial";
  svc: Partial<Record<CompanyId, Service>>;
  pk: CondoPackages;
  acc: CondoAccess;
}

export type PostoStatus = "ok" | "warn" | "crit" | "idle";

export interface Posto {
  condo: string;
  company: CompanyId;
  idx: number;
  desc: string;
  h24: boolean;
  /** Estado fixo de demonstração (descoberto, sem sinal). Sem valor = calculado pelo turno. */
  forced?: PostoStatus;
}

export type Severity = "crit" | "high" | "med" | "low";
export type AlertStatus = "novo" | "assumido" | "escalado" | "encerrado";

export interface Alert {
  id: number;
  sev: Severity;
  title: string;
  detail: string;
  condo: string;
  company: CompanyId;
  openMin: number;
  slaMin: number;
  status: AlertStatus;
  /** Degrau atual da cadeia de escalonamento (1..5) */
  step: number;
  who: string;
}

export type RoleId =
  | "diretor"
  | "gerente"
  | "supervisor"
  | "sindico"
  | "colaborador"
  | "morador"
  | "plataforma";

export type ViewId =
  | "visao"
  | "condominios"
  | "alertas"
  | "notificacoes"
  | "encomendas"
  | "acesso"
  | "portal"
  | "app-colaborador"
  | "app-morador"
  | "usuarios"
  | "master"
  | "estudo"
  | "funcionalidades"
  | "plano"
  | "economia";

export interface Role {
  id: RoleId;
  label: string;
  option: string;
  subtitle: string;
  nav: ViewId[];
  company: CompanyId | null;
  condos: string[] | null;
  home: ViewId;
  scope?: string;
}

export type PackageStatus = "aguardando" | "urgente" | "registrada" | "retirada" | "previsto";

export interface Package {
  id: string;
  unit: string;
  resident: string;
  carrier: string;
  code: string;
  minutes: number | null;
  position: string;
  status: PackageStatus;
  by?: string;
  track?: string;
}

export type Priority = "crit" | "high" | "norm" | "info";

export interface NotificationRule {
  event: string;
  audience: string;
  channel: string;
  priority: Priority;
  rule: string;
}

export interface QueuedMessage {
  title: string;
  audience: string;
  when: string;
  channel: string;
}

export type Persona = "G" | "C" | "P" | "S" | "M";
export type Phase = "MVP" | "Fase 2" | "Fase 3";

export interface Feature {
  module: string;
  name: string;
  personas: Persona[];
  phase: Phase;
}

export type Perm = "y" | "p" | "n";
