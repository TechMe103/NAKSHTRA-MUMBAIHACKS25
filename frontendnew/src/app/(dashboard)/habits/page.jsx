'use client';

import { useState } from 'react';
// Using generic <a> tag for compilation safety
const Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>; 

import { 
  Heart, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Loader2,
  ThumbsUp,
  Target,
  BookOpen, // New icons for stages
  DollarSign
} from 'lucide-react';

// --- 30 QUESTIONS IN 3 STAGES (10 questions per stage) ---

const allHabitQuestions = [
  // STAGE 1: SPENDING & AWARENESS (Q1-Q10) - Focus on daily habits and visibility
  { 
    id: 'S1', 
    title: 'Stage 1: Spending and Awareness', 
    icon: DollarSign,
    questions: [
      {
        id: 1,
        text: "How accurately can you state your total spending from last month?",
        type: "mcq",
        options: [
          { text: "No idea (within +/- 50%)", score: 1 },
          { text: "Rough estimate (within +/- 20%)", score: 3 },
          { text: "Very accurate (within +/- 5%)", score: 5 },
        ],
      },
      {
        id: 2,
        text: "How often do you track and categorize your purchases?",
        type: "mcq",
        options: [
          { text: "Never, I wait for problems.", score: 1 },
          { text: "Once a month, when paying bills.", score: 3 },
          { text: "Several times a week or automatically.", score: 5 },
        ],
      },
      {
        id: 3,
        text: "When you receive unexpected money (bonus, gift), what's your first action?",
        type: "mcq",
        options: [
          { text: "Spend it immediately on a treat.", score: 1 },
          { text: "Put aside half for savings, spend the rest.", score: 3 },
          { text: "Allocate 100% to investments/debt.", score: 5 },
        ],
      },
      {
        id: 4,
        text: "Do you have a fixed budget for entertainment and dining out?",
        type: "mcq",
        options: [
          { text: "No, I spend freely.", score: 1 },
          { text: "Yes, but I frequently exceed it.", score: 3 },
          { text: "Yes, and I always stick to it.", score: 5 },
        ],
      },
      {
        id: 5,
        text: "How often do you check your primary bank account balance?",
        type: "mcq",
        options: [
          { text: "Less than once a month.", score: 1 },
          { text: "Once a week or less.", score: 3 },
          { text: "Daily or every other day.", score: 5 },
        ],
      },
      {
        id: 6,
        text: "When buying groceries, do you compare prices or stick to the first item?",
        type: "mcq",
        options: [
          { text: "I grab the first recognizable brand.", score: 1 },
          { text: "I compare prices for big items only.", score: 3 },
          { text: "I actively seek out sales and generic alternatives.", score: 5 },
        ],
      },
      {
        id: 7,
        text: "You see an item on sale that you don't need. Do you buy it?",
        type: "mcq",
        options: [
          { text: "Yes, because it's a good deal (FOMO).", score: 1 },
          { text: "Only if the discount is massive (50%+).", score: 3 },
          { text: "No, unless it was already on my plan.", score: 5 },
        ],
      },
      {
        id: 8,
        text: "How easily can you resist an impulse purchase over $100?",
        type: "mcq",
        options: [
          { text: "I usually buy it.", score: 1 },
          { text: "I think about it for a day or two.", score: 3 },
          { text: "I impose a 7-day waiting rule.", score: 5 },
        ],
      },
      {
        id: 9,
        text: "Do you actively look for ways to reduce recurring monthly expenses (subscriptions, phone plans)?",
        type: "mcq",
        options: [
          { text: "Never.", score: 1 },
          { text: "Once or twice a year.", score: 3 },
          { text: "Every few months, I audit my bills.", score: 5 },
        ],
      },
      {
        id: 10,
        text: "How often do you feel stressed about your current financial situation?",
        type: "mcq",
        options: [
          { text: "Daily or most days.", score: 1 },
          { text: "A few times a month.", score: 3 },
          { text: "Rarely or never.", score: 5 },
        ],
      },
    ]
  },
  // STAGE 2: SAVINGS & PLANNING (Q11-Q20) - Focus on future goals and security
  { 
    id: 'S2', 
    title: 'Stage 2: Savings and Planning', 
    icon: Target,
    questions: [
      {
        id: 11,
        text: "Do you automatically transfer a fixed amount to savings on payday?",
        type: "mcq",
        options: [
          { text: "No, I save what's left over.", score: 1 },
          { text: "Sometimes, but the amount varies.", score: 3 },
          { text: "Yes, it is automated before I can spend it.", score: 5 },
        ],
      },
      {
        id: 12,
        text: "How many months could you cover your basic living expenses if you lost your income?",
        type: "mcq",
        options: [
          { text: "Less than one month.", score: 1 },
          { text: "1 to 3 months.", score: 3 },
          { text: "6 months or more.", score: 5 },
        ],
      },
      {
        id: 13,
        text: "Do you have specific, written goals for savings (e.g., retirement, house down payment)?",
        type: "mcq",
        options: [
          { text: "No, only vague goals.", score: 1 },
          { text: "Yes, but they are not prioritized.", score: 3 },
          { text: "Yes, and they have deadlines and target amounts.", score: 5 },
        ],
      },
      {
        id: 14,
        text: "How often do you contribute to an investment or retirement account?",
        type: "mcq",
        options: [
          { text: "Never.", score: 1 },
          { text: "Annually or less.", score: 3 },
          { text: "Monthly or whenever possible.", score: 5 },
        ],
      },
      {
        id: 15,
        text: "Do you review and adjust your financial goals annually?",
        type: "mcq",
        options: [
          { text: "No.", score: 1 },
          { text: "Only when a major event happens.", score: 3 },
          { text: "Yes, systematically every year.", score: 5 },
        ],
      },
      {
        id: 16,
        text: "Do you have appropriate insurance coverage (health, life, property) relative to your needs?",
        type: "mcq",
        options: [
          { text: "I only have mandatory coverage.", score: 1 },
          { text: "I have some, but haven't reviewed it recently.", score: 3 },
          { text: "Yes, I review my coverage annually.", score: 5 },
        ],
      },
      {
        id: 17,
        text: "When buying a large item (car, appliance), do you save up first or use credit/financing?",
        type: "mcq",
        options: [
          { text: "I usually finance it immediately.", score: 1 },
          { text: "I use financing but make large payments.", score: 3 },
          { text: "I save up and pay in cash or near-cash.", score: 5 },
        ],
      },
      {
        id: 18,
        text: "How much of your income is typically left over after all bills and necessities are paid?",
        type: "mcq",
        options: [
          { text: "Less than 5% (I live paycheck to paycheck).", score: 1 },
          { text: "5% to 15%.", score: 3 },
          { text: "More than 20%.", score: 5 },
        ],
      },
      {
        id: 19,
        text: "Do you have a separate fund dedicated solely to emergencies?",
        type: "mcq",
        options: [
          { text: "No, I use my main account.", score: 1 },
          { text: "Yes, but it's small/incomplete.", score: 3 },
          { text: "Yes, fully funded (3-6 months expenses).", score: 5 },
        ],
      },
      {
        id: 20,
        text: "How confident are you in managing future financial risks (e.g., inflation, market dips)?",
        type: "mcq",
        options: [
          { text: "Very worried, I don't know what to do.", score: 1 },
          { text: "A little worried, but I have a basic plan.", score: 3 },
          { text: "Confident, I have a long-term strategy.", score: 5 },
        ],
      },
    ]
  },
  // STAGE 3: DEBT & LITERACY (Q21-Q30) - Focus on debt management and knowledge
  { 
    id: 'S3', 
    title: 'Stage 3: Debt and Financial Literacy', 
    icon: BookOpen,
    questions: [
      {
        id: 21,
        text: "Do you pay off your credit card balance in full every month?",
        type: "mcq",
        options: [
          { text: "Rarely or never.", score: 1 },
          { text: "Sometimes, depending on the month.", score: 3 },
          { text: "Always.", score: 5 },
        ],
      },
      {
        id: 22,
        text: "How well do you understand the interest rates on all your debts (loans, credit cards)?",
        type: "mcq",
        options: [
          { text: "Not at all.", score: 1 },
          { text: "I know the high-level rate.", score: 3 },
          { text: "I know the precise APR and payment structure.", score: 5 },
        ],
      },
      {
        id: 23,
        text: "Do you actively work to pay down the highest-interest debt first?",
        type: "mcq",
        options: [
          { text: "No, I pay the minimum on everything.", score: 1 },
          { text: "I follow the 'snowball' method (smallest debt first).", score: 3 },
          { text: "Yes, I prioritize by interest rate ('avalanche').", score: 5 },
        ],
      },
      {
        id: 24,
        text: "How often do you check your credit score/report?",
        type: "mcq",
        options: [
          { text: "Never.", score: 1 },
          { text: "Annually or less.", score: 3 },
          { text: "Quarterly or whenever I apply for credit.", score: 5 },
        ],
      },
      {
        id: 25,
        text: "Are you comfortable explaining the difference between stocks and bonds?",
        type: "mcq",
        options: [
          { text: "No, they are the same to me.", score: 1 },
          { text: "I know the basics, but not the risk differences.", score: 3 },
          { text: "Yes, I can explain the risk and return profiles.", score: 5 },
        ],
      },
      {
        id: 26,
        text: "Do you utilize tax-advantaged accounts (e.g., 401k, ISA, TFSA) for savings?",
        type: "mcq",
        options: [
          { text: "No, I only use standard bank accounts.", score: 1 },
          { text: "I use one, but I don't maximize contributions.", score: 3 },
          { text: "Yes, I try to maximize contributions annually.", score: 5 },
        ],
      },
      {
        id: 27,
        text: "How confident are you in calculating compound interest?",
        type: "mcq",
        options: [
          { text: "I wouldn't know where to start.", score: 1 },
          { text: "I understand the concept generally.", score: 3 },
          { text: "I can calculate it accurately to project growth.", score: 5 },
        ],
      },
      {
        id: 28,
        text: "Do you know your net worth (assets minus liabilities)?",
        type: "mcq",
        options: [
          { text: "No.", score: 1 },
          { text: "I have a rough, outdated idea.", score: 3 },
          { text: "Yes, I track it regularly.", score: 5 },
        ],
      },
      {
        id: 29,
        text: "Do you feel financial institutions (banks, advisors) are mostly working in your best interest?",
        type: "mcq",
        options: [
          { text: "Yes, I trust them completely.", score: 1 },
          { text: "Maybe, I read some disclaimers.", score: 3 },
          { text: "No, I double-check everything and rely on my own research.", score: 5 },
        ],
      },
      {
        id: 30,
        text: "How proactively do you educate yourself on personal finance (books, courses, reliable news)?",
        type: "mcq",
        options: [
          { text: "Never.", score: 1 },
          { text: "Only when I have a major financial decision.", score: 3 },
          { text: "I dedicate regular time for learning.", score: 5 },
        ],
      },
    ]
  }
];

