type Attributes = Record<string, string | number | boolean | null | undefined>;

type Child = Node | string | null | undefined | false;

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const setAttributes = (element: Element, attributes: Attributes | null) => {
  if (!attributes) return;
  for (const [name, value] of Object.entries(attributes)) {
    if (value === null || value === undefined || value === false) continue;
    element.setAttribute(name, value === true ? "" : String(value));
  }
};

/** Texts always go in as text nodes: a testimonial can never inject markup. */
const appendChildren = (element: Element, children: Child[]) => {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    element.append(child);
  }
};

export const h = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  attributes: Attributes | null = null,
  ...children: Child[]
): HTMLElementTagNameMap[Tag] => {
  const element = document.createElement(tag);
  setAttributes(element, attributes);
  appendChildren(element, children);
  return element;
};

export const svg = (tag: string, attributes: Attributes | null = null, ...children: Child[]): SVGElement => {
  const element = document.createElementNS(SVG_NAMESPACE, tag);
  setAttributes(element, attributes);
  appendChildren(element, children);
  return element;
};
