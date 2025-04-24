import React from 'react';
import { Typography } from '@mui/material';

type SectionHeadingProps = {
    text: string,
};

export const SectionHeading: React.FC<SectionHeadingProps> = (props) => {
    const { text } = props;

    return (
        <Typography variant='h6' component='h6' sx={{ mb: 1 }}>
            {text}
        </Typography>
    );
};