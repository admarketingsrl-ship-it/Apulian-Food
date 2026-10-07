import { Product, PRODUCTS } from './products';
import { ASSET_IMAGES } from './assets';

export interface PreconfiguredBoxItem {
  productId: string;
  quantity: number;
}

export interface PreconfiguredBox {
  id: string;
  tier: 'essential' | 'classic' | 'prestige';
  title: string;
  subtitle: string;
  targetPriceRange: string;
  badge: string;
  tagline: string;
  image: string;
  accentColor: string;
  description: string;
  bestFor: string;
  items: PreconfiguredBoxItem[];
}

export const PRECONFIGURED_BOXES: PreconfiguredBox[] = [
  {
    id: 'box-essenziale',
    tier: 'essential',
    title: 'Pacco Essenziale di Puglia',
    subtitle: 'Fascia Introduttiva',
    targetPriceRange: 'ca. 55€',
    badge: 'Minimo d\'Ordine Raggiunto',
    tagline: 'La dispensa fondamentale di Puglia: orecchiette, taralli, friselle, cime di rapa e il condimento del sole.',
    image: ASSET_IMAGES.friselleSalentine,
    accentColor: 'border-amber-700/20 bg-amber-50/40 text-amber-900',
    description: 'Ideale per chi desidera i grandi classici immancabili a tavola senza pensieri. Rispetta la soglia d\'ordine minimo (min. 50€) e garantisce una scorta autentica leggera e ultra-resistente.',
    bestFor: 'Studenti fuori sede, aperitivi veloci e prime esperienze pugliesi',
    items: [
      { productId: 'taralli-pugliesi-artigianali', quantity: 2 }, // 2x 3.20 = 6.40
      { productId: 'friselle-grano-orzo', quantity: 1 }, // 1x 3.90 = 3.90
      { productId: 'orecchiette-semola-bronzo', quantity: 2 }, // 2x 3.90 = 7.80
      { productId: 'cime-di-rapa-crema-vasetto', quantity: 1 }, // 1x 6.90 = 6.90
      { productId: 'sughetto-pomodorino-manduria', quantity: 2 }, // 2x 4.80 = 9.60
      { productId: 'cacioricotta-pugliese-stagionato', quantity: 1 }, // 1x 5.80 = 5.80
      { productId: 'pomodori-secchi-pate-vasetto', quantity: 1 }, // 1x 6.20 = 6.20
      { productId: 'biscotti-cegliesi-paste-mandorla', quantity: 1 }, // 1x 7.90 = 7.90
    ],
    // Totale stimato: 6.40 + 3.90 + 7.80 + 6.90 + 9.60 + 5.80 + 6.20 + 7.90 = 54.50€
    // Peso stimato: ~4.1 kg (ben sotto 15 kg)
  },
  {
    id: 'box-classico',
    tier: 'classic',
    title: 'Pacco Tradizione Pugliese',
    subtitle: 'Fascia Intermedia / Più Scelta',
    targetPriceRange: 'ca. 95€',
    badge: 'Il Più Richiesto',
    tagline: 'Include l\'Olio EVO in latta infrangibile da 3L, il mitico Capocollo di Martina Franca e formaggi tipici.',
    image: ASSET_IMAGES.olioEvoPuglia,
    accentColor: 'border-emerald-700/20 bg-emerald-50/40 text-emerald-900',
    description: 'Il perfetto equilibrio fra tradizione e scorta famiglia: l\'eccellente olio Coratina in latta metallica 3L combinato al Capocollo Presidio Slow Food e al Canestrato DOP murgiano.',
    bestFor: 'Famiglie fuori regione, expat in Francia e amanti della vera cucina casereccia',
    items: [
      { productId: 'olio-evo-latta-3l', quantity: 1 }, // 1x 35.00 = 35.00
      { productId: 'capocollo-martina-franca-sottovuoto', quantity: 1 }, // 1x 19.50 = 19.50
      { productId: 'canestrato-pugliese-dop', quantity: 1 }, // 1x 14.80 = 14.80
      { productId: 'orecchiette-semola-bronzo', quantity: 2 }, // 2x 3.90 = 7.80
      { productId: 'taralli-cipolla-acquaviva', quantity: 1 }, // 1x 3.50 = 3.50
      { productId: 'taralli-pugliesi-artigianali', quantity: 1 }, // 1x 3.20 = 3.20
      { productId: 'cime-di-rapa-crema-vasetto', quantity: 1 }, // 1x 6.90 = 6.90
      { productId: 'lampascioni-sottolio-vasetto', quantity: 1 }, // 1x 7.50 = 7.50
    ],
    // Totale stimato: 35 + 19.50 + 14.80 + 7.80 + 3.50 + 3.20 + 6.90 + 7.50 = 98.20€
    // Peso stimato: ~6.8 kg
  },
  {
    id: 'box-prestigio',
    tier: 'prestige',
    title: 'Pacco Gran Sovrano di Puglia',
    subtitle: 'Fascia Alta / Eccellenza Completa',
    targetPriceRange: 'ca. 165€',
    badge: 'Gran Banchetto Gourmet',
    tagline: 'Scorta d\'Olio EVO in latta 5L, tutti i Presidi Slow Food, salumi rari, formaggi delle grotte e dolci tipici.',
    image: ASSET_IMAGES.capocolloMartina,
    accentColor: 'border-stone-800/20 bg-stone-900 text-stone-100',
    description: 'Un viaggio gastronomico totale da 50×50×50 cm: contiene la maxi latta da 5 Litri, il Caciocavallo Podolico del Gargano, Capocollo, Soppressata, Vincotto invecchiato e dolcezze salentine.',
    bestFor: 'Regali importanti, festività, scorta semestrale per residenti all\'estero',
    items: [
      { productId: 'olio-evo-latta-5l', quantity: 1 }, // 1x 55.00 = 55.00
      { productId: 'capocollo-martina-franca-sottovuoto', quantity: 1 }, // 1x 19.50 = 19.50
      { productId: 'caciocavallo-podolico-stagionato', quantity: 1 }, // 1x 16.50 = 16.50
      { productId: 'canestrato-pugliese-dop', quantity: 1 }, // 1x 14.80 = 14.80
      { productId: 'soppressata-pugliese-artigianale', quantity: 1 }, // 1x 8.90 = 8.90
      { productId: 'orecchiette-grano-arso', quantity: 2 }, // 2x 4.40 = 8.80
      { productId: 'orecchiette-semola-bronzo', quantity: 2 }, // 2x 3.90 = 7.80
      { productId: 'olive-bella-cerignola-dop', quantity: 1 }, // 1x 6.50 = 6.50
      { productId: 'carciofini-grigliati-olio-evo', quantity: 1 }, // 1x 7.80 = 7.80
      { productId: 'vincotto-tradizionale-pugliese', quantity: 1 }, // 1x 8.50 = 8.50
      { productId: 'pasticciotti-leccesi-monodose', quantity: 1 }, // 1x 8.90 = 8.90
      { productId: 'biscotti-cegliesi-paste-mandorla', quantity: 1 }, // 1x 7.90 = 7.90
    ],
    // Totale stimato: 55 + 19.50 + 16.50 + 14.80 + 8.90 + 8.80 + 7.80 + 6.50 + 7.80 + 8.50 + 8.90 + 7.90 = 170.90€
    // Peso stimato: ~12.2 kg (rispetta limite 15 kg!)
  },
];

