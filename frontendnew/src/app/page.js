"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Brain,
  TrendingUp,
  Shield,
  Zap,
  Users,
  BarChart3,
  Sparkles,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function FinAdaptLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description:
        "Advanced agentic AI that learns your unique spending patterns and financial behavior",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Adaptive Coaching",
      description:
        "Real-time guidance that evolves with your income variability and life changes",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Proactive Alerts",
      description:
        "Smart notifications that help you make better financial decisions before it's too late",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Analysis",
      description:
        "Get immediate feedback on spending decisions and budget optimization",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "For Everyone",
      description:
        "Perfect for gig workers, informal sector employees, and everyday citizens",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Smart Predictions",
      description:
        "Forecast your financial future and plan accordingly with AI-driven predictions",
    },
  ];

  const benefits = [
    "Personalized financial coaching 24/7",
    "Adapts to irregular income patterns",
    "Reduces financial stress and anxiety",
    "Builds better spending habits",
    "No complex financial jargon",
    "Privacy-first approach",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FinAdapt
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Benefits
              </a>
              <a
                href="#contact"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Contact
              </a>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30">
                <Link href="/signup">Get Started</Link>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/50">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block py-2 text-slate-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="block py-2 text-slate-300 hover:text-white transition-colors"
              >
                Benefits
              </a>
              <a
                href="#contact"
                className="block py-2 text-slate-300 hover:text-white transition-colors"
              >
                Contact
              </a>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all">
                <Link href="/signup">Get Started</Link>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center space-x-2 bg-slate-800/50 rounded-full px-4 py-2 border border-slate-700/50">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-300">
                  Powered by Agentic AI
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Your Autonomous
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Financial Coach
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
                AI-powered financial coaching that adapts to your real behavior,
                spending patterns, and income variability. Perfect for gig
                workers, informal sector employees, and everyday citizens.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 flex items-center justify-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-slate-700 hover:border-slate-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-slate-800/50">
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-700/50 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/30">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Brain className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">
                          Problem Statement 1
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Build an autonomous financial coaching agent that
                          adapts to real user behavior, spending patterns, and
                          income variability
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/30">
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">
                          Our Mission
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Helping gig workers, informal sector employees, and
                          everyday citizens make smarter financial decisions
                          proactively
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        24/7
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        AI Support
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        100%
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Adaptive
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-400">∞</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Personalized
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Intelligent Features for
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Smarter Finances
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Powered by cutting-edge agentic AI that understands your unique
              financial situation
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Why Choose
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  FinAdapt?
                </span>
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                We understand that traditional financial advice doesn't work for
                everyone. That's why we've built an AI coach that adapts to your
                reality.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-blue-500/20 rounded-full p-1 mt-0.5">
                      <Check className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">
                      This Month's Savings
                    </div>
                    <div className="text-3xl font-bold text-white">₹12,450</div>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                </div>

                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">
                      Budget Status
                    </div>
                    <div className="text-xl font-semibold text-green-400">
                      On Track
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">
                      Smart Alerts
                    </div>
                    <div className="text-xl font-semibold text-blue-400">
                      3 Active
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">
                        AI Insight
                      </div>
                      <div className="text-sm text-slate-300">
                        You're spending 15% less on dining out this month. Great
                        progress!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-y border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Financial Future?
            </span>
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already making smarter financial
            decisions with AI-powered coaching
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 inline-flex items-center space-x-2">
            <span>
              <Link href="/signup">Get Started for Free</Link>
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">FinAdapt</span>
              </div>
              <p className="text-sm text-slate-400">
                Autonomous AI financial coaching for everyone
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/50 text-center text-sm text-slate-400">
            <p>
              &copy; 2025 FinAdapt. All rights reserved. Built with AI for a
              better financial future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
