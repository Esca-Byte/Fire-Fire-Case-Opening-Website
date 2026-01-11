import React, { useState } from 'react';

const Settings = () => {
    const [settings, setSettings] = useState({
        music: true,
        sfx: true,
        highQuality: true,
        notifications: false
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '4rem' }}>
            <h2 style={{
                fontSize: '3rem',
                marginBottom: '2rem',
                color: 'white',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
            }}>
                SETTINGS
            </h2>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Audio Settings */}
                <div>
                    <h3 style={{ textAlign: 'left', marginBottom: '1rem', color: 'var(--ff-orange)', borderBottom: '1px solid var(--ff-border)', paddingBottom: '0.5rem' }}>AUDIO</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Music</span>
                            <Toggle checked={settings.music} onChange={() => toggleSetting('music')} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Sound Effects</span>
                            <Toggle checked={settings.sfx} onChange={() => toggleSetting('sfx')} />
                        </div>
                    </div>
                </div>

                {/* Graphics Settings */}
                <div>
                    <h3 style={{ textAlign: 'left', marginBottom: '1rem', color: 'var(--ff-diamond)', borderBottom: '1px solid var(--ff-border)', paddingBottom: '0.5rem' }}>GRAPHICS</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>High Quality Animations</span>
                            <Toggle checked={settings.highQuality} onChange={() => toggleSetting('highQuality')} />
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div>
                    <h3 style={{ textAlign: 'left', marginBottom: '1rem', color: 'var(--ff-gold)', borderBottom: '1px solid var(--ff-border)', paddingBottom: '0.5rem' }}>ACCOUNT</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Notifications</span>
                            <Toggle checked={settings.notifications} onChange={() => toggleSetting('notifications')} />
                        </div>
                        <button className="btn-primary" style={{ background: '#ff3333', marginTop: '1rem' }}>
                            Log Out
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

const Toggle = ({ checked, onChange }) => (
    <div
        onClick={onChange}
        style={{
            width: '50px',
            height: '26px',
            background: checked ? 'var(--ff-orange)' : '#333',
            borderRadius: '13px',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.3s'
        }}
    >
        <div style={{
            width: '20px',
            height: '20px',
            background: 'white',
            borderRadius: '50%',
            position: 'absolute',
            top: '3px',
            left: checked ? '27px' : '3px',
            transition: 'left 0.3s',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        }} />
    </div>
);

export default Settings;
