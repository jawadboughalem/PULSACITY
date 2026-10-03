// Fills a demo space, "Julie Nutrition", for the given e-mail address: offers, testimonials of every
// status, sales and requests of the month. Run again, it starts the space over.
//
//   pnpm db:seed                         demo@pulsacity.local, plan Gratuit, on the local database
//   pnpm db:seed vous@exemple.fr         your address, to sign in with your magic link
//   pnpm db:seed vous@exemple.fr --plan=essentiel
//   pnpm db:seed vous@exemple.fr --recette   allowed on a database that is not on this machine
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import postgres from "postgres";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "db"]);
const PLANS = new Set(["free", "essentiel", "pro"]);
const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

const args = process.argv.slice(2);
const email = (args.find((arg) => !arg.startsWith("--")) ?? "demo@pulsacity.local").toLowerCase();
const plan = args.find((arg) => arg.startsWith("--plan="))?.slice("--plan=".length) ?? "free";
const isRecetteAllowed = args.includes("--recette");

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) fail("DATABASE_URL est vide. Renseignez-le dans .env.local.");
if (!PLANS.has(plan)) fail(`Plan inconnu : ${plan}. Choisissez free, essentiel ou pro.`);
const { hostname } = new URL(databaseUrl);
if (!LOCAL_HOSTS.has(hostname) && !isRecetteAllowed) {
  fail(`La base ${hostname} n'est pas sur cette machine. Ajoutez --recette si c'est bien la base de recette.`);
}

const sql = postgres(databaseUrl, { prepare: false, max: 1 });
const now = Date.now();
const daysAgo = (days) => new Date(now - days * DAY_MS);
const today = new Date(now);
const monthStart = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1) + 60 * 60 * 1000;
/** Requests of the demo stay within the current month, so the figures of the month are never empty. */
const sentThisMonth = (days) => new Date(Math.min(now, Math.max(monthStart, now - days * DAY_MS)));

const PRODUCTS = [
  { key: "programme", name: "Programme 30 jours", slug: "programme-30-jours" },
  { key: "suivi", name: "Suivi individuel 3 mois", slug: "suivi-individuel-3-mois" },
  { key: "atelier", name: "Atelier cuisine", slug: "atelier-cuisine" },
];

const FORM_CONSENT = "J'accepte que ce témoignage soit publié sur les supports de Julie Nutrition.";
const MANUAL_CONSENT = "J'ai l'accord de cette personne pour publier son témoignage.";

const TESTIMONIALS = [
  ["Sophie D.", "Maman de 3 enfants", 5, "Toute la famille mange mieux. Les menus de la semaine m'ont sauvé la vie.", "pending", "programme", 3],
  ["Nadia B.", "Infirmière de nuit", 4, "Enfin des conseils adaptés aux horaires décalés. J'aurais aimé plus de recettes végétariennes.", "pending", "suivi", 4],
  ["Camille R.", "Enseignante", 5, "En 30 jours j'ai arrêté de grignoter le soir. Julie explique sans culpabiliser, c'est la première fois qu'un programme tient dans ma vraie vie.", "approved", "programme", 18],
  ["Thomas L.", "Développeur", 5, "Les recettes sont rapides et le groupe motive vraiment. J'ai perdu 4 kg sans me priver.", "approved", "programme", 27],
  ["Inès V.", "Pharmacienne", 5, "Un suivi attentif, des messages toujours bienveillants. Je recommande sans hésiter.", "approved", "suivi", 35],
  ["Hugo P.", "Étudiant", 4, "Des idées simples pour un petit budget. L'atelier m'a donné envie de cuisiner.", "approved", "atelier", 41],
  ["Manon G.", "Architecte", 5, "J'ai enfin compris comment composer une assiette. Fini les fringales de 17 h.", "approved", "programme", 52],
  ["Lucas M.", "Comptable", 4, "Très bon programme, un peu dense la première semaine.", "approved", "programme", 60],
  ["Chloé T.", "Coach sportive", 5, "Je l'ai conseillé à toutes mes clientes. Les résultats parlent d'eux-mêmes.", "approved", "suivi", 71],
  ["Emma S.", "Maman solo", 5, "Des repas prêts en 20 minutes, que mes enfants mangent. Merci Julie.", "approved", "atelier", 85],
  ["Louis F.", "Cheffe de projet", 5, "Le format court est parfait quand on manque de temps.", "approved", "programme", 96],
  ["Jade K.", "Graphiste", 4, "Bonne ambiance dans le groupe, et des recettes que je refais encore.", "approved", "atelier", 110],
  ["Arthur B.", "Retraité", 3, "Intéressant, mais j'aurais voulu plus de suivi personnalisé.", "hidden", "programme", 120],
];

