
import { User, PremiumTier } from '../types';
import { COIN_REWARD_INTERVAL, COIN_REWARD_AMOUNT } from '../constants.tsx';

/**
 * MOCK BACKEND SERVICE
 * In a real-world app, these functions would be API calls to a secure server.
 * This file centralizes "server-side" logic to prevent easy frontend manipulation.
 */

const STORAGE_KEY = 'nexus_ai_users';
const SESSION_KEY = 'nexus_ai_session';

export const mockBackend = {
  getUsers: (): Record<string, any> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  saveUsers: (users: Record<string, any>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    const users = mockBackend.getUsers();
    const user = users[session];
    if (!user) return null;

    // Check coin reward timer on "fetch"
    const now = Date.now();
    const elapsed = now - user.lastCoinGrant;
    if (elapsed >= COIN_REWARD_INTERVAL) {
      const grants = Math.floor(elapsed / COIN_REWARD_INTERVAL);
      user.coins += grants * COIN_REWARD_AMOUNT;
      user.lastCoinGrant += grants * COIN_REWARD_INTERVAL;
      users[session] = user;
      mockBackend.saveUsers(users);
    }

    return user;
  },

  signup: (email: string, pass: string): User => {
    const users = mockBackend.getUsers();
    if (users[email]) throw new Error("User already exists");

    const newUser: User = {
      id: email,
      email,
      coins: 100,
      premiumTier: PremiumTier.FREE,
      accessCount: 1,
      lastCoinGrant: Date.now(),
      dailyUsesRemaining: 5,
      lastDailyReset: Date.now(),
    };

    users[email] = { ...newUser, password: pass };
    mockBackend.saveUsers(users);
    localStorage.setItem(SESSION_KEY, email);
    return newUser;
  },

  login: (email: string, pass: string): User => {
    const users = mockBackend.getUsers();
    const user = users[email];
    if (!user || user.password !== pass) throw new Error("Invalid credentials");

    user.accessCount += 1;
    mockBackend.saveUsers(users);
    localStorage.setItem(SESSION_KEY, email);
    return user;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  updateUser: (email: string, updates: Partial<User>) => {
    const users = mockBackend.getUsers();
    if (!users[email]) return;
    users[email] = { ...users[email], ...updates };
    mockBackend.saveUsers(users);
  },

  purchaseCoins: (email: string, amount: number) => {
    const users = mockBackend.getUsers();
    const user = users[email];
    if (!user) return;
    user.coins += amount;
    mockBackend.saveUsers(users);
  },

  upgradeTier: (email: string, tier: PremiumTier, cost: number) => {
    const users = mockBackend.getUsers();
    const user = users[email];
    if (!user || user.coins < cost) throw new Error("Insufficient coins");
    
    user.coins -= cost;
    user.premiumTier = tier;
    
    // Set daily limits based on tier
    if (tier === PremiumTier.STANDARD) user.dailyUsesRemaining = 20;
    if (tier === PremiumTier.PRO) user.dailyUsesRemaining = 50;
    if (tier === PremiumTier.UNLIMITED) user.dailyUsesRemaining = 999999;
    
    mockBackend.saveUsers(users);
  }
};
