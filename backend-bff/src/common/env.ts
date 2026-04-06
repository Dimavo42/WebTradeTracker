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

export const ENV = {
  DOTNET_API_URL: getEnv('DOTNET_API_URL'),
  PORT: Number(getEnv('PORT')),
  FRONT_URL_1: getEnv('FRONT_URL_1'),
  FRONT_URL_2: getEnv('FRONT_URL_2'),
  MOBILE_ORIGIN: getOptionalEnv('MOBILE_ORIGIN', '*'),
};
