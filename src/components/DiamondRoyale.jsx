import React, { useState, useEffect, useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import soundManager from '../utils/SoundManager';
import useItemLookup from '../hooks/useItemLookup';

const DiamondRoyale = () => {
    const { diamonds, subtractDiamonds, buyItem, addXp } = useCurrency();
    const { items, loading: itemsLoading, getImagePath } = useItemLookup();
    const [isSpinning, setIsSpinning] = useState(false);
    const [rewards, setRewards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [grandPrize, setGrandPrize] = useState(null);
    const [prizePool, setPrizePool] = useState([]);

    // Initialize Prize Pool and Grand Prize
    useEffect(() => {
        if (!items || items.length === 0) return;

        // Filter valid items with images
        const validItems = items.filter(item => {
            const img = item.image || getImagePath(item.itemID);
            return img && !img.includes('placeholder');
        });

        if (validItems.length === 0) return;

        // Find Grand Prize (Orange/Red Rarity)
        const legendaryItems = validItems.filter(item => item.Rare === 'ORANGE' || item.Rare === 'RED');
        const selectedGrandPrize = legendaryItems.length > 0
            ? legendaryItems[Math.floor(Math.random() * legendaryItems.length)]
            : validItems[0]; // Fallback

        setGrandPrize({
            id: selectedGrandPrize.itemID,
            name: selectedGrandPrize.description,
            type: 'grand_prize',
            rarity: 'legendary',
            image: selectedGrandPrize.image || getImagePath(selectedGrandPrize.itemID),
            chance: 0.01 // 1% Chance
        });

        // Create Pool (Mix of rarities)
        const pool = [];
        const epics = validItems.filter(item => item.Rare === 'PURPLE').slice(0, 10);
        const rares = validItems.filter(item => item.Rare === 'BLUE').slice(0, 15);
        const commons = validItems.filter(item => item.Rare === 'GREEN' || item.Rare === 'WHITE').slice(0, 20);

        // Add to pool with weighted chances
        epics.forEach(item => pool.push({ ...item, rarity: 'epic', chance: 0.15 / epics.length }));
        rares.forEach(item => pool.push({ ...item, rarity: 'rare', chance: 0.35 / rares.length }));
        commons.forEach(item => pool.push({ ...item, rarity: 'common', chance: 0.49 / commons.length }));

        setPrizePool(pool);

    }, [items, getImagePath]);

    const spin = (count) => {
        const cost = count === 1 ? 60 : 600;

        if (diamonds < cost) {
            alert(`Not enough Diamonds! Need ${cost}.`);
            return;
        }

        if (subtractDiamonds(cost)) {
            setIsSpinning(true);
            setRewards([]);
            setShowModal(false);
            soundManager.play('spin');

            setTimeout(() => {
                const newRewards = [];
                const totalSpins = count === 1 ? 1 : 11;

                for (let i = 0; i < totalSpins; i++) {
                    const rand = Math.random();
                    let selectedItem = null;

                    // Check Grand Prize
                    if (rand < (grandPrize?.chance || 0.01)) {
                        selectedItem = grandPrize;
                    } else {
                        // Weighted selection from pool
                        // Since we normalized chances above, we can just pick random based on tiers or simple random from pool if we didn't normalize perfectly.
                        // Let's use a simpler tier logic for robustness:

                        const tierRoll = Math.random();
                        let targetRarity = 'common';
                        if (tierRoll > 0.85) targetRarity = 'epic'; // 15%
                        else if (tierRoll > 0.50) targetRarity = 'rare'; // 35%

                        const tierItems = prizePool.filter(p => p.rarity === targetRarity);
                        const poolToUse = tierItems.length > 0 ? tierItems : prizePool;

                        const rawItem = poolToUse[Math.floor(Math.random() * poolToUse.length)];

                        if (rawItem) {
                            selectedItem = {
                                id: rawItem.itemID,
                                name: rawItem.description,
                                type: rawItem.itemType,
                                rarity: rawItem.rarity,
                                image: rawItem.image || getImagePath(rawItem.itemID)
                            };
                        }
                    }

                    if (!selectedItem && prizePool.length > 0) {
                        const rawItem = prizePool[0];
                        selectedItem = {
                            id: rawItem.itemID,
                            name: rawItem.description,
                            type: rawItem.itemType,
                            rarity: rawItem.rarity,
                            image: rawItem.image || getImagePath(rawItem.itemID)
                        };
                    }

                    if (selectedItem) {
                        newRewards.push(selectedItem);
                        buyItem(selectedItem, 0, 'diamonds');
                    }
                }

                setRewards(newRewards);
                setIsSpinning(false);
                setShowModal(true);
                soundManager.stop('spin');
                soundManager.play('win');
                addXp(count * 10);
            }, 1000);
        }
    };

    if (itemsLoading || !grandPrize) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading Diamond Royale...</div>;

    return (
        <div className="royale-container" style={{ color: 'white', maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Left Side: Grand Prize & Actions */}
                <div style={{ flex: 2, minWidth: '300px' }}>
                    <div style={{
                        background: 'radial-gradient(circle, #4b0082 0%, #000 100%)',
                        border: '2px solid #d000ff',
                        borderRadius: '10px',
                        padding: '2rem',
                        textAlign: 'center',
                        position: 'relative',
                        minHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 0 30px rgba(208, 0, 255, 0.3)'
                    }}>
                        <h3 style={{ color: '#d000ff', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Grand Prize</h3>

                        {/* Grand Prize Glow */}
                        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(208,0,255,0.2) 0%, transparent 70%)', animation: 'pulse 2s infinite' }}></div>

                        <div style={{ position: 'relative', width: '250px', height: '250px', margin: '0 auto', zIndex: 2 }}>
                            <img
                                src={grandPrize.image}
                                alt="Grand Prize"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 20px #d000ff)' }}
                            />
                        </div>
                        <h2 style={{ marginTop: '2rem', color: '#fff', textShadow: '0 0 10px #d000ff', zIndex: 2 }}>{grandPrize.name}</h2>
                        <div style={{ color: '#d000ff', fontSize: '1.2rem', fontWeight: 'bold' }}>LEGENDARY</div>
                    </div>

                    {/* Modern Spin Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            onClick={() => spin(1)}
                            disabled={isSpinning}
                            className="modern-btn"
                            style={{
                                '--btn-color': '#00ffff',
                                flex: 1,
                                background: 'transparent',
                                border: '2px solid #00ffff',
                                borderRadius: '50px',
                                padding: '15px',
                                cursor: 'pointer',
                                color: '#fff',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
                            }}
                        >
                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: '1.2rem' }}>1 SPIN</span>
                                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>💎 60</span>
                            </div>
                            <div className="btn-bg" style={{
                                position: 'absolute', top: 0, left: 0, width: '0%', height: '100%',
                                background: '#00ffff', zIndex: 0, transition: 'width 0.3s ease'
                            }}></div>
                        </button>

                        <button
                            onClick={() => spin(10)}
                            disabled={isSpinning}
                            className="modern-btn"
                            style={{
                                '--btn-color': '#d000ff',
                                flex: 1,
                                background: 'transparent',
                                border: '2px solid #d000ff',
                                borderRadius: '50px',
                                padding: '15px',
                                cursor: 'pointer',
                                color: '#fff',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 0 15px rgba(208, 0, 255, 0.3)',
                            }}
                        >
                            <div style={{ position: 'absolute', top: '5px', right: '15px', background: '#fff', color: '#000', fontSize: '0.6rem', padding: '1px 5px', borderRadius: '5px', fontWeight: 'bold', zIndex: 2 }}>BONUS</div>
                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: '1.2rem' }}>10+1 SPINS</span>
                                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>💎 600</span>
                            </div>
                            <div className="btn-bg" style={{
                                position: 'absolute', top: 0, left: 0, width: '0%', height: '100%',
                                background: '#d000ff', zIndex: 0, transition: 'width 0.3s ease'
                            }}></div>
                        </button>
                    </div>
                </div>

                {/* Right Side: Prize Pool Grid */}
                <div style={{ flex: 1, minWidth: '250px', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '10px', maxHeight: '600px', overflowY: 'auto' }}>
                    <h4 style={{ color: '#aaa', borderLeft: '3px solid #d000ff', paddingLeft: '10px', marginBottom: '1rem' }}>PRIZE POOL</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {prizePool.map((item, i) => (
                            <div key={i} style={{
                                background: 'linear-gradient(135deg, #222 0%, #111 100%)',
                                border: item.rarity === 'epic' ? '1px solid #d000ff' : item.rarity === 'rare' ? '1px solid #00ffff' : '1px solid #444',
                                borderRadius: '5px',
                                padding: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                aspectRatio: '1/1',
                                position: 'relative'
                            }} title={item.description}>
                                <img src={item.image || getImagePath(item.itemID)} alt={item.description} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                                {item.rarity === 'epic' && <span style={{ position: 'absolute', top: 0, right: 0, color: '#d000ff', fontSize: '0.8rem' }}>★</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reward Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.9)', zIndex: 1000,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <h2 style={{ color: '#ffd700', fontSize: '3rem', textShadow: '0 0 20px orange' }}>CONGRATULATIONS!</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px', padding: '2rem' }}>
                        {rewards.map((reward, index) => (
                            <div key={index} style={{
                                background: reward.rarity === 'legendary' ? 'linear-gradient(45deg, #ffd700, #ff8c00)' : '#333',
                                padding: '10px', borderRadius: '10px', width: '100px', textAlign: 'center',
                                animation: `popIn 0.3s ease-out ${index * 0.1}s backwards`,
                                border: reward.rarity === 'legendary' ? '2px solid #fff' : '1px solid #555'
                            }}>
                                <img src={reward.image} alt={reward.name} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                                <div style={{ fontSize: '0.8rem', marginTop: '5px', color: reward.rarity === 'legendary' ? 'black' : 'white' }}>{reward.name}</div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setShowModal(false)} className="modern-btn" style={{
                        marginTop: '2rem',
                        padding: '10px 30px',
                        fontSize: '1.2rem',
                        background: '#ffd700',
                        color: '#000',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>CONFIRM</button>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.1); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 0.3; }
                }
                @keyframes popIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .modern-btn:hover {
                    box-shadow: 0 0 30px var(--btn-color);
                    transform: translateY(-2px);
                }
                .modern-btn:hover .btn-bg {
                    width: 100% !important;
                }
                .modern-btn:hover div span {
                    color: #000 !important;
                    z-index: 2;
                }
                .modern-btn:active {
                    transform: translateY(1px);
                }
            `}</style>
        </div>
    );
};

export default DiamondRoyale;
