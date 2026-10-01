import { CSV_COLUMNS, type CsvColumn } from "@/lib/testimonials/csv/read-testimonial-csv";

const COLUMNS: Record<CsvColumn, { isRequired: boolean; content: string }> = {
  nom: { isRequired: true, content: "Le nom affiché, par exemple Camille R." },
  titre: { isRequired: false, content: "Par exemple Enseignante, Lyon" },
  note: { isRequired: true, content: "Un nombre de 1 à 5" },
  texte: { isRequired: true, content: "Le texte du témoignage" },
  formation: { isRequired: false, content: "Le nom exact d'une de vos offres" },
  date: { isRequired: false, content: "Au format jj/mm/aaaa" },
};

const statusOf = (column: CsvColumn) => (COLUMNS[column].isRequired ? "Obligatoire" : "Facultatif");

type CsvColumnsGuideProps = {
  templateHref: string;
};

export const CsvColumnsGuide = ({ templateHref }: CsvColumnsGuideProps) => (
  <section aria-labelledby="csv-columns" className="flex flex-col gap-5">
    <h2 id="csv-columns" className="text-body font-semibold max-desktop:sr-only">
      Colonnes attendues
    </h2>
    <table className="hidden w-full border-collapse text-left text-body desktop:table">
      <thead>
        <tr className="border-b border-ink-900 text-small">
          <th scope="col" className="w-[30%] pb-3 font-semibold">Colonne</th>
          <th scope="col" className="w-[20%] pb-3 font-semibold">Statut</th>
          <th scope="col" className="pb-3 font-semibold">Contenu attendu</th>
        </tr>
      </thead>
      <tbody>
        {CSV_COLUMNS.map((column) => (
          <tr key={column} className="border-b border-hairline-200">
            <th scope="row" className="py-4 pr-4 font-semibold">{column}</th>
            <td className={COLUMNS[column].isRequired ? "py-4 pr-4" : "py-4 pr-4 text-slate-600"}>{statusOf(column)}</td>
            <td className="py-4">{COLUMNS[column].content}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <ul className="flex flex-col border-t border-ink-900 desktop:hidden">
      {CSV_COLUMNS.map((column) => (
        <li key={column} className="flex flex-col gap-1 border-b border-hairline-200 py-4 text-body">
          <span>
            <span className="font-semibold">{column}</span>
            <span className="text-slate-600">{` · ${statusOf(column)}`}</span>
          </span>
          <span>{COLUMNS[column].content}</span>
        </li>
      ))}
    </ul>
    <p className="text-small text-slate-600">
      La première ligne du fichier doit contenir les noms des colonnes.{" "}
      <a
        href={templateHref}
        download="modele-temoignages.csv"
        className="font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
      >
        Télécharger un fichier modèle
      </a>
    </p>
  </section>
);
