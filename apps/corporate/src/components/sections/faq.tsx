/** Answers are drawn from the offer itself — no figure that is not in the contract. */
export const FAQ = [
  {
    question: 'Mes clients me trouvent déjà sur Google, à quoi sert un site ?',
    answer:
      'Votre fiche Google affiche vos horaires, votre adresse et vos avis. Un site présente le détail de vos prestations et de vos tarifs, et permet de vous envoyer une demande de devis ou de prendre rendez-vous en ligne. Les deux fonctionnent ensemble : nous optimisons aussi votre fiche Google.',
  },
  {
    question: 'Que se passe-t-il après le paiement ?',
    answer:
      'Nous réservons votre nom de domaine en .fr à votre nom, puis nous vous appelons une dizaine de minutes pour relever vos corrections. Le site est mis en ligne sous 72 h. Votre facture vous est envoyée par Stripe.',
  },
  {
    question: 'À qui appartiennent le site et le nom de domaine ?',
    answer:
      'À vous. Le nom de domaine est déposé à votre nom : vous en êtes le titulaire. Le site et son contenu vous appartiennent dès le paiement intégral.',
  },
  {
    question: 'Et après la première année ?',
    answer:
      'La première année, le nom de domaine, l’hébergement, le certificat SSL et les sauvegardes sont compris dans les 500 € HT. À partir de la deuxième année, le renouvellement est de 99 € HT par an. Vous pouvez décider de ne pas renouveler : vous conservez votre nom de domaine et nous vous remettons les fichiers de votre site.',
  },
  {
    question: 'Comment modifier un texte, un horaire, une photo ?',
    answer:
      'Les corrections faites à la livraison sont comprises dans le prix. Passé cette série de corrections, chaque modification est facturée 49 € HT.',
  },
  {
    question: 'Je n’ai pas de photos.',
    answer:
      'Nous utilisons les photos de votre fiche Google. Les photographies professionnelles ne sont pas comprises dans le prix.',
  },
  {
    question: 'Puis-je récupérer mon site pour le mettre ailleurs ?',
    answer:
      'Oui. Vous transférez votre nom de domaine, dont vous êtes titulaire, et nous vous remettons les fichiers de votre site, sans frais.',
  },
  {
    question: 'Faites-vous des remises ?',
    answer: 'Non. Un seul prix : 500 € HT tout compris. Pas d’option, pas de code promotionnel.',
  },
] as const;

export function Faq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };

  return (
    <section id="faq" className="border-t border-neutral-200">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Questions fréquentes
        </h2>

        <ul className="mt-8 space-y-3">
          {FAQ.map((entry) => (
            <li key={entry.question}>
              <details className="group rounded-xl border border-neutral-200 px-5 py-4">
                <summary className="cursor-pointer list-none font-medium text-neutral-900 marker:content-none">
                  <span className="flex items-start justify-between gap-4">
                    {entry.question}
                    <span
                      aria-hidden="true"
                      className="mt-1 text-neutral-400 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-neutral-600">{entry.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>

      <script
        type="application/ld+json"
        // Built from the list above, so the markup can never drift from the page.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
