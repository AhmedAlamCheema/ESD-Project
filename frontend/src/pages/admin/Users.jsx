import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { Users as UsersIcon, Mail, Phone, MapPin, Shield, Trash2, Loader2, AlertCircle } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await userAPI.listAll();
      setUsers(res.data);
    } catch (e) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user) => {
    if (!confirm(`Delete user "${user.fullName}"? This cannot be undone.`)) return;
    setDeleting(user.id);
    setError('');
    try {
      await userAPI.delete(user.id);
      setUsers(users.filter(u => u.id !== user.id));
      setSuccess('User deleted');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const getRoleBadge = (role) => {
    const colors = { ADMIN: 'bg-purple-100 text-purple-700', FARMER: 'bg-green-100 text-green-700', BUYER: 'bg-blue-100 text-blue-700' };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        <p className="text-gray-500">View and manage all registered users</p>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><span className="text-red-600">{error}</span></div>}
      {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-medium text-gray-600">
                          {user.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.fullName}</p>
                          <p className="text-sm text-gray-500">{user.city || 'No city'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" /> {user.email}
                      </div>
                      {user.phone && <div className="flex items-center gap-2 text-sm text-gray-500 mt-1"><Phone className="w-4 h-4" /> {user.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      {user.roles?.map(role => (
                        <span key={role} className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded mr-1 ${getRoleBadge(role)}`}>
                          <Shield className="w-3 h-3" /> {role}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={deleting === user.id}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      >
                        {deleting === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
