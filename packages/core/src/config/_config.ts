// import { logger } from '@yumm/utils';
// import { config } from 'dotenv';
// import path from 'path';
// import { ZodError, z } from 'zod';

// if (process.env.NODE_ENV === 'development') {
//   config({ path: '.env.dev' });
// } else config();

// export const MESSAGES = {
//   DB_CONNECTED: 'database connected',
//   ADMIN_SEEDED: 'admin seeded',
//   INTERNAL_SERVER_ERROR: 'Internal Server Error. Please try again!',
//   INVALID_CREDENTIALS: 'Invalid Credentials',
//   LOGIN_SUCCESS: 'Login Success',
//   UNAUTHORIZED: 'Unauthorized access',
//   INPUT_VALIDATION_ERROR: 'Input Validation Error',
//   INVALID_REQUEST: 'Invalid Request',
//   ROUTE_DOES_NOT_EXIST: 'Sorry Route does not exists',
//   SERVER_STARTED: 'Server running on port',
//   MONGODB_CONNECTED: 'DB Connected',
//   MIN_PASSWORD_ERROR: 'password cannot be less than six',
//   PASSWORD_MATCH_ERROR: 'password does not match',
//   SEED_ACCOUNT_CREATED: 'Seeded',
//   INVALID_EMAIL: 'invalid email',
//   SHORT_PASSWORD: 'password must be at least 8 characters',
//   USER_EXISTS: 'user exists',
//   INVALID_RECORD: 'record does not exist',
//   INVALID_SESSION: 'user does not have an active session',
//   ACTIVE_SESSION: 'user session is active on another device. login again to reclaim session',
//   DOC_NOT_FOUND: 'documentation url not found',
//   PAYSTACK_NOT_INITIALIZED: 'paystack not initialized',
// };

// const EnvSchema = z.object({
//   PORT: z.string(),
//   DB_URI: z.string(),
//   JWT_KEY: z.string(),
//   JWT_TIMEOUT: z.string(),
//   REFRESH_JWT_KEY: z.string().optional(),
//   REFRESH_JWT_TIMEOUT: z.string().optional(),
//   GOOGLE_API_CLIENT_ID: z.string().optional(),
//   GOOGLE_API_CLIENT_SECRET: z.string().optional(),
//   GOOGLE_API_REDIRECT: z.string().optional(),
//   API_HOST: z.string().optional(),
//   FRONTEND_GOOGLE_LOGIN_URI: z.string().optional(),
//   FACEBOOK_API_CLIENT_ID: z.string().optional(),
//   FACEBOOK_API_CLIENT_SECRET: z.string().optional(),
//   FACEBOOK_API_REDIRECT: z.string().optional(),
//   FRONTEND_FACEBOOK_LOGIN_URI: z.string().optional(),
//   APPLE_API_CLIENT_ID: z.string().optional(),
//   APPLE_API_REDIRECT: z.string().optional(),
//   APPLE_API_CLIENT_SECRET: z.string().optional(),
//   APPLE_TEAM_ID: z.string().optional(),
//   APPLE_KEY_IDENTIFIER: z.string().optional(),
//   SMTP_SERVICE: z.string().optional(),
//   SMTP_HOSTNAME: z.string().optional(),
//   SMTP_PORT: z.string().optional(),
//   SMTP_USERNAME: z.string().optional(),
//   SMTP_PASSWORD: z.string().optional(),
//   SEEDER_EMAIL: z.string().optional(),
//   DOMAIN_EMAIL: z.string().optional(),
//   SEEDER_PASSWORD: z.string().optional(),
//   DOCS_URL: z.string().optional(),
//   AWS_BUCKET_NAME: z.string().optional(),
//   AWS_REGION: z.string().optional(),
//   AWS_ACCESS_KEY_ID: z.string().optional(),
//   AWS_SECRET_ACCESS_KEY: z.string().optional(),
//   PAYSTACK_SECRET: z.string().optional(),
//   MULTER_STORAGE_PATH: z.string().optional(),
//   NODE_ENV: z.string().optional(),
//   DIGITALOCEAN_SPACE_ENDPOINT: z.string().optional(),
// });

// // export const {

// // } = <Record<string, string>>process.env;

// export const CONSTANTS = {
//   ROOT: path.join(__dirname, '..', '..'),
// };

// const multerSchema = z.object({
//   USE_MULTER_S3: z.boolean().default(false),
//   USE_MULTER_DIGITALOCEAN_SPACE: z.boolean().default(false),
//   USE_MULTER_CLOUDINARY: z.boolean().default(false),
//   USE_MULTER_MEMORY_STORAGE: z.boolean().default(false),
//   USE_MULTER_DISK_STORAGE: z.boolean().default(false),
// });

// const mailSchema = z.object({
//   USE_SMTP: z.boolean().default(false),
//   USE_SENDGRID: z.boolean().default(false),
//   USE_MAIL_GUN: z.boolean().default(false),
// });

