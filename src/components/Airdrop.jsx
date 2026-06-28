import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const PRESETS = [0.5, 1, 2];

export function Airdrop() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [amount, setAmount] = useState('1');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message, signature? }

  async function requestAirdrop() {
    setStatus(null);

    if (!connected || !publicKey) {
      setStatus({ type: 'error', message: 'Connect a wallet (set to Devnet) first.' });
      return;
    }

    const sol = parseFloat(amount);
    if (Number.isNaN(sol) || sol <= 0) {
      setStatus({ type: 'error', message: 'Enter a valid SOL amount greater than 0.' });
      return;
    }

    try {
      setLoading(true);
      const lamports = Math.floor(sol * LAMPORTS_PER_SOL);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const signature = await connection.requestAirdrop(publicKey, lamports);

      const confirmation = await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        'confirmed'
      );

      if (confirmation.value.err) {
        throw new Error('Transaction failed to confirm.');
      }

      setStatus({ type: 'success', message: `Airdropped ${sol} SOL`, signature });
      window.dispatchEvent(new Event('sol:balance-changed'));
    } catch (err) {
      setStatus({
        type: 'error',
        message:
          err?.message ||
          'Airdrop failed. Devnet faucets are often rate-limited — try a smaller amount or wait a few minutes.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2 className="card-title">Request a Devnet airdrop</h2>

      <div className="presets">
        {PRESETS.map((value) => (
          <button
            key={value}
            type="button"
            className={`chip ${parseFloat(amount) === value ? 'chip-active' : ''}`}
            onClick={() => setAmount(String(value))}
          >
            {value} SOL
          </button>
        ))}
      </div>

      <div className="card-row">
        <input
          className="amount-input"
          type="number"
          min="0"
          step="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in SOL"
          aria-label="Airdrop amount in SOL"
        />
        <button
          className="primary-button"
          onClick={requestAirdrop}
          disabled={loading || !connected}
        >
          {loading ? 'Requesting…' : 'Send Airdrop'}
        </button>
      </div>

      {status && (
        <div className={`status status-${status.type}`} role="status">
          <span>{status.type === 'success' ? '✅' : '⚠️'} {status.message}</span>
          {status.signature && (
            <a
              className="explorer-link"
              href={`https://explorer.solana.com/tx/${status.signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Solana Explorer ↗
            </a>
          )}
        </div>
      )}
    </section>
  );
}
