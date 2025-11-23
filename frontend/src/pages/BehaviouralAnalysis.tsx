import { useState } from 'react';
import { FaShieldAlt, FaRocket, FaCalculator, FaGift } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBrain, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaExclamationTriangle, FaLightbulb, 
  FaBullseye, FaShoppingCart, FaChartLine, FaPiggyBank, FaCreditCard, FaRegSmile, FaRegMeh, FaRegFrown
} from 'react-icons/fa';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ToastContainer, ToastMessage } from '@/components/Toast';

// --- Interfaces & Dummy Data ---
interface Goal { id: string; text: string; }
interface AnalysisResult {
  personality: string;
  tagline: string;
  description: string;
  chartData: { trait: string; score: number }[];
  insights: { type: 'strength' | 'growth'; title: string; text: string; icon: React.ElementType }[];
  icon: React.ElementType;
  nextStep: { title: string; text: string };
}
const dummyPersonalities: { [key: string]: AnalysisResult } = {
  guardian: {
    personality: 'The Guardian',
    tagline: 'Security-focused and diligent, you are the master of the safety net.',
    icon: FaShieldAlt,
    description: 'Security and stability are your top priorities. You are a cautious, diligent saver who avoids debt and prefers low-risk strategies. Your financial decisions are driven by a need for a strong safety net.',
    chartData: [ { trait: 'Risk Appetite', score: 25 }, { trait: 'Long-Term View', score: 85 }, { trait: 'Impulse Control', score: 80 }, { trait: 'Value Seeking', score: 70 }, { trait: 'Debt Aversion', score: 90 } ],
    insights: [
      { type: 'strength', title: 'Exceptional Saver', text: 'Your consistent saving habits are creating a rock-solid financial foundation.', icon: FaCheckCircle },
      { type: 'strength', title: 'Debt Averse', text: 'Your cautious approach to debt protects you from financial instability and stress.', icon: FaCheckCircle },
      { type: 'growth', title: 'Outpace Inflation', text: 'While safety is crucial, explore low-risk, diversified investments (like index funds) to ensure your savings grow.', icon: FaLightbulb },
      { type: 'growth', title: 'Embrace Calculated Risk', text: 'Being too risk-averse might cause you to miss out on significant long-term wealth growth opportunities.', icon: FaExclamationTriangle },
    ],
    nextStep: { title: 'Explore Low-Risk Investments', text: 'Set up a recurring investment in a diversified, low-cost index fund to get started.' }
  },
  visionary: {
    personality: 'The Visionary',
    tagline: 'Ambitious and forward-thinking, you see money as a tool for building big dreams.',
    icon: FaRocket,
    description: 'You are a goal-oriented optimist, comfortable with taking calculated risks to achieve significant returns. Your focus is on wealth creation and building a prosperous future.',
    chartData: [ { trait: 'Risk Appetite', score: 85 }, { trait: 'Long-Term View', score: 90 }, { trait: 'Impulse Control', score: 60 }, { trait: 'Value Seeking', score: 40 }, { trait: 'Debt Aversion', score: 30 } ],
     insights: [
      { type: 'strength', title: 'Goal-Oriented', text: 'Your focus on the future is a powerful motivator for wealth creation.', icon: FaCheckCircle },
      { type: 'strength', title: 'Comfortable with Risk', text: 'You understand that calculated risks are necessary for high returns.', icon: FaCheckCircle },
      { type: 'growth', title: 'Diversify Your Bets', text: 'Ensure your ambition is balanced with diversification. High risk should not mean concentrated risk.', icon: FaLightbulb },
      { type: 'growth', title: 'Curb Over-Optimism', text: 'Avoid letting excitement lead to speculative gambles. Base high-risk decisions on thorough research.', icon: FaExclamationTriangle },
    ],
    nextStep: { title: 'Review Portfolio Diversification', text: 'Use our tools to check if your investments are spread across different asset classes.' }
  },
  optimizer: {
    personality: 'The Optimizer',
    tagline: 'Pragmatic and resourceful, you excel at making every rupee count.',
    icon: FaCalculator,
    description: 'You are a pragmatic and resourceful financial manager. You excel at finding value, maximizing your income, and minimizing waste. Every financial decision is a calculated move to improve your net worth.',
    chartData: [ { trait: 'Risk Appetite', score: 50 }, { trait: 'Long-Term View', score: 70 }, { trait: 'Impulse Control', score: 75 }, { trait: 'Value Seeking', score: 95 }, { trait: 'Debt Aversion', score: 60 } ],
    insights: [
      { type: 'strength', title: 'Master of Value', text: 'Your ability to find the best deal allows you to save significantly more than most.', icon: FaCheckCircle },
      { type: 'strength', title: 'Strong Budgeting Skills', text: 'You have a natural talent for managing cash flow and keeping expenses low.', icon: FaCheckCircle },
      { type: 'growth', title: 'Automate Your Wealth', text: 'Your diligent savings should be put to work. Automate your investments to build wealth passively.', icon: FaLightbulb },
      { type: 'growth', title: 'Invest in Yourself', text: `Don't forget to allocate funds for personal growth and enjoyment. It's the best investment of all.`, icon: FaExclamationTriangle },
    ],
    nextStep: { title: 'Set Up Automatic Investments', text: 'Create a recurring transfer from your savings to an investment account each month.' }
  },
  epicurean: {
    personality: 'The Epicurean',
    tagline: 'Generous and present-focused, you use money to create memorable experiences.',
    icon: FaGift,
    description: 'You live in the moment and believe money is a tool for creating experiences and enjoyment. While you are generous and life-loving, you may struggle with impulse control and long-term planning.',
    chartData: [ { trait: 'Risk Appetite', score: 65 }, { trait: 'Long-Term View', score: 30 }, { trait: 'Impulse Control', score: 20 }, { trait: 'Value Seeking', score: 35 }, { trait: 'Debt Aversion', score: 40 } ],
    insights: [
      { type: 'strength', title: 'Live Life to the Fullest', text: 'Your ability to enjoy the present and build social connections is a key part of a happy existence.', icon: FaCheckCircle },
      { type: 'strength', title: 'Generous Spirit', text: 'You find joy in sharing with others, which strengthens your relationships.', icon: FaCheckCircle },
      { type: 'growth', title: 'Practice Mindful Spending', text: 'Create a "Fun Fund" budget to enjoy guilt-free spending without derailing your future goals.', icon: FaLightbulb },
      { type: 'growth', title: 'Pay Your Future Self First', text: `A lack of planning can cause future stress. Set up automatic savings the day you get paid.`, icon: FaExclamationTriangle },
    ],
    nextStep: { title: 'Create a "Fun Fund" Budget', text: 'Go to the Budgets page and allocate a specific amount for spontaneous spending.' }
  }
};

