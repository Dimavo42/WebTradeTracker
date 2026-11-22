import dotenv from 'dotenv';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

// "https://a.com, https://b.com" -> ["https://a.com", "https://b.com"]
function getList(key: string): string[] {
  return getEnv(key)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export const ENV = {
  DOTNET_API_URL: getEnv('DOTNET_API_URL'),
  PORT: Number(getEnv('PORT')),
  // Browser origins allowed to call the BFF (comma-separated)
  FRONT_URLS: getList('FRONT_URL'),
  // "*" allows any origin — local development only. Native mobile apps send no Origin header,
  // so they don't need this.
  MOBILE_ORIGIN: getOptionalEnv('MOBILE_ORIGIN', ''),
  // Must be the same key the .NET API signs tokens with (Jwt__Key)
  JWT_KEY: getEnv('JWT_KEY'),
  JWT_ISSUER: getOptionalEnv('JWT_ISSUER', 'TradeWebAPI'),
  JWT_AUDIENCE: getOptionalEnv('JWT_AUDIENCE', 'TradeWebAPIUsers'),
  // Lets the register endpoint create Admin users. Keep false on any public deployment.
  ALLOW_ADMIN_SIGNUP: getOptionalEnv('ALLOW_ADMIN_SIGNUP', 'false') === 'true',
};
