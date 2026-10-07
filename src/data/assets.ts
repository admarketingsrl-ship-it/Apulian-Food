// Central image asset manager ensuring 100% reliable image URLs on Vercel, GitHub Pages & local dev
import biscottiCegliesiImg from '../assets/images/biscotti_cegliesi_1791398948285.jpg';
import burrataAndriaImg from '../assets/images/burrata_andria_1791396921500.jpg';
import caciocavalloCheeseImg from '../assets/images/caciocavallo_cheese_1791396972081.jpg';
import canestratoDopImg from '../assets/images/canestrato_dop_1791398937360.jpg';
import capocolloMartinaImg from '../assets/images/capocollo_martina_1791396943423.jpg';
import cimeDiRapaImg from '../assets/images/cime_di_rapa_1791396999899.jpg';
import friselleSalentineImg from '../assets/images/friselle_salentine_1791396983646.jpg';
import lampascioniVasettoImg from '../assets/images/lampascioni_vasetto_1791398924651.jpg';
import olioEvoPugliaImg from '../assets/images/olio_evo_puglia_1791396932701.jpg';
import orecchiettePastaImg from '../assets/images/orecchiette_pasta_1791396887923.jpg';
import pasticciottiLeccesiImg from '../assets/images/pasticciotti_leccesi_1791396960750.jpg';
import piattoOrecchietteImg from '../assets/images/piatto_orecchiette_1791400818407.jpg';
import primitivoManduriaImg from '../assets/images/primitivo_di_manduria_1791397011105.jpg';
import sughettoPomodorinoImg from '../assets/images/sughetto_pomodorino_1791398978409.jpg';
import tagliereAperitivoImg from '../assets/images/tagliere_aperitivo_1791400831976.jpg';
import taralliPugliesiImg from '../assets/images/taralli_pugliesi_1791396905776.jpg';
import vincottoPuglieseImg from '../assets/images/vincotto_pugliese_1791398962325.jpg';
import oliveCerignolaImg from '../assets/images/olive_cerignola_1791405945700.jpg';
import carciofiniPugliesiImg from '../assets/images/carciofini_pugliesi_1791405958187.jpg';
import soppressataPuglieseImg from '../assets/images/soppressata_pugliese_1791405969271.jpg';

export const ASSET_IMAGES = {
  biscottiCegliesi: biscottiCegliesiImg,
  burrataAndria: burrataAndriaImg,
  caciocavalloCheese: caciocavalloCheeseImg,
  canestratoDop: canestratoDopImg,
  capocolloMartina: capocolloMartinaImg,
  cimeDiRapa: cimeDiRapaImg,
  friselleSalentine: friselleSalentineImg,
  lampascioniVasetto: lampascioniVasettoImg,
  olioEvoPuglia: olioEvoPugliaImg,
  orecchiettePasta: orecchiettePastaImg,
  pasticciottiLeccesi: pasticciottiLeccesiImg,
  piattoOrecchiette: piattoOrecchietteImg,
  primitivoManduria: primitivoManduriaImg,
  sughettoPomodorino: sughettoPomodorinoImg,
  tagliereAperitivo: tagliereAperitivoImg,
  taralliPugliesi: taralliPugliesiImg,
  vincottoPugliese: vincottoPuglieseImg,
  oliveCerignola: oliveCerignolaImg,
  carciofiniPugliesi: carciofiniPugliesiImg,
  soppressataPugliese: soppressataPuglieseImg,
} as const;

// Reliable fallback SVG for gastronomic products in case of any network glitch
export const FALLBACK_FOOD_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450" fill="%23f6f3ed"><rect width="100%" height="100%" fill="%23f6f3ed"/><circle cx="300" cy="210" r="70" fill="%23e8e2d5"/><text x="50%" y="215" font-family="serif" font-size="28" fill="%23685e52" text-anchor="middle" dominant-baseline="middle">Puglia In Scatola</text><text x="50%" y="320" font-family="sans-serif" font-size="14" fill="%239c9488" text-anchor="middle" letter-spacing="2">ECCELLENZA PUGLIESE</text></svg>';
