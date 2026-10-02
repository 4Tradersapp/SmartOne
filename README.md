# Smart One · Grupo FortSvig

Plataforma de gestão operacional para as empresas do Grupo FortSvig (Infraseg, Fortslimp, Fortsbravo e Fortservice): portaria, limpeza, brigada de incêndio e manutenção num só painel.

Este repositório é o **front-end navegável** da proposta, construído a partir do protótipo aprovado (`docs/prototipo-v2.html`). Os dados ainda são **ilustrativos** e ficam em `src/lib/mock`. A próxima etapa é ligar ao Supabase.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS 4 (tokens do tema mapeados em `src/app/globals.css`)
- lucide-react (ícones)
- Deploy: Vercel

## Rodar localmente

```bash
npm install
npm run dev
# http://localhost:3000
```

Node 20.9 ou superior.

## Deploy na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Na Vercel: **Add New → Project → Import** o repositório. A Vercel detecta Next.js sozinha; não precisa mudar nada no build.
3. (Recomendado) Em **Settings → Environment Variables**, defina `DEMO_USER` e `DEMO_PASSWORD`. Com elas, o site pede usuário e senha antes de abrir. A aba Economia mostra valores comerciais, então não convém deixar o link aberto.
4. Cada `git push` na branch principal gera um novo deploy.

## Telas

| Rota | Tela |
|---|---|
| `/visao` | Visão do grupo (indicadores, postos agora, alertas, portaria hoje) |
| `/condominios` | Condomínios × serviços e venda cruzada |
| `/alertas` | Central de alertas com escalonamento |
| `/notificacoes` | Central de notificações: público, canais, agendamento, regras |
| `/encomendas` | Encomendas: recebimento, retirada digital, regras |
| `/acesso` | Controle de acesso: visitantes, placas, facial, LGPD |
| `/portal` | Portal do síndico |
| `/app-colaborador` | Prévia do app do colaborador |
| `/app-morador` | Prévia do app do morador |
| `/usuarios` | Usuários, perfis e matriz de permissões |
| `/master` | Master da plataforma (4Traders) |
| `/estudo` · `/funcionalidades` · `/plano` · `/economia` | Material de apresentação |

O seletor **Ver como** (topo) troca o perfil e mostra só o que cada perfil pode ver. O perfil fica salvo no navegador.

## Estrutura

```
src/
  app/
    (app)/            rotas do painel (cada pasta = uma tela)
    globals.css       tokens de cor e tipografia + classes de componente
    layout.tsx        fontes e metadados
  components/
    providers/        estado da demonstração (perfil, alertas, encomendas, fila) e tooltip
    shell/            barra lateral, topo e seletor de perfil
    ui/               peças reutilizáveis (Kpi, Panel, Steps, Sparkline, Phone...)
    views/            uma tela por arquivo
  lib/
    types.ts          tipos de domínio (viram tabelas no Supabase)
    rbac.ts           perfis, navegação e matriz de permissões
    scope.ts          filtros por escopo do perfil
    mock/             dados ilustrativos
  proxy.ts            senha opcional da demonstração (Next 16 chama middleware de proxy)
docs/
  prototipo-v2.html   protótipo aprovado, referência visual
```

## Próximos passos (Cursor)

1. **Supabase**: criar o projeto (região São Paulo) e as tabelas a partir de `src/lib/types.ts`: `groups`, `companies`, `condos`, `units`, `services`, `postos`, `staff`, `alerts`, `packages`, `visits`, `access_events`, `notifications`, `memberships`.
2. **Multi-tenant e permissões**: `tenant_id` em todas as tabelas + políticas RLS escritas a partir de `PERMISSIONS` em `src/lib/rbac.ts`. Testes automáticos de isolamento entre contas.
3. **Auth**: Supabase Auth (e-mail, magic link, MFA para diretoria e gerentes). O seletor "Ver como" sai do produto e vira o perfil real do usuário.
4. **Trocar os mocks**: cada função de `src/lib/mock` vira uma query; as ações do `demo-provider` viram mutations.
5. **Apps**: colaborador e morador em React Native/Expo, com sincronização offline.

## Convenções

- Texto da interface em português do Brasil, no tom do protótipo: direto, sem jargão técnico.
- Cores sempre pelos tokens (`var(--ink)`, `bg-surface`, `text-crit`). Vermelho só para risco.
- Números em `font-mono` com algarismos tabulares.
- Toda tela nova funciona em celular (sem rolagem horizontal) e no tema escuro.
