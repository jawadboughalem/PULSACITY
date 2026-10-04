type JsonLdProps = {
  data: Record<string, unknown>;
};

/** Structured data for search engines. « < » is escaped so that a text can never close the script. */
export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
  />
);
