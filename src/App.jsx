import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletPanel } from './components/WalletPanel';
import { Airdrop } from './components/Airdrop';
import '@solana/wallet-adapter-react-ui/styles.css';

// Solana Devnet — safe to request free, valueless SOL here for testing.
const NETWORK = 'devnet';
const ENDPOINT = clusterApiUrl(NETWORK);

export default function App() {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: NETWORK }),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="app">
            <header className="app-header">
              <div className="brand">
                <span className="brand-mark" aria-hidden="true" />
                <h1>Solana Wallet Adapter</h1>
              </div>
              <p className="tagline">
                Connect a wallet and request a Devnet airdrop in a couple of clicks.
              </p>
              <span className="network-badge">{NETWORK}</span>
            </header>

            <main className="app-main">
              <WalletPanel />
              <Airdrop />
            </main>

            <footer className="app-footer">
              <p>
                Built with React, Vite &amp; the Solana Wallet Adapter. Devnet SOL has no
                real value.
              </p>
            </footer>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
