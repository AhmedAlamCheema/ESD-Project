import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, orderAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const [prod, ord, me] = await Promise.all([
        productAPI.list(),
        orderAPI.sellerOrders().catch(() => ({ data: [] })),
        userAPI.me(),
      ]);
      // Filter products by current user (seller)
      const myProducts = prod.data.filter(p => p.sellerId === user?.id);
      // Revenue comes from user profile (updated on successful payment)
      const revenue = me.data.revenue || 0;
      setStats({ products: myProducts.length, orders: ord.data.length, revenue });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Farmer Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.fullName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">My Products</p>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.products}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.orders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-3xl font-bold text-gray-800">Rs. {loading ? '...' : stats.revenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/farmer/products" className="p-4 border-2 border-dashed rounded-lg hover:border-green-300 hover:bg-green-50 text-center">
            <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Manage Products</p>
          </Link>
          <Link to="/farmer/orders" className="p-4 border-2 border-dashed rounded-lg hover:border-blue-300 hover:bg-blue-50 text-center">
            <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">View Orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
