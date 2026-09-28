import type { CSSProperties } from "react";

export const EMAIL_COLORS = {
  carmine: "#A3243B",
  ink900: "#16213E",
  slate600: "#5A5F6E",
  gray400: "#7E8390",
  hairline200: "#D8D9DD",
  paper100: "#F3F3F0",
  white: "#FFFFFF",
  attention: "#8A5300",
  attentionSurface: "#FFF4DB",
} as const;

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

export const EMAIL_MOBILE_STYLES = `
@media (max-width: 600px) {
  .email-card { padding: 24px !important; }
  .email-legal { padding: 0 24px !important; }
  .email-button { display: block !important; padding-top: 14px !important; padding-bottom: 14px !important; text-align: center !important; }
}
`;

export const pageStyle: CSSProperties = {
  margin: 0,
  padding: "32px 0",
  backgroundColor: EMAIL_COLORS.paper100,
  color: EMAIL_COLORS.ink900,
  fontFamily: SANS,
};

export const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  boxSizing: "border-box",
  padding: "48px",
  backgroundColor: EMAIL_COLORS.white,
  border: `1px solid ${EMAIL_COLORS.hairline200}`,
};

export const headerStyle: CSSProperties = {
  margin: "0 0 24px",
  paddingBottom: "24px",
  borderBottom: `1px solid ${EMAIL_COLORS.hairline200}`,
  fontFamily: SANS,
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: 600,
};

export const paragraphStyle: CSSProperties = {
  margin: "0 0 16px",
  fontFamily: SERIF,
  fontSize: "16px",
  lineHeight: "24px",
  color: EMAIL_COLORS.ink900,
};

export const quoteStyle: CSSProperties = {
  margin: "0 0 12px",
  fontFamily: SERIF,
  fontSize: "20px",
  lineHeight: "28px",
  color: EMAIL_COLORS.ink900,
};

export const smallStyle: CSSProperties = {
  margin: 0,
  fontFamily: SANS,
  fontSize: "14px",
  lineHeight: "20px",
  color: EMAIL_COLORS.slate600,
};

export const buttonStyle: CSSProperties = {
  display: "inline-block",
  padding: "12px 28px",
  borderRadius: "16px",
  border: `2px solid ${EMAIL_COLORS.ink900}`,
  backgroundColor: EMAIL_COLORS.carmine,
  color: EMAIL_COLORS.white,
  fontFamily: SANS,
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: 600,
  textDecoration: "none",
};

export const fallbackStyle: CSSProperties = {
  margin: "12px 0 24px",
  fontFamily: SANS,
  fontSize: "12px",
  lineHeight: "16px",
  color: EMAIL_COLORS.slate600,
};

export const linkStyle: CSSProperties = {
  color: EMAIL_COLORS.carmine,
};

export const legalStyle: CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  boxSizing: "border-box",
  margin: "24px auto 0",
  padding: "0 48px",
  fontFamily: SANS,
  fontSize: "12px",
  lineHeight: "16px",
  color: EMAIL_COLORS.slate600,
};
