export interface Product {
  id: string;
  name: string;
  category: 'prodotti-da-forno' | 'salumi-formaggi' | 'sottoli-conserve' | 'extra-dolci';
  categoryLabel: string;
  price: number; // in euro
  weightKg: number; // in kg
  volumeLiters: number; // in dm³ / liters (for 50x50x50 = 125L box)
  image: string;
  description: string;
  origin: string; // e.g. "Andria (BT)", "Martina Franca (TA)"
  badges: string[];
  isRefrigerated?: boolean; // requires cool packing
  fragility: 'bassa' | 'media' | 'alta';
  stock?: number;
  travelResistantNote?: string; // note explaining why it travels perfectly
}

export const CATEGORIES = [
  { id: 'tutti', label: 'Tutti i Prodotti Spedibili', icon: 'Sparkles' },
  { id: 'prodotti-da-forno', label: '1. Prodotti da Forno (Leggeri & Resistenti)', icon: 'Cookie' },
  { id: 'salumi-formaggi', label: '2. Salumi & Formaggi Stagionati (Sottovuoto)', icon: 'UtensilsCrossed' },
  { id: 'sottoli-conserve', label: '3. Sottoli, Conserve & Condimenti', icon: 'Droplets' },
  { id: 'extra-dolci', label: '4. Extra & Dolci a Lunga Conservazione', icon: 'Cake' },
] as const;

