/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS, INITIAL_SAMPLE_CART, Product, CartItem } from './data/products';
import {
  DEFAULT_SHIPPING_PROVIDERS,
  ShippingProvider,
  DestinationZone,
  BOX_LIMITS,
  calculateShipping,
} from './data/shipping';
import { User, AdminOrder, INITIAL_ORDERS } from './data/auth';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { BoxVisualizer } from './components/BoxVisualizer';
import { ShippingCalculator } from './components/ShippingCalculator';
import { ProductCatalog } from './components/ProductCatalog';
import { CartDrawer } from './components/CartDrawer';
import { CustomSupplierModal } from './components/CustomSupplierModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductModal } from './components/ProductModal';
import { AuthModal } from './components/AuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { RecipeSection } from './components/RecipeSection';
import { RecipeModal } from './components/RecipeModal';
import { PreconfiguredBoxesWidget } from './components/PreconfiguredBoxesWidget';
import { Footer } from './components/Footer';
import { Recipe } from './data/recipes';
import { RotateCcw, CheckCircle2, Shield, User as UserIcon, Package } from 'lucide-react';

export default function App() {
  // 1. Authentication State (No preset user by default as requested; purge legacy Marco Antonacci)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('puglia_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed ||
          parsed.name?.toLowerCase().includes('marco') ||
          parsed.email?.toLowerCase().includes('marco') ||
          parsed.name?.toLowerCase().includes('antonacci')
        ) {
          localStorage.removeItem('puglia_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // 2. Admin Dashboard view toggle
  const [isAdminView, setIsAdminView] = useState(false);

  // 3. Products State (editable via Admin Dashboard)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // 4. Orders State (managed via Admin Dashboard & Checkout)
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);

  // 5. Cart state (Preloaded with authentic sample items as requested)
  const [cart, setCart] = useState<CartItem[]>(INITIAL_SAMPLE_CART);

  // 6. Shipping State & Providers
  const [shippingProviders, setShippingProviders] = useState<ShippingProvider[]>(
    DEFAULT_SHIPPING_PROVIDERS
  );
  const [selectedProviderId, setSelectedProviderId] = useState<string>('brt-express');
  const [selectedZone, setSelectedZone] = useState<DestinationZone>('italia-penisola');

  // 7. Modals and drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomSupplierOpen, setIsCustomSupplierOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // 8. Custom card note inside the box
  const [customNote, setCustomNote] = useState<string>(
    'Con tanto affetto da tutta la famiglia! Goditi i veri sapori di Puglia.'
  );

  // 9. Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem('puglia_user', JSON.stringify(currentUser));
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem('puglia_user');
    }
  }, [currentUser]);

  // Calculations for current Box
  const { totalWeight, totalVolume, subtotal, totalItemCount, hasRefrigeratedItems } = useMemo(() => {
    let weight = 0;
    let volume = 0;
    let sumPrice = 0;
    let count = 0;
    let refrigerated = false;

    for (const item of cart) {
      weight += item.product.weightKg * item.quantity;
      volume += item.product.volumeLiters * item.quantity;
      sumPrice += item.product.price * item.quantity;
      count += item.quantity;
      if (item.product.isRefrigerated) {
        refrigerated = true;
      }
    }

    return {
      totalWeight: Math.round(weight * 100) / 100,
      totalVolume: Math.round(volume * 10) / 10,
      subtotal: Math.round(sumPrice * 100) / 100,
      totalItemCount: count,
      hasRefrigeratedItems: refrigerated,
    };
  }, [cart]);

  // Selected Shipping Calculation
  const currentProvider = useMemo(() => {
    return shippingProviders.find((p) => p.id === selectedProviderId) || shippingProviders[0];
  }, [shippingProviders, selectedProviderId]);

  const activeShippingCalc = useMemo(() => {
    return calculateShipping(
      currentProvider,
      totalWeight,
      selectedZone,
      hasRefrigeratedItems,
      subtotal
    );
  }, [currentProvider, totalWeight, selectedZone, hasRefrigeratedItems, subtotal]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    const wouldExceed = totalWeight + product.weightKg > BOX_LIMITS.maxWeightKg;
    if (wouldExceed) {
      showToast(`⚠️ Limite peso (15 kg) superato! Impossibile aggiungere.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    showToast(`✓ Aggiunto: ${product.name}`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const currentItem = cart.find((item) => item.product.id === productId);
    if (!currentItem) return;

    if (quantity > currentItem.quantity) {
      const weightDiff = currentItem.product.weightKg * (quantity - currentItem.quantity);
      if (totalWeight + weightDiff > BOX_LIMITS.maxWeightKg) {
        showToast(`⚠️ Limite massimo di 15 kg raggiunto!`);
        return;
      }
    }

    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    const target = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (target) {
      showToast(`Rimosso: ${target.product.name}`);
    }
  };

  const handleClearCart = () => {
    setCart([]);
    showToast(`Pacco svuotato`);
  };

  const handleResetSampleCart = () => {
    setCart(INITIAL_SAMPLE_CART);
    showToast(`Pacco d'esempio ricaricato con successo!`);
  };

  const handleSaveCustomProvider = (newProvider: ShippingProvider) => {
    setShippingProviders((prev) => [newProvider, ...prev]);
    setSelectedProviderId(newProvider.id);
    showToast(`✓ Fornitore "${newProvider.name}" agganciato e impostato come predefinito!`);
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalogo-pugliese');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToRecipes = () => {
    const el = document.getElementById('sezione-ricette');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToPreconfiguredBoxes = () => {
    const el = document.getElementById('confezioni-pronte');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToShipping = () => {
    const el = document.getElementById('calcolo-spedizione');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoadPreconfiguredBox = (
    boxItems: { product: Product; quantity: number }[],
    boxTitle: string
  ) => {
    setCart(boxItems.map((item) => ({ product: item.product, quantity: item.quantity })));
    showToast(`✓ "${boxTitle}" caricato con successo nel tuo pacco!`);
  };

  const handleAddAllRecipeProducts = (productsToAdd: Product[]) => {
    const addedWeight = productsToAdd.reduce((sum, p) => sum + p.weightKg, 0);
    if (totalWeight + addedWeight > BOX_LIMITS.maxWeightKg) {
      showToast(`⚠️ Impossibile aggiungere tutti: supererebbero il limite di 15 kg!`);
      return;
    }

    setCart((prev) => {
      const nextCart = [...prev];
      for (const p of productsToAdd) {
        const idx = nextCart.findIndex((item) => item.product.id === p.id);
        if (idx >= 0) {
          nextCart[idx] = { ...nextCart[idx], quantity: nextCart[idx].quantity + 1 };
        } else {
          nextCart.push({ product: p, quantity: 1 });
        }
      }
      return nextCart;
    });

    showToast(`✓ Aggiunti ${productsToAdd.length} ingredienti al tuo pacco!`);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showToast(`Benvenuto, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Disconnessione effettuata');
  };

  // Admin access handler: requires credentials (admin / admin)
  const handleOpenAdmin = () => {
    if (currentUser?.role === 'admin') {
      setIsAdminView(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    const adminUser: User = {
      id: 'usr-admin-master',
      name: 'Amministratore PugliaInScatola',
      email: 'admin@pugliainscatola.it',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      role: 'admin',
      provider: 'email',
    };
    setCurrentUser(adminUser);
    setIsAdminView(true);
    showToast('Accesso autorizzato come Amministratore');
  };

  // Admin handlers
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`✓ Prodotto "${updated.name}" aggiornato nel catalogo!`);
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`✓ Nuovo prodotto "${newProd.name}" aggiunto al catalogo!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Prodotto eliminato dal catalogo`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: AdminOrder['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    showToast(`Stato dell'ordine aggiornato con successo`);
  };

  const handleOrderSuccess = (newOrder: AdminOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`🎉 Ordine registrato nel sistema! Codice: ${newOrder.orderNumber}`);
  };

  // If in Admin Dashboard view, render the Admin Panel
  if (isAdminView) {
    return (
      <AdminDashboard
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        shippingProviders={shippingProviders}
        onUpdateProvider={(p) => {
          setShippingProviders((prev) => prev.map((item) => (item.id === p.id ? p : item)));
          showToast(`Tariffa corriere ${p.name} salvata`);
        }}
        onExitAdmin={() => setIsAdminView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1816] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#1a1816] text-white text-xs px-4 py-2.5 rounded-full shadow-lg border border-stone-800 flex items-center gap-2 animate-in slide-in-from-bottom duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 text-stone-300 shrink-0" />
          <span className="font-light">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        cartCount={totalItemCount}
        subtotal={subtotal}
        totalWeight={totalWeight}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenAdmin={handleOpenAdmin}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomSupplier={() => setIsCustomSupplierOpen(true)}
        onScrollToRecipes={handleScrollToRecipes}
        onScrollToPreconfiguredBoxes={handleScrollToPreconfiguredBoxes}
        onScrollToShipping={handleScrollToShipping}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-14 flex-1 w-full pb-24 sm:pb-12">
        {/* Hero Banner */}
        <HeroBanner
          onScrollToCatalog={handleScrollToCatalog}
          onOpenCart={() => setIsCartOpen(true)}
          onScrollToPreconfiguredBoxes={handleScrollToPreconfiguredBoxes}
        />

        {/* Preconfigured Boxes Widget (3 Price Tiers) */}
        <section id="confezioni-pronte">
          <PreconfiguredBoxesWidget
            products={products}
            currentCart={cart}
            onLoadBox={handleLoadPreconfiguredBox}
            onOpenCart={() => setIsCartOpen(true)}
          />
        </section>

        {/* Box Specs & Live Gauges */}
        <section id="stato-pacco">
          <BoxVisualizer
            cart={cart}
            totalWeight={totalWeight}
            totalVolume={totalVolume}
            subtotal={subtotal}
            onOpenCart={() => setIsCartOpen(true)}
            onScrollToShipping={handleScrollToShipping}
          />
        </section>

        {/* Apulian Delicacies Catalog */}
        <section>
          <ProductCatalog
            products={products}
            cart={cart}
            currentTotalWeight={totalWeight}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onOpenDetails={setSelectedProductDetails}
          />
        </section>

        {/* Traditional Pugliese Recipes Section */}
        <section>
          <RecipeSection
            products={products}
            cart={cart}
            currentTotalWeight={totalWeight}
            onOpenRecipe={setSelectedRecipe}
            onAddAllRecipeProducts={handleAddAllRecipeProducts}
          />
        </section>

        {/* Shipping Cost Calculator & Courier Selection (Moved to bottom) */}
        <section id="calcolo-spedizione">
          <ShippingCalculator
            providers={shippingProviders}
            selectedProviderId={selectedProviderId}
            onSelectProvider={setSelectedProviderId}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            currentWeightKg={totalWeight}
            hasRefrigeratedItems={hasRefrigeratedItems}
            cartSubtotal={subtotal}
            onOpenCustomSupplierModal={() => setIsCustomSupplierOpen(true)}
          />
        </section>

        {/* Sample Cart Quick Reset */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#e7e2d8] text-xs">
          <div className="flex items-center gap-2 text-stone-500 font-light">
            <span className="text-stone-700 font-medium">Composizione d'Esempio:</span>
            <span>Taralli, Orecchiette, Olio EVO in Latta 3L, Capocollo e Dolci tipici precaricati.</span>
          </div>
          <button
            onClick={handleResetSampleCart}
            className="text-stone-700 hover:text-black font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ml-4 underline underline-offset-4 decoration-stone-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ricarica Pacco Esempio</span>
          </button>
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        totalWeight={totalWeight}
        totalVolume={totalVolume}
        subtotal={subtotal}
        shippingCalc={activeShippingCalc}
        customNote={customNote}
        onChangeCustomNote={setCustomNote}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Custom Shipping Supplier Configuration Modal */}
      <CustomSupplierModal
        isOpen={isCustomSupplierOpen}
        onClose={() => setIsCustomSupplierOpen(false)}
        onSaveProvider={handleSaveCustomProvider}
        existingProviders={shippingProviders}
      />

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        onAddToCart={handleAddToCart}
        canAdd={selectedProductDetails ? totalWeight + selectedProductDetails.weightKg <= BOX_LIMITS.maxWeightKg : true}
      />

      {/* Recipe Details Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        products={products}
        cart={cart}
        currentTotalWeight={totalWeight}
        onClose={() => setSelectedRecipe(null)}
        onAddToCart={handleAddToCart}
        onAddAllRecipeProducts={handleAddAllRecipeProducts}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        subtotal={subtotal}
        totalWeight={totalWeight}
        shippingCalc={activeShippingCalc}
        customNote={customNote}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Auth Modal (Customer Registration & Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenAdminLogin={() => {
          setIsAuthModalOpen(false);
          setIsAdminLoginOpen(true);
        }}
      />

      {/* Admin Login Modal (admin / admin credentials explicitly required) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Mobile Floating Sticky Bar for Smartphone Ergonomics */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#1c1a17]/95 backdrop-blur-md text-white px-4 py-2.5 border-t border-stone-800 flex items-center justify-between shadow-2xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-stone-400">Peso:</span>
            <span className={`font-mono font-bold ${totalWeight > 15 ? 'text-red-400' : 'text-stone-100'}`}>
              {totalWeight.toFixed(2)}/15kg
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-base font-semibold">€{subtotal.toFixed(2)}</span>
            <span className={`text-[10px] ${subtotal >= 50 ? 'text-emerald-400' : 'text-amber-300'}`}>
              {subtotal >= 50 ? 'min. 50€ ✓' : `mancano €${(50 - subtotal).toFixed(2)}`}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="px-4 py-2 bg-white text-stone-950 rounded-xl text-xs font-semibold flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
        >
          <Package className="w-3.5 h-3.5 stroke-[2]" />
          <span>Vedi Pacco ({totalItemCount})</span>
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
