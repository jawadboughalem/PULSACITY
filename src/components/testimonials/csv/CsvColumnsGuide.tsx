import { INLINE_LINK_CLASSES } from "@/components/ui/button-styles";
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
  <section aria-labelledby="csv-columns" className="flex flex-col gap-6">
    <h2 id="csv-columns" className="text-body font-bold max-desktop:sr-only">
      Colonnes attendues
    </h2>
    <div className="hidden rounded-card bg-white p-2 desktop:block">
      <table className="w-full border-separate border-spacing-[0] text-left text-body">
        <thead>
          <tr className="text-small">
            <th scope="col" className="h-[48px] w-[30%] rounded-l-field bg-sky px-4 font-bold">Colonne</th>
            <th scope="col" className="h-[48px] w-[20%] bg-sky pr-4 font-bold">Statut</th>
            <th scope="col" className="h-[48px] rounded-r-field bg-sky pr-4 font-bold">Contenu attendu</th>
          </tr>
        </thead>
        <tbody>
          {CSV_COLUMNS.map((column) => (
            <tr key={column}>
              <th scope="row" className="py-4 px-4 font-bold">{column}</th>
              <td className={COLUMNS[column].isRequired ? "py-4 pr-4" : "py-4 pr-4 text-gray"}>{statusOf(column)}</td>
              <td className="py-4 pr-4">{COLUMNS[column].content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ul className="flex flex-col gap-3 desktop:hidden">
      {CSV_COLUMNS.map((column) => (
        <li key={column} className="flex flex-col gap-1 rounded-card bg-white p-4 text-body">
          <span>
            <span className="font-bold">{column}</span>
            <span className="text-gray">{` · ${statusOf(column)}`}</span>
          </span>
          <span>{COLUMNS[column].content}</span>
        </li>
      ))}
    </ul>
    <p className="text-small text-gray">
      La première ligne du fichier doit contenir les noms des colonnes.{" "}
      <a href={templateHref} download="modele-temoignages.csv" className={INLINE_LINK_CLASSES}>
        Télécharger un fichier modèle
      </a>
    </p>
  </section>
);
