// importing provider and context
import { UserProvider, useUserContext } from './contexts/User.context';
// importing hooks
import { useFetchUser } from './hooks/useFetchUser';

export {
    useFetchUser,
    UserProvider,
    useUserContext,
};