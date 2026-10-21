import type { ReactNode } from "react";
import { Body, Column, Container, Head, Html, Link, Preview, Row, Section, Text } from "react-email";
import { guidePath } from "@/components/marketing/marketing-paths";
import {
  ASK_FOR_REVIEW_HREF,
  CONNECTORS_SECTION_HREF,
  OFFERS_SECTION_HREF,
  WIDGETS_SECTION_HREF,
} from "@/components/space/space-sections";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import type { WelcomeEmailStep } from "@/lib/welcome-emails/welcome-email-steps";
import { CreatorEmailButton, CreatorEmailHeader, PulsacitySender } from "./AccountEmailLayout";
import {
  CREATOR_EMAIL_MOBILE_STYLES,
  creatorCardStyle,
  creatorLegalLineStyle,
  creatorLegalStyle,
  creatorLinkStyle,
  creatorPageStyle,
  creatorParagraphStyle,
  creatorSmallStyle,
  doneStepTextStyle,
  stepDoneStyle,
  stepMarkCellStyle,
  stepNumberStyle,
  stepTextCellStyle,
  stepsBoxStyle,
} from "./creator-email-styles";

/** What the space has done of its start, read when the e-mail leaves: the list of steps follows it. */
export type WelcomeProgress = {
  offer: boolean;
  tool: boolean;
  widget: boolean;
  /** A first request for a review (J7's step). */
  request: boolean;
};

/** The guide J3 points to (maquette 3.6): pasting the widget on a page of Systeme.io. */
const WIDGET_GUIDE_SLUG = "ajouter-des-temoignages-sur-une-page-systeme-io";

type WelcomeContent = {
  subject: (spaceName: string) => string;
  preview: string;
  intro: (progress: WelcomeProgress) => string;
  after: string[];
  button: { label: string; path: string };
  extra?: (appUrl: string) => ReactNode;
};

/** The texts proposed by Design (3.6): no decision gives them word for word. No installation time anywhere. */
const CONTENTS: Record<WelcomeEmailStep, WelcomeContent> = {
  j0: {
    subject: (spaceName) => `Votre espace ${spaceName} est prêt`,
    preview: "Première étape : votre offre, pour que chaque vente demande un avis.",
    intro: () => "Bienvenue dans PULSACITY. Trois étapes, et les demandes d'avis partent seules après chaque vente :",
    after: ["Commencez par votre offre : c'est elle qui décide quand part la demande, après l'achat ou après la séance."],
    button: { label: "Créer mon offre", path: OFFERS_SECTION_HREF },
  },
  j1: {
    subject: () => "Reliez l'outil où vous encaissez",
    preview: "Chaque vente déclenchera une demande d'avis, à votre nom.",
    intro: (progress) =>
      progress.offer
        ? "Votre offre est prête. Prochaine étape : l'outil où vous encaissez."
        : "Prochaine étape : l'outil où vous encaissez.",
    after: [
      "Vous collez une adresse dans votre outil, une fois. Ensuite, chaque vente arrive toute seule.",
      "Fonctionne avec Systeme.io et, grâce au connecteur universel, avec Zapier, Make ou n8n.",
    ],
    button: { label: "Connecter mon outil", path: CONNECTORS_SECTION_HREF },
    extra: (appUrl) => (
      <Text style={creatorSmallStyle}>
        Pas encore d&apos;outil ?{" "}
        <Link href={`${appUrl}${SPACE_HOME_PATH}`} style={creatorLinkStyle}>
          Envoyez votre lien de collecte
        </Link>{" "}
        à vos clients.
      </Text>
    ),
  },
  j3: {
    subject: () => "Vos avis sur votre page de vente",
    preview: "Un code à coller une fois : les nouveaux avis s'ajoutent seuls.",
    intro: (progress) =>
      progress.tool
        ? "Vos ventes arrivent. Dernière étape : montrer vos avis là où se décide l'achat."
        : "Troisième étape : montrer vos avis là où se décide l'achat.",
    after: [
      "Le widget affiche vos témoignages validés sur votre page de vente, à vos couleurs. Vous collez son code une seule fois.",
    ],
    button: { label: "Choisir mon widget", path: WIDGETS_SECTION_HREF },
    extra: (appUrl) => (
      <Text style={creatorSmallStyle}>
        Le guide pas à pas :{" "}
        <Link href={`${appUrl}${guidePath(WIDGET_GUIDE_SLUG)}`} style={creatorLinkStyle}>
          Coller le widget dans Systeme.io
        </Link>
      </Text>
    ),
  },
  j7: {
    subject: () => "Votre première demande d'avis",
    preview: "Demandez un avis à un client récent, sans attendre la prochaine vente.",
    intro: () =>
      "En attendant votre prochaine vente, demandez un avis à un client récent : son nom et son adresse e-⁠mail suffisent.",
    after: ["Son avis arrivera dans votre espace, prêt à valider."],
    button: { label: "Demander un avis", path: ASK_FOR_REVIEW_HREF },
    extra: () => (
      <Text style={creatorSmallStyle}>C&apos;est le dernier e-⁠mail d&apos;accueil. Une question ? Répondez à cet e-⁠mail.</Text>
    ),
  },
};

