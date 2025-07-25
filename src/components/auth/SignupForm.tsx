import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { signup, loading, error } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const result = await signup(formData.email, formData.password, formData.fullName);
    
    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: 'Account created successfully! You can now log in.' 
      });
      // Switch to login mode after successful registration
      setTimeout(() => {
        onSwitchToLogin();
        setFormData({ email: formData.email, password: '', fullName: '' });
      }, 2000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Signup failed' });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-2xl">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg tracking-tight text-[#17497A]">
        Create Account
      </h2>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed text-[#17497A]">
        Join us to start building your AI-powered business strategy.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-3 text-sm uppercase tracking-wide">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Your full name"
              className="w-full pl-10 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 font-medium transition-all duration-300 hover:border-gray-300"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-3 text-sm uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="w-full pl-10 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 font-medium transition-all duration-300 hover:border-gray-300"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-3 text-sm uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              className="w-full pl-10 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 font-medium transition-all duration-300 hover:border-gray-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {message && (
          <div className={`p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <span>{message.text}</span>
          </div>
        )}
        
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>{error}</span>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-sky-400 to-blue-300 text-[#102A43] font-extrabold px-8 py-4 rounded-xl hover:from-sky-500 hover:to-blue-400 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 font-semibold underline"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
} 