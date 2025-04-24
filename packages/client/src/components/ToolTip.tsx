import React from 'react';
import {
    Fade,
    Tooltip
} from '@mui/material';
// importing data
import { constantsJSON } from '../data/constants.data';
// importing types
import type { ReactNode } from 'react';

type ToolTipProps = {
    title: string,
    children: ReactNode,
    placement?:
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'right-start'
    | 'right'
    | 'right-end'
    | 'bottom-start'
    | 'bottom'
    | 'bottom-end'
    | 'left-start'
    | 'left'
    | 'left-end',
    duration?: number
};

export const ToolTip: React.FC<ToolTipProps> = (props) => {
    const { title, children, placement = 'bottom', duration } = props;
    const { transitionDuration } = constantsJSON;

    return (
        <Tooltip
            title={title}
            placement={placement}
            slots={{
                transition: Fade,
            }}
            slotProps={{
                transition: {
                    timeout: duration ?? transitionDuration
                },
            }}
        >
            <span>
                {children}
            </span>
        </Tooltip>
    );
};