const INCLUDED = [
  'Un site vitrine de 5 pages : accueil, prestations, devis et tarifs, avis, contact et accès.',
  'Un site mobile-first et rapide.',
  'Le contenu rédigé à partir de votre fiche Google et d’un court appel.',
  'Un formulaire de devis et la prise de rendez-vous en ligne.',
  'Un nom de domaine en .fr déposé à votre nom.',
  'L’hébergement, le certificat SSL et les sauvegardes, inclus la première année.',
  'Votre fiche Google optimisée.',
  'Des mentions légales conformes.',
  'La mise en ligne sous 72 h après paiement.',
  'Une série de corrections à la livraison.',
];

const NOT_INCLUDED = [
  'la vente en ligne (e-commerce)',
  'la création d’un logo',
  'la rédaction au-delà des 5 pages',
  'les photos professionnelles',
  'la publicité',
];

function Check() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="stroke-accent mt-0.5 size-5 shrink-0 fill-none stroke-[1.75]"
    >
      <path d="m4 10.5 4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Included() {
  return (
    <section id="inclus" className="border-t border-neutral-200 bg-neutral-50/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Ce qui est inclus
        </h2>

        <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <li key={item} className="flex gap-3 text-neutral-700">
              <Check />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-xl border border-neutral-200 bg-white p-6">
          <h3 className="text-base font-semibold text-neutral-900">Non inclus</h3>
          <p className="mt-2 text-neutral-600">Ne sont pas compris : {NOT_INCLUDED.join(', ')}.</p>
        </div>
      </div>
    </section>
  );
}
