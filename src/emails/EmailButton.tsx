import { Button, Link, Text } from "react-email";
import { buttonStyle, fallbackStyle, linkStyle } from "./email-styles";

type EmailButtonProps = {
  href: string;
  label: string;
};

export const EmailButton = ({ href, label }: EmailButtonProps) => (
  <>
    <Button className="email-button" href={href} style={buttonStyle}>
      {label}
    </Button>
    <Text style={fallbackStyle}>
      Le bouton ne s&apos;affiche pas ? Ouvrez ce lien :{" "}
      <Link href={href} style={linkStyle}>
        {href}
      </Link>
    </Text>
  </>
);
