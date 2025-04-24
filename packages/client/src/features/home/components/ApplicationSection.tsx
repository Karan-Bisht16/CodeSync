import React from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    Typography
} from '@mui/material';
// importing data
import { homeJSON } from '../data/home.data';
// importing hooks
import { useNavigateRoom } from '../../../hooks/useNavigateRoom';
// importing components
import { ApplicationCard } from './ApplicationCard';

export const ApplicationSection: React.FC = () => {
    const { applications } = homeJSON;

    const { handleNavigateRoom } = useNavigateRoom();

    return (
        <Container maxWidth='lg'>
            <Typography
                variant='h3'
                component='h2'
                align='center'
                gutterBottom
                sx={{ fontWeight: 'bold', fontSize: { xs: '1.75rem', sm: '2rem', lg: '3rem' }, mb: 6 }}
            >
                Real World Applications
            </Typography>

            <Grid container spacing={{ xs: 2, md: 4 }}>
                {applications.list.map((application, index) => (
                    <ApplicationCard key={index} application={application} />
                ))}
            </Grid>

            <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={handleNavigateRoom}
                    sx={{ px: 6, py: 1.5, borderRadius: '8px' }}
                >
                    Start Coding Now
                </Button>
            </Box>
        </Container>
    );
};