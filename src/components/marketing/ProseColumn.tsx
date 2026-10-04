import type { ReactNode } from "react";

/** The column of a long text: one block every 16 px; the titles of mdx-components take more room above them. */
export const ProseColumn = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-4">{children}</div>
);
