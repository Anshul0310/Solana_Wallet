import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    clusterApiUrl
} from '@solana/web3.js';
import bs58 from 'bs58';
import * as bip39 from 'bip39';

// Use Mainnet for real transactions
const NETWORK = clusterApiUrl('mainnet-beta');
const connection = new Connection(NETWORK, 'confirmed');

export interface WalletAccount {
    publicKey: string;
    secretKey: string; // Stored as base58 string for simplicity in this demo
    name: string;
    mnemonic?: string; // Optional, only for accounts created with seed
}

export const createNewAccount = (name: string): WalletAccount => {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // Derive keypair from seed (using first 32 bytes for simplicity in this demo)
    // In a real app, you'd use a derivation path like m/44'/501'/0'/0'
    const keypair = Keypair.fromSeed(seed.slice(0, 32));

    return {
        publicKey: keypair.publicKey.toBase58(),
        secretKey: bs58.encode(keypair.secretKey),
        name,
        mnemonic,
    };
};

export const importAccount = (name: string, secretKeyStr: string): WalletAccount => {
    try {
        const secretKey = bs58.decode(secretKeyStr);
        const keypair = Keypair.fromSecretKey(secretKey);
        return {
            publicKey: keypair.publicKey.toBase58(),
            secretKey: secretKeyStr,
            name,
        };
    } catch (error) {
        throw new Error("Invalid private key. Please ensure it is a base58 string.");
    }
};

export const getBalance = async (publicKeyStr: string): Promise<number> => {
    try {
        const publicKey = new PublicKey(publicKeyStr);
        const balance = await connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
    } catch (error) {
        console.error("Error fetching balance:", error);
        return 0;
    }
};

export const requestAirdrop = async (): Promise<string> => {
    throw new Error("Airdrops are not available on Mainnet.");
};

export const sendTransaction = async (
    fromSecretKey: string,
    toPublicKeyStr: string,
    amount: number
): Promise<string> => {
    try {
        const fromKeypair = Keypair.fromSecretKey(bs58.decode(fromSecretKey));
        const toPublicKey = new PublicKey(toPublicKeyStr);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toPublicKey,
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );

        const signature = await connection.sendTransaction(transaction, [fromKeypair]);

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature
        });

        return signature;
    } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
    }
};

export const isValidAddress = (address: string): boolean => {
    try {
        new PublicKey(address);
        return true;
    } catch {
        return false;
    }
};
