import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type ActionDoneMessageProps = {
  /** null while nothing has just happened. */
  message: string | null;
  className?: string;
};

/**
 * Maquettes 3.4, « Messages après une action »: on the spot, under what was just copied, saved or sent, in Pousse 700
 * with the check. No floating message in the space. The live zone is always there (out of the layout), so that screen
 * readers announce the message; the visible line takes room only while it is shown.
 */
export const ActionDoneMessage = ({ message, className }: ActionDoneMessageProps) => (
  <>
    <span aria-live="polite" className="sr-only">
      {message ?? ""}
    </span>
    {message ? (
      <p aria-hidden="true" className={cn("flex items-start gap-2 text-small font-bold text-success", className)}>
        <Icon name="valid" size={20} className="mt-[1px]" />
        {message}
      </p>
    ) : null}
  </>
);
