import React, { useEffect, useState } from 'react';
import api, { adminService } from '../../services/api';
import { FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders?size=50');
      setOrders(response.data.content);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success('Status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="admin-view">
      <div className="view-header">
        <div className="filters">
          <button className="filter-btn active">All Orders</button>
          <button className="filter-btn">Pending</button>
          <button className="filter-btn">Delivered</button>
        </div>
      </div>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className={`order-item-card ${expandedOrder === order.id ? 'expanded' : ''}`}>
            <div className="order-main-info" onClick={() => toggleExpand(order.id)}>
              <div className="info-group">
                <span className="label">Order ID</span>
                <span className="value">#{order.id}</span>
              </div>
              <div className="info-group">
                <span className="label">Customer</span>
                <span className="value">{order.username}</span>
              </div>
              <div className="info-group">
                <span className="label">Total</span>
                <span className="value font-bold">${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="info-group">
                <span className="label">Date</span>
                <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="status-select-wrapper" onClick={e => e.stopPropagation()}>
                <select 
                  value={order.status} 
                  onChange={e => handleStatusChange(order.id, e.target.value)}
                  className={`status-select ${order.status.toLowerCase()}`}
                >
                  <option value="PENDING">Pending</option>
                  <option value="SHIPPING">Shipping</option>
                  <option value="DONE">Done</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="expand-icon">
                {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="order-details">
                <div className="details-grid">
                  <div className="shipping-info">
                    <h3>Shipping Address</h3>
                    <p>{order.shippingStreet}</p>
                    <p>{order.shippingCity}, {order.shippingState} {order.shippingZipCode}</p>
                    <p>Phone: {order.shippingPhoneNumber}</p>
                  </div>
                  <div className="order-items-table">
                    <h3>Items</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price}</td>
                            <td>${(item.quantity * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .admin-view { display: flex; flex-direction: column; gap: 1.5rem; }
        .view-header { display: flex; justify-content: space-between; align-items: center; }
        
        .filters { display: flex; gap: 0.5rem; }
        .filter-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          cursor: pointer;
        }
        .filter-btn.active {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          border-color: rgba(59, 130, 246, 0.3);
        }

        .orders-list { display: flex; flex-direction: column; gap: 1rem; }
        
        .order-item-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s;
        }
        .order-item-card.expanded { border-color: rgba(59, 130, 246, 0.3); }

        .order-main-info {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr 2fr 40px;
          padding: 1.5rem;
          align-items: center;
          cursor: pointer;
        }

        .info-group { display: flex; flex-direction: column; gap: 0.25rem; }
        .label { font-size: 0.75rem; color: #94a3b8; }
        .value { font-size: 0.875rem; font-weight: 500; }
        .font-bold { font-weight: 700; font-size: 1rem; color: #60a5fa; }

        .status-select {
          padding: 0.5rem 1rem;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          outline: none;
        }
        .status-select.pending { background: #fef3c7; color: #d97706; }
        .status-select.shipping { background: #dbeafe; color: #2563eb; }
        .status-select.done { background: #d1fae5; color: #059669; }
        .status-select.cancelled { background: #fee2e2; color: #dc2626; }

        .order-details {
          padding: 0 1.5rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(0, 0, 0, 0.1);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          padding-top: 1.5rem;
        }

        .shipping-info h3, .order-items-table h3 {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: #f8fafc;
        }

        .shipping-info p { color: #94a3b8; font-size: 0.875rem; margin-bottom: 0.25rem; }

        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 0.75rem; color: #94a3b8; font-size: 0.75rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        td { padding: 0.75rem; font-size: 0.875rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>
    </div>
  );
};

export default AdminOrders;
