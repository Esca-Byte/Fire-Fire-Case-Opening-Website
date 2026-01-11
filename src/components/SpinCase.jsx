import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import soundManager from '../utils/SoundManager';

// Import gun images manually or just use paths since they are in public
const GUNS = [
    { name: 'AK47 Evil Dragon', image: '/assets/images/guns/Icon_AK47_EvilDragon3.png', rarity: 'legendary' },
    { name: 'MP40 Cobra', image: '/assets/images/guns/Icon_MP40_Cobra3.png', rarity: 'legendary' },
    { name: 'SCAR Shark', image: '/assets/images/guns/Icon_SCAR_Shark3.png', rarity: 'epic' },
    { name: 'M1014 Imperial', image: '/assets/images/guns/Icon_M1014_Imperial3.png', rarity: 'epic' },
    { name: 'FIST FFWS', image: '/assets/images/guns/Icon_FIST_FFWS2022_03.png', rarity: 'rare' },
    { name: 'Katana Hannya', image: '/assets/images/guns/Icon_Katana_Hannyamask.png', rarity: 'rare' },
    { name: 'M1887 Digital', image: '/assets/images/guns/Icon_M1887_Digitaluniverse03.png', rarity: 'legendary' },
    { name: 'UMP45 Booyah', image: '/assets/images/guns/Icon_UMP45_Booyahday213.png', rarity: 'epic' },
];

const RARITY_COLORS = {
    legendary: '#FFD700', // Gold
    epic: '#FF00FF', // Magenta
    rare: '#00BFFF', // Blue
    common: '#B0C3D9' // Grey
};

const SpinCase = () => {
    const { diamonds, subtractDiamonds, addXp } = useCurrency();
    const [isSpinning, setIsSpinning] = useState(false);
    const [items, setItems] = useState([]);
    const scrollRef = useRef(null);
    const [wonItem, setWonItem] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Generate initial strip
        generateStrip();
    }, []);

    const generateStrip = () => {
        const newItems = [];
        for (let i = 0; i < 50; i++) {
            const randomGun = GUNS[Math.floor(Math.random() * GUNS.length)];
            newItems.push({ ...randomGun, id: i });
        }
        setItems(newItems);
    };

    const spin = () => {
        if (diamonds < 10) {
            setMessage("Not enough diamonds! Need 10.");
            return;
        }

        setMessage('');
        subtractDiamonds(10);
        setIsSpinning(true);
        setWonItem(null);
        soundManager.play('spin');

        // Reset scroll
        if (scrollRef.current) {
            scrollRef.current.style.transition = 'none';
            scrollRef.current.style.transform = 'translateX(0)';
        }

        // Force reflow
        setTimeout(() => {
            if (scrollRef.current) {
                // Calculate random stop position
                // Card width = 200px + 10px gap = 210px
                // We want to land around item 35-40
                const cardWidth = 210;
                const winningIndex = 35 + Math.floor(Math.random() * 5);
                const offset = Math.floor(Math.random() * 180) + 15; // Random position within the card
                const translate = -(winningIndex * cardWidth) + (scrollRef.current.parentElement.offsetWidth / 2) - (cardWidth / 2);

                scrollRef.current.style.transition = 'transform 5s cubic-bezier(0.1, 0, 0.2, 1)';
                scrollRef.current.style.transform = `translateX(${translate}px)`;

                setTimeout(() => {
                    setIsSpinning(false);
                    soundManager.stop('spin');

                    const winner = items[winningIndex];
                    setWonItem(winner);

                    if (winner.rarity === 'legendary') {
                        soundManager.play('legendary');
                    } else {
                        soundManager.play('win');
                    }

                    // Mission: Open Cases
                    const currentOpens = parseInt(localStorage.getItem('ff_case_opens') || '0');
                    localStorage.setItem('ff_case_opens', currentOpens + 1);

                    // Award XP
                    addXp(10);
                }, 5000);
            }
        }, 50);
    };

    return (
        <div className="card" style={{ margin: '2rem auto', overflow: 'hidden', maxWidth: '1000px', background: '#1a1a1a' }}>
            <h2 style={{ color: 'var(--ff-orange)', marginBottom: '1rem', textShadow: '0 0 10px rgba(255, 165, 0, 0.5)' }}>PREMIUM WEAPON CASE</h2>
            <div style={{ marginBottom: '1rem', color: 'var(--ff-text-secondary)' }}>
                Cost: <span className="text-diamond" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>10 💎</span>
            </div>

            {message && (
                <div style={{ color: '#ff4d4d', marginBottom: '1rem', fontWeight: 'bold' }}>{message}</div>
            )}

            <div style={{
                position: 'relative',
                height: '250px',
                backgroundColor: '#000',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '2rem',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
            }}>
                {/* Center Line */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    backgroundColor: 'var(--ff-gold)',
                    zIndex: 10,
                    transform: 'translateX(-50%)',
                    boxShadow: '0 0 15px var(--ff-gold), 0 0 5px white'
                }} />

                {/* Items Strip */}
                <div
                    ref={scrollRef}
                    style={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        paddingLeft: '50%', // Start at center
                    }}
                >
                    {items.map((item) => (
                        <div key={item.id} style={{
                            flex: '0 0 200px',
                            height: '200px',
                            marginRight: '10px',
                            backgroundColor: '#222',
                            borderBottom: `6px solid ${RARITY_COLORS[item.rarity]}`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem',
                            boxSizing: 'border-box',
                            position: 'relative',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                        }}>
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: 'auto', maxHeight: '120px', objectFit: 'contain' }} />
                            <div style={{ marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center', color: RARITY_COLORS[item.rarity], fontWeight: 'bold' }}>
                                {item.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="btn-primary"
                onClick={spin}
                disabled={isSpinning}
                style={{
                    width: '250px',
                    fontSize: '1.2rem',
                    padding: '1rem',
                    background: isSpinning ? '#555' : 'var(--ff-gradient)',
                    boxShadow: isSpinning ? 'none' : '0 0 20px rgba(255, 165, 0, 0.4)'
                }}
            >
                {isSpinning ? 'OPENING...' : 'OPEN CASE'}
            </button>

            {wonItem && !isSpinning && (
                <div style={{ marginTop: '2rem', animation: 'fadeIn 0.5s' }}>
                    <h3 style={{ fontSize: '2rem', color: '#fff', textShadow: `0 0 10px ${RARITY_COLORS[wonItem.rarity]}` }}>CONGRATULATIONS!</h3>
                    <div style={{
                        display: 'inline-block',
                        padding: '2rem',
                        background: `radial-gradient(circle, ${RARITY_COLORS[wonItem.rarity]}33 0%, transparent 70%)`,
                        border: `2px solid ${RARITY_COLORS[wonItem.rarity]}`,
                        borderRadius: '16px',
                        marginTop: '1rem',
                        boxShadow: `0 0 30px ${RARITY_COLORS[wonItem.rarity]}44`
                    }}>
                        <img src={wonItem.image} alt={wonItem.name} style={{ width: '250px', filter: `drop-shadow(0 0 10px ${RARITY_COLORS[wonItem.rarity]})` }} />
                        <div style={{ color: RARITY_COLORS[wonItem.rarity], fontSize: '1.8rem', marginTop: '1rem', fontWeight: 'bold' }}>
                            {wonItem.name}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpinCase;

