# Solana Wallet Adapter — Devnet Airdrop

A clean, minimal **React + Vite** dApp that connects a Solana wallet and requests a
**Devnet** SOL airdrop. It's a small, focused reference for wiring up the
[Solana Wallet Adapter](https://github.com/anza-xyz/wallet-adapter) and `@solana/web3.js`
into a modern React app.

> ⚠️ This app runs on **Solana Devnet**. Devnet SOL has no monetary value and is intended
> for development and testing only.

---

## Features

- 🔌 **Wallet connection** via Phantom and Solflare (Wallet Adapter modal).
- 💧 **Devnet airdrop** with quick-select presets (0.5 / 1 / 2 SOL) or a custom amount.
- 💰 **Live balance** that auto-refreshes after a confirmed airdrop.
- 🔗 **Transaction confirmation** with a one-click link to Solana Explorer.
- 📋 **Copy address** and inline success/error feedback (no blocking `alert()`s).
- 🎨 Responsive, Solana-themed dark UI with zero CSS dependencies.

---

## Tech stack

| Area      | Tooling                                                              |
| --------- | ------------------------------------------------------------------- |
| Framework | [React 19](https://react.dev) + [Vite 7](https://vite.dev)          |
| Chain SDK | [`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/)  |
| Wallets   | `@solana/wallet-adapter-*` (Phantom, Solflare)                      |
| Linting   | ESLint 9 (flat config) with React Hooks rules                       |

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A Solana wallet browser extension ([Phantom](https://phantom.app/) or
  [Solflare](https://solflare.com/)) **switched to Devnet**

### Install & run

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev
```

### Build for production

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

---

## Usage

1. Set your wallet (Phantom / Solflare) to the **Devnet** network.
2. Click **Select Wallet** and connect.
3. Pick a preset or type an amount of SOL.
4. Click **Send Airdrop** and wait for the confirmation toast.
5. Use the **View on Solana Explorer** link to inspect the transaction.

> Devnet faucets are rate-limited. If an airdrop fails, try a smaller amount
> (e.g. 0.5–1 SOL) or wait a few minutes before retrying.

---

## Project structure

```
.
├── index.html               # App entry & metadata
├── public/
│   └── favicon.svg           # Themed favicon
├── src/
│   ├── App.jsx               # Providers (Connection / Wallet) + page layout
│   ├── components/
│   │   ├── WalletPanel.jsx   # Connect button, address, live balance
│   │   └── Airdrop.jsx       # Airdrop form, confirmation & explorer link
│   ├── index.css             # Global + component styles
│   └── main.jsx              # React root
├── eslint.config.js
└── vite.config.js
```

---

## How it works

The app wraps the tree in `ConnectionProvider` (pointed at `clusterApiUrl('devnet')`) and
`WalletProvider`. `WalletPanel` reads the connected `publicKey` and fetches the balance via
`connection.getBalance`. `Airdrop` calls `connection.requestAirdrop`, confirms the signature
against the latest blockhash, and dispatches a lightweight `sol:balance-changed` event so the
balance refreshes automatically.

---

## License

[MIT](./LICENSE) © Shreyash Naik
