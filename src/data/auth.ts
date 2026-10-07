export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'customer' | 'admin';
  provider: 'google' | 'apple' | 'email';
  address?: {
    street: string;
    city: string;
    postalCode: string;
    phone: string;
  };
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  destination: string;
  courierName: string;
  trackingCode: string;
  totalWeightKg: number;
  totalVolumeLiters: number;
  itemsCount: number;
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
  status: 'in_preparazione' | 'controllo_peso' | 'spedito' | 'consegnato';
  itemsSummary: string;
  customNote?: string;
  hasRefrigerated: boolean;
}

export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'PUG-2026-8841',
    createdAt: 'Oggi, 10:15',
    customerName: 'Marco Antonacci',
    customerEmail: 'marco.antonacci@example.com',
    destination: 'Milano (MI) - Via Tortona 24',
    courierName: 'BRT Bartolini Espresso',
    trackingCode: 'PUG-BRT-99201481',
    totalWeightKg: 6.77,
    totalVolumeLiters: 11.7,
    itemsCount: 8,
    subtotal: 89.10,
    shippingCost: 10.95,
    grandTotal: 100.05,
    status: 'in_preparazione',
    itemsSummary: 'Olio EVO 3L, Orecchiette x2, Taralli x2, Cime di Rapa, Capocollo, Caciocavallo',
    customNote: 'Con tanto affetto da Bari! Goditi i veri sapori di Puglia per gli esami a Milano.',
    hasRefrigerated: true,
  },
  {
    id: 'ord-102',
    orderNumber: 'PUG-2026-8839',
    createdAt: 'Ieri, 16:40',
    customerName: 'Giulia De Santis',
    customerEmail: 'giulia.ds@example.com',
    destination: 'Torino (TO) - Corso Francia 112',
    courierName: 'GLS Express Safe Food',
    trackingCode: 'PUG-GLS-44182901',
    totalWeightKg: 11.40,
    totalVolumeLiters: 16.5,
    itemsCount: 12,
    subtotal: 134.50,
    shippingCost: 14.34,
    grandTotal: 148.84,
    status: 'spedito',
    itemsSummary: 'Burrata x2, Primitivo DOC x2, Orecchiette Arse x4, Taralli Finocchietto x4',
    customNote: 'Per il pranzo della domenica con i colleghi. Fagli sentire cosa significa mangiare pugliese!',
    hasRefrigerated: true,
  },
  {
    id: 'ord-103',
    orderNumber: 'PUG-2026-8832',
    createdAt: '2 giorni fa',
    customerName: 'Alessandro Rossi',
    customerEmail: 'a.rossi@example.com',
    destination: 'Bologna (BO) - Via Zamboni 45',
    courierName: 'Poste Italiane Crono',
    trackingCode: 'PUG-POS-77182900',
    totalWeightKg: 5.20,
    totalVolumeLiters: 8.2,
    itemsCount: 5,
    subtotal: 58.20,
    shippingCost: 8.60,
    grandTotal: 66.80,
    status: 'consegnato',
    itemsSummary: 'Friselle Salentine x2, Pomodori secchi x2, Olio Grottaglie 500ml',
    customNote: 'Un assaggio di Salento per la casa nuova.',
    hasRefrigerated: false,
  },
];

export const DEMO_CUSTOMER: User = {
  id: 'usr-demo-1',
  name: 'Marco Antonacci',
  email: 'marco.antonacci@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  role: 'customer',
  provider: 'google',
  address: {
    street: 'Via Tortona 24',
    city: 'Milano (MI)',
    postalCode: '20144',
    phone: '+39 340 123 4567',
  },
};

export const DEMO_ADMIN: User = {
  id: 'usr-admin-1',
  name: 'Domenico Antonacci (Admin Puglia)',
  email: 'domenicoantonacci@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  role: 'admin',
  provider: 'google',
};
