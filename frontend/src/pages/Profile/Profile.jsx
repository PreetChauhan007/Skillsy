import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Edit, Save, X, Plus, Trash2, MapPin, Clock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    availability: 'available',
    isPublic: true,
    skillsOffered: [],
    skillsWanted: [],
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        location: user.location || '',
        availability: user.availability,
        isPublic: user.isPublic,
        skillsOffered: [...user.skillsOffered],
        skillsWanted: [...user.skillsWanted],
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Only send skill IDs to backend
     const payload = {
  ...formData,
  skillsOffered: formData.skillsOffered,
  skillsWanted: formData.skillsWanted,
};
      await updateProfile(payload);
      // Fetch latest skills and user profile after update
      
      
      setIsEditing(false);
    } catch (error) {
      // Error is handled in the context
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        location: user.location || '',
        availability: user.availability,
        isPublic: user.isPublic,
        skillsOffered: [...user.skillsOffered],
        skillsWanted: [...user.skillsWanted],
      });
    }
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
      setFormData({
        ...formData,
        skillsOffered: [...formData.skillsOffered, newSkillOffered.trim()],
      });
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !formData.skillsWanted.includes(newSkillWanted.trim())) {
      setFormData({
        ...formData,
        skillsWanted: [...formData.skillsWanted, newSkillWanted.trim()],
      });
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (index) => {
    setFormData({
      ...formData,
      skillsOffered: formData.skillsOffered.filter((_, i) => i !== index),
    });
  };

  const removeSkillWanted = (index) => {
    setFormData({
      ...formData,
      skillsWanted: formData.skillsWanted.filter((_, i) => i !== index),
    });
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

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 shadow-xl rounded-2xl border border-neutral-800">
          <div className="px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile</h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-5 py-2 border border-emerald-500 text-sm font-semibold rounded-xl text-emerald-400 bg-transparent hover:bg-emerald-500/10 transition-colors shadow"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-5 py-2 border border-gray-600 text-sm font-semibold rounded-xl text-gray-300 bg-transparent hover:bg-gray-700 transition-colors shadow"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-1">
                <div className="bg-neutral-800 rounded-2xl p-8 shadow border border-neutral-700">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-white text-3xl font-extrabold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full text-center text-2xl font-bold bg-neutral-700 text-white border border-neutral-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    )}
                    <p className="text-gray-400 mt-1">{user.email}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex flex-col gap-4">
                      {/* Location Field */}
                      <div className="flex items-center">
                        {isEditing ? (
                          <div className="flex items-center bg-neutral-900 rounded-full px-4 py-2 border border-emerald-700 shadow-sm">
                            <MapPin className="h-5 w-5 text-emerald-400 mr-2" />
                            <input
                              type="text"
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              placeholder="Location"
                              className="bg-transparent text-white border-none focus:ring-0 px-0 py-0 placeholder-gray-400 w-20 min-w-0"
                              style={{ minWidth: '60px', width: `${Math.max(6, formData.location.length)}ch` }}
                            />
                          </div>
                        ) : (
                          <span className="flex items-center bg-neutral-900 rounded-full px-4 py-2 border border-emerald-700 shadow-sm text-white font-medium">
                            <MapPin className="h-5 w-5 text-emerald-400 mr-2" />
                            {user.location || 'No location set'}
                          </span>
                        )}
                      </div>
                      {/* Availability Field */}
                      <div className="flex items-center">
                        {isEditing ? (
                          <div className="flex items-center bg-neutral-900 rounded-full px-4 py-2 border border-emerald-700 shadow-sm">
                            <Clock className="h-5 w-5 text-emerald-400 mr-2" />
                            <select
                              value={formData.availability}
                              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                              className="bg-transparent text-emerald-400 font-semibold border-none focus:ring-0 px-0 py-0"
                            >
                              <option value="available" className="text-emerald-400 bg-neutral-900">Available</option>
                              <option value="busy" className="text-yellow-400 bg-neutral-900">Busy</option>
                              <option value="offline" className="text-gray-400 bg-neutral-900">Offline</option>
                            </select>
                          </div>
                        ) : (
                          <span className={`flex items-center bg-neutral-900 rounded-full px-4 py-2 border border-emerald-700 shadow-sm text-emerald-400 font-semibold`}>
                            <Clock className="h-5 w-5 text-emerald-400 mr-2" />
                            {user.availability
                              ? user.availability.charAt(0).toUpperCase() + user.availability.slice(1)
                              : 'Unknown'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      {formData.isPublic ? <Eye className="h-5 w-5 text-gray-400 mr-3" /> : <EyeOff className="h-5 w-5 text-gray-400 mr-3" />}
                      {isEditing ? (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.isPublic}
                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                            className="mr-2 rounded border-gray-500 bg-gray-600 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-gray-300">Public Profile</span>
                        </label>
                      ) : (
                        <span className="text-gray-300">{user.isPublic ? 'Public Profile' : 'Private Profile'}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-600">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">{user.rating.toFixed(1)}</div>
                      <div className="text-sm text-gray-400">Average Rating</div>
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-lg font-semibold text-white">{user.totalSwaps}</div>
                      <div className="text-sm text-gray-400">Total Swaps</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="lg:col-span-2 space-y-6">
                {/* Skills Offered */}
                <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Skills I Offer</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skillsOffered.map((skill, index) => (
                      <div key={index} className="flex items-center bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm">
                        <span>{skill}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeSkillOffered(index)}
                            className="ml-2 text-emerald-400 hover:text-emerald-300"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2 mt-2">
                      <input
                        type="text"
                        value={newSkillOffered}
                        onChange={(e) => setNewSkillOffered(e.target.value)}
                        placeholder="Add a skill you offer"
                        className="flex-1 bg-neutral-800 text-white border border-emerald-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 shadow"
                        onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                      />
                      <button
                        onClick={addSkillOffered}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow"
                        title="Add Skill"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Skills Wanted */}
                <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Skills I Want to Learn</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skillsWanted.map((skill, index) => (
                      <div key={index} className="flex items-center bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm">
                        <span>{skill}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeSkillWanted(index)}
                            className="ml-2 text-blue-400 hover:text-blue-300"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2 mt-2">
                      <input
                        type="text"
                        value={newSkillWanted}
                        onChange={(e) => setNewSkillWanted(e.target.value)}
                        placeholder="Add a skill you want to learn"
                        className="flex-1 bg-neutral-800 text-white border border-blue-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow"
                        onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                      />
                      <button
                        onClick={addSkillWanted}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow"
                        title="Add Skill"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;