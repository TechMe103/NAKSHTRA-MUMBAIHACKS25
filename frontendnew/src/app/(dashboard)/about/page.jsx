import React from 'react';

// Data for the team members
const teamMembers = [
  { 
    name: 'Parth Nandawalkar', 
    role: 'Next.js & AI Agent Specialist', 
    description: 'Building intelligent AI agents and seamless Next.js experiences, integrating cutting-edge agentic workflows into the platform.',
    imagePlaceholder: 'PN',
    linkedin: 'https://linkedin.com/in/parth-nandawalkar'
  },
  { 
    name: 'Ritesh Sonawane', 
    role: 'Next.js & AI Agent Developer', 
    description: 'Architecting AI agent systems and Next.js applications, focusing on intelligent automation and user-centric design.',
    imagePlaceholder: 'RS',
    linkedin: 'https://linkedin.com/in/ritesh-sonawane'
  },
  { 
    name: 'Meera Chote', 
    role: 'ML Engineer & Frontend Developer', 
    description: 'Developing machine learning models and crafting beautiful frontend interfaces, bridging AI capabilities with user experience.',
    imagePlaceholder: 'MC',
    linkedin: 'https://linkedin.com/in/meera-chote'
  },
  { 
    name: 'Sanika Salunkhe', 
    role: 'Backend Engineer', 
    description: 'Building robust backend infrastructure, managing databases, APIs, and ensuring seamless data flow across the platform.',
    imagePlaceholder: 'SS',
    linkedin: 'https://linkedin.com/in/sanika-salunkhe'
  },
];

const TeamMemberCard = ({ name, role, description, imagePlaceholder, linkedin }) => (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 group">
    
    {/* Image Placeholder Section */}
    <div className="w-full h-48 mb-4 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl flex items-center justify-center overflow-hidden relative group-hover:from-indigo-800 group-hover:to-purple-800 transition">
      <span className="text-4xl font-bold text-indigo-300">{imagePlaceholder}</span>
      {/* Replace with actual image: <img src="/team/photo.jpg" alt={name} className="w-full h-full object-cover" /> */}
    </div>
    
    <h3 className="text-xl font-bold text-white">{name}</h3>
    <p className="text-indigo-400 font-semibold text-sm mt-1 mb-3">{role}</p>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    
    <a 
        href={linkedin} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
    >
        Connect on LinkedIn
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    </a>
  </div>
);

export default function AboutPage() {
  return (

      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        
        {/* === 1. Hero & Mission Section === */}
        <section className="text-center mb-20 pt-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
            The Team Driving <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">FinAdapt</span>
          </h1>
          <p className="max-w-4xl mx-auto mt-6 text-lg md:text-xl text-gray-400 leading-relaxed">
            A dynamic group of engineers and analysts, dedicated to redefining personal finance with intelligent, agent-based technology.
          </p>

          {/* Mission Box - Dark Mode */}
          <div className="mt-12 max-w-4xl mx-auto p-8 bg-gradient-to-r from-indigo-950 to-purple-950 border-l-4 border-indigo-500 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-indigo-300 mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Our Core Mission
            </h2>
            <p className="text-indigo-200 text-base leading-relaxed">
              To leverage the power of <strong>Vector Databases</strong> and <strong>Agentic AI</strong> to provide users with predictive, personalized financial insights that traditional apps cannot match.
            </p>
          </div>
        </section>

        {/* === 2. Meet the Team Section === */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Meet the Builders
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Four talented individuals working together to bring you the future of financial management
          </p>
          
          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </div>
        </section>

        {/* === 3. Technology Stack Highlight === */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl shadow-2xl p-10 border border-gray-700 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-3">
                Built with Cutting-Edge Technology
              </h2>
              <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                Powered by industry-leading tools and frameworks
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Next.js */}
                <div className="group p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-gray-800 hover:border-indigo-500 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center text-black font-bold text-2xl shadow-lg group-hover:shadow-indigo-500/50 transition">
                      N
                    </div>
                    <p className="font-semibold text-white text-center">Next.js</p>
                    <p className="text-xs text-gray-400 text-center">React Framework</p>
                  </div>
                </div>

                {/* Node.js */}
                <div className="group p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-gray-800 hover:border-green-500 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/50 transition">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.276-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z"/>
                      </svg>
                    </div>
                    <p className="font-semibold text-white text-center">Node.js</p>
                    <p className="text-xs text-gray-400 text-center">Backend Runtime</p>
                  </div>
                </div>

                {/* MongoDB */}
                <div className="group p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-gray-800 hover:border-green-500 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/50 transition">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296 4.488-3.3 4.292-11.375z"/>
                      </svg>
                    </div>
                    <p className="font-semibold text-white text-center">MongoDB</p>
                    <p className="text-xs text-gray-400 text-center">Database</p>
                  </div>
                </div>

                {/* React */}
                <div className="group p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-gray-800 hover:border-cyan-500 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>
                      </svg>
                    </div>
                    <p className="font-semibold text-white text-center">React</p>
                    <p className="text-xs text-gray-400 text-center">UI Library</p>
                  </div>
                </div>

                {/* Tailwind CSS */}
                <div className="group p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-gray-800 hover:border-cyan-500 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
                      </svg>
                    </div>
                    <p className="font-semibold text-white text-center">Tailwind CSS</p>
                    <p className="text-xs text-gray-400 text-center">Styling</p>
                  </div>
                </div>

                {/* Vector DB */}
                <div className="group p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-gray-800 hover:border-purple-500 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="font-semibold text-white text-center">Vector DB</p>
                    <p className="text-xs text-gray-400 text-center">AI Database</p>
                  </div>
                </div>

                {/* Agno AI */}
                <div className="group p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-gray-800 hover:border-pink-500 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/50 transition">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-white text-center">Agno AI</p>
                    <p className="text-xs text-gray-400 text-center">AI Engine</p>
                  </div>
                </div>

                {/* RAG Pipeline */}
                <div className="group p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl hover:bg-gray-800 hover:border-orange-500 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/50 transition">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-white text-center">RAG Pipeline</p>
                    <p className="text-xs text-gray-400 text-center">Retrieval System</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="bg-gray-900 border-t border-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-400 mb-2">
              <strong className="text-indigo-400">FinAdapt</strong> - Intelligent Personal Finance Management
            </p>
            <p className="text-xs text-gray-500">
              Built with Next.js, Node.js, Agno, MongoDB, and Vector DB for MumbaiHacks 2025
            </p>
          </div>
        </footer>  
      </main>
  );
}