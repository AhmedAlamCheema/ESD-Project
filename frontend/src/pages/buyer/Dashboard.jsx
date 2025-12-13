import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, ShoppingCart, Package, Star } from 'lucide-react';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, spent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const res = await orderAPI.myOrders();
      const spent = res.data.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      setStats({ orders: res.data.length, spent });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.fullName}</h1>
        <p className="text-gray-500">Discover fresh agricultural products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">My Orders</p>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.orders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-3xl font-bold text-gray-800">Rs. {loading ? '...' : stats.spent.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Link to="/buyer/browse" className="p-4 border-2 border-dashed rounded-lg hover:border-green-300 hover:bg-green-50 text-center">
            <Search className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Browse Products</p>
          </Link>
          <Link to="/buyer/cart" className="p-4 border-2 border-dashed rounded-lg hover:border-blue-300 hover:bg-blue-50 text-center">
            <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">View Cart</p>
          </Link>
          <Link to="/buyer/orders" className="p-4 border-2 border-dashed rounded-lg hover:border-purple-300 hover:bg-purple-50 text-center">
            <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium">My Orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
