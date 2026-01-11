
import React, { useState, useRef } from 'react';
import { useApp } from '../App';
import { Image as ImageIcon, Plus, Sparkles, Loader2, Download, RefreshCcw, Layout, PenTool, ShieldCheck } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { mockBackend } from '../services/mockBackend';
import { PremiumTier } from '../types';

const Dashboard: React.FC = () => {
  const { t, user, setUser } = useApp();
  const [mode, setMode] = useState<'merge' | 'create'>('create');
  const [img1, setImg1] = useState<string | null>(null);
  const [img2, setImg2] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<"1K" | "2K" | "4K">("1K");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInput1 = useRef<HTMLInputElement>(null);
  const fileInput2 = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    const isHighRes = resolution === "2K" || resolution === "4K";
    
    // Check permissions/requirements
    if (isHighRes) {
      // Must have Standard (2K) or Pro/Unlimited (4K)
      if (resolution === "2K" && user?.premiumTier === PremiumTier.FREE) {
        setError("2K requires Standard Tier or higher");
        return;
      }
      if (resolution === "4K" && (user?.premiumTier === PremiumTier.FREE || user?.premiumTier === PremiumTier.STANDARD)) {
        setError("4K requires Pro Tier or higher");
        return;
      }

      // Pro models need user-selected key
      if (!(window as any).aistudio?.hasSelectedApiKey?.()) {
        try {
          await (window as any).aistudio?.openSelectKey?.();
        } catch (e) {
          setError("Please select an API key for high-resolution generation.");
          return;
        }
      }
    }

    if (mode === 'merge' && (!img1 || !img2)) return;
    if (mode === 'create' && !prompt) return;

    if (user!.coins < 5 && user?.premiumTier === PremiumTier.FREE) {
      setError(t('insufficientCoins'));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let res = '';
      const apiKey = process.env.API_KEY || '';
      
      if (mode === 'merge') {
        res = await geminiService.mergeImages(img1!, img2!, prompt, apiKey);
      } else {
        res = await geminiService.generateImage(prompt, resolution, apiKey);
      }
      
      setResult(res);

      const cost = user?.premiumTier === PremiumTier.FREE ? 5 : 0;
      mockBackend.updateUser(user!.email, { 
        coins: Math.max(0, user!.coins - cost),
        dailyUsesRemaining: user!.dailyUsesRemaining - 1
      });
      
      const updatedUser = mockBackend.getCurrentUser();
      setUser(updatedUser);
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key verification failed. Re-selecting key...");
        await (window as any).aistudio?.openSelectKey?.();
      } else {
        setError(err.message || 'Generation failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setImg1(null);
    setImg2(null);
    setResult(null);
    setPrompt('');
    setError(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{mode === 'merge' ? t('mergeImages') : t('createImage')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {mode === 'merge' 
              ? 'Upload two reference images and let NexusAI blend their concepts seamlessly.' 
              : 'Describe your vision and let NexusAI bring it to life in stunning detail.'}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button 
              onClick={() => { setMode('create'); clear(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${mode === 'create' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 font-bold' : 'text-slate-500'}`}
            >
              <PenTool size={18} />
              {t('createImage')}
            </button>
            <button 
              onClick={() => { setMode('merge'); clear(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${mode === 'merge' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 font-bold' : 'text-slate-500'}`}
            >
              <Layout size={18} />
              {t('mergeImages')}
            </button>
          </div>
          <button 
            onClick={clear}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {mode === 'merge' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => fileInput1.current?.click()}
                className="aspect-square glass rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all group"
              >
                {img1 ? (
                  <img src={img1} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon size={24} />
                    </div>
                    <p className="font-medium">Image 1</p>
                  </div>
                )}
                <input type="file" ref={fileInput1} className="hidden" accept="image/*" onChange={(e) => handleFile(e, setImg1)} />
              </div>

              <div 
                onClick={() => fileInput2.current?.click()}
                className="aspect-square glass rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all group"
              >
                {img2 ? (
                  <img src={img2} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Plus size={24} />
                    </div>
                    <p className="font-medium">Image 2</p>
                  </div>
                )}
                <input type="file" ref={fileInput2} className="hidden" accept="image/*" onChange={(e) => handleFile(e, setImg2)} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block font-medium">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city in the style of cyberpunk..."
                className="w-full h-40 p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none resize-none text-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["1K", "2K", "4K"] as const).map((res) => {
              const disabled = (res === "2K" && user?.premiumTier === PremiumTier.FREE) || 
                               (res === "4K" && (user?.premiumTier === PremiumTier.FREE || user?.premiumTier === PremiumTier.STANDARD));
              return (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`p-4 rounded-xl border-2 flex flex-col gap-1 items-center justify-center transition-all ${
                    resolution === res 
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600' 
                    : 'border-slate-100 dark:border-slate-800'
                  } ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-indigo-200'}`}
                >
                  <span className="font-bold text-lg">{res}</span>
                  <span className="text-xs uppercase font-medium">{res === "1K" ? "Free" : "Premium"}</span>
                </button>
              );
            })}
          </div>

          <button
            disabled={loading || (mode === 'merge' && (!img1 || !img2)) || (mode === 'create' && !prompt)}
            onClick={handleGenerate}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {loading ? 'Processing...' : t('generate')}
          </button>
          
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-center font-medium">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 h-full min-h-[400px] flex flex-col">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} />
              Result
            </h2>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-200 dark:border-slate-800">
              {result ? (
                <>
                  <img src={result} className="w-full h-full object-contain" />
                  <a 
                    href={result} 
                    download="nexus-ai-result.png"
                    className="absolute bottom-4 right-4 p-3 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Download size={20} />
                  </a>
                </>
              ) : (
                <div className="text-center p-8 text-slate-400">
                  {loading ? (
                    <div className="space-y-4">
                      <Loader2 className="animate-spin mx-auto w-12 h-12 text-indigo-500" />
                      <p className="animate-pulse">Consulting the oracle...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ImageIcon size={32} />
                      </div>
                      <p>Your creation will appear here</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
