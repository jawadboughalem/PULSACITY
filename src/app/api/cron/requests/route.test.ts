import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const processMissedEvents = vi.fn();
const sendDueReviewEmails = vi.fn();

vi.mock("@/db", () => ({ getDb: () => ({}) }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));
vi.mock("@/lib/connectors/process-webhook-event", () => ({
  processMissedEvents: (...args: unknown[]) => processMissedEvents(...args),
}));
vi.mock("@/lib/requests/send-review-emails", () => ({
  sendDueReviewEmails: (...args: unknown[]) => sendDueReviewEmails(...args),
}));

const call = (authorization?: string) =>
  GET(new Request("https://pulsacity.com/api/cron/requests", { headers: authorization ? { authorization } : {} }));

beforeEach(() => {
  processMissedEvents.mockReset().mockResolvedValue(0);
  sendDueReviewEmails.mockReset().mockResolvedValue({ sent: 2, reminded: 1, cancelled: 0, waitingForPlan: 0, failed: 0 });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/cron/requests", () => {
  it("runs only for Vercel Cron, which sends the secret", async () => {
    vi.stubEnv("CRON_SECRET", "secret-du-cron");

    expect((await call()).status).toBe(401);
    expect((await call("Bearer autre-chose")).status).toBe(401);
    expect(sendDueReviewEmails).not.toHaveBeenCalled();

    const response = await call("Bearer secret-du-cron");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ missedEvents: 0, sent: 2, reminded: 1, cancelled: 0, waitingForPlan: 0, failed: 0 });
    expect(processMissedEvents).toHaveBeenCalledOnce();
  });

  it("runs for nobody when the secret is not set", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await call("Bearer ")).status).toBe(401);
    expect((await call("Bearer undefined")).status).toBe(401);
  });
});
