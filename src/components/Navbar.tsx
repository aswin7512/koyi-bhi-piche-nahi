import React from 'react';
import { User } from '../types';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="font-bold text-xl text-gray-800 tracking-tight">Koyi Bhi Piche Nahi</span>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
             {user && (
               <>
                <span className="text-gray-600 text-sm">
                  Welcome, <span className="font-semibold text-gray-900">{user.name}</span>
                </span>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wide">
                  {user.role}
                </span>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
               </>
             )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && user && (
        <div className="sm:hidden bg-gray-50 border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1 px-4">
             <div className="flex items-center gap-3 mb-3">
               <div className="bg-indigo-100 p-2 rounded-full">
                 <UserIcon size={20} className="text-indigo-600"/>
               </div>
               <div>
                 <div className="font-medium text-gray-800">{user.name}</div>
                 <div className="text-sm text-gray-500">{user.email}</div>
               </div>
             </div>
             <button
               onClick={onLogout}
               className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
             >
               <LogOut size={16} /> Logout
             </button>
          </div>
        </div>
      )}
    </nav>
  );
};