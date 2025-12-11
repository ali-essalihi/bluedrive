import 'dotenv/config'
import app from './app'

async function bootServer() {
  const server = app.listen(3000, (err) => {
    if (err) throw err
    console.log('Listening on ' + JSON.stringify(server.address()))
  })

  function shutdown() {
    server.close((err) => {
      if (err) throw err
      process.exit(0)
    })
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

bootServer()
