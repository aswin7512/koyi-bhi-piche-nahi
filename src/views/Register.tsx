import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/Button';
import { UserCircle, Key, User, Mail, Users } from 'lucide-react';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student', 
    studentEmail: '',
  });
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // 1. Sign up AND Send Data (Database Trigger handles the saving)
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
            student_email: formData.studentEmail // <--- Trigger reads this!
          },
        },
      });

      // 2. Handle Errors
      if (authError) {
        if (authError.message.includes("already registered") || authError.status === 400) {
           setError("User already exists. Please sign in instead.");
        } else {
           setError(authError.message);
        }
        setLoading(false);
        return; 
      }

      // 3. Success
      if (data.user) {
        if (!data.session) {
          setSuccessMessage("Registration successful! Please check your email.");
        } else {
          // OPTIONAL BACKUP: Try to update locally just in case Trigger failed
          // But usually, we can just redirect now.
          alert('Registration successful!');
          navigate('/dashboard');
        }
      }

    } catch (err: any) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us and start your journey today.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
            
            {/* Full Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircle className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="fullName"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password (Min 6 characters)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Role Selection */}
            <div className="relative">
               <label className="block text-sm font-medium text-gray-700 mb-1">I am a:</label>
               <select
                 name="role"
                 value={formData.role}
                 onChange={handleChange}
                 className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
               >
                 <option value="student">Student</option>
                 <option value="parent">Parent</option>
                 <option value="teacher">Teacher</option>
               </select>
            </div>

            {/* <--- NEW SECTION: Only shows if 'Parent' is selected */}
            {formData.role === 'parent' && (
              <div className="relative animate-fade-in mt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  name="studentEmail"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border-2 border-indigo-100 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your Student's Email"
                  value={formData.studentEmail}
                  onChange={handleChange}
                />
                <p className="text-xs text-indigo-600 mt-1 ml-1">
                  * We will link your account to this student for progress tracking.
                </p>
              </div>
            )}

          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative text-center text-sm">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-center text-sm">
              {error}
            </div>
          )}

          <div>
            <Button type="submit" fullWidth disabled={loading || !!successMessage}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </div>
          
          <div className="text-center mt-4">
             <p className="text-sm text-gray-600">
               Already have an account?{' '}
               <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                 Sign in
               </Link>
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};