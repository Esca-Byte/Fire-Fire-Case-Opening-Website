import React, { useState, useEffect, useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import useItemLookup from '../hooks/useItemLookup';
import soundManager from '../utils/SoundManager';

const GoldRoyale = () => {
    const { gold, subtractGold, buyItem, addGold } = useCurrency();
    const { items, loading: itemsLoading, getImagePath } = useItemLookup();
    const [isSpinning, setIsSpinning] = useState(false);
    const [reward, setReward] = useState(null);
    const [notification, setNotification] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(0);

    // Filter for Gold Royale Items (Up to Purple)
    const goldItems = useMemo(() => {
        if (!items) return [];
        return items.filter(item => {
            // Exclude high tier (Orange/Red)
            const isHighTier = item.Rare === 'ORANGE' || item.Rare === 'RED';
            const hasImage = item.image || getImagePath(item.itemID);

            // Include everything else that has an image
            return !isHighTier && hasImage && !hasImage.includes('placeholder');
        }).map(item => ({
            id: item.itemID,
            name: item.description,
            type: 'item',
            rarity: item.Rare || 'common',
            image: item.image || getImagePath(item.itemID)
        }));
    }, [items, getImagePath]);

    // Create Prize Pool
    const prizePool = useMemo(() => {
        if (goldItems.length === 0) return [];

        // Add fillers
        const fillers = [
            { id: 'gold_300', name: '300 Gold', type: 'currency', amount: 300, rarity: 'common', image: '/assets/images/gold_icon.webp' },
            { id: 'frag_univ', name: 'Universal Fragment', type: 'fragment', rarity: 'common', image: '/assets/images/misc/Icon_exchange_MC_fragment.png' }
        ];

        return [...goldItems, ...fillers];
    }, [goldItems]);

    // Rotate preview
    useEffect(() => {
        if (prizePool.length === 0) return;
        const interval = setInterval(() => {
            setPreviewIndex(prev => (prev + 1) % Math.min(5, prizePool.length));
        }, 3000);
        return () => clearInterval(interval);
    }, [prizePool]);

    const processWin = (item) => {
        if (item.type === 'currency') {
            addGold(item.amount);
        } else {
            buyItem(item, 0, 'gold');
        }
    };

    const handleSpin = (count) => {
        const cost = count === 1 ? 300 : 3000;

        if (gold < cost) {
            setNotification("Not enough Gold!");
            setTimeout(() => setNotification(null), 2000);
            return;
        }

        subtractGold(cost);
        setIsSpinning(true);
        setReward(null);
        soundManager.play('spin');

        setTimeout(() => {
            const newRewards = [];

            for (let i = 0; i < count; i++) {
                const tierRoll = Math.random();
                let targetRarity = 'common';

                // 2% Purple, 15% Blue, 83% Common
                if (tierRoll > 0.98) targetRarity = 'PURPLE';
                else if (tierRoll > 0.83) targetRarity = 'BLUE';

                let tierItems = prizePool.filter(item => item.rarity === targetRarity);

                // Fallback to common if no items in target tier
                if (tierItems.length === 0) {
                    tierItems = prizePool.filter(item =>
                        item.rarity !== 'PURPLE' && item.rarity !== 'BLUE'
                    );
                }

                // Ultimate Fallback
                const poolToUse = tierItems.length > 0 ? tierItems : prizePool;
                const wonItem = poolToUse[Math.floor(Math.random() * poolToUse.length)];

                newRewards.push(wonItem);
                processWin(wonItem);
            }

            setReward(newRewards[newRewards.length - 1]);
            setIsSpinning(false);
            soundManager.play('win');

            if (count > 1) {
                setNotification(`You won ${count} items! Check inventory.`);
            } else {
                setNotification(`You won: ${newRewards[0].name}`);
            }
            setTimeout(() => setNotification(null), 3000);

        }, 1500);
    };

    if (itemsLoading) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading Gold Royale...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
            <div className="card" style={{
                textAlign: 'center',
                border: '2px solid #ffd700',
                background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.1) 0%, rgba(0,0,0,0.9) 100%)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <h3 style={{ color: '#ffd700', marginBottom: '1rem', fontSize: '2.5rem', letterSpacing: '2px', textShadow: '0 0 10px #ffd700' }}>GOLD ROYALE</h3>
                <p style={{ color: '#aaa', marginBottom: '2rem' }}>Daily Rewards (Up to Purple)</p>

                {/* Preview */}
                <div style={{
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    position: 'relative'
                }}>
                    {/* Background Glow */}
                    <div style={{
                        position: 'absolute',
                        width: '280px', height: '280px',
                        background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)',
                        animation: 'pulse 3s infinite'
                    }}></div>

                    {reward ? (
                        <div style={{ animation: 'zoomIn 0.5s', zIndex: 2 }}>
                            <img src={reward.image} alt={reward.name} style={{ width: '250px', height: '250px', objectFit: 'contain', filter: 'drop-shadow(0 0 20px #ffd700)' }} />
                            <div style={{ color: '#fff', fontSize: '1.5rem', marginTop: '1rem', fontWeight: 'bold' }}>{reward.name}</div>
                            <div style={{ color: '#ffd700', fontSize: '1rem' }}>{reward.rarity}</div>
                        </div>
                    ) : (
                        prizePool.length > 0 && (
                            <div style={{ zIndex: 2, transition: 'all 0.5s' }}>
                                <img
                                    src={prizePool[previewIndex]?.image}
                                    alt="Preview"
                                    style={{ width: '250px', height: '250px', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.5))' }}
                                />
                                <div style={{ color: '#fff', fontSize: '1.2rem', marginTop: '1rem' }}>{prizePool[previewIndex]?.name}</div>
                            </div>
                        )
                    )}
                </div>

                {/* Spin Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
                    <button
                        className="modern-btn"
                        onClick={() => handleSpin(1)}
                        disabled={isSpinning}
                        style={{
                            flex: 1,
                            background: 'linear-gradient(45deg, #ffd700, #ffaa00)',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '15px',
                            cursor: 'pointer',
                            color: '#000',
                            boxShadow: '0 5px 15px rgba(255, 215, 0, 0.3)',
                            opacity: isSpinning ? 0.7 : 1,
                            fontWeight: 'bold'
                        }}
                    >
                        <div style={{ fontSize: '1.2rem' }}>1 SPIN</div>
                        <div style={{ fontSize: '0.9rem' }}>🪙 300</div>
                    </button>

                    <button
                        className="modern-btn"
                        onClick={() => handleSpin(10)}
                        disabled={isSpinning}
                        style={{
                            flex: 1,
                            background: 'linear-gradient(45deg, #ffd700, #ffaa00)',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '15px',
                            cursor: 'pointer',
                            color: '#000',
                            boxShadow: '0 5px 15px rgba(255, 215, 0, 0.3)',
                            opacity: isSpinning ? 0.7 : 1,
                            fontWeight: 'bold'
                        }}
                    >
                        <div style={{ fontSize: '1.2rem' }}>10 SPINS</div>
                        <div style={{ fontSize: '0.9rem' }}>🪙 3000</div>
                    </button>
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.95)',
                    border: '2px solid #ffd700',
                    padding: '2rem 4rem',
                    borderRadius: '15px',
                    zIndex: 2000,
                    animation: 'zoomIn 0.3s',
                    color: '#ffd700',
                    textAlign: 'center',
                    boxShadow: '0 0 50px rgba(255, 215, 0, 0.5)'
                }}>
                    <h2 style={{ margin: 0, fontSize: '2rem' }}>CONGRATULATIONS!</h2>
                    <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: 'white' }}>{notification}</p>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(1.1); opacity: 0.4; }
                    100% { transform: scale(1); opacity: 0.2; }
                }
                @keyframes zoomIn {
                    from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default GoldRoyale;
