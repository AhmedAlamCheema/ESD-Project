import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Clock, CheckCircle, Truck, Package, XCircle, Loader2, AlertCircle, CreditCard, User, DollarSign } from 'lucide-react';

export default function FarmerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const res = await orderAPI.sellerOrders();
      setOrders(res.data);
    } catch (e) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    setError('');
    try {
      const res = await orderAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? res.data : o));
      setSuccess('Status updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      CREATED: { bg: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
      PAID: { bg: 'bg-blue-100 text-blue-700', icon: CheckCircle, label: 'Paid' },
      SHIPPED: { bg: 'bg-purple-100 text-purple-700', icon: Truck, label: 'Shipped' },
      DELIVERED: { bg: 'bg-green-100 text-green-700', icon: Package, label: 'Delivered' },
      CANCELLED: { bg: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
    };
    const s = styles[status] || styles.CREATED;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${s.bg}`}>
        <s.icon className="w-3 h-3" /> {s.label}
      </span>
    );
  };

  const getPaymentBadge = (payment) => {
    if (!payment) return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Awaiting Payment</span>;
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      SUCCESS: 'bg-green-100 text-green-700',
      FAILED: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${styles[payment.status] || styles.PENDING}`}>
        <CreditCard className="w-3 h-3" /> {payment.status}
      </span>
    );
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Filter items in each order to only show items from the current farmer
  const getMyItems = (order) => {
    return order.items?.filter(item => item.sellerId === user?.id) || [];
  };

  // Calculate total for my items only
  const getMyTotal = (order) => {
    return getMyItems(order).reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sold Orders</h1>
        <p className="text-gray-500">View orders containing your products and manage their status</p>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><span className="text-red-600">{error}</span></div>}
      {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

      {loading ? (
        <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders for your products yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const myItems = getMyItems(order);
            const myTotal = getMyTotal(order);
            
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Order Header */}
                <div className="p-5 border-b bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                        {getStatusBadge(order.status)}
                        {getPaymentBadge(order.payment)}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Your Earnings</p>
                      <p className="text-2xl font-bold text-green-600">Rs. {myTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="px-5 pt-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Buyer</p>
                      <p className="font-medium text-blue-900">{order.buyerName}</p>
                      <p className="text-xs text-blue-700">{order.buyerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* My Sold Items */}
                <div className="p-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Your Sold Items ({myItems.length})
                  </h4>
                  <div className="space-y-3">
                    {myItems.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.productName}</p>
                            <p className="text-sm text-gray-500">Quantity Sold: <span className="font-semibold">{item.quantity}</span></p>
                            <p className="text-xs text-gray-400">Unit Price: Rs. {item.unitPrice?.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Line Total</p>
                          <p className="font-bold text-green-600">Rs. {item.lineTotal?.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                {order.payment && (
                  <div className="px-5 pb-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Payment Information
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-purple-600">Status</p>
                          <p className="font-medium text-purple-900">{order.payment.status}</p>
                        </div>
                        <div>
                          <p className="text-purple-600">Method</p>
                          <p className="font-medium text-purple-900">{order.payment.method || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-purple-600">Order Total</p>
                          <p className="font-medium text-purple-900">Rs. {order.payment.amount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-purple-600">Paid At</p>
                          <p className="font-medium text-purple-900">{order.payment.paidAt ? formatDate(order.payment.paidAt) : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Update Actions */}
                {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                  <div className="px-5 pb-5">
                    <div className="flex flex-wrap gap-2">
                      {order.status === 'PAID' && (
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'SHIPPED')} 
                          disabled={updating === order.id} 
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />} Mark as Shipped
                        </button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'DELIVERED')} 
                          disabled={updating === order.id} 
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Mark as Delivered
                        </button>
                      )}
                      {order.status === 'CREATED' && (
                        <p className="text-sm text-yellow-600 italic flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Waiting for buyer payment...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
