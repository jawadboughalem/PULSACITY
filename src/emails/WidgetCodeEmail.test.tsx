import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WidgetCodeEmail } from "./WidgetCodeEmail";

const SNIPPET = '<div data-pulsacity-widget="abc"></div>\n<script src="https://pulsacity.com/w.js" async></script>';

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

describe("WidgetCodeEmail", () => {
  it("carries the code to paste, escaped, and readable as plain text", async () => {
    const html = await render(<WidgetCodeEmail snippet={SNIPPET} />);
    const text = await render(<WidgetCodeEmail snippet={SNIPPET} />, { plainText: true });

    expect(html).toContain("&lt;div data-pulsacity-widget=&quot;abc&quot;&gt;&lt;/div&gt;");
    expect(html).not.toContain('<script src="https://pulsacity.com/w.js"');
    expect(text).toContain('data-pulsacity-widget="abc"');
  });
});
