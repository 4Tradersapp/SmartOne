import type { Perm, Role, RoleId, ViewId } from "@/lib/types";

/**
 * Perfis, escopos e navegação.
 * No produto real isto vira: tabela `memberships` (usuário × perfil × escopo)
 * + políticas RLS no Supabase. A matriz PERMISSIONS é a fonte para escrever essas políticas.
 */
export const ROLES: Record<RoleId, Role> = {
  diretor: {
    id: "diretor",
    label: "Diretor do grupo",
    option: "Diretor do grupo",
    subtitle: "4 empresas · 18 condomínios",
    nav: ["visao", "condominios", "alertas", "notificacoes", "encomendas", "acesso", "portal", "app-colaborador", "app-morador", "usuarios", "estudo", "funcionalidades", "plano", "economia"],
    company: null,
    condos: null,
    home: "visao",
  },
  gerente: {
    id: "gerente",
    label: "Gerente da Fortslimp",
    option: "Gerente · Fortslimp",
    subtitle: "Fortslimp · 9 condomínios",
    nav: ["visao", "condominios", "alertas", "notificacoes", "usuarios"],
    company: "fortslimp",
    condos: null,
    home: "visao",
    scope: "Você vê só a operação da Fortslimp: 9 condomínios, equipes e alertas de limpeza. Financeiro e as outras empresas ficam ocultos.",
  },
  supervisor: {
    id: "supervisor",
    label: "Supervisor da Infraseg",
    option: "Supervisor · Infraseg",
    subtitle: "Infraseg · rota de 7 condomínios",
    nav: ["visao", "condominios", "alertas", "encomendas", "acesso", "app-colaborador"],
    company: "infraseg",
    condos: ["c1", "c4", "c6", "c8", "c11", "c13", "c17"],
    home: "alertas",
    scope: "Você vê só os 7 condomínios da sua rota na Infraseg. Pode assumir alertas e aprovar justificativas; não exclui registros.",
  },
  sindico: {
    id: "sindico",
    label: "Síndico",
    option: "Síndico · Res. Ipê Amarelo",
    subtitle: "Portal do cliente · Res. Ipê Amarelo",
    nav: ["portal", "notificacoes"],
    company: null,
    condos: ["c1"],
    home: "portal",
  },
  colaborador: {
    id: "colaborador",
    label: "Porteiro",
    option: "Porteiro · celular e tablet",
    subtitle: "Portaria · Res. Ipê Amarelo",
    nav: ["app-colaborador", "encomendas", "acesso"],
    company: "infraseg",
    condos: ["c1"],
    home: "app-colaborador",
    scope: "Porteiro do Residencial Ipê Amarelo: vê só a portaria onde está escalado, com encomendas, visitantes e tarefas do turno.",
  },
  morador: {
    id: "morador",
    label: "Morador",
    option: "Morador · 1204 B",
    subtitle: "App do morador · 1204 B",
    nav: ["app-morador"],
    company: null,
    condos: ["c1"],
    home: "app-morador",
  },
  plataforma: {
    id: "plataforma",
    label: "Administrador da plataforma",
    option: "Administrador da plataforma",
    subtitle: "Plataforma 4Traders",
    nav: ["master", "usuarios"],
    company: null,
    condos: null,
    home: "master",
    scope: "Visão da 4Traders: contas, módulos, uso e saúde. Dados operacionais do grupo só são abertos com autorização registrada.",
  },
};

export const ROLE_ORDER: RoleId[] = ["diretor", "gerente", "supervisor", "sindico", "colaborador", "morador", "plataforma"];

