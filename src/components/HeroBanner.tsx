import React from 'react';
import { ArrowDown, Package, Scale, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  onScrollToCatalog: () => void;
  onOpenCart: () => void;
  onScrollToPreconfiguredBoxes?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onScrollToCatalog,
  onOpenCart,
  onScrollToPreconfiguredBoxes,
}) => {
  return (
    <div className="relative py-12 md:py-16 border-b border-[#e5e0d8]">
      <div className="max-w-4xl">
        <div className="text-[11px] uppercase tracking-[0.22em] text-stone-500 font-medium mb-4 flex items-center gap-2">
          <span>Selezione Enogastronomica Pugliese</span>
          <span className="text-stone-300">·</span>
          <span>Spedizioni a Lunga Distanza</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.12] text-[#1a1816] tracking-tight mb-5">
          Il tuo <span className="italic font-normal">Pacco da Giù</span>, <br />
          confezionato su misura.
        </h1>

        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed max-w-2xl mb-10">
          I sapori autentici di Puglia selezionati per resistere al viaggio postale verso l'Italia, la Francia e l'Europa: taralli artigianali e friselle leggere, orecchiette essiccate al bronzo, salumi e formaggi nobili sottovuoto, conserve d'autore e olio extravergine in latta salvagusto.
        </p>

        {/* 3 Criteria: Minimal Editorial Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#e7e2d8] mb-10 text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 block mb-1">
              Dimensioni Standard
            </span>
            <span className="font-serif text-lg font-normal text-[#1a1816] block">
              50 × 50 × 50 cm
            </span>
            <span className="text-stone-500 font-light text-[11px]">
              Scatola rinforzata tripla onda (125L)
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 block mb-1">
              Limite di Peso
            </span>
            <span className="font-serif text-lg font-normal text-[#1a1816] block">
              Max 15,00 kg
            </span>
            <span className="text-stone-500 font-light text-[11px]">
              Tariffa calcolata al grammo in tempo reale
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 block mb-1">
              Soglia d'Ordine
            </span>
            <span className="font-serif text-lg font-normal text-[#1a1816] block">
              Minimo €50,00
            </span>
            <span className="text-stone-500 font-light text-[11px]">
              Per garantire imballaggio isotermico
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {onScrollToPreconfiguredBoxes && (
            <button
              onClick={onScrollToPreconfiguredBoxes}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a1816] hover:bg-[#332f2b] text-white text-xs font-medium tracking-wide transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <Package className="w-3.5 h-3.5 stroke-[1.8] text-amber-300" />
              <span>Confezioni Pronte (3 Fasce)</span>
            </button>
          )}

          <button
            onClick={onScrollToCatalog}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-800 hover:bg-stone-100 text-[#1a1816] text-xs font-medium tracking-wide transition-all cursor-pointer bg-white"
          >
            <span>Componi Pacco da Zero</span>
            <ArrowDown className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>

          <button
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-stone-200 hover:border-stone-400 text-stone-600 hover:text-black text-xs font-medium tracking-wide transition-all cursor-pointer bg-transparent"
          >
            <span>Vedi Pacco in Preparazione</span>
          </button>
        </div>
      </div>
    </div>
  );
};
