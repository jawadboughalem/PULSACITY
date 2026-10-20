import { UNIVERSAL_FIELDS } from "@/lib/connectors/universal/fields";

/**
 * Step 2 of the universal connector in the space: the fields a tool sends for each sale, the e-mail alone required.
 * Maquettes 3.3: on a computer, a table on Nuage (field, what it holds, required); on a phone, a card per field.
 */
export const UniversalFieldTable = () => (
  <div className="rounded-card bg-cloud p-3 desktop:p-4">
    <table className="hidden w-full border-separate border-spacing-[0] text-left desktop:table">
      <thead>
        <tr className="text-small">
          <th scope="col" className="h-[48px] w-[150px] rounded-l-field bg-sky px-4 font-bold">
            Nom du champ
          </th>
          <th scope="col" className="h-[48px] bg-sky pr-4 font-bold">
            Ce qu&apos;il contient
          </th>
          <th scope="col" className="h-[48px] w-[120px] rounded-r-field bg-sky pr-4 font-bold">
            Obligatoire
          </th>
        </tr>
      </thead>
      <tbody>
        {UNIVERSAL_FIELDS.map((field) => (
          <tr key={field.name} className="align-top">
            <th scope="row" className="px-4 py-3 text-small font-bold">
              {field.name}
            </th>
            <td className="py-3 pr-4 text-small">
              <span className="flex flex-col">
                <span>{field.description}</span>
                <span className="text-gray">{`Exemple : ${field.example}`}</span>
              </span>
            </td>
            <td className="py-3 pr-4 text-small">{field.isRequired ? "Oui" : "Non"}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <dl className="flex flex-col gap-2 desktop:hidden">
      {UNIVERSAL_FIELDS.map((field) => (
        <div key={field.name} className="flex flex-col gap-1 rounded-field bg-white px-3 py-2 text-small">
          <dt className="flex items-baseline gap-2">
            <span className="font-bold">{field.name}</span>
            {field.isRequired ? <span className="text-gray">obligatoire</span> : null}
          </dt>
          <dd className="flex flex-col">
            <span>{field.description}</span>
            <span className="text-gray">{`Exemple : ${field.example}`}</span>
          </dd>
        </div>
      ))}
    </dl>
  </div>
);
