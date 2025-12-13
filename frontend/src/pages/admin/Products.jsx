import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import { Package, Search, Trash2, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [prod, cat] = await Promise.all([productAPI.list(), categoryAPI.list()]);
      setProducts(prod.data);
      setCategories(cat.data);
    } catch (e) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Remove product "${product.name}"?`)) return;
    setDeleting(product.id);
    setError('');
    try {
      await productAPI.delete(product.id);
      setProducts(products.filter(p => p.id !== product.id));
      setSuccess('Product removed');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to remove product');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter(p => {
    if (catFilter && p.categoryId !== parseInt(catFilter)) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Monitoring</h1>
        <p className="text-gray-500">View and manage all products in the marketplace</p>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><span className="text-red-600">{error}</span></div>}
      {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

      <div className="bg-white rounded-xl p-4 shadow-sm border mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{p.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{p.description || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.categoryName}</td>
                    <td className="px-6 py-4 font-medium">Rs. {p.price?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded ${p.stockQty > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stockQty > 0 ? `${p.stockQty} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.sellerName}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={deleting === p.id}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      >
                        {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Remove
                      </button>
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
