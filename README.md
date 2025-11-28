# Solana Web Wallet 🚀

A modern, geometric-styled web wallet for the Solana blockchain. Built with React, Vite, and TypeScript, focusing on a premium user experience with glassmorphism effects and smooth animations.

![Solana Wallet](https://img.shields.io/badge/Solana-Mainnet-green) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-Fast-yellow)

## ✨ Features

- **Geometric Design**: A unique, modern UI with glassmorphism, gradients, and subtle shadows.
- **Real-time Balance**: Connects to **Solana Mainnet Beta** to fetch live account balances.
- **Multi-Account Support**: Create multiple accounts and switch between them instantly.
- **Import Account**: Connect existing Solana accounts by importing Private Keys.
- **Send Transactions**: Easily transfer SOL to any Solana address.
- **Secure Reveal**: "Reveal Cards" with blur effects to safely view your Private Key or Seed Phrase.
- **Account Management**:
    - **Delete Accounts**: Remove unwanted accounts with a custom confirmation UI.
    - **Unique Naming**: Automatically generates unique names (e.g., "Account 2") to avoid confusion.
- **Smooth Animations**: Powered by `anime.js` for elastic entrances and satisfying number counting.
- **Toast Notifications**: Non-intrusive, sleek notifications for all actions.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Vanilla CSS (Custom Design System)
- **Blockchain**: `@solana/web3.js`
- **Cryptography**: `bs58`, `bip39`
- **Animations**: `anime.js`
- **Icons**: `lucide-react`


## ⚠️ Security Warning



- **Key Storage**: Private keys are stored in your browser's `localStorage`. This is **NOT** secure for holding large amounts of funds, as malicious scripts or malware could access this storage.
- **Mainnet Use**: The wallet is connected to Mainnet Beta. Any transaction you make involves **REAL FUNDS**.
- **Recommendation**: Use this wallet for small amounts or testing only. Do not use it as your primary savings wallet.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
