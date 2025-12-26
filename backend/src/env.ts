import 'dotenv/config'
import { z } from 'zod'

const portSchema = z.coerce.number().int().min(1).max(65535)

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: portSchema.optional().default(3000),
  ENABLE_CORS: z.stringbool(),
  TRUST_PROXY: z.stringbool(),
  CLIENT_ORIGIN: z.url({ protocol: /^https?$/ }),
  UPLOAD_DIR: z.string().nonempty(),
  SMTP_FROM: z.string().nonempty(),
  SMTP_HOST: z.hostname(),
  SMTP_PORT: portSchema,
  SMTP_USERNAME: z.string().nonempty(),
  SMTP_PASSWORD: z.string().nonempty(),
  LOG_LEVEL: z.string().optional().default('debug'),
})

const envParsed = envSchema.safeParse(process.env)

if (envParsed.error) {
  console.error('Failed to parse environment variables.')
  console.error(z.prettifyError(envParsed.error))
  process.exit(1)
}

const env = envParsed.data

export default env
