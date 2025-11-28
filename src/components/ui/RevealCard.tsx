import React, { useState } from 'react';
import { ChevronDown, Eye, EyeOff, Lock } from 'lucide-react';

interface RevealCardProps {
    title: string;
    secret: string;
    warning?: string;
}

export const RevealCard: React.FC<RevealCardProps> = ({ title, secret, warning }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isOpen ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Lock size={16} color="var(--accent-secondary)" />
                    <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{title}</span>
                </div>
                <ChevronDown
                    size={16}
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s ease',
                        color: 'var(--text-secondary)'
                    }}
                />
            </div>

            <div style={{
                height: isOpen ? 'auto' : 0,
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
                    {warning && (
                        <div style={{
                            marginBottom: '12px',
                            fontSize: '0.8rem',
                            color: '#ef4444',
                            background: 'rgba(239, 68, 68, 0.1)',
                            padding: '8px',
                            borderRadius: '6px'
                        }}>
                            ⚠️ {warning}
                        </div>
                    )}

                    <div style={{
                        position: 'relative',
                        background: 'rgba(0, 0, 0, 0.3)',
                        padding: '12px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        wordBreak: 'break-all',
                        lineHeight: '1.5',
                        color: isRevealed ? 'var(--text-primary)' : 'transparent',
                        textShadow: isRevealed ? 'none' : '0 0 8px rgba(255,255,255,0.5)',
                        userSelect: isRevealed ? 'text' : 'none',
                        cursor: isRevealed ? 'text' : 'default'
                    }}>
                        {secret}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsRevealed(!isRevealed);
                            }}
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-secondary)'
                            }}
                            title={isRevealed ? "Hide" : "Reveal"}
                        >
                            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
