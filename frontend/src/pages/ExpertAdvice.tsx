import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaUserTie, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';

// --- Interfaces & Dummy Data ---

interface Expert {
  id: number;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviews: number;
  avatar: string; // Placeholder for image path or component
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'expert';
}

const experts: Expert[] = [
  { id: 1, name: 'Parth Nandawalkar', title: 'Certified Financial Planner', specialty: 'Retirement Planning', rating: 4.9, reviews: 128, avatar: 'AS' },
  { id: 2, name: 'Ritesh Sonawane', title: 'Investment Strategist', specialty: 'Stock Market & Equities', rating: 4.8, reviews: 94, avatar: 'RP' },
  { id: 3, name: 'Sanika Salunkhe', title: 'Tax Consultant', specialty: 'Corporate & Personal Tax', rating: 5.0, reviews: 210, avatar: 'PS' },
  { id: 4, name: 'Meera Chothe', title: ' Financial Planner', specialty: 'Retirement Planning', rating: 4.9, reviews: 128, avatar: 'AS' },
  { id: 5, name: 'Pankaj Shinde', title: 'Strategist at IIM', specialty: 'Stock Market & Equities', rating: 4.8, reviews: 94, avatar: 'RP' },
  { id: 6, name: 'Priya Singh', title: 'Tax Consultant', specialty: 'Corporate & Personal Tax', rating: 5.0, reviews: 210, avatar: 'PS' },
];

// --- The Main Component ---

export default function ExpertAdvice() {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isExpertTyping, setIsExpertTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isExpertTyping]);

  const handleSelectExpert = (expert: Expert) => {
    setSelectedExpert(expert);
    // Add a default greeting from the expert
    setMessages([
      {
        id: 1,
        text: `Hello! I'm ${expert.name}. How can I help you with your finances today?`,
        sender: 'expert',
      },
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    
    // Trigger the expert's "typing" indicator
    if (!isExpertTyping) {
        setIsExpertTyping(true);
    }
  };

  const handleGoBack = () => {
    setSelectedExpert(null);
    setMessages([]);
    setIsExpertTyping(false);
  };
  
  // Stagger animation for the expert cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <AnimatePresence mode="wait">
        {!selectedExpert ? (
          // --- Expert Selection View ---
          <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-foreground">Connect with an Expert</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Get personalized financial advice from certified professionals.</p>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {experts.map((expert) => (
                <motion.div
                  key={expert.id}
                  variants={itemVariants}
                  className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-primary transition-all duration-300"
                >
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-primary/10">
                    <span className="text-3xl font-bold text-primary">{expert.avatar}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{expert.name}</h3>
                  <p className="text-sm text-primary font-medium">{expert.specialty}</p>
                  <div className="flex items-center gap-2 my-3 text-muted-foreground">
                    <FaStar className="text-yellow-400" />
                    <span className="font-bold text-foreground">{expert.rating.toFixed(1)}</span>
                    <span>({expert.reviews} reviews)</span>
                  </div>
                  <button
                    onClick={() => handleSelectExpert(expert)}
                    className="mt-4 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Chat Now
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          // --- Chat Interface View ---
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden"
            style={{maxHeight: 'calc(100vh - 8rem)'}}
          >
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-border bg-card/80 backdrop-blur-sm">
              <button onClick={handleGoBack} className="p-2 rounded-full hover:bg-secondary transition-colors mr-4">
                <FaArrowLeft className="text-foreground" />
              </button>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-primary">{selectedExpert.avatar}</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{selectedExpert.name}</h3>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-secondary text-foreground rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {/* Typing Indicator */}
              {isExpertTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="px-4 py-2 rounded-2xl bg-secondary text-foreground rounded-bl-none flex items-center gap-1">
                      <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} className="w-2 h-2 bg-muted-foreground rounded-full" />
                      <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} className="w-2 h-2 bg-muted-foreground rounded-full" />
                      <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="w-2 h-2 bg-muted-foreground rounded-full" />
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-3 bg-secondary border border-input rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 hover:bg-primary/90 transition-colors disabled:bg-muted disabled:cursor-not-allowed"
                  disabled={inputValue.trim() === ''}
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}