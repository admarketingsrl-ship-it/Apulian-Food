import React from 'react';
import { X, Clock, Users, Plus, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Recipe } from '../data/recipes';
import { Product, CartItem } from '../data/products';
import { BOX_LIMITS } from '../data/shipping';
import { FALLBACK_FOOD_IMAGE } from '../data/assets';

interface RecipeModalProps {
  recipe: Recipe | null;
  products: Product[];
  cart: CartItem[];
  currentTotalWeight: number;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddAllRecipeProducts: (productsToAdd: Product[]) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  products,
  cart,
  currentTotalWeight,
  onClose,
  onAddToCart,
  onAddAllRecipeProducts,
}) => {
  if (!recipe) return null;

  // Find the actual product objects matching recipe.boxProductIds
  const recipeProducts = recipe.boxProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  // Check which products are already in the cart
  const cartProductIds = new Set(cart.map((item) => item.product.id));
  const missingProducts = recipeProducts.filter((p) => !cartProductIds.has(p.id));

  // Compute weight and price for missing products
  const missingWeight = missingProducts.reduce((sum, p) => sum + p.weightKg, 0);
  const missingPrice = missingProducts.reduce((sum, p) => sum + p.price, 0);
  const wouldExceedWeight = currentTotalWeight + missingWeight > BOX_LIMITS.maxWeightKg;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#faf8f5] rounded-2xl shadow-2xl border border-[#e7e2d8] overflow-hidden animate-in fade-in zoom-in-98 duration-150 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-stone-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-16/9 w-full bg-[#f3efe8] overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_FOOD_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-200 block mb-1">
              {recipe.categoryLabel}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-tight">
              {recipe.title}
            </h3>
          </div>
        </div>

        {/* Recipe Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-stone-700">
          {/* Metadata bar */}
          <div className="flex items-center gap-4 text-stone-500 font-light border-b border-[#e7e2d8] pb-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 stroke-[1.5]" />
              {recipe.timeMinutes} minuti
            </span>
            <span className="text-stone-300">·</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 stroke-[1.5]" />
              {recipe.servings}
            </span>
            <span className="text-stone-300">·</span>
            <span>Difficoltà: <strong className="font-medium text-stone-800">{recipe.difficulty}</strong></span>
          </div>

          {/* Story / Backstory */}
          <p className="text-stone-600 font-light leading-relaxed text-[13px]">
            {recipe.story}
          </p>

          {/* Box Ingredients Section */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#e7e2d8] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 font-medium block">
                  Ingredienti del Pacco Pugliese
                </span>
                <span className="text-stone-500 font-light text-[11px]">
                  Prodotti della nostra dispensa necessari per questa ricetta
                </span>
              </div>

              {missingProducts.length > 0 && (
                <button
                  type="button"
                  onClick={() => onAddAllRecipeProducts(missingProducts)}
                  disabled={wouldExceedWeight}
                  className="px-3.5 py-1.5 bg-[#1a1816] hover:bg-[#332f2b] text-white rounded-full text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
                >
                  + Aggiungi tutti ({missingProducts.length}) al Pacco (€{missingPrice.toFixed(2)})
                </button>
              )}
            </div>

            <div className="space-y-2 pt-1">
              {recipeProducts.map((p) => {
                const inCart = cartProductIds.has(p.id);
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-2 border-b border-stone-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-8 h-8 rounded-lg object-cover border border-stone-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-medium text-stone-900 block">{p.name}</span>
                        <span className="text-stone-400 text-[10px]">{p.origin} · {p.weightKg.toFixed(2)} kg</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif text-sm font-medium text-stone-900">
                        €{p.price.toFixed(2)}
                      </span>

                      {inCart ? (
                        <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Già nel Pacco
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAddToCart(p)}
                          disabled={currentTotalWeight + p.weightKg > BOX_LIMITS.maxWeightKg}
                          className="px-2.5 py-1 text-[11px] border border-stone-300 rounded-lg text-stone-800 hover:border-black transition-colors cursor-pointer disabled:opacity-30"
                        >
                          + Aggiungi
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {recipe.otherIngredients.length > 0 && (
              <div className="pt-2 text-[11px] text-stone-400 font-light border-t border-stone-100">
                <span className="text-stone-500 font-medium">Altri ingredienti di base (dalla tua cucina): </span>
                <span>{recipe.otherIngredients.join(', ')}.</span>
              </div>
            )}
          </div>

          {/* Preparation Steps */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 font-medium block">
              Preparazione Passo dopo Passo
            </span>

            <ol className="space-y-2.5 font-light leading-relaxed pl-1">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="font-mono text-stone-400 font-medium shrink-0 pt-0.5">
                    {idx + 1}.
                  </span>
                  <span className="text-stone-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Chef / Nonna Tip */}
          {recipe.chefTip && (
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1">
              <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 font-medium block">
                Il Segreto della Tradizione Pugliese
              </span>
              <p className="text-stone-600 font-light italic leading-relaxed">
                "{recipe.chefTip}"
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-[#e7e2d8] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-stone-600 hover:text-black font-medium transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
