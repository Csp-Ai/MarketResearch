import React, { useState } from 'react';
import { Home, Briefcase, Users, User, LogOut, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <Home />, path: '/dashboard' },
  { label: 'Business Vault', icon: <Briefcase />, path: '/business' },
  { label: 'Agents', icon: <Users />, path: '/agents' },
  { label: 'Profile', icon: <User />, path: '/profile' },
];

export default function Sidebar({ onLogout }: { onLogout?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="mb-10 flex items-center space-x-2">
          <img src="https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//CheersMaitLogo.png" alt="Logo" className="h-10 w-10 rounded object-cover" />
          <span className="font-bold text-xl text-blue-800">My AI Team</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                location.pathname.startsWith(item.path) ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={onLogout}
          className="mt-10 flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
} 