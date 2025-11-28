import Navbar from '@/components/Navbar';
import React from 'react';
// Assuming Navbar is at the root of the app folder as per previous context

// Data for the pricing tiers
const pricingTiers = [
  {
    name: 'Starter',
    price: '₹0',
    frequency: 'per month',
    description: 'Perfect for basic tracking and getting started with digital finance.',
    features: [
      'Unlimited Transactions',
      'Manual Transaction Entry',
      'Basic Spending Reports',
      'Standard Email Support',
      'Access to Chatbot (Basic Q&A)'
    ],
    cta: 'Start Free',
    isPrimary: false,
  },
  {
    name: 'Pro Adapt',
    price: '₹499',
    frequency: 'per month',
    description: 'Unlock personalized insights, proactive management, and full agent access.',
    features: [
      'All Starter Features',
      'Unlimited Account Linking',
      'AI Financial Coach Agent',
      'Anomaly / Fraud Detection',
      'Predictive Budgeting',
      'Monthly Summary Agent Reports',
      'Priority Support'
    ],
    cta: 'Go Pro',
    isPrimary: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    frequency: '',
    description: 'Tailored solutions for large portfolios, institutional advice, and dedicated support.',
    features: [
      'All Pro Adapt Features',
      'Dedicated Relationship Manager',
      'Custom Financial Modeling',
      'Direct API Access',
      'Compliance and Audit Reporting',
      'Premium 24/7 Phone Support',
      'Bespoke Integrations'
    ],
    cta: 'Contact Sales',
    isPrimary: false,
  },
];

// Reusable Pricing Card Component
const PricingCard = ({ name, price, frequency, description, features, cta, isPrimary }) => {
  const primaryBg = 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white';
  const primaryBorder = 'border-4 border-indigo-400 shadow-xl scale-[1.02]';
  
  return (
    <div className={`p-8 rounded-2xl border-slate-200 transition-all duration-300 flex flex-col h-full ${isPrimary ? `${primaryBg} ${primaryBorder}` : 'bg-white border-2'}`}>
      
      {isPrimary && (
        <span className="text-sm font-bold tracking-wider uppercase text-yellow-300 mb-2">Most Popular</span>
      )}
      
      <h2 className={`text-3xl font-bold ${isPrimary ? 'text-white' : 'text-slate-900'} mb-2`}>{name}</h2>
      
      <p className={`text-lg mb-6 ${isPrimary ? 'text-indigo-200' : 'text-slate-500'}`}>{description}</p>

      <div className="flex items-baseline mb-8">
        <span className={`text-5xl font-extrabold ${isPrimary ? 'text-white' : 'text-slate-900'}`}>{price}</span>
        {frequency && <span className={`ml-2 text-xl font-medium ${isPrimary ? 'text-indigo-200' : 'text-slate-500'}`}>{frequency}</span>}
      </div>

      <ul className={`space-y-3 flex-grow ${isPrimary ? 'text-indigo-100' : 'text-slate-600'} mb-8`}>
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className={`flex-shrink-0 w-6 h-6 ${isPrimary ? 'text-yellow-300' : 'text-indigo-500'} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className={`text-sm ${isPrimary ? 'text-white' : 'text-slate-700'}`}>{feature}</span>
          </li>
        ))}
      </ul>

      <a 
        href={isPrimary ? '#checkout' : '#signup'}
        className={`mt-auto block w-full text-center py-3.5 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md ${
          isPrimary 
            ? 'bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-lg' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {cta}
      </a>
    </div>
  );
};

export default function PricingPage() {
  return (
    <div className="min-h-screen text-slate-900">
      <Navbar/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header and Value Proposition */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl text-white font-extrabold  leading-tight">
            Choose the <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 ">Right Plan</span> for You
          </h1>
          <p className="max-w-3xl mx-auto mt-4 text-xl text-slate-600">
            From basic tracking to full-scale AI agent management, find the solution that helps you achieve financial mastery.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
        
        {/* FAQ/Legal Disclaimer Section */}
        <section className="mt-20 p-8 bg-white border border-slate-100 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Questions?</h2>
            <p className="text-slate-500 text-sm">
                *The Pro Adapt tier offers full access to all **7 AI Agents** (excluding voice) for enhanced, proactive financial decision-making. All subscriptions can be canceled anytime.
            </p>
        </section>

      </main>
    </div>
  );
}