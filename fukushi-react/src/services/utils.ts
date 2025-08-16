import { decodeToken, getToken, removeTokens, setToken } from './auth';
import http from './http';

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  const accessToken = getToken('access_token');
  const refreshToken = getToken('refresh_token');
  if (!accessToken || !refreshToken) return;
  const decodedAccessToken = decodeToken(accessToken);
  const decodedRefreshToken = decodeToken(refreshToken);
  const now = Math.round(new Date().getTime() / 1000);
  if (decodedRefreshToken.exp <= now) {
    removeTokens();
    if (param?.onError) {
      param.onError();
    }
    return;
  }
  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    // Gọi API refresh token
    try {
      const response = await http.post('/refresh-token', {
        refresh_token: refreshToken,
      });
      const { access_token, refresh_token } = response.data as { access_token: string; refresh_token: string };
      setToken('access_token', access_token);
      setToken('refresh_token', refresh_token);
      if (param?.onSuccess) {
        param.onSuccess();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      if (param?.onError) {
        param.onError();
      }
    }
  }
};
