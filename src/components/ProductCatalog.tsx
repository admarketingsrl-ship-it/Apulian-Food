import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Product, CATEGORIES, CartItem } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  cart: CartItem[];
  currentTotalWeight: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  cart,
  currentTotalWeight,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tutti');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'weight-asc' | 'weight-desc'>('featured');

  // Map product id to quantity in cart for fast lookup
  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cart) {
      map[item.product.id] = item.quantity;
    }
    return map;
  }, [cart]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // category
        if (selectedCategory !== 'tutti' && p.category !== selectedCategory) {
          return false;
        }

        // search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchOrigin = p.origin.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchOrigin) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'weight-asc') return a.weightKg - b.weightKg;
        if (sortBy === 'weight-desc') return b.weightKg - a.weightKg;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div id="catalogo-pugliese" className="space-y-8 pt-4">
      {/* Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e7e2d8]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
            Dispensa d'Eccellenza
          </div>
          <h2 className="font-serif text-3xl font-normal text-[#1a1816]">
            Prodotti Selezionati per il Viaggio
          </h2>
          <p className="text-xs text-stone-500 font-light mt-1">
            Specialità leggere, a tenuta ermetica o sottovuoto, resistenti al tragitto postale.
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca per prodotto o città..."
              className="pl-8 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-black font-light text-stone-800 placeholder:text-stone-400 w-52"
            />
          </div>

          <div className="flex items-center gap-1.5 border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white text-xs">
            <ArrowUpDown className="w-3 h-3 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs text-stone-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="featured">Consigliati</option>
              <option value="price-asc">Prezzo: Min → Max</option>
              <option value="price-desc">Prezzo: Max → Min</option>
              <option value="weight-asc">Peso: Min → Max</option>
              <option value="weight-desc">Peso: Max → Min</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Navigation (Minimalist Text Tabs with Underline) */}
      <div className="flex items-center gap-6 overflow-x-auto pb-2 border-b border-stone-100 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`pb-2 text-xs transition-colors shrink-0 cursor-pointer relative ${
                isSelected
                  ? 'text-black font-medium'
                  : 'text-stone-500 hover:text-black font-light'
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

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-stone-400 text-xs font-light">
          Nessun prodotto corrisponde alla ricerca.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={cartQuantities[product.id] || 0}
              currentTotalWeight={currentTotalWeight}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
