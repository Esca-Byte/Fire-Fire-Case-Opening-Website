import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

const Navbar = () => {
    const { diamonds, gold } = useCurrency();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ margin: 0, color: 'var(--ff-orange)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    FF SPINS<span style={{ color: 'white' }}>X</span>
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span role="img" aria-label="gold">🪙</span>
                    <span className="text-gold" style={{ fontWeight: 'bold' }}>{gold.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span role="img" aria-label="diamond">💎</span>
                    <span className="text-diamond" style={{ fontWeight: 'bold' }}>{diamonds.toLocaleString()}</span>
                </div>
                <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4em 1em' }}>
                    Login
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
