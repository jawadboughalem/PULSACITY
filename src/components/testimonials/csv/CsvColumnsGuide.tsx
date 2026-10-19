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
  <section aria-labelledby="csv-columns" className="flex flex-col gap-4 desktop:gap-6">
    {/* Maquettes 3.4: on a computer, the title and the table on one white card; on a phone, a card per column. */}
    <div className="flex flex-col gap-4 desktop:rounded-panel desktop:bg-white desktop:p-6">
      <h2 id="csv-columns" className="font-display text-h3">
        Colonnes attendues
      </h2>
      <table className="hidden w-full border-separate border-spacing-[0] text-left text-body desktop:table">
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
      <ul className="flex flex-col gap-3 desktop:hidden">
        {CSV_COLUMNS.map((column) => (
          <li key={column} className="flex flex-col rounded-card bg-white px-3 py-2 text-small">
            <span>
              <span className="font-bold">{column}</span>
              <span className="text-gray">{` · ${statusOf(column)}`}</span>
            </span>
            <span>{COLUMNS[column].content}</span>
          </li>
        ))}
      </ul>
    </div>
    <p className="text-small text-gray">
      La première ligne du fichier doit contenir les noms des colonnes.{" "}
      <a href={templateHref} download="modele-temoignages.csv" className={INLINE_LINK_CLASSES}>
        Télécharger un fichier modèle
      </a>
    </p>
  </section>
);
