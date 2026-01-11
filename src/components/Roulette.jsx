import React, { useState, useRef } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import soundManager from '../utils/SoundManager';

const COLORS = {
    red: '#ff4d4d',
    black: '#333333',
    green: '#00cc00'
};

const Roulette = () => {
    const { gold, subtractGold, addGold } = useCurrency();
    const [betAmount, setBetAmount] = useState(100);
    const [betColor, setBetColor] = useState(null); // 'red', 'black', 'green'
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState('');

    const spinWheel = () => {
        if (gold < betAmount) {
            setMessage("Not enough gold!");
            return;
        }
        if (!betColor) {
            setMessage("Select a color to bet on!");
            return;
        }

        setMessage('');
        subtractGold(betAmount);
        setIsSpinning(true);
        setResult(null);
        soundManager.play('spin');

        // Random degree: 360 * 5 (min 5 spins) + random segment
        const randomDegree = Math.floor(Math.random() * 360);
        const totalRotation = rotation + 360 * 5 + randomDegree;

        setRotation(totalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            soundManager.stop('spin');

            const normalizedDegree = totalRotation % 360;
            // 0-10: Green, 11-185: Red, 186-360: Black

            let winningColor = 'black';
            if (normalizedDegree < 10) winningColor = 'green';
            else if (normalizedDegree < 185) winningColor = 'red';

            setResult(winningColor);

            if (winningColor === betColor) {
                const multiplier = betColor === 'green' ? 14 : 2;
                const winnings = betAmount * multiplier;
                addGold(winnings);
                soundManager.play('win');
                setMessage(`YOU WON ${winnings} GOLD!`);

                // Mission: Win Gold
                const currentWinnings = parseInt(localStorage.getItem('ff_roulette_winnings') || '0');
                localStorage.setItem('ff_roulette_winnings', currentWinnings + winnings);
            } else {
                setMessage('Better luck next time!');
            }

            // Mission: Spin Roulette
            const currentSpins = parseInt(localStorage.getItem('ff_roulette_spins') || '0');
            localStorage.setItem('ff_roulette_spins', currentSpins + 1);

        }, 5000); // 5 seconds spin
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)' }}>
            <h2 style={{ color: 'var(--ff-orange)', marginBottom: '1rem', textShadow: '0 0 10px rgba(255, 165, 0, 0.5)' }}>LUCKY ROULETTE</h2>

            <div style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                border: '8px solid #ffd700',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                margin: '0 auto 2rem',
                background: `conic-gradient(
          ${COLORS.green} 0deg 10deg,
          ${COLORS.red} 10deg 185deg,
          ${COLORS.black} 185deg 360deg
        )`,
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                position: 'relative'
            }}>
                {/* Center Hub */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '40px',
                    height: '40px',
                    background: '#ffd700',
                    borderRadius: '50%',
                    zIndex: 5,
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                }} />

                {/* Pointer */}
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderTop: '30px solid #fff',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                    zIndex: 10
                }} />
            </div>

            <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ marginBottom: '0.5rem', color: '#aaa' }}>BET AMOUNT</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #444',
                            background: '#222',
                            color: 'white',
                            width: '100px',
                            textAlign: 'center',
                            fontSize: '1.2rem'
                        }}
                    />
                    <span className="text-gold" style={{ fontSize: '1.2rem' }}>GOLD</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={() => { setBetColor('red'); soundManager.play('click'); }}
                    style={{
                        backgroundColor: COLORS.red,
                        border: betColor === 'red' ? '3px solid white' : '3px solid transparent',
                        padding: '1rem',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        flex: 1,
                        transform: betColor === 'red' ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s',
                        boxShadow: betColor === 'red' ? '0 0 15px rgba(255, 77, 77, 0.5)' : 'none'
                    }}
                >
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>RED</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>2x</div>
                </button>
                <button
                    onClick={() => { setBetColor('green'); soundManager.play('click'); }}
                    style={{
                        backgroundColor: COLORS.green,
                        border: betColor === 'green' ? '3px solid white' : '3px solid transparent',
                        padding: '1rem',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        flex: 1,
                        transform: betColor === 'green' ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s',
                        boxShadow: betColor === 'green' ? '0 0 15px rgba(0, 204, 0, 0.5)' : 'none'
                    }}
                >
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>GREEN</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>14x</div>
                </button>
                <button
                    onClick={() => { setBetColor('black'); soundManager.play('click'); }}
                    style={{
                        backgroundColor: COLORS.black,
                        border: betColor === 'black' ? '3px solid white' : '3px solid transparent',
                        padding: '1rem',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        flex: 1,
                        transform: betColor === 'black' ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s',
                        boxShadow: betColor === 'black' ? '0 0 15px rgba(51, 51, 51, 0.5)' : 'none'
                    }}
                >
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>BLACK</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>2x</div>
                </button>
            </div>

            <button
                className="btn-primary"
                onClick={spinWheel}
                disabled={isSpinning}
                style={{
                    width: '100%',
                    padding: '1.2rem',
                    fontSize: '1.5rem',
                    opacity: isSpinning ? 0.7 : 1,
                    background: isSpinning ? '#555' : 'var(--ff-gradient)',
                    boxShadow: isSpinning ? 'none' : '0 4px 15px rgba(255, 165, 0, 0.4)'
                }}
            >
                {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
            </button>

            {message && (
                <div style={{
                    marginTop: '1.5rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: message.includes('WON') ? '#00ff00' : message.includes('Lost') || message.includes('luck') ? '#ff4d4d' : '#fff',
                    animation: 'fadeIn 0.5s'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default Roulette;

