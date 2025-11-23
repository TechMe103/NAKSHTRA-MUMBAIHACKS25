import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaWallet, FaArrowUp, FaArrowDown, FaChartLine, FaLightbulb, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useEffect } from 'react';
import {useMotionValue, useTransform, animate } from 'framer-motion';

// Helper component to animate numbers
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, count]);

  // THE FIX: The MotionValue `rounded` is now the direct child of <motion.span>.
  // The prefix and suffix are standard text outside of it.
  return (
    <>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </>
  );
}

export default function Dashboard() {
  const { state } = useData();
  const navigate = useNavigate();

  // Calculate metrics
  const metrics = useMemo(() => {
    const income = state.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = state.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBudget = state.budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = state.budgets.reduce((sum, b) => sum + b.spent, 0);

    return {
      balance: income - expenses,
      monthlySpending: expenses,
      budgetLeft: totalBudget - totalSpent,
      budgetPercentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
    };
  }, [state.transactions, state.budgets]);

  // Chart data
  const spendingTrends = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
      month,
      spending: Math.round(1000 + Math.random() * 500 + i * 100),
      income: Math.round(3000 + Math.random() * 1000),
    }));
  }, []);

  const categoryData = useMemo(() => {
    return state.budgets.map((budget) => ({
      name: budget.category,
      value: budget.spent,
    }));
  }, [state.budgets]);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const budgetProgress = useMemo(() => {
    const totalBudget = 500; // Assuming total budget for demo
    const spent = 175;
    const remaining = 325;
    return [
      { x: 0, spent: 0, remaining: totalBudget },
      { x: 0.25, spent: spent * 0.25, remaining: totalBudget - spent * 0.25 },
      { x: 0.5, spent: spent * 0.5, remaining: totalBudget - spent * 0.5 },
      { x: 0.75, spent: spent * 0.75, remaining: totalBudget - spent * 0.75 },
      { x: 1, spent: spent, remaining: remaining },
    ];
  }, []);

  const recentTransactions = useMemo(() => {
    return state.transactions.slice(-5).reverse();
  }, [state.transactions]);

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-elevated transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-muted-foreground">Total Balance</h3>
            <FaWallet className="text-primary text-xl" />
          </div>
          <p className="text-3xl font-bold text-foreground">${metrics.balance.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-elevated transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-muted-foreground">Monthly Spending</h3>
            <FaArrowDown className="text-destructive text-xl" />
          </div>
          <p className="text-3xl font-bold text-foreground">${metrics.monthlySpending.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">-5% from last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-elevated transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-muted-foreground">Budget Left</h3>
            <FaChartLine className="text-success text-xl" />
          </div>
          <p className="text-3xl font-bold text-foreground">${metrics.budgetLeft.toLocaleString()}</p>
          <div className="mt-2 bg-secondary rounded-full h-2">
            <div
              className="bg-success rounded-full h-2 transition-all"
              style={{ width: `${100 - metrics.budgetPercentage}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-elevated transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-muted-foreground">AI Insights</h3>
            <FaArrowUp className="text-primary text-xl" />
          </div>
          <p className="text-3xl font-bold text-foreground">{state.insights.length}</p>
          <p className="text-xs text-muted-foreground mt-2">Active recommendations</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Spending Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={spendingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'white' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line type="monotone" dataKey="spending" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                minAngle={5}
              >
                {categoryData.map((entry, index) => (
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
      </div>

      {/* Budget Progress & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Budget Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={budgetProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                type="number"
                domain={[0, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px hsl(var(--shadow))',
                  color: 'white'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value, name) => [`$${value}`, name === 'spent' ? 'Spent: $175' : 'Remaining: $325']}
              />
              <Line
                type="monotone"
                dataKey="spent"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="remaining"
                stroke="hsl(var(--chart-2))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            <button
              onClick={() => navigate('/transactions')}
              className="text-sm text-primary hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction.title}</p>
                  <p className="text-xs text-muted-foreground">{transaction.category}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      transaction.type === 'income' ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      {/* ===== ENHANCED PLANNING & RECOMMENDATION SECTION ===== */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2, // Stagger the animation of children
            },
          },
        }}
        className="space-y-6"
      >
        <motion.h2
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="text-2xl font-bold text-foreground pt-6 border-t border-border"
        >
          Your Financial Plan
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* --- Diagrammatic Plan (Next Level) --- */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
            className="lg:col-span-3 bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-foreground mb-8 text-center">
              Monthly Cash Flow
            </h3>
            {/* FIX: Removed `h-full` and `justify-around`. 
              This allows the content to stack naturally from the top.
              Increased vertical spacing with `space-y-6`.
            */}
            <div className="flex flex-col items-center space-y-6 font-sans">
              
              {/* Income Node */}
              <motion.div whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }} className="flex items-center gap-4 bg-green-500/10 p-4 rounded-xl ring-1 ring-green-500/30 w-full max-w-sm">
                <div className="bg-green-500/80 p-3 rounded-full shadow-lg"><FaArrowDown className="text-white h-6 w-6" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-foreground">
                    <AnimatedNumber value={50000} prefix="₹" />
                  </p>
                </div>
              </motion.div>

              <FaArrowDown className="text-muted-foreground/70 text-2xl" />

              {/* Outflows Container */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                <motion.div whileHover={{ scale: 1.05 }} className="bg-red-500/10 text-center p-3 rounded-xl ring-1 ring-red-500/30">
                  <p className="text-xs text-muted-foreground">Expenses</p>
                  <p className="font-semibold text-foreground"><AnimatedNumber value={20000} prefix="-₹" /></p>
                  <p className="text-[10px] text-red-400">(40%)</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="bg-orange-500/10 text-center p-3 rounded-xl ring-1 ring-orange-500/30">
                  <p className="text-xs text-muted-foreground">Loans / EMI</p>
                  <p className="font-semibold text-foreground"><AnimatedNumber value={8000} prefix="-₹" /></p>
                  <p className="text-[10px] text-orange-400">(16%)</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="bg-blue-500/10 text-center p-3 rounded-xl ring-1 ring-blue-500/30">
                  <p className="text-xs text-muted-foreground">Investments</p>
                  <p className="font-semibold text-foreground"><AnimatedNumber value={5000} prefix="-₹" /></p>
                  <p className="text-[10px] text-blue-400">(10%)</p>
                </motion.div>
              </div>

              {/* Total Outflow Summary */}
              <div className="w-full max-w-2xl flex justify-center items-center pt-2">
                  <div className="border-t-2 border-dashed border-muted-foreground/30 w-1/3"></div>
                  <p className="text-xs text-muted-foreground px-2">Total Outflow: ₹33,000</p>
                  <div className="border-t-2 border-dashed border-muted-foreground/30 w-1/3"></div>
              </div>

              <FaArrowDown className="text-muted-foreground/70 text-2xl" />

              {/* Savings Node */}
              <motion.div whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }} className="flex items-center gap-4 bg-purple-500/10 p-4 rounded-xl ring-1 ring-purple-500/30 w-full max-w-sm">
                 <div className="bg-purple-500/80 p-3 rounded-full shadow-lg"><FaWallet className="text-white h-6 w-6" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Savings</p>
                  <p className="text-2xl font-bold text-foreground">
                    <AnimatedNumber value={17000} prefix="₹" />
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* --- AI Recommendations (Next Level) --- */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
            className="lg:col-span-2 bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FaLightbulb className="text-yellow-400" /> AI Recommendations
            </h3>
            <motion.ul 
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }} 
              className="space-y-4"
            >
              {[
                {
                  icon: FaCheckCircle,
                  iconColor: "text-green-400",
                  title: "Excellent Savings Rate",
                  description: "Your 34% savings rate is fantastic and puts you on a great track for financial independence.",
                  priority: "Info",
                  priorityColor: "bg-green-500/20 text-green-300"
                },
                {
                  icon: FaExclamationTriangle,
                  iconColor: "text-yellow-400",
                  title: "Build Emergency Fund",
                  description: "Prioritize creating a fund with 3-6 months of essential expenses (approx. ₹84,000 - ₹168,000).",
                  priority: "High",
                  priorityColor: "bg-yellow-500/20 text-yellow-300"
                },
                {
                  icon: FaArrowUp,
                  iconColor: "text-blue-400",
                  title: "Accelerate Investments",
                  description: "Once your emergency fund is stable, consider increasing your investment contributions by 5-10%.",
                  priority: "Medium",
                  priorityColor: "bg-blue-500/20 text-blue-300"
                },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ backgroundColor: 'hsl(var(--secondary))', scale: 1.02 }}
                  className="flex items-start gap-4 p-4 rounded-lg transition-colors duration-200"
                >
                  <item.icon className={`${item.iconColor} text-2xl mt-1 flex-shrink-0`} />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${item.priorityColor}`}>{item.priority}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </motion.div>
      {/* ===== SECTION ENDS HERE ===== */}
    </div>
  );
}
