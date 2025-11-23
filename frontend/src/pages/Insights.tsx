import { useState, useMemo, useRef } from 'react'; // Added useRef
import { motion, AnimatePresence } from 'framer-motion';
import { useData, Insight } from '@/contexts/DataContext';
import { FaPlus, FaEdit, FaTrash, FaLightbulb, FaChartPie, FaFileUpload, FaChartBar } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ToastContainer, ToastMessage } from '@/components/Toast';

export default function Insights() {
  const { state, dispatch } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  // State to control the visibility of the financial plan
  const [showPlan, setShowPlan] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  // Refs for the hidden file inputs
  const expenseFileRef = useRef<HTMLInputElement>(null);
  const loanFileRef = useRef<HTMLInputElement>(null);
  const investmentFileRef = useRef<HTMLInputElement>(null);

  const addToast = (message: string, type: ToastMessage['type']) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
    
  // Function to handle file selection and show a toast
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileName = event.target.files[0].name;
      addToast(`File "${fileName}" selected`, 'info');
    }
  };

  const topSpending = useMemo(() => {
    return state.budgets
      .map((b) => ({ category: b.category, spent: b.spent }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);
  }, [state.budgets]);

  const monthlyTrends = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
      month,
      income: Math.round(3000 + Math.random() * 2000),
      spending: Math.round(1500 + Math.random() * 1000 + i * 50),
    }));
  }, []);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      addToast('Please fill all fields', 'error');
      return;
    }

    const insight: Insight = {
      id: editingId || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: new Date().toISOString().split('T')[0],
    };

    if (editingId) {
      dispatch({ type: 'UPDATE_INSIGHT', payload: insight });
      addToast('Insight updated successfully', 'success');
    } else {
      dispatch({ type: 'ADD_INSIGHT', payload: insight });
      addToast('Insight added successfully', 'success');
    }

    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', description: '' });
  };

  const handleEdit = (insight: Insight) => {
    setFormData({
      title: insight.title,
      description: insight.description,
    });
    setEditingId(insight.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this insight?')) {
      dispatch({ type: 'DELETE_INSIGHT', payload: id });
      addToast('Insight deleted', 'success');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Insights</h2>
          <p className="text-sm text-muted-foreground mt-1">Intelligent financial recommendations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors"
        >
          <FaPlus /> Add Insight
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FaChartPie className="text-primary" /> Top Spending Categories
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={topSpending}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="spent"
              >
                {topSpending.map((entry, index) => (
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
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'white' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Bar dataKey="spending" fill="hsl(var(--chart-3))" name="Spending" />
              <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Income" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI Insights Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FaLightbulb className="text-warning" /> Your Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-foreground mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(insight)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(insight.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{insight.date}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== FINANCIAL PLANNING SECTION STARTS HERE ===== */}
      <div className="mt-12 pt-12 border-t border-border space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Financial Planning</h2>
            <p className="text-sm text-muted-foreground mt-1">Build your personalized financial plan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 bg-card border border-border rounded-xl p-6"
          >
            <label className="block text-sm font-semibold text-foreground mb-2">Monthly Income</label>
            <input
              type="number"
              placeholder="Enter your monthly income"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </motion.div>

          {/* Monthly Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Expenses</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Rent, Food, Transport"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Amount</label>
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Upload Proof</label>
                      {/* FIX: Trigger hidden file input on click */}
                <div
                        onClick={() => expenseFileRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg cursor-pointer hover:bg-background/80 transition-colors"
                      >
                  <FaFileUpload className="text-primary" />
                  <span className="text-sm text-muted-foreground">Click to upload proof</span>
                  <input type="file" ref={expenseFileRef} onChange={handleFileSelect} className="hidden" />
                </div>
              </div>
                    {/* FIX: Add dummy toast on click */}
              <button
                        onClick={() => addToast('Expense added successfully!', 'success')}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                <FaPlus /> Add Expense
              </button>
            </div>
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {/* Expense items will be listed here */}
            </div>
          </motion.div>

          {/* Loans & Rent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Loans & Rent</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Select Type</option>
                  <option value="home_loan">Home Loan</option>
                  <option value="personal_loan">Personal Loan</option>
                  <option value="car_loan">Car Loan</option>
                  <option value="rent">Rent</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Principal Amount</label>
                <input
                  type="number"
                  placeholder="Principal Amount"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">From Institution</label>
                <input
                  type="text"
                  placeholder="Bank/Institution name"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Monthly EMI</label>
                <input
                  type="number"
                  placeholder="Monthly EMI"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Upload Proof</label>
                        {/* FIX: Trigger hidden file input on click */}
                <div
                            onClick={() => loanFileRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg cursor-pointer hover:bg-background/80 transition-colors"
                        >
                  <FaFileUpload className="text-primary" />
                  <span className="text-sm text-muted-foreground">Click to upload proof</span>
                  <input type="file" ref={loanFileRef} onChange={handleFileSelect} className="hidden" />
                </div>
              </div>
                    {/* FIX: Add dummy toast on click */}
              <button
                        onClick={() => addToast('Loan added successfully!', 'success')}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                <FaPlus /> Add Loan
              </button>
            </div>
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {/* Loan items will be listed here */}
            </div>
          </motion.div>

          {/* Investments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Investments</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="sip">SIP</option>
                  <option value="stock">Stock</option>
                  <option value="mutual_fund">Mutual Fund</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Investment name"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Monthly Amount</label>
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Upload Proof</label>
                        {/* FIX: Trigger hidden file input on click */}
                <div
                            onClick={() => investmentFileRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg cursor-pointer hover:bg-background/80 transition-colors"
                        >
                  <FaFileUpload className="text-primary" />
                  <span className="text-sm text-muted-foreground">Click to upload proof</span>
                  <input type="file" ref={investmentFileRef} onChange={handleFileSelect} className="hidden" />
                </div>
              </div>
                    {/* FIX: Add dummy toast on click */}
              <button
                        onClick={() => addToast('Investment added successfully!', 'success')}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                <FaPlus /> Add Investment
              </button>
            </div>
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {/* Investment items will be listed here */}
            </div>
          </motion.div>
        </div>

        {/* Design Plan Button */}
        <div className="flex justify-center pt-4">
          {/* FIX: Add onClick to show the plan */}
          <button
            onClick={() => setShowPlan(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:shadow-lg transition-all font-semibold text-lg"
          >
            <FaChartBar /> Design My Planning
          </button>
        </div>

        {/* ===== FIX: Conditionally render the entire charts and summary section ===== */}
        <AnimatePresence>
          {showPlan && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Income', value: '₹50,000', color: 'from-blue-500' },
                { label: 'Total Expenses', value: '₹20,000', color: 'from-red-500' },
                { label: 'Total EMI', value: '₹8,000', color: 'from-orange-500' },
                { label: 'Savings', value: '₹22,000', color: 'from-green-500' },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-gradient-to-br ${card.color} to-transparent border border-border rounded-xl p-4`}
                >
                  <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Budget Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Expenses', value: 20000, fill: 'hsl(var(--chart-1))' },
                        { name: 'Loan EMI', value: 8000, fill: 'hsl(var(--chart-2))' },
                        { name: 'Investments', value: 5000, fill: 'hsl(var(--chart-3))' },
                        { name: 'Savings', value: 22000, fill: 'hsl(var(--chart-4))' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {[0, 1, 2, 3].map((index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                      ))}
                    </Pie>
                    <Tooltip
  contentStyle={{ 
    backgroundColor: 'hsl(var(--card))', 
    border: '1px solid hsl(var(--border))',
    color: 'hsl(var(--foreground))' 
  }}
  itemStyle={{ color: 'hsl(var(--foreground))' }} // <-- Add this line
  formatter={(value: any) => `₹${value}`}
/>
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Bar Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Allocation (4 Weeks)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart
                    data={[
                      { month: 'Week 1', expenses: 5000, loans: 2000, investments: 1250, savings: 5500 },
                      { month: 'Week 2', expenses: 5000, loans: 2000, investments: 1250, savings: 5500 },
                      { month: 'Week 3', expenses: 5000, loans: 2000, investments: 1250, savings: 5500 },
                      { month: 'Week 4', expenses: 5000, loans: 2000, investments: 1250, savings: 5500 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      formatter={(value: any) => `₹${value}`}
                    />
                    <Legend />
                    <Bar dataKey="expenses" fill="hsl(var(--chart-1))" name="Expenses" />
          _          <Bar dataKey="loans" fill="hsl(var(--chart-2))" name="Loan EMI" />
                    <Bar dataKey="investments" fill="hsl(var(--chart-3))" name="Investments" />
                    <Bar dataKey="savings" fill="hsl(var(--chart-4))" name="Savings" />
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Line Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-xl p-6 lg:col-span-2"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Financial Health Over 6 Months</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart
                    data={[
                      { month: 'Jan', income: 50000, expenses: 20000, savings: 22000 },
                      { month: 'Feb', income: 51000, expenses: 19500, savings: 23500 },
                      { month: 'Mar', income: 52500, expenses: 20500, savings: 24500 },
                      { month: 'Apr', income: 51500, expenses: 20000, savings: 23500 },
                      { month: 'May', income: 54000, expenses: 19000, savings: 27000 },
                      { month: 'Jun', income: 55000, expenses: 19500, savings: 28000 },
                    ]}
              >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      formatter={(value: any) => `₹${value}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Expenses" />
                    <Line type="monotone" dataKey="savings" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Savings" />
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* AI Generated Plan Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FaLightbulb className="text-warning" /> AI-Generated Financial Plan
              </h3>
              <div className="space-y-3 text-sm text-foreground">
                <p>
                  <strong>Monthly Income:</strong> ₹50,000
                </p>
                <p>
                  <strong>Total Expenses:</strong> ₹20,000 (40% of income)
                </p>
                <p>
                  <strong>Loan EMI Obligations:</strong> ₹8,000 (16% of income)
                </p>
                <p>
                  <strong>Monthly Investments:</strong> ₹5,000 (10% of income)
                </p>
                <p>
                  <strong>Remaining Savings:</strong> ₹22,000 (44% of income)
                </p>
                <hr className="border-border my-3" />
                <div className="bg-background p-4 rounded-lg">
                  <p className="font-semibold text-primary mb-2">💡 Recommendations:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                    <li>Your financial health is excellent with 44% savings rate.</li>
                    <li>Consider building an emergency fund covering 6 months of expenses (₹120,000).</li>
                    <li>Increase SIP investments by ₹2,000/month for better long-term wealth creation.</li>
                    <li>Your loan-to-income ratio (16%) is healthy. Maintain this discipline.</li>
                    <li>Projected annual savings growth: 20% with current financial habits.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* ===== FINANCIAL PLANNING SECTION ENDS HERE ===== */}
    </div>
  );
}