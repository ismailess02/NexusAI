
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../App';
import { Coins, Settings, ShoppingBag, LayoutDashboard, LogOut, Disc, ShieldCheck, Crown } from 'lucide-react';
import CoinTimer from './CoinTimer';
import { PremiumTier } from '../types';

const Navbar: React.FC = () => {
  const { user, t, setUser, isDarkMode, language } = useApp();
  const location = useLocation();

  const handleLogout = () => {
    import('../services/mockBackend').then(m => m.mockBackend.logout());
    setUser(null);
  };

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: t('dashboard') },
    { path: '/shop', icon: <ShoppingBag size={20} />, label: t('shop') },
    { path: '/settings', icon: <Settings size={20} />, label: t('settings') },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b dark:border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-indigo-600 group-hover:bg-indigo-500' : 'bg-indigo-500 group-hover:bg-indigo-400'}`}>
              <Disc className="text-white animate-spin-slow" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              NexusAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-900/50">
            <Coins size={18} />
            <span className="font-bold">{user?.coins}</span>
            <div className="w-px h-4 bg-amber-200 dark:bg-amber-900/50 mx-1" />
            <CoinTimer />
          </div>

          <div className="flex items-center gap-2">
            {user?.premiumTier === PremiumTier.STANDARD && (
              <div className="p-1.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/20 text-white" title="Standard Tier">
                <ShieldCheck size={18} />
              </div>
            )}
            {user?.premiumTier === PremiumTier.PRO && (
              <div className="p-1.5 bg-amber-500 rounded-full shadow-lg shadow-amber-500/20 text-white" title="Pro Tier">
                <Crown size={18} />
              </div>
            )}
            {user?.premiumTier === PremiumTier.UNLIMITED && (
              <div className="p-1.5 bg-white rounded-full shadow-lg shadow-white/20 border border-slate-200 animate-pulse" title="Unlimited Tier">
                <Disc className="text-slate-900" size={20} fill="currentColor" />
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
            title={t('logout')}
          >
            <LogOut size={20} className={language === 'ar' ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
