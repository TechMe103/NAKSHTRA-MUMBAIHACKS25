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

    // --- Vapi Logic ---
    useEffect(() => {
        if (!PUBLIC_KEY) {
            setStatus("Error: VAPI_PUBLIC_KEY not set.");
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => setMicPermission(true))
            .catch(() => {
                setMicPermission(false);
                setStatus("Microphone access denied.");
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
                 console.error('Vapi Error:', e); 
                 setStatus("Connection error. Please try again.");
                 setIsCallActive(false);
             });
        }
        
        return () => {
            if (vapiRef.current) {
                vapiRef.current.stop(); 
                vapiRef.current.removeAllListeners();
            }
        };
    }, []); 

    const toggleCall = () => {
        if (!vapiRef.current || !micPermission) return;
        
        if (isCallActive) {
            vapiRef.current.stop(); 
        } else {
            if (!ASSISTANT_ID) return setStatus("Error: ASSISTANT_ID not set.");
            setStatus("Connecting...");
            vapiRef.current.start(ASSISTANT_ID); 
        }
    };

    const isDisabled = !micPermission || !PUBLIC_KEY || !ASSISTANT_ID;

    return (
        // LAYOUT FIX: 'fixed inset-0 top-16' (Full screen, below navbar)
        <div className="fixed inset-0 top-16 z-40 flex flex-col items-center justify-center bg-black text-white font-sans overflow-hidden">
            
            {/* --- BACKGROUND LAYERS --- */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 w-full h-full" style={{
                    backgroundImage: `
                        linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    animation: 'grid-flow 20s linear infinite'
                }}></div>
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

            {/* --- MAIN CONTENT (With Padding Fix) --- */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-10 w-full max-w-4xl p-6 pt-16">
                
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-6xl font-bold tracking-tight mt-8">
                        <span className="text-white">Fin</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Adapt</span>
                    </h1>
                    <p className="text-slate-400 text-base uppercase tracking-widest letter-spacing-2">AI Voice Interface</p>
                </div>

                {/* AI Core Orb - RESTORED ORIGINAL ANIMATION */}
                <div className="relative group">
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

                    {/* Main Orb Button (Restored to w-52 h-52 and original gradients) */}
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
                    >
                        {/* Rotating Border (Restored) */}
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

                {/* Status & Tips */}
                <div className="text-center space-y-4 h-24">
                    <div className={`
                        inline-flex items-center px-6 py-2 rounded-full text-sm font-medium border
                        ${isCallActive 
                            ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' 
                            : 'bg-slate-800/50 text-slate-400 border-slate-700/50'}
                        backdrop-blur-md transition-all duration-300
                    `}>
                        <div className={`w-2 h-2 rounded-full mr-3 ${isCallActive ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
                        {status}
                    </div>
                    
                    {!isCallActive && (
                        <p className="text-slate-500 text-sm animate-pulse">
                            Try asking: "What is FinAdapt?"
                        </p>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={toggleCall}
                    disabled={isDisabled}
                    className={`
                         px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl
                        ${isCallActive 
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-900/20' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'}
                    `}
                >
                    {isCallActive ? 'End Conversation' : 'Start Conversation'}
                </button>
            </div>

            {/* Animations */}
            <style jsx>{`
                @keyframes ripple {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes grid-flow {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(50px); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
            `}</style>
        </div>
    );
}

// Simple Mic Icon Component
function MicIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
    );
}