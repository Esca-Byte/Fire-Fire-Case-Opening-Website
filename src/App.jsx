import React, { useState } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import Layout from './components/Layout';
import DailyLogin from './components/DailyLogin';
import Roulette from './components/Roulette';
import SpinCase from './components/SpinCase';
import Missions from './components/Missions';
import Store from './components/Store';
import Profile from './components/Profile';
import DiamondRoyale from './components/DiamondRoyale';
import BundleRoyale from './components/BundleRoyale';
import EvoVault from './components/EvoVault';
import VehicleRoyale from './components/VehicleRoyale';
import GoldRoyale from './components/GoldRoyale';
import LegacyRoyale from './components/LegacyRoyale';
import Navigation from './components/Navigation';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', textAlign: 'left' }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [view, setView] = useState('home');

  const renderView = () => {
    switch (view) {
      case 'roulette': return <Roulette />;
      case 'spins': return <SpinCase />;
      case 'missions': return <Missions />;
      case 'store': return <Store />;
      case 'profile': return <Profile />;
      case 'diamond_royale': return <DiamondRoyale />;
      case 'bundle_royale': return <BundleRoyale />;
      case 'evo_vault': return <EvoVault />;
      case 'vehicle_royale': return <VehicleRoyale />;
      case 'legacy_royale': return <LegacyRoyale />;
      case 'gold_royale': return <GoldRoyale />;
      case 'leaderboard': return <Leaderboard />;
      case 'settings': return <Settings />;
      default: return (
        <div className="animate-slide-up" style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2 style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 0 30px rgba(255, 140, 0, 0.5)' }}>
            WIN <span className="text-orange">LEGENDARY</span> SKINS
          </h2>
          <p style={{ color: 'var(--ff-text-secondary)', fontSize: '1.5rem', marginBottom: '4rem' }}>
            Test your luck with our premium cases and roulette.
          </p>

          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ fontSize: '1.5rem', padding: '1em 3em' }}
              onClick={() => setView('spins')}
            >
              Open Daily Case
            </button>
            <button
              className="btn-primary"
              style={{
                background: 'transparent',
                border: '2px solid var(--ff-orange)',
                color: 'var(--ff-orange)',
                fontSize: '1.5rem', padding: '1em 3em'
              }}
              onClick={() => setView('roulette')}
            >
              Play Roulette
            </button>
          </div>

          <div style={{ marginTop: '6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" onClick={() => setView('store')} style={{ cursor: 'pointer' }}>
              <h3 style={{ fontSize: '1.5rem' }}>STORE</h3>
              <p>Buy exclusive Avatars, Banners & Characters!</p>
            </div>
            <div className="card" onClick={() => setView('diamond_royale')} style={{ cursor: 'pointer', border: '1px solid #d000ff' }}>
              <h3 style={{ color: '#d000ff', fontSize: '1.5rem' }}>DIAMOND ROYALE</h3>
              <p>Win Exclusive Bundles & Skins!</p>
            </div>
            <div className="card" onClick={() => setView('gold_royale')} style={{ cursor: 'pointer', border: '1px solid #ffd700' }}>
              <h3 style={{ color: '#ffd700', fontSize: '1.5rem' }}>GOLD ROYALE</h3>
              <p>Daily Rewards with Gold!</p>
            </div>
            <div className="card" onClick={() => setView('legacy_royale')} style={{ cursor: 'pointer', border: '1px solid #ffaa00' }}>
              <h3 style={{ color: '#ffaa00', fontSize: '1.5rem' }}>LEGACY ROYALE</h3>
              <p>Classic High-Tier Items!</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <ErrorBoundary>
      <CurrencyProvider>
        <div style={{ display: 'flex' }}>
          <Navigation activeView={view} setView={setView} />
          <div style={{ flex: 1, marginLeft: '280px', minHeight: '100vh', position: 'relative' }}>
            <Layout>
              {renderView()}
            </Layout>
          </div>
        </div>
      </CurrencyProvider>
    </ErrorBoundary>
  );
}

export default App;
