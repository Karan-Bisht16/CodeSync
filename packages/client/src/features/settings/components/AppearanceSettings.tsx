import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
// importing types
import type { Theme } from '../../../types/Color.types';
// importing contexts
import { useColorContext } from '../../../contexts/Color.context';
import { useSettingsContext } from '../contexts/Settings.context';
// importing components
import { SectionHeading } from './SectionHeading';
import { ThemePreviewCard } from './ThemePreviewCard';

export const AppearanceSettings: React.FC = () => {
    const { palette } = useColorContext();
    const { settings, updateTheme } = useSettingsContext();

    return (
        <Stack spacing={3}>
            <SectionHeading text='Appearance' />
            <Box>
                <Typography variant='subtitle2'>
                    Theme
                </Typography>
                <Typography variant='subtitle1' color='text.secondary' fontSize='small' sx={{ mb: 2 }}>
                    Personalize your experience with themes that match your style.
                </Typography>
                <Grid container spacing={2}>
                    {Object.keys(palette).map((theme, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                            <ThemePreviewCard
                                label={theme}
                                selected={settings.theme === theme}
                                theme={palette[theme as Theme]}
                                onSelect={() => updateTheme(theme as Theme)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Stack>
    );
};