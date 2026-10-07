export interface ShippingProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  basePrice: number; // for up to 5kg
  perKgOver5kg: number; // additional cost per kg over 5kg
  deliveryTimeDays: string;
  insuranceIncluded: boolean;
  isCustom?: boolean;
  apiConnected?: boolean;
  contractCode?: string;
  features: string[];
}

export type DestinationZone = 'italia-penisola' | 'italia-isole' | 'europa-ovest';

export interface ZoneConfig {
  id: DestinationZone;
  label: string;
  description: string;
  surcharge: number;
  deliveryDaysAdd: number;
}

export const DESTINATION_ZONES: ZoneConfig[] = [
  {
    id: 'italia-penisola',
    label: 'Italia Continentale',
    description: 'Tutte le regioni peninsulari (Nord, Centro e Sud Italia)',
    surcharge: 0,
    deliveryDaysAdd: 0,
  },
  {
    id: 'italia-isole',
    label: 'Isole Maggiori & Calabria',
    description: 'Sicilia, Sardegna e destinazioni montane/calabre',
    surcharge: 3.80,
    deliveryDaysAdd: 1,
  },
  {
    id: 'europa-ovest',
    label: 'Europa (DE, FR, BE, NL, AT)',
    description: 'Pacco per emigrati o amici all\'estero in Unione Europea',
    surcharge: 14.50,
    deliveryDaysAdd: 2,
  },
];

export const DEFAULT_SHIPPING_PROVIDERS: ShippingProvider[] = [
  {
    id: 'brt-express',
    name: 'BRT Bartolini Corriere Espresso',
    logo: '🚚',
    description: 'Servizio di punta per consegne pesanti e pacchi alimentari fino a 15kg.',
    basePrice: 9.80,
    perKgOver5kg: 0.65,
    deliveryTimeDays: '24-48 ore',
    insuranceIncluded: true,
    features: ['Tracciamento live SMS', 'Sponda idraulica inclusa', 'Imballo anti-urto'],
  },
  {
    id: 'gls-italy',
    name: 'GLS Express Safe Food',
    logo: '📦',
    description: 'Velocità e affidabilità con consegna garantita al piano.',
    basePrice: 10.50,
    perKgOver5kg: 0.60,
    deliveryTimeDays: '24 ore',
    insuranceIncluded: true,
    features: ['Consegna al piano', 'Preavviso telefonico', 'Firma alla consegna'],
  },
  {
    id: 'dhl-fresh',
    name: 'DHL Express Food & Cold Line',
    logo: '❄️',
    description: 'Specifico per conserve, formaggi freschi e latticini con isolamento isotermico.',
    basePrice: 13.90,
    perKgOver5kg: 0.85,
    deliveryTimeDays: '24 ore garantite',
    insuranceIncluded: true,
    features: ['Box isotermico + Ghiaccio gel', 'Massima priorità', 'Zero shock termico'],
  },
  {
    id: 'poste-crono',
    name: 'Poste Italiane - Crono Box',
    logo: '📮',
    description: 'Economico ed esteso anche nei piccoli comuni e frazioni montane.',
    basePrice: 8.50,
    perKgOver5kg: 0.50,
    deliveryTimeDays: '48-72 ore',
    insuranceIncluded: false,
    features: ['Ritiro all\'ufficio postale', 'Copertura capillare 100%'],
  },
  {
    id: 'inpost-locker',
    name: 'InPost Punto di Ritiro & Locker',
    logo: '🏪',
    description: 'Ritira quando vuoi nei Locker 24/7 (max 50x50x50 cm). Eco-friendly.',
    basePrice: 6.90,
    perKgOver5kg: 0.40,
    deliveryTimeDays: '48 ore',
    insuranceIncluded: true,
    features: ['Disponibile 24/7 nei locker', 'Minori emissioni di CO2'],
  },
];

export const BOX_LIMITS = {
  maxWeightKg: 15.0,
  minOrderEuro: 50.0,
  boxDimensionsCm: {
    width: 50,
    height: 50,
    depth: 50,
  },
  totalVolumeLiters: 125, // 50 * 50 * 50 = 125,000 cm³ = 125L
  effectiveUsableLiters: 95, // Leaves 30L for wood straw, bubble wrap & shock absorption
  thermalPackFee: 4.50, // fee if box includes burrata/refrigerated goods
};

export interface ShippingCalculation {
  provider: ShippingProvider;
  zone: ZoneConfig;
  baseCost: number;
  weightSurcharge: number;
  zoneSurcharge: number;
  thermalFee: number;
  totalShippingCost: number;
  isFreeEligible: boolean; // free shipping above 150€
  estimatedDeliveryDate: string;
}

export function calculateShipping(
  provider: ShippingProvider,
  weightKg: number,
  zoneId: DestinationZone,
  hasRefrigeratedItems: boolean,
  cartTotalEuro: number
): ShippingCalculation {
  const zone = DESTINATION_ZONES.find(z => z.id === zoneId) || DESTINATION_ZONES[0];
  
  // Base cost from provider
  const baseCost = provider.basePrice;
  
  // Weight surcharge: charged for each kg over 5kg
  const excessKg = Math.max(0, weightKg - 5);
  const weightSurcharge = Math.round(excessKg * provider.perKgOver5kg * 100) / 100;
  
  // Zone surcharge
  const zoneSurcharge = zone.surcharge;
  
  // Thermal packaging fee if refrigerated items present and not DHL fresh (which already has it)
  const thermalFee = (hasRefrigeratedItems && provider.id !== 'dhl-fresh') ? BOX_LIMITS.thermalPackFee : 0;
  
  // Special promo: free shipping in Italy mainland if order >= 150€ and weight <= 15kg
  const isFreeEligible = cartTotalEuro >= 150 && zoneId === 'italia-penisola';
  
  const totalShippingCost = isFreeEligible 
    ? 0 
    : Math.round((baseCost + weightSurcharge + zoneSurcharge + thermalFee) * 100) / 100;

  // Calculate estimated date (Italian locale)
  const now = new Date();
  let daysToAdd = 2;
  if (provider.id === 'gls-italy' || provider.id === 'dhl-fresh') daysToAdd = 1;
  if (provider.id === 'poste-crono') daysToAdd = 3;
  daysToAdd += zone.deliveryDaysAdd;
  
  // skip weekends
  const targetDate = new Date(now);
  let added = 0;
  while (added < daysToAdd) {
    targetDate.setDate(targetDate.getDate() + 1);
    const day = targetDate.getDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }

  const daysOfWeek = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  const formattedDate = `${daysOfWeek[targetDate.getDay()]} ${targetDate.getDate()} ${months[targetDate.getMonth()]}`;

  return {
    provider,
    zone,
    baseCost,
    weightSurcharge,
    zoneSurcharge,
    thermalFee,
    totalShippingCost,
    isFreeEligible,
    estimatedDeliveryDate: formattedDate,
  };
}
