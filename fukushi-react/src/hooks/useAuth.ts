import { useAppContext } from '@/components/app-provider';
import { getRole, getFacility, removeTokens, removeUser, removeRole, removeFacility } from '@/services/auth';
import { useRouter } from 'next/navigation';

type Role = 'admin' | 'manager' | 'staff';

export function useAuth() {
  const { userContext, isAuth, setUserContext } = useAppContext();
  const router = useRouter();

  const role = getRole() as Role | undefined;
  const facility = getFacility();

  // Check if user has specific role
  const hasRole = (requiredRole: Role): boolean => {
    if (!isAuth || !role) return false;
    return role === requiredRole;
  };

  // Check if user belongs to specific facility
  const hasFacility = (requiredFacility: string | number): boolean => {
    if (!isAuth || !facility) return false;
    return facility === requiredFacility.toString();
  };

  // Check both role and facility
  const hasAccess = (requiredRole?: Role, requiredFacility?: string | number): boolean => {
    if (!isAuth) return false;

    // Admin can access everything
    if (role === 'admin') return true;

    // Check role if specified
    if (requiredRole && role !== requiredRole) return false;

    // Check facility if specified
    if (requiredFacility && facility !== requiredFacility.toString()) return false;

    return true;
  };

  // Convenience role checks
  const isAdmin = (): boolean => role === 'admin';
  const isManager = (): boolean => role === 'manager';
  const isStaff = (): boolean => role === 'staff';
  const isManagerOrAdmin = (): boolean => role === 'admin' || role === 'manager';
  const canManageUsers = (): boolean => role === 'admin' || role === 'manager';

  // Role-based redirect
  const redirectByRole = () => {
    if (!isAuth || !role) {
      router.push('/login');
      return;
    }

    switch (role) {
      case 'admin':
        router.push('/');
        break;
      case 'manager':
      case 'staff':
        router.push('/group-home/dashboard');
        break;
      default:
        router.push('/login');
    }
  };

  // Logout function
  const logout = () => {
    removeTokens();
    removeUser();
    removeRole();
    removeFacility();
    setUserContext(null);
    router.push('/login');
  };

  return {
    // User data
    userContext,
    isAuth,
    role,
    facility,

    // Access control functions
    hasRole,
    hasFacility,
    hasAccess,
    isAdmin,
    isManager,
    isStaff,
    isManagerOrAdmin,
    canManageUsers,

    // Actions
    logout,
    redirectByRole
  };
}