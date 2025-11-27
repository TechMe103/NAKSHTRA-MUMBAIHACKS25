'use client';

import { useState } from 'react';
// Using generic <a> tag for compilation safety
const Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>; 

import { MessageCircle, Send, Loader2, AlertCircle, CheckCircle, Lightbulb, Star, Bug } from 'lucide-react';

const feedbackCategories = [
  { value: 'suggestion', label: 'Suggestion/New Feature', icon: Lightbulb, color: 'text-indigo-400' },
  { value: 'praise', label: 'Positive Feedback (Praise)', icon: Star, color: 'text-yellow-400' },
  { value: 'bug', label: 'Bug Report / Error', icon: Bug, color: 'text-red-400' },
  { value: 'general', label: 'General Inquiry', icon: MessageCircle, color: 'text-slate-400' },
];

// Helper to safely get user data from localStorage
const getUserDetails = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : {};
    }
    return {};
};

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    category: feedbackCategories[0].value,
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrorMessage('');

    const token = localStorage.getItem('token');
    const user = getUserDetails();

    // 1. Construct the complete payload with user identity and target email
    const payload = {
        ...formData,
        senderDetails: {
            id: user.id, // User ID from MongoDB
            fullName: user.fullName,
            email: user.email, // User's registered email
        },
        targetEmail: "ritesh26live@gmail.com", // The required destination email
    };

    // MOCK API CALL - Assuming a POST to /api/feedback
    try {
      // NOTE: Your backend (Node.js) needs to handle this POST request,
      // extract 'targetEmail' and 'senderDetails', and send the email via Nodemailer.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      // Simulate network delay and success/failure response
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      if (res.ok) {
        // Assume success status 201/200
        setStatus('success');
        setFormData({ category: feedbackCategories[0].value, subject: '', message: '' }); // Clear form
      } else {
        // Handle API errors
        const data = await res.json();
        setErrorMessage(data.message || 'Server failed to process feedback.');
        setStatus('error');
      }

    } catch (err) {
      setErrorMessage("Could not connect to the service. Please try again.");
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 relative z-10 w-full max-w-4xl mx-auto">
      
      <header className="mb-8 border-b border-slate-800/50 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <MessageCircle size={28} className="text-yellow-400" /> Send Feedback
        </h1>
        <p className="text-slate-400 mt-1">Help us improve FinAdapt by sharing your experience, reporting bugs, or suggesting new features. Your details will be included in the submission.</p>
      </header>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="p-4 bg-green-900/30 border border-green-800 text-green-300 rounded-xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle size={20} />
          <p>Thank you! Your feedback has been successfully submitted.</p>
        </div>
      )}
      {status === 'error' && (
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-300 rounded-xl flex items-center gap-3 animate-in fade-in">
          <AlertCircle size={20} />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Feedback Form */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Category Selector */}
          <div>
            <label htmlFor="category" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Feedback Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {feedbackCategories.map(cat => (
                <label 
                  key={cat.value}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.category === cat.value
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={formData.category === cat.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <cat.icon size={20} className={cat.color} />
                  <span className="text-sm font-medium">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Subject */}
          <div>
            <label htmlFor="subject" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Subject / Short Title
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
              placeholder="e.g., Reports page is slow"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Detailed Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 resize-y"
              placeholder="Describe your issue or suggestion here..."
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 w-full py-3 px-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg ${
              loading 
                ? 'bg-indigo-700 opacity-70 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 hover:shadow-indigo-500/40'
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send size={20} /> Send Feedback
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}