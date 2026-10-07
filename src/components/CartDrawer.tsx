import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';
import { CartItem } from '../data/products';
import { BOX_LIMITS, ShippingCalculation } from '../data/shipping';
import { FALLBACK_FOOD_IMAGE } from '../data/assets';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  totalWeight: number;
  totalVolume: number;
  subtotal: number;
  shippingCalc: ShippingCalculation;
  customNote: string;
  onChangeCustomNote: (note: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  totalWeight,
  totalVolume,
  subtotal,
  shippingCalc,
  customNote,
  onChangeCustomNote,
  onProceedToCheckout,
}) => {
  const [showNoteEditor, setShowNoteEditor] = useState(false);

  if (!isOpen) return null;

  const isWeightOver = totalWeight > BOX_LIMITS.maxWeightKg;
  const isMinSpendMet = subtotal >= BOX_LIMITS.minOrderEuro;
  const missingEuro = Math.max(0, BOX_LIMITS.minOrderEuro - subtotal);
  const canCheckout = isMinSpendMet && !isWeightOver && cart.length > 0;
  const grandTotal = subtotal + shippingCalc.totalShippingCost;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-full sm:max-w-md bg-[#faf8f5] h-full shadow-2xl flex flex-col border-l border-[#e7e2d8] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e7e2d8] flex items-center justify-between shrink-0 bg-white">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">
              Scatola 50 × 50 × 50 cm
            </div>
            <h2 className="font-serif text-xl font-normal text-stone-900">
              Il Tuo Pacco Pugliese
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-stone-400 hover:text-black transition-colors underline cursor-pointer"
              >
                Svuota
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-black transition-colors cursor-pointer rounded-lg hover:bg-stone-100"
              aria-label="Chiudi carrello"
            >
              <X className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-5 py-2.5 border-b border-[#e7e2d8] flex items-center justify-between text-xs text-stone-600 bg-[#f5f2ea]/70">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Peso</span>
            <span className={`font-mono font-semibold ${isWeightOver ? 'text-red-700 font-bold' : 'text-stone-900'}`}>
              {totalWeight.toFixed(2)} / 15 kg
            </span>
          </div>
          <span className="text-stone-300">·</span>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Volume</span>
            <span className="font-mono text-stone-900 font-semibold">
              {totalVolume.toFixed(1)} / 95L
            </span>
          </div>
          <span className="text-stone-300">·</span>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Min. 50€</span>
            <span className={isMinSpendMet ? 'text-emerald-800 font-semibold' : 'text-amber-800 font-semibold'}>
              {isMinSpendMet ? 'Raggiunto ✓' : `-€${missingEuro.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Warning messages */}
        {isWeightOver && (
          <div className="px-5 py-2.5 bg-red-50 text-red-700 text-xs flex items-center gap-2 border-b border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Hai superato il limite di 15 kg. Riduci la quantità di alcuni prodotti.</span>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="py-24 text-center text-stone-400 text-xs font-light">
              Il tuo pacco da giù è vuoto.
              <br />
              Seleziona le eccellenze dal catalogo per iniziare!
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl p-3 border border-[#e7e2d8] flex items-center gap-3 shadow-2xs"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-100 bg-[#f3efe8]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_FOOD_IMAGE;
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-medium text-stone-900 leading-snug truncate">
                      {item.product.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-stone-300 hover:text-red-700 p-1 transition-colors cursor-pointer"
                      title="Elimina"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-400 truncate mt-0.5">
                    {item.product.origin} · {(item.product.weightKg * item.quantity).toFixed(2)} kg
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-50">
                    <div className="flex items-center gap-1.5 border border-stone-200 rounded-lg p-0.5 bg-stone-50">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-700 bg-white rounded hover:bg-stone-100 text-xs shadow-2xs font-bold"
                        aria-label="Diminuisci"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs px-2 text-stone-900 font-semibold min-w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={totalWeight + item.product.weightKg > BOX_LIMITS.maxWeightKg}
                        className="w-7 h-7 flex items-center justify-center text-stone-700 bg-white rounded hover:bg-stone-100 text-xs shadow-2xs font-bold disabled:opacity-30"
                        aria-label="Aumenta"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-serif text-sm font-semibold text-stone-900">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Dedication Card */}
          <div className="p-3.5 rounded-xl border border-[#e7e2d8] bg-white text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3 text-stone-400" />
                Dedica nel Pacco
              </span>
              <button
                type="button"
                onClick={() => setShowNoteEditor(!showNoteEditor)}
                className="text-[11px] text-stone-500 hover:text-black underline cursor-pointer"
              >
                {showNoteEditor ? 'Chiudi' : 'Modifica'}
              </button>
            </div>

            {showNoteEditor ? (
              <div className="space-y-2 pt-1">
                <textarea
                  value={customNote}
                  onChange={(e) => onChangeCustomNote(e.target.value)}
                  placeholder="Scrivi la dedica affettuosa che stamperemo dentro la scatola..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-black font-light"
                />
                <button
                  type="button"
                  onClick={() => setShowNoteEditor(false)}
                  className="px-3 py-1 bg-[#1a1816] text-white rounded text-[11px] font-medium"
                >
                  Salva Dedica
                </button>
              </div>
            ) : customNote ? (
              <p className="text-[11px] italic text-stone-600 font-light pt-0.5">
                "{customNote}"
              </p>
            ) : (
              <p className="text-[11px] text-stone-400 font-light">
                Nessuna dedica inserita.
              </p>
            )}
          </div>
        </div>

        {/* Footer & Checkout */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#e7e2d8] shrink-0 space-y-3">
          <div className="space-y-1.5 text-xs text-stone-500 font-light">
            <div className="flex justify-between">
              <span>Prodotti nel pacco:</span>
              <span className="font-serif text-stone-900 font-medium">€{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Spedizione ({shippingCalc.provider.name}):</span>
              <span className="font-serif text-stone-900 font-medium">
                {shippingCalc.isFreeEligible ? 'Gratis' : `€${shippingCalc.totalShippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-stone-100 text-sm">
              <span className="text-stone-900 font-medium">Totale Finale:</span>
              <span className="font-serif text-2xl font-semibold text-stone-900">
                €{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onProceedToCheckout}
            disabled={!canCheckout}
            className="w-full py-3.5 rounded-xl bg-[#1a1816] hover:bg-[#332f2b] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Procedi all'Ordine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
