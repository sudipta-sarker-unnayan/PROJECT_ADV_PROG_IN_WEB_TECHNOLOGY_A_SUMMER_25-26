import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"SBMS Support" <${this.config.get<string>('MAIL_USER')}>`,
        to,
        subject: 'Password Reset - SBMS',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
            <h2>Password Reset</h2>
            <p>You have requested to reset the password for your SBMS account.</p>
            <p>Click the button below to set a new password (this link will expire in 30 minutes):</p>
            <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;">
              Reset Password
            </a>
            <p style="color:#666;font-size:12px;margin-top:20px;">
              If you did not request this, please ignore this email.
            </p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send reset email', err);
      throw err;
    }
  }
}