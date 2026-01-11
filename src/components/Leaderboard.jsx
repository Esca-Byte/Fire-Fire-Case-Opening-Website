import React from 'react';

const Leaderboard = () => {
    const topPlayers = [
        { rank: 1, name: "ProGamer_99", score: 99999, avatar: "🦁" },
        { rank: 2, name: "Headshot_King", score: 88500, avatar: "💀" },
        { rank: 3, name: "BooyahMaster", score: 76200, avatar: "🔥" },
        { rank: 4, name: "SilentKiller", score: 65000, avatar: "🥷" },
        { rank: 5, name: "NoobSlayer", score: 54000, avatar: "⚔️" },
        { rank: 6, name: "LuckySpinner", score: 43000, avatar: "🎰" },
        { rank: 7, name: "DiamondHands", score: 32000, avatar: "💎" },
        { rank: 8, name: "GoldDigger", score: 21000, avatar: "💰" },
        { rank: 9, name: "Survivor_007", score: 15000, avatar: "🏝️" },
        { rank: 10, name: "Bot_123", score: 5000, avatar: "🤖" },
    ];

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <h2 style={{
                fontSize: '3rem',
                marginBottom: '2rem',
                color: 'var(--ff-gold)',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
            }}>
                LEADERBOARD
            </h2>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr 2fr',
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderBottom: '1px solid var(--ff-border)',
                    fontWeight: 'bold',
                    color: 'var(--ff-text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    <div>Rank</div>
                    <div style={{ textAlign: 'left' }}>Player</div>
                    <div style={{ textAlign: 'right' }}>Score</div>
                </div>

                {topPlayers.map((player, index) => (
                    <div key={index} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 3fr 2fr',
                        padding: '1.5rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        alignItems: 'center',
                        background: index < 3 ? `linear-gradient(90deg, rgba(255, 215, 0, ${0.1 - index * 0.03}), transparent)` : 'transparent',
                        transition: 'background 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = index < 3 ? `linear-gradient(90deg, rgba(255, 215, 0, ${0.1 - index * 0.03}), transparent)` : 'transparent'}
                    >
                        <div style={{
                            fontSize: index < 3 ? '1.5rem' : '1rem',
                            fontWeight: 'bold',
                            color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'white'
                        }}>
                            #{player.rank}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                            <span style={{ fontSize: '1.5rem' }}>{player.avatar}</span>
                            <span style={{ fontWeight: 'bold', color: index < 3 ? 'white' : 'var(--ff-text-secondary)' }}>{player.name}</span>
                        </div>
                        <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--ff-orange)' }}>
                            {player.score.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
