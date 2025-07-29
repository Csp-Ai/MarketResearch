import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';

interface HeaderProps {
  showAuthButtons?: boolean;
}

export default function Header({ showAuthButtons = false }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowProfileDropdown(false);
  };

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleRequestDemo = () => {
    navigate('/demo-request');
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <nav className="bg-dark-800 fixed w-full z-50 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img 
              src="https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//CheersMaitLogo.png" 
              alt="CheersMait Logo" 
              className="h-16 w-16 rounded object-cover" 
            />
          </div>
          {showAuthButtons && (
            <div className="flex items-center space-x-8">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors focus:outline-none"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {user.full_name || user.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-700 rounded-md shadow-lg py-1 z-50 border border-gray-600">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                        <div className="font-medium">{user.full_name || 'User'}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-600 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleGetStarted}
                    className="text-white font-semibold px-4 py-2 rounded-lg text-sm md:px-6 md:py-3 md:rounded-full md:text-base hover:text-blue-300 transition-all duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleRequestDemo}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm md:px-6 md:py-3 md:rounded-lg md:text-base hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Request Demo
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 