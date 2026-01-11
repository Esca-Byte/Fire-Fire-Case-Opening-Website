import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

const MISSIONS = [
    { id: 1, title: 'Rookie Spinner', desc: 'Spin the Roulette 5 times', target: 5, reward: 500, type: 'gold', key: 'ff_roulette_spins' },
    { id: 2, title: 'Case Opener', desc: 'Open 3 Weapon Cases', target: 3, reward: 50, type: 'diamonds', key: 'ff_case_opens' },
    { id: 3, title: 'High Roller', desc: 'Win 1000 Gold in Roulette', target: 1000, reward: 100, type: 'diamonds', key: 'ff_roulette_winnings' },
];

const Missions = () => {
    const { addGold, addDiamonds } = useCurrency();
    const [progress, setProgress] = useState({});
    const [claimed, setClaimed] = useState({});

    useEffect(() => {
        // Load progress and claimed status
        const newProgress = {};
        const newClaimed = JSON.parse(localStorage.getItem('ff_missions_claimed') || '{}');

        MISSIONS.forEach(m => {
            newProgress[m.id] = parseInt(localStorage.getItem(m.key) || '0');
        });

        setProgress(newProgress);
        setClaimed(newClaimed);

        // Poll for changes (simple way to update when switching tabs)
        const interval = setInterval(() => {
            const currentProgress = {};
            MISSIONS.forEach(m => {
                currentProgress[m.id] = parseInt(localStorage.getItem(m.key) || '0');
            });
            setProgress(currentProgress);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const claim = (mission) => {
        if (progress[mission.id] < mission.target) return;
        if (claimed[mission.id]) return;

        if (mission.type === 'gold') addGold(mission.reward);
        else addDiamonds(mission.reward);

        const newClaimed = { ...claimed, [mission.id]: true };
        setClaimed(newClaimed);
        localStorage.setItem('ff_missions_claimed', JSON.stringify(newClaimed));
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <h2 style={{ color: 'var(--ff-orange)', marginBottom: '2rem' }}>DAILY MISSIONS</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {MISSIONS.map(mission => {
                    const current = progress[mission.id] || 0;
                    const isCompleted = current >= mission.target;
                    const isClaimed = claimed[mission.id];
                    const percent = Math.min(100, (current / mission.target) * 100);

                    return (
                        <div key={mission.id} style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: isCompleted && !isClaimed ? '1px solid var(--ff-orange)' : '1px solid transparent'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{mission.title}</div>
                                <div style={{ color: 'var(--ff-text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{mission.desc}</div>

                                {/* Progress Bar */}
                                <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${percent}%`,
                                        height: '100%',
                                        background: isCompleted ? 'var(--ff-green, #00ff00)' : 'var(--ff-orange)',
                                        transition: 'width 0.5s'
                                    }} />
                                </div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.2rem', textAlign: 'right' }}>
                                    {current} / {mission.target}
                                </div>
                            </div>

                            <div style={{ marginLeft: '2rem', textAlign: 'center', minWidth: '100px' }}>
                                <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: mission.type === 'gold' ? 'var(--ff-gold)' : 'var(--ff-diamond)' }}>
                                    {mission.reward} {mission.type === 'gold' ? '🪙' : '💎'}
                                </div>
                                <button
                                    className="btn-primary"
                                    onClick={() => claim(mission)}
                                    disabled={!isCompleted || isClaimed}
                                    style={{
                                        padding: '0.5em 1em',
                                        fontSize: '0.8rem',
                                        opacity: (!isCompleted || isClaimed) ? 0.5 : 1,
                                        background: isClaimed ? 'gray' : undefined
                                    }}
                                >
                                    {isClaimed ? 'CLAIMED' : 'CLAIM'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Missions;
