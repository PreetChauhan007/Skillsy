import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { swapsAPI, feedbackAPI } from '../../services/api';
import { Clock, CheckCircle, XCircle, MessageCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Swaps = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const {user} = useAuth();
  const navigate = useNavigate();
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    fetchSwaps();
  }, [activeTab]);

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const response = activeTab === 'sent' 
        ? await swapsAPI.getMySwapRequests()
        : await swapsAPI.getReceivedSwapRequests();
      setSwaps(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      toast.error('Failed to fetch swap requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapAction = async (swapId, status) => {
    try {
      await swapsAPI.updateSwapStatus(swapId, status);
      toast.success(`Swap ${status} successfully`);
      fetchSwaps();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${status} swap`);
    }
  };

const handleFeedbackSubmit = async () => {
  if (!selectedSwap || !user) return;

  const payload = {
    swapRequest: selectedSwap._id || selectedSwap.id,
    toUser:
      activeTab === 'sent'
        ? (selectedSwap.targetUserId || selectedSwap.targetUser?._id || selectedSwap.targetUser?.id)
        : (selectedSwap.requesterId || selectedSwap.requester?._id || selectedSwap.requester?.id),
    rating: feedbackForm.rating,
    comment: feedbackForm.comment,
  };

  console.log('Submitting feedback payload:', payload);

  try {
    await feedbackAPI.submitFeedback(payload);
    // Mark swap as completed
    await swapsAPI.updateSwapStatus(selectedSwap._id, 'completed');
    toast.success('Feedback submitted successfully!');
    setShowFeedbackModal(false);
    setFeedbackForm({ rating: 5, comment: '' });
    setSelectedSwap(null);
    fetchSwaps();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to submit feedback');
  }
};
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'accepted':
        return 'text-blue-400 bg-blue-400/10';
      case 'completed':
        return 'text-emerald-400 bg-emerald-400/10';
      case 'rejected':
        return 'text-red-400 bg-red-400/10';
      case 'cancelled':
        return 'text-gray-400 bg-gray-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'accepted':
      case 'completed':
        return CheckCircle;
      case 'rejected':
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Skill Swaps</h1>
          {/* Tab Navigation */}
          <div className="border-b border-neutral-800">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('received')}
                className={`py-2 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'received'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Received Requests
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-2 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'sent'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Sent Requests
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {swaps.map((swap) => {
              const StatusIcon = getStatusIcon(swap.status);
              return (
                <div key={swap._id} className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <StatusIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className={`px-4 py-1 rounded-full text-xs font-bold border ${getStatusColor(swap.status)} border-current shadow-sm`}>
                          {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center text-lg">
                          <span className="text-emerald-300 font-semibold">{swap.offeredSkill}</span>
                          <span className="text-gray-500 mx-2">↔</span>
                          <span className="text-blue-300 font-semibold">{swap.requestedSkill}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          {activeTab === 'sent' ? 'Requested from' : 'Requested by'}: {
                            activeTab === 'sent' 
                              ? swap.targetUser?.name || 'Unknown User'
                              : swap.requester?.name || 'Unknown User'
                          }
                        </p>
                      </div>

                      {swap.message && (
                        <div className="mb-4 p-3 bg-neutral-800 rounded-xl border border-neutral-700">
                          <p className="text-gray-300 text-sm">{swap.message}</p>
                        </div>
                      )}

                      <p className="text-gray-400 text-sm">
                        {new Date(swap.createdAt).toLocaleDateString()} at {new Date(swap.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      {activeTab === 'received' && swap.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleSwapAction(swap._id, 'accepted')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleSwapAction(swap._id, 'rejected')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {swap.status === 'accepted' && (
                        <>
                          <button
                            onClick={() => navigate(`/chat/${swap._id}`)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSwap(swap);
                              setShowFeedbackModal(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Complete & Rate
                          </button>
                        </>
                      )}

                      {activeTab === 'sent' && swap.status === 'pending' && (
                        <button
                          onClick={() => handleSwapAction(swap._id, 'cancelled')}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {swaps.length === 0 && !loading && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {activeTab === 'received' 
                ? 'No swap requests received yet.' 
                : 'No swap requests sent yet.'}
            </p>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && selectedSwap && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-900 rounded-2xl p-8 w-full max-w-md border border-neutral-800 shadow-2xl">
              <h3 className="text-2xl font-extrabold text-white mb-6 tracking-tight">
                Complete Swap & <span className="text-emerald-400">Leave Feedback</span>
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-emerald-400 mb-2">
                    Rating (1-5 stars)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                        className={`p-1 rounded-full border-2 ${
                          star <= feedbackForm.rating 
                            ? 'text-yellow-400 border-yellow-400 bg-yellow-400/10' 
                            : 'text-gray-600 border-neutral-700 bg-neutral-800'
                        } transition-colors`}
                        title={`${star} Star${star > 1 ? 's' : ''}`}
                      >
                        <Star className="h-7 w-7 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-400 mb-2">
                    Comment <span className="text-neutral-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={feedbackForm.comment}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-800 border border-emerald-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 shadow"
                    placeholder="Share your experience..."
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handleFeedbackSubmit}
                  className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow"
                >
                  Submit Feedback
                </button>
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedSwap(null);
                    setFeedbackForm({ rating: 5, comment: '' });
                  }}
                  className="flex-1 bg-neutral-800 text-white px-4 py-3 rounded-lg font-bold border border-neutral-700 hover:bg-neutral-900 transition-colors shadow"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Swaps;
