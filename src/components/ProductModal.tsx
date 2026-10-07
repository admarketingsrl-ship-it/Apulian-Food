import React from 'react';
import { X, Scale, Package, ShieldCheck } from 'lucide-react';
import { Product } from '../data/products';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#faf8f5] rounded-2xl shadow-xl border border-[#e7e2d8] overflow-hidden animate-in fade-in zoom-in-98 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-700 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>

        <div className="relative aspect-16/10 w-full bg-[#f3efe8] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#e7e2d8]">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
                {product.origin}
              </div>
              <h3 className="font-serif text-2xl font-normal text-stone-900 leading-snug">
                {product.name}
              </h3>
            </div>
            <div className="font-serif text-2xl font-medium text-stone-900 shrink-0">
              €{product.price.toFixed(2)}
            </div>
          </div>

          <p className="text-xs text-stone-600 font-light leading-relaxed">
            {product.description}
          </p>

          {/* Travel Note */}
          {product.travelResistantNote && (
            <div className="p-3 rounded-lg border border-stone-200 bg-white text-xs text-stone-700 font-light">
              <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 block font-medium mb-0.5">
                Resistenza per Spedizione Postale
              </span>
              <span>{product.travelResistantNote}</span>
            </div>
          )}

          {/* Specs */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-[#e7e2d8] text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Peso</span>
              <span className="font-mono text-stone-900 font-medium">{product.weightKg.toFixed(2)} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Volume</span>
              <span className="font-mono text-stone-900 font-medium">~{product.volumeLiters}L</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Imballo</span>
              <span className="text-stone-900 font-medium">Sigillato</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#e7e2d8] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-stone-500 hover:text-black font-medium transition-colors"
            >
              Chiudi
            </button>
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              disabled={!canAdd}
              className="px-5 py-2.5 bg-[#1a1816] hover:bg-[#332f2b] text-white text-xs font-medium rounded-full shadow-2xs transition-all disabled:opacity-30 cursor-pointer"
            >
              Aggiungi al Pacco (+{product.weightKg.toFixed(2)} kg)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
