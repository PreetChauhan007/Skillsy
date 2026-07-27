import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { swapsAPI, authAPI } from '../../services/api';
import { Users, MessageCircle, Star, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [latestUser, setLatestUser] = useState(user);
  const [stats, setStats] = useState({
    totalSwaps: 0,
    pendingRequests: 0,
    completedSwaps: 0,
    averageRating: 0,
  });
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Always fetch latest user profile
      const userRes = await authAPI.getProfile();
      console.log('Profile API response:', userRes.data);
      const freshUser = userRes.data.data || userRes.data.user || userRes.data || null;
      setLatestUser(freshUser);

      const [sentSwaps, receivedSwaps] = await Promise.all([
        swapsAPI.getMySwapRequests(),
        swapsAPI.getReceivedSwapRequests(),
      ]);
      console.log('Sent swaps:', sentSwaps.data);
      console.log('Received swaps:', receivedSwaps.data);
      // Fallback to .data.data if .data is not an array
      const sentSwapsArr = Array.isArray(sentSwaps.data) ? sentSwaps.data : sentSwaps.data?.data || [];
      const receivedSwapsArr = Array.isArray(receivedSwaps.data) ? receivedSwaps.data : receivedSwaps.data?.data || [];
      const allSwaps = [...sentSwapsArr, ...receivedSwapsArr];
      const pendingRequests = allSwaps.filter(swap => swap.status === 'pending').length;
      const completedSwaps = allSwaps.filter(swap => swap.status === 'completed').length;

      setStats({
        totalSwaps: freshUser?.totalSwaps || 0,
        pendingRequests,
        completedSwaps,
        averageRating: freshUser?.rating || 0,
      });

      // Get recent swaps (last 5)
      const sortedSwaps = allSwaps
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentSwaps(sortedSwaps);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Welcome back, <span className="text-emerald-400">{latestUser?.name}</span>!</h1>
          <p className="mt-2 text-neutral-400 text-lg">Here's an overview of your skill swapping activity.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Swaps */}
          <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl transition hover:shadow-emerald-900/30">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-emerald-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Total Swaps</h3>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.totalSwaps}</p>
              </div>
            </div>
          </div>
          {/* Pending Requests */}
          <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl transition hover:shadow-yellow-900/30">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-7 w-7 text-yellow-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wide">Pending</h3>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
          {/* Completed Swaps */}
          <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl transition hover:shadow-blue-900/30">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Completed</h3>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.completedSwaps}</p>
              </div>
            </div>
          </div>
          {/* Average Rating */}
          <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl transition hover:shadow-purple-900/30">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Star className="h-7 w-7 text-purple-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Avg. Rating</h3>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Skills Offered */}
          <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center tracking-tight">
              <Users className="h-5 w-5 text-emerald-400 mr-2" />
              Skills You Offer
            </h3>
            <div className="flex flex-wrap gap-2">
              {latestUser?.skillsOffered?.length ? (
                latestUser.skillsOffered.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-emerald-600/20 text-emerald-300 px-4 py-1 rounded-full text-sm font-medium shadow-sm border border-emerald-700/30"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No skills added yet. Add skills to start swapping!</p>
              )}
            </div>
          </div>
          {/* Skills Wanted */}
          <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center tracking-tight">
              <MessageCircle className="h-5 w-5 text-blue-400 mr-2" />
              Skills You Want
            </h3>
            <div className="flex flex-wrap gap-2">
              {latestUser?.skillsWanted?.length ? (
                latestUser.skillsWanted.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-600/20 text-blue-300 px-4 py-1 rounded-full text-sm font-medium shadow-sm border border-blue-700/30"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No skills wanted yet. Add skills you'd like to learn!</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 tracking-tight">Recent Swap Activity</h3>
          {recentSwaps.length > 0 ? (
            <div className="space-y-4">
              {recentSwaps.map((swap) => (
                <div key={swap._id} className="flex items-center justify-between p-4 bg-neutral-800/80 rounded-xl border border-neutral-700">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-300 font-semibold">{swap.offeredSkill}</span>
                      <span className="text-gray-500">↔</span>
                      <span className="text-blue-300 font-semibold">{swap.requestedSkill}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(swap.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-xs font-bold border ${getStatusColor(swap.status)} border-current shadow-sm`}> 
                    {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No recent swap activity.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;