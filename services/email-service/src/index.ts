import { createKafkaClient } from '@pingflow/kafka-client';
import { createServiceLogger } from '@pingflow/logger';
import { KafkaEvent, EventCategory, KafkaTopics } from '@pingflow/shared-types';
import nodemailer from 'nodemailer';

const logger = createServiceLogger('email-service');
const kafka = createKafkaClient();

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@pingflow.com';

// Create transporter (or mock if no credentials)
const transporter = SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    })
    : null;

async function handleEmailNotification(event: KafkaEvent) {
    try {
        const { category, fields, timestamp } = event;

        // Build email content
        const subject = `${category.emoji} ${category.name}`;
        const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${category.color};">${category.emoji} ${category.name}</h2>
        <p style="color: #666;">Event received at ${new Date(timestamp).toLocaleString()}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          ${Object.entries(fields)
                .map(
                    ([key, value]) => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${key}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${value}</td>
            </tr>
          `
                )
                .join('')}
        </table>
        <p style="margin-top: 20px; color: #999; font-size: 12px;">
          Powered by PingFlow
        </p>
      </div>
    `;

        const textBody = `
${category.emoji} ${category.name}

${Object.entries(fields)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')}

Event received at ${new Date(timestamp).toLocaleString()}
    `.trim();

        // Get recipient email from fields
        const recipientEmail = fields.email || fields.recipient || fields.to;

        if (!recipientEmail) {
            logger.warn({ event }, 'No recipient email found in event fields');
            return;
        }

        if (transporter) {
            // Send real email
            const info = await transporter.sendMail({
                from: FROM_EMAIL,
                to: recipientEmail as string,
                subject,
                text: textBody,
                html: htmlBody,
            });

            logger.info(
                {
                    messageId: info.messageId,
                    recipient: recipientEmail,
                    category: category.name,
                },
                'Email sent successfully'
            );
        } else {
            // Mock mode - just log
            logger.info(
                {
                    recipient: recipientEmail,
                    subject,
                    category: category.name,
                },
                '[MOCK] Email would be sent (no SMTP credentials configured)'
            );
        }
    } catch (error) {
        logger.error({ error, event }, 'Failed to send email notification');
        throw error;
    }
}

async function startEmailService() {
    logger.info(
        {
            smtpConfigured: !!transporter,
            smtpHost: SMTP_HOST,
        },
        'Email service starting...'
    );

    await kafka.subscribe(
        'email-service-group',
        [KafkaTopics.NOTIFICATIONS_EMAIL],
        async ({ message }) => {
            const event: KafkaEvent = JSON.parse(message.value!.toString());
            await handleEmailNotification(event);
        }
    );

    logger.info('Email service ready');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await kafka.disconnect();
    process.exit(0);
});

startEmailService().catch((error) => {
    logger.error({ error }, 'Fatal error in Email service');
    process.exit(1);
});
