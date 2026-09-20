import Image from 'next/image';

/**
 * A phone around a real screenshot. Never a mockup with invented content — if there
 * is no capture, the caller renders nothing at all.
 */
export function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="border-line-strong bg-surface shadow-subtle rounded-[1.75rem] border p-2">
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
