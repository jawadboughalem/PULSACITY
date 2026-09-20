import Image from 'next/image';

/**
 * A phone around a real screenshot. Never a mockup with invented content — if
 * there is no capture, the caller renders its empty state instead.
 *
 * The frame is `line-strong`, not `line`: it has to read as the edge of a
 * device, which a 1.25:1 hairline does not. No shadow, no bezel, no perspective.
 */
export function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="border-line-strong bg-surface rounded-phone border p-2">
      <Image
        src={src}
        alt={alt}
        width={390}
        height={844}
        className="h-auto w-full rounded-[1.25rem]"
        sizes="(max-width: 640px) 70vw, 280px"
      />
    </div>
  );
}
