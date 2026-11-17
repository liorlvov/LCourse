# כניסה עם Google ומייל בשם האתר: שלב אחרי שלב

הסדר: קודם Resend, כי בלי שרת מייל משלך סטודנטים לא מקבלים מייל בכלל. אחר כך Google, ובסוף הבדיקה.

---

## חלק א׳: Resend, השולח של המיילים (כ־15 דקות)

**1. פותחים חשבון.** נכנסים ל־https://resend.com ונרשמים. אפשר עם חשבון Google. המסלול החינמי מספיק: 3,000 מיילים בחודש.

**2. מוסיפים את הדומיין.**
- בתפריט משמאל: **Domains**, ואז **Add Domain**.
- כותבים `ellimaa.com`.
- באזור (Region) בוחרים `eu-west-1 (Ireland)`, הכי קרוב לישראל.
- לוחצים **Add**.

**3. מעתיקים רשומות DNS.**
- Resend מציג 3–4 רשומות: MX ו־TXT על `send`, ו־TXT על `resend._domainkey`.
- פותחים בטאב אחר את האתר שבו קנית את `ellimaa.com` (GoDaddy, Namecheap, Cloudflare, Box וכו׳) ונכנסים לניהול DNS.
- מוסיפים כל רשומה בדיוק כמו ש־Resend מציג: סוג, שם וערך. ב־MX מעתיקים גם את ה־Priority.
- **לא מוחקים** אף רשומה קיימת. הרשומות החדשות יושבות על `send` ועל `resend._domainkey`, ולכן התיבה `business@ellimaa.com` ממשיכה לעבוד כרגיל.

**4. מאמתים.** חוזרים ל־Resend ולוחצים **Verify DNS Records**.
- בדרך כלל זה לוקח כמה דקות, לפעמים עד שעה.
- ממשיכים כשכל הרשומות ירוקות (Verified).

**5. יוצרים מפתח.**
- **API Keys**, ואז **Create API Key**.
- שם: `lcourse`. הרשאה: **Sending access**. דומיין: `ellimaa.com`.
- מעתיקים את המפתח, שמתחיל ב־`re_`. **הוא מוצג פעם אחת בלבד.** לא שולחים אותו בצ'אט.

**6. מחברים ל־Supabase.** ב־Supabase נכנסים ל־**Authentication**, ואז **Emails**, ואז **SMTP Settings**. מדליקים **Enable Custom SMTP** וממלאים:

| שדה | ערך |
| --- | --- |
| Sender email | `noreply@ellimaa.com` |
| Sender name | `LCOURSE` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Minimum interval | `30` |
| Username | `resend` |
| Password | המפתח מ־Resend (`re_...`) |

לוחצים **Save**.

**7. מעלים את מגבלת השליחה.** ב־Supabase: **Authentication**, ואז **Rate Limits**. מעלים את "emails sent per hour" ל־`100`. שומרים.

**8. מדביקים את התבנית בעברית.** ב־Supabase: **Authentication**, ואז **Emails**, ואז **Templates**. ממלאים שתי תבניות, ובשתיהן ה־Body הוא כל התוכן של הקובץ `emails/login-link.html`:

| תבנית | Subject |
| --- | --- |
| **Magic Link** | `הקישור שלך לכניסה ל־LCOURSE` |
| **Confirm signup** | `ברוך הבא ל־LCOURSE: הקישור לכניסה` |

**9. מגדירים את המיילים על עדכוני קורס.** ב־Vercel: **Settings**, ואז **Environment Variables**. מוסיפים:
- `RESEND_API_KEY` = אותו מפתח `re_...`. מסמנים כ־**Sensitive**.
- `MAIL_FROM` = `LCOURSE <noreply@ellimaa.com>`

---

## חלק ב׳: כניסה עם Google (כ־10 דקות)

**1. מכינים את מסך ההסכמה ב־Google.**
- נכנסים ל־https://console.cloud.google.com.
- למעלה: **Select a project**, ואז **New project**. שם: `LCOURSE`. **Create**.
- בתפריט: **Google Auth Platform** (או **APIs & Services**, ואז **OAuth consent screen**), ולוחצים **Get started**.
- App name: `LCOURSE`. Support email: המייל שלך. Audience: **External**. Contact email: המייל שלך. מסיימים.

**2. יוצרים מפתח OAuth.**
- **Clients** (או **Credentials**), ואז **Create client**.
- Application type: **Web application**. שם: `LCOURSE web`.
- **Authorized JavaScript origins**, מוסיפים:
  - `https://<כתובת-האתר>` (למשל `https://lcourse.vercel.app`)
- **Authorized redirect URIs**, מוסיפים בדיוק את זה:
  - `https://ahopoznyztqxzgxtfikr.supabase.co/auth/v1/callback`
- **Create**. מעתיקים את **Client ID** ואת **Client secret**.

**3. מפרסמים את האפליקציה.** ב־**Audience** לוחצים **Publish app**. אחרת רק משתמשי בדיקה יוכלו להיכנס.
אנחנו מבקשים רק מייל ושם, ולכן Google לא דורש אימות מיוחד.

**4. מחברים ל־Supabase.**
- **Authentication**, ואז **Sign In / Providers**, ואז **Google**. מדליקים **Enable**.
- מדביקים את Client ID ואת Client secret, ושומרים.

---

## חלק ג׳: כתובות (חובה, פעם אחת)

**ב־Supabase:** **Authentication**, ואז **URL Configuration**.
- **Site URL:** כתובת האתר, למשל `https://lcourse.vercel.app`
- **Redirect URLs:** מוסיפים `https://lcourse.vercel.app/auth/callback`

**ב־Vercel:**
- `NEXT_PUBLIC_SITE_URL` = כתובת האתר.
- אחר כך **Deployments**, ואז שלוש הנקודות, ואז **Redeploy**.

---

## חלק ד׳: בדיקה
1. בחלון גלישה בסתר נכנסים לאתר, ואז **כניסה**, ואז **המשך עם Google**. צריך לחזור לאתר מחובר.
2. יוצאים, ונכנסים שוב עם **קישור למייל**, הפעם ממייל של חבר. המייל צריך להגיע מ־LCOURSE, בעברית ועם הלוגו.
3. לא הגיע? בודקים בספאם, ואז ב־Resend, בדף **Emails**, מה קרה איתו.
