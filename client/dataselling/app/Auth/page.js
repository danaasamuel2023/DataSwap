'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, Activity, User, Mail, Phone, KeyRound, UserPlus, LogIn, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push('/');
    }
  }, [router]);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setSuccess("");
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const endpoint = isSignup ? "register" : "login";
      const response = await axios.post(`https://dataswap-ydgo.onrender.com/api/auth/${endpoint}`, data);
      
      if (!isSignup) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userrole", response.data.role);
        localStorage.setItem("username", data.email.split('@')[0]); // Store username from email
        
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setSuccess("Account created successfully! You can now login.");
        setTimeout(() => {
          setIsSignup(false);
          reset();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-cyan-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10 px-4"
      >
        {/* Logo Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-2xl opacity-50"></div>
            <div className="relative">
              <Activity className="w-16 h-16 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            dataSwap
          </h1>
          <p className="text-gray-400">Secure Data Exchange Platform</p>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          
          {/* Alert Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 rounded-xl bg-red-900/20 border border-red-500/30"
              >
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {error}
                </p>
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/30"
              >
                <p className="text-sm text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  {success}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AnimatePresence mode="wait">
              {isSignup && (
                <>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        id="name"
                        type="text"
                        {...register("name", { required: isSignup && "Full name is required" })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl
                                  text-white placeholder-gray-500
                                  focus:outline-none focus:border-emerald-500 focus:bg-gray-900/70
                                  transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label htmlFor="username" className="block text-sm font-medium text-gray-400">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        id="username"
                        type="text"
                        {...register("username", {   
                          required: isSignup && "Username is required",
                          minLength: { value: 3, message: "Username must be at least 3 characters" }
                        })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl
                                  text-white placeholder-gray-500
                                  focus:outline-none focus:border-emerald-500 focus:bg-gray-900/70
                                  transition-all duration-200"
                        placeholder="johndoe"
                      />
                    </div> 
                    {errors.username && (
                      <p className="text-xs text-red-400 mt-1">{errors.username.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-400">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        id="phone"
                        type="tel"
                        {...register("phone", { 
                          required: isSignup && "Phone number is required",
                          pattern: { value: /^[0-9+\-\s()]+$/, message: "Invalid phone number" }
                        })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl
                                  text-white placeholder-gray-500
                                  focus:outline-none focus:border-emerald-500 focus:bg-gray-900/70
                                  transition-all duration-200"
                        placeholder="+233 XX XXX XXXX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl
                            text-white placeholder-gray-500
                            focus:outline-none focus:border-emerald-500 focus:bg-gray-900/70
                            transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl
                            text-white placeholder-gray-500
                            focus:outline-none focus:border-emerald-500 focus:bg-gray-900/70
                            transition-all duration-200"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={togglePassword} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                           hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="relative w-full group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity rounded-xl"></div>
              <div className="relative w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 
                           hover:from-emerald-600 hover:to-cyan-600 
                           text-black font-bold rounded-xl
                           disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed
                           transition-all duration-200 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {isSignup ? <UserPlus size={20} /> : <LogIn size={20} />}
                    <span>{isSignup ? "Create Account" : "Sign In"}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </motion.button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black/50 text-gray-500">or continue with</span>
              </div>
            </div>
            
            {/* Social Login Options */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-2.5 border border-gray-700 rounded-xl hover:bg-gray-900/50 transition-all duration-200 group">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2 text-gray-400 group-hover:text-white text-sm font-medium transition-colors">Google</span>
              </button>
              
              <button className="flex items-center justify-center px-4 py-2.5 border border-gray-700 rounded-xl hover:bg-gray-900/50 transition-all duration-200 group">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="ml-2 text-gray-400 group-hover:text-white text-sm font-medium transition-colors">GitHub</span>
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-emerald-400 font-semibold hover:text-emerald-300 
                           transition-colors duration-200"
                >
                  {isSignup ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Features */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500/10 rounded-lg mb-2">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs text-gray-500">Secure</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-cyan-500/10 rounded-lg mb-2">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-xs text-gray-500">Fast</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-violet-500/10 rounded-lg mb-2">
              <Activity className="w-5 h-5 text-violet-400" />
            </div>
            <p className="text-xs text-gray-500">Reliable</p>
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.p 
          variants={itemVariants}
          className="text-center mt-8 text-xs text-gray-600"
        >
          By continuing, you agree to dataSwap's{" "}
          <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">Terms</a>
          {" "}and{" "}
          <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">Privacy Policy</a>
        </motion.p>
      </motion.div>
    </div>
  );
}