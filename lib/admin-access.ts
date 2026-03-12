function getAllowedAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";
  const emails = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return new Set(emails);
}

export function hasConfiguredAdminEmails(): boolean {
  return getAllowedAdminEmails().size > 0;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails.size === 0) {
    return false;
  }

  return allowedEmails.has(email.trim().toLowerCase());
}
