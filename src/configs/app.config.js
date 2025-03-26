import { getEnv } from "../utils/get-env.js";


const appConfig = () => ({
    PORT: getEnv("PORT", "8000"),
    NODE_ENV: getEnv("NODE_ENV", "development"),
    MONGODB_URI: getEnv("MONGODB_URI", "mongodb://127.0.0.1:27017/project"),
    DOMAIN_ORIGIN: getEnv("DOMAIN_ORIGIN", "http://localhost:5173"),
    ACCESS_TOKEN_KEY: getEnv("ACCESS_TOKEN_KEY", "key_access"),
    ACCESS_TOKEN_TIME: getEnv("ACCESS_TOKEN_TIME", "5m"),
    REFRESH_TOKEN_KEY: getEnv("REFRESH_TOKEN_KEY", "key_refresh"),
    REFRESH_TOKEN_TIME: getEnv("REFRESH_TOKEN_TIME", "7d"),
    CLOUDINARY_CLOUD_NAME:getEnv("CLOUDINARY_CLOUD_NAME", "name"),
    CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY", "key"),
    CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET", "secret")

});

export const config = appConfig();
