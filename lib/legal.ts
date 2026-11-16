// Business details and commercial terms shown on the site and in the legal pages.
// Change them here (or through the env vars below) and every page follows.

export const SELLER = {
  name: 'ליאור לבובסקי',
  trade: 'ELLIMAA AI Solutions',
  status: 'עוסק פטור',
  id: '213008881',
  address: 'חצרים 2, מיתר',
  phone: '053-521-0215',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'business@ellimaa.com',
};

export const PRICE_ILS = Number(process.env.COURSE_PRICE_ILS ?? 69);

/** Full access lasts until the end of this day (Israel time). Set COURSE_ACCESS_UNTIL=YYYY-MM-DD to change. */
export const ACCESS_UNTIL_ISO = process.env.COURSE_ACCESS_UNTIL || '2027-04-30';
const ACCESS_END = new Date(`${ACCESS_UNTIL_ISO}T23:59:59+03:00`);

export function accessOpen(now = new Date()) {
  return now.getTime() <= ACCESS_END.getTime();
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${Number(d)}.${Number(m)}.${y}`;
}

export const ACCESS_UNTIL = formatDate(ACCESS_UNTIL_ISO);

/** Days after purchase in which a buyer can cancel for any reason and get a full refund. */
export const REFUND_DAYS = 14;

/** Bump when the terms change; stored with each purchase. */
export const TERMS_VERSION = '2026-11-16';
export const TERMS_UPDATED = '16.11.2026';
