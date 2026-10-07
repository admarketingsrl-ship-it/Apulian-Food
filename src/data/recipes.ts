import { ASSET_IMAGES } from './assets';

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Facile' | 'Media';
  timeMinutes: number;
  servings: string;
  category: 'primi' | 'aperitivi' | 'taglieri' | 'dolci';
  categoryLabel: string;
  image: string;
  story: string;
  boxProductIds: string[]; // references products from products.ts
  otherIngredients: string[];
  steps: string[];
  chefTip: string;
}

export const RECIPES: Recipe[] = [
  {
    id: 'orecchiette-cime-di-rapa',
    title: 'Orecchiette alle Cime di Rapa e Crunch di Tarallo',
    subtitle: 'Il capolavoro della cucina barese, pronto in 15 minuti anche all\'estero',
    difficulty: 'Facile',
    timeMinutes: 15,
    servings: '4 persone',
    category: 'primi',
    categoryLabel: 'Primi Piatti',
    image: ASSET_IMAGES.piattoOrecchiette,
    story: 'La ricetta simbolo di Puglia. Quando ti trovi in Francia o lontano da casa e non hai le cime di rapa fresche di campo, il nostro vasetto artigianale in olio EVO conserva intatto il sapore amarognolo autentico e le spezie nostrane.',
    boxProductIds: [
      'orecchiette-semola-bronzo',
      'cime-di-rapa-crema-vasetto',
      'olio-evo-latta-3l',
      'taralli-pugliesi-artigianali',
    ],
    otherIngredients: ['1 spicchio d\'aglio', 'Sale grosso per l\'acqua di cottura'],
    steps: [
      'Porta a ebollizione una pentola capiente d\'acqua salata e cala le orecchiette di semola (cottura circa 11-12 minuti al dente).',
      'In una padella larga, scalda tre cucchiai abbondanti di Olio EVO Coratina con uno spicchio d\'aglio schiacciato.',
      'Aggiungi il vasetto di Cime di Rapa sott\'olio con la loro crema e lascia insaporire a fuoco dolce per 3 minuti.',
      'Sbriciola grossolanamente a mano 2 taralli pugliesi e falli tostare in un padellino a secco per un minuto.',
      'Scola le orecchiette conservando mezzo mestolo di acqua di cottura, saltale nella padella con le cime di rapa fino a legare il sugo.',
      'Impiatta rifinendo con un filo a crudo di Olio EVO e la pioggia di tarallo croccante (la famosa "mollica dei poveri").'
    ],
    chefTip: 'La sbriciolata di tarallo all\'olio EVO sostituisce la classica mollica fritta donando una nota croccante e profumata irresistibile.',
  },
  {
    id: 'friselle-pomodorino-origano',
    title: 'Friselle Salentine Tradizionali al Pomodoro e Olio Coratina',
    subtitle: 'Il rito dell\'estate pugliese: freschezza immediata e sapore mediterraneo',
    difficulty: 'Facile',
    timeMinutes: 5,
    servings: '2-4 persone',
    category: 'aperitivi',
    categoryLabel: 'Aperitivi & Antipasti',
    image: ASSET_IMAGES.friselleSalentine,
    story: 'Nate come pane dei marinai e dei contadini del Salento, le friselle d\'orzo o grano duro sono la quintessenza del pasto estivo pugliese: leggere, profumate e pronte in un istante.',
    boxProductIds: [
      'friselle-grano-orzo',
      'sughetto-pomodorino-manduria',
      'pomodori-secchi-pate-vasetto',
      'olio-evo-latta-3l',
    ],
    otherIngredients: ['Pomodorini freschi a cubetti', 'Origano selvatico secco', 'Sale fino'],
    steps: [
      'Prepara una ciotola con acqua fresca e immergi le friselle per 4-5 secondi esatti (non di più: la frisella deve rimanere friabile al centro).',
      'Disponi le friselle umide sui piatti da portata.',
      'Condisci generosamente con tocchetti di pomodoro o un cucchiaio di sughetto dolce di Manduria e falde di pomodori secchi.',
      'Spolvera con origano selvatico e irrora con generoso Olio EVO Coratina.',
      'Lascia riposare due minuti prima di gustare per consentire all\'olio di penetrare nella biscottatura.'
    ],
    chefTip: 'Il segreto della vera "sponzatura": l\'acqua deve solo inumidire la superficie; sarà poi il succo del pomodoro e l\'olio buono a rendere la frisella perfetta.',
  },
  {
    id: 'tagliere-martina-lampascioni',
    title: 'Aperitivo delle Murge: Capocollo, Canestrato DOP & Lampascioni',
    subtitle: 'Il benvenuto pugliese con i sapori intensi della Valle d\'Itria',
    difficulty: 'Facile',
    timeMinutes: 10,
    servings: '4 persone',
    category: 'taglieri',
    categoryLabel: 'Taglieri & Sfizi',
    image: ASSET_IMAGES.tagliereAperitivo,
    story: 'L\'eleganza della norcineria di Martina Franca incontra il carattere unico del formaggio Canestrato e la piacevole nota amaricante dei lampascioni selvatici della Murgia.',
    boxProductIds: [
      'capocollo-martina-franca-sottovuoto',
      'canestrato-pugliese-dop',
      'lampascioni-sottolio-vasetto',
      'taralli-pugliesi-artigianali',
    ],
    otherIngredients: ['Pane casereccio o olive nere dolci'],
    steps: [
      'Estrai il Capocollo di Martina Franca e il Canestrato DOP dal sottovuoto circa 20 minuti prima di servire, per consentire ai profumi di aprirsi a temperatura ambiente.',
      'Affetta il Capocollo a fette sottilissime e taglia il Canestrato a scaglie o piccoli triangoli.',
      'Disponi i salumi e i formaggi su un tagliere di legno o vassoio in ceramica.',
      'Adagia al centro una ciotolina con i Lampascioni sott\'olio sgocciolati e accompagna con abbondanti Taralli pugliesi friabili.'
    ],
    chefTip: 'Servi con un calice di vino rosso strutturato. La leggera speziatura al fragno del capocollo si sposa divinamente con la pasta compatta del Canestrato.',
  },
  {
    id: 'caciocavallo-gocce-vincotto',
    title: 'Caciocavallo Podolico & Canestrato con Gocce di Vincotto',
    subtitle: 'Accostamento nobile tra pasta filata stagionata e riduzione d\'uva e fichi',
    difficulty: 'Facile',
    timeMinutes: 5,
    servings: '4 persone',
    category: 'taglieri',
    categoryLabel: 'Taglieri & Sfizi',
    image: ASSET_IMAGES.canestratoDop,
    story: 'Uno dei più raffinati abbinamenti della tavola pugliese: la sapidità minerale del Caciocavallo Podolico del Gargano esaltata dalla dolcezza vellutata e complessa del Vincotto tradizionale.',
    boxProductIds: [
      'caciocavallo-podolico-stagionato',
      'canestrato-pugliese-dop',
      'vincotto-tradizionale-pugliese',
      'taralli-pugliesi-artigianali',
    ],
    otherIngredients: ['Gherigli di noci o mandorle'],
    steps: [
      'Taglia il Caciocavallo Podolico e il Canestrato DOP a cubotti regolari.',
      'Disponili a corona su un piatto piano.',
      'Fai cadere un filo sottile di Vincotto tradizionale d\'uva e fichi direttamente sulle scaglie di formaggio.',
      'Accompagna con taralli al finocchietto per un contrasto aromatico straordinario.'
    ],
    chefTip: 'Il Vincotto non è aceto balsamico: non contiene acidità ma una densa nota caramellata naturale che bilancia alla perfezione la piccantezza della stagionatura.',
  },
  {
    id: 'orecchiette-pomodorino-manduria',
    title: 'Orecchiette al Sughetto di Pomodorino di Manduria & Canestrato',
    subtitle: 'Il comfort food domenicale di ogni famiglia pugliese',
    difficulty: 'Facile',
    timeMinutes: 15,
    servings: '4 persone',
    category: 'primi',
    categoryLabel: 'Primi Piatti',
    image: ASSET_IMAGES.sughettoPomodorino,
    story: 'La dolcezza inimitabile dei pomodorini maturati sotto il sole cocente di Manduria unita alla trafilatura ruvida delle orecchiette di Senatore Cappelli. Il vero profumo di casa.',
    boxProductIds: [
      'orecchiette-semola-bronzo',
      'sughetto-pomodorino-manduria',
      'canestrato-pugliese-dop',
      'olio-evo-latta-3l',
    ],
    otherIngredients: ['Foglie di basilico fresco', 'Sale grosso'],
    steps: [
      'Lessa le orecchiette in abbondante acqua bollente salata per 11 minuti.',
      'In una padella riscalda a fiamma moderata il sughetto pronto di pomodorino con due cucchiai di Olio EVO.',
      'Scola la pasta e tuffala direttamente nel sugo rosso e denso.',
      'Spadella energicamente per un minuto mantecando con abbondante Canestrato DOP grattugiato finemente a pioggia.',
      'Servi fumante completando con foglie di basilico fresco e un filo d\'olio crudo.'
    ],
    chefTip: 'Grattugia il Canestrato DOP a fori medi: sciogliendosi col calore del sughetto formerà una crema deliziosa attorno a ogni orecchietta.',
  },
  {
    id: 'pausa-dolce-mandorla-vincotto',
    title: 'Pausa Dolce: Biscotti Cegliesi e Mosto Cotto',
    subtitle: 'La conclusione aristocratica con mandorla pugliese e sentori di fichi',
    difficulty: 'Facile',
    timeMinutes: 2,
    servings: '4 persone',
    category: 'dolci',
    categoryLabel: 'Dolci Tipici',
    image: ASSET_IMAGES.biscottiCegliesi,
    story: 'Il Biscotto di Ceglie Messapica, Presidio Slow Food a base di mandorle tostate, miele e marmellata d\'amarena, servito secondo l\'usanza con poche gocce di Vincotto.',
    boxProductIds: [
      'biscotti-cegliesi-paste-mandorla',
      'vincotto-tradizionale-pugliese',
    ],
    otherIngredients: ['Caffè espresso caldo'],
    steps: [
      'Disponi i Biscotti Cegliesi su un piattino da dessert.',
      'Accompagna con un piccolo calice da degustazione o una coppetta con Vincotto tradizionale.',
      'Intingi leggermente la punta del biscotto nel Vincotto prima del morso per esaltare la pasta di mandorla tostata.'
    ],
    chefTip: 'Ideale a fine pasto o per una merenda pomeridiana accompagnata da un buon caffè espresso amaro.',
  }
];
