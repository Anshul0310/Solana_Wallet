import React, { useEffect, useState, useRef } from 'react';
import { type WalletAccount, getBalance } from '../utils/solana';
import { Button } from './Button';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { RevealCard } from './ui/RevealCard';
import { animate } from 'animejs';

interface DashboardProps {
    account: WalletAccount;
}

export const Dashboard: React.FC<DashboardProps> = ({ account }) => {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const balanceRef = useRef<HTMLDivElement>(null);
    const prevBalanceRef = useRef<number>(0);

    const fetchBalance = async () => {
        setLoading(true);
        const bal = await getBalance(account.publicKey);
        setBalance(bal);

        // Animate balance change
        if (balanceRef.current && bal !== prevBalanceRef.current) {
            const start = prevBalanceRef.current;
            const end = bal;
            // Use a dummy object to animate values
            const obj = { val: start };
            animate(obj, {
                val: end,
                duration: 1500,
                easing: 'easeOutExpo',
                onUpdate: () => {
                    // In animejs v4, anim.currentTime or similar might be used, 
                    // but usually we animate the target object properties.
                    // Let's check if obj.val is updated.
                    if (balanceRef.current) {
                        balanceRef.current.innerHTML = `${obj.val.toFixed(4)} SOL`;
                    }
                }
            });
            prevBalanceRef.current = bal;
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchBalance();
        const interval = setInterval(fetchBalance, 10000); // Auto-refresh every 10s
        return () => clearInterval(interval);
    }, [account]);

    const handleCopy = () => {
        navigator.clipboard.writeText(account.publicKey);
        showToast('Address copied to clipboard!', 'success');
    };



    return (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left'
            }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <span>
                    <b>Mainnet Mode:</b> Real funds. Keys stored in browser.
                    <br />Do not use for large amounts.
                </span>
            </div>

            <h2 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Total Balance
            </h2>
            <div className="balance-display" ref={balanceRef}>
                {balance !== null ? `${balance.toFixed(4)} SOL` : '...'}
            </div>

            <div className="address-pill" onClick={handleCopy} title="Click to copy">
                <span>{account.publicKey.slice(0, 4)}...{account.publicKey.slice(-4)}</span>
                <Copy size={14} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', justifyContent: 'center' }}>
                <Button variant="secondary" onClick={fetchBalance} disabled={loading} style={{ width: 'auto' }}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
                </Button>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', textAlign: 'left' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Security</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <RevealCard
                        title="Private Key"
                        secret={account.secretKey}
                        warning="Never share this key! It controls your account."
                    />
                    {account.mnemonic && (
                        <RevealCard
                            title="Seed Phrase"
                            secret={account.mnemonic}
                            warning="Keep this safe! It can restore your wallet."
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
