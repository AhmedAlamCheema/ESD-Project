import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, paymentAPI } from '../../services/api';
import { ShoppingCart, Plus, Minus, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function BuyerCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const updateQty = (productId, delta) => {
    setCart(cart.map(c => {
      if (c.productId === productId) {
        const newQty = Math.max(1, c.quantity + delta);
        return { ...c, quantity: newQty };
      }
      return c;
    }));
  };

  const removeItem = (productId) => {
    setCart(cart.filter(c => c.productId !== productId));
  };

  const total = cart.reduce((sum, c) => sum + (c.price * c.quantity), 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    setError('');
    try {
      // Create order
      const orderRes = await orderAPI.create({
        items: cart.map(c => ({ productId: c.productId, quantity: c.quantity }))
      });
      
      // Simulate payment
      await paymentAPI.create({
        orderId: orderRes.data.id,
        amount: orderRes.data.totalAmount,
        method: 'CARD',
        reference: `PAY-${Date.now()}`
      });

      setCart([]);
      localStorage.removeItem('cart');
      setSuccess('Order placed successfully!');
      setTimeout(() => navigate('/buyer/orders'), 2000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
        <p className="text-gray-500">{cart.length} items in your cart</p>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><span className="text-red-600">{error}</span></div>}
      {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-green-700">{success}</span></div>}

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <a href="/buyer/browse" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
            Browse Products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.productId} className="bg-white rounded-xl p-4 shadow-sm border flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-8 h-8 text-green-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{item.productName}</h3>
                  <p className="text-green-600 font-medium">Rs. {item.price?.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.productId, -1)} className="p-2 border rounded-lg hover:bg-gray-50">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, 1)} className="p-2 border rounded-lg hover:bg-gray-50">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-bold text-gray-800 w-24 text-right">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                <button onClick={() => removeItem(item.productId)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={placeOrder}
              disabled={placing || cart.length === 0}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {placing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              {placing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
