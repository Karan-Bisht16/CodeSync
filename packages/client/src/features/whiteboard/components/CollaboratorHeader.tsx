import React from 'react';
import { IconButton, Typography, Box } from '@mui/material';
// importing icons
import {
    Close as CloseIcon,
    DragHandle as DragHandleIcon,
} from '@mui/icons-material';

type CollaboratorHeaderProps = {
    collaboratorCount: number;
    onClose: () => void;
    isDragging: boolean;
};

export const CollaboratorHeader: React.FC<CollaboratorHeaderProps> = (props) => {
    const { collaboratorCount, onClose, isDragging } = props;

    return (
        <>
            <DragHandleIcon
                className='drag-handle'
                sx={{
                    width: '100%',
                    bgcolor: 'background.default',
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
            />
            <Box className='flex justify-between items-center px-3 py-2'>
                <Typography variant='h6' fontSize={16}>
                    Collaborators ({collaboratorCount})
                </Typography>
                <IconButton
                    size='small'
                    onClick={(event) => {
                        event.stopPropagation();
                        onClose();
                    }}
                >
                    <CloseIcon fontSize='small' />
                </IconButton>
            </Box>
        </>
    );
};