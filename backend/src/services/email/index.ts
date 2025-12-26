import nodemailer from 'nodemailer'
import mustache from 'mustache'
import fs from 'fs-extra'
import path from 'path'
import env from '../../env'
import logger from '../../logger'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
})

interface Templates {
  welcome: {
    username: string
  }
}

type TemplateId = keyof Templates

interface Options<K extends TemplateId> {
  to: string
  subject: string
  templateId: K
  data: Templates[K]
}

export async function sendEmail<K extends TemplateId>(options: Options<K>) {
  const { to, subject, templateId, data } = options
  try {
    const templatePath = path.join(__dirname, 'templates', templateId + '.txt')
    const template = await fs.readFile(templatePath, 'utf8')
    const text = mustache.render(template, data)
    const from = env.SMTP_FROM
    logger.debug(options, 'Sending email')
    const { response } = await transporter.sendMail({ from, to, subject, text })
    logger.info({ templateId, to, response }, 'Email sent successfully')
  } catch (err) {
    logger.error({ err, to, templateId }, 'Failed to send email')
  }
}
