import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Chip,
    Container,
    Divider,
    Grid,
    Typography
} from '@mui/material';
// importing data
import { constantsJSON } from '../data/constants.data';
import { layoutJSON } from '../data/layout.data';
// importing contexts
import { useColorContext } from '../contexts/Color.context';
// importing hooks
import { usePageNav } from '../hooks/usePageNavigation';
// importing components
import { Logo } from '../components/Logo';
// importing utils
import { linkTo } from '../utils/helpers.util';

type LinkGroupProps = {
    heading: string,
    list: { link: string, label: string }[],
    onClickFunction(link: string): void,
};

const LinkGroup: React.FC<LinkGroupProps> = (props) => {
    const { heading, list, onClickFunction } = props;

    return (
        <>
            <Typography variant='h6' gutterBottom>
                {heading}
            </Typography>
            {list.map(({ link, label }, index) => (
                <Typography
                    key={index}
                    variant='body2'
                    component='p'
                    onClick={() => onClickFunction(link)}
                    sx={{
                        display: 'block',
                        mb: 1,
                        color: 'text.secondary',
                        cursor: 'pointer',
                        ':hover': { textDecoration: 'underline' }
                    }}
                >
                    {label}
                </Typography>
            ))}
        </>
    );
};

export const Footer: React.FC = () => {
    const { websiteName } = constantsJSON;
    const { navigation, socials, version, tagline, email, phone } = layoutJSON;

    const { palette, theme } = useColorContext();

    const { handlePageNav } = usePageNav();

    const location = useLocation();
    if (location.pathname.startsWith('/editor/') || location.pathname.startsWith('/whiteboard/')) {
        return null;
    }

    return (
        <Box sx={{ py: 8, color: 'text.primary', bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider' }}>
            <Container maxWidth='lg'>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Logo
                            hideTitle={true}
                            color={palette[theme]?.text?.primary}
                            style='w-fit ml-2 mb-1'
                        />
                        <Chip label={version} variant='outlined' sx={{ bgcolor: 'background.paper' }} />
                    </Grid>

                    <Grid size={{ xs: 6, sm: 6, md: 2 }}>
                        <LinkGroup
                            heading={navigation.heading}
                            list={navigation.list}
                            onClickFunction={handlePageNav}
                        />
                    </Grid>

                    <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                        <LinkGroup
                            heading={socials.heading}
                            list={socials.list}
                            onClickFunction={linkTo}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant='body1' sx={{ fontSize: '16px', color: 'text.primary', mb: 2 }}>
                            {tagline}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                            {email}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {phone}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Box>
                    <Typography variant='body2' color='text.secondary' align='center'>
                        &copy; {new Date().getFullYear()} {websiteName}. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};