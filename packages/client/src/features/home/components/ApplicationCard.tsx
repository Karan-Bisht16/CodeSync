import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from '@mui/material';
// importing icons
import {
    Code,
    Dashboard,
    Group,
    School,
} from '@mui/icons-material';

type ApplicationCardProps = {
    application: {
        heading: string;
        tagline: string;
        icon: string;
    }
};

export const ApplicationCard: React.FC<ApplicationCardProps> = (props) => {
    const { application } = props;
    const { heading, tagline, icon } = application;

    const applicationsIconMap = { School, Dashboard, Group };

    const IconComponent = applicationsIconMap.hasOwnProperty(icon)
        ? applicationsIconMap[icon as keyof typeof applicationsIconMap]
        : Code;

    return (
        <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', mb: 3 }}>
                        <Box
                            sx={{
                                height: '50px',
                                width: '50px',
                                position: 'absolute',
                                bottom: '-8px',
                                left: '8px',
                                bgcolor: 'rgba(80, 72, 229, 0.1)',
                                borderRadius: '50%',
                            }}
                        />
                        <IconComponent
                            sx={{
                                height: '64px',
                                width: '64px',
                                position: 'relative',
                                zIndex: 1,
                                color: 'primary.contrastText',
                                bgcolor: 'primary.main',
                                p: 1.5,
                                borderRadius: '50%',
                            }}
                        />
                        <Typography variant='h6' component='h3' sx={{ fontWeight: 'bold', ml: 2 }}>
                            {heading}
                        </Typography>
                    </Box>
                    <Typography variant='body1' color='text.secondary'>
                        {tagline}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};