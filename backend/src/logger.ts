import pino from 'pino'
import env from './env.js'

const logger = pino({
  level: env.LOG_LEVEL,
  base: null,
  transport: {
    target: 'pino-pretty',
  },
})

export default logger
