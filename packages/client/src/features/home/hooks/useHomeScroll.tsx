import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// importing utils
import { scrollTo } from '../../../utils/helpers.util';

export const useHomeScroll = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo) {
            scrollTo({ to: location.state.scrollTo });
        }
    }, [location]);
};