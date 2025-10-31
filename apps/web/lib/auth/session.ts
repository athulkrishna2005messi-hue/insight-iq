export type Session = {
  companyId: string;
  role: "admin" | "member";
};

export function getSession(headers?: Headers): Session {
  const companyId = headers?.get("x-company-id") ?? "mock-company";
  const roleHeader = headers?.get("x-role");
  const role: Session["role"] = roleHeader === "member" ? "member" : "admin";
  return { companyId, role };
}
