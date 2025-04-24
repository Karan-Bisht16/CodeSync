import React, { createContext, useContext, useState } from 'react';
// importing types
import type { ContextChildrenProps } from '../types/Context.types';
import type { PanelContextType } from '../types/Panel.types';

const PanelContext = createContext<PanelContextType>({
    dynamicPanel: false,
    openDynamicPanel: (_panel: string) => { },
    activeTerminalTab: 0,
    handleActiveTerminalTabChange: (_event: React.SyntheticEvent | null, _newActiveTab: number) => { },
    terminalPanel: false,
    openTerminalPanel: (_tab: number) => { },
    closeTerminalPanel: () => { },
    engagementPanel: false,
    openEngagementPanel: (_panel: string) => { },
    closeEngagementPanel: () => { },
    hostControlsModal: false,
    openHostControlsModal: () => { },
    closeHostControlsModal: () => { },
});
export const usePanelContext = () => useContext(PanelContext);
export const PanelProvider: React.FC<ContextChildrenProps> = ({ children }) => {
    // State for dynamic panel
    const [dynamicPanel, setDynamicPanel] = useState<string | boolean>(false);
    const openDynamicPanel = (panel: string) => {
        setDynamicPanel((prevPanel) => {
            if (prevPanel === panel) {
                return false;
            }
            return panel;
        });
    };

    // State for terminal panel
    const [terminalPanel, setTerminalPanel] = useState<boolean>(false);
    const openTerminalPanel = (tab?: number) => {
        setActiveTerminalTab(tab || 0);
        setTerminalPanel(!terminalPanel);
    };
    const closeTerminalPanel = () => {
        setTerminalPanel(false);
    };
    // State for terminal panel tabs
    const [activeTerminalTab, setActiveTerminalTab] = useState<number>(0);
    const handleActiveTerminalTabChange = (_event: React.SyntheticEvent | null, newActiveTab: number) => {
        setActiveTerminalTab(newActiveTab);
    };

    // State for engagement panels
    const [engagementPanel, setEngagementPanel] = useState<string | boolean>(false);
    const openEngagementPanel = (panel: string) => {
        setEngagementPanel(prevPanel => {
            if (prevPanel === panel) {
                return false;
            }
            return panel;
        });
    };
    const closeEngagementPanel = () => {
        setEngagementPanel(false);
    };

    // State for host controls modal
    const [hostControlsModal, setHostControlsModal] = useState<boolean>(false);
    const openHostControlsModal = () => {
        setHostControlsModal(true);
    };
    const closeHostControlsModal = () => {
        setHostControlsModal(false);
    };

    return (
        <PanelContext.Provider value={{
            dynamicPanel,
            openDynamicPanel,
            activeTerminalTab,
            handleActiveTerminalTabChange,
            terminalPanel,
            openTerminalPanel,
            closeTerminalPanel,
            engagementPanel,
            openEngagementPanel,
            closeEngagementPanel,
            hostControlsModal,
            openHostControlsModal,
            closeHostControlsModal,
        }}>
            {children}
        </PanelContext.Provider>
    );
};