import React, { useState, useEffect, useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import useItemLookup from '../hooks/useItemLookup';
import soundManager from '../utils/SoundManager';

const BundleRoyale = () => {
    const { diamonds, subtractDiamonds, buyItem, addGold } = useCurrency();
    const { items, loading: itemsLoading, getImagePath } = useItemLookup();
    const [isSpinning, setIsSpinning] = useState(false);
    const [reward, setReward] = useState(null);
    const [notification, setNotification] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(0);

    // Filter for BUNDLE items
    const bundleItems = useMemo(() => {
        if (!items) return [];
        return items.filter(item => {
            const isBundle = item.itemType === 'BUNDLE';
            const hasImage = item.image || getImagePath(item.itemID);
            return isBundle && hasImage && !hasImage.includes('placeholder');
        }).map(item => ({
            id: item.itemID,
            name: item.description,
            type: 'bundle',
            rarity: item.Rare || 'epic', // Default to epic if undefined
            image: item.image || getImagePath(item.itemID),
            probability: item.Rare === 'ORANGE' ? 0.02 : 0.05
        }));
    }, [items, getImagePath]);

    // Add filler items if not enough bundles
    const prizePool = useMemo(() => {
        if (bundleItems.length === 0) return [];

        // Take top 10 rarest bundles
        const grandPrizes = bundleItems.slice(0, 10);

        // Add filler items
        const fillers = [
            { id: 'gold_500', name: '500 Gold', type: 'currency', amount: 500, rarity: 'common', probability: 0.3, image: '/assets/images/gold_icon.webp' },
            { id: 'gold_100', name: '100 Gold', type: 'currency', amount: 100, rarity: 'common', probability: 0.4, image: '/assets/images/gold_icon.webp' },
            { id: 'frag_univ', name: 'Universal Fragment', type: 'fragment', rarity: 'common', probability: 0.23, image: '/assets/images/misc/Icon_exchange_MC_fragment.png' }
        ];

        return [...grandPrizes, ...fillers];
    }, [bundleItems]);

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
        } else if (item.type === 'bundle') {
            buyItem(item, 0, 'gold'); // Bundles bought with gold in this context? Or just added.
            // If it's a royale win, we usually just add it. buyItem handles adding to inventory.
        }
    };

    const handleSpin = (count) => {
        const cost = count === 1 ? 60 : 270; // Premium pricing

        if (diamonds < cost) {
            setNotification("Not enough Diamonds!");
            setTimeout(() => setNotification(null), 2000);
            return;
        }

        subtractDiamonds(cost);
        setIsSpinning(true);
        setReward(null);
        soundManager.play('spin');

        setTimeout(() => {
            const newRewards = [];

            for (let i = 0; i < count; i++) {
                // Tier Roll Logic
                const tierRoll = Math.random();
                let targetRarity = 'common';

                // 5% Legendary (Orange), 15% Epic (Purple), 80% Common (Filler)
                if (tierRoll > 0.95) targetRarity = 'ORANGE';
                else if (tierRoll > 0.80) targetRarity = 'PURPLE';

                // Filter pool by rarity
                let tierItems = prizePool.filter(item => item.rarity === targetRarity);

                // Fallback logic
                if (tierItems.length === 0) {
                    tierItems = prizePool.filter(item => item.rarity === 'common');
                }

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

        }, 2000); // Longer spin for animation
    };

    if (itemsLoading) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading Bundles...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
            <div className="card" style={{
                textAlign: 'center',
                border: '2px solid #ff0055',
                background: 'linear-gradient(180deg, rgba(255, 0, 85, 0.1) 0%, rgba(0,0,0,0.9) 100%)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 0 30px rgba(255, 0, 85, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <h3 style={{ color: '#ff0055', marginBottom: '1rem', fontSize: '2.5rem', letterSpacing: '2px', textShadow: '0 0 10px #ff0055' }}>BUNDLE ROYALE</h3>

                {/* Grand Prize Preview / Spin Animation */}
                <div style={{
                    height: '350px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    position: 'relative',
                    perspective: '1000px'
                }}>
                    {/* Background Glow */}
                    <div style={{
                        position: 'absolute',
                        width: '300px', height: '300px',
                        background: 'radial-gradient(circle, rgba(255,0,85,0.3) 0%, transparent 70%)',
                        animation: 'pulse 2s infinite'
                    }}></div>

                    <div className={isSpinning ? 'spinning-card' : ''} style={{
                        position: 'relative',
                        width: '220px',
                        height: '220px',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.5s'
                    }}>
                        {reward ? (
                            <div style={{ animation: 'zoomIn 0.5s', zIndex: 2, textAlign: 'center' }}>
                                <img src={reward.image} alt={reward.name} style={{ width: '200px', height: '200px', objectFit: 'contain', filter: 'drop-shadow(0 0 20px #ff0055)' }} />
                                <div style={{ color: '#fff', fontSize: '1.8rem', marginTop: '1rem', fontWeight: 'bold', textShadow: '0 0 10px #ff0055' }}>{reward.name}</div>
                                <div style={{ color: '#ff0055', fontSize: '1rem' }}>{reward.rarity.toUpperCase()}</div>
                            </div>
                        ) : (
                            prizePool.length > 0 && (
                                <div style={{ zIndex: 2, textAlign: 'center' }}>
                                    <img
                                        src={prizePool[previewIndex]?.image}
                                        alt="Preview"
                                        style={{ width: '220px', height: '220px', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(255,0,85,0.5))' }}
                                    />
                                    <div style={{ color: '#fff', fontSize: '1.5rem', marginTop: '1rem', fontWeight: 'bold' }}>{prizePool[previewIndex]?.name}</div>
                                    <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Grand Prize Preview</div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Spin Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
                    <button
                        className="modern-btn"
                        onClick={() => handleSpin(1)}
                        disabled={isSpinning}
                        style={{
                            flex: 1,
                            background: 'linear-gradient(45deg, #ff0055, #cc0044)',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '15px',
                            cursor: 'pointer',
                            color: '#fff',
                            boxShadow: '0 5px 15px rgba(255, 0, 85, 0.4)',
                            opacity: isSpinning ? 0.7 : 1
                        }}
                    >
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>1 SPIN</div>
                        <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            💎 60
                        </div>
                    </button>

                    <button
                        className="modern-btn"
                        onClick={() => handleSpin(5)}
                        disabled={isSpinning}
                        style={{
                            flex: 1,
                            background: 'linear-gradient(45deg, #ff0055, #cc0044)',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '15px',
                            cursor: 'pointer',
                            color: '#fff',
                            boxShadow: '0 5px 15px rgba(255, 0, 85, 0.4)',
                            opacity: isSpinning ? 0.7 : 1,
                            position: 'relative'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ffd700', color: '#000', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>10% OFF</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>5 SPINS</div>
                        <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            💎 270
                        </div>
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
                    border: '2px solid #ff0055',
                    padding: '2rem 4rem',
                    borderRadius: '15px',
                    zIndex: 2000,
                    animation: 'zoomIn 0.3s',
                    color: '#fff',
                    textAlign: 'center',
                    boxShadow: '0 0 50px rgba(255, 0, 85, 0.5)'
                }}>
                    <h2 style={{ margin: 0, fontSize: '2rem', color: '#ff0055' }}>CONGRATULATIONS!</h2>
                    <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>{notification}</p>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.1); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 0.3; }
                }
                @keyframes zoomIn {
                    from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
                @keyframes spin3d {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(3600deg); }
                }
                .spinning-card {
                    animation: spin3d 2s cubic-bezier(0.25, 1, 0.5, 1);
                }
            `}</style>
        </div>
    );
};

export default BundleRoyale;
