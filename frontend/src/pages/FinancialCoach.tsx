import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaPaperPlane, FaMicrophone } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ToastContainer, ToastMessage } from '@/components/Toast'; // Assuming you have a Toast component

// --- Interfaces & Dummy Data ---
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'coach';
}

interface LogEntry {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  timestamp: Date;
}

const knowledgeBase: { [key: string]: string } = {
  'How can I start saving money?': `That's the best first question to ask! The most effective method is to "Pay Yourself First." Before you pay any bills or buy anything else, transfer a set amount to your savings. Think of it as the most important bill you have to pay each month. Even starting with ₹1,000 can build a powerful habit.`,
  'What is a good budget to follow?': `A great starting point is the 50/30/20 rule. It's a simple framework:
●	50% for Needs: This covers your essentials like rent, utilities, and groceries.
●	30% for Wants: This is for lifestyle choices like dining out, hobbies, and entertainment.
●	20% for Savings & Debt: This is the portion you use to build your future wealth and pay off any outstanding debt.
Remember, it's a flexible guide, not a strict rule. Adjust the percentages to fit your life!`,
  'How do I track my daily expenses effectively?': `The key is to find a method that's easy for you to stick with. Start small! For one week, try to track just one category, like "Food & Groceries." Write down every single purchase in that category. This small exercise will give you incredible insight without feeling overwhelming.`,
  'How can I stop impulse spending online?': `This is a common challenge! Here are three powerful tricks:
1.	The 24-Hour Rule: If you see something you want, add it to your cart but wait 24 hours before buying. The urge often fades.
2.	Unsubscribe: Unsubscribe from tempting marketing emails and unfollow brands that trigger your spending.
3.	Identify the Trigger: When you feel the urge to buy, ask yourself: "Am I bored, stressed, or happy?" Recognizing the emotion is the first step to controlling the action.`,
  'What is an emergency fund and why do I need one?': `Think of an emergency fund as your personal financial fire extinguisher. It's a stash of money (ideally 3-6 months of living expenses) saved for unexpected emergencies only, like a medical issue or sudden job loss. It's what keeps a small problem from turning into a big, stressful debt.`,
  'What is the difference between saving and investing?': `A simple way to think about it is that saving is for short-term, specific goals (like a vacation) and is stored in a safe, accessible place. Investing is for long-term wealth growth (like retirement). You buy assets that you expect to grow in value, which involves taking on some risk for the potential of higher returns.`,
  'How can I start investing with a small amount of money?': `You can start with as little as ₹500! The best way for beginners is through a Systematic Investment Plan (SIP) in a diversified Index Fund. An Index Fund holds a small piece of many of the largest companies, so you're not putting all your eggs in one basket. It's a proven, low-cost way to build wealth over time.`,
  'What is "compounding" and how does it work?': `Compounding is the most powerful force in finance! It's when your investment earnings start earning their own earnings. Imagine your money making babies, and then those babies grow up to have their own babies. This snowball effect is what creates massive wealth over the long term. The earlier you start, the more powerful it is.`,
  'Should I pay off debt or invest my extra money?': `This is a crucial question. Most experts agree on this priority:
1.	Pay off high-interest debt FIRST. Anything over 8-10% (like credit card debt) is a financial emergency. Paying it off is a guaranteed return on your money equal to the interest rate.
2.	Once that's gone, you can start investing while paying off lower-interest debt (like a home loan).`,
  'How do I improve my credit score?': `Your credit score is built on two main pillars:
●	On-Time Payments: Always pay at least the minimum amount due on time, every single month. This is the single most important factor.
●	Low Credit Utilization: Try to use less than 30% of your total credit card limit. For example, if your limit is ₹1,00,000, keep your balance below ₹30,000.`,
  'I feel anxious about my finances. Where do I start?': `Feeling anxious is completely normal, and taking the first step is the best cure. Don't try to do everything at once. Just focus on one small, achievable thing: for the next 7 days, simply write down what you spend each day. That's it. This single act of tracking will give you a sense of knowledge and control, which is the foundation of confidence.`,
  'What is a "sinking fund"?': `A sinking fund is a brilliant financial trick! It's a mini-savings account for a specific, planned, non-emergency expense in the future. For example, you know you'll need new tires for your car in a year (costing ₹12,000). You would "sink" ₹1,000 into this fund every month. When the time comes, the purchase is completely stress-free because the money is already there!`
};

