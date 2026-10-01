type TestimonialText = {
  body: string;
  displayBody: string | null;
};

export const getDisplayedBody = ({ body, displayBody }: TestimonialText): string => displayBody ?? body;
