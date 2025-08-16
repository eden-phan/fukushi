export type TokenType = 'refresh_token' | 'access_token';
export interface TokenPayload {
  exp: number;
  iat: number;
  //
}

