import { Icon } from "@/components/ui/Icon";
import type { MeanwhileItem } from "@/content/integrations";

/** Maquettes 3.5, Intégrations, « Sans connecteur, ça marche déjà »: white cards on Nuage, each under its icon. */
export const WithoutConnectorCards = ({ items }: { items: MeanwhileItem[] }) => (
  <ul className="grid gap-[14px] desktop:grid-cols-3">
    {items.map((item) => (
      <li key={item.title} className="flex flex-col gap-2 rounded-card bg-white p-5">
        {item.icon ? <Icon name={item.icon} size={24} className="mb-2" /> : null}
        <h3 className="text-body font-bold">{item.title}</h3>
        <p className="text-small">{item.text}</p>
      </li>
    ))}
  </ul>
);
