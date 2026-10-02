import { NextResponse, type NextRequest } from "next/server";

/**
 * Proteção simples da demonstração.
 * Se DEMO_USER e DEMO_PASSWORD estiverem definidos (Vercel → Settings → Environment Variables),
 * o navegador pede usuário e senha antes de abrir qualquer página. Sem as variáveis, o site fica aberto.
 * Quando o login real (Supabase Auth) entrar, este arquivo passa a cuidar só da sessão.
 */
export function proxy(request: NextRequest) {
  const user = process.env.DEMO_USER;
  const pass = process.env.DEMO_PASSWORD;
  if (!user || !pass) return NextResponse.next();

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const [u, p] = atob(header.slice(6)).split(":");
    if (u === user && p === pass) return NextResponse.next();
  }
  return new NextResponse("Acesso restrito", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Smart One", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg).*)"],
};
