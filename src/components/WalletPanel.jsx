import { useCallback, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

function shortAddress(address) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function WalletPanel() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(null);
  const [copied, setCopied] = useState(false);

  const refreshBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    try {
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch {
      setBalance(null);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    refreshBalance();
    // Refresh automatically when an airdrop confirms elsewhere in the app.
    window.addEventListener('sol:balance-changed', refreshBalance);
    return () => window.removeEventListener('sol:balance-changed', refreshBalance);
  }, [refreshBalance]);

  const copyAddress = async () => {
    if (!publicKey) return;
    try {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <section className="card">
      <div className="card-row">
        <WalletMultiButton />
        {connected && <WalletDisconnectButton />}
      </div>

      {connected && publicKey ? (
        <div className="wallet-details">
          <div className="detail">
            <span className="detail-label">Address</span>
            <button className="link-button" onClick={copyAddress} title="Copy full address">
              {shortAddress(publicKey.toBase58())} {copied ? '✓ copied' : '⧉'}
            </button>
          </div>
          <div className="detail">
            <span className="detail-label">Balance</span>
            <span className="detail-value">
              {balance === null ? '—' : `${balance.toFixed(4)} SOL`}
              <button className="link-button" onClick={refreshBalance} title="Refresh balance">
                ↻
              </button>
            </span>
          </div>
        </div>
      ) : (
        <p className="hint">Connect a wallet set to Devnet to get started.</p>
      )}
    </section>
  );
}
