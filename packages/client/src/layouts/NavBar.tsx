import React, { useEffect, useState } from 'react';
import { Link as NavigateLink, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
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
import { NavActions } from './NavActions';

export const NavBar: React.FC = () => {
    const { navbarHeight, scrollPt, transitionDuration } = constantsJSON;
    const { navigation } = layoutJSON;

    const { palette, theme } = useColorContext();

    const { handlePageNav } = usePageNav();

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > scrollPt);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const location = useLocation();
    if (location.pathname.startsWith('/editor/') || location.pathname.startsWith('/whiteboard/')) {
        return null;
    }

    return (
        <AppBar
            position='fixed'
            elevation={scrolled ? 4 : 0}
            sx={{
                bgcolor: scrolled ? 'background.paper' : 'transparent',
                transition: `all ${transitionDuration / 1000}s ease`,
                backdropFilter: scrolled ? 'blur(8px)' : 'none',
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', height: navbarHeight, pl: { xs: '16px', md: '32px !important' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <NavigateLink to='/' >
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Logo
                                color={palette[theme]?.text?.primary}
                                style='pb-1'
                            />
                        </Box>
                        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Logo
                                color={palette[theme]?.text?.primary}
                                style='pb-1'
                                hideTitle
                            />
                        </Box>
                    </NavigateLink>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
                        {navigation.list.map(({ link, label }, index) => (
                            <Typography
                                key={index}
                                variant='body2'
                                component='p'
                                onClick={() => handlePageNav(link)}

                                sx={{
                                    fontSize: '14px',
                                    color: 'text.secondary',
                                    cursor: 'pointer',
                                    ':hover': {
                                        color: 'text.primary',
                                        scale: 1.005
                                    }
                                }}
                            >
                                {label}
                            </Typography>
                        ))}
                    </Box>
                </Box>
                <NavActions />
            </Toolbar>
        </AppBar>
    );
};