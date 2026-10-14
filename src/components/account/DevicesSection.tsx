"use client";

import { useState, useTransition } from "react";
import { signOutOtherDevices } from "@/app/app/(espace)/compte/account-actions";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FIELD_HINT_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { FieldError } from "@/components/ui/FieldError";
import { Spinner } from "@/components/ui/Spinner";
import type { DeviceKind } from "@/lib/auth/describe-device";

export type ConnectedDevice = {
  id: string;
  label: string;
  kind: DeviceKind;
  /** « Cet appareil · actif maintenant », or « Dernière visite le 10 oct. 2026 ». */
  detail: string;
  isCurrent: boolean;
};

type DevicesSectionProps = {
  devices: ConnectedDevice[];
  onSignedOut: (message: string) => void;
};

/** Mon compte, « Appareils connectés »: this one first, then the others, which can all be signed out at once. */
export const DevicesSection = ({ devices, onSignedOut }: DevicesSectionProps) => {
  const [isSigningOut, startSigningOut] = useTransition();
  const [hasFailed, setHasFailed] = useState(false);
  const hasOthers = devices.some((device) => !device.isCurrent);

  return (
    <SettingsSection id="account-devices" title="Appareils connectés">
      <ul className="flex flex-col gap-5">
        {devices.map((device) => (
          <li key={device.id} className="flex items-start gap-4">
            <Icon name={device.kind === "phone" ? "phone" : "monitor"} size={24} className="mt-[1px]" />
            <div className="flex min-w-[0] flex-col">
              <span className="text-body font-bold">{device.label}</span>
              <span className="text-small text-gray">{device.detail}</span>
            </div>
          </li>
        ))}
      </ul>
      {hasOthers ? (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={isSigningOut}
            aria-busy={isSigningOut || undefined}
            onClick={() => {
              setHasFailed(false);
              startSigningOut(async () => {
                try {
                  await signOutOtherDevices();
                  onSignedOut("Vos autres appareils sont déconnectés.");
                } catch {
                  setHasFailed(true);
                }
              });
            }}
            className={`${SECONDARY_COMPACT_BUTTON_CLASSES} self-start`}
          >
            {isSigningOut ? <Spinner size={18} /> : null}
            {isSigningOut ? "Envoi…" : "Se déconnecter partout ailleurs"}
          </button>
          {hasFailed ? (
            <FieldError
              id="devices-error"
              message="Les autres appareils n'ont pas été déconnectés. Vérifiez votre connexion, puis réessayez."
            />
          ) : null}
          <p className={FIELD_HINT_CLASSES}>Cet appareil reste connecté.</p>
        </div>
      ) : null}
    </SettingsSection>
  );
};
