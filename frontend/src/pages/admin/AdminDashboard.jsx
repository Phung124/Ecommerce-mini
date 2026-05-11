import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { FiTrendingUp, FiShoppingBag, FiBox, FiUsers } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-spinner">Loading stats...</div>;

  const statCards = [
    { title: 'Total Revenue', value: `$${stats?.totalRevenue?.toLocaleString()}`, icon: <FiTrendingUp />, color: '#10b981' },
    { title: 'Total Orders', value: stats?.totalOrders, icon: <FiShoppingBag />, color: '#3b82f6' },
    { title: 'Total Products', value: stats?.totalProducts, icon: <FiBox />, color: '#f59e0b' },
    { title: 'Total Users', value: stats?.totalUsers, icon: <FiUsers />, color: '#8b5cf6' },
  ];

  return (
    <div className="dashboard-view">
      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <h3>{card.title}</h3>
              <p className="stat-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="dashboard-card recent-orders">
          <div className="card-header">
            <h2>Recent Orders</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.username}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan="5" className="empty-state">No recent orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="dashboard-card status-distribution">
          <h2>Orders by Status</h2>
          <div className="status-list">
            {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => (
              <div key={status} className="status-item">
                <div className="status-info">
                  <span className={`status-dot ${status.toLowerCase()}`}></span>
                  <span className="status-name">{status}</span>
                </div>
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: transform 0.3s;
        }

        .stat-card:hover { transform: translateY(-5px); }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-info h3 {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .dashboard-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 1.5rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .card-header h2 { font-size: 1.125rem; }

        .view-all-btn {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .table-container { overflow-x: auto; }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 1rem;
          color: #94a3b8;
          font-weight: 500;
          font-size: 0.875rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        td {
          padding: 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-badge.shipping { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .status-badge.done { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-badge.cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .status-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
        }

        .status-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.pending { background: #f59e0b; }
        .status-dot.shipping { background: #3b82f6; }
        .status-dot.done { background: #10b981; }
        .status-dot.cancelled { background: #ef4444; }

        .status-count { font-weight: 600; }

        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
