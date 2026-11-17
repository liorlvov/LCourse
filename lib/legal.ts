// Who operates the site, and the commercial terms shared by all courses.
// Public pages show only the brand and the contact email. The owner's name, number and address
// appear only where consumer law requires them for a distance sale: the terms page and the
// deal details on the checkout page (and Morning shows them on the payment page and receipt).

export const SELLER = {
  brand: 'ELLIMAA',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'business@ellimaa.com',
  phone: '053-521-0215',
  // legal identity: shown only on /terms and in the checkout deal details
  legalName: 'ליאור לבובסקי',
  id: '213008881',
  address: process.env.SELLER_ADDRESS || 'חצרים 2, מיתר',
};

/** Days after purchase in which a buyer can cancel for any reason and get a full refund. */
export const REFUND_DAYS = 14;

/** Bump when the terms change; stored with each purchase. */
export const TERMS_VERSION = '2026-11-17';
export const TERMS_UPDATED = '17.11.2026';
