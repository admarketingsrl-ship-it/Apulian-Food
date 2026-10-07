import React from 'react';
import { Truck, MapPin, Plus, Check, Clock, ShieldCheck, Snowflake } from 'lucide-react';
import { ShippingProvider, DESTINATION_ZONES, DestinationZone, calculateShipping } from '../data/shipping';

interface ShippingCalculatorProps {
  providers: ShippingProvider[];
  selectedProviderId: string;
  onSelectProvider: (id: string) => void;
  selectedZone: DestinationZone;
  onSelectZone: (zone: DestinationZone) => void;
  currentWeightKg: number;
  hasRefrigeratedItems: boolean;
  cartSubtotal: number;
  onOpenCustomSupplierModal: () => void;
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  providers,
  selectedProviderId,
  onSelectProvider,
  selectedZone,
  onSelectZone,
  currentWeightKg,
  hasRefrigeratedItems,
  cartSubtotal,
  onOpenCustomSupplierModal,
}) => {
  const currentProvider = providers.find((p) => p.id === selectedProviderId) || providers[0];
  const activeCalc = calculateShipping(
    currentProvider,
    currentWeightKg,
    selectedZone,
    hasRefrigeratedItems,
    cartSubtotal
  );

  return (
    <div className="bg-white rounded-2xl border border-[#e7e2d8] p-6 sm:p-8 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0ede6]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-1">
            Logistica & Spedizioni
          </div>
          <h3 className="font-serif text-2xl font-normal text-[#1a1816]">
            Preventivo Immediato Corriere
          </h3>
        </div>

        <button
          onClick={onOpenCustomSupplierModal}
          className="self-start sm:self-auto text-xs text-stone-500 hover:text-black font-medium transition-colors flex items-center gap-1.5 cursor-pointer underline underline-offset-4 decoration-stone-300"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Configura altro fornitore</span>
        </button>
      </div>

      {/* Destination Selector: Clean Segmented Bar */}
      <div className="py-6 border-b border-[#f0ede6]">
        <span className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-medium block mb-3">
          Destinazione del Pacco
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DESTINATION_ZONES.map((zone) => {
            const isSelected = selectedZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#1a1816] bg-[#faf8f5] shadow-2xs'
                    : 'border-stone-200/80 hover:border-stone-400 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${isSelected ? 'text-[#1a1816]' : 'text-stone-700'}`}>
                    {zone.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#1a1816]" />}
                </div>
                <p className="text-[11px] text-stone-500 font-light leading-snug">
                  {zone.description}
                </p>
                {zone.surcharge > 0 && (
                  <span className="text-[10px] font-mono text-stone-500 block mt-2">
                    +€{zone.surcharge.toFixed(2)} supplemento zona
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courier Cards: Refined Minimal Grid */}
      <div className="py-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-medium">
            Seleziona il Vettore Convenzionato
          </span>
          <span className="text-[11px] text-stone-400">
            Tariffato per {currentWeightKg.toFixed(2)} kg
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {providers.map((provider) => {
            const calc = calculateShipping(
              provider,
              currentWeightKg,
              selectedZone,
              hasRefrigeratedItems,
              cartSubtotal
            );
            const isSelected = selectedProviderId === provider.id;

            return (
              <div
                key={provider.id}
                onClick={() => onSelectProvider(provider.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#1a1816] bg-[#faf8f5] ring-1 ring-[#1a1816]/10'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-xs font-medium text-stone-900">
                        {provider.name}
                      </h4>
                      <span className="text-[11px] text-stone-400 block font-light">
                        {provider.deliveryTimeDays}
                      </span>
                    </div>

                    <div className="text-right">
                      {calc.isFreeEligible ? (
                        <span className="text-xs font-medium text-emerald-700">GRATIS</span>
                      ) : (
                        <span className="font-serif text-base font-medium text-stone-900">
                          €{calc.totalShippingCost.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 font-light line-clamp-2 mb-3">
                    {provider.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Consegna: {calc.estimatedDeliveryDate}</span>
                  <span className={`text-[10px] font-medium ${isSelected ? 'text-black' : 'text-stone-400'}`}>
                    {isSelected ? 'Selezionato' : 'Scegli'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Line */}
      <div className="pt-4 border-t border-[#f0ede6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
        <div className="flex items-center gap-3">
          <span>Corriere selezionato: <strong className="font-medium text-stone-900">{currentProvider.name}</strong></span>
          <span className="text-stone-300">·</span>
          <span>Arrivo previsto: <strong className="font-medium text-stone-900">{activeCalc.estimatedDeliveryDate}</strong></span>
        </div>

        <div className="font-serif text-sm text-stone-900">
          Spese di spedizione calcolate: <strong className="font-medium">€{activeCalc.totalShippingCost.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};
