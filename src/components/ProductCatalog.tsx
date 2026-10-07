import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Sparkles,
  Wheat,
  UtensilsCrossed,
  Droplets,
  CakeSlice,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { Product, CartItem } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  cart: CartItem[];
  currentTotalWeight: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onOpenDetails: (product: Product) => void;
}

interface CategoryOption {
  id: string;
  label: string;
  shortLabel: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_ITEMS: CategoryOption[] = [
  {
    id: 'tutti',
    label: 'Tutti i Prodotti',
    shortLabel: 'Tutti i Prodotti',
    subtitle: 'Intera dispensa pugliese',
    Icon: Sparkles,
  },
  {
    id: 'prodotti-da-forno',
    label: '1. Prodotti da Forno',
    shortLabel: 'Prodotti da Forno',
    subtitle: 'Taralli, friselle e orecchiette',
    Icon: Wheat,
  },
  {
    id: 'salumi-formaggi',
    label: '2. Salumi & Formaggi',
    shortLabel: 'Salumi & Formaggi',
    subtitle: 'Sottovuoto a lunga tenuta',
    Icon: UtensilsCrossed,
  },
  {
    id: 'sottoli-conserve',
    label: '3. Sottoli, Conserve & Oli',
    shortLabel: 'Sottoli & Oli EVO',
    subtitle: 'In latte e vasi ermetici',
    Icon: Droplets,
  },
  {
    id: 'extra-dolci',
    label: '4. Dolci & Tradizione',
    shortLabel: 'Dolci & Tradizione',
    subtitle: 'Pasta di mandorle e tipicità',
    Icon: CakeSlice,
  },
];

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

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      tutti: products.length,
      'prodotti-da-forno': 0,
      'salumi-formaggi': 0,
      'sottoli-conserve': 0,
      'extra-dolci': 0,
    };
    for (const p of products) {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    }
    return counts;
  }, [products]);

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

  const activeCategoryMeta = CATEGORY_ITEMS.find((c) => c.id === selectedCategory) || CATEGORY_ITEMS[0];

  return (
    <div id="catalogo-pugliese" className="space-y-6 sm:space-y-8 pt-4">
      {/* Title & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 pb-6 border-b border-[#e7e2d8]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
            Dispensa d'Eccellenza
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1a1816]">
            Prodotti Selezionati per il Viaggio
          </h2>
          <p className="text-xs text-stone-500 font-light mt-1">
            Specialità leggere, a tenuta ermetica o sottovuoto, ideali per la scatola 50×50×50 cm.
          </p>
        </div>

        {/* Search, Sort and Mobile Quick Category Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          {/* Search box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5 sm:top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca prodotto o città..."
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-black font-light text-stone-800 placeholder:text-stone-400"
            />
          </div>

          {/* Quick Category Selector on Smartphone (Alternative quick dropdown) */}
          <div className="flex sm:hidden items-center gap-1.5 border border-stone-300 rounded-xl px-3 py-2 bg-white text-xs">
            <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs text-stone-700 bg-transparent focus:outline-none cursor-pointer"
            >
              {CATEGORY_ITEMS.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.shortLabel} ({categoryCounts[cat.id] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 border border-stone-300 rounded-xl px-3 py-2 sm:py-1.5 bg-white text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs text-stone-700 bg-transparent focus:outline-none cursor-pointer"
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

      {/* Category Navigation: Responsive Grid of Interactive Tiles (NO horizontal scrolling) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-medium">
            Seleziona Categoria
          </span>
          <span className="text-stone-400 text-[11px]">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'prodotto visibile' : 'prodotti visibili'}
          </span>
        </div>

        {/* Grid layout: On smartphones, 'Tutti' spans full-width and other 4 form 2x2. On larger screens, 5 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {CATEGORY_ITEMS.map((cat, index) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            const Icon = cat.Icon;
            const isTutti = cat.id === 'tutti';

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative text-left p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isTutti ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  isSelected
                    ? 'bg-[#1c1a17] text-white border-[#1c1a17] shadow-sm ring-1 ring-[#1c1a17]'
                    : 'bg-white hover:bg-stone-50/80 border-[#e7e2d8] text-stone-800 hover:border-stone-400 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-white/15 text-amber-300'
                        : 'bg-amber-50 text-amber-800 group-hover:bg-amber-100/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[1.8]" />
                  </div>

                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                    }`}
                  >
                    {count}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-medium leading-tight ${
                        isSelected ? 'text-white' : 'text-[#1c1a17]'
                      }`}
                    >
                      {cat.shortLabel}
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-amber-300 shrink-0" />}
                  </div>
                  <p
                    className={`text-[10px] font-light mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-stone-300' : 'text-stone-400'
                    }`}
                  >
                    {cat.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active filter summary & quick reset chip */}
        {(selectedCategory !== 'tutti' || searchQuery.trim()) && (
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-amber-950 text-xs">
              <Filter className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                Filtro:{' '}
                <strong className="font-semibold">{activeCategoryMeta.shortLabel}</strong>
                {searchQuery.trim() && (
                  <span>
                    {' '}· ricerca: "<em>{searchQuery}</em>"
                  </span>
                )}
                {' '}({filteredProducts.length} prodotti)
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('tutti');
                setSearchQuery('');
              }}
              className="text-[11px] font-medium text-amber-900 hover:text-black flex items-center gap-1 cursor-pointer bg-white/80 hover:bg-white px-2 py-1 rounded-md border border-amber-200"
            >
              <X className="w-3 h-3" />
              <span>Azzera filtri</span>
            </button>
          </div>
        )}
      </div>

      {/* Products Grid: 1 column on small phones, 2 on tablets, 3 on desktop, 4 on large */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-stone-400 text-xs font-light bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          Nessun prodotto trovato. Prova un termine differente.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
