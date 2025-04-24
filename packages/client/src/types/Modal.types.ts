export type ModalButton = {
    label: string,
    autoFocus?: boolean,
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    variant?: 'text' | 'contained' | 'outlined',
    onClickFunction(): void,
};

export type ModalData = {
    isPersistent?: boolean,
    modalContent: {
        title: string,
        content: string,
    },
    modalButtons: ModalButton[],
};

export type ModalProps = {
    modalState: boolean,
    modalData: ModalData,
    onClose(onClickFunction?: () => void): void,
};

export type ModalContextType = {
    modalState: boolean,
    modalData: ModalData,
    openModal(data: ModalData): void,
    closeModal(onClickFunction?: () => void): void,
};