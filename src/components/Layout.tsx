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
        </div>
    );
};
