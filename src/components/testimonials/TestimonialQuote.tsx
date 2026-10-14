import { quoteInFrench } from "@/lib/french/typography";
import { cn } from "@/lib/cn";

type TestimonialQuoteProps = {
  text: string;
  size: "quote" | "body";
  isClamped?: boolean;
  className?: string;
};

export const TestimonialQuote = ({ text, size, isClamped = false, className }: TestimonialQuoteProps) => (
  <blockquote
    className={cn(
      "max-w-quote whitespace-pre-line text-ink",
      size === "quote" ? "text-quote" : "text-body",
      isClamped && "line-clamp-2",
      className,
    )}
  >
    {quoteInFrench(text)}
  </blockquote>
);
