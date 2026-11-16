import Brand from '@/components/Brand';
import LoginForm from './LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams;
  return (
    <>
      <div className="topbar"><Brand /></div>
      <div className="auth">
        <h1>כניסה</h1>
        <p className="muted">נשלח לך קישור למייל. לוחצים עליו ונכנסים, בלי סיסמה. בפעם הראשונה זה גם יוצר לך חשבון.</p>
        {sp.error ? <p className="banner warn">הקישור לא עבד או שפג תוקפו. נסה לבקש קישור חדש.</p> : null}
        <LoginForm next={sp.next ?? '/course/map'} />
      </div>
    </>
  );
}
