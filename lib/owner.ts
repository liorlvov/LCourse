// Owners get every course for free and the admin page (/admin). Override with OWNER_EMAILS (comma separated).
const OWNERS = (process.env.OWNER_EMAILS || 'lior.livovsky213@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const isOwner = (email?: string | null) => !!email && OWNERS.includes(email.toLowerCase());
