
import React from 'react';
import { useApp } from '../App';
import { User as UserIcon, Globe, Moon, Sun, Activity, LogOut, ChevronRight } from 'lucide-react';
import { Language } from '../types';

const Settings: React.FC = () => {
  const { t, user, setUser, language, setLanguage, isDarkMode, setIsDarkMode } = useApp();

  const toggleLanguage = () => {
    const langs: Language[] = ['en', 'es', 'fr', 'de', 'ar'];
    const nextIdx = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIdx]);
  };

  const logout = () => {
    import('../services/mockBackend').then(m => m.mockBackend.logout());
    setUser(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/20">
          {user?.email[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.email}</h1>
          <p className="text-slate-500">Premium Creative Partner</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-2">Account</h2>
        
        <div className="glass rounded-2xl overflow-hidden divide-y dark:divide-slate-800">
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Activity size={20} />
              </div>
              <div>
                <p className="font-medium">{t('accessCount')}</p>
                <p className="text-xs text-slate-500">Total logins recorded</p>
              </div>
            </div>
            <span className="text-lg font-bold mx-2">{user?.accessCount}</span>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <UserIcon size={20} />
              </div>
              <div>
                <p className="font-medium">{t('premiumStatus')}</p>
                <p className="text-xs text-slate-500">Current active tier</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
              {user?.premiumTier}
            </span>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-2 mt-8">Preferences</h2>
        
        <div className="glass rounded-2xl overflow-hidden divide-y dark:divide-slate-800">
          <button 
            onClick={toggleLanguage}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div>
                <p className="font-medium">{t('language')}</p>
                <p className="text-xs text-slate-500">UI language preference</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="uppercase font-bold text-slate-500">{language === 'ar' ? 'العربية' : language}</span>
              <ChevronRight size={16} className={`text-slate-400 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <div>
                <p className="font-medium">{t('darkMode')}</p>
                <p className="text-xs text-slate-500">Adjust visual appearance</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7 rtl:right-7 rtl:left-auto' : 'left-1 rtl:right-1 rtl:left-auto'}`} />
            </div>
          </button>
        </div>

        <button 
          onClick={logout}
          className="w-full mt-8 p-4 flex items-center justify-center gap-3 text-red-500 font-bold glass border-red-500/20 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
        >
          <LogOut size={20} className={language === 'ar' ? 'rotate-180' : ''} />
          {t('logout')}
        </button>
      </div>
    </div>
  );
};

export default Settings;
