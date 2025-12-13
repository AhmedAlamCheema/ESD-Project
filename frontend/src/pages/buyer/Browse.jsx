import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import { Package, Search, ShoppingCart, Loader2, Filter } from 'lucide-react';

export default function BuyerBrowse() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [added, setAdded] = useState(null);

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const loadData = async () => {
    try {
      const [prod, cat] = await Promise.all([productAPI.list(), categoryAPI.list()]);
      setProducts(prod.data);
      setCategories(cat.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(c => c.productId === product.id);
    if (existing) {
      setCart(cart.map(c => c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { productId: product.id, productName: product.name, price: product.price, quantity: 1 }]);
    }
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const filtered = products.filter(p => {
    if (catFilter && p.categoryId !== parseInt(catFilter)) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Browse Products</h1>
          <p className="text-gray-500">Discover fresh agricultural products</p>
        </div>
        <a href="/buyer/cart" className="relative p-3 bg-green-100 rounded-xl hover:bg-green-200">
          <ShoppingCart className="w-6 h-6 text-green-600" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{cartCount}</span>
          )}
        </a>
      </div>

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

      {loading ? (
        <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-36 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
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
                <p className="text-xs text-gray-400 mb-3">Seller: {p.sellerName}</p>
                <button
                  onClick={() => addToCart(p)}
                  disabled={p.stockQty === 0}
                  className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                    added === p.id ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white hover:bg-green-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {added === p.id ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
