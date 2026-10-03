import type { ReactNode } from "react";

/**
 * Drawings of the webhook settings of Systeme.io, in place of the screenshots of maquette 5, in the charter's colours.
 * Labels are those of Systeme.io (docs-internes/connectors/systeme.md). A frame is never narrower than 232 px, so labels
 * drawn at 12.5 never show below the charter's 12 px.
 */

const LABEL_SIZE = 12.5;

const Label = ({ x, y, children, isStrong = false, isLight = false, anchor = "start" }: {
  x: number;
  y: number;
  children: ReactNode;
  isStrong?: boolean;
  isLight?: boolean;
  anchor?: "start" | "middle";
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fontSize={LABEL_SIZE}
    fontWeight={isStrong ? 600 : 400}
    className={isLight ? "fill-white font-sans" : isStrong ? "fill-ink-900 font-sans" : "fill-slate-600 font-sans"}
  >
    {children}
  </text>
);

const Bar = ({ x, y, width, height = 6 }: { x: number; y: number; width: number; height?: number }) => (
  <rect x={x} y={y} width={width} height={height} rx={1} className="fill-paper-100" />
);

const Window = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 240 150" aria-hidden="true" focusable="false" className="block h-auto w-full">
    <rect x={12.5} y={10.5} width={215} height={129} rx={2} className="fill-white stroke-hairline-200" />
    <rect x={13} y={11} width={214} height={16} className="fill-paper-100" />
    <line x1={13} y1={27.5} x2={227} y2={27.5} className="stroke-hairline-200" />
    {children}
  </svg>
);

const Pointer = ({ x, y }: { x: number; y: number }) => (
  <path
    d={`M${x} ${y}l9 19 3-8 8-3z`}
    strokeWidth={1.5}
    strokeLinejoin="round"
    className="fill-ink-900 stroke-white"
  />
);

const Check = ({ x, y, isChecked }: { x: number; y: number; isChecked: boolean }) => (
  <g>
    <rect
      x={x + 0.75}
      y={y + 0.75}
      width={12.5}
      height={12.5}
      rx={2}
      strokeWidth={1.5}
      className={isChecked ? "fill-ink-900 stroke-ink-900" : "fill-white stroke-gray-400"}
    />
    {isChecked ? (
      <path
        d={`M${x + 3.5} ${y + 7}l2.5 2.5 4.5-5`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-none stroke-white"
      />
    ) : null}
  </g>
);

export const OpenWebhooksDrawing = () => (
  <Window>
    <circle cx={213} cy={19} r={5.25} strokeWidth={1.5} className="fill-white stroke-ink-900" />
    <line x1={96.5} y1={28} x2={96.5} y2={139} className="stroke-hairline-200" />
    <Label x={20} y={46}>
      Paramètres
    </Label>
    <Bar x={20} y={56} width={48} />
    <rect x={18.75} y={68.75} width={70.5} height={20} rx={2} strokeWidth={1.5} className="fill-white stroke-ink-900" />
    <Label x={24} y={83} isStrong>
      Webhooks
    </Label>
    <Bar x={20} y={98} width={40} />
    <Bar x={20} y={110} width={52} />
    <Label x={108} y={46} isStrong>
      Webhooks
    </Label>
    <rect x={108} y={56} width={44} height={18} rx={2} className="fill-ink-900" />
    <Label x={130} y={69} isStrong isLight anchor="middle">
      Créer
    </Label>
    <Pointer x={146} y={70} />
    <Bar x={108} y={96} width={104} />
    <Bar x={108} y={108} width={84} />
    <Bar x={108} y={120} width={96} />
  </Window>
);

export const FillWebhookDrawing = () => (
  <Window>
    <Label x={24} y={46} isStrong>
      Créer webhook
    </Label>
    <Label x={24} y={67}>
      Nom
    </Label>
    <rect x={80.5} y={55.5} width={136} height={16} rx={2} className="fill-white stroke-gray-400" />
    <Label x={86} y={67.5}>
      PULSACITY
    </Label>
    <Label x={24} y={93}>
      URL *
    </Label>
    <rect x={80.75} y={81.75} width={135.5} height={15.5} rx={2} strokeWidth={1.5} className="fill-white stroke-ink-900" />
    <line x1={87} y1={89.5} x2={200} y2={89.5} strokeWidth={2} strokeLinecap="round" className="stroke-gray-400" />
    <Label x={24} y={119}>
      Secret *
    </Label>
    <rect x={80.75} y={107.75} width={135.5} height={15.5} rx={2} strokeWidth={1.5} className="fill-white stroke-ink-900" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
      <circle key={index} cx={89 + index * 8} cy={115.5} r={2} className="fill-ink-900" />
    ))}
  </Window>
);

export const ChooseEventsDrawing = () => (
  <Window>
    <Check x={24} y={38} isChecked />
    <Label x={46} y={49} isStrong>
      Nouvelle vente
    </Label>
    <Check x={24} y={60} isChecked />
    <Label x={46} y={71} isStrong>
      Vente annulée
    </Label>
    <Check x={24} y={82} isChecked={false} />
    <Label x={46} y={93}>
      Contact créé
    </Label>
    <rect x={24} y={108} width={24} height={14} rx={7} className="fill-ink-900" />
    <circle cx={41} cy={115} r={5} className="fill-white" />
    <Label x={54} y={119.5}>
      Actif(ve)
    </Label>
    <rect x={132} y={106} width={86} height={20} rx={2} className="fill-ink-900" />
    <Label x={175} y={120} isStrong isLight anchor="middle">
      Enregistrer
    </Label>
  </Window>
);
