import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowLeft,
  FiTruck,
  FiShield,
  FiPercent,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/format";
import Container from "../components/Container";
import PageLayout from "../components/PageLayout";

const CartPage = () => {
  const {
    cartItems,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const shipping = cartTotal >= 500 ? 0 : 40;
  const finalTotal = cartTotal + shipping;
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      alert("Please login first to proceed with checkout");
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  return (
    <PageLayout>
      <Container className="page-hero-shell">
        <section className="page-hero page-hero-center bg-neutral-950">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-saffron-900/25 via-transparent to-transparent"></div>
          </div>
          <div className="page-hero-body">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="page-hero-title">
                Shopping <span className="text-gradient-gold">Cart</span>
              </h1>
              <p className="page-hero-copy">
                {cartCount > 0
                  ? `${cartCount} item${cartCount !== 1 ? "s" : ""} in your cart`
                  : "Your cart is empty"}
              </p>
            </motion.div>
          </div>
        </section>
      </Container>

      <Container className="page-content">
        {cartItems.length === 0 ? (
          <motion.div
            className="surface-card py-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-neutral-50 shadow-sm">
              <FiShoppingBag size={40} className="text-neutral-300" />
            </div>
            <h2 className="mb-3 font-display text-2xl font-bold text-neutral-900">
              Nothing here yet!
            </h2>
            <p className="mb-8 font-body text-base text-neutral-500">
              Your shopping cart is currently empty.
            </p>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 font-heading font-semibold text-white shadow-lg transition-all hover:bg-saffron-600"
            >
              <FiArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />{" "}
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-3">
                <h2 className="font-display text-xl font-bold text-neutral-900">
                  Cart Items
                </h2>
                <button
                  onClick={clearCart}
                  className="rounded-full bg-red-50 px-3 py-1.5 font-heading text-xs text-red-500 hover:bg-red-100"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="surface-card flex flex-col gap-4 p-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:p-5 border-b border-neutral-100 last:border-0"
                    >
                      {/* 1. PRODUCT IMAGE (Occupies 1/12 columns on desktop) */}
                      <div className="sm:col-span-1 flex justify-center sm:justify-start">
                        <Link
                          to={`/product/${item.slug}`}
                          className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 p-1"
                        >
                          <img
                            src={`${BASE_URL}${item.image}`}
                            alt={item.name}
                            className="h-full w-full rounded-lg object-cover"
                          />
                        </Link>
                      </div>

                      {/* 2. PRODUCT NAME (Occupies 3/12 columns on desktop) */}
                      <div className="sm:col-span-3 min-w-0 flex flex-col text-center sm:text-left">
                        <Link
                          to={`/product/${item.slug}`}
                          className="block font-display text-base font-bold text-neutral-900 hover:text-saffron-600 truncate"
                        >
                          {item.name}
                        </Link>
                      </div>

                      {/* 3. WEIGHT - Now in its own column! (Occupies 2/12 columns on desktop) */}
                      <div className="sm:col-span-2 flex flex-row justify-between items-center sm:flex-col sm:items-start sm:justify-center">
                        <span className="text-xs font-heading text-neutral-400 sm:hidden">
                          Weight:
                        </span>
                        <span className="font-heading text-sm text-neutral-600">
                          {item.weight || "-"}
                        </span>
                      </div>

                      {/* 4. UNIT PRICE (Occupies 2/12 columns on desktop) */}
                      <div className="sm:col-span-2 flex flex-row justify-between items-center sm:flex-col sm:items-start sm:justify-center">
                        <span className="text-xs font-heading text-neutral-400 sm:hidden">
                          Price:
                        </span>
                        <span className="font-heading text-sm font-semibold text-neutral-700">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      {/* 5. QUANTITY CONTROLS (Occupies 2/12 columns on desktop) */}
                      <div className="sm:col-span-2 flex flex-row justify-between items-center sm:flex-col sm:items-start sm:justify-center">
                        <span className="text-xs font-heading text-neutral-400 sm:hidden">
                          Quantity:
                        </span>
                        <div className="flex h-9 w-24 items-center justify-between rounded-full border border-neutral-200 bg-neutral-50 px-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity - 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm hover:text-neutral-900 transition-colors"
                          >
                            <FiMinus size={10} />
                          </button>

                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1;
                              if (
                                newQuantity >= 1 &&
                                newQuantity <= item.stock
                              ) {
                                updateQuantity(item.cartItemId, newQuantity);
                              }
                            }}
                            className="w-8 text-center font-heading text-xs font-bold bg-transparent border-none outline-none focus:ring-0 focus:outline-none focus:border-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />

                          <button
                            onClick={() => {
                              if (item.stock <= item.quantity) {
                                alert("Out of stock");
                                return;
                              }
                              updateQuantity(
                                item.cartItemId,
                                item.quantity + 1,
                              );
                            }}
                            disabled={item.stock === 0}
                            className={`flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-colors
            ${item.stock === 0 ? "text-gray-300 cursor-not-allowed" : "text-neutral-500 hover:text-neutral-900"}
          `}
                          >
                            <FiPlus size={10} />
                          </button>
                        </div>
                      </div>

                      {/* 6. SUBTOTAL & REMOVE (Occupies 2/12 columns on desktop) */}
                      <div className="sm:col-span-2 flex flex-row items-center justify-between gap-4 border-t border-neutral-100 pt-3 sm:border-0 sm:pt-0 sm:justify-end">
                        {/* Left Side: Price Details */}
                        <div className="flex flex-col sm:items-end">
                          <span className="text-xs font-heading text-neutral-400 sm:hidden">
                            Total:
                          </span>
                          <span className="font-heading font-bold text-neutral-900 md:text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        {/* Right Side: Enhanced Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="flex items-center gap-1.5 rounded-xl p-2 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
                          title="Remove item"
                        >
                          <FiTrash2
                            size={18}
                            className="group-hover:scale-110 group-active:scale-95 transition-transform duration-150"
                          />
                          <span className="text-xs font-heading font-medium sm:hidden">
                            Remove
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <Link
                to="/shop"
                className="group mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-saffron-600 hover:text-saffron-700"
              >
                <FiArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />{" "}
                Continue Shopping
              </Link>
            </div>

            <div className="lg:col-span-4">
              <div className="surface-card p-5 lg:sticky lg:top-24 lg:p-6">
                <h3 className="mb-5 border-b border-neutral-100 pb-3 font-display text-xl font-bold text-neutral-900">
                  Order Summary
                </h3>
                <div className="space-y-3 border-b border-neutral-100 pb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-heading font-bold text-neutral-900">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Shipping</span>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-heading font-bold text-emerald-600">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                </div>
                {cartTotal < 500 && (
                  <div className="mt-4 flex gap-2 rounded-xl border border-saffron-100/50 bg-saffron-50 p-3">
                    <FiPercent
                      size={14}
                      className="shrink-0 text-saffron-600 mt-0.5"
                    />
                    <p className="text-xs text-saffron-800">
                      Add <strong>{formatPrice(500 - cartTotal)}</strong> more
                      for free shipping!
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between py-5 border-t border-neutral-100">
                  {/* Left Side: Total Label & Subtext stacked vertically */}
                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-neutral-900 md:text-lg">
                      Total
                    </span>
                    <span className="text-[10px] text-neutral-900 mt-0.5">
                      Incl. taxes
                    </span>
                  </div>

                  {/* Right Side: Final Price Value aligned perfectly on the same row */}
                  <div>
                    <span className="font-heading font-bold text-neutral-900 md:text-lg">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCheckoutClick}
                  disabled={authLoading}
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-sm font-heading font-semibold text-white shadow-lg hover:bg-saffron-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? "Checking..." : "Proceed to Checkout"}
                </button>
                <div className="space-y-3 border-t border-neutral-100 pt-4">
                  {[
                    {
                      icon: FiTruck,
                      text: "Free shipping on orders over Rs. 500",
                    },
                    { icon: FiShield, text: "100% secure payment" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-neutral-500"
                    >
                      <item.icon
                        size={12}
                        className="shrink-0 mt-0.5 text-neutral-400"
                      />
                      <span className="text-xs">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </PageLayout>
  );
};

export default CartPage;
