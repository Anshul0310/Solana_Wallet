import type { WalletAccount } from './solana';

const STORAGE_KEY = 'geometric_wallet_accounts';

export const saveAccounts = (accounts: WalletAccount[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

export const loadAccounts = (): WalletAccount[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const addAccount = (account: WalletAccount) => {
    const accounts = loadAccounts();
    accounts.push(account);
    saveAccounts(accounts);
    return accounts;
};

export const removeAccount = (publicKey: string) => {
    const accounts = loadAccounts();
    const updated = accounts.filter(acc => acc.publicKey !== publicKey);
    saveAccounts(updated);
    return updated;
};
