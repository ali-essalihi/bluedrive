import env from './env'
import app from './app'
import logger from './logger'

function bootServer() {
  logger.info('Booting server')
  const server = app.listen(env.PORT, (err) => {
    if (err) throw err
    logger.info(`Listening on port ${env.PORT}`)
  })

  function shutdown(signal: NodeJS.Signals) {
    logger.info('Received %s. Shutting down', signal)
    server.close((err) => {
      if (err) throw err
      logger.info('Server closed. Exiting')
      process.exit(0)
    })
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

bootServer()
