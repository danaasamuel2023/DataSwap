'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, Smartphone, CheckCircle, AlertCircle, XCircle, Zap, Activity, ShoppingCart, ArrowRight, Globe, Share2, Wifi } from 'lucide-react';

const IShareBundleCards = () => {
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userId, setUserId] = useState(null);
  const [networkAvailability, setNetworkAvailability] = useState({
    mtn: true,
    at: true,
    telecel: true,
    ishare: true
  });
  const [checkingAvailability, setCheckingAvailability] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bundleToConfirm, setBundleToConfirm] = useState(null);
  const [successDetails, setSuccessDetails] = useState({
    phoneNumber: '',
    bundleCapacity: '',
    reference: ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get user ID from localStorage and check network availability on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error('User ID not found in localStorage');
      setMessage({ text: 'Please login to purchase data bundles', type: 'error' });
      setShowErrorModal(true);
    }
    fetchNetworkAvailability();
  }, []);

  // Function to fetch network availability
  const fetchNetworkAvailability = async () => {
    try {
      setCheckingAvailability(true);
      const response = await axios.get('https://dataswap-ydgo.onrender.com/api/networks-availability');
      
      if (response.data.success) {
        const networks = response.data.networks;
        setNetworkAvailability({
          ...networks,
          ishare: networks.AT_PREMIUM || 'AT_PREMIUM' 
        });
        
        if (!networks.att && !networks.ishare) {
          setMessage({ 
            text: 'iShare bundles are currently out of stock. Please check back later.', 
            type: 'error' 
          });
          setShowErrorModal(true);
        }
      }
    } catch (err) {
      console.error('Error checking network availability:', err);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const bundles = [
  { capacity: '1', mb: '1000', price: '3.95', network: 'AT_PREMIUM' },
  { capacity: '2', mb: '2000', price: '8.35', network: 'AT_PREMIUM' },
  { capacity: '3', mb: '3000', price: '13.25', network: 'AT_PREMIUM' },
  { capacity: '4', mb: '4000', price: '16.50', network: 'AT_PREMIUM' },
  { capacity: '5', mb: '5000', price: '19.50', network: 'AT_PREMIUM' },
  { capacity: '6', mb: '6000', price: '23.50', network: 'AT_PREMIUM' },
  { capacity: '8', mb: '8000', price: '30.50', network: 'AT_PREMIUM' },
  { capacity: '10', mb: '10000', price: '38.50', network: 'AT_PREMIUM' },
  { capacity: '12', mb: '12000', price: '45.50', network: 'AT_PREMIUM' },
  { capacity: '15', mb: '15000', price: '57.50', network: 'AT_PREMIUM' },
  { capacity: '25', mb: '25000', price: '95.00', network: 'AT_PREMIUM' },
  { capacity: '30', mb: '30000', price: '115.00', network: 'AT_PREMIUM' },
  { capacity: '40', mb: '40000', price: '151.00', network: 'AT_PREMIUM' },
  { capacity: '50', mb: '50000', price: '190.00', network: 'AT_PREMIUM' }
];

  const validatePhoneNumber = (number) => {
    const trimmedNumber = number.trim();
    const pattern = /^\d{10}$/;
    return pattern.test(trimmedNumber);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value.trim());
  };

  const initiateConfirmation = () => {
    setMessage({ text: '', type: '' });
    
    if (!networkAvailability.ishare) {
      setMessage({ 
        text: 'iShare bundles are currently out of stock. Please check back later.', 
        type: 'error' 
      });
      setShowErrorModal(true);
      return;
    }

    if (!selectedBundle) {
      setMessage({ text: 'Please select a data bundle', type: 'error' });
      setShowErrorModal(true);
      return;
    }
    
    const trimmedPhoneNumber = phoneNumber.trim();
    
    if (!trimmedPhoneNumber) {
      setMessage({ text: 'Please enter a phone number', type: 'error' });
      setShowErrorModal(true);
      return;
    }
    
    if (!validatePhoneNumber(trimmedPhoneNumber)) {
      setMessage({ 
        text: 'Please enter a valid 10-digit phone number', 
        type: 'error' 
      });
      setShowErrorModal(true);
      return;
    }

    if (!userId) {
      setMessage({ text: 'Please login to purchase data bundles', type: 'error' });
      setShowErrorModal(true);
      return;
    }

    setBundleToConfirm(selectedBundle);
    setShowConfirmation(true);
  };

  const handlePurchase = async () => {
    if (!bundleToConfirm) return;
    
    setIsLoading(true);
    const bundle = bundleToConfirm;
    const trimmedPhoneNumber = phoneNumber.trim();

    try {
      await fetchNetworkAvailability();
      
      if (!networkAvailability.ishare) {
        setMessage({ 
          text: 'iShare bundles are currently out of stock. Please check back later.', 
          type: 'error' 
        });
        setIsLoading(false);
        setShowConfirmation(false);
        setShowErrorModal(true);
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const dataAmountInGB = parseFloat(bundle.mb) / 1000;
      const reference = `DATA-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
       
      const processResponse = await axios.post('https://dataswap-ydgo.onrender.com/api/data/process-data-order', {
        userId: userId,
        phoneNumber: trimmedPhoneNumber,
        network: 'AT_PREMIUM',
        dataAmount: bundle.mb/1000,
        price: parseFloat(bundle.price),
        reference: reference
      }, { 
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (processResponse.data.success) {
        setMessage({ 
          text: `✅ ${bundle.capacity}GB data bundle purchased successfully!`, 
          type: 'success' 
        });
        
        setSuccessDetails({
          phoneNumber: trimmedPhoneNumber,
          bundleCapacity: bundle.capacity,
          reference: reference
        });
        
        setSelectedBundle(null);
        setPhoneNumber('');
        setShowSuccessModal(true);
      } else {
        setMessage({ 
          text: processResponse.data.error || 'Failed to process data order', 
          type: 'error' 
        });
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setMessage({ 
        text: error.response?.data?.error || error.message || 'Failed to purchase data bundle', 
        type: 'error' 
      });
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
      setBundleToConfirm(null);
    }
  };

  // Custom Dropdown Component
  const BundleDropdown = () => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-400 mb-2">Select Data Bundle</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={!networkAvailability.ishare}
          className={`w-full px-4 py-3 bg-gray-900/50 border ${
            selectedBundle 
              ? 'border-cyan-500/50 text-cyan-400' 
              : 'border-gray-700 text-gray-300'
          } rounded-xl focus:outline-none focus:border-cyan-500 transition-all duration-200 flex items-center justify-between hover:bg-gray-900/70 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="flex items-center">
            {selectedBundle ? (
              <>
                <Activity className="mr-2 text-cyan-400" size={18} />
                <span className="font-semibold">{selectedBundle.capacity}GB - GHS {selectedBundle.price}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 text-gray-500" size={18} />
                <span>Choose a bundle...</span>
              </>
            )}
          </span>
          <ChevronDown 
            className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            size={20} 
          />
        </button>

        {isDropdownOpen && networkAvailability.ishare && (
          <div className="absolute z-10 w-full mt-2 bg-black/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            {bundles.map((bundle, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedBundle(bundle);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-3 hover:bg-gray-900/50 transition-all duration-200 flex items-center justify-between group border-b border-gray-800 last:border-b-0"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-cyan-500/20 transition-colors">
                    <span className="text-cyan-400 font-bold">{bundle.capacity}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-medium">{bundle.capacity}GB Data</div>
                    <div className="text-xs text-gray-500">No Expiry</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-bold">GHS {bundle.price}</div>
                  <div className="text-xs text-gray-500">One-time</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Confirmation Modal
  const ConfirmationModal = () => {
    if (!showConfirmation || !bundleToConfirm) return null;
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/90 border border-gray-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
            <h2 className="text-xl font-bold text-white text-center">Confirm Purchase</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6 bg-red-900/20 border border-red-500/30 p-4 rounded-xl">
              <p className="font-bold text-red-400 text-sm text-center">
                ⚠️ NO REFUNDS for incorrect numbers
              </p>
            </div>
            
            <div className="mb-6 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">Number:</span>
                <span className="font-semibold text-white">{phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Bundle:</span>
                <span className="font-semibold text-cyan-400">{bundleToConfirm.capacity}GB - GHS {bundleToConfirm.price}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setBundleToConfirm(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-700 bg-gray-900/50 text-gray-300 rounded-xl hover:bg-gray-900/70 transition-all font-medium"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-medium shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Success Modal
  const SuccessModal = () => {
    if (!showSuccessModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/90 border border-gray-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
            <h2 className="text-xl font-bold text-white text-center">Success!</h2>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-center mb-6 text-green-400">
              <CheckCircle size={64} />
            </div>
            
            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-white mb-2">
                {successDetails.bundleCapacity}GB Purchased
              </p>
              <p className="text-gray-400">
                Bundle will be activated on {successDetails.phoneNumber}
              </p>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 mb-6">
              <p className="text-xs text-gray-500 mb-1">Reference:</p>
              <p className="font-mono text-sm text-gray-300">{successDetails.reference}</p>
            </div>
            
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Error Modal
  const ErrorModal = () => {
    if (!showErrorModal || !message.text || message.type !== 'error') return null;
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/90 border border-gray-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-rose-500 p-4">
            <h2 className="text-xl font-bold text-white text-center">Error</h2>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-center mb-6 text-red-400">
              <XCircle size={64} />
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-300">{message.text}</p>
            </div>
            
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Share2 className="text-white" size={36} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">iShare Data Bundles</h1>
          <p className="text-gray-400">International data sharing made simple</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8">
          {/* Network Status */}
          <div className="mb-8 flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${networkAvailability.ishare ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-gray-300">Network Status:</span>
            </div>
            <span className={`font-semibold ${networkAvailability.ishare ? 'text-green-400' : 'text-red-400'}`}>
              {networkAvailability.ishare ? 'Available' : 'Out of Stock'}
            </span>
          </div>

          {checkingAvailability ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mr-3"></div>
              <span className="text-gray-400">Checking availability...</span>
            </div>
          ) : (
            <>
              {/* Bundle Selection */}
              <div className="mb-6">
                <BundleDropdown />
              </div>

              {/* Phone Number Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="text-gray-500" size={18} />
                  </div>
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all duration-200"
                    placeholder="Enter 10-digit number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    disabled={!networkAvailability.ishare}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Enter a valid 10-digit phone number</p>
              </div>

              {/* Selected Bundle Display */}
              {selectedBundle && (
                <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wifi className="text-cyan-400 mr-2" size={20} />
                      <span className="text-cyan-400 font-medium">Selected Bundle:</span>
                    </div>
                    <span className="text-white font-bold">{selectedBundle.capacity}GB - GHS {selectedBundle.price}</span>
                  </div>
                </div>
              )}

              {/* Purchase Button */}
              <button
                onClick={initiateConfirmation}
                disabled={isLoading || !networkAvailability.ishare}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-lg flex items-center justify-center group"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Purchase Bundle
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-8 p-6 bg-gray-900/30 border border-gray-800 rounded-xl">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <AlertCircle className="mr-2 text-cyan-400" size={20} />
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              iShare bundles work internationally for data sharing
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              Please verify phone number before purchase - no refunds for wrong numbers
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              Bundle activation is instant after successful payment
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              All bundles are non-expiry and valid until consumed
            </li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal />
      <SuccessModal />
      <ErrorModal />
    </div>
  );
};

export default IShareBundleCards;