const SALES = [
  // first name, last name, product, days since the sale, days since the request, answered, reminder in days
  ["Alice", "Moreau", "programme", 20, 6, true, null],
  ["Paul", "Girard", "suivi", 18, 4, true, null],
  ["Léa", "Roux", "programme", 16, 2, true, null],
  ["Noé", "Fabre", "atelier", 15, 1, false, 3],
  ["Rose", "Blanc", "programme", 17, 3, false, 1],
  ["Adam", "Henry", "suivi", 19, 5, false, null],
  ["Zoé", "Morel", "programme", 21, 7, false, null],
  ["Victor", "Leroy", "atelier", 22, 8, false, null],
  ["Julia", "Perrin", "programme", 3, null, false, null],
  ["Oscar", "Garnier", "suivi", 1, null, false, null],
];

// Sales received from Systeme.io, in the format captured on September 27, 2026 (docs-internes/connectors/systeme.md).
const SYSTEME_PRODUCTS = [
  { ref: "price-plan:3456401", planId: 3456401, name: "Programme 30 jours - Mieux manger sans régime", amount: 29700, product: "programme", firstSale: 36 },
  { ref: "price-plan:3456402", planId: 3456402, name: "Suivi individuel 3 mois", amount: 59000, product: null, firstSale: null },
];

const SYSTEME_EVENTS = [
  // minutes ago (null: yesterday evening), buyer, price plan, outcome
  { minutesAgo: 12 * 24 * 60, firstName: "Hélène", lastName: "Thomas", plan: 0, outcome: "request-scheduled" },
  { minutesAgo: null, firstName: "Karim", lastName: "Benali", plan: 1, outcome: "awaiting-product" },
  { minutesAgo: 3, firstName: "Léa", lastName: "Marchand", plan: 0, outcome: "request-scheduled" },
];

/** Yesterday at 18:42 in Paris, like maquette 5. */
const yesterdayEvening = () => {
  const date = new Date(now - DAY_MS);
  date.setUTCHours(16, 42, 0, 0);
  return date;
};

const buildSaleNew = ({ orderId, email, firstName, plan, createdAt }) => ({
  customer: {
    id: 12799000 + orderId,
    clientIp: "203.0.113.10",
    contactId: 445573000 + orderId,
    email,
    fields: { first_name: firstName, country: "FR", postcode: "69001" },
    paymentProcessor: "stripe",
    sourceUrl: "https://julie-nutrition.systeme.io/programme",
  },
  coupon: null,
  funnelStep: { id: 25610405, name: "Bon de commande", type: "offer-form", funnel: { id: 7648170, name: "Tunnel Julie Nutrition" } },
  checkoutPage: null,
  order: {
    id: 12768300 + orderId,
    createdAt: createdAt.toISOString().replace(/\.\d{3}Z$/, "+00:00"),
    discountAmount: null,
    discountType: null,
    shippingFee: null,
    totalPrice: plan.amount,
    vat: 0.0,
  },
  orderItem: {
    createdAt: createdAt.toISOString().replace(/\.\d{3}Z$/, "+00:00"),
    id: 15460100 + orderId,
    resources: [{ course: null, courseBundle: null, enrollmentAccessType: null, enrollmentDrippingAccessCourse: null, physicalProduct: null, tag: null }],
  },
  pricePlan: { id: plan.planId, name: plan.name, type: "one_shot", amount: plan.amount, currency: "eur", innerName: plan.name, recurringOptions: null, statementDescriptor: "" },
});

