import React, { createContext, useContext, useState } from 'react';
// importing types
import type { ContextChildrenProps } from '../types/Context.types';
import type { ModalContextType, ModalData } from '../types/Modal.types';

const ModalContext = createContext<ModalContextType>({
    modalState: false,
    modalData: {} as ModalData,
    openModal: (_data: ModalData): void => { },
    closeModal: (_onClickFunction?: () => void): void => { },
});
export const useModalContext = () => useContext(ModalContext);
export const ModalProvider: React.FC<ContextChildrenProps> = ({ children }) => {
    const [modalState, setModalState] = useState<boolean>(false);
    const [modalData, setModalData] = useState<ModalData>({
        isPersistent: false,
        modalContent: {
            title: '',
            content: '',
        },
        modalButtons: []
    });

    const openModal = (data: ModalData) => {
        setModalData(data);
        setModalState(true);
    };
    const closeModal = (onClickFunction?: () => void) => {
        onClickFunction?.();
        setModalState(false);
    };

    return (
        <ModalContext.Provider value={{
            modalState,
            modalData,
            openModal,
            closeModal,
        }}>
            {children}
        </ModalContext.Provider>
    );
};