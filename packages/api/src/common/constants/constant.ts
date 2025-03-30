export class Constants {
  static readonly REFRESH_TOKEN_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
  static readonly REFRESH_TOKEN_COOKIE_PATH = '/api/auth';
  static readonly CODE_EXPIRES_IN = 1000 * 60 * 15; // 15 minutes
  static readonly MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
}
