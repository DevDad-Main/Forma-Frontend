import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Product } from "@/lib/api";

interface AdminProductFormProps {
  product: Product | null;
  onSave: (product: Product) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const emptyProduct: Product = {
  name: "",
  price: 0,
  image: "",
  category: "",
  inStock: true,
};

export function AdminProductForm({ product, onSave, onCancel, loading }: AdminProductFormProps) {
  const [formData, setFormData] = useState<Product>(emptyProduct);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({ ...emptyProduct, ...product });
      setTagsInput(product.tags?.join(", ") || "");
    } else {
      setFormData(emptyProduct);
      setTagsInput("");
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    await onSave({ ...formData, tags: tags.length ? tags : undefined });
  };

  const handleChange = (field: keyof Product, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="Seating, Tables, Lighting..."
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Original Price (optional)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={formData.originalPrice || ""}
            onChange={(e) => handleChange("originalPrice", Number(e.target.value) || undefined)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={formData.color || ""}
            onChange={(e) => handleChange("color", e.target.value)}
            placeholder="Oat, Cognac..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            placeholder="https://..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hoverImage">Hover Image URL (optional)</Label>
          <Input
            id="hoverImage"
            value={formData.hoverImage || ""}
            onChange={(e) => handleChange("hoverImage", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="material">Material</Label>
        <Input
          id="material"
          value={formData.material || ""}
          onChange={(e) => handleChange("material", e.target.value)}
          placeholder="Linen / Walnut"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dimensions">Dimensions</Label>
        <Input
          id="dimensions"
          value={formData.dimensions || ""}
          onChange={(e) => handleChange("dimensions", e.target.value)}
          placeholder='W 82cm × D 88cm × H 76cm'
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="chair, lounge, walnut"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="inStock"
            checked={formData.inStock ?? true}
            onCheckedChange={(v) => handleChange("inStock", v)}
          />
          <Label htmlFor="inStock">In Stock</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="isBestSeller"
            checked={formData.isBestSeller ?? false}
            onCheckedChange={(v) => handleChange("isBestSeller", v)}
          />
          <Label htmlFor="isBestSeller">Best Seller</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="isNew"
            checked={formData.isNew ?? false}
            onCheckedChange={(v) => handleChange("isNew", v)}
          />
          <Label htmlFor="isNew">New</Label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading}>
          <Save size={16} className="mr-2" />
          {loading ? "Saving..." : "Save Product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X size={16} className="mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
