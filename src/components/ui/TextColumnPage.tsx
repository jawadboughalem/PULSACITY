import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";

type TextColumnPageProps = {
  children: ReactNode;
};

export const TextColumnPage = ({ children }: TextColumnPageProps) => (
  <>
    <SiteHeader />
    <main className="px-page-gutter py-10">
      <div className="mx-auto flex w-full max-w-text flex-col gap-8">{children}</div>
    </main>
  </>
);
