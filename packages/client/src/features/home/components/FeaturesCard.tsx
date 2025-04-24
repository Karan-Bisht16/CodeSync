import React from 'react';
import {
    Box,
    Paper,
    Typography
} from '@mui/material';
// importing icons
import {
    Code,
    Mic,
    Edit,
    Chat,
    Terminal,
    Speed
} from '@mui/icons-material';
// importing types
import type { PaletteColor } from '@mui/material';
// importing contexts
import { useColorContext } from '../../../contexts/Color.context';

type FeaturesCardProps = {
    heading: string,
    tagline: string,
    icon: string,
    variant?: 'gradient' | 'outlined',
    alignment?: 'left' | 'center',
};

export const FeaturesCard: React.FC<FeaturesCardProps> = (props) => {
    const { heading, tagline, icon, variant = 'gradient', alignment = 'left' } = props;

    const { palette, theme } = useColorContext();
    const defaultPrimary = { dark: '#000', main: '#333', contrastText: '#fff' };
    const primary: Required<PaletteColor> = {
        ...defaultPrimary,
        ...((palette[theme]?.primary as PaletteColor) ?? {}),
    };

    const featuresIconMap = { Code, Mic, Edit, Chat, Terminal, Speed };

    const IconComponent = featuresIconMap.hasOwnProperty(icon)
        ? featuresIconMap[icon as keyof typeof featuresIconMap]
        : Code;

    const gradientBackground = `linear-gradient(135deg, ${primary.dark} 0%, ${primary.main} 100%)`;

    const getTextColor = () => {
        return variant === 'gradient' ? 'primary.contrastText' : 'inherit';
    };

    return (
        <Paper
            elevation={2}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                background: variant === 'gradient' ? gradientBackground : 'none',
                border: variant === 'outlined' ? `2px solid ${primary.main}` : 'none',
                borderRadius: 4,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: { xs: 'left', md: alignment === 'left' ? 'flex-start' : 'center' },
                    flex: 1,
                    p: { xs: 2, sm: 4 },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: { xs: 'left', md: 'center' },
                        alignItems: { xs: 'left', md: 'center' },
                        position: 'relative',
                        mb: 1,
                    }}
                >
                    <IconComponent
                        sx={{
                            height: { xs: '36px', sm: '48px' },
                            width: { xs: '36px', sm: '48px' },
                            color: getTextColor,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            p: { xs: 1, sm: 1.5 },
                            borderRadius: '50%',
                        }}
                    />
                </Box>
                <Typography
                    variant='h5'
                    component='h5'
                    sx={{ fontWeight: 'bold', fontSize: { xs: '20px', sm: '24px' }, color: getTextColor, mb: 0 }}
                >
                    {heading}
                </Typography>
                <Typography
                    variant='body1'
                    sx={{
                        fontSize: { xs: '14px', sm: '16px' },
                        color: getTextColor,
                        opacity: '0.75',
                        maxWidth: { xs: '100%', sm: alignment === 'left' ? '85%' : '100%' },
                    }}
                >
                    {tagline}
                </Typography>
            </Box>
            {variant === 'gradient' && (
                <Box
                    sx={{
                        height: '160px',
                        position: 'absolute',
                        bottom: '-30px',
                        right: '-30px',
                        width: '150px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                />
            )}
        </Paper>
    );
};