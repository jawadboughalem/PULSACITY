"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FloatingMessage, useFloatingMessage } from "@/components/ui/FloatingMessage";
import { type ConnectedDevice, DevicesSection } from "./DevicesSection";
import { DeleteSpaceSection } from "./DeleteSpaceSection";
import { ExportSection } from "./ExportSection";
import { FirstNameSection } from "./FirstNameSection";
import { LoginEmailSection } from "./LoginEmailSection";

type AccountSettingsProps = {
  email: string;
  firstName: string;
  spaceName: string;
  devices: ConnectedDevice[];
  /** Back from the link sent to the new address, which now is the address of connection. */
  hasNewLoginEmail: boolean;
  hasExpiredLink: boolean;
};

/** Mon compte (3.3): the person, where Réglages is the space. One floating message for the whole page. */
export const AccountSettings = ({
  email,
  firstName,
  spaceName,
  devices,
  hasNewLoginEmail,
  hasExpiredLink,
}: AccountSettingsProps) => {
  const { message, show } = useFloatingMessage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasNewLoginEmail) return;
    show("Adresse de connexion changée.");
    router.replace(pathname, { scroll: false });
  }, [hasNewLoginEmail, show, router, pathname]);

  return (
    <div className="flex max-w-[760px] flex-col gap-6">
      <LoginEmailSection email={email} hasExpiredLink={hasExpiredLink} />
      <FirstNameSection firstName={firstName} onSaved={show} />
      <DevicesSection devices={devices} onSignedOut={show} />
      <ExportSection />
      <DeleteSpaceSection spaceName={spaceName} />
      <FloatingMessage message={message} />
    </div>
  );
};
