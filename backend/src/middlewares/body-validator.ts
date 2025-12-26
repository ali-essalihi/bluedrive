import type { Request, Response, NextFunction } from 'express'
import type { ZodObject } from 'zod'
import ApiError from '../ApiError'

export default function bodyValidator(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { success, data } = schema.safeParse(req.body)
    if (!success) {
      throw new ApiError(400, 'Invalid request body.')
    }
    req.body = data
    next()
  }
}
