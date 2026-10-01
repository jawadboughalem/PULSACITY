import type { ReactNode } from "react";

/**
 * Drawings of the Systeme.io editor, 240 × 120 like the frames of maquette 6, in the charter's colours. A frame is
 * never narrower than 232 px, so labels drawn at 12.5 never show below the charter's 12 px.
 */

const LABEL_SIZE = 12.5;

const STAR = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z";

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

const EditorWindow = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 240 120" aria-hidden="true" focusable="false" className="block h-auto w-full">
    <rect x={12.5} y={10.5} width={215} height={99} rx={2} className="fill-white stroke-hairline-200" />
    <rect x={13} y={11} width={214} height={14} className="fill-paper-100" />
    <line x1={13} y1={25.5} x2={227} y2={25.5} className="stroke-hairline-200" />
    {children}
  </svg>
);

export const AddHtmlElementDrawing = () => (
  <EditorWindow>
    <line x1={100.5} y1={26} x2={100.5} y2={109} className="stroke-hairline-200" />
    <rect x={18.5} y={34.5} width={76} height={18} rx={2} className="fill-white stroke-hairline-200" />
    <Label x={26} y={48}>
      Texte
    </Label>
    <rect x={18.5} y={58.5} width={76} height={18} rx={2} className="fill-white stroke-hairline-200" />
    <Label x={26} y={72}>
      Image
    </Label>
    <rect x={18.75} y={82.75} width={75.5} height={18} rx={2} strokeWidth={1.5} className="fill-white stroke-ink-900" />
    <Label x={24} y={96} isStrong>
      Code HTML
    </Label>
    <Bar x={112} y={34} width={72} height={8} />
    <Bar x={112} y={48} width={104} />
    <rect
      x={112.75}
      y={62.75}
      width={103.5}
      height={24}
      rx={2}
      strokeWidth={1.5}
      strokeDasharray="4 3"
      className="fill-none stroke-ink-900"
    />
    <Bar x={112} y={94} width={88} />
    <path d="M95 92c8 0 9-17 14-17" strokeWidth={1.5} strokeLinecap="round" className="fill-none stroke-ink-900" />
    <path d="M105 71l4.5 4-4.5 4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="fill-none stroke-ink-900" />
  </EditorWindow>
);

export const EditCodeDrawing = () => (
  <EditorWindow>
    <Bar x={28} y={32} width={96} />
    <rect x={28.75} y={42.75} width={182.5} height={26} rx={2} strokeWidth={1.5} className="fill-paper-100 stroke-ink-900" />
    <Label x={40} y={60}>
      Code HTML
    </Label>
    <rect x={28} y={76} width={124} height={24} rx={2} className="fill-ink-900" />
    <Label x={90} y={92} isStrong isLight anchor="middle">
      Modifier le code
    </Label>
    <path
      d="M150 88l9 19 3-8 8-3z"
      strokeWidth={1.5}
      strokeLinejoin="round"
      className="fill-ink-900 stroke-white"
    />
  </EditorWindow>
);

export const PasteCodeDrawing = () => (
  <EditorWindow>
    <Bar x={24} y={34} width={56} />
    <Bar x={24} y={96} width={64} />
    <rect x={44.5} y={32.5} width={151} height={72} rx={2} className="fill-white stroke-ink-900" />
    <Label x={56} y={50} isStrong>
      Code HTML
    </Label>
    <rect x={56} y={58} width={128} height={20} rx={2} className="fill-paper-100" />
    <line x1={62} y1={64.5} x2={150} y2={64.5} strokeWidth={2} strokeLinecap="round" className="stroke-gray-400" />
    <line x1={62} y1={71.5} x2={124} y2={71.5} strokeWidth={2} strokeLinecap="round" className="stroke-gray-400" />
    <rect x={152} y={84} width={32} height={14} rx={2} className="fill-ink-900" />
    <path d="M162 91l3.5 3.5 7-7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="fill-none stroke-white" />
  </EditorWindow>
);

const MiniCard = ({ x }: { x: number }) => (
  <g>
    <rect x={x + 0.5} y={52.5} width={59} height={46} rx={2} className="fill-white stroke-hairline-200" />
    {[0, 1, 2, 3, 4].map((index) => (
      <path key={index} d={STAR} transform={`translate(${x + 7 + index * 8} 59) scale(0.3)`} className="fill-carmine" />
    ))}
    <Bar x={x + 7} y={72} width={46} height={4} />
    <Bar x={x + 7} y={80} width={34} height={4} />
    <Bar x={x + 7} y={88} width={40} height={4} />
  </g>
);

export const SaveAndPreviewDrawing = () => (
  <svg viewBox="0 0 240 120" aria-hidden="true" focusable="false" className="block h-auto w-full">
    <rect x={12.5} y={10.5} width={215} height={99} rx={2} className="fill-white stroke-hairline-200" />
    <rect x={13} y={11} width={214} height={28} className="fill-paper-100" />
    <line x1={13} y1={39.5} x2={227} y2={39.5} className="stroke-hairline-200" />
    <path
      d="M108 25s3-5.5 8-5.5 8 5.5 8 5.5-3 5.5-8 5.5-8-5.5-8-5.5z"
      strokeWidth={1.5}
      strokeLinejoin="round"
      className="fill-none stroke-ink-900"
    />
    <circle cx={116} cy={25} r={2.2} strokeWidth={1.5} className="fill-none stroke-ink-900" />
    <rect x={134} y={15} width={86} height={20} rx={2} className="fill-ink-900" />
    <Label x={177} y={29} isStrong isLight anchor="middle">
      Enregistrer
    </Label>
    <MiniCard x={22} />
    <MiniCard x={90} />
    <MiniCard x={158} />
  </svg>
);
