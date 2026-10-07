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

// Credentials for Admin Access explicitly specified by user:
// admin nome_utente
// admin password
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
} as const;

export interface RegisteredAccount extends User {
  passwordHash?: string;
}

// Local storage helpers for registered users
const STORAGE_KEY_REGISTERED_USERS = 'puglia_registered_users';

export function getRegisteredUsers(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRegisteredUser(account: RegisteredAccount): void {
  try {
    const users = getRegisteredUsers();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === account.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = account;
    } else {
      users.push(account);
    }
    localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered user', e);
  }
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
    totalWeightKg: 6.46,
    totalVolumeLiters: 11.2,
    itemsCount: 8,
    subtotal: 83.50,
    shippingCost: 10.75,
    grandTotal: 94.25,
    status: 'in_preparazione',
    itemsSummary: 'Olio EVO 3L, Orecchiette x2, Taralli x2, Capocollo, Cime di Rapa, Biscotti Cegliesi',
    customNote: 'Con tanto affetto dalla Puglia! Goditi i veri sapori di casa per gli esami.',
    hasRefrigerated: false,
  },
  {
    id: 'ord-102',
    orderNumber: 'PUG-2026-8839',
    createdAt: 'Ieri, 16:40',
    customerName: 'Claire Laurent',
    customerEmail: 'claire.laurent@gmail.com',
    destination: 'Parigi (Francia) - Rue de Rivoli 14',
    courierName: 'DHL Express Food Line',
    trackingCode: 'PUG-DHL-44182901',
    totalWeightKg: 11.20,
    totalVolumeLiters: 15.4,
    itemsCount: 10,
    subtotal: 128.50,
    shippingCost: 28.40,
    grandTotal: 156.90,
    status: 'spedito',
    itemsSummary: 'Olio EVO 5L, Canestrato DOP x2, Caciocavallo Podolico x2, Taralli Cipolla x4',
    customNote: 'Un assaggio autentico di Puglia a Parigi!',
    hasRefrigerated: false,
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
    itemsSummary: 'Friselle Salentine x2, Pomodori secchi x2, Sughetto Manduria x2',
    customNote: 'Un assaggio di Salento per la casa nuova.',
    hasRefrigerated: false,
  },
];
