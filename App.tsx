
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { User, PremiumTier, Language } from './types';
import { TRANSLATIONS } from './constants';
import { mockBackend } from './services/mockBackend';
import Dashboard from './pages/Dashboard';
import Shop from './pages/Shop';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  language: Language;
  setLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  t: (key: string) => string;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const currentUser = mockBackend.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  return (
    <AppContext.Provider value={{ user, setUser, language, setLanguage, isDarkMode, setIsDarkMode, t }}>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          {user && <Navbar />}
          <main className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
              <Route path="/shop" element={user ? <Shop /> : <Navigate to="/auth" />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
              <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
