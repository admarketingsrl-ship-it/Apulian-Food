import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, MessageSquare } from 'lucide-react';
import { CartItem } from '../data/products';
import { BOX_LIMITS, ShippingCalculation } from '../data/shipping';

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs flex justify-end">
      <div className="relative w-full max-w-lg bg-[#faf8f5] h-full shadow-2xl flex flex-col border-l border-[#e7e2d8] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e7e2d8] flex items-center justify-between shrink-0 bg-white">
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
                onClick={onClearCart}
                className="text-[11px] text-stone-400 hover:text-black transition-colors underline cursor-pointer"
              >
                Svuota
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Minimal Gauges Status Bar */}
        <div className="px-6 py-3 border-b border-[#e7e2d8] flex items-center justify-between text-xs text-stone-600 bg-[#f5f2ea]/60">
          <div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 block">Peso</span>
            <span className={`font-mono ${isWeightOver ? 'text-red-700 font-bold' : 'text-stone-900'}`}>
              {totalWeight.toFixed(2)} / 15 kg
            </span>
          </div>
          <span className="text-stone-300">·</span>
          <div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 block">Volume</span>
            <span className="font-mono text-stone-900">
              {totalVolume.toFixed(1)} / 95L
            </span>
          </div>
          <span className="text-stone-300">·</span>
          <div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 block">Soglia</span>
            <span className={isMinSpendMet ? 'text-emerald-800 font-medium' : 'text-stone-600'}>
              {isMinSpendMet ? 'Raggiunta ✓' : `Mancano €${missingEuro.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center text-stone-400 text-xs font-light">
              Il pacco è vuoto.
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl p-3.5 border border-[#e7e2d8] flex items-center gap-3"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-100"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-medium text-stone-900 leading-snug truncate">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-stone-300 hover:text-stone-800 p-0.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-400 truncate mt-0.5">
                    {item.product.origin}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-50">
                    <div className="flex items-center gap-1.5 border border-stone-200 rounded-md p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-xs"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="font-mono text-xs px-1 text-stone-900 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={totalWeight + item.product.weightKg > BOX_LIMITS.maxWeightKg}
                        className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-xs disabled:opacity-30"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <span className="font-serif text-sm font-medium text-stone-900">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Dedication Card */}
          <div className="p-4 rounded-xl border border-[#e7e2d8] bg-white text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 font-medium flex items-center gap-1.5">
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
                  placeholder="Scrivi qui la dedica che stamperemo su carta pergamena dentro la scatola..."
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
        <div className="p-6 bg-white border-t border-[#e7e2d8] shrink-0 space-y-3">
          <div className="space-y-1.5 text-xs text-stone-500 font-light">
            <div className="flex justify-between">
              <span>Prodotti:</span>
              <span className="font-serif text-stone-900 font-medium">€{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Spedizione ({shippingCalc.provider.name}):</span>
              <span className="font-serif text-stone-900 font-medium">
                {shippingCalc.isFreeEligible ? 'Gratis' : `€${shippingCalc.totalShippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-stone-100 text-sm">
              <span className="text-stone-900 font-normal">Totale Pacco:</span>
              <span className="font-serif text-2xl font-normal text-stone-900">
                €{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={onProceedToCheckout}
            disabled={!canCheckout}
            className="w-full py-3 rounded-full bg-[#1a1816] hover:bg-[#332f2b] text-white text-xs font-medium tracking-wide transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Procedi all'Ordine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
