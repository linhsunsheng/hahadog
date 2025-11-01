"use client"
import Image from "next/image";

export default function Avatar({ src, alt = "Dog avatar", size = 56 }: { src?: string | null; alt?: string; size?: number }) {
  const dim = `${size}px`;
  return (
    <div className="inline-flex items-center justify-center overflow-hidden rounded-full bg-yellow-200" style={{ width: dim, height: dim }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/hahadog.svg" alt={alt} className="h-full w-full object-cover" />
      )}
    </div>
  );
}
