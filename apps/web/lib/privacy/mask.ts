export function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  const u = user.length <= 2 ? "*".repeat(user.length) : user[0] + "*".repeat(user.length - 2) + user[user.length - 1];
  return `${u}@${domain}`;
}

export function maskName(name: string) {
  if (!name) return name;
  if (name.length <= 2) return "*".repeat(name.length);
  return name[0] + "*".repeat(Math.max(1, name.length - 2)) + name[name.length - 1];
}


