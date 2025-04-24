import React from 'react';
import { Typography } from '@mui/material';

type SectionSubHeadingProps = {
    text: string,
};

export const SectionSubHeading: React.FC<SectionSubHeadingProps> = (props) => {
    const { text } = props;

    return (
        <Typography variant='subtitle2' gutterBottom>
            {text}
        </Typography>
    );
};