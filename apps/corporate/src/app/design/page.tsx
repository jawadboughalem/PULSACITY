import type { Metadata } from 'next';

import { Logo, Wordmark } from '@/components/wordmark';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Container } from '@/components/ui/container';
import { Disclosure } from '@/components/ui/disclosure';
import { Divider } from '@/components/ui/divider';
import { Dot } from '@/components/ui/dot';
import { DotList } from '@/components/ui/dot-list';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Field } from '@/components/ui/field';
import { FormMessage } from '@/components/ui/form-message';
import { Input } from '@/components/ui/input';
import { Radio } from '@/components/ui/radio';
import { SectionTitle } from '@/components/ui/section-title';
import { StepList } from '@/components/ui/step-list';
import { Surface } from '@/components/ui/surface';
import { Textarea } from '@/components/ui/textarea';
import { TextLink } from '@/components/ui/text-link';

/** A styleguide is never indexed, on any host. */
export const metadata: Metadata = {
  title: 'Primitives',
  robots: { index: false, follow: false },
};

const BUTTON_VARIANTS = ['default', 'secondary', 'ghost', 'link'] as const;
const BUTTON_SIZES = ['sm', 'default', 'lg'] as const;

/** Real content, so nothing on this page is invented. */
const STEPS = [
  {
    title: 'Vous me décrivez votre activité et le site que vous voulez',
    text: 'Trois minutes, dans le formulaire.',
  },
  { title: 'Je vous appelle sous 24 h', text: 'On cale les pages, le ton, les photos.' },
  {
    title: 'Je construis votre site et vous l’envoie par SMS',
    text: 'Vous le regardez sur votre téléphone et me dites ce qui change.',
  },
];

const PAGES = ['Accueil', 'Prestations', 'Tarifs', 'Avis', 'Contact'];

function Row({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 py-6 md:grid-cols-[220px_1fr] md:gap-8">
      <div>
        <p className="text-ink text-body-sm font-semibold">{label}</p>
        {note ? <p className="text-ink-faint text-caption mt-1">{note}</p> : null}
      </div>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-section-tight">
      <SectionTitle>{title}</SectionTitle>
      <div className="divide-line mt-6 flex flex-col divide-y">{children}</div>
    </section>
  );
}

