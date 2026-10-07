import React, { useState } from 'react';
import { Package, Sparkles, Check, ArrowRight, ShieldCheck, Scale, Info, CheckCircle2 } from 'lucide-react';
import { Product, CartItem } from '../data/products';
import { BOX_LIMITS } from '../data/shipping';
import { FALLBACK_FOOD_IMAGE } from '../data/assets';
import {
  PreconfiguredBox,
  PRECONFIGURED_BOXES,
  resolvePreconfiguredBoxDetails,
} from '../data/preconfiguredBoxes';

interface PreconfiguredBoxesWidgetProps {
  products: Product[];
  currentCart: CartItem[];
  onLoadBox: (boxItems: { product: Product; quantity: number }[], boxTitle: string) => void;
  onOpenCart?: () => void;
}

export const PreconfiguredBoxesWidget: React.FC<PreconfiguredBoxesWidgetProps> = ({
  products,
  onLoadBox,
  onOpenCart,
}) => {
  const [selectedBoxId, setSelectedBoxId] = useState<string>('box-classico');
  const [inspectModalBox, setInspectModalBox] = useState<PreconfiguredBox | null>(null);

  const activeBox =
    PRECONFIGURED_BOXES.find((b) => b.id === selectedBoxId) || PRECONFIGURED_BOXES[1];

  const activeDetails = resolvePreconfiguredBoxDetails(activeBox, products);

  return (
    <div id="confezioni-pronte" className="space-y-6">
      {/* Widget Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e7e2d8] pb-5">
        <div>
          <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-[0.2em] font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Pacco Già Pronto all'Uso</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
            Le Confezioni Pronte di Puglia
          </h2>
          <p className="text-stone-500 font-light text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Non sai da dove iniziare? Scegli una delle nostre tre selezioni studiate dai mastri pugliesi:
            bilanciate al grammo per viaggiare sicure nella scatola standard 50×50×50 cm, con 3 fasce di spesa chiare.
          </p>
        </div>

        {/* Quick price tier pills indicator */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200/80 shadow-2xs self-start sm:self-auto">
          {PRECONFIGURED_BOXES.map((box) => {
            const isSelected = box.id === selectedBoxId;
            return (
              <button
                key={box.id}
                onClick={() => setSelectedBoxId(box.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1c1a17] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-black hover:bg-stone-50'
                }`}
              >
                <div className="leading-tight">
                  <span className="hidden sm:inline">{box.title.replace('Pacco ', '')}</span>
                  <span className="sm:hidden">{box.tier === 'essential' ? 'Base' : box.tier === 'classic' ? 'Medio' : 'Top'}</span>
                  <span className="text-[10px] opacity-75 ml-1.5 font-mono">({box.targetPriceRange})</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PRECONFIGURED_BOXES.map((box) => {
          const isSelected = box.id === selectedBoxId;
          const details = resolvePreconfiguredBoxDetails(box, products);

          return (
            <div
              key={box.id}
              onClick={() => setSelectedBoxId(box.id)}
              className={`relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
                isSelected
                  ? 'border-black ring-1 ring-black bg-white shadow-md'
                  : 'border-[#e7e2d8] bg-white/70 hover:bg-white hover:border-stone-300 shadow-2xs'
              }`}
            >
              {/* Badge for tier */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                      box.tier === 'essential'
                        ? 'bg-amber-100/80 text-amber-900 border border-amber-200/70'
                        : box.tier === 'classic'
                        ? 'bg-emerald-100/80 text-emerald-900 border border-emerald-200/70'
                        : 'bg-stone-900 text-amber-200 border border-stone-800'
                    }`}
                  >
                    {box.badge}
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">
                    {box.items.reduce((s, i) => s + i.quantity, 0)} specialità
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="font-serif text-xl text-stone-900 font-normal">
                    {box.title}
                  </h3>
                </div>
                <div className="text-[11px] text-stone-400 font-medium uppercase tracking-wider mb-2">
                  {box.subtitle}
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 my-2">
                  <span className="font-serif text-2xl sm:text-3xl text-stone-900 font-semibold">
                    €{details.totalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-stone-400 font-light">
                    / pacco 50×50×50
                  </span>
                </div>

                {/* Weight & Volume Specs */}
                <div className="flex items-center gap-3 py-2 px-3 bg-[#faf8f5] rounded-xl border border-stone-200/70 text-[11px] text-stone-600 my-3">
                  <div className="flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-stone-500" />
                    <span>
                      Peso: <strong className="text-stone-900 font-mono">{details.totalWeightKg.toFixed(2)} kg</strong>
                    </span>
                  </div>
                  <span className="text-stone-300">•</span>
                  <div className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-stone-500" />
                    <span>
                      Scatola: <strong className="text-stone-900">50 cm³</strong>
                    </span>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-xs text-stone-600 font-light leading-relaxed mb-4 min-h-[40px]">
                  {box.tagline}
                </p>
              </div>

              {/* Card Image preview & Mini product pills */}
              <div className="px-5 pb-5 pt-0 mt-auto space-y-4">
                <div className="relative h-32 rounded-xl overflow-hidden border border-stone-200/80 bg-stone-100 group">
                  <img
                    src={box.image}
                    alt={box.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_FOOD_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] text-white/95 font-medium line-clamp-1">
                      Ideale per: {box.bestFor}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadBox(details.resolvedItems, box.title);
                      if (onOpenCart) onOpenCart();
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-xs ${
                      isSelected
                        ? 'bg-[#1c1a17] hover:bg-[#332f2b] text-white'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Carica questo Pacco nel Carrello</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectModalBox(box);
                    }}
                    className="w-full py-1.5 text-[11px] text-stone-500 hover:text-stone-900 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3 h-3" />
                    <span>Vedi la lista completa degli ingredienti</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail inspection bar for the selected Box */}
      <div className="bg-white rounded-2xl border border-[#e7e2d8] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-stone-200/80 pb-4 mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold mb-0.5">
              Riepilogo Confezione Selezionata
            </div>
            <h4 className="font-serif text-lg sm:text-xl text-stone-900">
              {activeBox.title} — {activeDetails.resolvedItems.length} referenze pugliesi
            </h4>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              {activeBox.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-stone-400">Prezzo pacco completo</div>
              <div className="font-serif text-2xl font-bold text-stone-900">
                €{activeDetails.totalPrice.toFixed(2)}
              </div>
            </div>

            <button
              onClick={() => {
                onLoadBox(activeDetails.resolvedItems, activeBox.title);
                if (onOpenCart) onOpenCart();
              }}
              className="py-2.5 px-5 bg-[#1c1a17] hover:bg-[#332f2b] text-white text-xs font-medium rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <span>Usa questo Pacco</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal item chip scroll */}
        <div className="space-y-2">
          <div className="text-[11px] font-medium text-stone-700 flex items-center justify-between">
            <span>Specialità incluse nel {activeBox.title}:</span>
            <span className="text-stone-400 font-mono text-[10px]">
              {activeDetails.totalWeightKg.toFixed(2)} / {BOX_LIMITS.maxWeightKg} kg max
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {activeDetails.resolvedItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="p-2.5 rounded-xl bg-[#faf8f5] border border-stone-200/80 flex items-center gap-2.5"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_FOOD_IMAGE;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-stone-900 truncate" title={product.name}>
                    {product.name}
                  </div>
                  <div className="text-[10px] text-stone-500 flex items-center justify-between mt-0.5">
                    <span className="font-mono text-stone-700 font-semibold">{quantity}x</span>
                    <span>€{(product.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal inspect list */}
      {inspectModalBox && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-[#faf8f5] rounded-2xl shadow-2xl border border-[#e7e2d8] overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-[#e7e2d8] flex items-center justify-between bg-white">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  Dettaglio Confezione
                </span>
                <h3 className="font-serif text-xl font-normal text-stone-900">
                  {inspectModalBox.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectModalBox(null)}
                className="p-1 text-stone-400 hover:text-black transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {(() => {
                const details = resolvePreconfiguredBoxDetails(inspectModalBox, products);
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-stone-200 text-xs">
                      <div>
                        <div className="text-stone-400 text-[10px] uppercase">Totale Box</div>
                        <div className="font-serif text-xl font-bold text-stone-900">
                          €{details.totalPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-stone-400 text-[10px] uppercase">Peso e Volume</div>
                        <div className="font-mono text-stone-700 font-medium">
                          {details.totalWeightKg.toFixed(2)} kg • {details.totalVolumeLiters.toFixed(1)} L
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-stone-700">Prodotti contenuti:</div>
                      <div className="divide-y divide-stone-200/70 border border-stone-200 rounded-xl bg-white overflow-hidden">
                        {details.resolvedItems.map(({ product, quantity }) => (
                          <div key={product.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = FALLBACK_FOOD_IMAGE;
                                }}
                              />
                              <div className="min-w-0">
                                <div className="font-medium text-stone-900 truncate max-w-xs">{product.name}</div>
                                <div className="text-[10px] text-stone-400 font-light">{product.origin}</div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-mono text-stone-800 font-bold">{quantity} pz</span>
                              <div className="text-[11px] text-stone-600">€{(product.price * quantity).toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        onClick={() => setInspectModalBox(null)}
                        className="flex-1 py-2.5 border border-stone-200 bg-white hover:bg-stone-50 rounded-xl text-xs font-medium text-stone-700 transition-colors cursor-pointer"
                      >
                        Chiudi
                      </button>
                      <button
                        onClick={() => {
                          onLoadBox(details.resolvedItems, inspectModalBox.title);
                          setInspectModalBox(null);
                          if (onOpenCart) onOpenCart();
                        }}
                        className="flex-2 py-2.5 bg-[#1c1a17] hover:bg-[#332f2b] text-white rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Carica questo Pacco</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
