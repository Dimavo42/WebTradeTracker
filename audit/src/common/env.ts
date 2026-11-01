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

export const ENV = {
  PORT: Number(getEnv('PORT')),
  KAFKA_GROUP_ID: getEnv('KAFKA_GROUP_ID'),
  KAFKA_BROKERS: getEnv('KAFKA_BROKERS'),
  AUDIT_DB_PATH: getEnv('AUDIT_DB_PATH'),
};
