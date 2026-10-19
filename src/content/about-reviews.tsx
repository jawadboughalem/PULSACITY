import Link from "next/link";
import type { ReactNode } from "react";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { INLINE_LINK_CLASSES } from "@/components/ui/button-styles";
import { BETA_TESTER_MENTION } from "@/config/pulsacity-space";
import { HIDDEN_REASONS, HIDDEN_REASON_PUBLIC_LABELS } from "@/lib/testimonials/hidden-reasons";

/** The mention a counterpart adds under the widgets: the same words as w.js. */
export const INCENTIVE_MENTION = "Certains clients ont reçu une contrepartie pour leur avis.";

export type AboutReviewsSection = { id: string; title: string; content: ReactNode };

/** A mention as the widgets write it, quoted on Nuage (maquette 3.5). */
const Mention = ({ children }: { children: string }) => (
  <p className="max-w-text rounded-field bg-cloud px-6 py-4 text-body font-bold">{`« ${children} »`}</p>
);

const Paragraph = ({ children }: { children: ReactNode }) => <p className="max-w-text text-body">{children}</p>;

const List = ({ items }: { items: string[] }) => (
  <ul className="flex max-w-text list-disc flex-col gap-2 pl-6 text-body">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

/**
 * « À propos de ces avis » (maquette 3.5; positionnement.md, point 3): each paragraph says a rule decided in points 1
 * to 7, the reasons of « Masquer » in the reader's words. Never « avis vérifiés »: only a sale received ties a review to
 * a purchase, and the page promises no check. To be read by a lawyer with the CGV (point 8, 6.7).
 */
export const ABOUT_REVIEWS_SECTIONS: AboutReviewsSection[] = [
  {
    id: "d-ou-viennent-les-avis",
    title: "D'où viennent les avis",
    content: (
      <>
        <Paragraph>
          Quand un créateur relie l&apos;outil où il encaisse, chaque vente reçue déclenche une demande d&apos;avis. Elle
          part par e-⁠mail à l&apos;adresse reçue avec la vente, avec un lien unique. Seule la personne qui reçoit cet
          e-⁠mail peut répondre par ce lien.
        </Paragraph>
        <Paragraph>Un avis peut aussi arriver autrement :</Paragraph>
        <List
          items={[
            "une demande envoyée par le créateur à un client qu'il a saisi lui-même ;",
            "un avis ajouté à la main par le créateur, ou importé d'un fichier ;",
            "un avis laissé depuis le lien de collecte public du créateur.",
          ]}
        />
        <Paragraph>
          Pour ces avis, aucune vente n&apos;est reçue de l&apos;outil du créateur. Pour une demande envoyée à la main,
          l&apos;achat et sa date sont ceux indiqués par le créateur. La provenance de chaque avis est gardée.
        </Paragraph>
      </>
    ),
  },
  {
    id: "les-dates",
    title: "Les dates",
    content: (
      <Paragraph>
        Chaque témoignage affiche la date de l&apos;avis. Quand l&apos;avis suit un achat, il affiche aussi le mois de
        l&apos;achat : celui reçu de l&apos;outil du créateur, ou celui qu&apos;il a indiqué pour une demande envoyée à la
        main.
      </Paragraph>
    ),
  },
  {
    id: "contrepartie",
    title: "Contrepartie",
    content: (
      <>
        <Paragraph>
          Un créateur peut offrir une contrepartie à ses clients pour leur avis. Il doit alors le déclarer dans son espace,
          et cette mention s&apos;affiche sous ses widgets :
        </Paragraph>
        <Mention>{INCENTIVE_MENTION}</Mention>
        <Paragraph>Les avis laissés sur PULSACITY par ses bêta-testeurs portent la mention :</Paragraph>
        <Mention>{BETA_TESTER_MENTION}</Mention>
      </>
    ),
  },
  {
    id: "modification",
    title: "Modification",
    content: (
      <>
        <Paragraph>
          Le texte d&apos;un avis n&apos;est jamais modifié sans l&apos;accord de son auteur. Si le créateur propose une
          correction, l&apos;auteur la reçoit par e-⁠mail et l&apos;accepte ou la refuse.
        </Paragraph>
        <Paragraph>
          Sans cet accord, le créateur peut seulement masquer un nom ou une coordonnée. Le texte d&apos;origine est
          toujours gardé.
        </Paragraph>
      </>
    ),
  },
  {
    id: "ordre-d-affichage",
    title: "Ordre d'affichage",
    content: (
      <>
        <Paragraph>
          Un mur ou un carrousel montre une sélection : le créateur choisit les avis qu&apos;il affiche. Les avis mis en
          avant passent en premier, puis les plus récents.
        </Paragraph>
        <Paragraph>
          La note du badge compte tous les avis reçus, y compris ceux qui ne sont pas affichés, sauf ceux refusés pour
          l&apos;un des motifs ci-dessous.
        </Paragraph>
      </>
    ),
  },
  {
    id: "motifs-de-refus",
    title: "Motifs de refus",
    content: (
      <>
        <Paragraph>
          Un créateur peut refuser d&apos;afficher un avis. Il choisit alors un motif, et l&apos;auteur le reçoit par
          e-⁠mail :
        </Paragraph>
        <List items={HIDDEN_REASONS.map((reason) => HIDDEN_REASON_PUBLIC_LABELS[reason])} />
        <Paragraph>Un avis refusé n&apos;est pas supprimé. Le créateur peut l&apos;afficher à nouveau.</Paragraph>
      </>
    ),
  },
  {
    id: "une-question-sur-un-avis",
    title: "Une question sur un avis",
    content: (
      <Paragraph>
        Pour une question sur un avis précis, adressez-vous au créateur qui l&apos;affiche. Pour nous signaler un avis,{" "}
        <Link href={MARKETING_PATHS.contact} className={INLINE_LINK_CLASSES}>
          écrivez à l&apos;équipe PULSACITY
        </Link>
        .
      </Paragraph>
    ),
  },
];
