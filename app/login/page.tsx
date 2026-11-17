import Link from 'next/link';
import Brand from '@/components/Brand';
import SiteFooter from '@/components/SiteFooter';
import Wave from '@/components/Wave';
import LoginForm from './LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams;
  return (
    <>
      <div className="topbar"><Brand /></div>
      <main className="auth-wrap">
        <div className="auth">
          <Wave className="auth-wave" />
          <p className="kicker">כניסה · הרשמה</p>
          <h1>כניסה והרשמה</h1>
          <p className="muted">עם חשבון Google בלחיצה אחת, או עם קישור שנשלח למייל. בלי סיסמה. אם עוד אין לך חשבון, הוא נוצר אוטומטית.</p>
          {sp.error ? <p className="banner warn">הקישור לא עבד או שפג תוקפו. אפשר לבקש קישור חדש.</p> : null}
          <LoginForm next={sp.next ?? '/'} />
          <p className="notice">
            המייל משמש ליצירת החשבון, לשליחת קישורי כניסה וקבלות ולהודעות על הקורסים שלך. אין חובה חוקית למסור אותו, אבל בלעדיו אי אפשר להירשם.
            בהרשמה אתה מסכים ל<Link href="/terms">תנאי השימוש</Link> ול<Link href="/privacy">מדיניות הפרטיות</Link>.
          </p>
        </div>
      </main>
      <div className="page-foot"><SiteFooter /></div>
    </>
  );
}
