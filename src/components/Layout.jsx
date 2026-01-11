import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                {children}
            </main>
            <footer style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--ff-text-secondary)',
                fontSize: '0.8rem'
            }}>
                &copy; 2025 FF SPINSX. Not affiliated with Garena. Simulation only.
            </footer>
        </div>
    );
};

export default Layout;
