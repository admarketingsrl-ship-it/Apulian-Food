import React from 'react';
import { Package, Scale, Settings2, Sparkles, User as UserIcon, Shield, LogOut } from 'lucide-react';
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
}) => {
  const isWeightOver = totalWeight > BOX_LIMITS.maxWeightKg;
  const isMinSpendMet = subtotal >= BOX_LIMITS.minOrderEuro;

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e7e2d8] text-[#1c1a17]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full border border-[#1c1a17]/15 flex items-center justify-center text-sm font-serif italic text-[#1c1a17] shrink-0 bg-white shadow-2xs">
            P
          </div>
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="font-serif text-xl sm:text-2xl font-normal tracking-[0.04em] text-[#1c1a17]">
                Puglia In Scatola
              </span>
              <span className="hidden sm:inline text-[10px] tracking-[0.2em] uppercase text-stone-400 font-medium">
                Atelier 50×50×50
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-light tracking-wide hidden xs:block">
              Spedizioni di eccellenze gastronomiche selezionate
            </p>
          </div>
        </div>

        {/* Minimal Indicators (Weight & Spend) */}
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
            <span className={`text-[10px] ${isMinSpendMet ? 'text-emerald-700' : 'text-stone-400'}`}>
              {isMinSpendMet ? '(min. 50€ ✓)' : `(mancano €${(50 - subtotal).toFixed(2)})`}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
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

          {/* User Auth */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-stone-300"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs text-stone-700 hidden sm:inline font-medium max-w-28 truncate">
                {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                className="p-1 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                title="Esci"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs text-stone-700 hover:text-black font-medium tracking-wide transition-colors cursor-pointer px-2 py-1"
            >
              Accedi
            </button>
          )}

          {/* Cart Button (Clean, elegant, minimal black button) */}
          <button
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c1a17] hover:bg-[#332f2b] text-white text-xs tracking-wide transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 stroke-[1.8] text-stone-300" />
            <span className="font-serif text-sm">€{subtotal.toFixed(2)}</span>
            {cartCount > 0 && (
              <span className="text-[10px] text-stone-300 font-mono pl-1 border-l border-stone-700">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
