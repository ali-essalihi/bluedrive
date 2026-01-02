import express from 'express'
import cors from 'cors'
import ApiError from './ApiError.js'
import errorHandler from './middlewares/error-handler.js'
import hpp from 'hpp'
import env from './env.js'
import morgan from 'morgan'

const app = express()

app.disable('etag')
app.disable('x-powered-by')
app.set('trust proxy', env.TRUST_PROXY)

if (env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

if (env.ENABLE_CORS) {
  app.use(
    cors({
      methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'PUT'],
      maxAge: 60 * 60 * 24,
      allowedHeaders: ['Content-Type'],
      credentials: true,
      exposedHeaders: [],
      origin: env.CLIENT_ORIGIN,
    })
  )
}

app.use(hpp({ checkBody: false }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.sendStatus(200)
})

app.use(() => {
  throw new ApiError(404, 'The requested resource was not found')
})

app.use(errorHandler)

export default app
