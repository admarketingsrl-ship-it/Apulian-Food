import React from 'react';
import { Plus, Minus, Eye, Check } from 'lucide-react';
import { Product } from '../data/products';
import { BOX_LIMITS } from '../data/shipping';

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

  return (
    <div className="bg-white rounded-xl border border-[#e7e2d8] hover:border-stone-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full bg-[#f3efe8] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Quick view button (Quiet glass circle) */}
        <button
          onClick={() => onOpenDetails(product)}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-black flex items-center justify-center shadow-xs transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
          title="Dettagli"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Provenance & Weight metadata */}
          <div className="text-[11px] text-stone-400 font-light flex items-center gap-1.5 mb-1">
            <span>{product.origin}</span>
            <span>·</span>
            <span className="font-mono">{product.weightKg.toFixed(2)} kg</span>
          </div>

          <h3 className="font-normal text-stone-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-black transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 font-light line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>

          {/* Travel note */}
          {product.travelResistantNote && (
            <p className="text-[11px] text-stone-600 font-light italic mb-3">
              "{product.travelResistantNote}"
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="font-serif text-lg font-medium text-stone-900">
              €{product.price.toFixed(2)}
            </span>
          </div>

          {quantityInCart > 0 ? (
            <div className="flex items-center gap-2 border border-stone-300 rounded-lg p-0.5">
              <button
                onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer text-xs"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-mono text-xs font-medium px-1 text-stone-900">
                {quantityInCart}
              </span>
              <button
                onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                disabled={wouldExceedWeight}
                className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer text-xs disabled:opacity-30"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              disabled={wouldExceedWeight}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
                wouldExceedWeight
                  ? 'border border-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-[#1a1816] hover:bg-[#332f2b] text-white active:scale-95'
              }`}
            >
              + Nel Pacco
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
