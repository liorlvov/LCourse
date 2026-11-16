# מייל כניסה בשם הקורס (ולא בשם Supabase)

**למה זה חובה ולא רק יפה:** שרת המייל המובנה של Supabase שולח רק לכתובות של חברי הצוות בארגון שלך ב־Supabase.
בלי שרת מייל משלך, סטודנט אחר בכלל לא יקבל את קישור הכניסה.

## 1. Resend: שולח המיילים (חינם עד 3,000 מיילים בחודש)
1. נרשמים ב־https://resend.com
2. **Domains ← Add Domain**. מכניסים את הדומיין שממנו נשלח, למשל `ellimaa.com`.
3. Resend מציג כמה רשומות DNS (MX ו־TXT, על תת־דומיין בשם `send` ועל `resend._domainkey`). מוסיפים אותן באתר שבו קנית את הדומיין.
   הרשומות האלה **לא משפיעות** על התיבה הקיימת `business@ellimaa.com`.
4. לוחצים **Verify**. האימות לוקח בדרך כלל כמה דקות.
5. **API Keys ← Create API Key**, עם הרשאת Sending בלבד. מעתיקים את המפתח (מתחיל ב־`re_`). הוא מוצג פעם אחת.

## 2. Supabase: לחבר את Resend
**Authentication ← Emails ← SMTP Settings ← Enable Custom SMTP**

| שדה | ערך |
| --- | --- |
| Sender email | `noreply@ellimaa.com` (או כתובת אחרת בדומיין שאימתת) |
| Sender name | `פיזיקה 3` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | המפתח מ־Resend (`re_...`) |

שומרים. אחר כך, ב־**Authentication ← Rate Limits**, מעלים את "Rate limit for sending emails" ל־100 בשעה לפחות.

## 3. Supabase: התבנית בעברית
**Authentication ← Emails ← Templates**. מעדכנים שתי תבניות, ובשתיהן מדביקים את כל התוכן של הקובץ `emails/login-link.html`:

| תבנית | Subject |
| --- | --- |
| Magic Link | `הקישור שלך לכניסה לפיזיקה 3` |
| Confirm signup | `ברוך הבא לפיזיקה 3: הקישור לכניסה` |

הלוגו במייל נטען מ־`{{ .SiteURL }}/logo-email.png`, ולכן ה־Site URL בסעיף הבא חייב להיות הכתובת של האתר.

## 4. Supabase: כתובות
**Authentication ← URL Configuration**
- **Site URL:** כתובת האתר, למשל `https://lcourse.vercel.app`
- **Redirect URLs:** מוסיפים `https://lcourse.vercel.app/auth/callback`

## 5. בדיקה
נכנסים לאתר ממייל שאינו חבר צוות ב־Supabase (למשל מייל של חבר) ומבקשים קישור. המייל צריך להגיע מ"פיזיקה 3", בעברית ועם הלוגו.
אם לא הגיע, בודקים בספאם, ואז ב־Resend ← Emails מה קרה איתו.
