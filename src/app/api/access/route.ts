import { NextResponse } from "next/server";
import { getPlanoPassword, PLANO_ACCESS_COOKIE, planoSessionToken } from "@/lib/access";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ ok: false, error: "Senha inválida" }, { status: 400 });
  }

  if (password !== getPlanoPassword()) {
    return NextResponse.json({ ok: false, error: "Senha incorreta" }, { status: 401 });
  }

  const token = await planoSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PLANO_ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/plano",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
