import type { Request, Response, NextFunction } from 'express'
import ApiError from '../ApiError'
import logger from '../logger'

/* eslint @typescript-eslint/no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */
export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message })
  }
  logger.error(err, 'Unexpected server error')
  res.status(500).json({ message: 'Something went wrong!' })
}
