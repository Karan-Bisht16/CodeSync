import React from 'react';
import { Typography } from '@mui/material';
// importing data
import { constantsJSON } from '../data/constants.data';
// importing contexts
import { useColorContext } from '../contexts/Color.context';
// importing assets
import { LogoSVG } from '../assets/LogoSVG';

type LogoProps = {
    size?: string,
    hideLogo?: boolean,
    hideTitle?: boolean,
    color?: string,
    style?: string,
};

export const Logo: React.FC<LogoProps> = (props) => {
    const colorContext = useColorContext();
    if (!colorContext) {
        return null;
    }
    const { palette, theme } = colorContext;

    const { websiteName } = constantsJSON;

    const { size, hideLogo, hideTitle, color, style } = props;

    const primaryColor = palette[theme]?.primary;
    let mainColor = color;
    if (!mainColor) {
        mainColor =
            (primaryColor && 'main' in primaryColor ? primaryColor.main : undefined) ||
            (primaryColor && '600' in primaryColor ? (primaryColor as any)[600] : undefined) ||
            palette[theme]?.text?.primary ||
            '#1976d2';
    }

    return (
        <div className={`flex justify-center items-center ${style}`}>
            {!hideLogo &&
                <LogoSVG size={size} color={mainColor} />
            }
            {!hideTitle &&
                <Typography
                    variant='h6'
                    sx={{
                        display: 'flex',
                        gap: '1.6px',
                        alignItems: 'center',
                        fontSize: '24px',
                        fontFamily: 'Blinker, sans-serif',
                        fontWeight: 400,
                        color: mainColor,
                    }}
                >
                    <span>&lt;</span>
                    <span>{websiteName}</span>
                    <span>&gt;</span>
                </Typography>
            }
        </div>
    );
};