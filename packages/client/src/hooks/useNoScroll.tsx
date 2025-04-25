import { useEffect } from 'react';

export const useNoScroll = (disable?: boolean) => {
    useEffect(() => {
        if (disable) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);
};