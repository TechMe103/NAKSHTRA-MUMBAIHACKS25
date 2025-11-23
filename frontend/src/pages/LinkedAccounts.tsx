import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData, LinkedAccount } from '@/contexts/DataContext';
import { FaPlus, FaEdit, FaTrash, FaSync, FaUniversity } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ToastContainer, ToastMessage } from '@/components/Toast';

export default function LinkedAccounts() {
  const { state, dispatch } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [formData, setFormData] = useState({
    bankName: '',
    accountType: 'Checking',
    balance: '',
  });

  const addToast = (message: string, type: ToastMessage['type']) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  const accountDistribution = state.linkedAccounts.map((account) => ({
    name: account.bankName,
    value: Math.abs(account.balance),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(formData.balance);

    if (!formData.bankName || !formData.accountType) {
      addToast('Please fill all fields', 'error');
      return;
    }

    const account: LinkedAccount = {
      id: editingId || Date.now().toString(),
      bankName: formData.bankName,
      accountType: formData.accountType,
      lastSynced: new Date().toISOString().split('T')[0],
      balance,
    };

    if (editingId) {
      dispatch({ type: 'UPDATE_ACCOUNT', payload: account });
      addToast('Account updated successfully', 'success');
    } else {
      dispatch({ type: 'ADD_ACCOUNT', payload: account });
      addToast('Account added successfully', 'success');
    }

    setShowModal(false);
    setEditingId(null);
    setFormData({ bankName: '', accountType: 'Checking', balance: '' });
  };

  const handleEdit = (account: LinkedAccount) => {
    setFormData({
      bankName: account.bankName,
      accountType: account.accountType,
      balance: account.balance.toString(),
    });
    setEditingId(account.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
      addToast('Account deleted', 'success');
    }
  };

  const handleSync = async (id: string) => {
    setSyncing(id);
    // Simulate sync
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const account = state.linkedAccounts.find((a) => a.id === id);
    if (account) {
      dispatch({
        type: 'UPDATE_ACCOUNT',
        payload: { ...account, lastSynced: new Date().toISOString().split('T')[0] },
      });
      addToast('Account synced successfully', 'success');
    }
    setSyncing(null);
  };

  return (
    <div className="p-6 space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Linked Accounts</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your connected financial accounts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors"
        >
          <FaPlus /> Link Account
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Account Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={accountDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {accountDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'white' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Summary</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Accounts</p>
              <p className="text-2xl font-bold text-foreground">{state.linkedAccounts.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold text-primary">
                ${state.linkedAccounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Synced</p>
              <p className="text-sm text-foreground">
                {state.linkedAccounts[0]?.lastSynced || 'Never'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.linkedAccounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-elevated transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FaUniversity className="text-2xl text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{account.bankName}</h3>
                  <p className="text-sm text-muted-foreground">{account.accountType}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    account.balance >= 0 ? 'text-success' : 'text-destructive'
                  }`}
                >
                  ${Math.abs(account.balance).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last synced: {account.lastSynced}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <button
                onClick={() => handleSync(account.id)}
                disabled={syncing === account.id}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors disabled:opacity-50"
              >
                <FaSync className={syncing === account.id ? 'animate-spin' : ''} />
                {syncing === account.id ? 'Syncing...' : 'Sync'}
              </button>
              <button
                onClick={() => handleEdit(account)}
                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(account.id)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              setEditingId(null);
              setFormData({ bankName: '', accountType: 'Checking', balance: '' });
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-elevated"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {editingId ? 'Edit Account' : 'Link Account'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-input rounded-lg text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Account Type</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-input rounded-lg text-foreground"
                  >
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-input rounded-lg text-foreground"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                      setFormData({ bankName: '', accountType: 'Checking', balance: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors"
                  >
                    {editingId ? 'Update' : 'Link'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
