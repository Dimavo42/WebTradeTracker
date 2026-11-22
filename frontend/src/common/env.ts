function getEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export const ENV = {
  BASE_URL: getEnv("VITE_BASE_URL") ,
  // Only for local testing of the admin area. The BFF enforces this too.
  ALLOW_ADMIN_SIGNUP: import.meta.env.VITE_ALLOW_ADMIN_SIGNUP === "true",
};
