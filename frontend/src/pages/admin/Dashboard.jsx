import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI, productAPI, userAPI, orderAPI } from '../../services/api';
import { FolderTree, Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, products: 0, users: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [cat, prod, usr, ord] = await Promise.all([
        categoryAPI.list(),
        productAPI.list(),
        userAPI.listAll(),
        orderAPI.allOrders().catch(() => ({ data: [] })),
      ]);
      setStats({
        categories: cat.data.length,
        products: prod.data.length,
        users: usr.data.length,
        orders: ord.data.length,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: 'Categories', value: stats.categories, icon: FolderTree, color: 'bg-blue-500', to: '/admin/categories' },
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-green-500', to: '/admin/products' },
    { label: 'Users', value: stats.users, icon: Users, color: 'bg-purple-500', to: '/admin/users' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-orange-500', to: '/admin/orders' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="text-3xl font-bold text-gray-800">{loading ? '...' : c.value}</p>
              </div>
              <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center`}>
                <c.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/admin/users" className="p-4 border-2 border-dashed rounded-lg hover:border-purple-300 hover:bg-purple-50 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Manage Users</p>
          </Link>
          <Link to="/admin/categories" className="p-4 border-2 border-dashed rounded-lg hover:border-blue-300 hover:bg-blue-50 text-center">
            <FolderTree className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Categories</p>
          </Link>
          <Link to="/admin/products" className="p-4 border-2 border-dashed rounded-lg hover:border-green-300 hover:bg-green-50 text-center">
            <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Products</p>
          </Link>
          <Link to="/admin/orders" className="p-4 border-2 border-dashed rounded-lg hover:border-orange-300 hover:bg-orange-50 text-center">
            <ShoppingCart className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
