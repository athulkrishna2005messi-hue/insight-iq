export type Session = {
  companyId: string;
  role: "admin" | "viewer";
};

export function getSession(headers: Headers): Session | null {
  // Mock session: read from header for now
  const companyId = headers.get("x-company-id") ?? "demo-company";
  if (!companyId) return null;
  const role = (headers.get("x-role") as Session["role"]) ?? "admin";
  return { companyId, role };
}


