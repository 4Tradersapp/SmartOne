import type { CompanyId, Feature, Persona, Phase } from "@/lib/types";

export interface CompanyStudy {
  lines: string[];
  roles: string[];
  routine: string[];
  rules: string[];
  kpis: string[];
  pains: string[];
  modules: string[];
  ask: string[];
}

export const STUDY: Record<CompanyId, CompanyStudy> = {
  infraseg: {
    lines: ["Portaria presencial 24h", "Controlador de acesso", "Recepção", "Ronda não armada (confirmar)", "Monitoramento 24h e portaria remota (o site do grupo oferece; confirmar qual empresa opera)"],
    roles: ["Porteiro", "Controlador de acesso", "Folguista", "Operador de central", "Supervisor volante"],
    routine: ["Troca de turno: livro, chaves, rádio, câmeras", "Conferência de portões e eclusas", "Controle de veículos, pedestres e prestadores", "Recebimento e entrega de encomendas", "Ronda com pontos NFC", "Passagem de turno com pendências"],
    rules: ["Convenção coletiva da categoria (escala 12x36, intervalos)", "LGPD: dados de visitantes e leitor facial (biometria é dado sensível)", "Lei 14.967/2024 e Decreto 13.012/2026: monitoramento eletrônico passa a exigir autorização da PF e CNPJ com objeto exclusivo (CNAE 8020-0/01)", "Portaria não é vigilância: controlador de acesso não faz segurança armada"],
    kpis: ["% de postos cobertos por turno", "Tempo para cobrir uma falta", "Rondas completas no horário", "Ocorrências por posto", "Encomendas retiradas em até 48h", "Tempo de resposta a alertas"],
    pains: ["Falta sem aviso deixa a portaria vazia", "Ronda registrada sem ter sido feita (QR fotografado)", "Livro de ocorrências em papel, ilegível e perdível", "Morador reclama de encomenda extraviada", "Síndico não vê o que acontece à noite"],
    modules: ["Cobertura de postos e folguistas", "Ronda NFC antifraude", "Ocorrência por voz", "Encomendas com leitura de etiqueta e retirada digital", "Controle de acesso: convite QR, foto e documento, placa e facial", "App do morador e modo portaria em tablet", "Central de alertas e de notificações"],
    ask: ["Qual CNPJ opera o monitoramento 24h e a portaria remota?", "Há vigilância patrimonial autorizada pela PF no grupo?", "A plataforma de R$ 900 por condomínio é a da portaria remota/controle de acesso ou um app de gestão?", "Os porteiros usam celular pessoal ou do posto?"],
  },
  fortslimp: {
    lines: ["Limpeza de áreas comuns", "Conservação", "Higienização de sanitários", "Coleta e separação de resíduos", "Vidros e fachada (trabalho em altura)"],
    roles: ["Auxiliar de serviços gerais (ASG)", "Encarregado(a)", "Líder volante"],
    routine: ["Roteiro por área e horário: hall, elevadores, garagem, salão", "Reposição de insumos", "Coleta seletiva", "Foto antes e depois nas áreas críticas", "Auditoria de qualidade pelo encarregado"],
    rules: ["NR-1: gerenciamento de riscos (PGR)", "NR-6: EPI com ficha de entrega assinada", "Fichas de dados de segurança dos produtos químicos (ABNT NBR 14725)", "NR-35 quando houver trabalho em altura", "Convenção coletiva de limpeza e conservação"],
    kpis: ["% do roteiro cumprido", "Nota de auditoria por área", "Consumo de insumos por condomínio", "Reclamações por mês", "Absenteísmo"],
    pains: ["Síndico diz que não limparam e não há prova", "Consumo de material sem controle vira custo", "Falta de ASG sem reposição", "Entrega de EPI sem registro gera passivo trabalhista"],
    modules: ["Checklist por área com foto antes/depois", "Etiqueta por ambiente", "Estoque de insumos por condomínio", "Auditoria de qualidade (supervisor e síndico)", "Entrega de EPI com assinatura no app"],
    ask: ["Atende só condomínios ou também empresas e órgãos públicos?", "Controla hoje o consumo de insumos por cliente?", "Quem audita a qualidade e com que frequência?", "Faz limpeza de fachada ou vidros em altura?"],
  },
  fortsbravo: {
    lines: ["Bombeiro civil em posto fixo (24h ou diurno)", "Inspeção de equipamentos de incêndio", "Exercícios simulados", "Formação e reciclagem de brigada (confirmar)", "Apoio a eventos"],
    roles: ["Bombeiro civil", "Bombeiro civil líder", "Supervisor técnico"],
    routine: ["Inspeção de extintores, hidrantes e mangotinhos", "Iluminação de emergência e central de alarme", "Rotas de fuga e portas corta-fogo", "Ronda preventiva", "Registro de anormalidades", "Simulado com ata"],
    rules: ["Lei 11.901/2009 (profissão de bombeiro civil)", "IT 17 do Corpo de Bombeiros de SP: reciclagem da brigada a cada 12 meses", "IT 17: atestado de brigada renovado há no máximo 12 meses é exigido na vistoria", "IT 17: simulado no mínimo a cada 12 meses, com ata", "AVCB do condomínio em dia"],
    kpis: ["% de equipamentos inspecionados no mês", "Itens vencidos", "Dias até o vencimento do AVCB", "Bombeiros com reciclagem válida", "Simulados realizados", "Tempo de resposta a ocorrência"],
    pains: ["Extintor vencido descoberto na vistoria", "AVCB atrasado trava o condomínio", "Certificados de reciclagem espalhados em pastas", "Inspeção marcada no papel sem ter sido feita"],
    modules: ["Cadastro de equipamentos com etiqueta e histórico", "Calendário de vencimentos", "Controle de certificados com aviso 60/30/15 dias", "Simulado com ata digital", "Relatório técnico mensal ao síndico"],
    ask: ["Atua só com posto fixo ou também forma brigadas dos condomínios?", "A recarga de extintores é própria ou terceirizada?", "Quantos condomínios têm AVCB vencendo nos próximos 6 meses?", "Quantos bombeiros civis no quadro?"],
  },
  fortservice: {
    lines: ["Manutenção predial e zeladoria técnica (confirmar)", "Pequenos reparos elétricos e hidráulicos", "Jardinagem e piscina (confirmar)", "Prevenção de perdas (o site do grupo oferece)", "Apoio a laudos e preventivas"],
    roles: ["Zelador", "Oficial de manutenção", "Eletricista", "Jardineiro / piscineiro", "Fiscal de prevenção de perdas"],
    routine: ["Plano preventivo: bombas, portões, iluminação, reservatórios", "Ordens de serviço com foto", "Limpeza de caixa d’água", "Controle de piscina", "Agenda de laudos do condomínio"],
    rules: ["ABNT NBR 5674: plano de manutenção da edificação", "NR-10 para serviços em eletricidade", "NR-35 para trabalho em altura", "NR-33 para espaço confinado (reservatórios)", "Laudos do condomínio: para-raios, elevadores, AVCB"],
    kpis: ["Preventivas feitas no prazo", "Ordens de serviço abertas e fechadas", "Tempo médio de atendimento", "Reincidência por equipamento", "Custo de manutenção por condomínio"],
    pains: ["Manutenção só corretiva, sempre em emergência", "Chamado do síndico pelo WhatsApp se perde", "Sem histórico do equipamento", "Prazo de laudo esquecido"],
    modules: ["Ordens de serviço com prazo", "Plano preventivo por equipamento", "Histórico por QR no equipamento", "Chamados do síndico pelo portal", "Agenda de laudos"],
    ask: ["Quais serviços a Fortservice presta exatamente?", "Tem técnicos com NR-10 e NR-35?", "Atende clientes fora dos condomínios?", "Faz o plano de manutenção (NBR 5674) para os síndicos?"],
  },
};

