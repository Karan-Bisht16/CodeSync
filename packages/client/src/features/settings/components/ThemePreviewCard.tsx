import React from 'react';
import { Box, Radio, Typography } from '@mui/material';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing types
import type { PaletteOptions } from '@mui/material';

type ThemePreviewCardProps = {
    label: string,
    selected: boolean,
    theme: PaletteOptions | undefined,
    onSelect: () => void,
};

export const ThemePreviewCard: React.FC<ThemePreviewCardProps> = (props) => {
    const { label, selected, theme, onSelect } = props;

    const { transitionDuration } = constantsJSON;

    if (!theme) return null;

    const borderColor = selected ? 'primary.main' : 'divider';
    const bgPaper = theme.background!.paper;
    const bgDefault = theme.background!.default;
    const primaryMain = (theme.primary as { main: string }).main;
    const divider = theme.divider;
    const textPrimary = theme.text!.primary;
    const textSecondary = theme.text!.secondary;

    return (
        <Box>
            <Box
                onClick={onSelect}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    bgcolor: bgDefault,
                    p: 1,
                    border: 2,
                    borderColor,
                    borderRadius: 2,
                    boxShadow: selected ? 3 : 1,
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: `all ${transitionDuration / 1000}s ease-in-out`,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', width: '20%' }}>
                        <Box sx={{ height: 12, width: '50%', bgcolor: bgPaper, border: '1px solid', borderColor: divider, borderRadius: 8 }} />
                        <Box sx={{ height: 12, width: '50%', bgcolor: bgPaper, border: '1px solid', borderColor: divider, borderRadius: 8 }} />
                    </Box>
                    <Box sx={{ height: 12, width: '40%', bgcolor: bgDefault, border: '1px solid', borderColor: divider, borderRadius: 8 }} />
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', width: '25%' }}>
                        <Box sx={{ height: 12, width: '50%', bgcolor: bgDefault, border: '1px solid', borderColor: textPrimary, borderRadius: '2px' }} />
                        <Box sx={{ height: 12, width: '50%', bgcolor: primaryMain, borderRadius: '2px' }} />
                        <Box sx={{ position: 'relative' }}>
                            <Box sx={{ height: 12, width: 12, bgcolor: bgPaper, border: '1px solid', borderColor: divider, borderRadius: '50%' }} />
                            <Box sx={{ height: 4, width: 4, position: 'absolute', top: 0, right: 0, bgcolor: primaryMain, borderRadius: '50%' }} />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ width: '100%', mb: 2 }}>
                    <Box sx={{ height: 8, bgcolor: bgPaper, width: '20%', borderRadius: 1, mb: 0.5 }} />
                    <Box sx={{ height: 8, bgcolor: bgPaper, width: '100%', borderRadius: 1, mb: 0.5 }} />
                    <Box sx={{ height: 8, bgcolor: bgPaper, width: '100%', borderRadius: 1, mb: 0.5 }} />
                    <Box sx={{ height: 8, bgcolor: bgPaper, width: '100%', borderRadius: 1, mb: 0.5 }} />
                    <Box sx={{ height: 8, bgcolor: bgPaper, width: '45%', borderRadius: 1, mb: 0.5 }} />
                    <Box sx={{ height: 8, bgcolor: bgPaper, width: '10%', borderRadius: 1, mb: 0.5 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', width: '100%', mb: 2 }}>
                    <Box
                        sx={{
                            height: 16, flexGrow: 1,
                            border: '1px solid', borderColor: 'divider',
                            borderRadius: '2px',
                        }}
                    />
                    <Box sx={{ height: 16, width: 32, bgcolor: primaryMain, borderRadius: '2px' }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Box sx={{ height: 10, width: 20, bgcolor: primaryMain, border: '1px solid', borderColor: textSecondary, borderRadius: 1 }} />
                    <Box sx={{ height: 10, width: 20, bgcolor: bgPaper, border: '1px solid', borderColor: textSecondary, borderRadius: 1 }} />
                    <Box sx={{ height: 10, width: 20, bgcolor: bgPaper, border: '1px solid', borderColor: textSecondary, borderRadius: 1 }} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Radio
                    checked={selected}
                    onChange={onSelect}
                    value={label}
                />
                <Typography
                    variant='body1'
                    sx={{ color: selected ? 'primary.main' : 'text.secondary' }}
                >
                    {label.charAt(0).toUpperCase()}{label.substring(1)}
                </Typography>
            </Box>
        </Box>
    );
};