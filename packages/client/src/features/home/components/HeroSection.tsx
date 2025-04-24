import React from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    Typography
} from '@mui/material';
// importing data
import { homeJSON } from '../data/home.data.ts';
// importing hooks
import { useNavigateRoom } from '../../../hooks/useNavigateRoom';
// importing utils
import { scrollTo } from '../../../utils/helpers.util';
// importing components
import { AnimatedCodeEditor } from './AnimatedCodeEditor';

export const HeroSection: React.FC = () => {
    const { heading, tagline } = homeJSON;

    const { handleNavigateRoom } = useNavigateRoom();

    return (
        <Box sx={{ height: { xs: '100%', sm: '100vh' }, mb: { xs: 10, sm: 0 } }}>
            <Box
                sx={{
                    overflow: 'hidden',
                    position: 'relative',
                    bgcolor: 'background.default',
                    pt: { xs: 12, sm: 16 },
                    pb: { xs: 10, sm: 10 },
                    px: { xs: 2, md: 4, lg: 0 }
                }}
            >
                <Container maxWidth='lg' className='!p-0'>
                    <Grid container spacing={{ xs: 4, md: 2, lg: 8 }} alignItems='center'>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant='h2'
                                component='h1'
                                gutterBottom
                                sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.75rem' } }}
                            >
                                {heading}
                            </Typography>
                            <Typography
                                variant='h5'
                                component='p'
                                color='text.secondary'
                                sx={{ fontSize: { xs: '1rem', sm: '1.25rem', lg: '1.5rem' } }}
                            >
                                {tagline}
                            </Typography>
                            <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    size='large'
                                    onClick={handleNavigateRoom}
                                    sx={{ px: 4, py: 1.5, mr: { xs: 0, sm: 2 }, borderRadius: '8px', width: { xs: '100%', sm: 'auto' } }}
                                >
                                    Get Started
                                </Button>
                                <Button
                                    variant='outlined'
                                    color='primary'
                                    size='large'
                                    onClick={() => scrollTo({ to: 'features-anchor' })}
                                    sx={{ px: 4, py: 1.5, borderRadius: '8px', width: { xs: '100%', sm: 'auto' } }}
                                >
                                    Learn More
                                </Button>
                            </Box>
                        </Grid>
                        <AnimatedCodeEditor />
                    </Grid>
                </Container>
            </Box>
            <div id='features-anchor' />
        </Box>
    );
};