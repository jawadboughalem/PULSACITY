import type { CSSProperties } from "react";

/**
 * Charte v2, « E-mails » and « E-mails, ajouts » (3.6): the e-mails to the creator in PULSACITY's name. The welcome
 * e-mails are the first ones drawn in v2; the others follow with lot 4.8.
 */
export const CREATOR_EMAIL_COLORS = {
  ink: "#16213E",
  gray: "#565B6B",
  cloud: "#F4F8FF",
  white: "#FFFFFF",
  sun: "#FFBE3B",
  success: "#1A6B45",
  successSurface: "#DFF3E6",
} as const;

/** System fonts only: nothing to load. */
const SYSTEM_FONTS = "Helvetica, Arial, sans-serif";

/** On a phone: padding 24, the button over the whole width, 56 high. */
export const CREATOR_EMAIL_MOBILE_STYLES = `
@media (max-width: 600px) {
  .creator-email-card > tbody > tr > td { padding: 24px !important; }
  .creator-email-legal > tbody > tr > td { padding: 0 24px !important; }
  .creator-email-button { display: block !important; padding-top: 16px !important; padding-bottom: 16px !important; text-align: center !important; }
}
`;

export const creatorPageStyle: CSSProperties = {
  margin: 0,
  padding: "40px 0",
  backgroundColor: CREATOR_EMAIL_COLORS.cloud,
  color: CREATOR_EMAIL_COLORS.ink,
  fontFamily: SYSTEM_FONTS,
};

export const creatorCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  boxSizing: "border-box",
  padding: "40px",
  borderRadius: "20px",
  backgroundColor: CREATOR_EMAIL_COLORS.white,
};

export const creatorHeaderStyle: CSSProperties = { margin: "0 0 32px" };

export const creatorSymbolCellStyle: CSSProperties = { width: "32px", verticalAlign: "middle" };

export const creatorSymbolStyle: CSSProperties = { display: "block", width: "24px", height: "24px", border: 0 };

/** « PULSACITY » in text: readable when the images are blocked. */
export const creatorNameStyle: CSSProperties = {
  margin: 0,
  fontFamily: SYSTEM_FONTS,
  fontSize: "20px",
  lineHeight: "24px",
  fontWeight: 700,
  color: CREATOR_EMAIL_COLORS.ink,
};

export const creatorParagraphStyle: CSSProperties = {
  margin: "0 0 20px",
  fontFamily: SYSTEM_FONTS,
  fontSize: "16px",
  lineHeight: "24px",
  color: CREATOR_EMAIL_COLORS.ink,
};

/** The list of the three steps, on Nuage. */
export const stepsBoxStyle: CSSProperties = {
  width: "100%",
  margin: "0 0 24px",
  padding: "12px 20px",
  borderRadius: "16px",
  backgroundColor: CREATOR_EMAIL_COLORS.cloud,
};

export const stepMarkCellStyle: CSSProperties = { width: "36px", padding: "6px 0", verticalAlign: "middle" };

export const stepTextCellStyle: CSSProperties = {
  padding: "6px 0",
  verticalAlign: "middle",
  fontFamily: SYSTEM_FONTS,
  fontSize: "16px",
  lineHeight: "24px",
  color: CREATOR_EMAIL_COLORS.ink,
};

export const doneStepTextStyle: CSSProperties = { color: CREATOR_EMAIL_COLORS.gray };

const MARK_STYLE: CSSProperties = {
  width: "24px",
  height: "24px",
  boxSizing: "border-box",
  borderRadius: "12px",
  fontFamily: SYSTEM_FONTS,
  fontSize: "13px",
  lineHeight: "20px",
  fontWeight: 700,
  textAlign: "center",
};

/** A step to do: its number in a Gris ring. */
export const stepNumberStyle: CSSProperties = {
  ...MARK_STYLE,
  border: `2px solid ${CREATOR_EMAIL_COLORS.gray}`,
  color: CREATOR_EMAIL_COLORS.gray,
};

/** A step done: a tick, Pousse on Pousse fond. */
export const stepDoneStyle: CSSProperties = {
  ...MARK_STYLE,
  lineHeight: "24px",
  backgroundColor: CREATOR_EMAIL_COLORS.successSurface,
  color: CREATOR_EMAIL_COLORS.success,
};

/** Soleil, Encre text, 52 high, radius-full (square under Outlook). */
export const creatorButtonStyle: CSSProperties = {
  display: "inline-block",
  padding: "14px 28px",
  borderRadius: "9999px",
  backgroundColor: CREATOR_EMAIL_COLORS.sun,
  color: CREATOR_EMAIL_COLORS.ink,
  fontFamily: SYSTEM_FONTS,
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: 700,
  textDecoration: "none",
};

export const creatorSmallStyle: CSSProperties = {
  margin: "0 0 20px",
  fontFamily: SYSTEM_FONTS,
  fontSize: "14px",
  lineHeight: "20px",
  color: CREATOR_EMAIL_COLORS.gray,
};

export const creatorFallbackStyle: CSSProperties = { ...creatorSmallStyle, margin: "16px 0 24px" };

export const creatorLinkStyle: CSSProperties = { color: CREATOR_EMAIL_COLORS.ink, textDecoration: "underline" };

export const creatorLegalStyle: CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  boxSizing: "border-box",
  margin: "28px auto 0",
  padding: "0 40px",
  fontFamily: SYSTEM_FONTS,
  fontSize: "13px",
  lineHeight: "18px",
  color: CREATOR_EMAIL_COLORS.gray,
};

export const creatorLegalLineStyle: CSSProperties = {
  margin: "0 0 12px",
  fontFamily: SYSTEM_FONTS,
  fontSize: "13px",
  lineHeight: "18px",
  color: CREATOR_EMAIL_COLORS.gray,
};
