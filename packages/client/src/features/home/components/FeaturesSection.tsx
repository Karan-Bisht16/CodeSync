import React from 'react';
import {
    Box,
    Container,
    Grid,
    Stack,
    Typography
} from '@mui/material';
// importing data
import { homeJSON } from '../data/home.data';
// importing components
import { Tagline } from './Tageline';
import { FeaturesCard } from './FeaturesCard';

export const FeaturesSection: React.FC = () => {
    const { features } = homeJSON;

    return (
        <Container maxWidth='lg'>
            <Tagline text={features.tagline} />
            <Typography
                variant='h3'
                component='h3'
                sx={{
                    width: { xs: '100%', md: '75%' },
                    fontWeight: 'bold',
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '3rem' },
                    mb: 6
                }}
            >
                {features.heading}
            </Typography>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid size={{ sm: 12, md: 8 }}>
                    <Stack spacing={{ xs: 2, md: 3 }}>
                        <Box sx={{ height: { xs: 'auto', md: '188px' } }}>
                            <FeaturesCard
                                heading={features.list[0].heading}
                                tagline={features.list[0].tagline}
                                icon={features.list[0].icon}
                            />
                        </Box>
                        <Grid container spacing={{ xs: 2, md: 3 }}>
                            <Grid size={{ xs: 12, md: 6 }} sx={{ height: { xs: 'auto', md: '188px' } }}>
                                <FeaturesCard
                                    heading={features.list[1].heading}
                                    tagline={features.list[1].tagline}
                                    icon={features.list[1].icon}
                                    variant='outlined'
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} sx={{ height: { xs: 'auto', md: '188px' } }}>
                                <FeaturesCard
                                    heading={features.list[3].heading}
                                    tagline={features.list[3].tagline}
                                    icon={features.list[3].icon}
                                    variant='outlined'
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{ height: { xs: 'auto', md: '400px' } }}>
                    <FeaturesCard
                        heading={features.list[2].heading}
                        tagline={features.list[2].tagline}
                        icon={features.list[2].icon}
                        variant='outlined'
                        alignment='center'
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ height: { xs: 'auto', md: '180px' } }}>
                    <FeaturesCard
                        heading={features.list[4].heading}
                        tagline={features.list[4].tagline}
                        icon={features.list[4].icon}
                        variant='outlined'
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ height: { xs: 'auto', md: '180px' } }}>
                    <FeaturesCard
                        heading={features.list[5].heading}
                        tagline={features.list[5].tagline}
                        icon={features.list[5].icon}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};