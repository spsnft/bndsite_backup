"use client"

import type { ComponentProps } from "react"
import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231A2F30'/%3E%3Ccircle cx='50' cy='42' r='14' fill='%23A88444' opacity='0.4'/%3E%3Cpath d='M30 70 C 35 55, 65 55, 70 70' stroke='%23A88444' stroke-width='4' fill='none' opacity='0.4'/%3E%3C/svg%3E";

interface BlurImageProps extends ComponentProps<typeof Image> {}

export function BlurImage({ className, alt, src, priority, ...props }: BlurImageProps) {
  const [isLoading, setLoading] = React.useState(!priority)
  const [imgSrc, setImgSrc] = React.useState<string>(() => {
    if (typeof src === 'string' && src.trim()) return src.trim();
    return FALLBACK_IMAGE;
  })

  React.useEffect(() => {
    if (typeof src === 'string' && src.trim()) {
      setImgSrc(src.trim());
    } else {
      setImgSrc(FALLBACK_IMAGE);
    }
    if (priority) setLoading(false);
  }, [src, priority])

  return (
    <div className={cn("relative w-full h-full overflow-hidden flex items-center justify-center", className)}>
      <Image
        {...props}
        src={imgSrc}
        alt={alt || ""}
        priority={priority}
        unoptimized
        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        className={cn(
          "duration-700 ease-in-out transition-all",
          isLoading ? "scale-105 blur-2xl opacity-0" : "scale-100 blur-0 opacity-100",
          className
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          if (imgSrc !== FALLBACK_IMAGE) {
            setImgSrc(FALLBACK_IMAGE);
          }
        }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/5 animate-pulse z-[-1]" />
      )}
    </div>
  )
}
