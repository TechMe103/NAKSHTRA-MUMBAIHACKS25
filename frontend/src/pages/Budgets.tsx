import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData, Budget } from '@/contexts/DataContext';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ToastContainer, ToastMessage } from '@/components/Toast';

export default function Budgets() {
  const { state, dispatch } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
  });

  const addToast = (message: string, type: ToastMessage['type']) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const radarData = useMemo(() => {
    return state.budgets.map((budget) => ({
      category: budget.category,
      limit: budget.limit,
      spent: budget.spent,
    }));
  }, [state.budgets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(formData.limit);

    if (!formData.category || limit <= 0) {
      addToast('Please fill all fields correctly', 'error');
      return;
    }

    if (editingId) {
      const existing = state.budgets.find((b) => b.id === editingId);
      const budget: Budget = {
        id: editingId,
        category: formData.category,
        limit,
        spent: existing?.spent || 0,
      };
      dispatch({ type: 'UPDATE_BUDGET', payload: budget });
      addToast('Budget updated successfully', 'success');
    } else {
      const budget: Budget = {
        id: Date.now().toString(),
        category: formData.category,
        limit,
        spent: 0,
      };
      dispatch({ type: 'ADD_BUDGET', payload: budget });
      addToast('Budget added successfully', 'success');
    }

    setShowModal(false);
    setEditingId(null);
    setFormData({ category: '', limit: '' });
  };

  const handleEdit = (budget: Budget) => {
    setFormData({
      category: budget.category,
      limit: budget.limit.toString(),
    });
    setEditingId(budget.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      dispatch({ type: 'DELETE_BUDGET', payload: id });
      addToast('Budget deleted', 'success');
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="p-6 space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Budgets</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors"
        >
          <FaPlus /> Add Budget
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Budget Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={state.budgets}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'white' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Bar dataKey="limit" fill="hsl(var(--chart-1))" name="Budget Limit" />
              <Bar dataKey="spent" fill="hsl(var(--chart-3))" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Budget Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="category" stroke="hsl(var(--foreground))" />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
              <Radar name="Limit" dataKey="limit" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} />
              <Radar name="Spent" dataKey="spent" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.3} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'white' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.budgets.map((budget, index) => {
          const percentage = budget.limit > 0 ? Math.round((budget.spent / budget.limit) * 100) : 0;
          const isOverBudget = percentage >= 90;

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-card border rounded-xl p-6 hover:shadow-elevated transition-shadow ${
                isOverBudget ? 'border-destructive/50' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{budget.category}</h3>
                  {isOverBudget && (
                    <div className="flex items-center gap-1 text-destructive text-xs mt-1">
                      <FaExclamationTriangle /> Over Budget
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="text-foreground font-semibold">${budget.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Limit</span>
                  <span className="text-foreground font-semibold">${budget.limit.toLocaleString()}</span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{percentage}% used</span>
                    <span>${Math.max(0, budget.limit - budget.spent).toLocaleString()} left</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(percentage)} transition-all duration-500`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
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
              setFormData({ category: '', limit: '' });
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
                {editingId ? 'Edit Budget' : 'Add Budget'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Budget Limit</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
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
                      setFormData({ category: '', limit: '' });
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
