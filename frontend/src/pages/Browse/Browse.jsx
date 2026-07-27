import React, { useState, useEffect, useContext } from 'react';
import { usersAPI, swapsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Search, MapPin, Star, MessageCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Browse = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapForm, setSwapForm] = useState({
    offeredSkill: '',
    requestedSkill: '',
    message: '',
  });

  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Searching users with query:', searchQuery);
        const response = await usersAPI.searchUsers(searchQuery);
        console.log('Search response:', response.data);
        let usersArray = [];
        if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
          usersArray = response.data.data.data;
        }
        // Filter out the current user by _id or id
        if (user && user._id) {
          usersArray = usersArray.filter(u => u._id !== user._id && u.id !== user._id);
        } else if (user && user.id) {
          usersArray = usersArray.filter(u => u._id !== user.id && u.id !== user.id);
        }
        // Filter out admin users
        usersArray = usersArray.filter(u => !u.isAdmin);
        setUsers(usersArray);
      } catch (error) {
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchQuery, user]);

  const handleSwapRequest = async () => {
    if (!selectedUser || !swapForm.offeredSkill || !swapForm.requestedSkill) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await swapsAPI.createSwapRequest({
        targetUserId: selectedUser._id,
        offeredSkill: swapForm.offeredSkill,
        requestedSkill: swapForm.requestedSkill,
        message: swapForm.message,
      });
      toast.success('Swap request sent successfully!');
      setShowSwapModal(false);
      setSwapForm({ offeredSkill: '', requestedSkill: '', message: '' });
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send swap request');
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available':
        return 'text-emerald-400 bg-emerald-400/10';
      case 'busy':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'offline':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Browse Users</h1>
          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Filter by skill..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl hover:shadow-emerald-900/30 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white tracking-tight">{user.name}</h3>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-emerald-400" />
                      <span>{user.location || 'Location not set'}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getAvailabilityColor(user.availability)} border-current shadow-sm`}>
                    {user.availability}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white font-bold">{user.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm ml-2">({user.totalSwaps} swaps)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">Skills Offered</h4>

                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs bg-emerald-600/20 text-emerald-300 px-3 py-1 rounded-full font-medium border border-emerald-700/30 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skillsOffered.length > 3 && (
                      <span className="text-xs text-gray-400">+{user.skillsOffered.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wide">Skills Wanted</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full font-medium border border-blue-700/30 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skillsWanted.length > 3 && (
                      <span className="text-xs text-gray-400">+{user.skillsWanted.length - 3} more</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowSwapModal(true);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mt-2"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Request Swap
                </button>
              </div>
            ))}
          </div>
        )}

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No users found matching your criteria.</p>
          </div>
        )}

        {/* Swap Request Modal */}
        {showSwapModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-900 rounded-2xl p-8 w-full max-w-md border border-neutral-800 shadow-2xl">
              <h3 className="text-2xl font-extrabold text-white mb-6 tracking-tight">
                Request Skill Swap with <span className="text-emerald-400">{selectedUser.name}</span>
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-emerald-400 mb-2">
                    Skill you want to offer
                  </label>
                  <input
                    type="text"
                    value={swapForm.offeredSkill}
                    onChange={(e) => setSwapForm({ ...swapForm, offeredSkill: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-emerald-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 shadow"
                    placeholder="e.g., Web Development"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-400 mb-2">
                    Skill you want to learn
                  </label>
                  <select
                    value={swapForm.requestedSkill}
                    onChange={(e) => setSwapForm({ ...swapForm, requestedSkill: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-emerald-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow"
                  >
                    <option value="">Select a skill...</option>
                    {selectedUser.skillsOffered.map((skill, index) => (
                      <option key={index} value={skill} className="bg-neutral-900 text-white">
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-400 mb-2">
                    Message <span className="text-neutral-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={swapForm.message}
                    onChange={(e) => setSwapForm({ ...swapForm, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-800 border border-emerald-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 shadow"
                    placeholder="Tell them why you'd like to swap skills..."
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handleSwapRequest}
                  className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow"
                >
                  Send Request
                </button>
                <button
                  onClick={() => {
                    setShowSwapModal(false);
                    setSelectedUser(null);
                    setSwapForm({ offeredSkill: '', requestedSkill: '', message: '' });
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

export default Browse;