const buildSystemeHeaders = (event, body, secret, receivedAt) => ({
  "content-type": "application/json",
  "user-agent": "SystemeIO-Webhook",
  "x-webhook-event": event,
  "x-webhook-schema-version": "2",
  "x-webhook-message-id": randomUUID(),
  "x-webhook-event-timestamp": receivedAt.toISOString().replace(/\.\d{3}Z$/, "+00:00"),
  "x-webhook-signature": createHmac("sha256", secret).update(body).digest("hex"),
});

await sql.begin(async (tx) => {
  const [existingUser] = await tx`select id from "user" where email = ${email}`;
  const userId = existingUser?.id ?? randomUUID();
  if (existingUser) {
    await tx`update "user" set name = 'Julie Martin', email_verified = true where id = ${userId}`;
    await tx`delete from spaces where user_id = ${userId}`;
  } else {
    await tx`insert into "user" (id, name, email, email_verified) values (${userId}, 'Julie Martin', ${email}, true)`;
  }

  const [slugTaken] = await tx`select id from spaces where slug = 'julie-nutrition'`;
  const slug = slugTaken ? `julie-nutrition-${randomUUID().slice(0, 6)}` : "julie-nutrition";
  const [space] = await tx`
    insert into spaces (user_id, name, slug, accent_color, reply_to_email, plan, referral_code,
      collection_link_shared_at, first_day_celebrated_at, first_approval_celebrated_at)
    values (${userId}, 'Julie Nutrition', ${slug}, '#4F6F52', ${email}, ${plan}, ${randomUUID().slice(0, 8)},
      ${daysAgo(130)}, ${daysAgo(130)}, ${daysAgo(120)})
    returning id`;
  await tx`insert into widgets (space_id, type) values (${space.id}, 'wall')`;

  const productIds = {};
  for (const product of PRODUCTS) {
    const [row] = await tx`
      insert into products (space_id, name, slug) values (${space.id}, ${product.name}, ${product.slug}) returning id`;
    productIds[product.key] = row.id;
  }

  for (const [authorName, authorTitle, rating, body, status, product, age] of TESTIMONIALS) {
    const isManual = authorName === "Thomas L.";
    await tx`
      insert into testimonials (space_id, product_id, author_name, author_title, rating, body, status, source,
        consent_at, consent_text, featured, created_at)
      values (${space.id}, ${productIds[product]}, ${authorName}, ${authorTitle}, ${rating}, ${body}, ${status},
        ${isManual ? "manual" : "form"}, ${daysAgo(age)}, ${isManual ? MANUAL_CONSENT : FORM_CONSENT},
        ${authorName === "Camille R."}, ${daysAgo(age)})`;
  }

  for (const [firstName, lastName, product, saleAge, requestAge, isAnswered, reminderIn] of SALES) {
    const [customer] = await tx`
      insert into customers (space_id, email, first_name, last_name)
      values (${space.id}, ${`${firstName}.${lastName}@exemple.fr`.toLowerCase()}, ${firstName}, ${lastName})
      returning id`;
    const [purchase] = await tx`
      insert into purchases (space_id, customer_id, product_id, source, purchased_at)
      values (${space.id}, ${customer.id}, ${productIds[product]}, 'manual', ${daysAgo(saleAge)})
      returning id`;
    const isSent = requestAge !== null;
    const status = isAnswered ? "completed" : isSent ? "sent" : "scheduled";
    await tx`
      insert into review_requests (purchase_id, token, scheduled_at, sent_at, reminder_scheduled_at, completed_at, status)
      values (${purchase.id}, ${randomUUID()}, ${isSent ? sentThisMonth(requestAge) : daysAgo(saleAge - 14)},
        ${isSent ? sentThisMonth(requestAge) : null}, ${reminderIn === null ? null : daysAgo(-reminderIn)},
        ${isAnswered ? sentThisMonth(requestAge - 1) : null}, ${status})`;
  }

  const signingSecret = randomBytes(16).toString("hex");
  const [connection] = await tx`
    insert into connections (space_id, connector, webhook_token, status, last_event_at, config, created_at)
    values (${space.id}, 'systeme', ${randomBytes(32).toString("base64url")}, 'active', ${new Date(now - 3 * MINUTE_MS)},
      ${sql.json({ signingSecret })}, ${daysAgo(13)})
    returning id`;
  for (const product of SYSTEME_PRODUCTS) {
    await tx`
      insert into external_products (connection_id, external_ref, name, price_cents, currency, first_seen_at)
      values (${connection.id}, ${product.ref}, ${product.name}, ${product.amount}, 'EUR',
        ${product.firstSale === null ? yesterdayEvening() : daysAgo(product.firstSale)})`;
    if (product.product) {
      await tx`
        insert into product_refs (product_id, connection_id, external_ref)
        values (${productIds[product.product]}, ${connection.id}, ${product.ref})`;
    }
  }

  let orderId = 0;
  for (const event of SYSTEME_EVENTS) {
    orderId += 1;
    const receivedAt = event.minutesAgo === null ? yesterdayEvening() : new Date(now - event.minutesAgo * MINUTE_MS);
    const plan = SYSTEME_PRODUCTS[event.plan ?? 0];
    const buyerEmail = `${event.firstName}.${event.lastName}@exemple.fr`.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
    const payload = buildSaleNew({ orderId, email: buyerEmail, firstName: event.firstName, plan, createdAt: receivedAt });
    const body = JSON.stringify(payload);
    let purchaseId = null;
    if (event.outcome === "request-scheduled") {
      const [customer] = await tx`
        insert into customers (space_id, email, first_name, last_name)
        values (${space.id}, ${buyerEmail}, ${event.firstName}, ${event.lastName})
        returning id`;
      const [purchase] = await tx`
        insert into purchases (space_id, customer_id, product_id, connection_id, source, event_type, external_ref, purchased_at)
        values (${space.id}, ${customer.id}, ${productIds[plan.product]}, ${connection.id}, 'connector', 'sale',
          ${`order-item:${payload.orderItem.id}`}, ${receivedAt})
        returning id`;
      purchaseId = purchase.id;
      const scheduledAt = new Date(receivedAt.getTime() + 14 * DAY_MS);
      const isSent = scheduledAt.getTime() <= now;
      await tx`
        insert into review_requests (purchase_id, token, scheduled_at, sent_at, reminder_scheduled_at, status)
        values (${purchase.id}, ${randomUUID()}, ${scheduledAt}, ${isSent ? scheduledAt : null},
          ${isSent ? new Date(scheduledAt.getTime() + 4 * DAY_MS) : null}, ${isSent ? "sent" : "scheduled"})`;
    }
    await tx`
      insert into webhook_events (connection_id, raw_payload, raw_body, headers, event_type, received_at, processed_at, outcome, purchase_id)
      values (${connection.id}, ${sql.json(payload)}, ${body},
        ${sql.json(buildSystemeHeaders("SALE_NEW", body, signingSecret, receivedAt))},
        'SALE_NEW', ${receivedAt}, ${receivedAt}, ${event.outcome}, ${purchaseId})`;
  }

  console.log(`Espace « Julie Nutrition » prêt pour ${email} (plan ${plan}), adresse /t/${slug}.`);
});

await sql.end();
console.log("Connectez-vous sur /connexion avec cette adresse. En local, le lien s'affiche dans le terminal de pnpm dev.");