export const PRODUCTS: Product[] = [
  // --- 1. PRODOTTI DA FORNO (Leggeri e resistenti) ---
  {
    id: 'taralli-pugliesi-artigianali',
    name: 'Taralli Pugliesi Artigianali (Classici, Finocchietto, Cipolla o Peperoncino)',
    category: 'prodotti-da-forno',
    categoryLabel: 'Prodotti da Forno',
    price: 3.20,
    weightKg: 0.38,
    volumeLiters: 1.4,
    image: '/src/assets/images/taralli_pugliesi_1791396905776.jpg',
    description: 'Essendo secchi e confezionati in buste protettive, non temono il viaggio, non appesantiscono il pacco e si conservano per mesi. In Francia e all\'estero non troverai mai la consistenza friabile e l\'olio buono dei veri taralli da forno pugliesi bolliti.',
    origin: 'Alberobello & Bitonto (BA)',
    badges: ['Bolliti come una volta', 'Zero Umidità', 'Lunga Conservazione'],
    fragility: 'bassa',
    stock: 150,
    travelResistantNote: 'Resiste mesi senza degradare. Perfetto per viaggiare in Europa.',
  },
  {
    id: 'friselle-grano-orzo',
    name: 'Friselle Pugliesi di Grano Duro o d\'Orzo Macinato a Pietra (500g)',
    category: 'prodotti-da-forno',
    categoryLabel: 'Prodotti da Forno',
    price: 3.90,
    weightKg: 0.52,
    volumeLiters: 2.2,
    image: '/src/assets/images/friselle_salentine_1791396983646.jpg',
    description: 'Leggerissime, occupano volume protettivo nel pacco ma pesano pochissimo. Spedire una confezione di friselle significa avere la base pronta per tutta l\'estate, da "sponzare" in acqua e condire con pomodoro e abbondante olio EVO.',
    origin: 'Salento & Murgia',
    badges: ['Leggerissime nel pacco', 'Biscottatura Tradizionale', 'Estivo'],
    fragility: 'media',
    stock: 110,
    travelResistantNote: 'Pesano poco (0.5kg) e riempiono bene la scatola 50×50×50 proteggendo i vasetti.',
  },
  {
    id: 'orecchiette-semola-bronzo',
    name: 'Orecchiette di Semola di Grano Duro Senatore Cappelli (Trafilate al Bronzo, 500g)',
    category: 'prodotti-da-forno',
    categoryLabel: 'Prodotti da Forno',
    price: 3.90,
    weightKg: 0.52,
    volumeLiters: 1.2,
    image: '/src/assets/images/orecchiette_pasta_1791396887923.jpg',
    description: 'La pasta secca industriale estera o francese non ha la stessa tenuta in cottura né la stessa ruvidezza per trattenere il sugo. Una scorta di vere orecchiette pugliesi essiccate a bassa temperatura viaggia alla perfezione senza rischiare rotture.',
    origin: 'Bari Vecchia & Tavoliere',
    badges: ['Trafilata al Bronzo', '100% Grano Duro Pugliese', 'Tenuta Perfetta'],
    fragility: 'bassa',
    stock: 130,
    travelResistantNote: 'Pasta secca dura che non subisce alcun danno durante il transito postale.',
  },

  // --- 2. SALUMI E FORMAGGI STAGIONATI (Sottovuoto) ---
  {
    id: 'capocollo-martina-franca-sottovuoto',
    name: 'Capocollo di Martina Franca Presidio Slow Food (Trancio Sottovuoto 650g)',
    category: 'salumi-formaggi',
    categoryLabel: 'Salumi & Formaggi Stagionati',
    price: 19.50,
    weightKg: 0.68,
    volumeLiters: 1.1,
    image: '/src/assets/images/capocollo_martina_1791396943423.jpg',
    description: 'Trattandosi di un salume stagionato e insaccato, sigillato sottovuoto professionale, resiste benissimo a molti giorni di transito postale senza alcun problema o alterazione. Un vero lusso gastronomico introvabile nei negozi all\'estero.',
    origin: 'Martina Franca - Valle d\'Itria (TA)',
    badges: ['Presidio Slow Food', 'Sottovuoto Ermetico', 'Affumicato al Fragno'],
    fragility: 'bassa',
    stock: 45,
    travelResistantNote: 'Confezionato sottovuoto resistente, non necessita di borsa frigo sotto i 20°C.',
  },
  {
    id: 'canestrato-pugliese-dop',
    name: 'Canestrato Pugliese DOP Stagionato 10 Mesi (Trancio Sottovuoto 500g)',
    category: 'salumi-formaggi',
    categoryLabel: 'Salumi & Formaggi Stagionati',
    price: 14.80,
    weightKg: 0.54,
    volumeLiters: 0.9,
    image: '/src/assets/images/canestrato_dop_1791398937360.jpg',
    description: 'I formaggi duri e semiduri stagionati viaggiano magnificamente, soprattutto se confezionati sottovuoto. Il Canestrato DOP, pressato nei tipici canestri di giunco, sprigiona un aroma intenso di pascoli murgiani perfetto da grattugiare o gustare a scaglie.',
    origin: 'Murgia & Tavoliere delle Puglie',
    badges: ['DOP Certificata', 'Pasta Dura Stagionata', 'Sottovuoto'],
    fragility: 'bassa',
    stock: 50,
    travelResistantNote: 'Formaggio a pasta dura a bassissima umidità, resiste a qualsiasi viaggio.',
  },
  {
    id: 'caciocavallo-podolico-stagionato',
    name: 'Caciocavallo Podolico del Gargano Semistagionato (Trancio Sottovuoto 550g)',
    category: 'salumi-formaggi',
    categoryLabel: 'Salumi & Formaggi Stagionati',
    price: 16.50,
    weightKg: 0.60,
    volumeLiters: 1.1,
    image: '/src/assets/images/caciocavallo_cheese_1791396972081.jpg',
    description: 'Ottimo da spedire, non teme il viaggio e mantiene intatto il suo aroma inconfondibile e la consistenza compatta. Prodotto con latte di vacche Podoliche al pascolo brado nel Parco Nazionale del Gargano.',
    origin: 'Monte Sant\'Angelo & Gargano (FG)',
    badges: ['Presidio Tradizionale', 'Sottovuoto', 'Inalterabile in Viaggio'],
    fragility: 'bassa',
    stock: 40,
    travelResistantNote: 'Stagionatura ottimale che garantisce stabilità termica e aromatica.',
  },

  // --- 3. SOTTOLI, CONSERVE E CONDIMENTI (In vaso di vetro o latta) ---
  {
    id: 'cime-di-rapa-crema-vasetto',
    name: 'Cime di Rapa in Crema o Sott\'Olio EVO / Paté Pugliese (Vasetto 280g)',
    category: 'sottoli-conserve',
    categoryLabel: 'Sottoli & Conserve',
    price: 6.90,
    weightKg: 0.52,
    volumeLiters: 0.6,
    image: '/src/assets/images/cime_di_rapa_1791396999899.jpg',
    description: 'Indispensabile per fare la classica pasta con le cime di rapa quando in Francia o all\'estero non si trovano quelle fresche di campo. I vasetti di vetro viaggiano benissimo avvolti nella paglietta protettiva speciale della scatola.',
    origin: 'Foggia & Barletta (BT)',
    badges: ['Ricetta Tradizionale', 'Olio Extravergine', 'Vetro Sigillato'],
    fragility: 'media',
    stock: 80,
    travelResistantNote: 'Chiusura ermetica a vite protetta con pluriball antiurto.',
  },
  {
    id: 'lampascioni-sottolio-vasetto',
    name: 'Lampascioni Pugliesi Sott\'Olio EVO Nostrani (Vasetto 314ml)',
    category: 'sottoli-conserve',
    categoryLabel: 'Sottoli & Conserve',
    price: 7.50,
    weightKg: 0.56,
    volumeLiters: 0.6,
    image: '/src/assets/images/lampascioni_vasetto_1791398924651.jpg',
    description: 'Un vero e proprio elisir della terra pugliese, assolutamente introvabile nei supermercati francesi o europei. Bulbi selvatici leggermente amarognoli, scottati in aceto di vino e immersi in olio extravergine d\'oliva.',
    origin: 'Tavoliere & Murgia Barese',
    badges: ['Introvabile all\'Estero', 'Gusto Tradizionale', 'Erba Selvatica'],
    fragility: 'media',
    stock: 65,
    travelResistantNote: 'Prodotto conservato in olio che dura oltre 24 mesi a temperatura ambiente.',
  },
  {
    id: 'pomodori-secchi-pate-vasetto',
    name: 'Pomodori Secchi Pugliesi al Sole Sott\'Olio EVO & Paté (Vasetto 314ml)',
    category: 'sottoli-conserve',
    categoryLabel: 'Sottoli & Conserve',
    price: 6.20,
    weightKg: 0.55,
    volumeLiters: 0.6,
    image: '/src/assets/images/cime_di_rapa_1791396999899.jpg',
    description: 'Essiccati naturalmente al caldo sole di Puglia su stuoie e invasati con origano e capperi. Ottimi per arricchire panini, friselle estive, crostini d\'aperitivo o dare una marcia in più a sughi al volo.',
    origin: 'Cerignola & Cerignola (FG)',
    badges: ['Essiccati al Sole', 'Ideale per Crostini', 'Vetro Sigillato'],
    fragility: 'media',
    stock: 90,
    travelResistantNote: 'Conserva robusta, confezionata con coperchio click-clack.',
  },
  {
    id: 'sughetto-pomodorino-manduria',
    name: 'Sughetto Pronto Artigianale di Pomodorino di Manduria o Gargano (Vasetto 350g)',
    category: 'sottoli-conserve',
    categoryLabel: 'Sottoli & Conserve',
    price: 4.80,
    weightKg: 0.58,
    volumeLiters: 0.6,
    image: '/src/assets/images/sughetto_pomodorino_1791398978409.jpg',
    description: 'I pelati e le passate artigianali pugliesi (specie il pomodorino fiaschetto o datterino) hanno una dolcezza naturale e corposità che batte qualsiasi pomodoro da supermercato estero o francese. Pronto da scaldare sulle orecchiette.',
    origin: 'Manduria (TA) & Torre Guaceto (BR)',
    badges: ['Dolcezza Naturale', 'Senza Conservanti', 'Pronto all\'Uso'],
    fragility: 'media',
    stock: 120,
    travelResistantNote: 'Vaso in vetro resistente, protegge la freschezza del pomodoro maturato al sole.',
  },

  // --- 4. EXTRA E DOLCI A LUNGA CONSERVAZIONE ---
  {
    id: 'olio-evo-latta-3l',
    name: 'Olio Extravergine d\'Oliva Pugliese Coratina in Lattina (Latta 3 Litri)',
    category: 'extra-dolci',
    categoryLabel: 'Extra & Dolci a Lunga Conservazione',
    price: 35.00,
    weightKg: 3.10,
    volumeLiters: 4.2,
    image: '/src/assets/images/olio_evo_puglia_1791396932701.jpg',
    description: 'Per la spedizione postale, l\'olio in latta metallica è la soluzione ideale rispetto al vetro perché è indistruttibile, salvaguarda l\'olio dalla luce ed è più economico da spedire. Un olio fruttato intenso come la Coratina trasformerà qualsiasi piatto all\'estero.',
    origin: 'Bitonto & Corato (BA)',
    badges: ['Indistruttibile in Latta', 'Fruttato Intenso', 'Coratina 100%'],
    fragility: 'bassa',
    stock: 55,
    travelResistantNote: 'Latta d\'acciaio serigrafata a tenuta stagna. Impossibile da rompere nei trasporti.',
  },
  {
    id: 'vincotto-tradizionale-pugliese',
    name: 'Vincotto Tradizionale o Mosto Cotto Pugliese d\'Uva e Fichi (Bottiglia 250ml)',
    category: 'extra-dolci',
    categoryLabel: 'Extra & Dolci a Lunga Conservazione',
    price: 8.50,
    weightKg: 0.55,
    volumeLiters: 0.5,
    image: '/src/assets/images/vincotto_pugliese_1791398962325.jpg',
    description: 'La storica riduzione dolce pugliese ottenuta dalla lenta cottura del mosto d\'uva e fichi maturi. Ottimo per bagnare dolci tipici come cartellate o per condire formaggi stagionati (come il Canestrato) e carni arrosto. Bottiglia in vetro ben sigillata.',
    origin: 'Salento & Valle d\'Itria',
    badges: ['Ricetta Storica', 'Dolcezza Naturale', 'Sigillo Ermetico'],
    fragility: 'media',
    stock: 50,
    travelResistantNote: 'Bottiglia sigillata con ceralacca protettiva salva-goccia.',
  },
  {
    id: 'biscotti-cegliesi-paste-mandorla',
    name: 'Biscotti Cegliesi Presidio Slow Food & Paste di Mandorla Pugliesi (Confezione 300g)',
    category: 'extra-dolci',
    categoryLabel: 'Extra & Dolci a Lunga Conservazione',
    price: 7.90,
    weightKg: 0.36,
    volumeLiters: 1.1,
    image: '/src/assets/images/biscotti_cegliesi_1791398948285.jpg',
    description: 'Deliziosi dolcetti tipici a base di pasta di mandorle pugliesi tostate racchiusi in scatola protettiva. Viaggiano benissimo senza sciogliersi e offrono una pausa dolce completamente diversa dalla pasticceria burrosa estera o francese.',
    origin: 'Ceglie Messapica (BR)',
    badges: ['Presidio Slow Food', 'Mandorle di Puglia', 'Lunga Durata'],
    fragility: 'bassa',
    stock: 75,
    travelResistantNote: 'Scatola solida salva-forma. Non risente del caldo durante il trasporto.',
  }
];

