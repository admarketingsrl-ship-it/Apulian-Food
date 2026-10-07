import React from 'react';
import { X, Scale, Package, ShieldCheck, Plus } from 'lucide-react';
import { Product } from '../data/products';
import { FALLBACK_FOOD_IMAGE } from '../data/assets';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  canAdd: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  canAdd,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-[#faf8f5] rounded-2xl shadow-2xl border border-[#e7e2d8] overflow-hidden my-6 animate-in fade-in zoom-in-98 duration-150 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          aria-label="Chiudi finestra"
        >
          <X className="w-4 h-4 stroke-[1.8]" />
        </button>

        <div className="relative aspect-16/10 w-full bg-[#f3efe8] overflow-hidden shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_FOOD_IMAGE;
            }}
          />
        </div>

        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#e7e2d8]">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
                {product.origin} · {product.categoryLabel}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 leading-snug">
                {product.name}
              </h3>
            </div>
            <div className="font-serif text-xl sm:text-2xl font-medium text-stone-900 shrink-0">
              €{product.price.toFixed(2)}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            {product.description}
          </p>

          {/* Travel Note */}
          {product.travelResistantNote && (
            <div className="p-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-700 font-light">
              <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 block font-medium mb-1">
                Resistenza nel Pacco 50×50×50
              </span>
              <span>{product.travelResistantNote}</span>
            </div>
          )}

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2.5 p-3 bg-white rounded-xl border border-[#e7e2d8] text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Peso Netto</span>
              <span className="font-mono text-stone-900 font-semibold">{product.weightKg.toFixed(2)} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Ingombro</span>
              <span className="font-mono text-stone-900 font-semibold">~{product.volumeLiters}L</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Imballaggio</span>
              <span className="text-stone-900 font-medium truncate block">Protetto</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#e7e2d8] flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-stone-500 hover:text-black font-medium transition-colors text-center order-2 sm:order-1 cursor-pointer"
            >
              Chiudi
            </button>
            <button
              type="button"
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              disabled={!canAdd}
              className="px-5 py-3 bg-[#1a1816] hover:bg-[#332f2b] text-white text-xs font-medium rounded-xl shadow-sm transition-all disabled:opacity-30 cursor-pointer flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi al Pacco (+{product.weightKg.toFixed(2)} kg)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
