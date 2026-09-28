import Link from "next/link";
import { Logotype } from "./Logotype";

export const SiteHeader = () => (
  <header className="flex h-[60px] shrink-0 items-center border-b border-hairline-200 px-page-gutter">
    <Link
      href="/"
      className="text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
    >
      <Logotype className="text-logo-22 desktop:text-logo-28" />
    </Link>
  </header>
);
