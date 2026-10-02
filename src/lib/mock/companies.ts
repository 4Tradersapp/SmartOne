import type { Company, CompanyId } from "@/lib/types";

export const COMPANIES: Company[] = [
  { id: "infraseg", name: "Infraseg", tag: "Infraestrutura em serviços gerais", short: "Portaria e acesso", color: "c1", letter: "I", base: 93 },
  { id: "fortslimp", name: "Fortslimp", tag: "Limpeza e conservação", short: "Limpeza", color: "c2", letter: "L", base: 89 },
  { id: "fortsbravo", name: "Fortsbravo", tag: "Brigada de incêndio", short: "Brigada", color: "c3", letter: "B", base: 96 },
  { id: "fortservice", name: "Fortservice", tag: "Serviços especializados", short: "Manutenção", color: "c4", letter: "S", base: 87 },
];

export const CO: Record<CompanyId, Company> = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c]),
) as Record<CompanyId, Company>;

export const LETTER_TO_COMPANY: Record<string, CompanyId> = {
  I: "infraseg",
  L: "fortslimp",
  B: "fortsbravo",
  S: "fortservice",
};
