import { useNavigate } from 'react-router-dom';
// importing utils
import { scrollTo } from '../utils/helpers.util';

export const usePageNav = () => {
    const navigate = useNavigate();
    const handlePageNav = (link: string) => {
        if (location.pathname === '/') {
            scrollTo({ to: link });
        } else {
            navigate('/', { state: { scrollTo: link } });
        }
    };

    return {
        handlePageNav,
    };
};