import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import soundManager from '../utils/SoundManager';
import useItemLookup from '../hooks/useItemLookup';

const RARITY_COLORS = {
    common: '#B0C3D9',
    rare: '#00BFFF',
    epic: '#FF00FF',
    legendary: '#FFD700',
    mythic: '#FF0000'
};

const Store = () => {
    const { buyItem, inventory } = useCurrency();
    const { items, loading: itemsLoading, getImagePath } = useItemLookup();
    const [dailyItems, setDailyItems] = useState([]);
    const [timeLeft, setTimeLeft] = useState('');
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (itemsLoading || !items || items.length === 0) return;

        // 1. Calculate Daily Seed based on Date
        const today = new Date();
        const seedString = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
        const seed = parseInt(seedString);

        // 2. Filter valid items (must have an image)
        const validItems = items.filter(item => {
            const img = item.image || getImagePath(item.itemID);
            return img && !img.includes('placeholder');
        });

        if (validItems.length === 0) return;

        // 3. Select items using the seed
        // Simple seeded random function
        const seededRandom = (s) => {
            let x = Math.sin(s) * 10000;
            return x - Math.floor(x);
        };

        const poolCopy = [...validItems];
        let currentSeed = seed;

        // Fisher-Yates shuffle with seeded random
        for (let i = poolCopy.length - 1; i > 0; i--) {
            const r = seededRandom(currentSeed++);
            const j = Math.floor(r * (i + 1));
            [poolCopy[i], poolCopy[j]] = [poolCopy[j], poolCopy[i]];
        }

        // 4. Select top 20 items
        const selectedItems = poolCopy.slice(0, 20).map(item => ({
            id: item.itemID,
            name: item.description,
            type: item.itemType,
            rarity: item.Rare || 'common',
            image: item.image || getImagePath(item.itemID),
            currency: Math.random() > 0.3 ? 'gold' : 'diamonds',
            price: Math.random() > 0.3 ? (Math.floor(Math.random() * 5000) + 500) : (Math.floor(Math.random() * 500) + 50)
        }));

        setDailyItems(selectedItems);

        // 5. Countdown Timer
        const timer = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow - now;

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [itemsLoading, items, getImagePath]);

    const handleBuy = (item) => {
        const result = buyItem(item, item.price, item.currency);
        setNotification(result.message);
        soundManager.play('click');
        if (result.success) {
            soundManager.play('win'); // Small win sound for purchase
        }
        setTimeout(() => setNotification(null), 2000);
    };

    const isOwned = (itemId) => {
        return inventory.some(i => i.id === itemId);
    };

    if (itemsLoading) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>Loading Store...</div>;
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--ff-orange)', fontSize: '2.5rem', marginBottom: '0.5rem', textShadow: '0 0 10px rgba(255, 165, 0, 0.5)' }}>DAILY STORE</h2>
                <div style={{ color: 'var(--ff-text-secondary)', fontSize: '1.2rem', background: 'rgba(0,0,0,0.5)', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                    Resets in: <span style={{ color: '#fff', fontWeight: 'bold', marginLeft: '0.5rem' }}>{timeLeft}</span>
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.95)',
                    border: '1px solid var(--ff-orange)',
                    padding: '1rem 3rem',
                    borderRadius: '8px',
                    zIndex: 1000,
                    animation: 'fadeIn 0.3s',
                    boxShadow: '0 0 20px rgba(255, 165, 0, 0.3)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    {notification}
                </div>
            )}

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {dailyItems.map(item => {
                    const owned = isOwned(item.id);
                    return (
                        <div key={item.id} className="card" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: `1px solid ${RARITY_COLORS[item.rarity] || RARITY_COLORS.common}`,
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default',
                            background: 'linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(10,10,10,1) 100%)'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = `0 10px 20px -5px ${RARITY_COLORS[item.rarity] || RARITY_COLORS.common}40`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Rarity Glow */}
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: `radial-gradient(circle at center, ${RARITY_COLORS[item.rarity] || RARITY_COLORS.common}15 0%, transparent 70%)`,
                                zIndex: 0,
                                pointerEvents: 'none'
                            }} />

                            {/* Type Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(0,0,0,0.8)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                color: 'white',
                                zIndex: 2,
                                border: '1px solid #333'
                            }}>
                                {item.type ? item.type.toUpperCase() : 'ITEM'}
                            </div>

                            <div style={{
                                width: '100%',
                                height: '160px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem',
                                zIndex: 1,
                                padding: '1rem'
                            }}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
                                        transition: 'transform 0.3s'
                                    }}
                                />
                            </div>

                            <div style={{ zIndex: 1, textAlign: 'center', width: '100%', padding: '0 1rem 1rem' }}>
                                <h3 style={{
                                    color: RARITY_COLORS[item.rarity] || RARITY_COLORS.common,
                                    marginBottom: '0.8rem',
                                    fontSize: '1.1rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>{item.name}</h3>

                                <button
                                    className="btn-primary"
                                    onClick={() => handleBuy(item)}
                                    disabled={owned}
                                    style={{
                                        width: '100%',
                                        background: owned ? '#333' : (item.currency === 'diamonds' ? 'linear-gradient(45deg, #00b4db, #0083b0)' : 'var(--ff-gradient)'),
                                        cursor: owned ? 'default' : 'pointer',
                                        opacity: owned ? 0.6 : 1,
                                        padding: '0.8rem',
                                        fontSize: '1rem',
                                        border: 'none',
                                        boxShadow: owned ? 'none' : '0 4px 10px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    {owned ? 'OWNED' : (
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                            {item.price} {item.currency === 'gold' ? '🪙' : '💎'}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Store;

