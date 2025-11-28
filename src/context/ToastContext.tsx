import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px', // Changed to right for desktop feel, or center for mobile
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 1000
            }}>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        style={{
                            background: 'rgba(19, 19, 31, 0.95)',
                            border: `1px solid ${toast.type === 'success' ? '#10b981' :
                                    toast.type === 'error' ? '#ef4444' : '#3b82f6'
                                }`,
                            borderLeftWidth: '4px',
                            borderRadius: '8px',
                            padding: '16px',
                            minWidth: '300px',
                            color: 'white',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            animation: 'slideIn 0.3s ease-out',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {toast.type === 'success' && <CheckCircle size={20} color="#10b981" />}
                            {toast.type === 'error' && <AlertCircle size={20} color="#ef4444" />}
                            {toast.type === 'info' && <Info size={20} color="#3b82f6" />}
                            <span style={{ fontSize: '0.9rem' }}>{toast.message}</span>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0 }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