export interface CartItem {
  product: Product;
  quantity: number;
}

// Sample preloaded cart created with the newly requested shelf-stable travel products
export const INITIAL_SAMPLE_CART: CartItem[] = [
  {
    product: PRODUCTS.find(p => p.id === 'olio-evo-latta-3l')!,
    quantity: 1, // 3.10 kg, €35.00 (Latta indistruttibile)
  },
  {
    product: PRODUCTS.find(p => p.id === 'orecchiette-semola-bronzo')!,
    quantity: 2, // 1.04 kg, €7.80 (Orecchiette trafilate bronzo)
  },
  {
    product: PRODUCTS.find(p => p.id === 'taralli-pugliesi-artigianali')!,
    quantity: 2, // 0.76 kg, €6.40 (Taralli leggeri e resistenti)
  },
  {
    product: PRODUCTS.find(p => p.id === 'capocollo-martina-franca-sottovuoto')!,
    quantity: 1, // 0.68 kg, €19.50 (Sottovuoto stagionato)
  },
  {
    product: PRODUCTS.find(p => p.id === 'cime-di-rapa-crema-vasetto')!,
    quantity: 1, // 0.52 kg, €6.90 (Per la pasta con le cime di rapa)
  },
  {
    product: PRODUCTS.find(p => p.id === 'biscotti-cegliesi-paste-mandorla')!,
    quantity: 1, // 0.36 kg, €7.90 (Dolcezza pugliese a lunga conservazione)
  }
];
// Totale carrello d'esempio: 35 + 7.80 + 6.40 + 19.50 + 6.90 + 7.90 = €83.50 (supera ampiamente la spesa minima di 50€)
// Peso totale carrello d'esempio: 3.10 + 1.04 + 0.76 + 0.68 + 0.52 + 0.36 = 6.46 kg (ben al di sotto del limite di 15kg!)