// const optionsObject = z
//   .object({
//     USE_ADMIN_SEED: z.boolean().default(false),
//     USE_SMTP: z.boolean().default(false),
//     USE_SOCKETS: z.boolean().default(false),
//     USE_AUTH_SESSIONS: z.boolean().default(false),
//     USE_REFRESH_TOKEN: z.boolean().default(false),
//     USE_OAUTH_GOOGLE: z.boolean().default(false),
//     USE_OAUTH_FACEBOOK: z.boolean().default(false),
//     USE_OAUTH_APPLE: z.boolean().default(false),
//     USE_PAYSTACK: z.boolean().default(false),
//     USE_ANALYTICS: z.boolean().default(false),
//     USE_DATABASE: z.enum(['mongodb', 'postgresql', 'sqlite']).default('mongodb'),
//   })
//   .merge(multerSchema)
//   .merge(mailSchema);

// const onlyOneTrue =
//   (type: 'MULTER' | 'EMAIL PROTOCOL') =>
//   (value: Record<string, boolean>): boolean => {
//     const valueList = Object.entries(value);
//     const count = Object.keys(value).filter((k, i) => valueList[i][1]);
//     if (count.length <= 1) return true;

//     throw new ZodError([
//       { code: 'custom', path: count, message: `Only one ${type} option can be true. Currently: ${count.join(', ')}` },
//     ]);
//   };

// const options: z.infer<typeof optionsObject> = require(CONSTANTS.ROOT + '/appConfig.json');

// multerSchema.refine(onlyOneTrue('MULTER'));
// mailSchema.refine(onlyOneTrue('EMAIL PROTOCOL'));

// export const OPTIONS = optionsObject.parse(options);

// let envSchema = z.object({
//   PORT: z.number(),
//   DB_URI: z.string().url(),
//   JWT_KEY: z.string(),
//   JWT_TIMEOUT: z.string(),
// });

// if (OPTIONS.USE_ADMIN_SEED) {
//   envSchema = envSchema.extend({
//     SEEDER_EMAIL: z.string().email(),
//     SEEDER_PASSWORD: z.string(),
//   });
// }

// if (OPTIONS.USE_PAYSTACK) {
//   envSchema = envSchema.extend({
//     PAYSTACK_SECRET: z.string(),
//   });
// }

// if (OPTIONS.USE_MULTER_DISK_STORAGE) {
//   envSchema = envSchema.extend({
//     MULTER_STORAGE_PATH: z.string(),
//   });
// }

// if (OPTIONS.USE_REFRESH_TOKEN) {
//   envSchema = envSchema.extend({
//     REFRESH_JWT_KEY: z.string(),
//     REFRESH_JWT_TIMEOUT: z.string(),
//   });
// }

// if (OPTIONS.USE_MULTER_S3 || OPTIONS.USE_MULTER_DIGITALOCEAN_SPACE) {
//   envSchema = envSchema.extend({
//     AWS_BUCKET_NAME: z.string(),
//     AWS_REGION: z.string(),
//     AWS_ACCESS_KEY_ID: z.string(),
//     AWS_SECRET_ACCESS_KEY: z.string(),
//   });
// }

// if (OPTIONS.USE_MULTER_DIGITALOCEAN_SPACE) {
//   envSchema = envSchema.extend({
//     DIGITALOCEAN_SPACE_ENDPOINT: z.string(),
//   });
// }

// if (OPTIONS.USE_SMTP) {
//   envSchema = envSchema.extend({
//     SMTP_SERVICE: z.string(),
//     SMTP_HOSTNAME: z.string(),
//     SMTP_PORT: z.string(),
//     SMTP_USERNAME: z.string(),
//     SMTP_PASSWORD: z.string(),
//     DOMAIN_EMAIL: z.string(),
//   });
// }

// if (OPTIONS.USE_MAIL_GUN) {
//   envSchema = envSchema.extend({
//     DOMAIN_EMAIL: z.string(),
//   });
// }

// if (OPTIONS.USE_SENDGRID) {
//   envSchema = envSchema.extend({
//     DOMAIN_EMAIL: z.string(),
//   });
// }

// if (OPTIONS.USE_OAUTH_GOOGLE) {
//   envSchema = envSchema.extend({
//     API_HOST: z.string(),
//     GOOGLE_API_CLIENT_ID: z.string(),
//     GOOGLE_API_CLIENT_SECRET: z.string(),
//     GOOGLE_API_REDIRECT: z.string(),
//     FRONTEND_GOOGLE_LOGIN_URI: z.string(),
//   });
// }

// if (OPTIONS.USE_OAUTH_FACEBOOK) {
//   envSchema = envSchema.extend({
//     FRONTEND_FACEBOOK_LOGIN_URI: z.string(),
//     API_HOST: z.string(),
//     FACEBOOK_API_CLIENT_ID: z.string(),
//     FACEBOOK_API_CLIENT_SECRET: z.string(),
//     FACEBOOK_API_REDIRECT: z.string(),
//   });
// }

// if (OPTIONS.USE_OAUTH_APPLE) {
//   envSchema = envSchema.extend({
//     API_HOST: z.string(),
//     APPLE_API_CLIENT_ID: z.string(),
//     APPLE_API_REDIRECT: z.string(),
//     APPLE_API_CLIENT_SECRET: z.string(),
//     APPLE_TEAM_ID: z.string(),
//     APPLE_KEY_IDENTIFIER: z.string(),
//   });
// }

// export function optionsValidation() {
//   try {
//     const ENV = <z.infer<typeof EnvSchema>>(<unknown>envSchema.parse(process.env));
//     (<any>global).ENV = ENV;
//   } catch (error) {
//     logger.error(['missing env config options']);
//     throw error;
//   }
// }
