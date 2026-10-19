"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { ActionDoneMessage } from "@/components/ui/ActionDoneMessage";

const WaitlistNoticeContext = createContext<(connectorName: string) => void>(() => undefined);

/** Called by « Me prévenir » once the request is saved, to say it at the top of the list. */
export const useWaitlistNotice = () => useContext(WaitlistNoticeContext);

/**
 * Maquettes 3.4, « Me prévenir » enregistré: the row says « Nous vous préviendrons par e-mail », and a message confirms
 * it at the top of the list.
 */
export const WaitlistNotice = ({ children }: { children: ReactNode }) => {
  const [connectorName, setConnectorName] = useState<string | null>(null);

  return (
    <WaitlistNoticeContext.Provider value={setConnectorName}>
      <ActionDoneMessage
        message={connectorName ? `C'est noté : nous vous écrirons le jour de la sortie de ${connectorName}.` : null}
      />
      {children}
    </WaitlistNoticeContext.Provider>
  );
};
