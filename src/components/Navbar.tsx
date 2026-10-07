import React, { useState } from 'react';
import { Package, Scale, Settings2, Sparkles, User as UserIcon, Shield, LogOut, Menu, X, BookOpen, Utensils, Truck } from 'lucide-react';
import { BOX_LIMITS } from '../data/shipping';
import { User } from '../data/auth';

interface NavbarProps {
  cartCount: number;
  subtotal: number;
  totalWeight: number;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onOpenCart: () => void;
  onOpenCustomSupplier: () => void;
  onScrollToRecipes?: () => void;
  onScrollToPreconfiguredBoxes?: () => void;
  onScrollToShipping?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  subtotal,
  totalWeight,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
  onOpenCart,
  onOpenCustomSupplier,
  onScrollToRecipes,
  onScrollToPreconfiguredBoxes,
  onScrollToShipping,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isWeightOver = totalWeight > BOX_LIMITS.maxWeightKg;
  const isMinSpendMet = subtotal >= BOX_LIMITS.minOrderEuro;

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e7e2d8] text-[#1c1a17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#1c1a17]/15 flex items-center justify-center text-xs sm:text-sm font-serif italic text-[#1c1a17] shrink-0 bg-white shadow-2xs group-hover:border-stone-400 transition-colors">
              P
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg sm:text-2xl font-normal tracking-[0.03em] text-[#1c1a17]">
                  Puglia In Scatola
                </span>
                <span className="hidden md:inline text-[10px] tracking-[0.2em] uppercase text-stone-400 font-medium">
                  50×50×50
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 font-light tracking-wide hidden sm:block">
                Eccellenze gastronomiche selezionate per il viaggio
              </p>
            </div>
          </button>
        </div>

        {/* Minimal Indicators (Weight & Spend) for larger screens */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-stone-600 font-light">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400">Peso</span>
            <span className={`font-mono font-medium ${isWeightOver ? 'text-red-700 font-bold' : 'text-[#1c1a17]'}`}>
              {totalWeight.toFixed(2)} / 15 kg
            </span>
          </div>

          <span className="text-stone-300">·</span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400">Pacco</span>
            <span className="font-serif text-sm font-medium text-[#1c1a17]">
              €{subtotal.toFixed(2)}
            </span>
            <span className={`text-[10px] ${isMinSpendMet ? 'text-emerald-700 font-medium' : 'text-stone-400'}`}>
              {isMinSpendMet ? '(min. 50€ ✓)' : `(mancano €${(50 - subtotal).toFixed(2)})`}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Confezioni Pronte scroll link */}
          {onScrollToPreconfiguredBoxes && (
            <button
              onClick={onScrollToPreconfiguredBoxes}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 rounded-lg transition-colors cursor-pointer tracking-wider uppercase text-[11px] font-medium"
            >
              <Package className="w-3.5 h-3.5 stroke-[1.8] text-amber-700" />
              <span>Confezioni Pronte</span>
            </button>
          )}

          {/* Recipes scroll link */}
          {onScrollToRecipes && (
            <button
              onClick={onScrollToRecipes}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-600 hover:text-black transition-colors cursor-pointer tracking-wider uppercase text-[11px]"
            >
              <Utensils className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Ricette</span>
            </button>
          )}

          {/* Shipping quote scroll link */}
          {onScrollToShipping && (
            <button
              onClick={onScrollToShipping}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-600 hover:text-black transition-colors cursor-pointer tracking-wider uppercase text-[11px]"
            >
              <Truck className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Preventivo Spedizioni</span>
            </button>
          )}

          {/* Admin link */}
          <button
            onClick={onOpenAdmin}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer tracking-wider uppercase text-[11px]"
          >
            <Shield className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Admin</span>
          </button>

          {/* Courier rate config link */}
          <button
            onClick={onOpenCustomSupplier}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer tracking-wider uppercase text-[11px]"
          >
            <Settings2 className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Fornitori</span>
          </button>

          {/* User Auth (desktop) */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-stone-300"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs text-stone-700 font-medium max-w-28 truncate">
                {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                className="p-1 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                title="Esci dal profilo"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden sm:inline-block text-xs text-stone-700 hover:text-black font-medium tracking-wide transition-colors cursor-pointer px-2 py-1"
            >
              Accedi
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#1c1a17] hover:bg-[#332f2b] text-white text-xs tracking-wide transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 stroke-[1.8] text-stone-300" />
            <span className="font-serif text-xs sm:text-sm">€{subtotal.toFixed(2)}</span>
            {cartCount > 0 && (
              <span className="text-[10px] text-stone-300 font-mono pl-1 border-l border-stone-700">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-stone-700 hover:text-black rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#e7e2d8] bg-[#faf8f5] px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 text-xs">
            <div>
              <span className="text-[10px] uppercase text-stone-400 block">Peso Pacco</span>
              <span className={`font-mono font-bold ${isWeightOver ? 'text-red-700' : 'text-stone-900'}`}>
                {totalWeight.toFixed(2)} / 15 kg
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-400 block">Importo</span>
              <span className="font-serif font-bold text-stone-900">€{subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-400 block">Soglia 50€</span>
              <span className={isMinSpendMet ? 'text-emerald-700 font-medium' : 'text-amber-700'}>
                {isMinSpendMet ? 'Raggiunta ✓' : `-€${(50 - subtotal).toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            {onScrollToPreconfiguredBoxes && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onScrollToPreconfiguredBoxes();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-amber-900 bg-amber-50 hover:bg-amber-100 font-semibold cursor-pointer border border-amber-200/50"
              >
                <Package className="w-4 h-4 text-amber-700" />
                <span>Confezioni Pronte (3 Fasce Prezzo)</span>
              </button>
            )}

            {onScrollToRecipes && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onScrollToRecipes();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-stone-800 hover:bg-stone-100 font-medium cursor-pointer"
              >
                <Utensils className="w-4 h-4 text-stone-500" />
                <span>Ricette Tipiche Pugliesi</span>
              </button>
            )}

            {onScrollToShipping && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onScrollToShipping();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-stone-800 hover:bg-stone-100 font-medium cursor-pointer"
              >
                <Truck className="w-4 h-4 text-stone-500" />
                <span>Preventivo Spedizioni Corrieri</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCustomSupplier();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-stone-800 hover:bg-stone-100 font-medium cursor-pointer"
            >
              <Settings2 className="w-4 h-4 text-stone-500" />
              <span>Configura Corrieri & Tariffe</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-stone-800 hover:bg-stone-100 font-medium cursor-pointer"
            >
              <Shield className="w-4 h-4 text-stone-500" />
              <span>Pannello Amministrazione (admin/admin)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-200/60">
            {currentUser ? (
              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-stone-200">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="p-1.5 text-stone-400 hover:text-stone-900"
                  title="Esci"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 bg-[#1a1816] text-white rounded-xl text-xs font-medium text-center cursor-pointer"
              >
                Accedi o Registrati
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
