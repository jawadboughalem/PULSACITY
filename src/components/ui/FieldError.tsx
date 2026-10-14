import { Icon } from "./Icon";

type FieldErrorProps = {
  id: string;
  message: string;
};

/** Charte v2: 15/22 Erreur, its « alerte » icon 20 at 6 px. */
export const FieldError = ({ id, message }: FieldErrorProps) => (
  <p id={id} className="flex items-start gap-[6px] text-small text-error">
    <Icon name="alert" size={20} className="mt-[1px]" />
    <span>{message}</span>
  </p>
);
