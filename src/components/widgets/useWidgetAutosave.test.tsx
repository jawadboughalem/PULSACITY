// @vitest-environment jsdom
import { act, useEffect } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type SaveWidgetResult, saveWidget } from "@/app/app/(espace)/widgets/widget-actions";
import { useWidgetAutosave } from "./useWidgetAutosave";

vi.mock("@/app/app/(espace)/widgets/widget-actions", () => ({ saveWidget: vi.fn() }));

const WIDGET_ID = "0f5dc1cb-5810-42a7-82c1-79abcb387874";
const SAVED: SaveWidgetResult = { ok: true, data: null };
const NOT_SAVED: SaveWidgetResult = { ok: false, error: "invalid-settings" };

type Autosave = ReturnType<typeof useWidgetAutosave>;

let container: HTMLDivElement;
let root: Root;
let autosave: Autosave;

/** Hands the hook out after each render, so that the tests can call it and read its state. */
const Harness = ({ onRender }: { onRender: (value: Autosave) => void }) => {
  const value = useWidgetAutosave(WIDGET_ID);
  useEffect(() => onRender(value));
  return null;
};

const keep = (value: Autosave) => {
  autosave = value;
};

/** Lets the timers run out and every save waiting in the queue answer. */
const settle = () => act(async () => vi.runAllTimersAsync());

const deferredSave = () => {
  let answer: (result: SaveWidgetResult) => void = () => undefined;
  vi.mocked(saveWidget).mockImplementationOnce(() => new Promise((resolve) => (answer = resolve)));
  return (result: SaveWidgetResult) => act(async () => answer(result));
};

beforeEach(async () => {
  vi.useFakeTimers();
  vi.mocked(saveWidget).mockReset().mockResolvedValue(SAVED);
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<Harness onRender={keep} />));
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
});

describe("useWidgetAutosave", () => {
  it("saves only what changed, with a change still waiting for the end of the typing", async () => {
    act(() => autosave.schedule({ name: "Avis de la page" }, 600));
    act(() => autosave.schedule({ type: "carousel" }));
    await settle();

    expect(saveWidget).toHaveBeenCalledTimes(1);
    expect(saveWidget).toHaveBeenCalledWith(WIDGET_ID, { name: "Avis de la page", type: "carousel" });
    expect(autosave.saveState).toBe("saved");
  });

  it("sends a save only once the one before has answered, so that the last choice lands last", async () => {
    const answerFirst = deferredSave();
    act(() => autosave.schedule({ type: "carousel" }));
    await settle();
    act(() => autosave.schedule({ type: "wall" }));
    await settle();

    expect(saveWidget).toHaveBeenCalledTimes(1);
    expect(autosave.saveState).toBe("saving");

    await answerFirst(SAVED);
    await settle();

    expect(vi.mocked(saveWidget).mock.calls.map(([, change]) => change)).toEqual([{ type: "carousel" }, { type: "wall" }]);
    expect(autosave.saveState).toBe("saved");
  });

  it("keeps a change whose save failed for the next save, and for « Réessayer »", async () => {
    vi.mocked(saveWidget).mockResolvedValueOnce(NOT_SAVED).mockResolvedValueOnce(NOT_SAVED);
    act(() => autosave.schedule({ cardStyle: "soft" }));
    await settle();

    expect(autosave.saveState).toBe("failed");

    act(() => autosave.schedule({ theme: "dark" }));
    await settle();
    act(() => autosave.retry());
    await settle();

    expect(vi.mocked(saveWidget).mock.calls.map(([, change]) => change)).toEqual([
      { cardStyle: "soft" },
      { cardStyle: "soft", theme: "dark" },
      { cardStyle: "soft", theme: "dark" },
    ]);
    expect(autosave.saveState).toBe("saved");
  });

  it("sends a save still waiting when the editor closes", async () => {
    act(() => autosave.schedule({ maxItems: 12 }, 600));
    await act(async () => root.unmount());
    await settle();

    expect(saveWidget).toHaveBeenCalledWith(WIDGET_ID, { maxItems: 12 });
    root = createRoot(container);
  });
});
