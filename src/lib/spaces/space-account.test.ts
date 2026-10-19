import { eq, is, sql } from "drizzle-orm";
import { PgTable, getTableConfig } from "drizzle-orm/pg-core";
import { assert, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { fillTestSpace } from "@/db/full-space-fixtures";
import * as schema from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { SubscriptionNotStoppedError } from "@/lib/billing/stop-space-subscription";
import { deleteSpace } from "./delete-space";
import { buildSpaceExport, buildSpaceExportFileName } from "./export-space-data";
import { findOwnedSpace } from "./find-owned-space";
import { type SpaceSettings, updateSpaceSettings } from "./update-space-settings";

let database: Database;
let julieId: string;
let julieSpaceId: string;
let marcId: string;
let marcSpaceId: string;

const TABLE_NAMES = Object.values(schema)
  .filter((value) => is(value, PgTable))
  .map((table) => getTableConfig(table).name);

/** Every row of every table, to compare the whole database before and after. */
const dumpDatabase = async () =>
  Object.fromEntries(
    await Promise.all(
      TABLE_NAMES.map(async (name) => {
        const result = await database.execute(sql.raw(`select * from "${name}" order by 1`));
        return [name, (result as unknown as { rows: unknown[] }).rows] as const;
      }),
    ),
  );

const buildCollectionUrl = (spaceSlug: string, productSlug?: string) =>
  `https://pulsacity.com/t/${spaceSlug}${productSlug ? `/${productSlug}` : ""}`;

const SETTINGS: SpaceSettings = {
  name: "Julie Nutrition",
  slug: "julie-nutrition",
  accentColor: "#4F6F52",
  replyToEmail: "julie@exemple.fr",
  senderPostalAddress: "Julie Martin\n12 rue des Lilas\n69003 Lyon",
  newTestimonialEmailEnabled: true,
  offersIncentive: false,
  logo: { action: "keep" },
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  julieId = await insertTestUser(database, "julie@exemple.fr");
  julieSpaceId = await insertTestSpace(database, julieId, "julie-nutrition");
  marcId = await insertTestUser(database, "marc@exemple.fr");
  marcSpaceId = await insertTestSpace(database, marcId, "marc-coaching");
});

describe("updateSpaceSettings", () => {
  it("saves Réglages on the space of the creator, and on no other", async () => {
    const before = await findOwnedSpace(database, marcId);

    const result = await updateSpaceSettings(database, julieId, {
      ...SETTINGS,
      name: "Julie Nutrition Lyon",
      slug: "julie-lyon",
      newTestimonialEmailEnabled: false,
      logo: { action: "set", url: "https://photos.exemple.fr/logos/julie/logo.png" },
    });

    expect(result).toEqual({ status: "updated", slug: "julie-lyon" });
    const space = await findOwnedSpace(database, julieId);
    assert(space);
    expect(space).toMatchObject({
      id: julieSpaceId,
      name: "Julie Nutrition Lyon",
      slug: "julie-lyon",
      accentColor: "#4F6F52",
      replyToEmail: "julie@exemple.fr",
      senderPostalAddress: "Julie Martin\n12 rue des Lilas\n69003 Lyon",
      newTestimonialEmailEnabled: false,
      logoUrl: "https://photos.exemple.fr/logos/julie/logo.png",
    });
    expect(await findOwnedSpace(database, marcId)).toEqual(before);
  });

  it("keeps the logo unless it is replaced or removed", async () => {
    await updateSpaceSettings(database, julieId, { ...SETTINGS, logo: { action: "set", url: "https://photos.exemple.fr/a.png" } });
    await updateSpaceSettings(database, julieId, SETTINGS);
    expect((await findOwnedSpace(database, julieId))?.logoUrl).toBe("https://photos.exemple.fr/a.png");

    await updateSpaceSettings(database, julieId, { ...SETTINGS, logo: { action: "remove" } });
    expect((await findOwnedSpace(database, julieId))?.logoUrl).toBeNull();
  });

  it("refuses an address of the collection page taken by another space, and suggests a free one", async () => {
    const result = await updateSpaceSettings(database, julieId, { ...SETTINGS, name: "Autre nom", slug: "marc-coaching" });

    expect(result).toEqual({ status: "slug-taken", suggestedSlug: "marc-coaching-2" });
    const space = await findOwnedSpace(database, julieId);
    expect(space).toMatchObject({ name: "Espace julie-nutrition", slug: "julie-nutrition" });
  });

  it("keeps the day the counterpart was first declared, until it is unticked", async () => {
    const firstDay = new Date("2026-10-14T09:00:00Z");
    await updateSpaceSettings(database, julieId, { ...SETTINGS, offersIncentive: true }, firstDay);
    await updateSpaceSettings(database, julieId, { ...SETTINGS, offersIncentive: true }, new Date("2026-11-01T09:00:00Z"));
    expect((await findOwnedSpace(database, julieId))?.incentiveDeclaredAt).toEqual(firstDay);

    await updateSpaceSettings(database, julieId, SETTINGS);
    expect((await findOwnedSpace(database, julieId))?.incentiveDeclaredAt).toBeNull();
  });

  it("finds no space for someone who has none", async () => {
    const newcomerId = await insertTestUser(database, "nouvelle@exemple.fr");
    expect(await updateSpaceSettings(database, newcomerId, SETTINGS)).toEqual({ status: "space-not-found" });
  });
});

