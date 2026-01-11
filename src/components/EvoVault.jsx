import React, { useState, useEffect, useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import useItemLookup from '../hooks/useItemLookup';
import soundManager from '../utils/SoundManager';

const EvoVault = () => {
    const { diamonds, subtractDiamonds, buyItem, addXp } = useCurrency();
    const { items, loading: itemsLoading, getImagePath } = useItemLookup();
    const [isSpinning, setIsSpinning] = useState(false);
    const [rewards, setRewards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(-1);
    const [evoGuns, setEvoGuns] = useState([]);

    // Dynamically find Evo Guns (Red/Orange Weapon Skins)
    useEffect(() => {
        if (!items || items.length === 0) return;

        const foundEvos = items.filter(item => {
            const isWeapon = item.collectionType === 'WEAPON_SKIN' || item.itemType === 'WEAPON';
            const isHighRarity = item.Rare === 'RED' || item.Rare === 'ORANGE';
            const hasImage = item.image || getImagePath(item.itemID);
            return isWeapon && isHighRarity && hasImage && !hasImage.includes('placeholder');
        }).slice(0, 4).map(item => ({
            id: item.itemID,
            name: item.description,
            type: 'weapon',
            rarity: item.Rare === 'RED' ? 'mythic' : 'legendary',
            image: item.image || getImagePath(item.itemID),
            color: item.Rare === 'RED' ? '#ff0000' : '#ffaa00'
        }));

        if (foundEvos.length > 0) {
            setEvoGuns(foundEvos);
        }
    }, [items, getImagePath]);

    // Fillers
    const fillers = useMemo(() => {
        if (!items) return [];
        // Just pick some random common items
        return items.slice(0, 20).map(item => ({
            id: item.itemID,
            name: item.description,
            type: 'common',
            rarity: 'common',
            image: item.image || getImagePath(item.itemID)
        })).filter(i => i.image && !i.image.includes('placeholder'));
    }, [items, getImagePath]);

    const spin = (count) => {
        const cost = count === 1 ? 20 : 90;

        if (diamonds < cost) {
            alert(`Not enough Diamonds! Need ${cost}.`);
            return;
        }

        if (subtractDiamonds(cost)) {
            setIsSpinning(true);
            setRewards([]);
            setShowModal(false);
            soundManager.play('spin');

            // Animation: Cycle through the main cards
            let currentIndex = 0;
            const interval = setInterval(() => {
                setActiveCardIndex(currentIndex);
                currentIndex = (currentIndex + 1) % (evoGuns.length || 4);
            }, 150);

            setTimeout(() => {
                clearInterval(interval);
                setActiveCardIndex(-1);

                const newRewards = [];
                for (let i = 0; i < count; i++) {
                    const rand = Math.random();
                    let item;

                    // 2% chance for ANY Evo Gun
                    if (rand < 0.02 && evoGuns.length > 0) {
                        item = evoGuns[Math.floor(Math.random() * evoGuns.length)];
                    } else {
                        item = fillers[Math.floor(Math.random() * fillers.length)];
                    }

                    // Fallback
                    if (!item && fillers.length > 0) item = fillers[0];

                    if (item) {
                        newRewards.push(item);
                        buyItem(item, 0, 'diamonds');
                    }
                }

                setRewards(newRewards);
                setIsSpinning(false);
                setShowModal(true);
                soundManager.stop('spin');
                soundManager.play('win');
                addXp(count * 10);
            }, 2000);
        }
    };

    if (itemsLoading) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading Evo Vault...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'white', textAlign: 'center', fontFamily: 'Arial, sans-serif', paddingBottom: '50px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '4rem', margin: 0, color: '#ff3333', fontStyle: 'italic', textShadow: '0 0 20px red', letterSpacing: '5px' }}>EVO VAULT</h1>
                <p style={{ color: '#aaa', fontSize: '1.2rem' }}>Unlock the Ultimate Evolution Weapons</p>
            </div>

            {/* Main Showcase */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap',
                marginBottom: '3rem',
                perspective: '1000px'
            }}>
                {evoGuns.map((gun, index) => {
                    const isActive = index === activeCardIndex;
                    return (
                        <div key={gun.id} style={{
                            width: '220px',
                            height: '350px',
                            background: `linear-gradient(180deg, ${gun.color}22 0%, #000 100%)`,
                            border: isActive ? `3px solid #fff` : `2px solid ${gun.color}`,
                            borderRadius: '15px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            transform: isActive ? 'scale(1.05) translateY(-10px)' : 'scale(1)',
                            boxShadow: isActive ? `0 0 30px ${gun.color}` : `0 0 10px ${gun.color}44`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem'
                        }}>
                            {/* Glow Effect */}
                            <div style={{
                                position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                                background: `radial-gradient(circle, ${gun.color}44 0%, transparent 70%)`,
                                animation: 'rotate 10s linear infinite',
                                zIndex: 0
                            }}></div>

                            <div style={{ zIndex: 1, width: '100%', textAlign: 'left' }}>
                                <span style={{
                                    background: gun.color, color: '#000',
                                    padding: '2px 8px', borderRadius: '4px',
                                    fontSize: '0.8rem', fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                }}>
                                    {gun.rarity}
                                </span>
                            </div>

                            <div style={{ zIndex: 1, flex: 1, display: 'flex', alignItems: 'center' }}>
                                <img src={gun.image} alt={gun.name} style={{ width: '100%', filter: `drop-shadow(0 0 10px ${gun.color})` }} />
                            </div>

                            <div style={{ zIndex: 1, width: '100%' }}>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#fff' }}>{gun.name}</h3>
                                <div style={{ height: '2px', width: '100%', background: gun.color }}></div>
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#aaa' }}>Evolution Weapon</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Spin Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '4rem' }}>
                <button
                    onClick={() => spin(1)}
                    disabled={isSpinning}
                    className="modern-btn"
                    style={{
                        '--btn-color': '#00ffff',
                        background: 'transparent',
                        border: '2px solid #00ffff',
                        borderRadius: '50px',
                        padding: '15px 50px',
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: '1.2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
                        minWidth: '220px'
                    }}
                >
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', letterSpacing: '2px' }}>1 SPIN</span>
                        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>💎 20</span>
                    </div>
                    <div className="btn-bg" style={{
                        position: 'absolute', top: 0, left: 0, width: '0%', height: '100%',
                        background: '#00ffff', zIndex: 0, transition: 'width 0.3s ease'
                    }}></div>
                </button>

                <button
                    onClick={() => spin(5)}
                    disabled={isSpinning}
                    className="modern-btn"
                    style={{
                        '--btn-color': '#ff3333',
                        background: 'transparent',
                        border: '2px solid #ff3333',
                        borderRadius: '50px',
                        padding: '15px 50px',
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: '1.2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 15px rgba(255, 51, 51, 0.3)',
                        minWidth: '220px'
                    }}
                >
                    <div style={{ position: 'absolute', top: '-10px', right: '10px', background: '#ff3333', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>-10%</div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', letterSpacing: '2px' }}>5 SPINS</span>
                        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>💎 90</span>
                    </div>
                    <div className="btn-bg" style={{
                        position: 'absolute', top: 0, left: 0, width: '0%', height: '100%',
                        background: '#ff3333', zIndex: 0, transition: 'width 0.3s ease'
                    }}></div>
                </button>
            </div>

            {/* Reward Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.95)', zIndex: 1000,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <h2 style={{ color: '#fff', fontSize: '3rem', marginBottom: '2rem', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>ACQUIRED</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1000px' }}>
                        {rewards.map((reward, index) => (
                            <div key={index} style={{
                                background: reward.type === 'weapon' ? `linear-gradient(135deg, ${reward.color || '#ff0000'}, #000)` : '#222',
                                border: `2px solid ${reward.color || '#555'}`,
                                padding: '20px', borderRadius: '15px', width: '150px', textAlign: 'center',
                                animation: `popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s backwards`,
                                transform: reward.type === 'weapon' ? 'scale(1.1)' : 'scale(1)',
                                boxShadow: reward.type === 'weapon' ? `0 0 30px ${reward.color}` : 'none'
                            }}>
                                <img src={reward.image} alt={reward.name} style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                                <div style={{ fontSize: '0.9rem', marginTop: '10px', color: '#fff', fontWeight: 'bold' }}>{reward.name}</div>
                                {reward.type === 'weapon' && <div style={{ color: 'gold', fontSize: '0.8rem', marginTop: '5px' }}>★★★★★</div>}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setShowModal(false)} className="modern-btn" style={{
                        marginTop: '3rem', padding: '15px 50px', fontSize: '1.5rem',
                        background: '#fff', color: '#000', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold'
                    }}>CONFIRM</button>
                </div>
            )}

            <style>{`
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
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

export default EvoVault;
