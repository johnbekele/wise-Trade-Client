import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  useAllUsers,
  useAdminStats,
  useCreateUser,
  useUpdateUser,
  useUpdatePassword,
  useToggleAiAccess,
  useDeleteUser
} from '../hooks/useAdmin';
import {
  Users,
  UserPlus,
  Shield,
  ShieldOff,
  Trash2,
  Key,
  Edit,
  X,
  Check,
  AlertCircle,
  Loader2,
  Search,
  RefreshCw,
  Bot,
  BotOff,
  CheckCircle,
  XCircle,
  Crown
} from 'lucide-react';

function CreateUserModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    is_super_Admin: false,
    ai_access_blocked: false
  });
  const [error, setError] = useState('');
  const createUser = useCreateUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUser.mutateAsync(formData);
      onSuccess?.();
      onClose();
      setFormData({ username: '', first_name: '', last_name: '', email: '', password: '', is_super_Admin: false, ai_access_blocked: false });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md border">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Create New User
          </h3>
          <button onClick={onClose} className="btn btn-ghost p-1 h-8 w-8">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label">First Name</label>
              <input type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="input" required />
            </div>
            <div className="space-y-2">
              <label className="label">Last Name</label>
              <input type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="input" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label">Username</label>
            <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="input" required />
          </div>
          <div className="space-y-2">
            <label className="label">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input" required />
          </div>
          <div className="space-y-2">
            <label className="label">Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input" required minLength={6} />
          </div>
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.is_super_Admin} onChange={(e) => setFormData({ ...formData, is_super_Admin: e.target.checked })} className="w-4 h-4 rounded border-border" />
              <span className="text-sm font-medium">Admin Role</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.ai_access_blocked} onChange={(e) => setFormData({ ...formData, ai_access_blocked: e.target.checked })} className="w-4 h-4 rounded border-border" />
              <span className="text-sm font-medium">Block AI Access</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={createUser.isPending} className="btn btn-primary flex-1">
              {createUser.isPending ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>) : (<><UserPlus className="w-4 h-4 mr-2" />Create User</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditUserModal({ user, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    is_super_Admin: user?.is_super_Admin || false,
    is_verified: user?.is_verified || false,
    is_active: user?.is_active || false
  });
  const [error, setError] = useState('');
  const updateUser = useUpdateUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await updateUser.mutateAsync({ userId: user.id, userData: formData });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update user');
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md border">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            Edit User
          </h3>
          <button onClick={onClose} className="btn btn-ghost p-1 h-8 w-8">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label">First Name</label>
              <input type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="input" required />
            </div>
            <div className="space-y-2">
              <label className="label">Last Name</label>
              <input type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="input" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label">Username</label>
            <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="input" required />
          </div>
          <div className="space-y-2">
            <label className="label">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input" required />
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.is_super_Admin} onChange={(e) => setFormData({ ...formData, is_super_Admin: e.target.checked })} className="w-4 h-4 rounded border-border" />
              <span className="text-sm font-medium">Admin</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.is_verified} onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })} className="w-4 h-4 rounded border-border" />
              <span className="text-sm font-medium">Verified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 rounded border-border" />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={updateUser.isPending} className="btn btn-primary flex-1">
              {updateUser.isPending ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>) : (<><Check className="w-4 h-4 mr-2" />Save Changes</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChangePasswordModal({ user, isOpen, onClose, onSuccess }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const updatePassword = useUpdatePassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    try {
      await updatePassword.mutateAsync({ userId: user.id, newPassword });
      onSuccess?.();
      onClose();
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update password');
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md border">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Change Password for {user.username}
          </h3>
          <button onClick={onClose} className="btn btn-ghost p-1 h-8 w-8">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="label">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" required minLength={6} placeholder="Enter new password" />
          </div>
          <div className="space-y-2">
            <label className="label">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" required minLength={6} placeholder="Confirm new password" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={updatePassword.isPending} className="btn btn-primary flex-1">
              {updatePassword.isPending ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</>) : (<><Key className="w-4 h-4 mr-2" />Update Password</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ user, isOpen, onClose, onConfirm, isDeleting }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md border">
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
            <Trash2 className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Delete User?</h3>
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete <strong>{user.username}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn btn-outline flex-1">Cancel</button>
            <button onClick={() => onConfirm(user.id)} disabled={isDeleting} className="btn bg-destructive text-destructive-foreground hover:bg-destructive/90 flex-1">
              {isDeleting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</>) : (<><Trash2 className="w-4 h-4 mr-2" />Delete User</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const isAdmin = user?.is_super_Admin;
  const { data: users = [], isLoading: loadingUsers, refetch: refetchUsers } = useAllUsers();
  const { data: stats, isLoading: loadingStats } = useAdminStats();
  const toggleAiAccess = useToggleAiAccess();
  const deleteUserMutation = useDeleteUser();

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card text-center max-w-md">
          <div className="card-content py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
              <ShieldOff className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">You don't have permission to access the admin panel.</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleAiAccess = async (userId, currentStatus) => {
    try { await toggleAiAccess.mutateAsync({ userId, blocked: !currentStatus }); } catch (err) { console.error('Failed to toggle AI access:', err); }
  };

  const handleDeleteUser = async (userId) => {
    try { await deleteUserMutation.mutateAsync(userId); setDeleteUser(null); } catch (err) { console.error('Failed to delete user:', err); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Admin Panel
          </h2>
          <p className="text-muted-foreground">Manage users and system settings</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refetchUsers()} disabled={loadingUsers} className="btn btn-outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loadingUsers ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={() => setCreateModalOpen(true)} className="btn btn-primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card">
          <div className="card-content pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg"><Users className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold">{loadingStats ? '...' : stats?.total_users}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">{loadingStats ? '...' : stats?.active_users}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg"><Check className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{loadingStats ? '...' : stats?.verified_users}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg"><Crown className="w-5 h-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold">{loadingStats ? '...' : stats?.admin_users}</p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-destructive/10 p-2 rounded-lg"><BotOff className="w-5 h-5 text-destructive" /></div>
              <div>
                <p className="text-2xl font-bold">{loadingStats ? '...' : stats?.ai_blocked_users}</p>
                <p className="text-xs text-muted-foreground">AI Blocked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="card-title">User Management</h3>
              <p className="card-description">View and manage all registered users</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search users..." className="input pl-9 h-9 text-sm" />
            </div>
          </div>
        </div>
        <div className="card-content p-0">
          {loadingUsers ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-2">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{searchQuery ? 'No users match your search' : 'No users found'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Access</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                            {u.first_name?.charAt(0)}{u.last_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{u.first_name} {u.last_name}</p>
                            <p className="text-xs text-muted-foreground">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{u.email}</p>
                        <p className="text-xs text-muted-foreground">{u.auth_provider}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {u.is_verified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" />Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              <XCircle className="w-3 h-3" />Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleAiAccess(u.id, u.ai_access_blocked)}
                          disabled={toggleAiAccess.isPending}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${u.ai_access_blocked ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                          title={u.ai_access_blocked ? 'Click to unblock' : 'Click to block'}
                        >
                          {u.ai_access_blocked ? (<><BotOff className="w-3 h-3" />Blocked</>) : (<><Bot className="w-3 h-3" />Allowed</>)}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {u.is_super_Admin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <Shield className="w-3 h-3" />Admin
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">User</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditUser(u)} className="btn btn-ghost p-1 h-8 w-8" title="Edit user"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setPasswordUser(u)} className="btn btn-ghost p-1 h-8 w-8" title="Change password"><Key className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteUser(u)} className="btn btn-ghost p-1 h-8 w-8 text-destructive hover:text-destructive" title="Delete user" disabled={u.id === user?.id}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CreateUserModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} onSuccess={() => refetchUsers()} />
      <EditUserModal user={editUser} isOpen={!!editUser} onClose={() => setEditUser(null)} onSuccess={() => refetchUsers()} />
      <ChangePasswordModal user={passwordUser} isOpen={!!passwordUser} onClose={() => setPasswordUser(null)} onSuccess={() => {}} />
      <DeleteConfirmModal user={deleteUser} isOpen={!!deleteUser} onClose={() => setDeleteUser(null)} onConfirm={handleDeleteUser} isDeleting={deleteUserMutation.isPending} />
    </div>
  );
}
