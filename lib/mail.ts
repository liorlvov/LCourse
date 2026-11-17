import 'server-only';
import { PLATFORM } from '@/lib/courses';
import { SELLER } from '@/lib/legal';
import type { CourseUpdate } from '@/lib/content';

// Service e-mails (course updates) are sent through Resend's HTTP API.
// Needs RESEND_API_KEY and MAIL_FROM (an address on a domain verified in Resend).

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const KIND = { new: 'חדש', changed: 'שונה', removed: 'ירד', same: 'כמו בשנה שעברה' } as const;

export function updateEmailHtml(opts: { courseTitle: string; update: CourseUpdate; url: string; siteUrl: string }) {
  const { courseTitle, update, url, siteUrl } = opts;
  const items = update.items
    .map((i) => `<li style="margin:6px 0;"><b style="color:#b3360a;">${KIND[i.kind]}:</b> ${esc(i.text)}</li>`)
    .join('');
  const font = "font-family:'IBM Plex Sans Hebrew',Arial,Helvetica,sans-serif;";
  return `<!doctype html><html lang="he" dir="rtl"><body style="margin:0;background:#f3eee4;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3eee4;"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#fffcf6;border:2px solid #16181d;overflow:hidden;" dir="rtl">
<tr><td style="background:#16181d;padding:16px 24px;${font}color:#f3eee4;text-align:right;">
<img src="${siteUrl}/logo-email.png" width="36" height="36" alt="" style="vertical-align:middle;margin-left:10px;">
<span style="font-size:20px;font-weight:700;vertical-align:middle;">${esc(courseTitle)}</span>
<span style="font-size:13px;color:#a39d91;vertical-align:middle;"> · ${PLATFORM.name}</span></td></tr>
<tr><td style="height:4px;background:#ff5a1f;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:26px 26px 10px;${font}color:#16181d;text-align:right;">
<p style="margin:0 0 6px;font-size:13px;color:#b3360a;font-weight:700;">עדכון בקורס</p>
<h1 style="margin:0 0 10px;font-size:23px;line-height:1.3;">${esc(update.title)}</h1>
<p style="margin:0 0 14px;font-size:15.5px;line-height:1.7;color:#4a463f;">${esc(update.summary)}</p>
${items ? `<ul style="margin:0 0 20px;padding-right:18px;font-size:15px;line-height:1.6;">${items}</ul>` : ''}
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#ff5a1f;border:2px solid #16181d;">
<a href="${url}" style="display:inline-block;padding:12px 24px;${font}font-size:16px;font-weight:700;color:#16181d;text-decoration:none;">למה שחדש בקורס</a>
</td></tr></table>
<p style="margin:22px 0 18px;font-size:12.5px;color:#6b665d;">קיבלת את המייל כי יש לך גישה לקורס הזה. אלה הודעות שירות על החומר שקנית, לא פרסומת.</p>
</td></tr>
<tr><td style="background:#f7f2e8;border-top:1.5px solid #16181d;padding:12px 26px;${font}font-size:12px;color:#6b665d;text-align:right;">${PLATFORM.name} מופעל על ידי ${SELLER.brand} · ${SELLER.email}</td></tr>
</table></td></tr></table></body></html>`;
}

/** Sends one e-mail per recipient (nobody sees the others), in batches of 100. Returns how many were accepted. */
export async function sendBatch(to: string[], subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) throw new Error('RESEND_API_KEY and MAIL_FROM must be set');
  let sent = 0;
  for (let i = 0; i < to.length; i += 100) {
    const chunk = to.slice(i, i + 100).map((email) => ({ from, to: [email], subject, html }));
    const res = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(chunk),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
    sent += chunk.length;
  }
  return sent;
}
