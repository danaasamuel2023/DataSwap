'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, CreditCard, Shield, ArrowRight, CheckCircle, AlertCircle, TrendingUp, Zap, Lock, DollarSign, Activity, Info } from 'lucide-react';

export default function Deposit() {
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(null);

    // Quick amount options
    const quickAmounts = [
        { value: 20, label: 'GHS 20', popular: false },
        { value: 50, label: 'GHS 50', popular: true },
        { value: 100, label: 'GHS 100', popular: false },
        { value: 200, label: 'GHS 200', popular: false },
    ];

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedEmail = localStorage.getItem('email');
        if (storedUserId) setUserId(storedUserId);
        if (storedEmail) setEmail(storedEmail);
    }, []);

    const handleQuickAmount = (value) => {
        setAmount(value.toString());
        setSelectedAmount(value);
        setMessage('');
    };

    const handleCustomAmount = (e) => {
        setAmount(e.target.value);
        setSelectedAmount(null);
        setMessage('');
    };

    const handleDeposit = async () => {
        if (!userId) {
            setMessage('User ID not found. Please log in.');
            setMessageType('error');
            return;
        }
    
        const amountValue = parseFloat(amount);
        if (!amount || isNaN(amountValue) || amountValue <= 0) {
            setMessage('Please enter a valid amount.');
            setMessageType('error');
            return;
        }
    
        if (amountValue < 10) {
            setMessage('Minimum deposit amount is GHS 10.');
            setMessageType('error');
            return;
        }
    
        setLoading(true);
        setMessage('');
    
        try {
            const response = await axios.post('https://dataswap-ydgo.onrender.com/api/wallet/add-funds', {
                userId,
                email,
                amount: amountValue,
                paymentMethod: 'paystack'
            });
            
            if (response.data.success) {
                if (response.data.authorizationUrl) {
                    window.location.href = response.data.authorizationUrl;
                    return;
                }
                
                setMessage(response.data.message || 'Deposit successful!');
                setMessageType('success');
                setAmount('');
                setSelectedAmount(null);
            } else {
                setMessage(response.data.error || 'Deposit failed. Try again.');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Deposit error:', error);
            setMessage(error.response?.data?.error || 'Deposit failed. Try again.');
            setMessageType('error');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-cyan-900/20"></div>
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            
            <div className="relative z-10 w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-2xl opacity-50"></div>
                        <div className="relative bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-4 rounded-2xl border border-emerald-500/30">
                            <Wallet className="w-12 h-12 text-emerald-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Top Up Wallet</h1>
                    <p className="text-gray-400">Add funds to your dataSwap account</p>
                </div>

                {/* Main Card */}
                <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
                    {/* Security Badge */}
                    <div className="mb-6 flex justify-center">
                        <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full">
                            <Shield className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Secured by Paystack</span>
                            <Lock className="w-4 h-4 ml-2" />
                        </div>
                    </div>
                    
                    {/* Quick Amount Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                            Quick Select Amount
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {quickAmounts.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleQuickAmount(option.value)}
                                    className={`relative p-3 rounded-xl border transition-all duration-200 ${
                                        selectedAmount === option.value
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                            : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-900/70 hover:border-gray-600'
                                    }`}
                                >
                                    {option.popular && (
                                        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold rounded-full">
                                            Popular
                                        </span>
                                    )}
                                    <div className="flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        <span className="font-semibold">{option.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Amount Input */}
                    <div className="mb-6">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">
                            Or Enter Custom Amount
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-emerald-400 font-semibold">GHS</span>
                            </div>
                            <input
                                type="number"
                                id="amount"
                                placeholder="0.00"
                                value={amount}
                                onChange={handleCustomAmount}
                                className="block w-full pl-14 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-gray-900/70 transition-all duration-200"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <DollarSign className="w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Info className="w-3 h-3 mr-1" />
                            Minimum deposit: GHS 10.00
                        </div>
                    </div>

                    {/* Amount Display */}
                    {amount && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">You will deposit:</span>
                                <span className="text-2xl font-bold text-emerald-400">GHS {parseFloat(amount).toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Payment Button */}
                    <button 
                        onClick={handleDeposit} 
                        disabled={loading}
                        className="relative w-full group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity rounded-xl"></div>
                        <div className={`relative w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-black rounded-xl font-bold transition-all duration-200 flex items-center justify-center ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}>
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Proceed to Payment
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </div>
                    </button>
                    
                    {/* Payment Methods */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 mb-3">Accepted payment methods</p>
                        <div className="flex justify-center items-center space-x-4">
                            <div className="p-2 bg-gray-900/50 rounded-lg border border-gray-800">
                                <CreditCard className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="p-2 bg-gray-900/50 rounded-lg border border-gray-800">
                                <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                                </svg>
                            </div>
                            <div className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                                <span className="text-white font-bold text-sm">Paystack</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Message Display */}
                    {message && (
                        <div className={`mt-6 p-4 rounded-xl border ${
                            messageType === 'success' 
                                ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' 
                                : 'bg-red-900/20 border-red-500/30 text-red-400'
                        }`}>
                            <div className="flex items-center">
                                {messageType === 'success' ? (
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                )}
                                {message}
                            </div>
                        </div>
                    )}
                </div>

                {/* Security Features */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500/10 rounded-lg mb-2">
                            <Shield className="w-5 h-5 text-emerald-400" />
                        </div>
                        <p className="text-xs text-gray-500">SSL Secured</p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-cyan-500/10 rounded-lg mb-2">
                            <Zap className="w-5 h-5 text-cyan-400" />
                        </div>
                        <p className="text-xs text-gray-500">Instant Credit</p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-violet-500/10 rounded-lg mb-2">
                            <Activity className="w-5 h-5 text-violet-400" />
                        </div>
                        <p className="text-xs text-gray-500">24/7 Support</p>
                    </div>
                </div>
            </div>
        </div>
    );
}