import { UNIVERSAL_FIELDS } from "@/lib/connectors/universal/fields";

/** Step 2 of the universal connector: the fields a tool sends for each sale, the e-mail first and alone required. */
export const UniversalFieldList = () => (
  <dl className="flex max-w-[720px] flex-col border-t border-ink-900">
    {UNIVERSAL_FIELDS.map((field) => (
      <div key={field.name} className="flex flex-col gap-1 border-b border-hairline-200 py-4">
        <dt className="flex items-baseline gap-3">
          <span className="text-body font-semibold">{field.name}</span>
          {field.isRequired ? <span className="text-small text-slate-600">obligatoire</span> : null}
        </dt>
        <dd className="flex flex-col gap-1">
          <span className="text-body">{field.description}</span>
          <span className="text-small text-slate-600">{`Exemple : ${field.example}`}</span>
        </dd>
      </div>
    ))}
  </dl>
);
