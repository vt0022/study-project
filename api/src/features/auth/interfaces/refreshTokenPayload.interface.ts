export interface RefreshTokenPayload {
  sub: number;
  jti: string;
  iat?: number;
  exp?: number;
}
