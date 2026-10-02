<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Smart One · regras do projeto

- Leia o `README.md` antes de mudar a estrutura. A referência visual aprovada é `docs/prototipo-v2.html`.
- Interface em português do Brasil. Copiar o tom do protótipo: frases curtas, sem jargão.
- Cores e fontes só pelos tokens de `src/app/globals.css` (no Tailwind: `bg-surface`, `text-ink`, `text-ink-2`, `border-line`, `text-crit`, `font-display`, `font-mono`). Vermelho é reservado para risco/crítico.
- Perfis, navegação e permissões vivem em `src/lib/rbac.ts`; filtros de escopo em `src/lib/scope.ts`. Não espalhar regra de permissão pelas telas.
- Dados ilustrativos ficam em `src/lib/mock`. Ao integrar o Supabase, substituir por queries mantendo os tipos de `src/lib/types.ts`.
- Next.js 16: middleware se chama `proxy` (`src/proxy.ts`). Consultar `node_modules/next/dist/docs/` antes de usar APIs novas.
- Toda tela precisa funcionar a 390px de largura e no tema escuro.
