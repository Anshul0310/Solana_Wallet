import React, { useState } from 'react';
import { type WalletAccount, createNewAccount, importAccount } from '../utils/solana';
import { addAccount } from '../utils/storage';
import { Button } from './Button';
import { Plus, ChevronDown, User, Trash2 } from 'lucide-react';

interface AccountSwitcherProps {
    accounts: WalletAccount[];
    currentAccount: WalletAccount | null;
    onSelectAccount: (account: WalletAccount) => void;
    onAccountsUpdated: (accounts: WalletAccount[]) => void;
    onDeleteAccount: (account: WalletAccount) => void;
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
    accounts,
    currentAccount,
    onSelectAccount,
    onAccountsUpdated,
    onDeleteAccount
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [importPrivateKey, setImportPrivateKey] = useState('');
    const [error, setError] = useState('');
    const [accountToDelete, setAccountToDelete] = useState<WalletAccount | null>(null);

    const resetForm = () => {
        setNewAccountName('');
        setImportPrivateKey('');
        setError('');
        setIsCreating(false);
        setIsImporting(false);
        setIsOpen(false);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAccountName.trim()) return;

        const newAccount = createNewAccount(newAccountName);
        const updatedAccounts = addAccount(newAccount);
        onAccountsUpdated(updatedAccounts);
        onSelectAccount(newAccount);
        resetForm();
    };

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAccountName.trim() || !importPrivateKey.trim()) return;

        try {
            const newAccount = importAccount(newAccountName, importPrivateKey);
            const updatedAccounts = addAccount(newAccount);
            onAccountsUpdated(updatedAccounts);
            onSelectAccount(newAccount);
            resetForm();
        } catch (err: any) {
            setError(err.message || 'Invalid private key');
        }
    };

    const confirmDelete = () => {
        if (accountToDelete) {
            onDeleteAccount(accountToDelete);
            setAccountToDelete(null);
        }
    };

    if (!currentAccount) return null;

    return (
        <>
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <User size={16} color="white" />
                        </div>
                        <span style={{ fontWeight: 600 }}>{currentAccount.name}</span>
                    </div>
                    <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>

                {isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        width: '100%',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        zIndex: 10,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        overflow: 'hidden'
                    }}>
                        {accounts.map(acc => (
                            <div
                                key={acc.publicKey}
                                onClick={() => {
                                    onSelectAccount(acc);
                                    setIsOpen(false);
                                }}
                                style={{
                                    padding: '12px',
                                    cursor: 'pointer',
                                    background: acc.publicKey === currentAccount.publicKey ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <span>{acc.name}</span>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAccountToDelete(acc);
                                    }}
                                    style={{
                                        padding: '4px',
                                        borderRadius: '4px',
                                        color: 'var(--text-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                >
                                    <Trash2 size={14} />
                                </div>
                            </div>
                        ))}

                        {!isCreating && !isImporting && (
                            <>
                                <div
                                    onClick={() => setIsCreating(true)}
                                    style={{ padding: '12px', cursor: 'pointer', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                >
                                    <Plus size={16} /> Create New Account
                                </div>
                                <div
                                    onClick={() => setIsImporting(true)}
                                    style={{ padding: '12px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Plus size={16} /> Import Private Key
                                </div>
                            </>
                        )}

                        {isCreating && (
                            <form onSubmit={handleCreate} style={{ padding: '12px' }}>
                                <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Create New Account</div>
                                <input
                                    autoFocus
                                    placeholder="Account Name"
                                    value={newAccountName}
                                    onChange={e => setNewAccountName(e.target.value)}
                                    style={{ marginBottom: '8px', width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button type="submit" style={{ padding: '8px' }}>Create</Button>
                                    <Button type="button" variant="secondary" onClick={resetForm} style={{ padding: '8px' }}>Cancel</Button>
                                </div>
                            </form>
                        )}

                        {isImporting && (
                            <form onSubmit={handleImport} style={{ padding: '12px' }}>
                                <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Import Account</div>
                                {error && <div style={{ color: '#fca5a5', fontSize: '0.8rem', marginBottom: '8px' }}>{error}</div>}
                                <input
                                    autoFocus
                                    placeholder="Account Name"
                                    value={newAccountName}
                                    onChange={e => setNewAccountName(e.target.value)}
                                    style={{ marginBottom: '8px', width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                                <input
                                    placeholder="Private Key (Base58)"
                                    value={importPrivateKey}
                                    onChange={e => setImportPrivateKey(e.target.value)}
                                    style={{ marginBottom: '8px', width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button type="submit" style={{ padding: '8px' }}>Import</Button>
                                    <Button type="button" variant="secondary" onClick={resetForm} style={{ padding: '8px' }}>Cancel</Button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>

            {accountToDelete && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '24px',
                        padding: '24px',
                        width: '90%',
                        maxWidth: '320px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        animation: 'slideIn 0.2s ease-out'
                    }}>
                        <h3 style={{ marginTop: 0, fontSize: '1.2rem' }}>Delete Account?</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                            Are you sure you want to delete <span style={{ color: 'white', fontWeight: 600 }}>{accountToDelete.name}</span>?
                            <br /><br />
                            <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>This action cannot be undone.</span>
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Button
                                variant="secondary"
                                onClick={() => setAccountToDelete(null)}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                style={{ flex: 1, background: '#ef4444', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
