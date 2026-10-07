import React, { useState } from 'react';
import { X, Check, Zap, RefreshCw } from 'lucide-react';
import { ShippingProvider } from '../data/shipping';

interface CustomSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProvider: (provider: ShippingProvider) => void;
  existingProviders: ShippingProvider[];
}

export const CustomSupplierModal: React.FC<CustomSupplierModalProps> = ({
  isOpen,
  onClose,
  onSaveProvider,
}) => {
  const [name, setName] = useState('Corriere Convenzionato B2B');
  const [basePrice, setBasePrice] = useState('7.90');
  const [perKgOver5kg, setPerKgOver5kg] = useState('0.45');
  const [deliveryDays, setDeliveryDays] = useState('24-48 ore');
  const [contractCode, setContractCode] = useState('PUG-B2B-2026');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('Connessione API verificata (Ping: 42ms). Tariffe sincronizzate.');
    }, 600);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newProvider: ShippingProvider = {
      id: `custom-${Date.now()}`,
      name: name || 'Fornitore Privato',
      logo: '📦',
      description: `Fornitore esterno convenzionato (${contractCode})`,
      basePrice: parseFloat(basePrice) || 8.0,
      perKgOver5kg: parseFloat(perKgOver5kg) || 0.5,
      deliveryTimeDays: deliveryDays || '24-48 ore',
      insuranceIncluded: true,
      isCustom: true,
      apiConnected: true,
      contractCode,
      features: ['Tariffa dedicata', 'Tracking integrato'],
    };

    onSaveProvider(newProvider);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#faf8f5] rounded-2xl shadow-xl border border-[#e7e2d8] overflow-hidden animate-in fade-in zoom-in-98 duration-150">
        <div className="px-6 py-5 border-b border-[#e7e2d8] flex items-center justify-between bg-white">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">
              Configurazione Spedizioni
            </div>
            <h3 className="font-serif text-xl font-normal text-stone-900">
              Aggancia Nuovo Fornitore
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs text-stone-700">
          <div>
            <label className="block text-stone-600 mb-1 font-light">Nome Corriere / Fornitore</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 mb-1 font-light">Tariffa Base (fino a 5kg) €</label>
              <input
                type="number"
                step="0.10"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white font-mono focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-stone-600 mb-1 font-light">Costo / kg oltre 5kg €</label>
              <input
                type="number"
                step="0.05"
                required
                value={perKgOver5kg}
                onChange={(e) => setPerKgOver5kg(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white font-mono focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 mb-1 font-light">Tempi di Consegna</label>
              <input
                type="text"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-stone-600 mb-1 font-light">Codice Contratto / API Key</label>
              <input
                type="text"
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white font-mono focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-stone-500 font-light">Simulazione Handshake API</span>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="text-[11px] text-stone-900 underline font-medium hover:text-black cursor-pointer"
              >
                {isTesting ? 'Verifica in corso...' : 'Testa API'}
              </button>
            </div>
            {testResult && (
              <p className="text-[11px] text-emerald-800 font-light">
                ✓ {testResult}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-500 hover:text-black font-medium"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1a1816] hover:bg-[#332f2b] text-white rounded-full font-medium transition-colors cursor-pointer"
            >
              Salva e Seleziona
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
