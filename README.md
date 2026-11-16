> **לפני מכירה:** עוברים על `docs/launch-checklist.md`. להגדרת מייל הכניסה ראו `docs/email-setup.md`.

# פיזיקה 3: סביבת למידה

אפליקציית Next.js 15 עם Supabase (משתמשים, התקדמות, הרשאות) ו־Morning (תשלום). התוכן נשמר בקובץ JSON בצד השרת, והנוסחאות מרונדרות מראש עם KaTeX.

- `/` דף נחיתה
- `/login` כניסה עם קישור קסם במייל
- `/course/[tab]` הקורס: מפה, קונספטים, משפטים, כלים, תרגילים (תרגולים / שיעורי בית / מבחנים), מה לזכור בתכלס
- `/api/checkout` יוצר רכישה ודף תשלום ב־Morning
- `/api/morning/notify` מקבל אישור תשלום מ־Morning ופותח גישה
- `/thanks` עמוד אחרי תשלום

תוכן חינמי: כרטיסים משיעורים 1–4, תרגול 2, שיעורי בית 1–2 וחלק מדף הנוסחאות. תוכן נעול לא נשלח לדפדפן של מי שלא שילם.

## הקמה (פעם אחת)

### 1. Supabase
1. בפרויקט: **SQL Editor** ← מדביקים את כל `supabase/migrations/0001_init.sql` ← **Run**.
2. **Authentication ← URL Configuration**:
   - Site URL: הכתובת של האתר ב־Vercel (למשל `https://lcourse.vercel.app`)
   - Redirect URLs: מוסיפים `https://lcourse.vercel.app/auth/callback` (ואם עובדים מקומית גם `http://localhost:3000/auth/callback`)
3. **Project Settings ← API Keys**: מעתיקים את ה־Publishable key ואת ה־Secret key לשלב 3.

### 2. Morning
1. app.greeninvoice.co.il ← המשתמש שלי ← כלי מפתחים ← **API Keys**: יוצרים מפתח (ID + Secret).
2. צריך מסלול Best ומעלה לגישת API, וחברת סליקה מחוברת **עם אישור לתשלומים באתר (e‑commerce)**. בלי האישור הזה Morning מחזירה שגיאה 2600.
3. עוסק פטור: לקבוע `MORNING_DOC_TYPE=400` (קבלה) במקום 320 (חשבונית מס/קבלה).
4. אם יש יותר מספק סליקה אחד, אפשר לקבוע `MORNING_PLUGIN_ID`. מוצאים אותו ב־`GET /documents/info?type=320` ← `paymentPlugins[0].id`.

### 3. Vercel
1. **Add New ← Project** ← בוחרים את המאגר `lcourse` ← Framework: Next.js.
2. **Environment Variables**: כל המשתנים מ־`.env.example`, עם הערכים האמיתיים. את `MORNING_WEBHOOK_SECRET` ממציאים (מחרוזת ארוכה ואקראית).
3. **Deploy**. אחרי הפריסה מעדכנים את `NEXT_PUBLIC_SITE_URL` לכתובת הסופית ופורסים מחדש.

### 4. בדיקה
1. נכנסים לאתר, נרשמים עם מייל, ופותחים קונספט חינמי.
2. בודקים תשלום ב־sandbox: `MORNING_ENV=sandbox` עם מפתחות sandbox.
3. אחרי תשלום, `/thanks` מתרענן לבד עד שהגישה נפתחת. אם זה לא קורה, בודקים ב־Supabase את הטבלה `purchases` (העמודה `raw_notify`) וב־Vercel את הלוגים של `/api/morning/notify`.

## עדכון תוכן
התוכן נבנה מחוץ למאגר (סקריפט Python) ונשמר ב־`content/content.json`. אחרי החלפת הקובץ מריצים:
```
npm run content
```
שיוצר את `content/rendered.json` (נוסחאות KaTeX). מעלים את שני הקבצים.

## פיתוח מקומי
```
cp .env.example .env.local   # וממלאים
npm install
npm run dev
```
