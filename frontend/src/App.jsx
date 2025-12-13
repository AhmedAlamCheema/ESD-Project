import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCategories from './pages/admin/Categories';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';

// Farmer Pages
import FarmerDashboard from './pages/farmer/Dashboard';
import FarmerProducts from './pages/farmer/Products';
import FarmerOrders from './pages/farmer/Orders';

// Buyer Pages
import BuyerDashboard from './pages/buyer/Dashboard';
import BuyerBrowse from './pages/buyer/Browse';
import BuyerCart from './pages/buyer/Cart';
import BuyerOrders from './pages/buyer/Orders';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAdmin, isFarmer, isBuyer } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Check role access
  if (allowedRoles) {
    const hasAccess = allowedRoles.some(role => {
      if (role === 'ADMIN') return isAdmin();
      if (role === 'FARMER') return isFarmer();
      if (role === 'BUYER') return isBuyer();
      return false;
    });
    if (!hasAccess) {
      // Redirect to appropriate dashboard
      if (isAdmin()) return <Navigate to="/admin" replace />;
      if (isFarmer()) return <Navigate to="/farmer" replace />;
      return <Navigate to="/buyer" replace />;
    }
  }

  return <Layout>{children}</Layout>;
}

function PublicRoute({ children }) {
  const { user, loading, isAdmin, isFarmer } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    if (isAdmin()) return <Navigate to="/admin" replace />;
    if (isFarmer()) return <Navigate to="/farmer" replace />;
    return <Navigate to="/buyer" replace />;
  }

  return children;
}

function RoleRedirect() {
  const { user, loading, isAdmin, isFarmer } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin()) return <Navigate to="/admin" replace />;
  if (isFarmer()) return <Navigate to="/farmer" replace />;
  return <Navigate to="/buyer" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminOrders /></ProtectedRoute>} />

          {/* Farmer Routes */}
          <Route path="/farmer" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/farmer/products" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerProducts /></ProtectedRoute>} />
          <Route path="/farmer/orders" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerOrders /></ProtectedRoute>} />

          {/* Buyer Routes */}
          <Route path="/buyer" element={<ProtectedRoute allowedRoles={['BUYER']}><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/buyer/browse" element={<ProtectedRoute allowedRoles={['BUYER']}><BuyerBrowse /></ProtectedRoute>} />
          <Route path="/buyer/cart" element={<ProtectedRoute allowedRoles={['BUYER']}><BuyerCart /></ProtectedRoute>} />
          <Route path="/buyer/orders" element={<ProtectedRoute allowedRoles={['BUYER']}><BuyerOrders /></ProtectedRoute>} />

          {/* Root redirect based on role */}
          <Route path="/" element={<RoleRedirect />} />
          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