describe("buildSpaceExport", () => {
  beforeEach(async () => {
    await fillTestSpace(database, julieId, julieSpaceId, "julie");
    await fillTestSpace(database, marcId, marcSpaceId, "marc");
  });

  it("puts every part of the space in the file", async () => {
    const now = new Date("2026-10-14T13:40:00Z");
    const exported = (await buildSpaceExport(database, julieId, { now, buildCollectionUrl }))?.data;
    assert(exported);

    expect(exported.fichier).toMatchObject({ version: 1, prepare_le: "2026-10-14T13:40:00.000Z" });
    expect(exported.compte).toMatchObject({ adresse_de_connexion: "julie@exemple.fr", prenom: null });
    expect(exported.espace).toMatchObject({
      nom: "Espace julie-nutrition",
      page_de_collecte: "https://pulsacity.com/t/julie-nutrition",
      plan: "Gratuit",
      email_nouveau_temoignage: true,
    });
    expect(exported.offres).toEqual([
      expect.objectContaining({
        nom: "Programme julie",
        page_de_collecte: "https://pulsacity.com/t/julie-nutrition/programme-julie",
        delai_de_demande_jours: 14,
      }),
    ]);
    expect(exported.widgets).toEqual([expect.objectContaining({ type: "mur", offre: "Programme julie" })]);
    expect(exported.clients).toEqual([
      expect.objectContaining({ email: "camille-julie@exemple.fr", prenom: "Camille", nom: "Roux" }),
    ]);
    expect(exported.ventes).toEqual([
      expect.objectContaining({
        client: "camille-julie@exemple.fr",
        offre: "Programme julie",
        source: "connecteur",
        outil: "Systeme.io",
        type: "vente",
        reference: "order-item:julie",
        achetee_le: "2026-10-01T10:00:00.000Z",
      }),
    ]);
    expect(exported.demandes).toEqual([
      expect.objectContaining({
        client: "camille-julie@exemple.fr",
        offre: "Programme julie",
        statut: "completee",
        envoyee_le: "2026-10-15T10:05:00.000Z",
        avis_recu_le: "2026-10-16T09:00:00.000Z",
      }),
    ]);
    expect(exported.temoignages).toEqual([
      expect.objectContaining({
        auteur: "Camille R.",
        note: 5,
        texte_original: "J'ai arrêté de grignoter le soir (julie).",
        statut: "valide",
        source: "formulaire",
        offre: "Programme julie",
        client: "camille-julie@exemple.fr",
        consentement: { donne_le: "2026-10-16T09:00:00.000Z", texte: "J'accepte que mon témoignage soit publié." },
      }),
    ]);
  });

  it("keeps where each review came from, why it is hidden, and the corrections proposed to its author", async () => {
    const hiddenAt = new Date("2026-10-17T08:00:00Z");
    await database
      .update(schema.testimonials)
      .set({
        provenance: "sale",
        purchasedAt: new Date("2026-10-01T10:00:00Z"),
        status: "hidden",
        hiddenAt,
        hiddenReason: "other",
        hiddenReasonDetail: "Il parle d'un autre programme.",
        hiddenReasonSentAt: hiddenAt,
      })
      .where(eq(schema.testimonials.spaceId, julieSpaceId));
    const [testimonial] = await database
      .select({ id: schema.testimonials.id, body: schema.testimonials.body })
      .from(schema.testimonials)
      .where(eq(schema.testimonials.spaceId, julieSpaceId));
    await database.insert(schema.testimonialCorrections).values({
      testimonialId: testimonial.id,
      fromBody: testimonial.body,
      body: "J'ai arrêté de grignoter le soir.",
      token: "secret-correction-julie",
      createdAt: new Date("2026-10-16T10:00:00Z"),
      answeredAt: new Date("2026-10-16T12:00:00Z"),
      outcome: "refused",
    });

    const exported = (await buildSpaceExport(database, julieId, { buildCollectionUrl }))?.data;
    assert(exported);

    expect(exported.temoignages[0]).toMatchObject({
      provenance: "vente_recue",
      achat_le: "2026-10-01T10:00:00.000Z",
      statut: "masque",
      masquage: {
        le: "2026-10-17T08:00:00.000Z",
        motif: "Il parle d'un autre programme.",
        motif_envoye_le: "2026-10-17T08:00:00.000Z",
      },
      corrections: [
        {
          proposee_le: "2026-10-16T10:00:00.000Z",
          texte_avant: testimonial.body,
          texte_propose: "J'ai arrêté de grignoter le soir.",
          reponse: "refusee",
          repondu_le: "2026-10-16T12:00:00.000Z",
        },
      ],
    });
    expect(JSON.stringify(exported)).not.toContain("secret-correction-julie");
  });

  it("holds nothing of another space, and none of the secrets", async () => {
    const exported = await buildSpaceExport(database, julieId, { buildCollectionUrl });
    expect(exported?.spaceSlug).toBe("julie-nutrition");
    const file = JSON.stringify(exported?.data);

    expect(file).not.toContain("marc");
    expect(file).not.toContain("secret-token-julie");
    expect(file).not.toContain("secret-key-julie");
    expect(file).not.toContain("secret-request-julie");
  });

  it("finds nothing for someone without a space", async () => {
    const newcomerId = await insertTestUser(database, "nouvelle@exemple.fr");
    expect(await buildSpaceExport(database, newcomerId, { buildCollectionUrl })).toBeNull();
  });

  it("names the file after the space and the day in Paris", () => {
    expect(buildSpaceExportFileName("julie-nutrition", new Date("2026-10-14T22:30:00Z"))).toBe(
      "pulsacity-julie-nutrition-2026-10-15.json",
    );
  });
});

