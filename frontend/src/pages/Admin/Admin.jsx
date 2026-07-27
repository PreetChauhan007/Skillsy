import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI, usersAPI, swapsAPI, feedbackAPI } from '../../services/api';
import { Shield, Users, MessageCircle, Star, Ban, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [adminActions, setAdminActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageForm, setMessageForm] = useState({ title: '', message: '' });
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchData();
    }
  }, [activeTab, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          const usersResponse = await usersAPI.searchUsers();
          setUsers(Array.isArray(usersResponse.data.data?.data) ? usersResponse.data.data.data : []);
          break;
        case 'swaps':
          const swapsResponse = await swapsAPI.getAllSwaps();
          setSwaps(Array.isArray(swapsResponse.data.data) ? swapsResponse.data.data : []);
          break;
        case 'feedback':
          const feedbackResponse = await feedbackAPI.getAllFeedback();
          setFeedbacks(Array.isArray(feedbackResponse.data.data) ? feedbackResponse.data.data : []);
          break;
        case 'actions':
          const actionsResponse = await adminAPI.getAdminActions();
          setAdminActions(Array.isArray(actionsResponse.data.data) ? actionsResponse.data.data : []);
          break;
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      if (isBanned) {
        await adminAPI.unbanUser(userId);
        toast.success('User unbanned successfully');
      } else {
        await adminAPI.banUser(userId);
        toast.success('User banned successfully');
      }
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleSendMessage = async () => {
    if (!messageForm.title || !messageForm.message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await adminAPI.sendPlatformMessage(messageForm);
      toast.success('Platform message sent successfully');
      setShowMessageModal(false);
      setMessageForm({ title: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold text-white flex items-center tracking-tight">
              <Shield className="h-8 w-8 text-emerald-400 mr-3" />
              Admin Panel
            </h1>
            <button
              onClick={() => setShowMessageModal(true)}
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold shadow"
            >
              Send Platform Message
            </button>
          </div>
          {/* Tab Navigation */}
          <div className="mt-6 border-b border-neutral-800">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'users', label: 'Users', icon: Users },
                { key: 'swaps', label: 'Swaps', icon: MessageCircle },
                { key: 'feedback', label: 'Feedback', icon: Star },
                { key: 'actions', label: 'Actions', icon: Shield },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-2 px-1 border-b-2 font-semibold text-sm flex items-center transition-colors ${
                    activeTab === key
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-gray-400 hover:text-emerald-300 hover:border-emerald-500'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div>
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Banned Users Section */}
                {users.filter(u => u.isBanned).length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-red-400 mb-4">Banned Users</h2>
                    {users.filter(user => user.isBanned).map((user) => (
                      <div key={user._id} className="bg-neutral-900 rounded-2xl p-6 border border-red-600 shadow-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-neutral-800 border-2 border-red-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                              <span className="text-red-400 font-bold text-xl">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white tracking-tight">{user.name}</h3>
                              <p className="text-gray-400">{user.email}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-gray-400">
                                  {user.totalSwaps} swaps | {user.rating.toFixed(1)} rating
                                </span>
                                {user.isAdmin && (
                                  <span className="px-2 py-1 bg-emerald-600/20 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-700/30 shadow-sm">
                                    Admin
                                  </span>
                                )}
                                <span className="px-2 py-1 bg-red-600/20 text-red-300 rounded-full text-xs font-semibold border border-red-700/30 shadow-sm">
                                  Banned
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBanUser(user._id, true)}
                            className="px-5 py-2 rounded-xl font-semibold shadow bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Unban
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Active Users Section */}
                {users.filter(u => !u.isBanned).length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-emerald-400 mb-4">Active Users</h2>
                    {users.filter(user => !user.isBanned).map((user) => (
                      <div key={user._id} className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                              <span className="text-white font-bold text-xl">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white tracking-tight">{user.name}</h3>
                              <p className="text-gray-400">{user.email}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-gray-400">
                                  {user.totalSwaps} swaps | {user.rating.toFixed(1)} rating
                                </span>
                                {user.isAdmin && (
                                  <span className="px-2 py-1 bg-emerald-600/20 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-700/30 shadow-sm">
                                    Admin
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBanUser(user._id, false)}
                            className="px-5 py-2 rounded-xl font-semibold shadow bg-red-600 hover:bg-red-700 text-white"
                          >
                            Ban
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'swaps' && (
              <div className="space-y-6">
                {swaps.map((swap) => (
                  <div key={swap._id} className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">
                          Swap between {swap.requester?.name || 'Unknown'} &amp; {swap.targetUser?.name || 'Unknown'}
                        </h3>
                        <p className="text-gray-400">Status: {swap.status}</p>
                        <p className="text-gray-400">
                          Skills: {swap.offeredSkill?.name || 'Unknown'} ↔ {swap.requestedSkill?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                {feedbacks.map((fb) => (
                  <div key={fb._id} className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {fb.fromUser?.name || 'Unknown'} → {fb.toUser?.name || 'Unknown'}
                      </h3>
                      <p className="text-gray-400">Rating: {fb.rating}</p>
                      <p className="text-gray-400">{fb.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'actions' && (
              <div className="space-y-6">
                {adminActions.map((action) => (
                  <div key={action._id} className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {action.admin?.name || 'Unknown'} ({action.admin?.email || 'Unknown'})
                      </h3>
                      <p className="text-gray-400 capitalize">Action: {action.actionType.replace('_', ' ')}</p>
                      {action.targetUser && (
                        <p className="text-gray-400">
                          Target User: {action.targetUser.name} ({action.targetUser.email})
                        </p>
                      )}
                      <p className="text-gray-400">Description: {action.description}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(action.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {adminActions.length === 0 && (
                  <div className="text-gray-400 text-center py-8">No admin actions found.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Platform Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Send Platform Message
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Title:
                  </label>
                  <input
                    type="text"
                    value={messageForm.title}
                    onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Message title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Message:
                  </label>
                  <textarea
                    value={messageForm.message}
                    onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Platform-wide message content"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSendMessage}
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Send Message
                </button>
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageForm({ title: '', message: '' });
                  }}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
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

export default Admin;