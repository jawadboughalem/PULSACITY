import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const processMissedEvents = vi.fn();
const sendDueReviewEmails = vi.fn();
const runBillingTasks = vi.fn();
const sendDueWelcomeEmails = vi.fn();
const sendWaitingHiddenReasons = vi.fn();

vi.mock("@/db", () => ({ getDb: () => ({}) }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));
vi.mock("@/lib/connectors/process-webhook-event", () => ({
  processMissedEvents: (...args: unknown[]) => processMissedEvents(...args),
}));
vi.mock("@/lib/requests/send-review-emails", () => ({
  sendDueReviewEmails: (...args: unknown[]) => sendDueReviewEmails(...args),
}));
vi.mock("@/lib/welcome-emails/send-welcome-emails", () => ({
  sendDueWelcomeEmails: (...args: unknown[]) => sendDueWelcomeEmails(...args),
}));
vi.mock("@/lib/testimonials/send-hidden-reason", () => ({
  sendWaitingHiddenReasons: (...args: unknown[]) => sendWaitingHiddenReasons(...args),
}));
vi.mock("@/lib/billing/run-billing-tasks", () => ({
  runBillingTasks: (...args: unknown[]) => runBillingTasks(...args),
}));

const call = (authorization?: string) =>
  GET(new Request("https://pulsacity.com/api/cron/requests", { headers: authorization ? { authorization } : {} }));

beforeEach(() => {
  processMissedEvents.mockReset().mockResolvedValue(0);
  sendDueReviewEmails.mockReset().mockResolvedValue({ sent: 2, reminded: 1, cancelled: 0, spacesAtPlanLimit: 0, failed: 0 });
  runBillingTasks.mockReset().mockResolvedValue({ replayedEvents: 1, betaReminders: 0 });
  sendDueWelcomeEmails.mockReset().mockResolvedValue({ welcomeEmailsSent: 3, welcomeEmailsSkipped: 1 });
  sendWaitingHiddenReasons.mockReset().mockResolvedValue({ hiddenReasonsSent: 1 });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/cron/requests", () => {
  it("runs only for the schedulers, which send the secret", async () => {
    vi.stubEnv("CRON_SECRET", "secret-du-cron");

    expect((await call()).status).toBe(401);
    expect((await call("Bearer autre-chose")).status).toBe(401);
    expect(sendDueReviewEmails).not.toHaveBeenCalled();

    const response = await call("Bearer secret-du-cron");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      missedEvents: 0,
      billing: { replayedEvents: 1, betaReminders: 0 },
      sent: 2,
      reminded: 1,
      cancelled: 0,
      spacesAtPlanLimit: 0,
      failed: 0,
      welcomeEmailsSent: 3,
      welcomeEmailsSkipped: 1,
      hiddenReasonsSent: 1,
    });
    expect(processMissedEvents).toHaveBeenCalledOnce();
    // Without a Stripe key (local, CI), the billing tasks still send the reminders, without replaying events.
    expect(runBillingTasks).toHaveBeenCalledWith(expect.anything(), null);
  });

  it("runs for nobody when the secret is not set", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await call("Bearer ")).status).toBe(401);
    expect((await call("Bearer undefined")).status).toBe(401);
  });
});