describe("deleteSpace", () => {
  beforeEach(async () => {
    await fillTestSpace(database, marcId, marcSpaceId, "marc");
  });

  it("leaves nothing of the space, and touches nothing of another", async () => {
    const before = await dumpDatabase();
    await fillTestSpace(database, julieId, julieSpaceId, "julie");

    const result = await deleteSpace(database, julieId, "Espace julie-nutrition");

    expect(result).toEqual({ status: "deleted", spaceId: julieSpaceId, userId: julieId });
    const julieUserRow = before.user.find((row) => (row as { id: string }).id === julieId);
    expect(await dumpDatabase()).toEqual({
      ...before,
      user: before.user.filter((row) => row !== julieUserRow),
      spaces: before.spaces.filter((row) => (row as { id: string }).id !== julieSpaceId),
    });
  });

  it("deletes nothing while the name is not typed exactly", async () => {
    await fillTestSpace(database, julieId, julieSpaceId, "julie");
    const before = await dumpDatabase();

    expect(await deleteSpace(database, julieId, "espace julie-nutrition")).toEqual({ status: "name-mismatch" });
    expect(await deleteSpace(database, julieId, "Espace julie")).toEqual({ status: "name-mismatch" });
    expect(await dumpDatabase()).toEqual(before);
  });

  it("stops the subscription first, and deletes nothing if it cannot", async () => {
    await fillTestSpace(database, julieId, julieSpaceId, "julie");
    const before = await dumpDatabase();
    const stopSubscription = vi.fn().mockRejectedValue(new SubscriptionNotStoppedError(julieSpaceId));

    const result = await deleteSpace(database, julieId, "Espace julie-nutrition", { stopSubscription });

    expect(result).toEqual({ status: "subscription-not-stopped" });
    expect(stopSubscription).toHaveBeenCalledWith(expect.objectContaining({ id: julieSpaceId }));
    expect(await dumpDatabase()).toEqual(before);
  });

  it("calls the subscription's stop before deleting", async () => {
    const stopSubscription = vi.fn(async () => {
      expect(await findOwnedSpace(database, julieId)).not.toBeNull();
    });

    expect(await deleteSpace(database, julieId, "Espace julie-nutrition", { stopSubscription })).toMatchObject({
      status: "deleted",
    });
    expect(stopSubscription).toHaveBeenCalledOnce();
    expect(await findOwnedSpace(database, julieId)).toBeNull();
  });

  it("finds no space for someone who has none", async () => {
    const newcomerId = await insertTestUser(database, "nouvelle@exemple.fr");
    expect(await deleteSpace(database, newcomerId, "Espace")).toEqual({ status: "space-not-found" });
  });
});

