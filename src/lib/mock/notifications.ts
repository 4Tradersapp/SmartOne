import type { NotificationRule, Priority, QueuedMessage } from "@/lib/types";

export const PRIORITIES: Record<Priority, { label: string; pill: string; color: string; behavior: string }> = {
  crit: { label: "Crítico", pill: "s-crit", color: "var(--crit)", behavior: "Alarme contínuo até alguém assumir; liga se ninguém responder" },
  high: { label: "Alto", pill: "s-warn", color: "var(--c3)", behavior: "Som próprio e vibração longa; repete em 2 min" },
  norm: { label: "Normal", pill: "s-info", color: "var(--focus)", behavior: "Som padrão; respeita horário de silêncio" },
  info: { label: "Informativo", pill: "s-idle", color: "var(--idle)", behavior: "Silencioso; entra no resumo do dia" },
};

export const NOTIFICATION_RULES: NotificationRule[] = [
  { event: "Encomenda recebida", audience: "Morador da unidade", channel: "Push + WhatsApp com foto", priority: "norm", rule: "Lembrete em 24h, 48h e 7 dias" },
  { event: "Visitante na portaria", audience: "Morador da unidade", channel: "Push com foto e botões", priority: "high", rule: "Sem resposta em 2 min, a portaria liga" },
  { event: "Morador chegando", audience: "Portaria do condomínio", channel: "Push no tablet", priority: "high", rule: "Com placa e tempo estimado" },
  { event: "Placa não cadastrada", audience: "Portaria e supervisor", channel: "Push", priority: "high", rule: "Entra na fila de decisão" },
  { event: "Visitante sem saída", audience: "Portaria e supervisor", channel: "Push no fim do turno", priority: "norm", rule: "Fecha ou justifica" },
  { event: "Posto descoberto", audience: "Supervisor → coordenador → gerente", channel: "Push crítico + WhatsApp + ligação", priority: "crit", rule: "Escalonamento a cada 5 min" },
  { event: "SOS ou senha de coação", audience: "Supervisor, central e diretoria", channel: "Alarme crítico", priority: "crit", rule: "Silencioso para quem acionou" },
  { event: "Ronda não feita", audience: "Supervisor", channel: "Push", priority: "high", rule: "15 min após o horário" },
  { event: "Tarefa em 15 minutos", audience: "Colaborador", channel: "Push", priority: "norm", rule: "Só no turno da pessoa" },
  { event: "Mudança de escala", audience: "Colaborador", channel: "Push + WhatsApp", priority: "norm", rule: "Exige confirmação" },
  { event: "Certificado vencendo", audience: "RH e gerente da empresa", channel: "Resumo diário", priority: "info", rule: "60, 30 e 15 dias antes" },
  { event: "Ocorrência grave", audience: "Síndico do condomínio", channel: "Push + WhatsApp", priority: "high", rule: "O grupo decide o que o síndico vê" },
  { event: "Relatório mensal pronto", audience: "Síndico", channel: "E-mail + push", priority: "info", rule: "Dia 1 de cada mês" },
  { event: "Comunicado do síndico", audience: "Moradores (por bloco ou unidade)", channel: "Push + WhatsApp", priority: "norm", rule: "Agendado, com leitura confirmada" },
  { event: "Cadastro desatualizado", audience: "Morador", channel: "Push mensal", priority: "info", rule: "Até a revisão" },
  { event: "Índice abaixo da meta", audience: "Gerente e diretoria", channel: "Resumo diário", priority: "norm", rule: "Por condomínio e serviço" },
];

export const INITIAL_QUEUE: QueuedMessage[] = [
  { title: "Manutenção da bomba de recalque · amanhã 9h–12h", audience: "Moradores · Morada do Lago · bloco B", when: "amanhã 07:30", channel: "Push + WhatsApp · leitura confirmada" },
  { title: "Escala da semana", audience: "Colaboradores · 4 empresas", when: "domingo 18:00", channel: "Push · exige confirmação" },
  { title: "Revise seu cadastro", audience: "Moradores com cadastro vencido · 18 condomínios", when: "dia 1 · 19:00", channel: "Push · recorrente" },
  { title: "Reciclagem da brigada vence em 30 dias", audience: "RH e gerente · Fortsbravo", when: "segunda 08:00", channel: "Resumo diário" },
  { title: "Relatório de setembro disponível", audience: "Síndicos · 18 condomínios", when: "01/10 09:00", channel: "E-mail + push · enviado" },
];

export const SMART_RULES: Array<{ key: string; label: string; detail: string }> = [
  { key: "resumo", label: "Resumo diário", detail: "Avisos informativos viram um resumo às 19h" },
  { key: "silencio", label: "Horário de silêncio", detail: "22h às 7h só passam alertas críticos" },
  { key: "melhor", label: "Melhor horário por pessoa", detail: "Aprende quando cada um costuma ler" },
  { key: "antirep", label: "Sem repetição", detail: "O mesmo aviso não volta em menos de 4h" },
  { key: "escalar", label: "Escalonar se ninguém ler", detail: "Push vira WhatsApp e depois ligação" },
];

export const READ_STATS: Array<[string, number]> = [
  ["Entregue", 99],
  ["Aberto", 86],
  ["Confirmado", 78],
  ["Lido pelo push", 64],
  ["Lido pelo WhatsApp", 93],
];
