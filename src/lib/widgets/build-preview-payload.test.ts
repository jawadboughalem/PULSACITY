import { describe, expect, it } from "vitest";
import { type PreviewLook, buildPreviewPayload } from "./build-preview-payload";
import type { PreviewTestimonial, WidgetPreviewData } from "./load-widget-preview";
import type { WidgetEdit } from "./widget-settings";

const PROGRAMME = "5d2c7c1e-4f39-4d0b-9f39-0d6a3e1b7a01";
const SUIVI = "5d2c7c1e-4f39-4d0b-9f39-0d6a3e1b7a02";

const testimonial = (authorName: string, productId: string | null): PreviewTestimonial => ({
  authorName,
  authorTitle: null,
  authorPhotoUrl: `https://photos.exemple.fr/${authorName}.jpg`,
  rating: 5,
  text: `Le témoignage de ${authorName}.`,
  receivedOn: "2026-09-12",
  productId,
});

const DATA: WidgetPreviewData = {
  testimonials: [
    testimonial("Camille R.", PROGRAMME),
    testimonial("Inès V.", SUIVI),
    testimonial("Thomas L.", PROGRAMME),
    testimonial("Hugo P.", null),
  ],
  summaries: {
    all: { total: 60, averageRating: 4.7 },
    byOffer: { [PROGRAMME]: { total: 2, averageRating: 5 }, [SUIVI]: { total: 1, averageRating: 5 } },
  },
};

const EDIT: WidgetEdit = {
  type: "wall",
  productId: null,
  theme: "auto",
  accentColor: null,
  maxItems: 2,
  showPhoto: true,
  showRating: true,
  showDate: true,
  hidePoweredBy: false,
};

const LOOK: PreviewLook = {
  cardStyle: "sharp",
  spaceAccentColor: "#4F6F52",
  poweredByUrl: "https://pulsacity.com/?ref=julie42",
  canHideBadge: false,
};

describe("buildPreviewPayload", () => {
  it("shows the first testimonials with the summary of the space, as the public JSON would", () => {
    const payload = buildPreviewPayload(DATA, EDIT, LOOK);

    expect(payload).toMatchObject({
      type: "wall",
      accentColor: "#4F6F52",
      total: 60,
      average: 4.7,
      next: 2,
      poweredBy: "https://pulsacity.com/?ref=julie42",
    });
    expect(payload.testimonials.map((shown) => shown.name)).toEqual(["Camille R.", "Inès V."]);
  });

  it("keeps to the chosen offer, with its own count and average", () => {
    const payload = buildPreviewPayload(DATA, { ...EDIT, productId: PROGRAMME, maxItems: 12 }, LOOK);

    expect(payload.testimonials.map((shown) => shown.name)).toEqual(["Camille R.", "Thomas L."]);
    expect(payload).toMatchObject({ total: 2, average: 5, next: null });
    expect(buildPreviewPayload(DATA, { ...EDIT, productId: "5d2c7c1e-4f39-4d0b-9f39-0d6a3e1b7a03" }, LOOK)).toMatchObject({
      total: 0,
      average: null,
      testimonials: [],
    });
  });

  it("brings the next testimonials of the wall, and stops where those the editor holds end", () => {
    const more = buildPreviewPayload(DATA, EDIT, LOOK, 2);

    expect(more.testimonials.map((shown) => shown.name)).toEqual(["Thomas L.", "Hugo P."]);
    expect(more.next).toBeNull();
  });

  it("gives a badge three faces, and hides « Propulsé par PULSACITY » on the Pro plan only", () => {
    const badge = buildPreviewPayload(DATA, { ...EDIT, type: "badge", hidePoweredBy: true }, LOOK);

    expect(badge.testimonials).toEqual([]);
    expect(badge.avatars).toHaveLength(3);
    expect(badge.poweredBy).toBe("https://pulsacity.com/?ref=julie42");
    expect(buildPreviewPayload(DATA, { ...EDIT, hidePoweredBy: true }, { ...LOOK, canHideBadge: true }).poweredBy).toBeNull();
  });

  it("leaves out the photos, the stars and the dates the creator turns off", () => {
    const payload = buildPreviewPayload(DATA, { ...EDIT, showPhoto: false, showRating: false, showDate: false }, LOOK);

    expect(payload.average).toBeNull();
    expect(payload.testimonials[0]).toMatchObject({ photo: null, rating: null, date: null });
  });
});
