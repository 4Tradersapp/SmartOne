import type { Alert, Package, Severity } from "@/lib/types";

export const ALERTS: Alert[] = [
  { id: 1, sev: "crit", title: "Posto descoberto", detail: "Portaria · posto 2 · turno 12x36 sem check-in", condo: "c13", company: "infraseg", openMin: 38, slaMin: 15, status: "escalado", step: 5, who: "Anderson Lima (coordenador)" },
  { id: 2, sev: "high", title: "Ronda perimetral incompleta", detail: "3 de 8 pontos NFC lidos na ronda das 02:00", condo: "c11", company: "infraseg", openMin: 24, slaMin: 30, status: "novo", step: 1, who: "" },
  { id: 3, sev: "high", title: "Extintor com recarga vencida", detail: "Torre B · 3º andar · venceu há 4 dias", condo: "c9", company: "fortsbravo", openMin: 95, slaMin: 240, status: "assumido", step: 1, who: "Fernanda Alves" },
  { id: 4, sev: "med", title: "Aparelho do posto sem sinal", detail: "Último envio há 22 min · 2 registros na fila", condo: "c17", company: "infraseg", openMin: 22, slaMin: 30, status: "novo", step: 1, who: "" },
  { id: 5, sev: "med", title: "Insumo abaixo do mínimo", detail: "Papel toalha e desinfetante · estoque para 2 dias", condo: "c10", company: "fortslimp", openMin: 180, slaMin: 1440, status: "assumido", step: 1, who: "Paula Ribeiro" },
  { id: 6, sev: "med", title: "Reciclagem de brigada vence em 12 dias", detail: "2 bombeiros civis · IT 17 exige reciclagem a cada 12 meses", condo: "c3", company: "fortsbravo", openMin: 600, slaMin: 4320, status: "novo", step: 1, who: "" },
  { id: 7, sev: "med", title: "Chamado do síndico: bomba de recalque com ruído", detail: "Aberto pelo portal do cliente · foto anexada", condo: "c16", company: "fortservice", openMin: 70, slaMin: 240, status: "novo", step: 1, who: "" },
  { id: 8, sev: "low", title: "14 encomendas aguardando há mais de 48h", detail: "Lembrete automático enviado por WhatsApp aos moradores", condo: "c7", company: "infraseg", openMin: 300, slaMin: 2880, status: "novo", step: 1, who: "" },
  { id: 9, sev: "med", title: "Roteiro de limpeza atrasado", detail: "Garagem G2 · previsto 15:00 · sem registro", condo: "c15", company: "fortslimp", openMin: 48, slaMin: 60, status: "novo", step: 1, who: "" },
];

export const SEV: Record<Severity, { label: string; pill: string; cls: string }> = {
  crit: { label: "Crítico", pill: "s-crit", cls: "sev-crit" },
  high: { label: "Alto", pill: "s-warn", cls: "sev-high" },
  med: { label: "Médio", pill: "s-warn", cls: "sev-med" },
  low: { label: "Baixo", pill: "s-idle", cls: "sev-low" },
};

export const SEV_ORDER: Severity[] = ["crit", "high", "med", "low"];

export const ESCALATION_CHAIN = ["Push no app", "Supervisor", "WhatsApp", "Ligação automática", "Coordenador"];

