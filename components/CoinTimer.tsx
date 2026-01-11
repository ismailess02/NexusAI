
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { COIN_REWARD_INTERVAL } from '../constants';
import { mockBackend } from '../services/mockBackend';

const CoinTimer: React.FC = () => {
  const { user, setUser } = useApp();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - user.lastCoinGrant;
      const remaining = Math.max(0, COIN_REWARD_INTERVAL - (elapsed % COIN_REWARD_INTERVAL));
      
      // If a grant occurred, refresh user from "backend"
      if (remaining > COIN_REWARD_INTERVAL - 1000) {
        const updatedUser = mockBackend.getCurrentUser();
        if (updatedUser) setUser(updatedUser);
      }

      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [user, setUser]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <span className="text-xs font-mono tabular-nums">
      {minutes}:{seconds.toString().padStart(2, '0')}
    </span>
  );
};

export default CoinTimer;
