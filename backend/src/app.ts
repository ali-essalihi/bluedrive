import express from 'express'
import cors from 'cors'

const app = express()

app.disable('etag')
app.disable('x-powered-by')
app.set('trust proxy', process.env.TRUST_PROXY === 'true')

if (process.env.ENABLE_CORS === 'true') {
  app.use(
    cors({
      methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'PUT'],
      maxAge: 60 * 60 * 24,
      allowedHeaders: ['Content-Type'],
      credentials: true,
      exposedHeaders: [],
      origin: process.env.CLIENT_ORIGIN,
    })
  )
}

app.get('/health', (req, res) => {
  res.sendStatus(200)
})

export default app
