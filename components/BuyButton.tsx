export default function BuyButton({ label, className = 'btn accent' }: { label?: string; className?: string }) {
  const price = process.env.COURSE_PRICE_ILS ?? '69';
  return (
    <form action="/api/checkout" method="post" style={{ display: 'inline' }}>
      <button type="submit" className={className}>{label ?? `גישה מלאה ב־${price} ₪`}</button>
    </form>
  );
}
