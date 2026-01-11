import React, { useState, useEffect, useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import useItemLookup from '../hooks/useItemLookup';
import soundManager from '../utils/SoundManager';

const VehicleRoyale = () => {
    const { diamonds, subtractDiamonds, buyItem, addGold } = useCurrency();
    const { items, loading: itemsLoading, getImagePath } = useItemLookup();
    const [isSpinning, setIsSpinning] = useState(false);
    const [reward, setReward] = useState(null);
    const [notification, setNotification] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(0);

    // Filter for VEHICLE items
    const vehicleItems = useMemo(() => {
        if (!items) return [];
        return items.filter(item => {
            const desc = item.description ? item.description.toLowerCase() : '';
            const isVehicle = item.collectionType === 'VEHICLE_SKIN' || (item.itemType === 'VEHICLE' || desc.includes('vehicle'));
            const hasImage = item.image || getImagePath(item.itemID);
            return isVehicle && hasImage && !hasImage.includes('placeholder');
        }).map(item => ({
            id: item.itemID,
            name: item.description,
            type: 'vehicle',
            rarity: item.Rare || 'common',
            image: item.image || getImagePath(item.itemID)
        }));
    }, [items, getImagePath]);

    // Create Prize Pool with Rarity Logic
    const prizePool = useMemo(() => {
        if (vehicleItems.length === 0) return [];

        // Add fillers if not enough vehicles (unlikely but safe)
        const fillers = [
            { id: 'gold_200', name: '200 Gold', type: 'currency', amount: 200, rarity: 'common', image: '/assets/images/gold_icon.webp' },
            { id: 'frag_univ', name: 'Universal Fragment', type: 'fragment', rarity: 'common', image: '/assets/images/misc/Icon_exchange_MC_fragment.png' }
        ];

        return [...vehicleItems, ...fillers];
    }, [vehicleItems]);

    // Rotate preview
    useEffect(() => {
        if (vehicleItems.length === 0) return;
        const interval = setInterval(() => {
            setPreviewIndex(prev => (prev + 1) % Math.min(5, vehicleItems.length));
        }, 2500);
        return () => clearInterval(interval);
    }, [vehicleItems]);

    const processWin = (item) => {
        if (item.type === 'currency') {
            addGold(item.amount);
        } else {
            buyItem(item, 0, 'diamonds');
        }
    };

    const handleSpin = (count) => {
        const cost = count === 1 ? 40 : 400; // Slightly cheaper than Diamond Royale

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

                // Adjust tiers based on data: mostly WHITE (Common) and PURPLE (Epic)
                // 15% Epic (Purple), 85% Common (White/Green)
                if (tierRoll > 0.85) targetRarity = 'PURPLE';

                // Filter pool by rarity
                let tierItems = prizePool.filter(item => item.rarity === targetRarity);

                // If looking for common, include fillers and WHITE/GREEN items
                if (targetRarity === 'common') {
                    tierItems = prizePool.filter(item =>
                        item.rarity === 'common' ||
                        item.rarity === 'WHITE' ||
                        item.rarity === 'GREEN'
                    );
                }

                // Fallback: If target tier is empty, fall back to common
                if (tierItems.length === 0) {
                    tierItems = prizePool.filter(item =>
                        item.rarity === 'common' ||
                        item.rarity === 'WHITE' ||
                        item.rarity === 'GREEN'
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

    if (itemsLoading) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading Vehicles...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
            <div className="card" style={{
                textAlign: 'center',
                border: '2px solid #00ffff',
                background: 'linear-gradient(180deg, rgba(0, 255, 255, 0.1) 0%, rgba(0,0,0,0.9) 100%)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <h3 style={{ color: '#00ffff', marginBottom: '1rem', fontSize: '2.5rem', letterSpacing: '2px', textShadow: '0 0 10px #00ffff' }}>VEHICLE ROYALE</h3>
                <p style={{ color: '#aaa', marginBottom: '2rem' }}>Ride in Style</p>

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
                        background: 'radial-gradient(circle, rgba(0,255,255,0.2) 0%, transparent 70%)',
                        animation: 'pulse 3s infinite'
                    }}></div>

                    {reward ? (
                        <div style={{ animation: 'zoomIn 0.5s', zIndex: 2 }}>
                            <img src={reward.image} alt={reward.name} style={{ width: '250px', height: '200px', objectFit: 'contain', filter: 'drop-shadow(0 0 20px #00ffff)' }} />
                            <div style={{ color: '#fff', fontSize: '1.5rem', marginTop: '1rem', fontWeight: 'bold' }}>{reward.name}</div>
                            <div style={{ color: '#00ffff', fontSize: '1rem' }}>{reward.rarity}</div>
                        </div>
                    ) : (
                        vehicleItems.length > 0 && (
                            <div style={{ zIndex: 2, transition: 'all 0.5s' }}>
                                <img
                                    src={vehicleItems[previewIndex]?.image}
                                    alt="Preview"
                                    style={{ width: '250px', height: '200px', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(0,255,255,0.5))' }}
                                />
                                <div style={{ color: '#fff', fontSize: '1.2rem', marginTop: '1rem' }}>{vehicleItems[previewIndex]?.name}</div>
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
                            background: 'linear-gradient(45deg, #00ffff, #0088ff)',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '15px',
                            cursor: 'pointer',
                            color: '#000',
                            boxShadow: '0 5px 15px rgba(0, 255, 255, 0.3)',
                            opacity: isSpinning ? 0.7 : 1,
                            fontWeight: 'bold'
                        }}
                    >
                        <div style={{ fontSize: '1.2rem' }}>1 SPIN</div>
                        <div style={{ fontSize: '0.9rem' }}>💎 40</div>
                    </button>

                    <button
                        className="modern-btn"
                        onClick={() => handleSpin(10)}
                        disabled={isSpinning}
                        style={{
                            flex: 1,
                            background: 'linear-gradient(45deg, #00ffff, #0088ff)',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '15px',
                            cursor: 'pointer',
                            color: '#000',
                            boxShadow: '0 5px 15px rgba(0, 255, 255, 0.3)',
                            opacity: isSpinning ? 0.7 : 1,
                            fontWeight: 'bold'
                        }}
                    >
                        <div style={{ fontSize: '1.2rem' }}>10 SPINS</div>
                        <div style={{ fontSize: '0.9rem' }}>💎 400</div>
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
                    border: '2px solid #00ffff',
                    padding: '2rem 4rem',
                    borderRadius: '15px',
                    zIndex: 2000,
                    animation: 'zoomIn 0.3s',
                    color: '#00ffff',
                    textAlign: 'center',
                    boxShadow: '0 0 50px rgba(0, 255, 255, 0.5)'
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

export default VehicleRoyale;
