import React, { useState } from 'react';
import { Plus, Minus, Eye, Check, AlertTriangle } from 'lucide-react';
import { Product } from '../data/products';
import { BOX_LIMITS } from '../data/shipping';
import { FALLBACK_FOOD_IMAGE } from '../data/assets';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  currentTotalWeight: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  currentTotalWeight,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails,
}) => {
  const wouldExceedWeight = currentTotalWeight + product.weightKg > BOX_LIMITS.maxWeightKg;
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    if (wouldExceedWeight) return;
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e7e2d8] hover:border-stone-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-2xs">
      {/* Product Image & Tap Area */}
      <div className="relative aspect-4/3 w-full bg-[#f3efe8] overflow-hidden cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_FOOD_IMAGE;
          }}
        />

        {/* Quick view button (visible on mobile, hover on desktop) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(product);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-black flex items-center justify-center shadow-xs transition-opacity cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
          title="Vedi dettagli prodotto"
          aria-label="Vedi dettagli"
        >
          <Eye className="w-4 h-4 stroke-[1.8]" />
        </button>

        {/* Weight tag on image for immediate visual awareness */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-mono">
          {product.weightKg.toFixed(2)} kg
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Provenance */}
          <div className="text-[11px] text-stone-400 font-light flex items-center gap-1.5 mb-1.5">
            <span className="truncate">{product.origin}</span>
            <span>·</span>
            <span className="text-stone-500 uppercase text-[9px] tracking-wider">{product.categoryLabel}</span>
          </div>

          <h3
            onClick={() => onOpenDetails(product)}
            className="font-normal text-stone-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-black transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 font-light line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>

          {/* Travel note */}
          {product.travelResistantNote && (
            <p className="text-[11px] text-stone-600 font-light italic mb-3 bg-[#faf8f5] p-2 rounded-lg border border-[#f0ece3]">
              "{product.travelResistantNote}"
            </p>
          )}
        </div>

        {/* Price & Action (Optimized touch targets for mobile) */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="font-serif text-lg sm:text-xl font-medium text-stone-900">
              €{product.price.toFixed(2)}
            </span>
          </div>

          {quantityInCart > 0 ? (
            /* Quantity Controller: Large touch buttons for mobile fingers */
            <div className="flex items-center gap-1.5 border border-stone-300 rounded-xl p-1 bg-stone-50">
              <button
                type="button"
                onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 bg-white hover:bg-stone-100 shadow-2xs active:scale-95 transition-all cursor-pointer text-sm font-semibold"
                aria-label="Rimuovi uno"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs sm:text-sm font-semibold px-2 text-stone-900 min-w-5 text-center">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                disabled={wouldExceedWeight}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 bg-white hover:bg-stone-100 shadow-2xs active:scale-95 transition-all cursor-pointer text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Aggiungi uno"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Add to Cart Button: Minimum 40px height for easy smartphone tapping */
            <button
              type="button"
              onClick={handleAdd}
              disabled={wouldExceedWeight}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                wouldExceedWeight
                  ? 'border border-stone-200 text-stone-400 cursor-not-allowed bg-stone-50'
                  : justAdded
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-[#1a1816] hover:bg-[#332f2b] text-white shadow-sm'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Aggiunto!</span>
                </>
              ) : wouldExceedWeight ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  <span>Max 15kg</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nel Pacco</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