export const NAV: Record<ViewId, { label: string; group: "prod" | "pres"; path: string }> = {
  visao: { label: "Visão do grupo", group: "prod", path: "/visao" },
  condominios: { label: "Condomínios", group: "prod", path: "/condominios" },
  alertas: { label: "Central de alertas", group: "prod", path: "/alertas" },
  notificacoes: { label: "Notificações", group: "prod", path: "/notificacoes" },
  encomendas: { label: "Encomendas", group: "prod", path: "/encomendas" },
  acesso: { label: "Controle de acesso", group: "prod", path: "/acesso" },
  portal: { label: "Portal do síndico", group: "prod", path: "/portal" },
  "app-colaborador": { label: "App do colaborador", group: "prod", path: "/app-colaborador" },
  "app-morador": { label: "App do morador", group: "prod", path: "/app-morador" },
  usuarios: { label: "Usuários e permissões", group: "prod", path: "/usuarios" },
  master: { label: "Master da plataforma", group: "prod", path: "/master" },
  estudo: { label: "Estudo das empresas", group: "pres", path: "/estudo" },
  funcionalidades: { label: "Mapa de funcionalidades", group: "pres", path: "/funcionalidades" },
  plano: { label: "Plano passo a passo", group: "pres", path: "/plano" },
  economia: { label: "Economia", group: "pres", path: "/economia" },
};

export function viewFromPath(pathname: string): ViewId | null {
  const seg = pathname.split("/").filter(Boolean)[0];
  return (Object.keys(NAV) as ViewId[]).find((k) => NAV[k].path === `/${seg}`) ?? null;
}

export const PERM_COLUMNS = ["Diretor", "Gerente", "Supervisor", "Portaria", "RH / DP", "Financeiro", "Síndico", "Morador"];

/** y = permitido · p = só no próprio escopo · n = não permitido */
export const PERMISSIONS: Array<[string, ...Perm[]]> = [
  ["Ver painel consolidado do grupo", "y", "n", "n", "n", "p", "n", "n", "n"],
  ["Ver operação de todas as empresas", "y", "n", "n", "n", "y", "n", "n", "n"],
  ["Convidar usuários e definir perfis", "y", "p", "n", "n", "n", "n", "n", "n"],
  ["Configurar checklists, rondas e prazos", "y", "y", "n", "n", "n", "n", "n", "n"],
  ["Assumir, escalonar e encerrar alertas", "y", "y", "y", "n", "n", "n", "n", "n"],
  ["Enviar comunicados", "y", "p", "p", "n", "p", "n", "p", "n"],
  ["Registrar e entregar encomendas", "n", "n", "p", "y", "n", "n", "n", "n"],
  ["Liberar visitantes", "n", "n", "p", "y", "n", "n", "n", "p"],
  ["Ver fotos e documentos de visitantes", "n", "n", "p", "p", "n", "n", "n", "n"],
  ["Editar cadastro da unidade", "n", "n", "n", "n", "n", "n", "n", "p"],
  ["Ver documentos pessoais dos colaboradores", "y", "p", "n", "n", "y", "n", "n", "n"],
  ["Ver contratos, medição e financeiro", "y", "n", "n", "n", "n", "y", "n", "n"],
  ["Exportar relatórios", "y", "y", "p", "n", "p", "y", "y", "n"],
  ["Abrir chamados e aprovar orçamentos", "n", "n", "n", "n", "n", "n", "y", "p"],
  ["Executar tarefas, rondas e ocorrências", "n", "n", "p", "y", "n", "n", "n", "n"],
];

export const USERS: Array<[string, string, string, string]> = [
  ["Você", "Diretor do grupo", "Grupo inteiro", "Ativo · MFA"],
  ["Paula Ribeiro", "Gerente da empresa", "Fortslimp", "Ativo · MFA"],
  ["Fernanda Alves", "Gerente da empresa", "Fortsbravo", "Ativo · MFA"],
  ["Anderson Lima", "Coordenador operacional", "Infraseg · 18 condomínios", "Ativo"],
  ["Ricardo Souza", "Supervisor volante", "Infraseg · 7 condomínios", "Ativo"],
  ["Juliana Costa", "RH / DP", "Grupo inteiro", "Ativo"],
  ["Fábio Teixeira", "Financeiro / comercial", "Grupo inteiro", "Convite enviado"],
  ["Carlos Nogueira", "Colaborador de campo", "Res. Ipê Amarelo · Portaria", "Ativo"],
  ["Antônio Mendes", "Síndico", "Res. Ipê Amarelo", "Ativo"],
  ["Marina Costa", "Morador", "Res. Ipê Amarelo · 1204 B", "Ativo"],
  ["Tablet da portaria", "Dispositivo da portaria", "Res. Ipê Amarelo", "Ativo"],
  ["Suporte 4Traders", "Administrador da plataforma", "Acesso só com autorização", "Auditado"],
];
