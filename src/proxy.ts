import { NextResponse, type NextRequest } from "next/server";
import { isValidPlanoAccessCookie, PLANO_ACCESS_COOKIE } from "@/lib/access";

/**
 * Só a tela Plano passo a passo (/plano) exige senha (cookie após POST /api/access).
 */
export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get(PLANO_ACCESS_COOKIE)?.value;
  if (await isValidPlanoAccessCookie(cookie)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/entrada";
  url.searchParams.set("next", "/plano");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/plano"],
};
