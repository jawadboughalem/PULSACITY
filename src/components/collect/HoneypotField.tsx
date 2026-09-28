import { HONEYPOT_FIELD_NAME } from "@/lib/testimonials/testimonial-form-schema";

type HoneypotFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const HoneypotField = ({ value, onChange }: HoneypotFieldProps) => (
  <div aria-hidden="true" className="sr-only">
    <label>
      Laissez ce champ vide
      <input
        type="text"
        name={HONEYPOT_FIELD_NAME}
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  </div>
);
