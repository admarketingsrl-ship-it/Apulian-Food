import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#e5e0d8] bg-[#f5f1e8] text-stone-700">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div className="space-y-3">
            <span className="font-serif text-2xl font-normal text-stone-900 block">
              Puglia In Scatola
            </span>
            <p className="text-xs text-stone-500 font-light leading-relaxed max-w-xs">
              Atelier per la composizione del Pacco Pugliese su misura. Eccellenze gastronomiche selezionate per resistere al transito postale in Italia, Francia ed Europa.
            </p>
            <div className="text-[11px] text-stone-400 font-light">
              Puglia, Italia
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium block">
              Specifiche Pacco
            </span>
            <ul className="space-y-1.5 text-stone-600 font-light">
              <li>Dimensioni standard: 50 × 50 × 50 cm</li>
              <li>Capacità volumetrica: 125 Litri</li>
              <li>Peso massimo consentito: 15,00 kg</li>
              <li>Ordine minimo garantito: €50,00</li>
              <li>Protezione salva-vetro e paglietta naturale</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium block">
              Vettori Convenzionati
            </span>
            <ul className="space-y-1.5 text-stone-600 font-light">
              <li>BRT Bartolini Espresso 24-48h</li>
              <li>GLS Express Safe Food</li>
              <li>DHL Express Food & Cold Line</li>
              <li>Poste Italiane Crono Box</li>
              <li>InPost Locker 24/7</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium block">
              Assistenza Atelier
            </span>
            <p className="text-stone-500 font-light">
              Assistenza dedicata per spedizioni fuori sede e destinazioni estere:
            </p>
            <p className="font-mono text-stone-900 font-medium pt-1">
              atelier@pugliainscatola.it
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#e2dcd2] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400 font-light">
          <p>© {new Date().getFullYear()} Puglia In Scatola. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-4">
            <span>Condizioni di Trasporto</span>
            <span>·</span>
            <span>Tutela Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
