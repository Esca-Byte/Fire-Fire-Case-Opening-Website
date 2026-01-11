import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import Modal from './Modal';

const REWARDS = [
    { day: 1, type: 'gold', amount: 100 },
    { day: 2, type: 'gold', amount: 200 },
    { day: 3, type: 'diamonds', amount: 10 },
    { day: 4, type: 'gold', amount: 500 },
    { day: 5, type: 'diamonds', amount: 20 },
    { day: 6, type: 'gold', amount: 1000 },
    { day: 7, type: 'diamonds', amount: 50 },
];

const DailyLogin = () => {
    const { addGold, addDiamonds } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const [streak, setStreak] = useState(0);
    const [lastLoginDate, setLastLoginDate] = useState(null);
    const [canClaim, setCanClaim] = useState(false);

    useEffect(() => {
        const savedStreak = parseInt(localStorage.getItem('ff_daily_streak') || '0');
        const savedDate = localStorage.getItem('ff_last_login_date');

        setStreak(savedStreak);
        setLastLoginDate(savedDate);

        const today = new Date().toDateString();

        if (savedDate !== today) {
            setCanClaim(true);
            // Check if streak is broken (missed a day)
            if (savedDate) {
                const last = new Date(savedDate);
                const diffTime = Math.abs(new Date(today) - last);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 1) {
                    // Streak broken, reset to 0 (or 1 if we count today as 1)
                    // But we want to show them day 1 reward
                    setStreak(0);
                }
            }
        } else {
            setCanClaim(false);
        }

        // Auto open if can claim
        if (savedDate !== today) {
            setIsOpen(true);
        }
    }, []);

    const handleClaim = () => {
        const today = new Date().toDateString();
        const currentDayIndex = streak % 7; // Cycle through 7 days
        const reward = REWARDS[currentDayIndex];

        if (reward.type === 'gold') addGold(reward.amount);
        else addDiamonds(reward.amount);

        const newStreak = streak + 1;
        setStreak(newStreak);
        setLastLoginDate(today);
        setCanClaim(false);

        localStorage.setItem('ff_daily_streak', newStreak);
        localStorage.setItem('ff_last_login_date', today);
    };

    return (
        <>
            <button
                className="btn-primary"
                onClick={() => setIsOpen(true)}
                style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 90 }}
            >
                Daily Login {canClaim && '🔴'}
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Daily Login Rewards">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {REWARDS.map((reward, index) => {
                        const isToday = index === (streak % 7);
                        const isClaimed = index < (streak % 7) || (index === (streak % 7) && !canClaim);
                        // This logic is a bit simplified for the cycle, but works for visual

                        return (
                            <div key={index} style={{
                                background: isToday ? 'rgba(255, 140, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                                border: isToday ? '1px solid var(--ff-orange)' : '1px solid transparent',
                                padding: '0.5rem',
                                borderRadius: '8px',
                                textAlign: 'center',
                                opacity: isClaimed ? 0.5 : 1
                            }}>
                                <div style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>Day {index + 1}</div>
                                <div style={{ fontSize: '1.5rem' }}>
                                    {reward.type === 'gold' ? '🪙' : '💎'}
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{reward.amount}</div>
                                {isToday && canClaim && (
                                    <div style={{ fontSize: '0.6rem', color: 'var(--ff-orange)' }}>CLAIM NOW</div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button
                        className="btn-primary"
                        onClick={handleClaim}
                        disabled={!canClaim}
                        style={{ opacity: canClaim ? 1 : 0.5, cursor: canClaim ? 'pointer' : 'not-allowed' }}
                    >
                        {canClaim ? 'CLAIM REWARD' : 'COME BACK TOMORROW'}
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default DailyLogin;
