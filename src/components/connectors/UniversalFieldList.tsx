import { UNIVERSAL_FIELDS } from "@/lib/connectors/universal/fields";

/** Step 2 of the universal connector: the fields a tool sends for each sale, the e-mail first and alone required. */
export const UniversalFieldList = () => (
  <dl className="flex max-w-[720px] flex-col gap-5">
    {UNIVERSAL_FIELDS.map((field) => (
      <div key={field.name} className="flex flex-col gap-1">
        <dt className="flex items-baseline gap-3">
          <span className="text-body font-bold">{field.name}</span>
          {field.isRequired ? <span className="text-small text-gray">obligatoire</span> : null}
        </dt>
        <dd className="flex flex-col gap-1">
          <span className="text-body">{field.description}</span>
          <span className="text-small text-gray">{`Exemple : ${field.example}`}</span>
        </dd>
      </div>
    ))}
  </dl>
);