/**
 * Utility to calculate total price, weight and resolve products for a preconfigured box
 */
export function resolvePreconfiguredBoxDetails(
  box: PreconfiguredBox,
  allProducts: Product[]
): {
  resolvedItems: { product: Product; quantity: number }[];
  totalPrice: number;
  totalWeightKg: number;
  totalVolumeLiters: number;
  hasRefrigerated: boolean;
} {
  const resolvedItems: { product: Product; quantity: number }[] = [];
  let totalPrice = 0;
  let totalWeightKg = 0;
  let totalVolumeLiters = 0;
  let hasRefrigerated = false;

  for (const item of box.items) {
    const prod = allProducts.find((p) => p.id === item.productId);
    if (prod) {
      resolvedItems.push({ product: prod, quantity: item.quantity });
      totalPrice += prod.price * item.quantity;
      totalWeightKg += prod.weightKg * item.quantity;
      totalVolumeLiters += prod.volumeLiters * item.quantity;
      if (prod.isRefrigerated) {
        hasRefrigerated = true;
      }
    }
  }

  return {
    resolvedItems,
    totalPrice: Math.round(totalPrice * 100) / 100,
    totalWeightKg: Math.round(totalWeightKg * 100) / 100,
    totalVolumeLiters: Math.round(totalVolumeLiters * 10) / 10,
    hasRefrigerated,
  };
}
