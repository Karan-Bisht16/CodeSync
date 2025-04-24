import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Container,
    Grid,
    Typography
} from '@mui/material';
// importing contexts
import { useColorContext } from '../contexts/Color.context';
// importing features
import {
    EntryForm,
    RoomBackgroundSVG
} from '../features/room';

export const Room: React.FC = () => {
    const { palette, theme } = useColorContext();

    const contrastText = (palette[theme]?.primary && 'contrastText' in palette[theme]?.primary)
        ? (palette[theme]?.primary as any).contrastText
        : '#ffffff';

    const roomJSON = {
        heading: 'Join a collaborative coding session',
        tagline: 'Enter your details below to create or join a room. Share the Room ID with others to collaborate in real-time.',
        features: [
            {
                heading: '100%',
                caption: 'Real-time sync',
            },
            {
                heading: '20+',
                caption: 'Languages',
            },
            {
                heading: '0',
                caption: 'Setup needed',
            }
        ]
    };

    const { heading, tagline, features } = roomJSON;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                width: '100%',
                position: 'relative',
                color: 'text.primary',
                bgcolor: 'background.default',
                py: { xs: 12, md: 8 },
            }}
        >
            <Container maxWidth='lg'>
                <Grid container spacing={4} alignItems='center'>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ mb: { xs: 0, md: 6 } }}>
                            <Typography
                                variant='h3'
                                color='text.primary'
                                gutterBottom
                                sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
                            >
                                {heading}
                            </Typography>
                            <Typography variant='body1' color='text.secondary' sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                                {tagline}
                            </Typography>
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <RoomBackgroundSVG
                                width='100%'
                                primary={'#CAC6FF'}
                                secondary={'#22212F'}
                                tertiary={contrastText}
                            />
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <EntryForm />
                        <Grid container spacing={2} sx={{ mt: 4 }}>
                            {features.map((feature, index) => (
                                <Grid key={index} size={4}>
                                    <Card sx={{ height: '100%', borderRadius: 3, bgcolor: 'background.paper' }}>
                                        <CardContent sx={{ textAlign: 'center', p: { xs: 1, md: 2 } }}>
                                            <Typography
                                                variant='h4'
                                                color='primary'
                                                sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' }, mb: { xs: 0.5, md: 1 } }}
                                            >
                                                {feature.heading}
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                color='text.secondary'
                                                sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}
                                            >
                                                {feature.caption}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};