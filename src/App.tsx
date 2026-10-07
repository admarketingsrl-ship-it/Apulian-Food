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
import { User, AdminOrder, DEMO_CUSTOMER, INITIAL_ORDERS } from './data/auth';
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
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { RotateCcw, CheckCircle2, Shield, User as UserIcon } from 'lucide-react';

export default function App() {
  // 1. Authentication State (Customer & Admin)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('puglia_user');
      return saved ? JSON.parse(saved) : DEMO_CUSTOMER;
    } catch {
      return DEMO_CUSTOMER;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    if (totalWeight + product.weightKg > BOX_LIMITS.maxWeightKg) {
      showToast(`⚠️ Attenzione: Aggiungere "${product.name}" supererebbe il limite di 15 kg!`);
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

    showToast(`✓ Aggiunto al pacco: ${product.name}`);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const itemToUpdate = cart.find((i) => i.product.id === productId);
    if (!itemToUpdate) return;

    // Check weight delta
    const weightDelta = (newQuantity - itemToUpdate.quantity) * itemToUpdate.product.weightKg;
    if (totalWeight + weightDelta > BOX_LIMITS.maxWeightKg) {
      showToast(`⚠️ Impossibile aumentare: il pacco supererebbe i 15.00 kg consentiti!`);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    showToast(`Prodotto rimosso dal pacco`);
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

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showToast(`Benvenuto, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Disconnessione effettuata');
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
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1816] text-white text-xs px-4 py-2.5 rounded-full shadow-lg border border-stone-800 flex items-center gap-2 animate-in slide-in-from-bottom duration-150">
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
        onOpenAdmin={() => setIsAdminView(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomSupplier={() => setIsCustomSupplierOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex-1 w-full space-y-12">
        {/* Hero Banner with packaging criteria */}
        <HeroBanner
          onScrollToCatalog={handleScrollToCatalog}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Quick Cart Actions Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[#e7e2d8] text-xs text-stone-500 font-light">
          <div className="flex items-center gap-2">
            <span className="text-stone-900 font-medium">Pacco d'esempio precaricato:</span>
            <span>Olio EVO 3L, Orecchiette, Taralli, Capocollo, Cime di rapa, Biscotti Cegliesi ({totalWeight.toFixed(2)} kg).</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetSampleCart}
              className="text-stone-600 hover:text-black underline transition-colors cursor-pointer"
            >
              Ripristina pacco d'esempio
            </button>

            {cart.length > 0 && (
              <>
                <span className="text-stone-300">·</span>
                <button
                  onClick={handleClearCart}
                  className="text-stone-400 hover:text-red-700 transition-colors cursor-pointer"
                >
                  Svuota
                </button>
              </>
            )}
          </div>
        </div>

        {/* 1. Box Visualizer (Live 50x50x50 cm, Max 15kg, Min 50€) */}
        <section>
          <BoxVisualizer
            cart={cart}
            totalWeight={totalWeight}
            totalVolume={totalVolume}
            subtotal={subtotal}
            onOpenCart={() => setIsCartOpen(true)}
          />
        </section>

        {/* 2. Instant Shipping Calculator (Couriers + Custom Supplier Hook) */}
        <section>
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

        {/* 3. Product Catalog with filters, search, and instant Add */}
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

      {/* Auth Modal (Social & Email Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenAdminDirectly={() => {
          setIsAuthModalOpen(false);
          setIsAdminView(true);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
