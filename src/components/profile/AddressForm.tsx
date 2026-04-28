"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { type Address } from "@/lib/api";

interface AddressFormProps {
  address: Address | null;
  onSave: (address: Address) => Promise<void>;
  onCancel: () => void;
}

export function AddressForm({ address, onSave, onCancel }: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Address>({
    street: address?.street || "",
    city: address?.city || "",
    state: address?.state || "",
    zipCode: address?.zipCode || "",
    country: address?.country || "United States",
    isDefault: address?.isDefault ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Failed to save address", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Address, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          type="text"
          placeholder="123 Main Street, Apt 4B"
          value={formData.street}
          onChange={(e) => handleChange("street", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            type="text"
            placeholder="New York"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            type="text"
            placeholder="NY"
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="10001"
            value={formData.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            type="text"
            placeholder="United States"
            value={formData.country}
            onChange={(e) => handleChange("country", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          id="isDefault"
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => handleChange("isDefault", e.target.checked)}
          className="w-4 h-4 accent-[#C8A97E]"
        />
        <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
          Set as default shipping address
        </Label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading}>
          <Save size={16} className="mr-2" />
          {loading ? "Saving..." : "Save Address"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X size={16} className="mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}