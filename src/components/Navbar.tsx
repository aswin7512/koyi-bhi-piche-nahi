import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { LogOut, User as UserIcon, Settings, Menu, X } from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Koyi Bhi Piche Nahi</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2">Dashboard</Link>
                <Link to="/games" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2">Games</Link>
                
                {/* Profile Dropdown / Link */}
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => navigate('/profile-settings')}
                  >
                    {/* --- CONDITIONAL AVATAR RENDERING --- */}
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={onLogout} 
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2 shadow-lg">
          {user ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg mb-4 cursor-pointer" onClick={() => {navigate('/profile-settings'); setIsMenuOpen(false);}}>
                {/* --- MOBILE AVATAR --- */}
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-indigo-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </div>
              </div>
              <Link to="/dashboard" className="block p-3 rounded-lg hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/games" className="block p-3 rounded-lg hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Games</Link>
              <Link to="/profile-settings" className="block p-3 rounded-lg hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Settings</Link>
              <button onClick={onLogout} className="w-full text-left p-3 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}><Button fullWidth variant="outline">Login</Button></Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}><Button fullWidth>Get Started</Button></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};