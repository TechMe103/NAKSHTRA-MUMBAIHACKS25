"use client";
import { useState, useRef, useEffect } from 'react';
import Vapi from '@vapi-ai/web'; 

// Environment variables
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID; 
const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY; 

export default function VapiVoiceSystemPage() {
    const vapiRef = useRef(null); 
    const [isCallActive, setIsCallActive] = useState(false);
    const [status, setStatus] = useState("Tap to initiate FinAdapt AI.");
    const [micPermission, setMicPermission] = useState(true);
    const [audioLevel, setAudioLevel] = useState(0);

    // Simulate audio visualization
    useEffect(() => {
        if (isCallActive) {
            const interval = setInterval(() => {
                setAudioLevel(Math.random() * 100);
            }, 100);
            return () => clearInterval(interval);
        } else {
            setAudioLevel(0);
        }
    }, [isCallActive]);

    // --- Vapi Logic (Unchanged) ---
    useEffect(() => {
        if (!PUBLIC_KEY) {
            setStatus("Error: VAPI_PUBLIC_KEY not set. Check .env.local");
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => setMicPermission(true))
            .catch(() => {
                setMicPermission(false);
                setStatus("Microphone access denied. Please enable.");
            });

        if (!vapiRef.current) {
             vapiRef.current = new Vapi(PUBLIC_KEY);
             
             vapiRef.current.on('call-start', () => {
                 setIsCallActive(true);
                 setStatus("FinAdapt AI Active. Listening...");
             });
             
             vapiRef.current.on('call-end', () => {
                 setIsCallActive(false);
                 setStatus("Session ended. Tap to restart.");
             });
             
             vapiRef.current.on('error', (e) => {
                 console.error('Vapi Error Object:', e); 
                 const errorMessage = e.message || (typeof e === 'string' ? e : JSON.stringify(e));
                 setStatus(`Error: ${errorMessage}. Try again.`);
                 setIsCallActive(false);
             });
        }
        
        return () => {
            if (vapiRef.current) {
                vapiRef.current.removeAllListeners();
            }
        };
    }, []); 

    const toggleCall = () => {
        if (!vapiRef.current || !micPermission) return;
        
        if (isCallActive) {
            vapiRef.current.stop(); 
        } else {
            if (!ASSISTANT_ID) {
                 setStatus("Error: ASSISTANT_ID not set. Check .env.local");
                 return;
            }
            setStatus("Connecting to FinAdapt AI...");
            vapiRef.current.start(ASSISTANT_ID); 
        }
    };

    const isDisabled = !micPermission || !PUBLIC_KEY || !ASSISTANT_ID;

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans overflow-hidden">
            
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-20 w-100% h-100%">
                <div className="absolute inset-0 w-full" style={{
                    backgroundImage: `
                        linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    animation: 'grid-flow 20s linear infinite'
                }}></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none w-full">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-indigo-400 rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-8 p-6 w-full max-w-7xl">
                
                {/* Header */}
                <div className="text-center space-y-2 mb-4">
                    <h1 className="text-5xl font-bold tracking-tight">
                        <span className="text-white">Fin</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Adapt</span>
                    </h1>
                    <p className="text-slate-400 text-sm uppercase tracking-widest">AI Financial Assistant</p>
                </div>

                {/* AI Core Orb */}
                <div className="relative">
                    {/* Outer Glow Rings */}
                    {isCallActive && (
                        <>
                            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" 
                                 style={{ width: '400px', height: '400px', left: '-100px', top: '-100px' }}></div>
                            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30"
                                 style={{ 
                                     width: '320px', 
                                     height: '320px', 
                                     left: '-60px', 
                                     top: '-60px',
                                     animation: 'ripple 3s ease-out infinite'
                                 }}></div>
                            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20"
                                 style={{ 
                                     width: '380px', 
                                     height: '380px', 
                                     left: '-90px', 
                                     top: '-90px',
                                     animation: 'ripple 3s ease-out infinite 1.5s'
                                 }}></div>
                        </>
                    )}

                    {/* Main Orb */}
                    <div 
                        onClick={toggleCall}
                        className={`
                            relative w-52 h-52 rounded-full flex items-center justify-center cursor-pointer 
                            transition-all duration-700 ease-in-out transform 
                            ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}
                            ${isCallActive ? 'shadow-[0_0_60px_rgba(99,102,241,0.6)]' : 'shadow-[0_0_40px_rgba(100,116,139,0.3)]'}
                        `}
                        style={{
                            background: isCallActive 
                                ? 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.9), rgba(88, 28, 135, 0.95), rgba(0, 0, 0, 0.98))'
                                : 'radial-gradient(circle at 30% 30%, rgba(71, 85, 105, 0.8), rgba(30, 41, 59, 0.9), rgba(0, 0, 0, 0.95))',
                        }}
                        disabled={isDisabled}
                    >
                        {/* Rotating Border */}
                        <div className={`absolute inset-0 rounded-full ${isCallActive ? 'animate-spin-slow' : ''}`}
                             style={{
                                 background: isCallActive 
                                     ? 'conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.8), transparent)'
                                     : 'none',
                                 padding: '2px',
                                 WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                 WebkitMaskComposite: 'xor',
                                 maskComposite: 'exclude'
                             }}></div>

                        {/* Audio Visualizer Bars */}
                        {isCallActive && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-gradient-to-t from-indigo-400 to-purple-300 mx-1 rounded-full"
                                        style={{
                                            height: `${20 + (Math.sin(audioLevel / 10 + i) * 30)}%`,
                                            transition: 'height 0.1s ease',
                                            transform: `rotate(${i * 45}deg) translateY(-70px)`
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Center Icon */}
                        <div className="relative z-10 text-center">
                            {isCallActive ? (
                                <div className="space-y-2">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center animate-pulse">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <div className="flex items-center justify-center space-x-1">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <svg className="w-16 h-16 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider">Tap to Talk</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Display */}
                <div className="text-center space-y-4 min-h-[100px]">
                    <div className={`
                        inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                        ${isCallActive ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'}
                        backdrop-blur-sm transition-all duration-500
                    `}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${isCallActive ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500'}`}></div>
                        {status}
                    </div>

                    {/* Quick Tips */}
                    {!isCallActive && (
                        <p className="text-slate-500 text-sm max-w-md animate-fade-in">
                            Ask me anything about financial planning, market insights, or investment strategies
                        </p>
                    )}

                    {isCallActive && (
                        <div className="flex items-center justify-center space-x-2 text-indigo-400 text-sm animate-fade-in">
                            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                            </svg>
                            <span>I'm listening and ready to help</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={toggleCall}
                    disabled={isDisabled}
                    className={`
                        group relative px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 
                        ${isCallActive 
                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-[0_0_30px_rgba(220,38,38,0.4)]' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-[0_0_30px_rgba(99,102,241,0.3)]'}
                        text-white disabled:opacity-30 disabled:cursor-not-allowed transform hover:scale-105
                        border border-white/10
                    `}
                >
                    <span className="relative z-10 flex items-center">
                        {isCallActive ? (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <rect x="6" y="6" width="8" height="8" rx="1"/>
                                </svg>
                                End Conversation
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                </svg>
                                Start Conversation
                            </>
                        )}
                    </span>
                    <div className="absolute inset-0 rounded-full bg-white/20 transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </button>
            </div>

            {/* Footer */}
            <footer className="absolute bottom-6 text-xs text-slate-600 z-10 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                <span>Powered by Vapi AI</span>
            </footer>

            <style jsx>{`
                @keyframes ripple {
                    0% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(1.2);
                        opacity: 0;
                    }
                }
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    50% {
                        transform: translateY(-20px) translateX(10px);
                    }
                }
                @keyframes grid-flow {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(50px);
                    }
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}