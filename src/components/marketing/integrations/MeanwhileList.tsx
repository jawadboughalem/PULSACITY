type MeanwhileListProps = {
  items: Array<{ title: string; text: string }>;
};

/** Three things that work with any tool, under rules of Encre, like « Comment ça marche » of m7 without numbers. */
export const MeanwhileList = ({ items }: MeanwhileListProps) => (
  <ul className="mt-6 grid gap-6 desktop:mt-7 desktop:grid-cols-3 desktop:gap-7">
    {items.map((item) => (
      <li key={item.title} className="flex flex-col gap-3 border-t border-ink-900 pt-5">
        <h3 className="font-serif text-quote font-medium">{item.title}</h3>
        <p className="text-body text-slate-600">{item.text}</p>
      </li>
    ))}
  </ul>
);
