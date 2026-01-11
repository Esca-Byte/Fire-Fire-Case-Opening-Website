import React from 'react';

const Navigation = ({ activeView, setView }) => {
    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'store', label: 'Store', icon: '🛒' },
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'spins', label: 'Daily Case', icon: '🎁' },
        { id: 'roulette', label: 'Roulette', icon: '🎰' },
        { id: 'missions', label: 'Missions', icon: '🎯' },
        { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' }, // New
        { id: 'settings', label: 'Settings', icon: '⚙️' }, // New
    ];

    const royaleItems = [
        { id: 'diamond_royale', label: 'Diamond Royale', color: '#d000ff' },
        { id: 'gold_royale', label: 'Gold Royale', color: '#ffd700' },
        { id: 'legacy_royale', label: 'Legacy Royale', color: '#ffaa00' },
        { id: 'bundle_royale', label: 'Bundle Royale', color: '#ff0055' },
        { id: 'vehicle_royale', label: 'Vehicle Royale', color: '#00ffff' },
        { id: 'evo_vault', label: 'Evo Vault', color: '#ff3333' },
    ];

    return (
        <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            padding: '2rem',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid var(--ff-border)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            width: '280px',
            overflowY: 'auto',
            zIndex: 1000
        }}>
            {/* Logo Area */}
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <h1 style={{
                    fontSize: '2rem',
                    background: 'var(--ff-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 10px rgba(255, 69, 0, 0.5))'
                }}>
                    FF SPINS
                </h1>
            </div>

            {/* Main Menu */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ color: 'var(--ff-text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>Menu</h4>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            background: activeView === item.id ? 'var(--ff-gradient)' : 'transparent',
                            border: activeView === item.id ? 'none' : '1px solid transparent',
                            borderRadius: '8px',
                            color: activeView === item.id ? 'white' : 'var(--ff-text-secondary)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '1rem',
                            fontWeight: activeView === item.id ? 'bold' : 'normal',
                            transition: 'all 0.2s ease',
                            clipPath: activeView === item.id ? 'polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 20%)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (activeView !== item.id) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.color = 'white';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeView !== item.id) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--ff-text-secondary)';
                            }
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Royale Menu */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ color: 'var(--ff-text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem', marginTop: '1rem' }}>Luck Royale</h4>
                {royaleItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id)}
                        style={{
                            padding: '0.8rem',
                            background: activeView === item.id ? `linear-gradient(90deg, ${item.color}22, transparent)` : 'transparent',
                            borderLeft: `3px solid ${activeView === item.id ? item.color : 'transparent'}`,
                            color: activeView === item.id ? item.color : 'var(--ff-text-secondary)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '0.9rem',
                            fontWeight: activeView === item.id ? 'bold' : 'normal',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                            if (activeView !== item.id) {
                                e.currentTarget.style.color = item.color;
                                e.currentTarget.style.background = `linear-gradient(90deg, ${item.color}11, transparent)`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeView !== item.id) {
                                e.currentTarget.style.color = 'var(--ff-text-secondary)';
                                e.currentTarget.style.background = 'transparent';
                            }
                        }}
                    >
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, boxShadow: `0 0 5px ${item.color}` }}></div>
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navigation;
