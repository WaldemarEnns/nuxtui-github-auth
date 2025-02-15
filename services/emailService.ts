import { promises as fs } from 'fs';
import mjml2html from 'mjml';

/**
 * Loads an MJML template file.
 * @param template The template file-name.
 * @returns HTML represenation as string.
 */
async function loadTemplate (template: string): Promise<string> {
  const mjmlTemplate = await fs.readFile(`emails/templates/${template}.mjml`, 'utf-8');
  const { html, errors } = mjml2html(mjmlTemplate);

  if (errors && errors.length > 0) {
    throw new Error('Error parsing MJML template.')
  }

  return html
}

/**
 * Sends an email.
 * @param subject The subject of the mail.
 * @param to The recepient of the mail (must be an email).
 * @param template The used template (see /emails/templates). Default: 'default'.
 */
export async function sendMail (subject: string, to: string, template = 'default',): Promise<void> {
  const html = await loadTemplate(template)

  const { sendMail } = useNodeMailer()

  await sendMail({
    subject,
    to,
    html,
  })
}