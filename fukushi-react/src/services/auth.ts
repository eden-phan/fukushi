import jwt from 'jsonwebtoken';
import { TokenPayload, TokenType } from '@/constants/type';
import Cookies from 'js-cookie';

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
export const getToken = (token: TokenType) => {
  return Cookies.get(token);
};
export const setToken = (token: TokenType, value: string) => {
  if (!value) {
    console.log('Warning: Trying to set empty token for', token);
    return;
  }
  
  try {
    const decode = decodeToken(value);
    if (decode && decode.exp) {
      const expireDate = new Date(decode.exp * 1000);
      Cookies.set(token, value, {
        expires: expireDate,
      });
    } else {
      // Fallback to 7 days if can't decode expiration
      Cookies.set(token, value, {
        expires: 7
      });
    }
  } catch (error) {
    console.log('Error decoding token, using 7 day expiry:', error);
    Cookies.set(token, value, {
      expires: 7
    });
  }
};

export const getUserCookies = () => {
  return Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null;
}

export const setUserCookies = (value: string) => {
  Cookies.set('user', value, {
    expires: new Date(2147483647 * 1000),
  });
};

export const getRole = () => {
  return Cookies.get('role');
}

export const setRole = (value: string) => {
  Cookies.set('role', value, {
    expires: 7 // 7 days
  });
};

export const removeRole = () : void => {
  Cookies.remove('role');
};

export const removeTokens = () => {
  Cookies.remove('refresh_token');
  Cookies.remove('access_token');
};

export const removeUser = () : void => {
  Cookies.remove('user');
};

// Facility functions (without Id suffix)
export const getFacility = () => {
  return Cookies.get('facility');
};

export const setFacility = (value: number | string) => {
  Cookies.set('facility', value.toString(), {
    expires: 7 // 7 days
  });
};

export const removeFacility = () : void => {
  Cookies.remove('facility');
};
