import { useState, useEffect } from 'react';
import { categoryAPI } from '../../services/api';
import { FolderTree, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const res = await categoryAPI.list();
      setCategories(res.data);
    } catch (e) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError('');
    try {
      const res = await categoryAPI.create(newName.trim());
      setCategories([...categories, res.data]);
      setNewName('');
      setSuccess('Category created');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    setDeleting(id);
    setError('');
    try {
      await categoryAPI.delete(id);
      setCategories(categories.filter(c => c.id !== id));
      setSuccess('Category deleted');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Cannot delete category with products');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <p className="text-gray-500">Create and manage product categories</p>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><span className="text-red-600">{error}</span></div>}
      {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name..."
            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
          <button type="submit" disabled={creating} className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
            {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">All Categories ({categories.length})</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No categories yet</div>
        ) : (
          <div className="divide-y">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderTree className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{cat.name}</p>
                    <p className="text-sm text-gray-500">ID: {cat.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deleting === cat.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                >
                  {deleting === cat.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