// --- The Main Component ---
export default function FinancialCoach() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'coach', text: "Hello! I'm Fin, your personal financial coach. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // State for income and expense logging
  const [logEntries, setLogEntries] = useState<LogEntry[]>([
    { id: 1, type: 'income', amount: 1200, description: 'Salary', timestamp: new Date() },
    { id: 2, type: 'expense', amount: 450, description: 'Groceries', timestamp: new Date() }
  ]);
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDesc, setIncomeDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');

  // Calculate totals
  const totalEarned = logEntries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
  const totalSpent = logEntries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);

  const weeklyGoal = 60; // 60%

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addToast = (message: string, type: ToastMessage['type']) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isTyping) return;

    const userQuestion = inputValue.trim();
    const newUserMessage: Message = { id: Date.now(), text: userQuestion, sender: 'user' };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const matchedQuestion = Object.keys(knowledgeBase).find(q => q.toLowerCase().trim() === userQuestion.toLowerCase().trim());
      const coachResponseText = matchedQuestion ? knowledgeBase[matchedQuestion] : "I'm sorry, I'm not trained on that question yet.";
      const coachResponse: Message = { id: Date.now() + 1, text: coachResponseText, sender: 'coach' };
      setMessages(prev => [...prev, coachResponse]);
      setIsTyping(false);
    }, 1800);
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(incomeAmount);
    if (isNaN(amount) || amount <= 0 || !incomeDesc.trim()) return;

    const newEntry: LogEntry = {
      id: Date.now(),
      type: 'income',
      amount,
      description: incomeDesc.trim(),
      timestamp: new Date()
    };

    setLogEntries(prev => [...prev, newEntry]);
    setIncomeAmount('');
    setIncomeDesc('');
    addToast(`Income of ₹${amount.toLocaleString()} added successfully!`, 'success');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0 || !expenseDesc.trim()) return;

    const newEntry: LogEntry = {
      id: Date.now(),
      type: 'expense',
      amount,
      description: expenseDesc.trim(),
      timestamp: new Date()
    };

    setLogEntries(prev => [...prev, newEntry]);
    setExpenseAmount('');
    setExpenseDesc('');
    addToast(`Expense of ₹${amount.toLocaleString()} added successfully!`, 'success');
  };

  return (
    <div className="p-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================================= */}
        {/* ====== Left Column: Chat ====== */}
        {/* ================================= */}
        <motion.div
          key="chat"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="lg:col-span-2 flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 8rem)' }}
        >
          {/* Chat Header */}
          <div className="flex items-center p-4 border-b border-border bg-card/80 backdrop-blur-sm">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
              <FaBrain className="text-xl text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Fin - Your AI Coach</h3>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary text-foreground rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && <div className="text-muted-foreground">Typing...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background">
            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type your question here..." className="flex-grow px-4 py-3 bg-secondary border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-ring" disabled={isTyping} />
              <button type="button" className="w-12 h-12 bg-secondary text-muted-foreground rounded-full flex items-center justify-center flex-shrink-0 hover:bg-secondary/80 transition-colors"><FaMicrophone /></button>
              <button type="submit" className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 hover:bg-primary/90 transition-colors disabled:bg-muted" disabled={!inputValue.trim() || isTyping}><FaPaperPlane /></button>
            </form>
          </div>
        </motion.div>

        {/* ====================================== */}
        {/* ====== Right Column: Widgets ====== */}
        {/* ====================================== */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
            className="lg:col-span-1 space-y-6"
        >
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Daily Income & Expense Logger</h3>
                <div className="relative flex justify-center items-center h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={[{ value: totalEarned || 1 }]} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={70} fill="hsl(var(--primary))" stroke="none" startAngle={90} endAngle={-270} />
                        </PieChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height="100%" style={{ position: 'absolute' }}>
                         <PieChart>
                            <Pie data={[{ value: totalSpent || 1 }]} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={55} fill="hsl(var(--destructive))" stroke="none" startAngle={90} endAngle={-270} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-primary">Earned Today</span>
                        <span className="text-2xl font-bold text-foreground">₹{totalEarned.toLocaleString()}</span>
                        <span className="text-xs text-destructive mt-1">Spent Today</span>
                        <span className="font-semibold text-destructive">-₹{totalSpent.toLocaleString()}</span>
                    </div>
                </div>

                {/* Unified Add Entry Form */}
                <form className="mt-4 space-y-4">
                    <div className="space-y-3">
                        <input
                            type="number"
                            value={incomeAmount || expenseAmount}
                            onChange={(e) => {
                                setIncomeAmount(e.target.value);
                                setExpenseAmount(e.target.value);
                            }}
                            placeholder="Amount (₹)"
                            className="w-full px-4 py-3 bg-secondary border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                            min="0"
                            step="0.01"
                        />
                        <input
                            type="text"
                            value={incomeDesc || expenseDesc}
                            onChange={(e) => {
                                setIncomeDesc(e.target.value);
                                setExpenseDesc(e.target.value);
                            }}
                            placeholder="Description"
                            className="w-full px-4 py-3 bg-secondary border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleAddIncome}
                            className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                        >
                            Add Income
                        </button>
                        <button
                            type="button"
                            onClick={handleAddExpense}
                            className="flex-1 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-semibold"
                        >
                            Add Expense
                        </button>
                    </div>
                </form>

                {/* Recent Logs */}
                <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Recent Logs</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                        {logEntries.slice(-5).reverse().map((entry) => (
                            <div key={entry.id} className={`text-xs p-2 rounded ${entry.type === 'income' ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                                {entry.type === 'income' ? '+' : '-'}₹{entry.amount.toLocaleString()} - {entry.description}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                 <button onClick={() => addToast('Voice logging is not yet available.', 'info')} className="w-full flex items-center gap-3 p-4 rounded-lg bg-green-500/10 text-green-300 hover:bg-green-500/20 transition-colors">
                    <FaMicrophone className="text-xl"/>
                    <span className="font-semibold">Voice Log: Income</span>
                 </button>
                 <button onClick={() => addToast('Voice logging is not yet available.', 'info')} className="w-full flex items-center gap-3 p-4 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors">
                    <FaMicrophone className="text-xl"/>
                    <span className="font-semibold">Voice Log: Expense</span>
                 </button>
                 <div className="text-center text-sm text-muted-foreground pt-2">
                    Last Log: ₹700 - Ride Share (Voice)
                 </div>
            </div>
            
             <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-2">Weekly Savings Goal</h3>
                <div className="w-full bg-secondary rounded-full h-2.5">
                    <motion.div 
                        className="bg-primary h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${weeklyGoal}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    />
                </div>
                <p className="text-right text-xs text-muted-foreground mt-1">{weeklyGoal}% Complete</p>
            </div>
        </motion.div>

      </div>
    </div>
  );
}