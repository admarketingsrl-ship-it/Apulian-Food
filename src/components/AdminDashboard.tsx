import React, { useState } from 'react';
import {
  Package,
  Scale,
  TrendingUp,
  Truck,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Search,
  X,
} from 'lucide-react';
import { Product, CATEGORIES } from '../data/products';
import { ShippingProvider, BOX_LIMITS } from '../data/shipping';
import { AdminOrder } from '../data/auth';

interface AdminDashboardProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  orders: AdminOrder[];
  onUpdateOrderStatus: (orderId: string, status: AdminOrder['status']) => void;
  shippingProviders: ShippingProvider[];
  onUpdateProvider: (provider: ShippingProvider) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  shippingProviders,
  onUpdateProvider,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'shipping'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchOrder, setSearchOrder] = useState<string>('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Product['category']>('prodotti-da-forno');
  const [newPrice, setNewPrice] = useState('9.50');
  const [newWeight, setNewWeight] = useState('0.50');
  const [newVolume, setNewVolume] = useState('1.0');
  const [newOrigin, setNewOrigin] = useState('Bari (BA)');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('/src/assets/images/taralli_pugliesi_1791396905776.jpg');

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalDispatchedWeight = orders.reduce((sum, o) => sum + o.totalWeightKg, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const pendingOrdersCount = orders.filter((o) => o.status === 'in_preparazione' || o.status === 'controllo_peso').length;

  const filteredOrders = orders.filter((order) => {
    if (orderFilter !== 'all' && order.status !== orderFilter) return false;
    if (searchOrder.trim()) {
      const q = searchOrder.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.destination.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const prod: Product = {
      id: `prod-${Date.now()}`,
      name: newName,
      category: newCategory,
      categoryLabel: CATEGORIES.find((c) => c.id === newCategory)?.label || 'Tipico Pugliese',
      price: parseFloat(newPrice) || 5.0,
      weightKg: parseFloat(newWeight) || 0.5,
      volumeLiters: parseFloat(newVolume) || 1.0,
      image: newImage,
      description: newDescription || 'Specialità artigianale selezionata.',
      origin: newOrigin,
      badges: ['Artigianale Pugliese'],
      fragility: 'bassa',
      stock: 50,
      travelResistantNote: 'Confezionato per resistere a lunga conservazione.',
    };
    onAddProduct(prod);
    setIsNewProductModalOpen(false);
    setNewName('');
    setNewDescription('');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans pb-16">
      {/* Admin Top Navbar */}
      <header className="bg-white border-b border-[#e7e2d8] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onExitAdmin}
              className="text-xs text-stone-600 hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
              <span>Torna al Negozio</span>
            </button>
            <span className="text-stone-300">/</span>
            <div>
              <span className="font-serif text-lg font-normal text-stone-900">
                Console Gestione Atelier
              </span>
            </div>
          </div>

          <div className="text-xs text-stone-400 font-light hidden sm:block">
            Controllo Scatole 50×50×50 cm · Max 15kg · Ordine Min. €50
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-8 w-full space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#e7e2d8]">
            <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 block mb-1">
              Fatturato Complessivo
            </span>
            <div className="font-serif text-2xl text-stone-900 font-normal">
              €{totalRevenue.toFixed(2)}
            </div>
            <p className="text-[11px] text-stone-400 font-light mt-1">
              Spedizioni e prodotti inclusi
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e7e2d8]">
            <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 block mb-1">
              Pacchi in Preparazione
            </span>
            <div className="font-serif text-2xl text-stone-900 font-normal">
              {pendingOrdersCount}
            </div>
            <p className="text-[11px] text-stone-400 font-light mt-1">
              In laboratorio in Puglia
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e7e2d8]">
            <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 block mb-1">
              Peso Totale Spedito
            </span>
            <div className="font-mono text-2xl text-stone-900 font-normal">
              {totalDispatchedWeight.toFixed(2)} kg
            </div>
            <p className="text-[11px] text-emerald-800 font-light mt-1">
              Tutti i colli conformi (≤15 kg)
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e7e2d8]">
            <span className="text-[10px] uppercase tracking-[0.16em] text-stone-400 block mb-1">
              Valore Medio Pacco
            </span>
            <div className="font-serif text-2xl text-stone-900 font-normal">
              €{averageOrderValue.toFixed(2)}
            </div>
            <p className="text-[11px] text-stone-400 font-light mt-1">
              Minimo €50 garantito
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-6 border-b border-[#e7e2d8] text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2.5 transition-colors cursor-pointer relative ${
              activeTab === 'orders' ? 'text-black font-medium' : 'text-stone-400 hover:text-black font-light'
            }`}
          >
            <span>Ordini e Spedizioni ({orders.length})</span>
            {activeTab === 'orders' && <span className="absolute bottom-0 left-0 right-0 h-px bg-black" />}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-2.5 transition-colors cursor-pointer relative ${
              activeTab === 'products' ? 'text-black font-medium' : 'text-stone-400 hover:text-black font-light'
            }`}
          >
            <span>Catalogo Prodotti ({products.length})</span>
            {activeTab === 'products' && <span className="absolute bottom-0 left-0 right-0 h-px bg-black" />}
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-2.5 transition-colors cursor-pointer relative ${
              activeTab === 'shipping' ? 'text-black font-medium' : 'text-stone-400 hover:text-black font-light'
            }`}
          >
            <span>Tariffe Corrieri ({shippingProviders.length})</span>
            {activeTab === 'shipping' && <span className="absolute bottom-0 left-0 right-0 h-px bg-black" />}
          </button>
        </div>

        {/* TAB: Ordini */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-[#e7e2d8] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.target.value)}
                  placeholder="Cerca ordine, destinatario..."
                  className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg bg-[#faf8f5] focus:outline-none focus:border-black font-light"
                />

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg bg-[#faf8f5] focus:outline-none font-light cursor-pointer"
                >
                  <option value="all">Tutti gli stati</option>
                  <option value="in_preparazione">In Preparazione</option>
                  <option value="controllo_peso">Controllo 50×50×50</option>
                  <option value="spedito">Spedito</option>
                  <option value="consegnato">Consegnato</option>
                </select>
              </div>

              <span className="text-[11px] text-stone-400">{filteredOrders.length} ordini</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-100 pb-2">
                  <tr>
                    <th className="py-2.5 px-3 font-medium">ID Ordine</th>
                    <th className="py-2.5 px-3 font-medium">Destinatario</th>
                    <th className="py-2.5 px-3 font-medium">Pacco</th>
                    <th className="py-2.5 px-3 font-medium">Corriere</th>
                    <th className="py-2.5 px-3 font-medium">Totale</th>
                    <th className="py-2.5 px-3 font-medium">Stato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                      <td className="py-3 px-3 font-mono text-stone-900 font-medium">
                        {ord.orderNumber}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-stone-900 block">{ord.customerName}</span>
                        <span className="text-stone-400 text-[11px] font-light">{ord.destination}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono text-stone-900 font-medium">{ord.totalWeightKg.toFixed(2)} kg</span>
                        <span className="text-stone-400 text-[11px] block font-light">50×50×50 cm</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-stone-900 block">{ord.courierName}</span>
                        <span className="font-mono text-stone-400 text-[10px]">{ord.trackingCode}</span>
                      </td>

                      <td className="py-3 px-3 font-serif text-stone-900 font-medium">
                        €{ord.grandTotal.toFixed(2)}
                      </td>

                      <td className="py-3 px-3">
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                          className="text-[11px] px-2 py-1 border border-stone-200 rounded-lg bg-white cursor-pointer"
                        >
                          <option value="in_preparazione">In Preparazione</option>
                          <option value="controllo_peso">Controllo 50×50×50</option>
                          <option value="spedito">Spedito</option>
                          <option value="consegnato">Consegnato</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Prodotti */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-[#e7e2d8] p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-normal text-stone-900">
                  Catalogo Prodotti
                </h3>
                <p className="text-xs text-stone-400 font-light">
                  Configura prezzi, pesi unitari e volume occupato nella scatola 50×50×50 cm
                </p>
              </div>

              <button
                onClick={() => setIsNewProductModalOpen(true)}
                className="px-4 py-2 bg-[#1a1816] text-white text-xs font-medium rounded-full cursor-pointer hover:bg-[#332f2b]"
              >
                + Aggiungi Prodotto
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-100 pb-2">
                  <tr>
                    <th className="py-2.5 px-3 font-medium">Prodotto</th>
                    <th className="py-2.5 px-3 font-medium">Categoria</th>
                    <th className="py-2.5 px-3 font-medium">Prezzo</th>
                    <th className="py-2.5 px-3 font-medium">Peso</th>
                    <th className="py-2.5 px-3 font-medium">Volume</th>
                    <th className="py-2.5 px-3 font-medium text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover border border-stone-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-medium text-stone-900 block line-clamp-1">{p.name}</span>
                            <span className="text-[11px] text-stone-400 font-light">{p.origin}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-stone-600 font-light">
                        {p.categoryLabel}
                      </td>

                      <td className="py-3 px-3 font-serif text-stone-900 font-medium">
                        €{p.price.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 font-mono text-stone-700">
                        {p.weightKg.toFixed(2)} kg
                      </td>

                      <td className="py-3 px-3 font-mono text-stone-500">
                        ~{p.volumeLiters}L
                      </td>

                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1 text-stone-400 hover:text-black transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1 text-stone-400 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Tariffe Corrieri */}
        {activeTab === 'shipping' && (
          <div className="bg-white rounded-xl border border-[#e7e2d8] p-6 space-y-4">
            <h3 className="font-serif text-lg font-normal text-stone-900">
              Tariffe Vettori Convenzionati
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shippingProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="p-4 rounded-xl border border-[#e7e2d8] bg-[#faf8f5]/60 flex flex-col justify-between"
                >
                  <div className="mb-3">
                    <h4 className="font-medium text-stone-900 text-xs">{provider.name}</h4>
                    <p className="text-[11px] text-stone-500 font-light mt-0.5">{provider.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200/60 text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-stone-400 block">Tariffa Base (≤5kg)</span>
                      <span className="font-serif text-sm font-medium text-stone-900">€{provider.basePrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-stone-400 block">Costo / kg extra</span>
                      <span className="font-mono text-stone-900">+€{provider.perKgOver5kg.toFixed(2)}/kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal New Product */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-[#faf8f5] rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#e7e2d8] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-normal text-stone-900">Nuovo Prodotto</h3>
              <button onClick={() => setIsNewProductModalOpen(false)}>
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 mb-1 font-light">Nome</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1 font-light">Prezzo (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-light">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-light">Provenienza</label>
                <input
                  type="text"
                  required
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 text-stone-500"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-full font-medium"
                >
                  Salva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Product */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-[#faf8f5] rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#e7e2d8] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-normal text-stone-900">Modifica Prodotto</h3>
              <button onClick={() => setEditingProduct(null)}>
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateProduct(editingProduct);
                setEditingProduct(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-stone-600 mb-1 font-light">Nome</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1 font-light">Prezzo (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-light">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={editingProduct.weightKg}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weightKg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-stone-500"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-full font-medium"
                >
                  Salva Modifiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
