import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { FiUserCheck, FiUserX, FiTrash2, FiShield } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.data.content);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      await adminService.toggleUserRole(userId);
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Delete this user? This may fail if they have order history.')) {
      try {
        await adminService.deleteUser(userId);
        toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        toast.error('Delete failed (User probably has orders)');
      }
    }
  };

  if (loading) return <div>Loading users...</div>;

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="admin-view">
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td className="font-medium">
                  {user.username}
                  {user.id === currentUser.id && <span className="self-badge">You</span>}
                </td>
                <td>{user.email}</td>
                <td>
                  <div className="roles-list">
                    {user.roles.map(role => (
                      <span key={role} className={`role-badge ${role.toLowerCase()}`}>
                        {role === 'ROLE_ADMIN' ? <FiShield /> : ''} {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  {user.id !== currentUser.id ? (
                    <div className="action-btns">
                      <button 
                        className="role-toggle-btn" 
                        title="Toggle Admin Role"
                        onClick={() => handleToggleRole(user.id)}
                      >
                        {user.roles.includes('ROLE_ADMIN') ? <FiUserX /> : <FiUserCheck />}
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>Protected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .admin-view { display: flex; flex-direction: column; gap: 1.5rem; }
        
        .table-card {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        table { width: 100%; border-collapse: collapse; }
        th { padding: 1.25rem 1.5rem; text-align: left; color: #94a3b8; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        td { padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.875rem; }

        .font-medium { font-weight: 500; color: #f8fafc; display: flex; align-items: center; gap: 0.5rem; }
        .self-badge {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          font-size: 0.65rem;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 700;
        }

        .roles-list { display: flex; gap: 0.5rem; }
        .role-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .role-badge.role_user { background: rgba(148, 163, 184, 0.1); color: #94a3b8; }
        .role-badge.role_admin { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

        .action-btns { display: flex; gap: 0.5rem; }
        .action-btns button {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .role-toggle-btn { background: rgba(255, 255, 255, 0.05); color: #94a3b8; }
        .delete-btn { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
      `}</style>
    </div>
  );
};

export default AdminUsers;
