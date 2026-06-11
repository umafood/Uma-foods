import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUser } from "../api/loginApi";
import { getMyOrders, getOrderDetails } from "../api/myOrderApi";
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "address", label: "Update Address" },
  { id: "orders", label: "Order History" },
  { id: "security", label: "Update Password" }, 
];

const Profile = () => {
  const { user, loading, checkAuth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [addressInput, setAddressInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastOrderAddress, setLastOrderAddress] = useState("");
  const [lastOrderId, setLastOrderId] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Password fields state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab") || "overview";
    setActiveTab(tabs.some((item) => item.id === tabParam) ? tabParam : "overview");
  }, [searchParams]);

  useEffect(() => {
    const fetchLatestOrderAddress = async () => {
      try {
        const orders = await getMyOrders();
        if (!orders?.length) return;

        const latestOrder = orders[0];
        const details = await getOrderDetails(latestOrder.id);
        setLastOrderId(latestOrder.id);
        setLastOrderAddress(details?.address || latestOrder.address || "");
      } catch (error) {
        // ignore order address fetch failures
      }
    };

    fetchLatestOrderAddress();
  }, []);

  useEffect(() => {
    if (user?.address) {
      setAddressInput(user.address);
    } else if (lastOrderAddress) {
      setAddressInput(lastOrderAddress);
    }
  }, [user?.address, lastOrderAddress]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
    setPasswordStatus({ type: '', message: '' }); // Reset message on tab switch
  };

  const handleAddressSave = async (event) => {
    event.preventDefault();
    setStatusMessage("");

    if (!addressInput.trim()) {
      setStatusMessage("Please enter a valid address before saving.");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${BASE_URL}/api/user/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: addressInput }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatusMessage("Address updated successfully.");
      } else {
        setStatusMessage(data.error || "Unable to update address.");
      }
    } catch (error) {
      setStatusMessage("Network error while saving address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // const handlePasswordSubmit = async (e) => {
  //   e.preventDefault();
  //   setPasswordStatus({ type: '', message: '' });

  //   if (passwordData.newPassword !== passwordData.confirmPassword) {
  //     setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
  //     return;
  //   }

  //   if (passwordData.newPassword.length < 6) {
  //     setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
  //     return;
  //   }

  //   try {
  //     setPasswordSubmitting(true);
  //     const response = await fetch(`${BASE_URL}/api/user/change-password`, {
  //       method: "PUT",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         currentPassword: passwordData.currentPassword,
  //         newPassword: passwordData.newPassword,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setPasswordStatus({ type: 'success', message: 'Password updated successfully.' });
  //       setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  //     } else {
  //       setPasswordStatus({ type: 'error', message: data.error || 'Failed to update password.' });
  //     }
  //   } catch (err) {
  //     setPasswordStatus({ type: 'error', message: 'Network interface error. Try again later.' });
  //   } finally {
  //     setPasswordSubmitting(false);
  //   }
  // };

  const getPasswordStrength = () => {
    const len = passwordData.newPassword.length;
    if (len === 0) return { width: '0%', color: 'bg-neutral-200', text: '' };
    if (len < 6) return { width: '33%', color: 'bg-rose-500', text: 'Weak' };
    if (len < 10) return { width: '66%', color: 'bg-amber-500', text: 'Good' };
    return { width: '100%', color: 'bg-emerald-500', text: 'Strong' };
  };

  const strength = getPasswordStrength();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] py-24">
        <div className="mx-auto max-w-5xl px-4 text-center text-lg font-medium text-neutral-700">
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-neutral-200 bg-white/90 p-6 shadow-[0_25px_80px_-45px_rgba(84,79,79,0.3)] sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            
            {/* Sidebar info */}
            <div className="w-full rounded-[1.75rem] border border-neutral-200 bg-[#fff8e8] p-6 shadow-sm lg:w-[320px]">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-saffron-400 to-saffron-600 text-3xl font-bold text-white shadow-md">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Welcome back</p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                    {user?.username || "Valued Customer"}
                  </h1>
                </div>
              </div>

              <div className="mt-8 space-y-4 text-sm text-neutral-700">
                <div className="rounded-[1.25rem] border border-neutral-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Email</p>
                  <p className="mt-2 font-medium text-neutral-900">{user?.email || "Not available"}</p>
                </div>
                <div className="rounded-[1.25rem] border border-neutral-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Username</p>
                  <p className="mt-2 font-medium text-neutral-900">{user?.username || "Not available"}</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  to="/orders"
                  className="block rounded-3xl bg-saffron-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-saffron-600"
                >
                  View Order History
                </Link>
                <button
                  type="button"
                  onClick={() => handleTabChange("address")}
                  className="w-full rounded-3xl border border-saffron-200 bg-white px-5 py-3 text-sm font-semibold text-saffron-700 transition hover:border-saffron-300 hover:bg-saffron-50"
                >
                  Edit Delivery Address
                </button>
              </div>
            </div>

            {/* Main Tabs Container */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-3 rounded-[1.75rem] border border-neutral-200 bg-[#fff9f0] p-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`rounded-3xl px-4 py-2 text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "bg-saffron-500 text-white shadow-sm"
                        : "bg-white text-neutral-700 hover:bg-saffron-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                
                {/* Tab: Overview */}
                {activeTab === "overview" && (
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Account Overview</p>
                    <h2 className="mt-3 text-3xl font-semibold text-neutral-900">Your Uma Papad profile</h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">
                      Manage your personal information, delivery address, and quick access to order history. Keep your details up to date for a smoother checkout experience.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-neutral-200 bg-[#fff7e6] p-5">
                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Email</p>
                        <p className="mt-2 text-lg font-semibold text-neutral-900">{user?.email || "-"}</p>
                      </div>
                      <div className="rounded-3xl border border-neutral-200 bg-[#fff7e6] p-5">
                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Username</p>
                        <p className="mt-2 text-lg font-semibold text-neutral-900">{user?.username || "-"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Address */}
                {activeTab === "address" && (
                  <div>
                    {lastOrderAddress && (
                      <div className="rounded-[1.25rem] border border-neutral-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Latest Order Address</p>
                        <p className="mt-2 text-sm text-neutral-700">{lastOrderAddress}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Order History */}
                {activeTab === "orders" && (
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Order History</p>
                    <h2 className="mt-3 text-3xl font-semibold text-neutral-900">Your recent orders</h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">
                      View all orders you have placed with Uma Papad. You can check the status, details, and delivery information from your account page.
                    </p>

                    <div className="mt-8 rounded-3xl border border-neutral-200 bg-slate-50 p-6">
                      <p className="mb-3 text-sm font-medium text-neutral-700">Quick access</p>
                      <Link
                        to="/orders"
                         className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-neutral-800 active:scale-[0.98] disabled:bg-neutral-300 disabled:cursor-not-allowed"
                      >
                        Open Order History
                      </Link>
                    </div>
                  </div>
                )}

                {/* Tab: Security (Change Password) */}
                {activeTab === "security" && (
                  <div className="animate-fade-in">
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Security Management</p>
                    <h2 className="mt-3 text-3xl font-semibold text-neutral-900">Update Password</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
                      Ensure your account remains safe by configuring a strong secret combination string containing multiple character variations.
                    </p>

                    <form  className="mt-8 max-w-xl space-y-5">
                      
                      {/* Current Password Field */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Old Password</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                            <FiLock size={16} />
                          </span>
                          <input
                            type={showPass.current ? "text" : "password"}
                            name="currentPassword"
                            required
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-3.5 pl-11 pr-11 text-sm text-neutral-900 outline-hidden transition duration-200 focus:border-saffron-500 focus:bg-white focus:ring-4 focus:ring-saffron-100 [&#x26;::-ms-reveal]:hidden [&#x26;::-ms-clear]:hidden"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(prev => ({ ...prev, current: !prev.current }))}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPass.current ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* New Password Field */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">New Password</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                            <FiLock size={16} />
                          </span>
                          <input
                            type={showPass.new ? "text" : "password"}
                            name="newPassword"
                            required
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Minimum 6 characters"
                            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-3.5 pl-11 pr-11 text-sm text-neutral-900 outline-hidden transition duration-200 focus:border-saffron-500 focus:bg-white focus:ring-4 focus:ring-saffron-100 [&#x26;::-ms-reveal]:hidden [&#x26;::-ms-clear]:hidden"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(prev => ({ ...prev, new: !prev.new }))}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPass.new ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                        
                        {/* Dynamic Strength Indicator Meter */}
                        {passwordData.newPassword && (
                          <div className="space-y-1 pt-1 animate-fade-in">
                            <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${strength.color}`} 
                                style={{ width: strength.width }}
                              />
                            </div>
                            <p className="text-[11px] font-medium text-neutral-500">
                              Strength: <span className="font-semibold">{strength.text}</span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password Field */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Confirm New Password</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                            <FiLock size={16} />
                          </span>
                          <input
                            type={showPass.confirm ? "text" : "password"}
                            name="confirmPassword"
                            required
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Re-enter new password"
                            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-3.5 pl-11 pr-11 text-sm text-neutral-900 outline-hidden transition duration-200 focus:border-saffron-500 focus:bg-white focus:ring-4 focus:ring-saffron-100 [&#x26;::-ms-reveal]:hidden [&#x26;::-ms-clear]:hidden"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(prev => ({ ...prev, confirm: !prev.confirm }))}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPass.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Status Notification Alerts */}
                      {passwordStatus.message && (
                        <div className={`flex items-start gap-2.5 rounded-2xl border p-4 text-sm animate-fade-in ${
                          passwordStatus.type === 'success' 
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800' 
                            : 'border-rose-200 bg-rose-50 text-rose-800'
                        }`}>
                          {passwordStatus.type === 'success' ? (
                            <FiCheckCircle size={18} className="mt-0.5 text-emerald-600 shrink-0" />
                          ) : (
                            <FiAlertCircle size={18} className="mt-0.5 text-rose-600 shrink-0" />
                          )}
                          <span>{passwordStatus.message}</span>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={passwordSubmitting}
                          className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-neutral-800 active:scale-[0.98] disabled:bg-neutral-300 disabled:cursor-not-allowed"
                        >
                          {passwordSubmitting ? "Updating Password..." : "Update Password"}
                        </button>
                      </div>

                    </form>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;