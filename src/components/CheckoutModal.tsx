import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../data/products';
import { ShippingCalculation } from '../data/shipping';
import { AdminOrder, User } from '../data/auth';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  totalWeight: number;
  shippingCalc: ShippingCalculation;
  customNote: string;
  currentUser: User | null;
  onOrderSuccess: (order: AdminOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  subtotal,
  totalWeight,
  shippingCalc,
  customNote,
  currentUser,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [recipientName, setRecipientName] = useState(currentUser?.name || '');
  const [address, setAddress] = useState(currentUser?.address?.street || '');
  const [city, setCity] = useState(currentUser?.address?.city || '');
  const [postalCode, setPostalCode] = useState(currentUser?.address?.postalCode || '');
  const [phone, setPhone] = useState(currentUser?.address?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'satispay' | 'paypal'>('card');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setRecipientName(currentUser.name);
      if (currentUser.address?.street) setAddress(currentUser.address.street);
      if (currentUser.address?.city) setCity(currentUser.address.city);
      if (currentUser.address?.postalCode) setPostalCode(currentUser.address.postalCode);
      if (currentUser.address?.phone) setPhone(currentUser.address.phone);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const grandTotal = subtotal + shippingCalc.totalShippingCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const fakeTracking = `PUG-${shippingCalc.provider.id.toUpperCase().slice(0, 3)}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTrackingNumber(fakeTracking);
    setStep('success');

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1a1816', '#7d6b56', '#a89f91'],
      });
    } catch {
      // ignore
    }

    const itemsSummary = cart.map(i => `${i.product.name} (x${i.quantity})`).join(', ');
    const newOrder: AdminOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `PUG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Proprio ora',
      customerName: recipientName,
      customerEmail: currentUser?.email || 'cliente@pugliainscatola.it',
      destination: `${city} - ${address}`,
      courierName: shippingCalc.provider.name,
      trackingCode: fakeTracking,
      totalWeightKg: totalWeight,
      totalVolumeLiters: Math.round(cart.reduce((sum, i) => sum + i.product.volumeLiters * i.quantity, 0) * 10) / 10,
      itemsCount: cart.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      shippingCost: shippingCalc.totalShippingCost,
      grandTotal,
      status: 'in_preparazione',
      itemsSummary,
      customNote: customNote || undefined,
      hasRefrigerated: cart.some(i => i.product.isRefrigerated),
    };

    onOrderSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#faf8f5] rounded-2xl shadow-xl border border-[#e7e2d8] overflow-hidden animate-in fade-in zoom-in-98 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e7e2d8] flex items-center justify-between bg-white">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">
              Checkout & Spedizione
            </div>
            <h3 className="font-serif text-xl font-normal text-stone-900">
              {step === 'details' ? 'Destinazione del Pacco' : 'Ordine Confermato'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-5 text-xs text-stone-700">
            {/* Box Recap Bar */}
            <div className="p-3.5 rounded-xl border border-[#e7e2d8] bg-white flex items-center justify-between text-[11px] text-stone-600">
              <span>Scatola: <strong className="font-mono text-stone-900">50×50×50 cm</strong></span>
              <span>·</span>
              <span>Peso: <strong className="font-mono text-stone-900">{totalWeight.toFixed(2)} kg</strong></span>
              <span>·</span>
              <span>Corriere: <strong className="font-medium text-stone-900">{shippingCalc.provider.name}</strong></span>
            </div>

            {/* Recipient Form */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 font-medium block">
                Dati Destinatario
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1 font-light">Nome e Cognome</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-black font-light text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-light">Telefono per il corriere</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-black font-light text-stone-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-600 mb-1 font-light">Indirizzo di Consegna (Via, Civico, Piano)</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-black font-light text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-light">Città e Provincia (o Regione estera)</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-black font-light text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-light">CAP</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-black font-light text-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 font-medium block">
                Metodo di Pagamento
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: 'Carta di Credito' },
                  { id: 'satispay', label: 'Satispay' },
                  { id: 'paypal', label: 'PayPal' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2 px-3 rounded-lg border text-xs font-light transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? 'border-black bg-white text-black font-medium'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Recap */}
            <div className="p-4 bg-white rounded-xl border border-[#e7e2d8] space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-500 font-light">
                <span>Prodotti pugliesi ({cart.length} tipologie):</span>
                <span className="font-serif text-stone-900 font-medium">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500 font-light">
                <span>Spedizione ({shippingCalc.provider.name}):</span>
                <span className="font-serif text-stone-900 font-medium">
                  {shippingCalc.isFreeEligible ? 'Gratis' : `€${shippingCalc.totalShippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-stone-100 text-sm">
                <span className="text-stone-900">Totale:</span>
                <span className="font-serif text-2xl font-normal text-stone-900">
                  €{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-500 hover:text-black font-medium"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1a1816] hover:bg-[#332f2b] text-white rounded-full font-medium shadow-2xs transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Conferma e Spedisci</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation */
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border border-stone-200 bg-white text-stone-900 flex items-center justify-center mx-auto text-lg">
              <Check className="w-5 h-5 stroke-[1.8]" />
            </div>

            <div>
              <h3 className="text-2xl font-serif font-normal text-stone-900">
                Pacco Preso in Carico
              </h3>
              <p className="text-xs text-stone-500 font-light mt-1 max-w-sm mx-auto">
                La scatola 50×50×50 cm è in allestimento nel nostro laboratorio pugliese.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#e7e2d8] text-xs text-left max-w-sm mx-auto space-y-2 text-stone-600 font-light">
              <div className="flex justify-between">
                <span>Codice Tracciamento:</span>
                <span className="font-mono text-stone-900 font-medium">{trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Corriere:</span>
                <span className="text-stone-900">{shippingCalc.provider.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Arrivo previsto:</span>
                <span className="text-stone-900 font-medium">{shippingCalc.estimatedDeliveryDate}</span>
              </div>
              <div className="flex justify-between border-t border-stone-100 pt-2 text-stone-900 font-medium">
                <span>Totale Addebitato:</span>
                <span className="font-serif text-sm">€{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#1a1816] text-white text-xs font-medium rounded-full cursor-pointer"
            >
              Chiudi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
