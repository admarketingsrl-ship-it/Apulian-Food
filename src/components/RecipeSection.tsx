import React, { useState } from 'react';
import { Clock, Users, ArrowRight, Check, Plus, UtensilsCrossed } from 'lucide-react';
import { Recipe, RECIPES } from '../data/recipes';
import { Product, CartItem } from '../data/products';
import { BOX_LIMITS } from '../data/shipping';
import { FALLBACK_FOOD_IMAGE } from '../data/assets';

interface RecipeSectionProps {
  products: Product[];
  cart: CartItem[];
  currentTotalWeight: number;
  onOpenRecipe: (recipe: Recipe) => void;
  onAddAllRecipeProducts: (productsToAdd: Product[]) => void;
}

const RECIPE_CATEGORIES = [
  { id: 'all', label: 'Tutte le Ricette' },
  { id: 'primi', label: 'Primi Piatti' },
  { id: 'aperitivi', label: 'Aperitivi & Antipasti' },
  { id: 'taglieri', label: 'Taglieri & Sfizi' },
  { id: 'dolci', label: 'Dolci Tipici' },
];

export const RecipeSection: React.FC<RecipeSectionProps> = ({
  products,
  cart,
  currentTotalWeight,
  onOpenRecipe,
  onAddAllRecipeProducts,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const cartProductIds = new Set(cart.map((item) => item.product.id));

  const filteredRecipes = RECIPES.filter((r) => {
    if (activeCategory !== 'all' && r.category !== activeCategory) {
      return false;
    }
    return true;
  });

  return (
    <div id="sezione-ricette" className="space-y-8 pt-6 border-t border-[#e7e2d8]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e7e2d8]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
            Ricettario Tradizionale
          </div>
          <h2 className="font-serif text-3xl font-normal text-[#1a1816]">
            Cosa Cucinare con il tuo Pacco
          </h2>
          <p className="text-xs text-stone-500 font-light mt-1 max-w-xl">
            Ricette autentiche pugliesi pensate per essere preparate facilmente a casa o all'estero con le eccellenze che hai scelto nella tua scatola.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto pb-1 scrollbar-none text-xs">
          {RECIPE_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`pb-2 transition-colors shrink-0 cursor-pointer relative ${
                  isSelected
                    ? 'text-black font-medium'
                    : 'text-stone-400 hover:text-black font-light'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-black" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRecipes.map((recipe) => {
          // Resolve product objects
          const recipeProducts = recipe.boxProductIds
            .map((id) => products.find((p) => p.id === id))
            .filter((p): p is Product => p !== undefined);

          const missingProducts = recipeProducts.filter((p) => !cartProductIds.has(p.id));
          const missingWeight = missingProducts.reduce((sum, p) => sum + p.weightKg, 0);
          const missingPrice = missingProducts.reduce((sum, p) => sum + p.price, 0);
          const wouldExceedWeight = currentTotalWeight + missingWeight > BOX_LIMITS.maxWeightKg;

          return (
            <div
              key={recipe.id}
              className="bg-white rounded-xl border border-[#e7e2d8] hover:border-stone-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-2xs"
            >
              {/* Recipe Image */}
              <div
                onClick={() => onOpenRecipe(recipe)}
                className="relative aspect-16/10 w-full bg-[#f3efe8] overflow-hidden cursor-pointer"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_FOOD_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Recipe Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Metadata */}
                  <div className="text-[11px] text-stone-400 font-light flex items-center gap-2 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 stroke-[1.5]" />
                      {recipe.timeMinutes} min
                    </span>
                    <span>·</span>
                    <span>{recipe.difficulty}</span>
                    <span>·</span>
                    <span>{recipe.servings}</span>
                  </div>

                  <h3
                    onClick={() => onOpenRecipe(recipe)}
                    className="font-serif text-lg font-normal text-stone-900 leading-snug mb-1.5 group-hover:text-black cursor-pointer transition-colors"
                  >
                    {recipe.title}
                  </h3>

                  <p className="text-xs text-stone-500 font-light line-clamp-2 leading-relaxed mb-4">
                    {recipe.subtitle}
                  </p>

                  {/* Required Box Products mini strip */}
                  <div className="space-y-1.5 pt-3 border-t border-stone-100 mb-4">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 font-medium block">
                      Ingredienti del Pacco usati:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {recipeProducts.map((p) => {
                        const inCart = cartProductIds.has(p.id);
                        return (
                          <span
                            key={p.id}
                            className={`text-[10px] px-2 py-0.5 rounded-md border font-light ${
                              inCart
                                ? 'bg-stone-50 border-stone-200 text-stone-800 font-medium'
                                : 'bg-white border-stone-200 text-stone-500'
                            }`}
                          >
                            {inCart ? '✓ ' : ''}{p.name.split(' (')[0]}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onOpenRecipe(recipe)}
                    className="text-stone-600 hover:text-black font-medium transition-colors flex items-center gap-1 cursor-pointer underline underline-offset-4 decoration-stone-300"
                  >
                    <span>Vedi Ricetta</span>
                    <ArrowRight className="w-3 h-3 stroke-[1.5]" />
                  </button>

                  {missingProducts.length > 0 ? (
                    <button
                      onClick={() => onAddAllRecipeProducts(missingProducts)}
                      disabled={wouldExceedWeight}
                      className="px-3 py-1.5 rounded-full bg-[#1a1816] hover:bg-[#332f2b] text-white text-[11px] font-medium transition-all cursor-pointer disabled:opacity-30 flex items-center gap-1"
                      title={wouldExceedWeight ? 'Supererebbe i 15kg massimi' : 'Aggiungi ingredienti mancanti'}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Completa Pacco (€{missingPrice.toFixed(2)})</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ingredienti già nel Pacco</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
