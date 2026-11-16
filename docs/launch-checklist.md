# לפני שפותחים למכירה

## חוסם: בלי זה אף אחד לא נכנס או לא משלם
- [ ] **מייל כניסה:** Resend ו־SMTP ב־Supabase לפי `docs/email-setup.md`. בלי זה סטודנטים לא מקבלים קישור כניסה.
- [ ] **Supabase URL Configuration:** Site URL וכתובת Redirect ל־`/auth/callback`.
- [ ] **Vercel:** `NEXT_PUBLIC_SITE_URL` = כתובת האתר, ואחריו Redeploy.
- [ ] **SQL:** להריץ ב־Supabase את `supabase/migrations/0002_terms.sql`. הוא שומר מתי ובאיזו גרסה כל קונה אישר את התנאים.
- [ ] **Morning:** מפתחות API (מסלול Best ומעלה), אישור סליקה לאתר, ובמשתני Vercel: `MORNING_DOC_TYPE=400` ו־`MORNING_VAT_TYPE=0` (עוסק פטור).
- [ ] **בדיקת sandbox:** קנייה מלאה עם `MORNING_ENV=sandbox`: הגישה נפתחת, הקבלה מגיעה והסכום 69 ₪. אחר כך עוברים ל־`production`.

## מומלץ לפני פרסום
- [ ] **Morning ← הגדרות מסמכים:** להוסיף לקבלות הערה קבועה: "ניתן לבטל בתוך 14 יום מהרכישה ולקבל החזר מלא. פרטים: <כתובת האתר>/refunds".
- [ ] **תקופת הגישה:** האתר מציג גישה עד 30.4.2027. כדי לשנות, מגדירים ב־Vercel `COURSE_ACCESS_UNTIL=YYYY-MM-DD`.
- [ ] **מייל ליצירת קשר:** כברירת מחדל `business@ellimaa.com`. כדי לשנות, מגדירים `NEXT_PUBLIC_CONTACT_EMAIL`.
- [ ] **דומיין:** לחבר דומיין משלך ב־Vercel (Settings ← Domains). זה נראה רציני יותר מ־vercel.app, וקל יותר לשתף בקבוצות.

## איך מטפלים בבקשת ביטול
1. מחזירים את הכסף ב־Morning, דרך המסמך או הסליקה.
2. ב־Supabase ← Table Editor ← `profiles`: מעבירים את `has_access` של הקונה ל־`false`.
3. ב־`purchases`: מעבירים את `status` ל־`failed` ומוסיפים הערה.
4. עונים לקונה שהכסף בדרך (עד 14 יום).
