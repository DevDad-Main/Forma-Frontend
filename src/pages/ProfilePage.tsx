import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, Heart, Settings, LogOut, Camera, Save, MapPin, Plus, Pencil, Trash } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, updateAddress, createAddress, deleteAddress, getAddresses, type Address } from "@/lib/api";
import { AddressForm } from "@/components/profile/AddressForm";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "settings">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setProfile(user as UserProfile);
      setFormData({
        firstName: (user as UserProfile).firstName || "",
        lastName: (user as UserProfile).lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put("/auth/profile", formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const mockOrders: Order[] = [
    { id: "ORD-001", date: "2026-04-15", status: "Delivered", total: 1250, items: 2 },
    { id: "ORD-002", date: "2026-03-28", status: "Processing", total: 890, items: 1 },
  ];

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const loadAddresses = async () => {
    try {
      const addrs = await getAddresses();
      setAddresses(addrs || []);
    } catch (error) {
      console.error("Failed to load addresses", error);
      setAddresses([]);
    }
  };

  useEffect(() => {
    if (activeTab === "addresses") {
      loadAddresses();
    }
  }, [activeTab]);

  return (
    <div className="bg-[#F5F0E8] dark:bg-[#1C1A17] min-h-screen pt-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16">
        <div className="flex items-center gap-2 mb-8 font-accent text-xs text-[#1C1A17]/50 dark:text-[#F5F0E8]/50">
          <Link to="/" className="hover:text-[#C8A97E] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#1C1A17] dark:text-[#F5F0E8]">Profile</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#EDE8DF] dark:bg-[#252220] rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {profile?.picture ? (
                    <img 
                      src={profile.picture} 
                      alt={profile.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#C8A97E] flex items-center justify-center mx-auto">
                      <User className="w-12 h-12 text-[#1C1A17]" />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#1C1A17] dark:bg-[#F5F0E8] rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-[#F5F0E8] dark:text-[#1C1A17]" />
                  </button>
                </div>
                <h2 className="mt-4 font-display text-xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-sm text-[#1C1A17]/60">{profile?.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "profile" | "orders" | "addresses" | "settings")}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                      activeTab === tab.id
                        ? "bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17]"
                        : "text-[#1C1A17] dark:text-[#F5F0E8] hover:bg-[#E5DFD3] dark:hover:bg-[#2a2520]"
                    )}
                  >
                    <tab.icon size={18} />
                    <span className="font-body text-sm">{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={18} />
                  <span className="font-body text-sm">Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-[#EDE8DF] dark:bg-[#252220] rounded-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-3xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">
                    Profile Details
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-sm font-body text-[#1C1A17] dark:text-[#F5F0E8] border border-[#C8A97E] rounded hover:bg-[#C8A97E]/10 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-accent text-xs uppercase tracking-wider text-[#1C1A17]/60">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F5F0E8] dark:bg-[#1C1A17] border border-[#C8A97E]/30 rounded text-[#1C1A17] dark:text-[#F5F0E8] font-body"
                        />
                      ) : (
                        <p className="font-body text-lg text-[#1C1A17] dark:text-[#F5F0E8]">
                          {profile?.firstName || "—"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="font-accent text-xs uppercase tracking-wider text-[#1C1A17]/60">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F5F0E8] dark:bg-[#1C1A17] border border-[#C8A97E]/30 rounded text-[#1C1A17] dark:text-[#F5F0E8] font-body"
                        />
                      ) : (
                        <p className="font-body text-lg text-[#1C1A17] dark:text-[#F5F0E8]">
                          {profile?.lastName || "—"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-accent text-xs uppercase tracking-wider text-[#1C1A17]/60">
                      Email
                    </label>
                    <p className="font-body text-lg text-[#1C1A17] dark:text-[#F5F0E8]">
                      {profile?.email || "—"}
                    </p>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] rounded font-body text-sm hover:opacity-90 transition-opacity"
                      >
                        <Save size={16} />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            firstName: profile?.firstName || "",
                            lastName: profile?.lastName || "",
                            email: profile?.email || "",
                          });
                        }}
                        className="px-6 py-3 border border-[#C8A97E] text-[#1C1A17] dark:text-[#F5F0E8] rounded font-body text-sm hover:bg-[#C8A97E]/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-[#EDE8DF] dark:bg-[#252220] rounded-lg p-8">
                <h2 className="font-display text-3xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-8">
                  Your Orders
                </h2>

                {mockOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-[#C8A97E]/30 mx-auto mb-4" />
                    <p className="font-body text-lg text-[#1C1A17]/60">No orders yet</p>
                    <Link
                      to="/shop"
                      className="inline-block mt-4 px-6 py-3 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] rounded font-body text-sm"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-[#F5F0E8] dark:bg-[#1C1A17] rounded-lg"
                      >
                        <div>
                          <p className="font-body font-500 text-[#1C1A17] dark:text-[#F5F0E8]">
                            {order.id}
                          </p>
                          <p className="text-sm text-[#1C1A17]/60">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-body font-500 text-[#1C1A17] dark:text-[#F5F0E8]">
                            ${order.total.toLocaleString()}
                          </p>
                          <p className="text-sm text-[#C8A97E]">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="bg-[#EDE8DF] dark:bg-[#252220] rounded-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-3xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">
                    Shipping Addresses
                  </h2>
                  {!showAddressForm && addresses.length < 3 && (
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddressForm(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-body text-[#1C1A17] dark:text-[#F5F0E8] border border-[#C8A97E] rounded hover:bg-[#C8A97E]/10 transition-colors"
                    >
                      <Plus size={16} />
                      Add Address
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <div className="bg-[#F5F0E8] dark:bg-[#1C1A17] rounded-lg p-6">
                    <h3 className="font-display text-xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-6">
                      {editingAddress ? "Edit Address" : "New Address"}
                    </h3>
                    <AddressForm
                      address={editingAddress}
                      onSave={async (address) => {
                        if (editingAddress?.id) {
                          await updateAddress(address);
                        } else {
                          await createAddress(address);
                        }
                        setShowAddressForm(false);
                        setEditingAddress(null);
                        await loadAddresses();
                      }}
                      onCancel={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                      }}
                    />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-[#C8A97E]/30 mx-auto mb-4" />
                    <p className="font-body text-lg text-[#1C1A17]/60">No addresses saved</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="inline-block mt-4 px-6 py-3 bg-[#1C1A17] dark:bg-[#F5F0E8] text-[#F5F0E8] dark:text-[#1C1A17] rounded font-body text-sm"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr, index) => (
                      <div
                        key={addr.id || index}
                        className="flex items-start justify-between p-4 bg-[#F5F0E8] dark:bg-[#1C1A17] rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-[#C8A97E] text-[#1C1A17] text-xs font-body rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-body text-[#1C1A17] dark:text-[#F5F0E8]">{addr.street}</p>
                          <p className="font-body text-[#1C1A17] dark:text-[#F5F0E8]">
                            {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                          <p className="font-body text-[#1C1A17] dark:text-[#F5F0E8]">{addr.country}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingAddress(addr);
                              setShowAddressForm(true);
                            }}
                            className="p-2 text-[#1C1A17]/60 hover:text-[#C8A97E] transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              if (addr.id && confirm("Delete this address?")) {
                                await deleteAddress(addr.id);
                                await loadAddresses();
                              }
                            }}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-[#EDE8DF] dark:bg-[#252220] rounded-lg p-8">
                <h2 className="font-display text-3xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-8">
                  Settings
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-[#C8A97E]/20">
                    <div>
                      <p className="font-body text-[#1C1A17] dark:text-[#F5F0E8]">Email Notifications</p>
                      <p className="text-sm text-[#1C1A17]/60">Receive updates about your orders</p>
                    </div>
                    <button className="w-12 h-6 bg-[#C8A97E] rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-[#C8A97E]/20">
                    <div>
                      <p className="font-body text-[#1C1A17] dark:text-[#F5F0E8]">Marketing Emails</p>
                      <p className="text-sm text-[#1C1A17]/60">Receive news and exclusive offers</p>
                    </div>
                    <button className="w-12 h-6 bg-[#C8A97E] rounded-full relative">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}