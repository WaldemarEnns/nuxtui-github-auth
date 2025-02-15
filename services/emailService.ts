import { promises as fs } from 'fs';
import mjml2html from 'mjml';

export async function sendWelcomeEmail(email: string) {
  try {
    // Assuming useNodeMailer is globally available or imported elsewhere
    const { sendMail } = useNodeMailer();
    const mjmlTemplate = await fs.readFile('emails/templates/default.mjml', 'utf-8');
    const { html, errors } = mjml2html(mjmlTemplate);

    if (errors && errors.length > 0) {
      console.error('MJML Errors:', errors);
    }

    await sendMail({
      subject: 'Welcome to our platform! 👋🏼',
      html,
      to: email,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
} 