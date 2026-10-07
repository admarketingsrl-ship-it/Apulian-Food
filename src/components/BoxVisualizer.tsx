import React from 'react';
import { Package, Scale, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { CartItem } from '../data/products';
import { BOX_LIMITS } from '../data/shipping';

interface BoxVisualizerProps {
  cart: CartItem[];
  totalWeight: number;
  totalVolume: number;
  subtotal: number;
  onOpenCart: () => void;
}

export const BoxVisualizer: React.FC<BoxVisualizerProps> = ({
  cart,
  totalWeight,
  totalVolume,
  subtotal,
  onOpenCart,
}) => {
  const isWeightOver = totalWeight > BOX_LIMITS.maxWeightKg;
  const isMinSpendMet = subtotal >= BOX_LIMITS.minOrderEuro;
  const missingEuro = Math.max(0, BOX_LIMITS.minOrderEuro - subtotal);
  const remainingWeight = Math.max(0, BOX_LIMITS.maxWeightKg - totalWeight);

  const volumePercent = Math.min(100, Math.round((totalVolume / BOX_LIMITS.effectiveUsableLiters) * 100));
  const weightPercent = Math.min(100, Math.round((totalWeight / BOX_LIMITS.maxWeightKg) * 100));
  const spendPercent = Math.min(100, Math.round((subtotal / BOX_LIMITS.minOrderEuro) * 100));

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-white rounded-2xl border border-[#e7e2d8] p-6 sm:p-8 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0ede6]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
            Stato Imballaggio Atelier
          </div>
          <h2 className="font-serif text-2xl font-normal text-[#1a1816]">
            Il Pacco da 50 × 50 × 50 cm
          </h2>
        </div>

        <button
          onClick={onOpenCart}
          className="self-start sm:self-auto text-xs text-stone-600 hover:text-black font-medium transition-colors flex items-center gap-1.5 cursor-pointer underline underline-offset-4 decoration-stone-300"
        >
          <span>Gestisci {totalItemsCount} articoli nel pacco</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Core Gauges - Minimal & Clean */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-[#f0ede6]">
        {/* Metric 1: Weight */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-medium">
              Peso Totale
            </span>
            <span className={`text-xs font-mono ${isWeightOver ? 'text-red-700 font-bold' : 'text-stone-700'}`}>
              {totalWeight.toFixed(2)} / 15.00 kg
            </span>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isWeightOver ? 'bg-red-600' : 'bg-[#1a1816]'
              }`}
              style={{ width: `${Math.min(100, (totalWeight / 15) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-stone-500 font-light">
            {isWeightOver ? (
              <span className="text-red-700 font-medium">Superato di {(totalWeight - 15).toFixed(2)} kg!</span>
            ) : (
              <span>Residuo disponibile: <strong className="font-medium text-stone-800">{remainingWeight.toFixed(2)} kg</strong></span>
            )}
          </p>
        </div>

        {/* Metric 2: Volume */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-medium">
              Volume Scatola
            </span>
            <span className="text-xs font-mono text-stone-700">
              {volumePercent}% ({totalVolume.toFixed(1)} / 95L)
            </span>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-stone-700 rounded-full transition-all duration-300"
              style={{ width: `${volumePercent}%` }}
            />
          </div>

          <p className="text-[11px] text-stone-500 font-light">
            Include spazio cuscinetto e paglietta protettiva
          </p>
        </div>

        {/* Metric 3: Minimum Spend */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-medium">
              Spesa Minima
            </span>
            <span className="text-xs font-serif text-stone-900 font-medium">
              €{subtotal.toFixed(2)} / €50.00
            </span>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isMinSpendMet ? 'bg-emerald-700' : 'bg-stone-400'
              }`}
              style={{ width: `${spendPercent}%` }}
            />
          </div>

          <p className="text-[11px] font-light">
            {isMinSpendMet ? (
              <span className="text-emerald-800 font-medium flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[2]" /> Soglia minima raggiunta
              </span>
            ) : (
              <span className="text-stone-500">Mancano €{missingEuro.toFixed(2)} per procedere</span>
            )}
          </p>
        </div>
      </div>

      {/* Inside the Box: Minimal Grid */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-medium">
            Composizione Attuale del Pacco
          </span>
          <span className="text-[11px] text-stone-500 font-light">
            {cart.length} tipologie selezionate
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="py-10 text-center text-stone-400 text-xs font-light">
            Il pacco è vuoto. Aggiungi i prodotti desiderati dalla dispensa sottostante.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-[#faf8f5] rounded-xl p-2.5 border border-[#ece8df] flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full h-20 rounded-lg overflow-hidden bg-stone-100 mb-2 relative">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] font-mono px-1.5 py-0.2 rounded">
                      ×{item.quantity}
                    </span>
                  </div>

                  <h4 className="text-xs font-normal text-stone-900 line-clamp-1 leading-snug">
                    {item.product.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 truncate mt-0.5">{item.product.origin}</p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 font-mono text-[10px]">
                    {(item.product.weightKg * item.quantity).toFixed(2)} kg
                  </span>
                  <span className="font-serif font-medium text-stone-900">
                    €{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
