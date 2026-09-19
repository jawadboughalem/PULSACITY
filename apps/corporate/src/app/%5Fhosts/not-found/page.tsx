import { notFound } from 'next/navigation';

/** Internal target for the middleware's sober 404. */
export default function NotFoundProxy(): never {
  notFound();
}
