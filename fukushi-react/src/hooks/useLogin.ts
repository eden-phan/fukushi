import { useState } from 'react';
import http from '@/services/http';
import { setToken, setUserCookies, setRole, setFacility } from '@/services/auth';
import { useAppContext } from '@/components/app-provider';
import { useRouter } from 'next/navigation';

interface LoginResponse {
  token: string;
  refresh_token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  role: string;
  facility?: number | string;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUserContext } = useAppContext();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await http.post('/auth/login', { email, password });

      // Handle both response.data.data and response.data patterns
      const data: LoginResponse = response.data.data || response.data;

      // Store tokens
      setToken('access_token', data.token);
      setToken('refresh_token', data.refresh_token);

      // Store user info
      setUserCookies(JSON.stringify(data.user));

      // Store role and facility
      if (data.role) {
        setRole(data.role);
      }

      if (data.facility) {
        setFacility(data.facility);
      }

      // Update context
      setUserContext(data.user);

      // Redirect based on role
      switch (data.role) {
        case 'admin':
          router.push('/');
          break;
        case 'manager':
          router.push('/group-home');
          break;
        case 'staff':
          router.push('/group-home');
          break;
        default:
          router.push('/group-home');
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}