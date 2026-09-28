import { Icon } from "./Icon";

type FieldErrorProps = {
  id: string;
  message: string;
};

export const FieldError = ({ id, message }: FieldErrorProps) => (
  <p id={id} className="flex items-start gap-2 text-small text-error">
    <Icon name="alert" size={20} />
    <span>{message}</span>
  </p>
);
