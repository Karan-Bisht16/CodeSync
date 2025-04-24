import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Typography,
} from '@mui/material';
// importing icons
import {
    Close as CloseIcon
} from '@mui/icons-material';
// importing types
import type { ModalProps } from '../types/Modal.types';

export const Modal: React.FC<ModalProps> = (props) => {
    const { modalState, modalData, onClose } = props;
    const { isPersistent, modalContent, modalButtons } = modalData;
    const { title, content } = modalContent;

    const handleDialogClose = (onClickFunction?: () => void) => {
        onClose(onClickFunction);
    };

    return (
        <Dialog
            onClose={() => {
                !isPersistent && handleDialogClose();
            }}
            open={modalState}
            sx={{ zIndex: 100000 }}
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                {title}
            </DialogTitle>
            {!isPersistent && (
                <IconButton
                    aria-label='close'
                    onClick={() => handleDialogClose()}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
            )}
            <Divider />
            <DialogContent>
                <Typography gutterBottom>
                    {content}
                </Typography>
            </DialogContent>
            <DialogActions>
                {modalButtons.map((button, index) => {
                    const { label, autoFocus = false, color = 'primary', variant = 'outlined', onClickFunction } = button;

                    return (
                        <Button
                            key={index}
                            color={color}
                            variant={variant}
                            autoFocus={autoFocus}
                            onClick={() => handleDialogClose(onClickFunction)}
                        >
                            {label}
                        </Button>
                    );
                })}
            </DialogActions>
        </Dialog>
    );
};