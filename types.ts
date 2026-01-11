
export enum PremiumTier {
  FREE = 'FREE',
  STANDARD = 'STANDARD', // 500 coins, 2K, 20 uses
  PRO = 'PRO',           // 750 coins, 4K, 50 uses
  UNLIMITED = 'UNLIMITED' // Advanced AI, White Sphere, Dedicated Support
}

export interface User {
  id: string;
  email: string;
  coins: number;
  premiumTier: PremiumTier;
  accessCount: number;
  lastCoinGrant: number; // Timestamp
  dailyUsesRemaining: number;
  lastDailyReset: number;
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ar';

export interface AppState {
  user: User | null;
  language: Language;
  isDarkMode: boolean;
}

export interface Translation {
  [key: string]: {
    [lang in Language]: string;
  };
}
