"use client"
import * as React from "react"
import { Leaf, Cigarette, Layers, ChevronDown } from "lucide-react"
import { HighlightCard, ProductRow } from "@/components/cards/ProductCards"
import { triggerHaptic } from "@/lib/utils"
import { TranslationDictionary } from "@/lib/translations"

interface ProductGridProps {
  buds: any[];
  joints: any[];
  accessories: any[];
  openSections: string[];
  toggleSection: (id: string) => void;
  t: TranslationDictionary;
  onSelect: (product: any) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  buds,
  joints,
  accessories,
  openSections,
  toggleSection,
  t,
  onSelect,
}) => {
  return (
    <main className="max-w-5xl mx-auto space-y-8 relative z-10">
      {/* BUDS & JOINTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buds.length > 0 && (
          <section className="flex flex-col h-full space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Leaf size={20} className="text-brand-secondary" />
              <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">Buds</h2>
            </div>
            <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-brand-primary h-full">
              {buds.map((p: any) => (
                <ProductRow key={p.id} p={p} onClick={() => onSelect(p)} />
              ))}
            </div>
          </section>
        )}

        {joints.length > 0 && (
          <section className="flex flex-col h-full space-y-3">
            <button
              onClick={() => toggleSection('joints')}
              className="w-full flex items-center justify-between px-1 active:bg-white/5 transition-colors md:cursor-default rounded-xl"
            >
              <div className="flex items-center gap-2">
                <Cigarette size={20} className="text-brand-secondary" />
                <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">Joints</h2>
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <span className="text-[11px] font-black uppercase tracking-wide opacity-40 text-brand-light">
                  {openSections.includes('joints') ? t.close : t.open}
                </span>
                <ChevronDown size={18} className={`opacity-40 transition-transform duration-300 ${openSections.includes('joints') ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 md:max-h-none ${openSections.includes('joints') ? 'max-h-[3000px]' : 'max-h-0 md:max-h-[3000px]'}`}>
              <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-brand-primary h-full">
                {joints.map((p: any) => (
                  <ProductRow key={p.id} p={p} onClick={() => onSelect(p)} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ACCESSORIES GRID */}
      {accessories.length > 0 && (
        <section className="w-full space-y-3">
          <button
            onClick={() => toggleSection('accessories')}
            className="w-full flex items-center justify-between px-1 active:bg-white/5 transition-colors rounded-xl"
          >
            <div className="flex items-center gap-2">
              <Layers size={20} className="text-brand-secondary" />
              <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">{t.accessories}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wide opacity-40 text-brand-light">
                {openSections.includes('accessories') ? t.close : t.open}
              </span>
              <ChevronDown size={18} className={`opacity-40 transition-transform duration-300 ${openSections.includes('accessories') ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <div className={`overflow-hidden transition-all duration-500 ${openSections.includes('accessories') ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {accessories.map((p: any) => (
                <HighlightCard key={p.id} item={p} onClick={() => onSelect(p)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
