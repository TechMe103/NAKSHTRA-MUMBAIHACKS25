import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRobot, FaChartLine, FaShieldAlt, FaBolt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaRobot,
      title: "AI-Powered Insights",
      description:
        "Unlock deep financial patterns and receive AI-driven recommendations tailored just for you.",
    },
    {
      icon: FaChartLine,
      title: "Smart Budgeting",
      description:
        "Visualize spending, create adaptive budgets, and track progress with real-time graphs.",
    },
    {
      icon: FaShieldAlt,
      title: "Secure & Private",
      description:
        "Your data stays encrypted and safe — stored locally, owned only by you.",
    },
    {
      icon: FaBolt,
      title: "Real-Time Updates",
      description:
        "Experience seamless, instant synchronization across all your devices and accounts.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1f] via-[#0d152a] to-[#0a0f1f] text-white relative overflow-hidden">
      <div className="flex items-center">
        <MdDashboard className="text-primary text-4xl ml-3 mt-3" />
        <span className="font-bold text-4xl mt-3 bg-gradient-to-r from-blue-300 to-cyan-500 text-transparent bg-clip-text">
  &nbsp;FinAdapt
</span>
      </div>
      {/* Floating background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4, scale: 1.2 }}
          transition={{ duration: 4 }}
          className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[150px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, scale: 1.3 }}
          transition={{ duration: 5 }}
          className="absolute bottom-[-150px] right-[-200px] w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-[140px]"
        />
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 py-28 text-center relative z-10"
      >
        {/* 🔹 Motion Giphy Above Heading */}
        <motion.img
          src="./output-onlinegiftools.gif" // 🔸 Replace with your Giphy path or link
          alt="AI Motion Graphic"
          className="w-48 h-48 mx-auto mb-8 rounded-2xl object-cover shadow-lg shadow-blue-800/40"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Heading */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(37,99,235,0.5)]"
        >
          Empower Your Finances <br />
          with <span className="text-white">AI Precision</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A next-gen financial experience that adapts to your lifestyle —
          blending automation, intelligence, and bulletproof security.
        </motion.p>

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 0px 25px rgba(37,99,235,0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-blue-500/40 transition-all"
          >
            Login
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 0px 20px rgba(14,165,233,0.7)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signup")}
            className="px-8 py-4 rounded-xl text-lg font-semibold border border-cyan-400 text-cyan-300 hover:bg-cyan-600/20 transition-all"
          >
            Sign Up
          </motion.button>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(14,165,233,0.3)",
              }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-[#121a2c]/80 backdrop-blur-xl border border-blue-700/40 rounded-2xl p-8 hover:bg-[#18233a]/90 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-5">
                <feature.icon className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-[#121a2c]/80 border border-blue-700/40 rounded-3xl p-12 shadow-[0_0_50px_rgba(37,99,235,0.15)] backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(37,99,235,0.6)]">
                100%
              </h2>
              <p className="text-gray-400">Local Storage Secured</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(14,165,233,0.6)]">
                AI-Powered
              </h2>
              <p className="text-gray-400">Smart Financial Insights</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                Real-Time
              </h2>
              <p className="text-gray-400">Sync & Instant Updates</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