/** Every primitive, rendered twice: on paper, then inside an inverted surface. */
function Gallery() {
  return (
    <>
      <Group title="Actions">
        {BUTTON_VARIANTS.map((variant) => (
          <Row key={variant} label={`Button — ${variant}`} note="sm · default · lg">
            {BUTTON_SIZES.map((size) => (
              <Button key={size} variant={variant} size={size}>
                Demander mon site
              </Button>
            ))}
          </Row>
        ))}
        <Row label="Button — états" note="repos · désactivé · en cours">
          <Button>Envoyer ma demande</Button>
          <Button disabled>Envoyer ma demande</Button>
          <Button loading>Envoyer ma demande</Button>
        </Row>
        <Row label="TextLink" note="interne · externe">
          <TextLink href="/commander">Demander mon site</TextLink>
          <TextLink href="https://example.org" external>
            Voir le site
          </TextLink>
        </Row>
      </Group>

      <Group title="Le motif">
        <Row label="Dot" note="sm 5 px · md 9 px · animé">
          <Dot />
          <Dot size="md" />
          <Dot size="md" animated />
        </Row>
        <Row label="Eyebrow">
          <Eyebrow>En préparation</Eyebrow>
        </Row>
        <Row label="SectionTitle" note="point ajouté · point déjà là · sans point">
          <div className="flex flex-col gap-3">
            <SectionTitle>Comment ça se passe</SectionTitle>
            <SectionTitle>Votre site, fait pour vous.</SectionTitle>
            <SectionTitle withoutStop>Questions fréquentes</SectionTitle>
          </div>
        </Row>
        <Row label="Badge">
          <Badge>En préparation</Badge>
        </Row>
        <Row label="Wordmark" note="seul, avec son point · sans point">
          <Wordmark className="text-body" />
          <Wordmark className="text-body" withDot={false} />
        </Row>
        <Row label="Logo" note="le verrou : fixe · animé (en-tête seul)">
          <Logo />
          <Logo animated />
        </Row>
      </Group>

      <Group title="Surfaces">
        <Row label="Card">
          <Card className="max-w-sm">
            <p className="text-subtitle text-ink font-semibold">Vos mots</p>
            <p className="text-ink-muted text-body-sm mt-1">
              Je rédige vos textes à partir de votre activité et de vos avis clients ; vous les
              validez.
            </p>
          </Card>
        </Row>
        <Row label="Divider" note="entre deux bandes de même surface">
          <div className="w-full max-w-sm">
            <Divider />
          </div>
        </Row>
        <Row label="Surface — sunken" note="un seul encart par page">
          <Surface as="div" tone="sunken" className="rounded-lg p-6">
            <p className="font-display text-figure text-ink">500 € HT</p>
          </Surface>
        </Row>
      </Group>

      <Group title="Listes">
        <Row label="DotList">
          <DotList items={PAGES} />
        </Row>
        <Row label="StepList" note="le fil, sans numéro">
          <StepList steps={STEPS} className="max-w-xl" />
        </Row>
        <Row label="Disclosure">
          <div className="divide-line border-line w-full max-w-xl divide-y border-y">
            <Disclosure summary="Dois-je payer avant de voir mon site ?">
              Non : vous le voyez sur votre téléphone avant de régler. Vous ne payez qu’une fois le
              site validé.
            </Disclosure>
            <Disclosure summary="Faites-vous des remises ?">
              Non : un seul prix pour tout le monde, c’est ce qui me permet de le tenir.
            </Disclosure>
          </div>
        </Row>
      </Group>

      <Group title="Formulaire">
        <Row label="Field" note="repos · aide · erreur">
          <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-3">
            <Field label="Ville">
              <Input name="city" defaultValue="" />
            </Field>
            <Field label="E-mail" hint="(facultatif)">
              <Input name="email" type="email" placeholder="vous@exemple.fr" />
            </Field>
            <Field label="Téléphone" error="Numéro de téléphone invalide.">
              <Input name="phone" type="tel" defaultValue="06 12" />
            </Field>
          </div>
        </Row>
        <Row label="Input — désactivé">
          <Input className="max-w-xs" defaultValue="Non modifiable" disabled />
        </Row>
        <Row label="Textarea">
          <Field label="Décrivez le site que vous voulez" hint="(facultatif)">
            <Textarea
              className="max-w-xl"
              rows={3}
              placeholder="Ce que vous faites, à qui vous vous adressez."
            />
          </Field>
        </Row>
        <Row label="Checkbox · Radio">
          <div className="flex flex-wrap gap-8">
            <div>
              <Checkbox label="Accueil" defaultChecked />
              <Checkbox label="Prestations" />
              <Checkbox label="Avis" disabled />
            </div>
            <div>
              <Radio name="assets" label="Oui" defaultChecked />
              <Radio name="assets" label="Non" />
            </div>
          </div>
        </Row>
        <Row label="FormMessage">
          <div className="flex flex-col gap-2">
            <FormMessage tone="danger">Numéro de téléphone invalide.</FormMessage>
            <FormMessage tone="success">Votre demande est partie.</FormMessage>
          </div>
        </Row>
      </Group>
    </>
  );
}

export default function DesignPage() {
  return (
    <main>
      <Surface tone="ground" className="py-section">
        <Container>
          <Eyebrow>Primitives</Eyebrow>
          <SectionTitle as="h1" className="text-display mt-4">
            Vingt-trois composants, tous leurs états
          </SectionTitle>
          <p className="text-lead text-ink-muted max-w-measure mt-6">
            Rendus par les composants eux-mêmes, jamais redessinés : cette page ne peut pas
            s’écarter du code. Le survol et le focus ne se photographient pas — ils sont à essayer.
          </p>
          <Gallery />
        </Container>
      </Surface>

      <Surface tone="inverted" className="py-section">
        <Container>
          <Eyebrow>Les mêmes, sur encre</Eyebrow>
          <SectionTitle as="h2" className="mt-4">
            Aucun composant ne sait où il est posé
          </SectionTitle>
          <p className="text-lead text-ink-muted max-w-measure mt-6">
            Rien n’est réécrit ci-dessous : <code className="text-ink">.surface-inverted</code>{' '}
            redéclare les jetons, et les composants sont exactement ceux du haut de page.
          </p>
          <Gallery />
        </Container>
      </Surface>

      <Surface tone="ground" className="py-section-tight">
        <Container>
          <SectionTitle as="h2">Ce qui n’est pas montré</SectionTitle>
          <p className="text-ink-muted text-body max-w-measure mt-4">
            <code className="text-ink">PhoneFrame</code> attend une capture d’un site réellement
            livré. <code className="text-ink">content/showcase.json</code> est vide, donc rien n’est
            dessiné ici : un cadre rempli d’une fausse capture serait précisément ce que la règle 6
            interdit.
          </p>
        </Container>
      </Surface>
    </main>
  );
}
