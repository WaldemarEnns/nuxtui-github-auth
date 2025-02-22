import { promises as fs } from 'fs';
import mjml2html from 'mjml';

interface TemplateData {
  [key: string]: string;
}

/**
 * Loads an MJML template file and replaces variables.
 * @param template The template file-name.
 * @param data Optional key-value pairs to replace in template.
 * @returns HTML represenation as string.
 */
async function loadTemplate (template: string, data?: TemplateData): Promise<string> {
  let mjmlTemplate = await fs.readFile(`emails/templates/${template}.mjml`, 'utf-8');
  
  // Replace variables in template if data is provided
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      mjmlTemplate = mjmlTemplate.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
  }

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
 * @param content The content to be inserted in the template.
 * @param template The used template (see /emails/templates). Default: 'default'.
 * @param data Optional additional template variables.
 */
export async function sendMail (
  subject: string, 
  to: string, 
  content: string,
  template = 'default',
  data?: TemplateData
): Promise<void> {
  const templateData = {
    content,
    ...data
  };

  const html = await loadTemplate(template, templateData)

  const { sendMail } = useNodeMailer()

  await sendMail({
    subject,
    to,
    html,
  })
}