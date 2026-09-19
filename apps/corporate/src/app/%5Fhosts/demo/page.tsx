import type { Metadata } from 'next';

import { DemoUnavailable } from '@/components/demo-unavailable';

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

/** The demo host without a usable slug. */
export default function DemoIndexPage() {
  return <DemoUnavailable />;
}
