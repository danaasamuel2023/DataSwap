'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, AlertCircle, Activity, Phone, Database, Calendar, Hash, ArrowRight, Loader2, TrendingUp, FileText, Signal, Eye } from 'lucide-react';

const UserOrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [statusModal, setStatusModal] = useState({ isOpen: false, data: null, loading: false, error: null, reference: '' });
  const [activeFilter, setActiveFilter] = useState('all');

  // API Key for status checks
  const API_KEY = 'f9329bb51dd27c41fe3b85c7eb916a8e88821e07fd0565e1ff2558e7be3be7b4';

  useEffect(() => {
    // Get user ID from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchOrders(storedUserId);
    } else {
      setError('Please login to view your orders');
      setIsLoading(false);
    }
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`https://datamall.onrender.com/api/data/user-orders/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.error || error.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Check order status
  const checkOrderStatus = async (reference) => {
    setStatusModal({ isOpen: true, data: null, loading: true, error: null, reference });

    try {
      const response = await axios.get(`https://datamartbackened.onrender.com/api/developer/order-status/${reference}`, {
        headers: {
          'x-api-key': API_KEY
        }
      });

      if (response.data.status === 'success') {
        setStatusModal({ 
          isOpen: true, 
          data: response.data.data, 
          loading: false, 
          error: null,
          reference 
        });
      } else {
        setStatusModal({ 
          isOpen: true, 
          data: null, 
          loading: false, 
          error: 'Failed to fetch order status',
          reference 
        });
      }
    } catch (error) {
      console.error('Error checking order status:', error);
      setStatusModal({ 
        isOpen: true, 
        data: null, 
        loading: false, 
        error: error.response?.data?.message || 'Failed to check order status',
        reference 
      });
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) { // 7 days
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status icon and color
  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    switch (statusLower) {
      case 'completed':
        return { icon: <CheckCircle size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
      case 'failed':
        return { icon: <XCircle size={20} />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
      case 'pending':
        return { icon: <Clock size={20} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };
      case 'processing':
        return { icon: <Activity size={20} className="animate-pulse" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' };
      default:
        return { icon: <AlertCircle size={20} />, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30' };
    }
  };

  // Get network badge styling
  const getNetworkStyle = (network) => {
    const networkUpper = network?.toUpperCase() || '';
    
    if (networkUpper === 'YELLO' || networkUpper === 'MTN') {
      return { bg: 'from-yellow-400 to-amber-500', text: 'MTN', color: 'text-black' };
    } else if (networkUpper === 'AT' || networkUpper === 'AIRTELTIGO') {
      return { bg: 'from-red-500 to-rose-600', text: 'AT', color: 'text-white' };
    } else if (networkUpper === 'TELECEL') {
      return { bg: 'from-blue-500 to-indigo-600', text: 'TC', color: 'text-white' };
    } else {
      return { bg: 'from-gray-500 to-gray-600', text: network?.slice(0, 2).toUpperCase() || '??', color: 'text-white' };
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'recent') {
      const date = new Date(order.createdAt);
      const daysDiff = (new Date() - date) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }
    return true;
  });

  // Close modal
  const closeModal = () => {
    setStatusModal({ isOpen: false, data: null, loading: false, error: null, reference: '' });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-cyan-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <FileText className="mr-3 text-emerald-400" size={32} />
                Order History
              </h1>
              <p className="text-gray-400">Track and manage your data bundle purchases</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === 'all' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-gray-900/50 text-gray-400 border border-gray-700 hover:bg-gray-900/70'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setActiveFilter('recent')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === 'recent' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-gray-900/50 text-gray-400 border border-gray-700 hover:bg-gray-900/70'
                }`}
              >
                Recent
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{orders.length}</p>
                </div>
                <TrendingUp className="text-emerald-400" size={24} />
              </div>
            </div>
            <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Week</p>
                  <p className="text-2xl font-bold text-white">
                    {orders.filter(o => {
                      const date = new Date(o.createdAt);
                      const daysDiff = (new Date() - date) / (1000 * 60 * 60 * 24);
                      return daysDiff <= 7;
                    }).length}
                  </p>
                </div>
                <Calendar className="text-cyan-400" size={24} />
              </div>
            </div>
            <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-white">
                    GHS {orders.reduce((sum, order) => sum + (order.price || 0), 0).toFixed(2)}
                  </p>
                </div>
                <Database className="text-violet-400" size={24} />
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin text-emerald-400 mb-4" size={40} />
              <p className="text-gray-400">Loading your orders...</p>
            </div>
          </div>
        ) : (
          <>
            {filteredOrders.length === 0 ? (
              <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-12 text-center">
                <Activity className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400 text-lg">
                  {activeFilter === 'recent' ? 'No recent orders found.' : "You haven't placed any orders yet."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => {
                  const networkStyle = getNetworkStyle(order.network);
                  const statusInfo = getStatusIcon(order.status || 'pending');
                  
                  return (
                    <div key={order.id} className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        {/* Left Section */}
                        <div className="flex items-start space-x-4 mb-4 md:mb-0">
                          {/* Network Badge */}
                          <div className={`w-12 h-12 bg-gradient-to-r ${networkStyle.bg} rounded-xl flex items-center justify-center shadow-lg`}>
                            <span className={`font-bold text-sm ${networkStyle.color}`}>{networkStyle.text}</span>
                          </div>
                          
                          {/* Order Details */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-white font-semibold text-lg">{order.dataAmount}GB Data Bundle</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.color}`}>
                                {order.status || 'Pending'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center text-gray-400">
                                <Phone size={14} className="mr-2" />
                                {order.phoneNumber}
                              </div>
                              <div className="flex items-center text-gray-400">
                                <Clock size={14} className="mr-2" />
                                {formatDate(order.createdAt)}
                              </div>
                              <div className="flex items-center text-gray-400">
                                <Hash size={14} className="mr-2" />
                                <span className="font-mono text-xs">{order.reference}</span>
                              </div>
                              <div className="flex items-center text-gray-400">
                                <Signal size={14} className="mr-2" />
                                {order.network.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Section */}
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">Amount</p>
                            <p className="text-2xl font-bold text-emerald-400">GHS {order.price.toFixed(2)}</p>
                          </div>
                          
                          <button
                            onClick={() => checkOrderStatus(order.reference)}
                            className="group relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity rounded-lg"></div>
                            <div className="relative px-4 py-2 bg-gray-900/50 border border-gray-700 hover:border-emerald-500/50 rounded-lg transition-all duration-200 flex items-center">
                              <Eye size={16} className="mr-2 text-gray-400 group-hover:text-emerald-400" />
                              <span className="text-gray-400 group-hover:text-white text-sm font-medium">Check Status</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Simplified Status Modal */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 border border-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              {statusModal.loading && (
                <>
                  <Loader2 className="animate-spin text-emerald-400 mx-auto mb-4" size={48} />
                  <p className="text-gray-400">Checking order status...</p>
                </>
              )}

              {statusModal.error && (
                <>
                  <XCircle className="text-red-400 mx-auto mb-4" size={48} />
                  <p className="text-white font-semibold mb-2">Status Check Failed</p>
                  <p className="text-gray-400 text-sm mb-6">{statusModal.error}</p>
                </>
              )}

              {statusModal.data && (
                <>
                  {(() => {
                    const statusInfo = getStatusIcon(statusModal.data.orderStatus);
                    return (
                      <>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${statusInfo.bg} mb-4`}>
                          <div className={statusInfo.color}>{statusInfo.icon}</div>
                        </div>
                        <p className="text-white font-semibold mb-2">Order Status</p>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusModal.data.orderStatus.charAt(0).toUpperCase() + statusModal.data.orderStatus.slice(1)}
                        </div>
                        <p className="text-gray-500 text-xs mt-4 font-mono">Ref: {statusModal.reference}</p>
                      </>
                    );
                  })()}
                </>
              )}
            </div>

            <button
              onClick={closeModal}
              className="w-full mt-6 px-4 py-3 bg-gray-900/50 border border-gray-700 hover:bg-gray-900/70 hover:border-gray-600 text-gray-300 rounded-xl transition-all duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrdersHistory;