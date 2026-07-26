"use client"
import * as React from "react"
import { Leaf, Cigarette, Layers, ChevronDown, Tag } from "lucide-react"
import { HighlightCard, ProductRow } from "@/components/cards/ProductCards"
import { TranslationDictionary } from "@/lib/translations"

interface CategoryConfig {
  title: string;
  icon: React.ReactNode;
  layout: "list" | "grid2" | "grid4";
  collapsible?: boolean;
}

function getCategoryConfig(category: string, t: TranslationDictionary): CategoryConfig {
  const configs: Record<string, CategoryConfig> = {
    buds: {
      title: "Buds",
      icon: <Leaf size={20} className="text-brand-secondary" />,
      layout: "list",
      collapsible: false,
    },
    joints: {
      title: "Joints",
      icon: <Cigarette size={20} className="text-brand-secondary" />,
      layout: "list",
      collapsible: true,
    },
    accessories: {
      title: t.accessories,
      icon: <Layers size={20} className="text-brand-secondary" />,
      layout: "grid4",
      collapsible: true,
    },
  };

  return configs[category] || {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    icon: <Tag size={20} className="text-brand-secondary" />,
    layout: "grid2",
    collapsible: true,
  };
}

function gridClass(layout: "list" | "grid2" | "grid4"): string {
  switch (layout) {
    case "list": return "grid-cols-1";
    case "grid2": return "grid-cols-2 md:grid-cols-3 gap-3";
    case "grid4": return "grid-cols-2 md:grid-cols-4 gap-3";
  }
}

function isList(layout: "list" | "grid2" | "grid4"): boolean {
  return layout === "list";
}

interface ProductGridProps {
  categories: Record<string, any[]>;
  openSections: string[];
  toggleSection: (id: string) => void;
  t: TranslationDictionary;
  onSelect: (product: any) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  categories,
  openSections,
  toggleSection,
  t,
  onSelect,
}) => {
  const priorityOrder = ["buds", "joints"];
  const accessoryKey = "accessories";

  const sortedKeys = Object.keys(categories).sort((a, b) => {
    if (a === accessoryKey) return 1;
    if (b === accessoryKey) return -1;
    const aIdx = priorityOrder.indexOf(a);
    const bIdx = priorityOrder.indexOf(b);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.localeCompare(b);
  });

  const specialListKeys = priorityOrder.filter(k => categories[k]?.length > 0);
  const restKeys = sortedKeys.filter(k => !priorityOrder.includes(k));

  return (
    <main className="max-w-5xl mx-auto space-y-8 relative z-10">
      {specialListKeys.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialListKeys.map(cat => {
            const config = getCategoryConfig(cat, t);
            const products = categories[cat];
            const isOpen = openSections.includes(cat);

            return (
              <section key={cat} className="flex flex-col h-full space-y-3">
                {config.collapsible ? (
                  <button
                    onClick={() => toggleSection(cat)}
                    className="w-full flex items-center justify-between px-1 active:bg-white/5 transition-colors md:cursor-default rounded-badge"
                  >
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">{config.title}</h2>
                    </div>
                    <div className="flex items-center gap-2 md:hidden">
                      <span className="text-[11px] font-black uppercase tracking-wide opacity-40 text-brand-light">
                        {isOpen ? t.close : t.open}
                      </span>
                      <ChevronDown size={18} className={`opacity-40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-1">
                    {config.icon}
                    <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">{config.title}</h2>
                  </div>
                )}

                <div className={`overflow-hidden transition-all duration-500 ${config.collapsible && !isOpen ? 'max-h-0 md:max-h-[3000px]' : 'max-h-[3000px]'}`}>
                  <div className={`rounded-card overflow-hidden border border-white/10 bg-brand-primary h-full ${!isList(config.layout) ? 'p-3 ' + gridClass(config.layout) : ''}`}>
                    {products.map((p: any) => (
                      isList(config.layout)
                        ? <ProductRow key={p.id} p={p} onClick={() => onSelect(p)} />
                        : <HighlightCard key={p.id} item={p} onClick={() => onSelect(p)} />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {restKeys.map(cat => {
        const config = getCategoryConfig(cat, t);
        const products = categories[cat];
        const isOpen = openSections.includes(cat);

        return (
          <section key={cat} className="w-full space-y-3">
            <button
              onClick={() => toggleSection(cat)}
              className="w-full flex items-center justify-between px-1 active:bg-white/5 transition-colors rounded-badge"
            >
              <div className="flex items-center gap-2">
                {config.icon}
                <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">{config.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wide opacity-40 text-brand-light">
                  {isOpen ? t.close : t.open}
                </span>
                <ChevronDown size={18} className={`opacity-40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className={gridClass(config.layout)}>
                {products.map((p: any) => (
                  <HighlightCard key={p.id} item={p} onClick={() => onSelect(p)} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
};
