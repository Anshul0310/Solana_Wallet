import React, { useState } from 'react';
import { type WalletAccount, sendTransaction, isValidAddress } from '../utils/solana';
import { Button } from './Button';
import { Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface SendTransactionProps {
    account: WalletAccount;
    onSuccess: () => void;
}

export const SendTransaction: React.FC<SendTransactionProps> = ({ account, onSuccess }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidAddress(recipient)) {
            showToast('Invalid recipient address', 'error');
            return;
        }

        setLoading(true);
        try {
            const signature = await sendTransaction(account.secretKey, recipient, parseFloat(amount));
            console.log('Transaction signature:', signature);
            showToast('Transaction Sent!', 'success');
            setRecipient('');
            setAmount('');
            onSuccess();
        } catch (error) {
            showToast('Transaction failed. Check console.', 'error');
        }
        setLoading(false);
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Send SOL</h3>
            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    required
                />
                <input
                    type="number"
                    step="0.000000001"
                    placeholder="Amount (SOL)"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                />
                <Button type="submit" isLoading={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Send size={16} /> Send Transaction
                </Button>
            </form>
        </div>
    );
};
