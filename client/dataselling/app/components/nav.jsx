'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Home, CreditCard, List, User, LogOut, Users, Wallet, ShoppingBag, TrendingUp, ChevronRight, Globe, Zap, Shield, Star, Activity, ArrowUpRight, Sparkles, Coins, BarChart3, Layers, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [showNetworksDropdown, setShowNetworksDropdown] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedUserRole = localStorage.getItem('userrole');
    
    if (userId) {
      setIsLoggedIn(true);
      setUsername(storedUsername || 'User');
      setUserRole(storedUserRole || '');
      
      // Fetch wallet balance if logged in
      if (token) {
        fetchWalletBalance(userId, token);
      }
    }
    
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('#mobile-menu') && !event.target.closest('#menu-button')) {
        setIsMobileMenuOpen(false);
      }
      // Close dropdown when clicking outside
      if (showNetworksDropdown && !event.target.closest('#networks-dropdown')) {
        setShowNetworksDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen, showNetworksDropdown]);

  const fetchWalletBalance = async (userId, token) => {
    try {
      const response = await fetch(`https://datamall.onrender.com/api/wallet/balance?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.balance);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('userrole');
    
    // Update state
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    
    // Show logout success message
    setShowLogoutMessage(true);
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      setShowLogoutMessage(false);
      router.push('/Auth');
    }, 1500);
  };

  const isAdmin = userRole === 'adm';

  // Network providers configuration with new styling
  const networkProviders = [
    {
      id: 'mtn',
      name: 'MTN',
      icon: <Layers size={16} />,
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      id: 'at',
      name: 'AT',
      icon: <Activity size={16} />,
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'telecel',
      name: 'Telecel',
      icon: <Sparkles size={16} />,
      gradient: 'from-rose-400 to-red-500'
    },
  ];

  return (
    <>
      {/* Logout success message with new design */}
      {showLogoutMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-4 rounded-2xl z-50 shadow-2xl border border-gray-800">
          <div className="flex items-center">
            <div className="bg-emerald-500 rounded-full p-2 mr-3 animate-pulse">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium">Successfully logged out • Redirecting...</p>
          </div>
        </div>
      )}
    
      <nav className="w-full bg-black/95 backdrop-blur-lg shadow-2xl sticky top-0 z-40 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Logo with new design */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-black border border-gray-800 px-5 py-2.5 rounded-xl flex items-center space-x-2">
                      <Activity className="text-emerald-400" size={24} />
                      <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">dataSwap</h1>
                    </div>
                  </div>
                </Link>
              </div>
              
              {/* Desktop menu with new styling */}
              <div className="hidden md:ml-12 md:flex md:items-center md:space-x-1">
                <Link href="/" className="text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center hover:bg-gray-900/50 group">
                  <Home size={16} className="mr-2 text-emerald-400 group-hover:scale-110 transition-transform" />
                  Dashboard
                </Link>
                
                {/* Networks Dropdown with new design */}
                <div className="relative" id="networks-dropdown">
                  <button
                    onClick={() => setShowNetworksDropdown(!showNetworksDropdown)}
                    className="text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center hover:bg-gray-900/50 group"
                  >
                    <ShoppingBag size={16} className="mr-2 text-cyan-400 group-hover:scale-110 transition-transform" />
                    Buy Data
                    <ChevronRight size={14} className={`ml-1.5 transition-transform ${showNetworksDropdown ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu with glass effect */}
                  {showNetworksDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
                      <div className="p-2">
                        {networkProviders.map((provider) => (
                          <Link
                            key={provider.id}
                            href={`/${provider.id}`}
                            className="flex items-center px-4 py-3 mb-1 text-sm font-medium text-gray-300 hover:text-white rounded-xl hover:bg-gray-900/50 transition-all duration-200 group"
                            onClick={() => setShowNetworksDropdown(false)}
                          >
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${provider.gradient} mr-3 group-hover:scale-110 transition-transform`}>
                              {provider.icon}
                            </div>
                            <span>{provider.name}</span>
                            <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Link href="/deposite" className="text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center hover:bg-gray-900/50 group">
                  <Coins size={16} className="mr-2 text-amber-400 group-hover:scale-110 transition-transform" />
                  Top Up
                </Link>
                <Link href="/orders" className="text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center hover:bg-gray-900/50 group">
                  <BarChart3 size={16} className="mr-2 text-violet-400 group-hover:scale-110 transition-transform" />
                  Orders
                </Link>
                {isAdmin && (
                  <Link href="/users" className="text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center hover:bg-gray-900/50 group">
                    <Users size={16} className="mr-2 text-rose-400 group-hover:scale-110 transition-transform" />
                    Users
                  </Link>
                )}
              </div>
            </div>
            
            {/* User menu with new design */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  {/* Wallet Balance Card with glass effect */}
                  <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl rounded-xl px-4 py-2 border border-emerald-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500">
                        <Wallet className="text-black" size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Balance</span>
                        <span className="text-white font-bold">GHS {walletBalance.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Info with new styling */}
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-md opacity-50"></div>
                      <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full p-2">
                        <User size={18} className="text-black" />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white">{username}</span>
                      {isAdmin && (
                        <span className="ml-2 px-2.5 py-0.5 text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full">ADMIN</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Logout Button with new style */}
                  <button
                    onClick={handleLogout}
                    className="bg-gray-900/50 hover:bg-red-500/10 border border-gray-800 hover:border-red-500/50 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-red-400 transition-all duration-200 flex items-center group"
                  >
                    <LogOut size={16} className="mr-2 group-hover:rotate-12 transition-transform" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/Auth" className="text-gray-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-900/50">
                    Sign In
                  </Link>
                  <Link href="/Auth" className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-black px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center">
                      Get Started
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button with new design */}
            <div className="flex items-center md:hidden">
              {isLoggedIn && (
                <div className="mr-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl rounded-lg px-2.5 py-1.5 border border-emerald-500/20">
                  <div className="flex items-center">
                    <Wallet className="text-emerald-400 mr-1.5" size={14} />
                    <span className="text-white font-bold text-sm">GHS {walletBalance.toFixed(2)}</span>
                  </div>
                </div>
              )}
              <button
                id="menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-900/50 transition-all duration-200"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="rotate-90 transition-transform" />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu with new dark glass design */}
        <div 
          id="mobile-menu"
          className={`fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-l border-gray-800 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile menu header */}
          <div className="p-5 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Activity className="text-emerald-400" size={24} />
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">dataSwap</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-900/50 transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* User info in mobile menu */}
          {isLoggedIn && (
            <div className="p-5 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full p-3">
                  <User size={20} className="text-black" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-white font-medium">{username}</span>
                    {isAdmin && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full">ADMIN</span>
                    )}
                  </div>
                  <div className="mt-2 bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Balance</span>
                      <span className="text-emerald-400 font-bold">GHS {walletBalance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile menu items with new design */}
          <div className="px-3 py-5 space-y-1">
            <Link 
              href="/" 
              className="flex items-center text-gray-300 hover:text-white hover:bg-gray-900/50 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} className="mr-3 text-emerald-400 group-hover:scale-110 transition-transform" />
              Dashboard
            </Link>
            
            {/* Networks Section in Mobile */}
            <div className="py-3">
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Data Networks
              </div>
              {networkProviders.map((provider) => (
                <Link
                  key={provider.id}
                  href={`/${provider.id}`}
                  className="flex items-center text-gray-300 hover:text-white hover:bg-gray-900/50 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 group mb-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${provider.gradient} mr-3 group-hover:scale-110 transition-transform`}>
                    {provider.icon}
                  </div>
                  {provider.name}
                  <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
            
            <Link 
              href="/deposite" 
              className="flex items-center text-gray-300 hover:text-white hover:bg-gray-900/50 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Coins size={18} className="mr-3 text-amber-400 group-hover:scale-110 transition-transform" />
              Top Up Wallet
            </Link>
            <Link 
              href="/orders" 
              className="flex items-center text-gray-300 hover:text-white hover:bg-gray-900/50 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BarChart3 size={18} className="mr-3 text-violet-400 group-hover:scale-110 transition-transform" />
              My Orders
            </Link>
            {isAdmin && (
              <Link 
                href="/users" 
                className="flex items-center text-gray-300 hover:text-white hover:bg-gray-900/50 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users size={18} className="mr-3 text-rose-400 group-hover:scale-110 transition-transform" />
                Manage Users
              </Link>
            )}
          </div>
          
          {/* Mobile menu footer with new design */}
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full bg-gray-900/50 hover:bg-red-500/10 border border-gray-800 hover:border-red-500/50 px-4 py-3.5 rounded-xl text-base font-medium text-gray-300 hover:text-red-400 transition-all duration-200 group"
              >
                <LogOut size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
                Logout
              </button>
            ) : (
              <div className="space-y-3">
                <Link 
                  href="/Auth" 
                  className="block w-full text-center bg-gray-900/50 text-gray-300 hover:text-white px-4 py-3.5 rounded-xl font-medium hover:bg-gray-900/70 transition-all duration-200 border border-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/Auth" 
                  className="relative block group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-75 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  <div className="relative w-full text-center bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-black px-4 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center">
                    Get Started
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Overlay when mobile menu is open */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>
    </>
  );
}