const f = (module: string, name: string, personas: string, phase: Phase): Feature => ({
  module,
  name,
  personas: personas.split("") as Persona[],
  phase,
});

export const FEATURES: Feature[] = [
  f("Operação de campo", "Turno com selfie e PIN no celular do posto", "C", "MVP"),
  f("Operação de campo", "Checklist por função e horário, com foto", "C", "MVP"),
  f("Operação de campo", "Ronda por NFC que não pode ser copiada", "C", "MVP"),
  f("Operação de campo", "Ocorrência por voz organizada por IA", "CP", "MVP"),
  f("Operação de campo", "Funciona sem internet e sincroniza depois", "CP", "MVP"),
  f("Operação de campo", "Passagem de turno com chaves e equipamentos", "CP", "MVP"),
  f("Operação de campo", "SOS e confirmação de bem-estar", "C", "MVP"),
  f("Operação de campo", "Procedimentos do posto com confirmação de leitura", "C", "Fase 2"),
  f("Operação de campo", "Supervisão volante com checklist do posto", "GC", "Fase 2"),
  f("Cobertura e alertas", "Posto coberto ou descoberto em tempo real", "G", "MVP"),
  f("Cobertura e alertas", "Alertas com dono, prazo e escalonamento", "G", "MVP"),
  f("Cobertura e alertas", "Cobertura de falta com folguista", "G", "Fase 2"),
  f("Cobertura e alertas", "Detecção de ronda rápida demais e foto repetida", "G", "Fase 2"),
  f("Cobertura e alertas", "Previsão de faltas com IA", "G", "Fase 3"),
  f("Notificações", "Alertas distintos por público e escopo", "GCPSM", "MVP"),
  f("Notificações", "Quatro níveis de prioridade com som próprio", "GCPSM", "MVP"),
  f("Notificações", "Push, WhatsApp, e-mail e ligação automática", "GCPSM", "MVP"),
  f("Notificações", "Comunicados por condomínio, bloco, unidade e perfil", "GS", "MVP"),
  f("Notificações", "Agendamento e recorrência", "GS", "MVP"),
  f("Notificações", "Confirmação de leitura obrigatória", "GCSM", "MVP"),
  f("Notificações", "Resumo diário e horário de silêncio", "GCPSM", "MVP"),
  f("Notificações", "Painel de entregues, lidas e confirmadas", "GS", "MVP"),
  f("Notificações", "Envio no melhor horário de cada pessoa (IA)", "GS", "Fase 2"),
  f("Notificações", "Texto de comunicado melhorado por IA", "GS", "Fase 2"),
  f("Encomendas", "Recebimento com foto e leitura de código de barras ou QR", "P", "MVP"),
  f("Encomendas", "Leitura da etiqueta (OCR) com morador e unidade", "P", "MVP"),
  f("Encomendas", "Identificação da transportadora", "P", "MVP"),
  f("Encomendas", "Aviso imediato com foto por push e WhatsApp", "M", "MVP"),
  f("Encomendas", "Prateleira e etiqueta interna com QR", "P", "MVP"),
  f("Encomendas", "Retirada com QR, foto de quem retira e assinatura na tela", "PM", "MVP"),
  f("Encomendas", "Retirada por terceiro autorizado pelo morador", "PM", "MVP"),
  f("Encomendas", "Lembretes em 24h, 48h e 7 dias; devolução registrada", "PM", "MVP"),
  f("Encomendas", "Correspondência registrada (AR) com regra própria", "P", "MVP"),
  f("Encomendas", "Comida e perecível com aviso urgente", "PM", "MVP"),
  f("Encomendas", "Pré-aviso com código de rastreio ou do pedido", "M", "Fase 2"),
  f("Encomendas", "Rastreio automático por agregador", "M", "Fase 2"),
  f("Encomendas", "Conferência diária da sala de encomendas", "PG", "Fase 2"),
  f("Encomendas", "Integração com armários inteligentes 24h", "PM", "Fase 3"),
  f("Controle de acesso", "Convite de visitante com QR e janela de horário", "M", "MVP"),
  f("Controle de acesso", "Cadastro na portaria com foto e documento (OCR)", "P", "MVP"),
  f("Controle de acesso", "Morador libera ou recusa pelo app, com a foto", "PM", "MVP"),
  f("Controle de acesso", "Autorizados recorrentes com dias e horários", "PM", "MVP"),
  f("Controle de acesso", "Leitura de placa para entrada e saída de veículos", "P", "Fase 2"),
  f("Controle de acesso", "Placa não cadastrada vai para decisão da portaria", "P", "Fase 2"),
  f("Controle de acesso", "Saída automática do visitante pela facial", "P", "Fase 2"),
  f("Controle de acesso", "Facial opcional para moradores, com alternativa", "PM", "Fase 2"),
  f("Controle de acesso", "Prestadores com empresa e ordem de serviço", "PS", "Fase 2"),
  f("Controle de acesso", "Integração com câmeras, terminais faciais e cancelas", "PG", "Fase 2"),
  f("Controle de acesso", "Senha de coação", "CM", "Fase 2"),
  f("Controle de acesso", "Lista de convidados para festas e salão", "M", "Fase 3"),
  f("Controle de acesso", "Interfone pelo app", "PM", "Fase 3"),
  f("App do morador", "Cadastro da unidade: moradores, veículos, autorizados, pets, contatos", "M", "MVP"),
  f("App do morador", "Revisão obrigatória a cada 6 meses com termo de responsabilidade", "M", "MVP"),
  f("App do morador", '"Estou chegando" com placa e tempo estimado', "PM", "MVP"),
  f("App do morador", "Ver e apagar meus dados (LGPD)", "M", "MVP"),
  f("App do morador", "Chamados para o síndico e para as empresas", "MS", "Fase 2"),
  f("App do morador", "Reservas de áreas comuns", "MS", "Fase 3"),
  f("App do morador", "Aviso de chegada automático por localização", "M", "Fase 3"),
  f("Portal do síndico", "Portal único com todos os serviços do grupo", "S", "MVP"),
  f("Portal do síndico", "Relatório mensal assinado com QR de autenticidade", "S", "MVP"),
  f("Portal do síndico", "Chamados, aprovações e orçamentos", "S", "Fase 2"),
  f("Portal do síndico", "Documentos e prazos (AVCB, brigada, caixa d’água)", "S", "Fase 2"),
  f("Gestão do grupo", "Painel consolidado das quatro empresas", "G", "MVP"),
  f("Gestão do grupo", "Mapa de venda cruzada por condomínio", "G", "MVP"),
  f("Gestão do grupo", "Índice de performance por condomínio e serviço", "G", "MVP"),
  f("Gestão do grupo", "Usuários, perfis, escopos e auditoria", "G", "MVP"),
  f("Gestão do grupo", "Documentos e certificados dos colaboradores", "G", "Fase 2"),
  f("Gestão do grupo", "Equipamentos com QR e histórico", "GC", "Fase 2"),
  f("Gestão do grupo", "Manutenção preventiva e ordens de serviço", "GCS", "Fase 2"),
  f("Gestão do grupo", "Integração com Protheus", "G", "Fase 2"),
  f("Gestão do grupo", "Glosa e medição de contratos públicos (IMR)", "G", "Fase 3"),
  f("Plataforma", "Várias empresas com isolamento entre contas", "G", "MVP"),
  f("Plataforma", "Marca do grupo no portal e nos relatórios", "G", "MVP"),
  f("Plataforma", "Medição de uso e cobrança", "G", "Fase 2"),
];

