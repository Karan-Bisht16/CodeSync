import React, { useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
// importing icons
import {
    Info as InfoIcon,
} from '@mui/icons-material';
// importing components
import { ToolTip } from '../../../components/ToolTip';

type HotkeyDisplayProps = {
    text: string,
    binding: string,
    last?: boolean,
    info?: string,
};

export const HotkeyDisplay: React.FC<HotkeyDisplayProps> = (props) => {
    const { text, binding, last = false, info } = props;
    const [hover, setHover] = useState(false);

    return (
        <>
            <Box
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}
            >
                <Typography>{text}</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 1 }}>
                    {hover && info &&
                        <ToolTip title={info}>
                            <InfoIcon fontSize='small' sx={{ color: 'text.secondary', cursor: 'pointer' }} />
                        </ToolTip>
                    }
                    <Typography sx={{ bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 1, fontFamily: 'monospace' }}>
                        {binding}
                    </Typography>
                </Box>
            </Box>
            {!last && <Divider />}
        </>
    );
};