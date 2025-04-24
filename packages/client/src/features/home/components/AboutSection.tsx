import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography
} from '@mui/material';
// importing data
import { homeJSON } from '../data/home.data';
// importing components
import { LazyImage } from '../../../components/LazyImage';
import { Tagline } from './Tageline';

export const AboutSection: React.FC = () => {
    const { about } = homeJSON;
    return (
        <Container maxWidth='lg'>
            <Grid container spacing={4} alignItems='center'>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Tagline text={about.tagline} />
                    <Typography variant='h3' component='h3' gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.75rem', sm: '2rem', lg: '3rem' } }}>
                        {about.heading}
                    </Typography>
                    <Typography variant='body1'>{about.content}</Typography>
                    <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.75rem', sm: '2rem', lg: '2.5rem' }, mt: 6 }}>
                        {about.subheading}
                    </Typography>
                    <Typography variant='body1'>{about.subcontent}</Typography>
                </Grid>
            </Grid>
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                {/* TODO: update this image */}
                <LazyImage
                    initialSrc='assets/img-about [low res].png'
                    finalSrc='assets/img-about [high res].png'
                    alt='placeholder image'
                    style='absolute right-0 bottom-0 w-[55%] max-h-[100%]'
                />
            </Box>
        </Container>
    );
};