// Helper function to get the stage index and question index from the overall step count
const getStageAndQuestionIndex = (step) => {
    let currentQ = step;
    for (let i = 0; i < allHabitQuestions.length; i++) {
        const stageQs = allHabitQuestions[i].questions.length;
        if (currentQ < stageQs) {
            return { stageIndex: i, questionIndex: currentQ };
        }
        currentQ -= stageQs;
    }
    return { stageIndex: allHabitQuestions.length - 1, questionIndex: allHabitQuestions[allHabitQuestions.length - 1].questions.length - 1 };
};


export default function HabitsPage() {
  const totalQuestions = allHabitQuestions.flatMap(s => s.questions).length; // 30
  const maxScore = totalQuestions * 5; // 150
  
  const [currentStep, setCurrentStep] = useState(0); // 0 to 29
  const [answers, setAnswers] = useState(Array(totalQuestions).fill(0)); // Store scores for 30 questions
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null); // Stores the final score/advice

  // Get current stage and question details based on currentStep
  const { stageIndex, questionIndex } = getStageAndQuestionIndex(currentStep);
  const currentStage = allHabitQuestions[stageIndex];
  const currentQuestion = currentStage.questions[questionIndex];


  const handleSelectAnswer = (score) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = score;
    setAnswers(newAnswers);
    
    // Auto-advance after selecting an answer
    setTimeout(() => {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 200);
  };

  const handleAnalyze = () => {
    setLoading(true);
    
    // 1. Calculate Score
    const totalScore = answers.reduce((sum, score) => sum + score, 0);
    const scorePercentage = (totalScore / maxScore) * 100;

    let advice = "";
    let color = "text-yellow-400";
    let status = "Needs Focus";

    if (scorePercentage >= 80) {
      advice = "Excellent! Your financial instincts are sharp, discipline is high, and literacy is strong. Focus on maximizing diversification and long-term planning.";
      color = "text-green-400";
      status = "Discipline Master";
    } else if (scorePercentage >= 50) {
      advice = "Good progress! You have solid awareness and planning, but there's room for improvement in debt management or expanding your investment knowledge.";
      color = "text-yellow-400";
      status = "Financially Aware";
    } else {
      advice = "Time for foundational changes. Focus on aggressive debt repayment, building an emergency fund, and mastering your daily expense tracking.";
      color = "text-red-400";
      status = "Impulse Tendency";
    }

    setTimeout(() => {
      setLoading(false);
      setAnalysisResult({ totalScore, scorePercentage, advice, status, color });
      
      // NOTE: Here you would make a POST request to your backend
      // to save the quiz results and score for future tracking.
      console.log("Saving Habit Analysis:", { totalScore, scorePercentage });

    }, 1500);
  };

  const handleReset = () => {
      setCurrentStep(0);
      setAnswers(Array(totalQuestions).fill(0));
      setAnalysisResult(null);
  };

  const StageIcon = currentStage.icon;


  return (
    <div className="space-y-8 md:space-y-10 relative z-10 w-full max-w-3xl mx-auto">
      
       <header className="mb-6 md:mb-8 border-b border-slate-800/50 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          {/* Animated Heart Icon */}
          <Heart 
            size={24} 
            className="text-pink-400 sm:size-24 animate-pulse-slow origin-center" // Added animate-pulse-slow
          /> 
          {/* Animated Text */}
          <span className="bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text animate-fade-in-slide-up"> {/* Added gradient and animation */}
            Financial Habit Tracker
          </span>
        </h1>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">Answer 30 questions across 3 stages to analyze your current money management habits.</p>
      </header>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 min-h-[500px] flex flex-col justify-between">
        
        {/* --- ANALYSIS RESULT VIEW --- */}
        {analysisResult ? (
          <div className="text-center space-y-4 sm:space-y-6 flex flex-col items-center">
             <Target size={40} className={`animate-in zoom-in duration-500 ${analysisResult.color} sm:size-48`} />
             <h2 className="text-2xl sm:text-3xl font-bold text-white">Habit Analysis Complete!</h2>
             
             <div className="flex flex-col items-center gap-1">
                <p className="text-slate-400 text-sm sm:text-lg font-medium">Your Financial Status:</p>
                <p className={`text-xl sm:text-2xl font-bold ${analysisResult.color}`}>{analysisResult.status}</p>
             </div>

             <div className="w-full max-w-sm mx-auto pt-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-400 mb-1">Total Score: {analysisResult.totalScore} / {maxScore} ({analysisResult.scorePercentage.toFixed(1)}%)</p>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${analysisResult.color === 'text-green-400' ? 'bg-green-500' : analysisResult.color === 'text-yellow-400' ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${analysisResult.scorePercentage}%` }}
                    ></div>
                </div>
             </div>

             <p className="text-slate-300 text-sm sm:text-base border-t border-slate-800 pt-4 mt-4">
                <span className="font-semibold text-pink-400">Recommendation:</span> {analysisResult.advice}
             </p>

             <button 
                onClick={handleReset}
                className="flex items-center gap-2 mt-6 sm:mt-8 px-5 py-2 text-sm font-semibold rounded-full text-white bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                Start New Analysis
              </button>

          </div>
        ) : (
          /* --- QUIZ VIEW --- */
          <div className="space-y-6 sm:space-y-8">
             {/* Stage Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <StageIcon size={20} className="text-indigo-400 sm:size-24" />
                <span className="text-lg sm:text-xl font-semibold text-indigo-300">{currentStage.title}</span>
            </div>

            {/* Progress Bar */}
            <div className="text-xs sm:text-sm font-medium text-slate-400">
                Overall Progress: Question {currentStep + 1} of {totalQuestions}
                <div className="w-full h-2 bg-slate-800 rounded-full mt-2">
                    <div 
                        className="h-2 bg-pink-500 rounded-full transition-all duration-300" 
                        style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
                    ></div>
                </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white min-h-[72px] flex items-center">
              {currentQuestion.text}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentStep] === option.score;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(option.score)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                      isSelected 
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className={`w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                      {isSelected && <CheckCircle size={14} className="text-white fill-white/20" />}
                    </span>
                    <span className="text-sm sm:text-base">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation and Submission */}
            <div className="flex justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-full text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
              >
                <ArrowLeft size={16} /> Previous
              </button>

              {currentStep === totalQuestions - 1 ? (
                <button
                  onClick={handleAnalyze}
                  disabled={loading || answers[currentStep] === 0}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                    loading || answers[currentStep] === 0
                      ? 'bg-slate-700 opacity-60' 
                      : 'bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-500/20'
                  } text-white`}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <ThumbsUp size={18} />}
                  {loading ? 'Analyzing...' : 'Finish & Analyze'}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={answers[currentStep] === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:opacity-60 transition-colors"
                >
                  Next <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}