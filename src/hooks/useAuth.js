// import { useSelector } from 'react-redux';

// export const useAuth = () => {
//   const auth = useSelector((state) => state.auth);
//   return {
//     ...auth,
//     isAdmin: auth.user?.role === 'admin',
//   };
// };
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isAdmin: user?.role === 'administrateur',
  };
};
