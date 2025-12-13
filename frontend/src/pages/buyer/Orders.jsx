import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { ShoppingCart, Clock, CheckCircle, Truck, Package, XCircle, Loader2, AlertCircle, CreditCard, User, Store } from 'lucide-react';

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const res = await orderAPI.myOrders();
      setOrders(res.data);
    } catch (e) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
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
    if (!payment) return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">No Payment</span>;
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <p className="text-gray-500">Track your purchased orders and payment status</p>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><span className="text-red-600">{error}</span></div>}

      {loading ? (
        <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No orders yet</p>
          <a href="/buyer/browse" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
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
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">Rs. {order.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Order Items ({order.items?.length || 0})
                </h4>
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.productName}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × Rs. {item.unitPrice?.toLocaleString()}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                            <Store className="w-3 h-3" /> Sold by: {item.sellerName}
                          </div>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800">Rs. {item.lineTotal?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              {order.payment && (
                <div className="px-5 pb-5">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Payment Details
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-blue-600">Method</p>
                        <p className="font-medium text-blue-900">{order.payment.method || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Amount</p>
                        <p className="font-medium text-blue-900">Rs. {order.payment.amount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Reference</p>
                        <p className="font-medium text-blue-900">{order.payment.reference || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Paid At</p>
                        <p className="font-medium text-blue-900">{order.payment.paidAt ? formatDate(order.payment.paidAt) : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
