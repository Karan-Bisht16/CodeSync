import { useNavigate } from 'react-router-dom';

export const useNavigateRoom = () => {
    const navigate = useNavigate();
    
    const handleNavigateRoom = () => {
        navigate('/room');
    };

    return {
        handleNavigateRoom,
    };
};