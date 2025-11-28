import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AccountSwitcher } from './components/AccountSwitcher';
import { SendTransaction } from './components/SendTransaction';
import { type WalletAccount, createNewAccount } from './utils/solana';
import { loadAccounts, addAccount, removeAccount } from './utils/storage';
import { Button } from './components/Button';
import { Wallet } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';

function App() {
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [currentAccount, setCurrentAccount] = useState<WalletAccount | null>(null);

  useEffect(() => {
    const loaded = loadAccounts();
    if (loaded.length > 0) {
      setAccounts(loaded);
      // Do not auto-login
      // setCurrentAccount(loaded[0]);
    }
  }, []);

  const handleCreateNewAccount = () => {
    const name = accounts.length > 0 ? `Account ${accounts.length + 1}` : 'Main Account';
    const newAccount = createNewAccount(name);
    const updated = addAccount(newAccount);
    setAccounts(updated);
    setCurrentAccount(newAccount);
  };

  const handleDeleteAccount = (accountToDelete: WalletAccount) => {
    const updated = removeAccount(accountToDelete.publicKey);
    setAccounts(updated);

    if (currentAccount?.publicKey === accountToDelete.publicKey) {
      // If deleted account was active, switch to another or logout
      if (updated.length > 0) {
        setCurrentAccount(updated[0]);
      } else {
        setCurrentAccount(null);
      }
    }
  };

  if (!currentAccount) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: '24px',
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(109, 40, 217, 0.5)'
          }}>
            <Wallet size={40} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Solana Wallet</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Manage your assets, NFTs, and swaps directly from your browser.
          </p>
          {accounts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <Button onClick={() => setCurrentAccount(accounts[0])}>
                Open Wallet
              </Button>
              <div
                style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}
                onClick={handleCreateNewAccount}
              >
                or create new
              </div>
            </div>
          ) : (
            <Button onClick={handleCreateNewAccount}>
              Create New Wallet
            </Button>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <ToastProvider>
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={20} color="var(--accent-secondary)" />
            Solana Wallet
          </h1>
        </div>

        <AccountSwitcher
          accounts={accounts}
          currentAccount={currentAccount}
          onSelectAccount={setCurrentAccount}
          onAccountsUpdated={setAccounts}
          onDeleteAccount={handleDeleteAccount}
        />

        <Dashboard account={currentAccount} />

        <SendTransaction
          account={currentAccount}
          onSuccess={() => {
            // Trigger balance refresh in Dashboard via key prop or context (simplified here by re-rendering)
            setCurrentAccount({ ...currentAccount });
          }}
        />
      </Layout>
    </ToastProvider>
  );
}

export default App;
