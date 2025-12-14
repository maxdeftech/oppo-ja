import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  Menu,
  X,
  Briefcase,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Search,
  Building2,
  FileText
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentPage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'jobs', label: 'Find Jobs', icon: Search, roles: [UserRole.JOB_SEEKER, UserRole.FREELANCER, null] },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.JOB_SEEKER, UserRole.BUSINESS, UserRole.FREELANCER, UserRole.ADMIN] },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck, roles: [UserRole.ADMIN, UserRole.STAFF_VERIFICATION] },
    { id: 'talent', label: 'Find Talent', icon: UserIcon, roles: [UserRole.BUSINESS, UserRole.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.roles.includes(null) && !user) return true;
    if (user && item.roles.includes(user.role)) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div
                className="flex-shrink-0 flex items-center cursor-pointer gap-2"
                onClick={() => onNavigate('home')}
              >
                <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
                  <span className="text-jamaica-gold font-bold text-xl">O</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">
                  Oppo-<span className="text-violet-600">JA</span>
                </span>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {filteredNavItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${currentPage === item.id
                        ? 'border-brand-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      {user.role === UserRole.ADMIN && <ShieldCheck className="w-3 h-3 text-brand-600" />}
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                  {user.avatarUrl ? (
                    <img className="h-8 w-8 rounded-full ring-2 ring-brand-100" src={user.avatarUrl} alt="" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className="bg-gradient-to-r from-violet-600 to-blue-500 text-white hover:bg-gradient-to-r from-violet-600 to-blue-500-hover px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
              >
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {filteredNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${currentPage === item.id
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
            {!user && (
              <div className="pt-4 pb-4 border-t border-gray-200">
                <div className="flex items-center px-4 space-x-3">
                  <button
                    onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }}
                    className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-brand-700 bg-brand-100 hover:bg-brand-200"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { onNavigate('register'); setIsMobileMenuOpen(false); }}
                    className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <span className="text-gray-400 hover:text-gray-500">About MDT</span>
            <span className="text-gray-400 hover:text-gray-500">Privacy Policy</span>
            <span className="text-gray-400 hover:text-gray-500">Terms of Service</span>
            <span className="text-gray-400 hover:text-gray-500">Contact</span>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 Oppo-JA. All rights reserved. Jamaica, W.I.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