const ProgressBar = ({ step, totalSteps }: { step: number, totalSteps: number }) => {
    const progress = (step / totalSteps) * 100;
    return (
        <div className="w-full bg-secondary rounded-full h-2.5 mb-6">
            <motion.div
                className="bg-primary h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
        </div>
    );
};

// --- The Main Component ---
export default function BehavioralAnalysis() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    q1: '', q2: '', q3: '', q4: '', q5: '', 
    q6: 50, q7: '', q8: '', q9: '', q10: '',
    q11: '', q12: '', q13: '', q14: '', q15: ''
  });
  const [goals, setGoals] = useState<Goal[]>([{ id: '1', text: 'Save for a down payment' }]);
  const [newGoalText, setNewGoalText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const addToast = (message: string, type: ToastMessage['type']) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAnswer = (question: string, answer: any) => {
    setFormData(prev => ({ ...prev, [question]: answer }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    if (editingId) {
      setGoals(goals.map(g => (g.id === editingId ? { ...g, text: newGoalText } : g)));
      addToast('Goal updated!', 'success');
      setEditingId(null);
    } else {
      setGoals([...goals, { id: Date.now().toString(), text: newGoalText }]);
      addToast('Goal added!', 'success');
    }
    setNewGoalText('');
  };

  const handleEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setNewGoalText(goal.text);
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    addToast('Goal removed.', 'info');
  };

  const handleAnalyze = () => {
    // A simple validation for the last step
    if (goals.length === 0) {
      addToast('Please add at least one goal before analyzing.', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      let scores = { guardian: 0, visionary: 0, optimizer: 0, epicurean: 0 };
      // This scoring is a simplified example. A real app would have a more complex algorithm.
      if (['stress', 'happiness'].includes(formData.q1)) scores.epicurean += 1;
      if (formData.q2 === 'planned purchase') { scores.guardian += 1; scores.optimizer += 1; }
      if (formData.q3 === 'i track every rupee') scores.optimizer += 2;
      if (formData.q4 === 'rarely') scores.epicurean += 1;
      if (formData.q5 === 'experience') scores.epicurean += 2; else scores.guardian += 1;
      if (formData.q6 > 75) scores.visionary += 2;
      if (formData.q7 === 'buy more') scores.visionary += 1;
      if (formData.q11 === 'automatic transfers') { scores.guardian += 1; scores.optimizer += 1; }
      if (formData.q13 === 'something to avoid') scores.guardian += 2; else if (formData.q13 === 'a useful tool') scores.visionary += 1;

      const personalityKey = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
      setAnalysisResult(dummyPersonalities[personalityKey]);
      
      setIsLoading(false);
    }, 2500);
  };
  
  if (isLoading) return <LoadingView />;
  if (analysisResult) return <ResultsView result={analysisResult} onRetake={() => { setAnalysisResult(null); setStep(1); }} />;

  return (
    <div className="p-6">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <ProgressBar step={step} totalSteps={4} />
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {step === 1 && <Step1_Spending formData={formData} onAnswer={handleAnswer} onNext={nextStep} />}
                {step === 2 && <Step2_Risk formData={formData} onAnswer={handleAnswer} onNext={nextStep} onPrev={prevStep} />}
                {step === 3 && <Step3_Saving formData={formData} onAnswer={handleAnswer} onNext={nextStep} onPrev={prevStep} />}
                {step === 4 && <Step4_Goals goals={goals} newGoalText={newGoalText} setNewGoalText={setNewGoalText} handleGoalSubmit={handleGoalSubmit} handleEdit={handleEdit} handleDelete={handleDelete} onAnalyze={handleAnalyze} onPrev={prevStep} />}
            </motion.div>
        </AnimatePresence>
    </div>
  );
}

// --- Sub-components ---

const StepHeader = ({ title, subtitle }) => (
    <>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><FaBrain className="text-primary" /> {title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>
    </>
);

const NavButtons = ({ onPrev, onNext, isFirst = false, isLast = false, onAnalyze }) => (
    <div className={`flex ${isFirst ? 'justify-end' : 'justify-between'} items-center mt-8`}>
        {!isFirst && <button onClick={onPrev} className="px-6 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-secondary">Back</button>}
        {isLast ? (
            <button onClick={onAnalyze} className="text-lg font-bold px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">Analyze My Behavior</button>
        ) : (
            <button onClick={onNext} className="px-6 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">Next &rarr;</button>
        )}
    </div>
);

const Question = ({ text, options, questionKey, value, onAnswer }) => (
    <div>
        <label className="block text-sm font-semibold text-foreground mb-3">{text}</label>
        <div className="flex flex-wrap gap-3">
            {options.map(option => (
                <button key={option} onClick={() => onAnswer(questionKey, option.toLowerCase().replace(/ /g, ''))} className={`px-4 py-2 rounded-lg text-sm transition-all ${value === option.toLowerCase().replace(/ /g, '') ? 'bg-primary text-primary-foreground ring-2 ring-offset-2 ring-offset-background ring-primary' : 'bg-secondary hover:bg-secondary/80'}`}>
                    {option}
                </button>
            ))}
        </div>
    </div>
);

const Step1_Spending = ({ formData, onAnswer, onNext }) => (
    <div className="bg-card border border-border rounded-xl p-6">
        <StepHeader title="Step 1: Spending Psychology" subtitle="Let's understand your spending triggers and habits." />
        <div className="space-y-6">
            <Question text="What most often triggers an unplanned purchase for you?" options={['Stress', 'Happiness', 'Boredom', 'A good deal']} questionKey="q1" value={formData.q1} onAnswer={onAnswer} />
            <Question text="How do you typically approach shopping for non-essential items?" options={['Impulsive buy', 'Planned purchase', 'Extensive research', 'Avoid it']} questionKey="q2" value={formData.q2} onAnswer={onAnswer} />
            <Question text="How closely do you track your spending?" options={['I track every rupee', 'I check my balance often', 'I review at month-end', 'I try not to look']} questionKey="q3" value={formData.q3} onAnswer={onAnswer} />
            <Question text="How often do you feel 'buyer's remorse' after a purchase?" options={['Frequently', 'Sometimes', 'Rarely', 'Never']} questionKey="q4" value={formData.q4} onAnswer={onAnswer} />
            <Question text="When you receive a bonus or unexpected money, what's your first thought?" options={['Splurge on something nice', 'Save it all', 'Pay off debt', 'Invest it']} questionKey="q5" value={formData.q5} onAnswer={onAnswer} />
        </div>
        <NavButtons onNext={onNext} isFirst onPrev={undefined} onAnalyze={undefined} />
    </div>
);

const Step2_Risk = ({ formData, onAnswer, onNext, onPrev }) => (
    <div className="bg-card border border-border rounded-xl p-6">
        <StepHeader title="Step 2: Risk & Future Outlook" subtitle="How you view risk and plan for the future." />
        <div className="space-y-6">
             <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">How would you rate your investment risk tolerance? (0 = Very Cautious, 100 = Very Aggressive)</label>
                <input type="range" min="0" max="100" value={formData.q6} onChange={e => onAnswer('q6', parseInt(e.target.value))} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" />
                <p className="text-center font-bold text-primary mt-2">{formData.q6}</p>
            </div>
            <Question text="If the stock market drops 20%, your first instinct is to:" options={['Panic sell', 'Wait and see', 'Buy more', 'No idea']} questionKey="q7" value={formData.q7} onAnswer={onAnswer} />
            <Question text="Which statement best describes your view on investing?" options={['A way to get rich quick', 'A necessary tool for retirement', `It's too complicated for me`, 'A form of gambling']} questionKey="q8" value={formData.q8} onAnswer={onAnswer} />
            <Question text="How far into the future do you typically plan your finances?" options={['Next few days', 'Next few months', '1-5 years ahead', '5+ years ahead']} questionKey="q9" value={formData.q9} onAnswer={onAnswer} />
            <Question text="When considering a financial product, what's most important to you?" options={['High potential returns', 'Low risk and security', 'Low fees and costs', 'Ease of use']} questionKey="q10" value={formData.q10} onAnswer={onAnswer} />
        </div>
        <NavButtons onNext={onNext} onPrev={onPrev} onAnalyze={undefined} />
    </div>
);

const Step3_Saving = ({ formData, onAnswer, onNext, onPrev }) => (
    <div className="bg-card border border-border rounded-xl p-6">
        <StepHeader title="Step 3: Saving Habits & Debt Attitude" subtitle="How you save, and what's your view on debt." />
        <div className="space-y-6">
            <Question text="What is your primary method of saving money?" options={['Automatic transfers', 'Whatever is leftover', 'Manual transfers', 'I struggle to save']} questionKey="q11" value={formData.q11} onAnswer={onAnswer} />
            <Question text="How large is your emergency fund?" options={['I don\'t have one', 'Less than 1 month of expenses', '1-3 months of expenses', '3-6+ months of expenses']} questionKey="q12" value={formData.q12} onAnswer={onAnswer} />
            <Question text="You view credit card debt as:" options={['A useful tool', 'A necessary evil', 'Something to avoid', 'A major source of stress']} questionKey="q13" value={formData.q13} onAnswer={onAnswer} />
            <Question text="What is your main motivation for saving?" options={['Retirement security', 'A large purchase (house/car)', 'Financial independence', 'Travel and experiences']} questionKey="q14" value={formData.q14} onAnswer={onAnswer} />
            <Question text="When you have extra money, you are more likely to:" options={['Add to savings', 'Make an extra debt payment', 'Invest it', 'Treat yourself']} questionKey="q15" value={formData.q15} onAnswer={onAnswer} />
        </div>
        <NavButtons onNext={onNext} onPrev={onPrev} onAnalyze={undefined} />
    </div>
);

const Step4_Goals = ({ goals, newGoalText, setNewGoalText, handleGoalSubmit, handleEdit, handleDelete, onAnalyze, onPrev }) => (
     <div className="bg-card border border-border rounded-xl p-6">
        <StepHeader title="Step 4: Define Your Goals" subtitle="List your key financial goals. This helps in personalizing your plan." />
        <form onSubmit={handleGoalSubmit} className="flex gap-4 mb-4">
            <input type="text" value={newGoalText} onChange={e => setNewGoalText(e.target.value)} placeholder="e.g., Build an emergency fund" className="flex-grow px-4 py-2 bg-secondary border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                <FaPlus /> Add
            </button>
        </form>
        <div className="space-y-3 max-h-40 overflow-y-auto">
            {goals.map(goal => (
                <div key={goal.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <p className="text-foreground flex items-center gap-2"><FaBullseye className="text-primary"/> {goal.text}</p>
                    <div className="flex gap-3">
                        <button onClick={() => handleEdit(goal)} className="text-muted-foreground hover:text-primary"><FaEdit /></button>
                        <button onClick={() => handleDelete(goal.id)} className="text-muted-foreground hover:text-destructive"><FaTrash /></button>
                    </div>
                </div>
            ))}
        </div>
        <NavButtons onPrev={onPrev} onAnalyze={onAnalyze} isLast onNext={undefined} />
    </div>
);

const LoadingView = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6" style={{minHeight: '60vh'}}>
        <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <FaBrain className="text-6xl text-primary mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mt-4">Analyzing your financial DNA...</h2>
        <p className="text-muted-foreground">Crafting your personalized insights.</p>
    </div>
);

const ResultsView = ({ result, onRetake }) => (
    <div className="p-6 space-y-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button onClick={onRetake} className="text-sm text-primary hover:underline mb-6">&larr; Retake Analysis</button>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                    <result.icon className="text-4xl text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground">{result.personality}</h2>
                    <p className="text-muted-foreground font-semibold">{result.tagline}</p>
                </div>
            </div>
            <p className="text-foreground mt-4 max-w-3xl">{result.description}</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column: Traits & Chart */}
            <div className="lg:col-span-3 space-y-6">
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Key Trait Breakdown</h3>
                    <div className="space-y-4">
                        {result.chartData.map(trait => (
                            <div key={trait.trait}>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-medium text-muted-foreground">{trait.trait}</span>
                                    <span className="font-semibold text-foreground">{trait.score} / 100</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2.5">
                                    <motion.div 
                                        className="bg-primary h-2.5 rounded-full" 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${trait.score}%` }}
                                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Psychological Profile</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={result.chartData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="trait" />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                            <Radar name="Your Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Right Column: Insights & Next Step */}
            <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Key Strengths</h3>
                    <div className="space-y-4">
                        {result.insights.filter(i => i.type === 'strength').map((item, i) => (
                             <div key={i} className="flex items-start gap-3">
                                 <div className="mt-1"><item.icon className="text-xl text-green-500" /></div>
                                 <div>
                                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.text}</p>
                                 </div>
                             </div>
                        ))}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Areas for Growth</h3>
                     <div className="space-y-4">
                        {result.insights.filter(i => i.type === 'growth').map((item, i) => (
                             <div key={i} className="flex items-start gap-3">
                                 <div className="mt-1"><item.icon className="text-xl text-yellow-400" /></div>
                                 <div>
                                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.text}</p>
                                 </div>
                             </div>
                        ))}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl p-6 shadow-lg">
                    <h3 className="font-semibold text-lg">Your Recommended Next Step</h3>
                    <p className="mt-2 text-primary-foreground/90">{result.nextStep.text}</p>
                    <button className="mt-4 w-full bg-primary-foreground text-primary font-bold py-2 px-4 rounded-lg hover:bg-white/90 transition-colors">
                        {result.nextStep.title}
                    </button>
                </motion.div>
            </div>
        </div>
    </div>
);