import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import soundManager from '../utils/SoundManager';

const Profile = () => {
    const { inventory, equipped, equipItem, playerName, playerBio, updateProfile, level, xp } = useCurrency();
    const [activeTab, setActiveTab] = useState('all');
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(playerName);
    const [editBio, setEditBio] = useState(playerBio);

    const RARITY_COLORS = {
        common: '#B0C3D9',
        rare: '#00BFFF',
        epic: '#FF00FF',
        legendary: '#FFD700'
    };

    const bannerRarity = equipped.banner?.rarity || 'common';
    const glowColor = RARITY_COLORS[bannerRarity];

    const getFilteredInventory = () => {
        if (activeTab === 'all') return inventory;
        return inventory.filter(item => item.type?.toLowerCase() === activeTab.toLowerCase());
    };

    const isEquipped = (item) => {
        return equipped[item.type?.toLowerCase()]?.id === item.id;
    };

    const handleSaveProfile = () => {
        updateProfile(editName, editBio);
        setIsEditing(false);
        soundManager.play('click');
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '4rem', display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* LEFT COLUMN: Character Display */}
            <div style={{
                flex: '1 1 400px',
                minHeight: '600px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, rgba(255, 165, 0, 0.1) 0%, transparent 70%)'
            }}>
                {equipped.character ? (
                    <img
                        src={equipped.character.image}
                        alt="Equipped Character"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '700px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))'
                        }}
                    />
                ) : (
                    <div style={{ color: '#666', fontSize: '1.5rem', fontStyle: 'italic' }}>No Character Equipped</div>
                )}

                {/* Platform/Pedestal Effect */}
                <div style={{
                    position: 'absolute',
                    bottom: '50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '300px',
                    height: '60px',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    zIndex: -1
                }} />
            </div>

            {/* RIGHT COLUMN: Profile Info & Inventory */}
            <div style={{ flex: '1 1 600px', maxWidth: '800px' }}>
                <h2 style={{ color: 'var(--ff-orange)', fontSize: '2.5rem', marginBottom: '1.5rem', textShadow: '0 0 10px rgba(255, 165, 0, 0.5)' }}>PROFILE</h2>

                {/* Profile Card Container */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '4px', // Sharper corners like screenshot
                    overflow: 'hidden',
                    boxShadow: `0 0 30px ${glowColor}66, 0 0 10px ${glowColor}33`, // Dynamic Glow
                    border: `1px solid ${glowColor}`,
                    marginBottom: '2rem',
                    transition: 'box-shadow 0.3s, border-color 0.3s'
                }}>
                    {/* Header Strip (Yellow/Black diagonal) */}
                    <div style={{
                        height: '12px',
                        background: 'repeating-linear-gradient(45deg, #ffd700, #ffd700 10px, #000 10px, #000 20px)',
                        borderBottom: '2px solid #fff'
                    }} />

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Banner Area */}
                        <div style={{
                            width: '100%',
                            height: '160px',
                            backgroundImage: `url(${equipped.banner?.image || '/assets/images/images/BANNER/PURPLE/901000006.png'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            borderBottom: '1px solid #333'
                        }}>
                            {/* Edit Button */}
                            <button
                                onClick={() => { setIsEditing(!isEditing); setEditName(playerName); setEditBio(playerBio); soundManager.play('click'); }}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'rgba(0,0,0,0.7)',
                                    border: '1px solid var(--ff-gold)',
                                    color: 'var(--ff-gold)',
                                    padding: '0.4rem 0.8rem',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    zIndex: 10,
                                    textTransform: 'uppercase'
                                }}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        {/* Info Area */}
                        <div style={{
                            padding: '1rem 1.5rem',
                            position: 'relative',
                            display: 'flex',
                            gap: '1.5rem',
                            background: 'linear-gradient(90deg, #1a1a1a 0%, #222 100%)'
                        }}>
                            {/* Avatar (Overlapping) */}
                            <div style={{
                                marginTop: '-60px',
                                width: '110px',
                                height: '110px',
                                borderRadius: '4px',
                                border: '3px solid #fff',
                                backgroundImage: `url(${equipped.avatar?.image || '/assets/images/images/AVATARS/PURPLE/902000011.png'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: '#000',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
                                zIndex: 5,
                                position: 'relative'
                            }}>
                                {/* Level Badge */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#ffd700',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #fff'
                                }}>
                                    Lv.{level}
                                </div>
                            </div>

                            {/* Name and Bio */}
                            <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                                {isEditing ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            maxLength={12}
                                            style={{
                                                background: '#333',
                                                border: '1px solid #555',
                                                color: 'white',
                                                padding: '0.5rem',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold'
                                            }}
                                            placeholder="Enter Name"
                                        />
                                        <input
                                            type="text"
                                            value={editBio}
                                            onChange={(e) => setEditBio(e.target.value)}
                                            maxLength={50}
                                            style={{
                                                background: '#333',
                                                border: '1px solid #555',
                                                color: '#aaa',
                                                padding: '0.5rem',
                                                fontSize: '0.9rem'
                                            }}
                                            placeholder="Enter Bio"
                                        />
                                        <button
                                            className="btn-primary"
                                            onClick={handleSaveProfile}
                                            style={{ padding: '0.5rem', fontSize: '0.9rem', marginTop: '0.5rem' }}
                                        >
                                            SAVE
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.8rem', color: 'white', margin: 0, fontWeight: '800', letterSpacing: '1px' }}>
                                                {playerName}
                                            </h3>
                                            {/* Rank Icon Placeholder */}
                                            <span style={{ fontSize: '1.2rem' }}>💠</span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                                            <span>English</span>
                                            <span>|</span>
                                            <span>UID: 882910384</span>
                                        </div>

                                        {/* XP Progress Bar */}
                                        <div style={{ marginTop: '0.5rem', width: '100%', maxWidth: '300px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#aaa', marginBottom: '2px' }}>
                                                <span>XP</span>
                                                <span>{xp} / {(level * 10) ** 2}</span>
                                            </div>
                                            <div style={{ width: '100%', height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${Math.min((xp / ((level * 10) ** 2)) * 100, 100)}%`,
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #ffd700, #ff8c00)',
                                                    transition: 'width 0.5s ease-out'
                                                }} />
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                            <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>
                                                "{playerBio}"
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Likes Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #333', paddingLeft: '1rem' }}>
                                <span style={{ fontSize: '1.5rem', color: '#ffd700' }}>👍</span>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>1055</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Section */}
                <h3 style={{ color: 'white', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    INVENTORY
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>{inventory.length} Items</span>
                </h3>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {['all', 'avatar', 'banner', 'character'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); soundManager.play('click'); }}
                            style={{
                                background: activeTab === tab ? 'var(--ff-orange)' : 'transparent',
                                border: '1px solid var(--ff-orange)',
                                color: 'white',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '4px', // Sharper buttons
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s',
                                transform: 'skew(-10deg)' // Skewed style like FF
                            }}
                        >
                            <span style={{ display: 'block', transform: 'skew(10deg)' }}>{tab}</span>
                        </button>
                    ))}
                </div>

                {inventory.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ff-text-secondary)', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        Inventory is empty. Go to Store to buy items!
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                        {getFilteredInventory().map(item => (
                            <div key={item.id} className="card" style={{
                                padding: '0.8rem',
                                textAlign: 'center',
                                background: isEquipped(item) ? 'rgba(255, 215, 0, 0.1)' : '#222',
                                border: isEquipped(item) ? '1px solid #ffd700' : '1px solid #333',
                                borderRadius: '4px'
                            }}>
                                <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' }}
                                    />
                                </div>
                                <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 'bold', color: '#ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                <button
                                    className="btn-primary"
                                    onClick={() => { equipItem(item.type, item); soundManager.play('click'); }}
                                    disabled={isEquipped(item)}
                                    style={{
                                        width: '100%',
                                        fontSize: '0.7rem',
                                        padding: '0.5em',
                                        background: isEquipped(item) ? '#ffd700' : 'var(--ff-gradient)',
                                        color: isEquipped(item) ? '#000' : '#fff',
                                        opacity: isEquipped(item) ? 1 : 0.8,
                                        cursor: isEquipped(item) ? 'default' : 'pointer',
                                        border: 'none',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {isEquipped(item) ? 'EQUIPPED' : 'EQUIP'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