/** Sala de encomendas do Residencial Ipê Amarelo (ilustrativo) */
export const PACKAGES: Package[] = [
  { id: "p1", unit: "1204 B", resident: "Marina Costa", carrier: "Mercado Livre", code: "ML 4412 9083", minutes: 12, position: "C3", status: "aguardando" },
  { id: "p11", unit: "503 B", resident: "Tiago Rocha", carrier: "iFood", code: "Pedido 7731", minutes: 3, position: "Balcão", status: "urgente" },
  { id: "p2", unit: "803 A", resident: "Rafael Lima", carrier: "Correios", code: "QB 718 223 405 BR", minutes: 45, position: "A1", status: "aguardando" },
  { id: "p12", unit: "710 A", resident: "Fernanda Reis", carrier: "Correios · AR", code: "JT 102 334 118 BR", minutes: 60, position: "Cofre", status: "registrada" },
  { id: "p3", unit: "1502 B", resident: "Helena Duarte", carrier: "Amazon", code: "TBA 3021 7744", minutes: 70, position: "B2", status: "aguardando" },
  { id: "p4", unit: "304 A", resident: "Jorge Antunes", carrier: "Shopee", code: "BR 26 4471 0932", minutes: 130, position: "B4", status: "aguardando" },
  { id: "p5", unit: "1101 A", resident: "Clara Menezes", carrier: "Magalu", code: "MGZ 55 1039", minutes: 210, position: "A3", status: "aguardando" },
  { id: "p6", unit: "602 B", resident: "Paulo Henrique", carrier: "Jadlog", code: "JD 1092 3381", minutes: 1500, position: "D1", status: "aguardando" },
  { id: "p7", unit: "207 A", resident: "Sônia Prado", carrier: "Correios", code: "QH 912 551 008 BR", minutes: 3300, position: "D2", status: "aguardando" },
  { id: "p8", unit: "1408 B", resident: "Bruno Taveira", carrier: "Loggi", code: "LG 7731 2290", minutes: 40, position: "—", status: "retirada", by: "o próprio morador · QR" },
  { id: "p9", unit: "905 A", resident: "Lívia Castro", carrier: "Mercado Livre", code: "ML 4410 1176", minutes: 95, position: "—", status: "retirada", by: "Rosa (autorizada) · código + foto" },
  { id: "p10", unit: "1204 B", resident: "Marina Costa", carrier: "Amazon", code: "Pedido 702-8811", minutes: null, position: "—", status: "previsto", track: "Saiu para entrega" },
];

export const CARRIERS = ["Correios", "Mercado Livre", "Amazon", "Shopee", "Magalu", "Jadlog", "Loggi", "Total Express", "iFood e entregas de comida"];

export const VISITS: Array<{ initials: string; name: string; type: string; dest: string; time: string; how: string; warn?: boolean }> = [
  { initials: "AP", name: "Ana Paula Ribeiro", type: "Visitante", dest: "1204 B", time: "19:04", how: "Liberada pela moradora no app" },
  { initials: "PA", name: "Pedro Almeida", type: "Visitante", dest: "1101 A", time: "19:22", how: "Convite QR · janela 19h–23h" },
  { initials: "JB", name: "João Batista", type: "Entregador", dest: "503 B", time: "21:28", how: "Liberado pelo app · aguardando saída" },
  { initials: "MV", name: "Marcos Vieira", type: "Prestador · elevador", dest: "Área comum", time: "14:10", how: "Ordem de serviço 2231" },
  { initials: "RL", name: "Rosa Lima", type: "Diarista autorizada", dest: "905 A", time: "08:02", how: "Recorrente · ter e sex, 8h–17h" },
  { initials: "LP", name: "Luana Pires", type: "Visitante", dest: "302 B", time: "13:40", how: "Sem saída registrada há 8h", warn: true },
];

export const ACCESS_EVENTS: Array<{ when: string; kind: "PL" | "FC" | "APP" | "QR" | "IN"; warn?: boolean; plate?: string; text: string }> = [
  { when: "há 1 min", kind: "PL", plate: "FJK2B47", text: "entrada automática · moradora do 1204 B · leitura 98%" },
  { when: "há 3 min", kind: "FC", text: "Saída automática pela facial · visitante Carla M. (802 A) · ficou 1h12" },
  { when: "há 5 min", kind: "APP", text: "Entregador liberado pelo app · morador do 503 B" },
  { when: "há 8 min", kind: "PL", warn: true, plate: "RTA9C11", text: "placa não cadastrada · aguardando decisão da portaria" },
  { when: "há 14 min", kind: "QR", text: "Convite QR validado · Pedro A. para 1101 A" },
  { when: "há 21 min", kind: "FC", text: "Entrada pela facial · morador do 1502 B" },
  { when: "há 26 min", kind: "IN", text: 'Morador do 803 A avisou "estou chegando" · portão preparado' },
];

export const PLATES: Array<{ plate: string; who: string; conf: string; ok: boolean }> = [
  { plate: "FJK2B47", who: "Moradora 1204 B · Onix prata", conf: "98%", ok: true },
  { plate: "QRS8D12", who: "Morador 803 A · Compass preto", conf: "97%", ok: true },
  { plate: "GHT1A55", who: "Visitante pré-autorizado 1101 A", conf: "96%", ok: true },
  { plate: "RTA9C11", who: "Não cadastrada", conf: "95%", ok: false },
];

export const DEVICES: Array<[string, string]> = [
  ["Câmera de placa · portão de veículos", "online"],
  ["Terminal facial · entrada social", "online"],
  ["Terminal facial · saída de pedestres", "online"],
  ["Cancela da garagem", "online"],
  ["Tablet da portaria", "sincronizado"],
];
