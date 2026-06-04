interface EnvConfig {
  NODE_ENV: string
  PORT: number
  DATABASE_URL: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  JWT_REFRESH_EXPIRES_IN: string
  BCRYPT_SALT_ROUNDS: number
  CORS_ORIGIN?: string
  COS_CDN_PATH?: string
  COS_BUCKET?: string
  COS_REGION?: string
  COS_SECRET_ID?: string
  COS_SECRET_KEY?: string
  COS_APP_ID?: string
  COS_ALLOW_ACTIONS?: string
  COS_DURATION_SECONDS?: number
  COS_RESOURCE_PATH?: string
  SCREENSHOT_SERVICE_URL?: string
  SCREENSHOT_TIMEOUT_MS?: number
}

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const required = ['DATABASE_URL', 'JWT_SECRET']
  for (const key of required) {
    if (!config[key]) throw new Error(`Missing required env: ${key}`)
  }

  return {
    NODE_ENV: String(config.NODE_ENV ?? 'development'),
    PORT: Number(config.PORT ?? 5177),
    DATABASE_URL: String(config.DATABASE_URL),
    JWT_SECRET: String(config.JWT_SECRET),
    JWT_EXPIRES_IN: String(config.JWT_EXPIRES_IN ?? '2h'),
    JWT_REFRESH_EXPIRES_IN: String(config.JWT_REFRESH_EXPIRES_IN ?? '7d'),
    BCRYPT_SALT_ROUNDS: Number(config.BCRYPT_SALT_ROUNDS ?? 12),
    CORS_ORIGIN: config.CORS_ORIGIN ? String(config.CORS_ORIGIN) : undefined,
    COS_CDN_PATH: config.COS_CDN_PATH ? String(config.COS_CDN_PATH) : undefined,
    COS_BUCKET: config.COS_BUCKET ? String(config.COS_BUCKET) : undefined,
    COS_REGION: config.COS_REGION ? String(config.COS_REGION) : undefined,
    COS_SECRET_ID: config.COS_SECRET_ID ? String(config.COS_SECRET_ID) : undefined,
    COS_SECRET_KEY: config.COS_SECRET_KEY ? String(config.COS_SECRET_KEY) : undefined,
    COS_APP_ID: config.COS_APP_ID ? String(config.COS_APP_ID) : undefined,
    COS_ALLOW_ACTIONS: config.COS_ALLOW_ACTIONS ? String(config.COS_ALLOW_ACTIONS) : undefined,
    COS_DURATION_SECONDS: config.COS_DURATION_SECONDS ? Number(config.COS_DURATION_SECONDS) : undefined,
    COS_RESOURCE_PATH: config.COS_RESOURCE_PATH ? String(config.COS_RESOURCE_PATH) : undefined,
    SCREENSHOT_SERVICE_URL: config.SCREENSHOT_SERVICE_URL ? String(config.SCREENSHOT_SERVICE_URL) : undefined,
    SCREENSHOT_TIMEOUT_MS: config.SCREENSHOT_TIMEOUT_MS ? Number(config.SCREENSHOT_TIMEOUT_MS) : undefined,
  }
}
