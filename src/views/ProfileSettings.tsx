import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '../types';
import { Button } from '../components/Button';
import { Save, User as UserIcon, BookOpen, Phone, AlertCircle, Loader2, Camera, Lock, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileSettingsProps {
  user: User;
  onProfileUpdate: () => void;
}

// --- HELPER: Check if profile is 100% ready ---
const isProfileFullyComplete = (data: any) => {
  return !!(
    data.full_name && 
    data.school && 
    data.class_grade && 
    data.gender && 
    data.dob && 
    data.parent_contact && 
    data.address
  );
};

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onProfileUpdate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); 
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- PASSWORD STATE ---
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // --- PROFILE FORM STATE ---
  const [formData, setFormData] = useState({
    full_name: '',
    school: '',
    class_grade: '',
    gender: '',
    dob: '',
    blood_group: '',
    parent_contact: '',
    address: '',
    avatar_url: '',
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.name || '',
        school: user.school || '',
        class_grade: user.class_grade || '',
        gender: user.gender || '',
        dob: user.dob || '',
        blood_group: user.blood_group || '',
        parent_contact: user.parent_contact || '',
        address: user.address || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user]);

  const calculateProgress = () => {
    const requiredFields = { ...formData };
    delete (requiredFields as any).avatar_url; 
    const fields = Object.values(requiredFields);
    const filled = fields.filter(f => f && f.toString().trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // --- 1. HANDLE AVATAR UPLOAD ---
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setMessage({ type: '', text: '' });

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData({ ...formData, avatar_url: publicUrl });
      setMessage({ type: 'success', text: 'Photo uploaded! Remember to click Save below.' });

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  // --- 2. HANDLE PROFILE SAVE ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          school: formData.school,
          class_grade: formData.class_grade,
          gender: formData.gender,
          dob: formData.dob,
          blood_group: formData.blood_group,
          parent_contact: formData.parent_contact,
          address: formData.address,
          avatar_url: formData.avatar_url,
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      onProfileUpdate(); // Update App.tsx state

      // --- NEW: AUTO REDIRECT IF COMPLETE ---
      // This sends them back to dashboard if they have filled everything in
      if (isProfileFullyComplete(formData)) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500); // 1.5 second delay so they can read "Success"
      }

    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // --- 3. HANDLE PASSWORD CHANGE ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassLoading(true);
    setPassMessage({ type: '', text: '' });

    // Basic Validation
    if (passwordForm.newPassword.length < 6) {
      setPassLoading(false);
      return setPassMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPassLoading(false);
      return setPassMessage({ type: 'error', text: 'New passwords do not match.' });
    }

    try {
      // A. Verify Old Password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordForm.currentPassword
      });

      if (signInError) {
        throw new Error("Current password is incorrect.");
      }

      // B. Update to New Password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (updateError) throw updateError;

      setPassMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (err: any) {
      setPassMessage({ type: 'error', text: err.message });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">Manage your personal information and security</p>
        </div>
        <div className="w-full md:w-64">
           <div className="flex justify-between text-xs mb-1">
             <span className="font-medium text-gray-600">Profile Completion</span>
             <span className={`font-bold ${calculateProgress() === 100 ? 'text-green-600' : 'text-indigo-600'}`}>
               {calculateProgress()}%
             </span>
           </div>
           <div className="bg-gray-200 rounded-full h-2 w-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${calculateProgress() === 100 ? 'bg-green-500' : 'bg-indigo-600'}`} 
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* ================= FORM 1: PROFILE DETAILS ================= */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* Avatar Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-indigo-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden relative">
                {uploading ? (
                  <Loader2 className="animate-spin text-indigo-600" size={32} />
                ) : formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="text-indigo-300" size={48} />
                )}
                {uploading && <div className="absolute inset-0 bg-black/30 z-10" />}
              </div>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-sm">
                <Camera size={18} />
                <input type="file" id="avatar-upload" accept="image/*" onChange={uploadAvatar} disabled={uploading} className="hidden" />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Profile Photo</h2>
              <p className="text-gray-500 text-sm">Upload a clear photo of yourself. Max size 2MB.</p>
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
              <UserIcon className="text-indigo-600" size={20} /> Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="full_name" value={formData.full_name} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select name="blood_group" value={formData.blood_group} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" required>
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Info Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
              <BookOpen className="text-indigo-600" size={20} /> Academic Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input name="school" value={formData.school} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class / Grade</label>
                <input name="class_grade" value={formData.class_grade} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" placeholder="e.g. 5-B" required />
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Phone className="text-indigo-600" size={20} /> Contact Details
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent's Contact Number</label>
                <input type="tel" name="parent_contact" value={formData.parent_contact} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" required placeholder="+91..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="input-field w-full p-2 border rounded-lg" required />
              </div>
            </div>
          </div>

          {/* Profile Message */}
          {message.text && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              <AlertCircle size={20} />
              {message.text}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading} className="px-8">
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
              Save Profile Info
            </Button>
          </div>
        </form>

        {/* ================= FORM 2: SECURITY (CHANGE PASSWORD) ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Lock className="text-indigo-600" size={20} /> Security & Password
          </h2>
          
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <Key size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="password" 
                    name="currentPassword" 
                    value={passwordForm.currentPassword} 
                    onChange={handlePasswordChangeInput} 
                    className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Enter current password"
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                   <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                   <input 
                    type="password" 
                    name="newPassword" 
                    value={passwordForm.newPassword} 
                    onChange={handlePasswordChangeInput} 
                    className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Min 6 characters"
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                 <div className="relative">
                   <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                   <input 
                    type="password" 
                    name="confirmPassword" 
                    value={passwordForm.confirmPassword} 
                    onChange={handlePasswordChangeInput} 
                    className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Retype new password"
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Password Message */}
            {passMessage.text && (
              <div className={`p-4 rounded-lg flex items-center gap-2 ${passMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                <AlertCircle size={20} />
                {passMessage.text}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={passLoading} className="bg-gray-900 hover:bg-gray-800">
                {passLoading ? <Loader2 className="animate-spin mr-2" /> : <Lock className="mr-2" size={16} />}
                Update Password
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};