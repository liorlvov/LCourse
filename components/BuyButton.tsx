import Link from 'next/link';
import { PRICE_ILS } from '@/lib/legal';

/** Goes to the checkout page, where the deal is laid out and the terms are accepted before paying. */
export default function BuyButton({ label, className = 'btn accent' }: { label?: string; className?: string }) {
  return <Link className={className} href="/checkout">{label ?? `גישה מלאה ב־${PRICE_ILS} ₪`}</Link>;
}
