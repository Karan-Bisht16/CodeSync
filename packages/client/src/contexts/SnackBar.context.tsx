import React, { createContext, useContext, useState } from 'react';
// importing types
import type { ContextChildrenProps } from '../types/Context.types';
import type { SnackBarContextType, SnackBarData } from '../types/SnackBar.types';

const SnackBarContext = createContext<SnackBarContextType>({
    snackBarState: false,
    snackBarData: {} as SnackBarData,
    openSnackBar: (_data: SnackBarData): void => { },
    closeSnackBar: (_event: React.SyntheticEvent, _reason: string): void => { },
});
export const useSnackBarContext = () => useContext(SnackBarContext);
export const SnackBarProvider: React.FC<ContextChildrenProps> = ({ children }) => {
    const [snackBarState, setSnackBarState] = useState<boolean>(false);
    const [snackBarData, setSnackBarData] = useState<SnackBarData>({
        status: 'info',
        message: ''
    });

    const openSnackBar = (data: SnackBarData) => {
        setSnackBarData(data);
        setSnackBarState(true);
    };
    const closeSnackBar = (
        _event: React.SyntheticEvent,
        reason: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarState(false);
    };

    return (
        <SnackBarContext.Provider value={{
            snackBarState,
            snackBarData,
            openSnackBar,
            closeSnackBar,
        }}>
            {children}
        </SnackBarContext.Provider>
    );
};