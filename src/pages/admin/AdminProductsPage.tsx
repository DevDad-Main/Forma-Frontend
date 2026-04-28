import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { useAuth } from "@/context/AuthContext";
import { getAdminProducts, createProduct, updateProduct, deleteProduct, seedProducts, type Product } from "@/lib/api";
import { products as dummyProducts } from "@/data/products";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAdminProducts();
      setProducts(data || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSave = async (product: Product) => {
    setActionLoading(true);
    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, product);
        toast.success("Product updated");
      } else {
        await createProduct(product);
        toast.success("Product created");
      }
      setShowForm(false);
      setEditingProduct(null);
      await loadProducts();
    } catch (error) {
      toast.error("Failed to save product");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      await loadProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleSeed = async () => {
    if (!confirm("This will add all dummy products to the database. Continue?")) return;
    setSeedLoading(true);
    try {
      await seedProducts(dummyProducts as Product[]);
      toast.success("Dummy products seeded successfully");
      await loadProducts();
    } catch (error) {
      toast.error("Failed to seed products");
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] dark:bg-[#1C1A17]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link to="/profile">
              <Button variant="outline" size="icon">
                <ArrowLeft size={18} />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-4xl font-light text-[#1C1A17] dark:text-[#F5F0E8]">
                Manage Products
              </h1>
              <p className="text-[#1C1A17]/60 dark:text-[#F5F0E8]/60 mt-1">
                Logged in as {user?.email} (ADMIN)
              </p>
            </div>
          </div>
          {!showForm && (
            <div className="flex gap-3">
              <Button
                onClick={handleSeed}
                variant="outline"
                disabled={seedLoading}
              >
                <Database size={18} className="mr-2" />
                {seedLoading ? "Seeding..." : "Seed Dummy Products"}
              </Button>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="bg-[#1C1A17] hover:bg-[#1C1A17]/90"
              >
                <Plus size={18} className="mr-2" />
                Add Product
              </Button>
            </div>
          )}
        </div>

        {showForm ? (
          <div className="bg-[#EDE8DF] dark:bg-[#252220] rounded-lg p-8">
            <h2 className="font-display text-2xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-8">
              {editingProduct ? "Edit Product" : "New Product"}
            </h2>
            <AdminProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              loading={actionLoading}
            />
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-[#1C1A17]/40">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-[#EDE8DF] dark:bg-[#252220] rounded-lg">
            <p className="text-[#1C1A17]/60 dark:text-[#F5F0E8]/60 text-lg">No products found</p>
            <Button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-[#1C1A17] hover:bg-[#1C1A17]/90"
            >
              <Plus size={18} className="mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="bg-[#EDE8DF] dark:bg-[#252220] rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1C1A17]/10 dark:border-[#F5F0E8]/10">
                  <th className="p-4 text-sm font-medium text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">Image</th>
                  <th className="p-4 text-sm font-medium text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">Name</th>
                  <th className="p-4 text-sm font-medium text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">Category</th>
                  <th className="p-4 text-sm font-medium text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">Price</th>
                  <th className="p-4 text-sm font-medium text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">Stock</th>
                  <th className="p-4 text-sm font-medium text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#1C1A17]/5 dark:border-[#F5F0E8]/5 hover:bg-[#F5F0E8]/50 dark:hover:bg-[#1C1A17]/50"
                  >
                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-4 font-medium text-[#1C1A17] dark:text-[#F5F0E8]">
                      {product.name}
                    </td>
                    <td className="p-4 text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">
                      {product.category}
                    </td>
                    <td className="p-4 text-[#1C1A17] dark:text-[#F5F0E8]">
                      ${product.price.toLocaleString()}
                      {product.originalPrice && (
                        <span className="ml-2 text-sm line-through text-[#1C1A17]/40">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {product.inStock ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product);
                            setShowForm(true);
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => product.id && handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
