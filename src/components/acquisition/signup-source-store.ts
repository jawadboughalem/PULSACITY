import { useSyncExternalStore } from "react";
import { type SignupSource, hasSignupSource, readSignupSource } from "@/lib/acquisition/signup-source";

/**
 * The source of the visit, held in memory while the visitor moves around the site: the page of arrival carries it in
 * its address, the pages after it no longer do. Never written on the device: closing the tab forgets it.
 */
let currentSource: SignupSource = {};
const listeners = new Set<() => void>();

const EMPTY_SOURCE: SignupSource = {};

/** A new address with a source replaces the one held; an address without one keeps it. */
export const captureSignupSource = (search: string): void => {
  const source = readSignupSource(new URLSearchParams(search));
  if (!hasSignupSource(source)) return;
  currentSource = source;
  for (const listener of listeners) listener();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useSignupSource = (): SignupSource =>
  useSyncExternalStore(
    subscribe,
    () => currentSource,
    () => EMPTY_SOURCE,
  );
