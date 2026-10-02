/** Cookie httpOnly — libera só a rota /plano (Plano passo a passo). */
export const PLANO_ACCESS_COOKIE = "so_plano";

/** Senha do plano passo a passo. Defina PLANO_PASSWORD ou ACCESS_PASSWORD na Vercel. */
export function getPlanoPassword(): string {
  const fromEnv = process.env.PLANO_PASSWORD ?? process.env.ACCESS_PASSWORD ?? process.env.DEMO_PASSWORD;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return "220297";
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function planoSessionToken(): Promise<string> {
  return sha256Hex(`smart-one:plano:${getPlanoPassword()}`);
}

export async function isValidPlanoAccessCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const expected = await planoSessionToken();
  return value === expected;
}