export const PERSONAS: Record<Persona, string> = { G: "Gestão", C: "Colaborador", P: "Portaria", S: "Síndico", M: "Morador" };

export interface PlanPhase {
  when: string;
  title: string;
  items: string[] | null;
  delivery: string;
  current?: boolean;
}

export const PLAN: PlanPhase[] = [
  { when: "Semanas 1–2", title: "Diagnóstico", current: true, delivery: "Mapa operacional do grupo e escopo da primeira versão fechado", items: ["Lista dos 18 condomínios com unidades, serviços, postos e escalas de cada empresa", "Marcas das câmeras de placa, terminais faciais e cancelas já instalados", "Mapa da plataforma atual: o que faz, quem usa, prazo e multa do contrato", "Uma conversa de 1h com o gestor de cada empresa", "Integrações: Protheus (RH, folha, faturamento) e sistema de ponto"] },
  { when: "Semanas 2–3", title: "Contrato e desenho", delivery: "Contrato assinado e telas aprovadas", items: ["Escopo, cronograma e pagamento por etapa", "Telas aprovadas com base neste protótipo", "Perfis, permissões e regras de alerta definidos", "Termos de proteção de dados (LGPD) assinados"] },
  { when: "Semanas 3–14", title: "Construção", delivery: "Primeira versão pronta para piloto", items: null },
  { when: "Semanas 15–18", title: "Piloto", delivery: "Relatório do piloto com números e ajustes", items: ["3 condomínios onde atuam 3 ou mais empresas do grupo", "Celulares do posto, tablet da portaria e etiquetas NFC instalados", "Moradores convidados para o app; quem não instalar recebe por WhatsApp", "Treinamento em campo, por turno", "Medir antes e depois: postos descobertos, tempo de resposta, reclamações"] },
  { when: "Semanas 19–24", title: "Migração", delivery: "18 condomínios na nova plataforma", items: ["Ondas de 5 condomínios", "Plataforma atual desligada só depois da última onda, respeitando o aviso prévio do contrato", "Síndicos recebem acesso ao novo portal"] },
  { when: "Contínuo", title: "Evolução", delivery: "Novos módulos a cada mês", items: ["Integração com Protheus", "Manutenção preventiva e equipamentos", "Glosa e medição em contratos públicos (IMR)", "Previsão de faltas com IA", "Abertura da plataforma para outras empresas do setor"] },
];

export const SPRINTS: Array<[string, string]> = [
  ["Sprint 1", "Base: grupo, empresas, condomínios, unidades, postos, usuários e permissões"],
  ["Sprint 2", "App do colaborador: turno, checklist, ronda NFC, voz, offline"],
  ["Sprint 3", "Alertas, escalonamento e central de notificações com agendamento"],
  ["Sprint 4", "Encomendas com retirada digital e app do morador"],
  ["Sprint 5", "Controle de acesso: visitantes com foto e documento, liberação pelo app, placa e facial"],
  ["Sprint 6", "Painel do grupo, portal do síndico, relatórios e ajustes"],
];
