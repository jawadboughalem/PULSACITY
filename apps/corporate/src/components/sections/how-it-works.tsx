const STEPS = [
  'Nous fabriquons votre site à partir de votre fiche Google',
  'Vous le regardez sur votre téléphone, avant de payer',
  'Vous réglez 500 € HT par lien de paiement sécurisé',
  'Nous réservons votre nom de domaine, 10 minutes au téléphone pour vos corrections, mise en ligne sous 72 h',
];

export function HowItWorks() {
  return (
    <section id="methode" className="border-t border-neutral-200">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Comment ça marche
        </h2>

        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step} className="rounded-xl border border-neutral-200 p-5">
              <span className="bg-accent-soft text-accent flex size-8 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </span>
              <p className="mt-3 text-neutral-700">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
