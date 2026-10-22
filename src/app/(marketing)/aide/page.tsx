import * as Sentry from "@sentry/nextjs";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { ContactForm } from "@/components/marketing/help/ContactForm";
import { HelpThemes } from "@/components/marketing/help/HelpThemes";
import { HELP_THEMES } from "@/content/help";
import { getSignedInUser } from "@/lib/auth/get-signed-in-user";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { readContactDraft } from "@/lib/support/report-content";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Aide et contact",
    description:
      "Les réponses aux questions les plus fréquentes sur PULSACITY, par thème : démarrer, connecteurs, demandes, widgets, abonnement, données. Et un formulaire pour nous écrire.",
    path: MARKETING_PATHS.help,
  });

/** The address of a signed-in creator, to type it for them. A page of help stays open even when the session cannot be read. */
const readAccountEmail = async (): Promise<string | null> => {
  try {
    return (await getSignedInUser())?.email ?? null;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
};

/**
 * Maquette 8.4, « Aide et contact »: on Nuage, the questions by theme on the left, « Écrivez-nous » on the right; on a
 * phone, the form after the questions. Open to every visitor, with or without a space.
 */
const HelpPage = async ({ searchParams }: PageProps<"/aide">) => {
  const accountEmail = await readAccountEmail();
  const draft = readContactDraft(await searchParams);
  return (
    <div className="bg-cloud px-page-gutter pt-6 pb-11 desktop:pt-11 desktop:pb-14">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-h1">Aide et contact</h1>
          <p className="max-w-text text-lead">
            Les réponses aux questions les plus fréquentes, par thème. Et un formulaire pour nous écrire.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-8 desktop:mt-9 desktop:grid desktop:grid-cols-[minmax(0,800px)_440px] desktop:items-start desktop:justify-between desktop:gap-9">
          <HelpThemes themes={HELP_THEMES} />
          <ContactForm accountEmail={accountEmail} draft={draft} />
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
