import React from 'react';
import { Typography } from '@mui/material';

type TaglineProps = {
    text: string,
};

export const Tagline: React.FC<TaglineProps> = (props) => {
    const { text } = props;

    return (
        <Typography
            variant='h6'
            component='h6'
            sx={{
                textTransform: 'uppercase',
                fontWeight: 'thin',
                letterSpacing: { xs: '2px', md: '4px' },
                color: 'primary.main',
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
            }}
        >
            {text}
        </Typography>
    );
};