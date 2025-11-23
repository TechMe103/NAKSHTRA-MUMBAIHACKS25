import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData, Transaction } from '@/contexts/DataContext';
import { useDebounce } from '@/hooks/useDebounce';
import { FaPlus, FaEdit, FaTrash, FaFilter, FaDownload } from 'react-icons/fa';
import { ToastContainer, ToastMessage } from '@/components/Toast';

export default function Transactions() {
  const { state, dispatch } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    type: 'expense' as 'income' | 'expense',
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const categories = useMemo(() => {
    const cats = new Set(state.transactions.map((t) => t.category));
    return ['all', ...Array.from(cats)];
  }, [state.transactions]);

  const filteredTransactions = useMemo(() => {
    return state.transactions.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [state.transactions, debouncedSearch, filterType, filterCategory]);

  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const addToast = (message: string, type: ToastMessage['type']) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);

    if (!formData.title || amount <= 0 || !formData.category || !formData.date) {
      addToast('Please fill all fields correctly', 'error');
      return;
    }

    const transaction: Transaction = {
      id: editingId || Date.now().toString(),
      title: formData.title,
      amount,
      category: formData.category,
      date: formData.date,
      type: formData.type,
    };

    if (editingId) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
      addToast('Transaction updated successfully', 'success');
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      addToast('Transaction added successfully', 'success');
    }

    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', amount: '', category: '', date: '', type: 'expense' });
  };

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      title: transaction.title,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
    });
    setEditingId(transaction.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      addToast('Transaction deleted', 'success');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredTransactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.json';
    link.click();
    addToast('Transactions exported', 'success');
  };

  return (
    <div className="p-6 space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors text-foreground"
          >
            <FaDownload /> Export
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors"
          >
            <FaPlus /> Add Transaction
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 bg-secondary border border-input rounded-lg text-foreground"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 bg-secondary border border-input rounded-lg text-foreground"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-secondary border border-input rounded-lg text-foreground"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FaFilter /> {filteredTransactions.length} results
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-success/10 border border-success/20 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-2xl font-bold text-success">${totals.income.toLocaleString()}</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-destructive">${totals.expense.toLocaleString()}</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className="text-2xl font-bold text-primary">${totals.balance.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-foreground">{transaction.title}</td>
                  <td
                    className={`px-6 py-4 text-sm font-semibold ${
                      transaction.type === 'income' ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-secondary border border-border rounded-full text-xs text-foreground">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{transaction.date}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{transaction.type}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
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
              setFormData({ title: '', amount: '', category: '', date: '', type: 'expense' });
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
                {editingId ? 'Edit Transaction' : 'Add Transaction'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-input rounded-lg text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-input rounded-lg text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-input rounded-lg text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-input rounded-lg text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 bg-secondary border border-input rounded-lg text-foreground"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                      setFormData({ title: '', amount: '', category: '', date: '', type: 'expense' });
                    }}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors"
                  >
                    {editingId ? 'Update' : 'Add'}
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
