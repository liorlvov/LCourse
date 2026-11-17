import 'server-only';

// Morning (formerly Green Invoice) API.
// Since June 2026 tokens come from the Morning auth host (OAuth client_credentials),
// while data calls still go to api.greeninvoice.co.il.
const sandbox = process.env.MORNING_ENV === 'sandbox';
const AUTH_BASE = sandbox ? 'https://api.sandbox.morning.dev' : 'https://api.morning.co';
const API_BASE = sandbox ? 'https://sandbox.d.greeninvoice.co.il/api/v1' : 'https://api.greeninvoice.co.il/api/v1';

let cached: { token: string; until: number } | null = null;

async function getToken(): Promise<string> {
  if (cached && cached.until > Date.now() + 60_000) return cached.token;
  const id = process.env.MORNING_API_KEY_ID!;
  const secret = process.env.MORNING_API_KEY_SECRET!;
  const attempts: Array<() => Promise<Response>> = [
    () => fetch(`${AUTH_BASE}/idp/v1/oauth/token`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'client_credentials', client_id: id, client_secret: secret }),
    }),
    () => fetch(`${AUTH_BASE}/idp/v1/oauth/token`, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials', client_id: id, client_secret: secret }),
    }),
    // legacy endpoint, kept as a fallback
    () => fetch(`${API_BASE}/account/token`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, secret }),
    }),
  ];
  let last = '';
  for (const attempt of attempts) {
    const res = await attempt();
    const text = await res.text();
    if (!res.ok) { last = `${res.status} ${text.slice(0, 200)}`; continue; }
    const j = JSON.parse(text || '{}');
    const token = j.accessToken ?? j.access_token ?? j.token;
    if (!token) { last = `no token in ${text.slice(0, 200)}`; continue; }
    const expiresAt = typeof j.expiresAt === 'number' ? j.expiresAt * (j.expiresAt < 1e12 ? 1000 : 1)
      : Date.now() + (Number(j.expires_in) || 3000) * 1000;
    cached = { token, until: expiresAt };
    return token;
  }
  throw new Error(`Morning auth failed: ${last}`);
}

async function call(path: string, init: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
    cache: 'no-store',
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  // Morning sometimes answers 201 with { success: false, errorCode }
  if (!res.ok || body?.success === false || (body?.errorCode && body.errorCode !== 0)) {
    throw new Error(`Morning ${path} failed: ${res.status} ${text.slice(0, 300)}`);
  }
  return body;
}

export async function createPaymentForm(opts: {
  purchaseId: string; email: string; name: string; amount: number; siteUrl: string; description: string; courseKey: string;
}): Promise<string> {
  const { purchaseId, email, name, amount, siteUrl, description, courseKey } = opts;
  const secret = process.env.MORNING_WEBHOOK_SECRET!;
  const body: Record<string, unknown> = {
    description,
    type: Number(process.env.MORNING_DOC_TYPE ?? 400), // 400 = receipt (עוסק פטור); 320 = tax invoice-receipt
    lang: 'he',
    currency: 'ILS',
    vatType: Number(process.env.MORNING_VAT_TYPE ?? 0),
    amount,
    maxPayments: 1,
    client: { name: name || email, emails: [email], add: true },
    successUrl: `${siteUrl}/thanks?pid=${purchaseId}`,
    failureUrl: `${siteUrl}/checkout?course=${courseKey}&payment=failed`,
    notifyUrl: `${siteUrl}/api/morning/notify?token=${encodeURIComponent(secret)}&pid=${purchaseId}`,
    custom: purchaseId,
  };
  if (process.env.MORNING_PLUGIN_ID) body.pluginId = process.env.MORNING_PLUGIN_ID;
  const res = await call('/payments/form', { method: 'POST', body: JSON.stringify(body) });
  const url = typeof res.url === 'string' ? res.url : res.url?.he ?? res.url?.origin;
  if (!url) throw new Error(`Morning returned no payment url: ${JSON.stringify(res).slice(0, 300)}`);
  return url;
}

/** Fetch a document so a notification can be checked against Morning itself (Morning does not sign webhooks). */
export async function getDocument(id: string) {
  return call(`/documents/${encodeURIComponent(id)}`, { method: 'GET' });
}
