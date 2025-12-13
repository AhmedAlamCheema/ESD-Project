import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Package, Plus, Edit, Trash2, Loader2, AlertCircle, X } from 'lucide-react';

export default function FarmerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stockQty: '', categoryId: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [prod, cat] = await Promise.all([productAPI.list(), categoryAPI.list()]);
      // Filter to show only current farmer's products
      const myProducts = prod.data.filter(p => p.sellerId === user?.id);
      setProducts(myProducts);
      setCategories(cat.data);
    } catch (e) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditId(null);
    setForm({ name: '', description: '', price: '', stockQty: '', categoryId: '' });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description || '', price: p.price, stockQty: p.stockQty, categoryId: p.categoryId });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      stockQty: Number(form.stockQty),
      categoryId: Number(form.categoryId),
    };
    try {
      if (editId) {
        const res = await productAPI.update(editId, payload);
        setProducts(products.map(p => p.id === editId ? res.data : p));
        setSuccess('Product updated');
      } else {
        const res = await productAPI.create(payload);
        setProducts([res.data, ...products]);
        setSuccess('Product created');
      }
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    setDeleting(p.id);
    try {
      await productAPI.delete(p.id);
      setProducts(products.filter(x => x.id !== p.id));
      setSuccess('Product deleted');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <p className="text-gray-500">Manage your product listings</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><span className="text-red-600">{error}</span></div>}
      {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

      {loading ? (
        <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                <Package className="w-12 h-12 text-green-300" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  <span className="text-lg font-bold text-green-600">Rs. {p.price?.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description || 'No description'}</p>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="px-2 py-1 bg-gray-100 rounded">{p.categoryName}</span>
                  <span className={`px-2 py-1 rounded ${p.stockQty > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.stockQty > 0 ? `${p.stockQty} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(p)} disabled={deleting === p.id} className="flex-1 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center gap-1 disabled:opacity-50">
                    {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" min="0" step="0.01" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock Qty</label>
                  <input type="number" value={form.stockQty} onChange={(e) => setForm({ ...form, stockQty: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" min="0" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white" required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null} {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
