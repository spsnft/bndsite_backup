"use client"
import * as React from "react"
import { HighlightCard, BadgeIcon } from "@/components/cards/ProductCards"

interface ProductCarouselProps {
  type: "NEW" | "SALE";
  title: string;
  products: any[];
  onSelect: (product: any) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ type, title, products, onSelect }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-3 overflow-hidden">
      <div className="flex items-center gap-2 px-1">
        <BadgeIcon type={type} />
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-brand-light/80">{title}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar md:mx-0 mx-[-1rem] px-4 md:px-0 snap-x">
        {products.map((p: any, idx: number) => (
          <div key={p?.id || idx} className="w-[160px] shrink-0 snap-start">
            <HighlightCard item={p} onClick={() => onSelect(p)} priority={idx < 4} />
          </div>
        ))}
      </div>
    </section>
  );
};
