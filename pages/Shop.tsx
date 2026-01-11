
import React, { useState } from 'react';
import { useApp } from '../App';
import { Coins, Check, Zap, Crown, Star, Disc, CreditCard, Wallet, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { mockBackend } from '../services/mockBackend';
import { PremiumTier } from '../types';

const Shop: React.FC = () => {
  const { t, user, setUser, language } = useApp();
  const [loading, setLoading] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{ type: 'coins' | 'tier', id: string, amount?: number, price: number | string, name: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'visa' | 'paypal' | null>(null);
  const [success, setSuccess] = useState(false);

  const coinPacks = [
    { id: 'c1', amount: 100, price: 0.99, icon: <Coins className="text-amber-400" /> },
    { id: 'c2', amount: 500, price: 4.49, icon: <Star className="text-indigo-400" /> },
    { id: 'c3', amount: 2500, price: 19.99, icon: <Zap className="text-purple-400" /> },
  ];

  const premiumTiers = [
    {
      id: PremiumTier.STANDARD,
      name: "Standard",
      price: 500,
      features: ["2K Image Generation", "20 uses per day", "Standard Support", "Paid Badge"],
      icon: <Check className="text-green-500" />
    },
    {
      id: PremiumTier.PRO,
      name: "Pro",
      price: 750,
      features: ["4K High Resolution", "50 uses per day", "Priority Support", "Gold Badge"],
      icon: <Crown className="text-amber-500" />
    },
    {
      id: PremiumTier.UNLIMITED,
      name: "Unlimited",
      price: 2500,
      features: ["Unlimited usage", "Advanced AI Models", "White Sphere Icon", "Dedicated Support"],
      icon: <Disc className="text-indigo-500" />
    }
  ];

  const initiatePurchase = (item: any) => {
    setCheckoutItem(item);
    setPaymentMethod(null);
    setSuccess(false);
  };

  const handleFinalPayment = () => {
    if (!paymentMethod || !checkoutItem) return;
    setLoading(true);
    // Secure server-side verification simulation
    setTimeout(() => {
      if (checkoutItem.type === 'coins') {
        mockBackend.purchaseCoins(user!.email, checkoutItem.amount!);
      } else {
        mockBackend.upgradeTier(user!.email, checkoutItem.id as PremiumTier, checkoutItem.price as number);
      }
      const updatedUser = mockBackend.getCurrentUser();
      setUser(updatedUser);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setCheckoutItem(null);
        setSuccess(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {checkoutItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            {success ? (
              <div className="text-center space-y-4 py-8 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center rounded-full mx-auto">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-bold">Verified!</h2>
                <p className="text-slate-500">Your purchase was securely processed.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{t('checkout')}</h2>
                  <button onClick={() => setCheckoutItem(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6 flex justify-between items-center">
                  <span className="font-medium">{checkoutItem.name}</span>
                  <span className="font-bold text-lg ltr-only">
                    {checkoutItem.type === 'coins' ? `$${checkoutItem.price}` : `${checkoutItem.price} Coins`}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">{t('payVia')}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button 
                    onClick={() => setPaymentMethod('visa')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'visa' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                  >
                    <CreditCard size={24} className="text-blue-500" />
                    <span className="font-bold">Visa / Card</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                  >
                    <Wallet size={24} className="text-blue-600" />
                    <span className="font-bold">PayPal</span>
                  </button>
                </div>

                <button
                  disabled={!paymentMethod || loading}
                  onClick={handleFinalPayment}
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                  {loading ? 'Verifying...' : 'Pay & Secure'}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">Encrypted server-side transaction</p>
              </>
            )}
          </div>
        </div>
      )}

      <section>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('shop')}</h1>
          <p className="text-slate-500 mt-2">Top up your balance via secure payment methods.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coinPacks.map((pack) => (
            <div key={pack.id} className="glass rounded-2xl p-6 text-center group hover:border-indigo-500/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                {pack.icon}
              </div>
              <h3 className="text-2xl font-bold">{pack.amount} {t('coins')}</h3>
              <p className="text-slate-500 mb-6 ltr-only">${pack.price}</p>
              <button
                onClick={() => initiatePurchase({ type: 'coins', id: pack.id, amount: pack.amount, price: pack.price, name: `${pack.amount} Coins` })}
                className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                Buy with Card / PayPal
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold">{t('premiumStatus')}</h2>
          <p className="text-slate-500 mt-2">Unlock advanced AI models and dedicated support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {premiumTiers.map((tier) => (
            <div 
              key={tier.id} 
              className={`relative glass rounded-2xl p-8 border-2 transition-all ${
                user?.premiumTier === tier.id 
                  ? 'border-indigo-500 ring-4 ring-indigo-500/10' 
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {user?.premiumTier === tier.id && (
                <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  ACTIVE
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-slate-500 mb-1">{t('coins')}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex-shrink-0">{tier.icon}</div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => initiatePurchase({ type: 'tier', id: tier.id, price: tier.price, name: `${tier.name} Upgrade` })}
                disabled={user?.premiumTier === tier.id || user!.coins < tier.price}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  user?.premiumTier === tier.id
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'
                }`}
              >
                {user?.premiumTier === tier.id ? 'Already Owned' : `Upgrade for ${tier.price} Coins`}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Shop;
