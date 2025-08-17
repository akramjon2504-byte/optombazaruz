import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Check localStorage for admin status as fallback
  const isAdminLocal = localStorage.getItem('isAdmin') === 'true';
  const adminUserLocal = localStorage.getItem('adminUser');
  
  const effectiveUser = user || (isAdminLocal && adminUserLocal ? JSON.parse(adminUserLocal) : null);
  const effectiveIsAdmin = (user as any)?.isAdmin || isAdminLocal;

  console.log('useAuth - server user:', user, 'local admin:', isAdminLocal, 'effective user:', effectiveUser);

  return {
    user: effectiveUser,
    isLoading,
    isAuthenticated: !!effectiveUser && !(effectiveUser as any)?.message,
    isAdmin: effectiveIsAdmin,
    error,
  };
}