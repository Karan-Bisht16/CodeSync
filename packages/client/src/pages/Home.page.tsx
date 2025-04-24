import React from 'react';
import { Box } from '@mui/material';
// importing features
import {
    AboutSection,
    ApplicationSection,
    FeaturesSection,
    HeroSection,
    useHomeScroll
} from '../features/home';

export const Home: React.FC = () => {
    useHomeScroll();

    return (
        <Box sx={{ width: '100%', color: 'text.primary', bgcolor: 'background.paper' }}>
            <HeroSection />

            <Box sx={{ pb: 10 }}>
                <FeaturesSection />
                <div id='about-anchor' />
            </Box>

            <Box sx={{ position: 'relative', bgcolor: 'background.default', py: 10 }}>
                <AboutSection />
                <div id='applications-anchor' />
            </Box>

            <Box sx={{ py: 10 }}>
                <ApplicationSection />
            </Box>
        </Box>
    );
};