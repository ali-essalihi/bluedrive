import nodemailer from 'nodemailer'
import mustache from 'mustache'
import fs from 'fs-extra'
import path from 'path'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
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
  const templatePath = path.join(__dirname, 'templates', templateId + '.txt')
  const template = await fs.readFile(templatePath, 'utf8')
  const text = mustache.render(template, data)
  const from = process.env.SMTP_FROM
  return transporter.sendMail({ from, to, subject, text })
}
