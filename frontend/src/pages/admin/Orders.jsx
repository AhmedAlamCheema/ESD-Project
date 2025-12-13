import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { ShoppingCart, Clock, CheckCircle, Truck, Package, XCircle, Loader2, AlertCircle, CreditCard, User, Store, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const res = await orderAPI.allOrders();
      setOrders(res.data);
    } catch (e) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

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
        <h1 className="text-2xl font-bold text-gray-800">Order Monitoring</h1>
        <p className="text-gray-500">View all orders with complete buyer, seller, and payment details</p>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><span className="text-red-600">{error}</span></div>}

      {loading ? (
        <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border text-gray-500">No orders yet</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Order Summary Row */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center font-bold text-purple-600">
                    #{order.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{order.buyerName}</span>
                      {getStatusBadge(order.status)}
                      {getPaymentBadge(order.payment)}
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)} • {order.items?.length || 0} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-green-600">Rs. {order.totalAmount?.toLocaleString()}</p>
                  {expanded[order.id] ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </div>

              {/* Expanded Details */}
              {expanded[order.id] && (
                <div className="border-t bg-gray-50 p-5 space-y-4">
                  {/* Buyer Info */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-blue-600">Buyer</p>
                      <p className="font-medium text-blue-900">{order.buyerName} ({order.buyerEmail})</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} × Rs. {item.unitPrice?.toLocaleString()}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Store className="w-3 h-3" /> Seller: {item.sellerName} ({item.sellerEmail})
                              </div>
                            </div>
                          </div>
                          <p className="font-semibold">Rs. {item.lineTotal?.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Info */}
                  {order.payment && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Payment Details
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div><p className="text-purple-600">Status</p><p className="font-medium">{order.payment.status}</p></div>
                        <div><p className="text-purple-600">Method</p><p className="font-medium">{order.payment.method || 'N/A'}</p></div>
                        <div><p className="text-purple-600">Amount</p><p className="font-medium">Rs. {order.payment.amount?.toLocaleString()}</p></div>
                        <div><p className="text-purple-600">Paid At</p><p className="font-medium">{order.payment.paidAt ? formatDate(order.payment.paidAt) : 'N/A'}</p></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
