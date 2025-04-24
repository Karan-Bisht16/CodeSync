import { useState, useEffect } from 'react';

export const useDrag = (initialPosition = { x: 100, y: 100 }) => {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event: React.MouseEvent, element: HTMLElement) => {
        if (event.target instanceof Element && event.target.closest('.drag-handle')) {
            event.preventDefault();
            event.stopPropagation();

            setIsDragging(true);
            const rect = element.getBoundingClientRect();
            setDragOffset({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
        }
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (isDragging) {
                event.preventDefault();
                setPosition({
                    x: event.clientX - dragOffset.x,
                    y: event.clientY - dragOffset.y,
                });
            }
        };

        const handleMouseUp = (event: MouseEvent) => {
            if (isDragging) {
                event.preventDefault();
                setIsDragging(false);
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    return { position, isDragging, handleMouseDown };
};