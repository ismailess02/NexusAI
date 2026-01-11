
import React, { useState } from 'react';
import { useApp } from '../App';
import { mockBackend } from '../services/mockBackend';
import { Mail, Lock, Loader2, ArrowRight, Disc } from 'lucide-react';

const Auth: React.FC = () => {
  const { t, setUser, isDarkMode } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const user = mockBackend.login(email, password);
        setUser(user);
      } else {
        const user = mockBackend.signup(email, password);
        setSuccess(t('successRegistration'));
        setTimeout(() => setUser(user), 1500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 glass rounded-3xl shadow-2xl animate-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/30">
          <Disc className="text-white animate-spin-slow" size={32} />
        </div>
        <h1 className="text-2xl font-bold">{isLogin ? t('login') : t('signup')}</h1>
        <p className="text-slate-500 mt-2">Access the next generation of creative AI.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium px-1">{t('email')}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium px-1">{t('password')}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        {!isLogin && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-medium px-1">{t('confirmPassword')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center font-medium">{success}</p>}

        <button
          disabled={loading}
          type="submit"
          className="w-full py-3.5 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
          {isLogin ? t('login') : t('signup')}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t dark:border-slate-800 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
