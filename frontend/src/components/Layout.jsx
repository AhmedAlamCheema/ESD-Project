import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Users, FolderTree, ShoppingCart, CreditCard, Star, LogOut, Menu, X, Leaf, Store, Search } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const { user, logout, isAdmin, isFarmer, isBuyer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const adminNav = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  ];

  const farmerNav = [
    { to: '/farmer', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/farmer/products', label: 'My Products', icon: Package },
    { to: '/farmer/orders', label: 'Orders', icon: ShoppingCart },
  ];

  const buyerNav = [
    { to: '/buyer', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/buyer/browse', label: 'Browse', icon: Search },
    { to: '/buyer/cart', label: 'Cart', icon: ShoppingCart },
    { to: '/buyer/orders', label: 'My Orders', icon: Package },
  ];

  let nav = buyerNav;
  let panelName = 'Buyer';
  let panelColor = 'bg-blue-600';
  if (isAdmin()) { nav = adminNav; panelName = 'Admin'; panelColor = 'bg-purple-600'; }
  else if (isFarmer()) { nav = farmerNav; panelName = 'Farmer'; panelColor = 'bg-green-600'; }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-green-600" />
          <span className="font-bold">AgroMarket</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-30 h-full w-64 bg-white border-r transform transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${panelColor} rounded-lg flex items-center justify-center`}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">AgroMarket</h1>
              <span className={`text-xs px-2 py-0.5 rounded ${panelColor} text-white`}>{panelName}</span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === to ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="px-4 py-2 mb-2">
            <p className="font-medium text-gray-800 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>

      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  );
}
