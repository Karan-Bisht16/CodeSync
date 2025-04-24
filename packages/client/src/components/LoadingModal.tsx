import React from 'react';
import { CircularProgress } from '@mui/material';
// importing components
import { BackDrop } from './BackDrop';

type LoadingModalProps = {
    text?: string,
};

export const LoadingModal: React.FC<LoadingModalProps> = (props) => {
    const { text } = props;

    return (
        <BackDrop>
            <CircularProgress size={60} color='primary' sx={{ mb: 4 }} />
            {
                text &&
                <h1
                    className='text-xl text-center text-white'
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            }
        </BackDrop>
    );
};