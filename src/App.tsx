import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';
import './App.css';
import { Scanner } from './components/Scanner';

function App() {
  const account = useCurrentAccount();
  const [manualAddress, setManualAddress] = useState('0xb853dd25b5e399ef3f673440fed474e12014768a5071b8332d7edfbbac81c788');

  const effectiveAddress = manualAddress || account?.address || '';

  return (
    <div className="container">
      <header className="header">
        <h1>Sui Wallet Cleaner</h1>
        <div className="wallet-connection">
          <ConnectButton />
        </div>
      </header>
      
      <main className="main-content">
        <div className="address-input-container">
          <input
            type="text"
            placeholder="Enter Sui Address (optional)"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="address-input"
          />
        </div>

        {!effectiveAddress ? (
          <div className="welcome-screen">
            <p>Connect your wallet or enter an address to scan for unwanted objects.</p>
          </div>
        ) : (
          <Scanner address={effectiveAddress} />
        )}
      </main>
    </div>
  );
}

export default App;
