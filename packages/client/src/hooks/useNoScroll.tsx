import { useEffect } from 'react';

export const useNoScroll = (disable?: boolean) => {
    useEffect(() => {
        if (disable) return;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
};