import React, { createContext, useEffect, useState, useCallback, useContext } from 'react';
// importing data
import { constantsJSON } from '../data/constants.data';
// importing types
import type { ContextChildrenProps } from '../types/Context.types';
import type { MobileContextType } from '../types/Mobile.types';

const MobileContext = createContext<MobileContextType>({
    isMobile: false,
});
export const useMobileContext = () => useContext(MobileContext);
export const MobileProvider: React.FC<ContextChildrenProps> = ({ children }) => {
    const { mobileBreakpoint } = constantsJSON;

    // Initialize state using matchMedia for efficiency
    const [isMobile, setIsMobile] = useState(() => {
        return window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches;
    });

    const handleResize = useCallback(() => {
        const matches = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches;
        setIsMobile((prev) => (prev !== matches ? matches : prev));
    }, [mobileBreakpoint]);

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
        mediaQuery.addEventListener('change', handleResize);

        return () => mediaQuery.removeEventListener('change', handleResize);
    }, [handleResize]);

    return (
        <MobileContext.Provider value={{
            isMobile
        }}>
            {children}
        </MobileContext.Provider>
    );
};