export const describeWelcomeSubject = (step: WelcomeEmailStep, spaceName: string): string =>
  CONTENTS[step].subject(spaceName);

const STEPS = [
  { key: "offer", label: "Créer votre offre" },
  { key: "tool", label: "Connecter l'outil où vous encaissez" },
  { key: "widget", label: "Coller le widget sur votre page de vente" },
] as const;

const StepsList = ({ progress }: { progress: WelcomeProgress }) => (
  <Section style={stepsBoxStyle}>
    {STEPS.map((step, index) => {
      const isDone = progress[step.key];
      return (
        <Row key={step.key}>
          <Column style={stepMarkCellStyle}>
            {isDone ? (
              <div style={stepDoneStyle} aria-hidden="true">
                ✓
              </div>
            ) : (
              <div style={stepNumberStyle} aria-hidden="true">
                {index + 1}
              </div>
            )}
          </Column>
          <Column style={{ ...stepTextCellStyle, ...(isDone ? doneStepTextStyle : {}) }}>
            {isDone ? `${step.label} : fait` : step.label}
          </Column>
        </Row>
      );
    })}
  </Section>
);

type WelcomeEmailProps = {
  step: WelcomeEmailStep;
  spaceCreatedAt: Date;
  progress: WelcomeProgress;
  appUrl: string;
  unsubscribeUrl: string;
};

/**
 * Maquettes 3.6, « E-mails d'accueil J0, J1, J3, J7 »: one step per e-mail, a single Soleil button, the list of the
 * three steps following the space's progress. Each stops once its step is done (lib/welcome-emails).
 */
export const WelcomeEmail = ({ step, spaceCreatedAt, progress, appUrl, unsubscribeUrl }: WelcomeEmailProps) => {
  const content = CONTENTS[step];
  const buttonUrl = `${appUrl}${content.button.path}`;
  return (
    <Html lang="fr">
      <Head>
        <style>{CREATOR_EMAIL_MOBILE_STYLES}</style>
      </Head>
      <Preview>{content.preview}</Preview>
      <Body lang="fr" style={creatorPageStyle}>
        <Container className="creator-email-card" style={creatorCardStyle}>
          <CreatorEmailHeader appUrl={appUrl} />
          <Text style={creatorParagraphStyle}>Bonjour,</Text>
          <Text style={creatorParagraphStyle}>{content.intro(progress)}</Text>
          <StepsList progress={progress} />
          {content.after.map((paragraph) => (
            <Text key={paragraph} style={creatorParagraphStyle}>
              {paragraph}
            </Text>
          ))}
          <CreatorEmailButton href={buttonUrl} label={content.button.label} />
          {content.extra?.(appUrl)}
        </Container>
        <Container className="creator-email-legal" style={creatorLegalStyle}>
          <Text style={creatorLegalLineStyle}>
            {`Vous recevez cet e-⁠mail parce que vous avez créé votre espace PULSACITY le ${formatDayMonthYear(spaceCreatedAt)}. Ces e-⁠mails s'arrêtent dès que l'étape est faite.`}
          </Text>
          <Text style={creatorLegalLineStyle}>
            <Link href={unsubscribeUrl} style={creatorLinkStyle}>
              Ne plus recevoir les e-⁠mails d&apos;accueil
            </Link>
          </Text>
          <PulsacitySender isLast={false} />
        </Container>
      </Body>
    </Html>
  );
};
