'use client'
import React, { useState, useEffect } from 'react';
import { Zap,Wallet , Shield, Clock, TrendingUp, ChevronRight, Star, Users, Globe, Activity, Sparkles, Layers, ArrowRight, ArrowUpRight, Coins, BarChart3, Cpu, Signal, Wifi, Database, Circle, Hexagon, Triangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Network Provider Card Component with cyberpunk design
const NetworkProviderCard = ({ provider }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  
  // Provider configurations with actual brand identity
  const providerDetails = {
    mtn: {
      gradient: "from-yellow-400 via-amber-400 to-yellow-500",
      borderGradient: "from-yellow-400 to-amber-500",
      brandColor: "#FFCB05",
      logo: (
        <div className="flex items-center justify-center p-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full"></div>
            <span className="text-4xl font-black text-yellow-400">MTN</span>
          </div>
        </div>
      ),
      pattern: "dots",
      animationDelay: "0ms"
    },
    at: {
      gradient: "from-red-500 via-red-600 to-rose-600",
      borderGradient: "from-red-400 to-red-600",
      brandColor: "#ED1C24",
      logo: (
        <div className="flex items-center justify-center p-3">
          <span className="text-3xl font-bold">
            <span className="text-red-500">Airtel</span>
            <span className="text-blue-600">Tigo</span>
          </span>
        </div>
      ),
      pattern: "waves",
      animationDelay: "100ms"
    },
    telecel: {
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      borderGradient: "from-blue-400 to-cyan-500",
      brandColor: "#0066CC",
      logo: (
        <div className="flex items-center justify-center p-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-7 h-7 bg-white rounded-full"></div>
            </div>
            <span className="text-3xl font-bold text-blue-600">Telecel</span>
          </div>
        </div>
      ),
      pattern: "grid",
      animationDelay: "200ms"
    }
  };
  
  const details = providerDetails[provider];
  
  const handleClick = () => {
    router.push(`/${provider}`);
  };
  
  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
      style={{ animationDelay: details.animationDelay }}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${details.gradient} opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-500`}></div>
      
      {/* Main card */}
      <div className="relative bg-black/90 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1">
        {/* Animated gradient border */}
        <div className={`absolute inset-0 bg-gradient-to-r ${details.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
          <div className="absolute inset-[1px] bg-black rounded-2xl"></div>
        </div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          {details.pattern === 'dots' && (
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle, ${details.brandColor}40 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}></div>
          )}
          {details.pattern === 'waves' && (
            <div className="w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${details.brandColor}20 10px, ${details.brandColor}20 20px)`
            }}></div>
          )}
          {details.pattern === 'grid' && (
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(${details.brandColor}10 1px, transparent 1px),
                linear-gradient(90deg, ${details.brandColor}10 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}></div>
          )}
        </div>
        
        <div className="relative p-8 z-10 flex flex-col items-center justify-center min-h-[280px]">
          {/* Brand Logo */}
          <div className="mb-8">
            {details.logo}
          </div>
          
          {/* CTA */}
          <div className={`flex items-center justify-center py-3 px-8 bg-gradient-to-r ${details.gradient} rounded-xl group-hover:shadow-lg transition-all duration-300`}>
            <span className="text-black font-bold">Get Started</span>
            <ArrowRight className="ml-2 text-black group-hover:translate-x-2 transition-transform duration-300" size={16} />
          </div>
        </div>
        
        {/* Animated particles */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute top-1/4 left-1/4 w-1 h-1 bg-gradient-to-r ${details.gradient} rounded-full animate-float-particle`}></div>
            <div className={`absolute top-3/4 right-1/4 w-1 h-1 bg-gradient-to-r ${details.gradient} rounded-full animate-float-particle animation-delay-200`}></div>
            <div className={`absolute bottom-1/4 left-3/4 w-1 h-1 bg-gradient-to-r ${details.gradient} rounded-full animate-float-particle animation-delay-400`}></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Feature Card Component with glassmorphism
const FeatureCard = ({ icon, title, description, delay }) => (
  <div 
    className="relative group animate-slide-up"
    style={{ animationDelay: delay }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
    <div className="relative bg-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300">
      <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

// Main Services Dashboard Component
const ServicesNetwork = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (token && userId) {
      setIsLoggedIn(true);
    }

    // Mouse tracking for parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToServices = (e) => {
    e.preventDefault();
    document.getElementById('services-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Hero Section with cyberpunk aesthetic */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Dynamic background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-cyan-900/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent"></div>
        </div>
        
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating orbs with parallax */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"
          style={{ transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)` }}
        ></div>
        
        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-20 z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Title */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 animate-slide-up">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                dataSwap
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto animate-slide-up animation-delay-200">
              Buy data bundles instantly.
              <span className="text-emerald-400"> Simple, fast, secure.</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-6 mb-16 animate-slide-up animation-delay-400">
              <Link href="/mtn" className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity rounded-xl"></div>
                <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center">
                  <Zap className="mr-2" size={20} />
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </div>
              </Link>
              
              <a 
                href="#services-section"
                onClick={scrollToServices}
                className="bg-black/50 backdrop-blur-xl text-white border border-gray-700 hover:border-emerald-500/50 px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center group"
              >
                <Database className="mr-2 text-cyan-400" size={20} />
                Browse Plans
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
            </div>
            
            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-up animation-delay-600">
              <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 hover:border-emerald-500/50 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-gray-500 uppercase">Active Users</span>
                </div>
                <div className="text-2xl font-bold text-white">10K+</div>
              </div>
              
              <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-gray-500 uppercase">Daily Orders</span>
                </div>
                <div className="text-2xl font-bold text-white">500+</div>
              </div>
              
              <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 hover:border-violet-500/50 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-gray-500 uppercase">Uptime</span>
                </div>
                <div className="text-2xl font-bold text-white">99.9%</div>
              </div>
              
              <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 hover:border-amber-500/50 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-gray-500 uppercase">Support</span>
                </div>
                <div className="text-2xl font-bold text-white">24/7</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="text-gray-600 rotate-90" size={24} />
        </div>
      </div>
      
      {/* Features Section */}
      <div className="relative py-20 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose dataSwap?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Simple, secure, and reliable data services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Zap className="text-black" size={24} />}
              title="Fast Processing"
              description="Process transactions in seconds with optimized infrastructure"
              delay="0ms"
            />
            <FeatureCard 
              icon={<Shield className="text-black" size={24} />}
              title="Secure Platform"
              description="Advanced encryption protects every transaction"
              delay="100ms"
            />
            <FeatureCard 
              icon={<Clock className="text-black" size={24} />}
              title="24/7 Service"
              description="Round-the-clock availability with reliable uptime"
              delay="200ms"
            />
            <FeatureCard 
              icon={<Coins className="text-black" size={24} />}
              title="Best Rates"
              description="Competitive pricing ensures great value"
              delay="300ms"
            />
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div id="services-section" className="relative py-20 scroll-mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>
        
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Network</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select your preferred network provider
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <NetworkProviderCard provider="mtn" />
            <NetworkProviderCard provider="at" />
            <NetworkProviderCard provider="telecel" />
          </div>
          
          {/* CTA Section */}
          {isLoggedIn && (
            <div className="mt-20">
              <div className="relative group max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity rounded-2xl"></div>
                <div className="relative bg-black/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-12 text-center">
                  <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                    Fund your wallet and start buying data instantly
                  </p>
                  <Link href="/deposite" className="relative inline-flex group/btn">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-50 group-hover/btn:opacity-75 transition-opacity rounded-xl"></div>
                    <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-10 py-4 rounded-xl font-bold transition-all duration-300 flex items-center">
                      <Wallet className="mr-2" size={20} />
                      Top Up Wallet
                      <ArrowRight className="ml-2 group-hover/btn:translate-x-2 transition-transform" size={20} />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-down {
          animation: slide-down 0.8s ease-out forwards;
        }
        
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
        }
        
        .animate-float-particle {
          animation: float-particle 3s ease-in-out infinite;
        }
        
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default ServicesNetwork;