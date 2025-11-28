import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardRef.current) {
            animate(cardRef.current, {
                translateY: [50, 0],
                opacity: [0, 1],
                scale: [0.9, 1],
                easing: 'easeOutElastic(1, .6)',
                duration: 1000,
                delay: 200
            });
        }
    }, []);

    return (
        <div className="container">
            <div className="card" ref={cardRef} style={{ opacity: 0 }}>
                {children}
            </div>
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                color: 'var(--accent-secondary)',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '0.8rem',
                letterSpacing: '1px',
                opacity: 0.8,
                pointerEvents: 'none',
                zIndex: 1000,
                textShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
            }}>
                Designed and Developed by Anshul
            </div>
        </div>
    );
};
