import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

/**
 * @service EmailSenderService
 * @description Service d'envoi d'emails.
 *
 * Ce service gère l'envoi de divers types d'emails (reset password, vérification, changement d'email, suppression d'email secondaire, MFA)
 * en utilisant nodemailer. Il est configuré pour fonctionner avec Mailjet ou MailHog en fonction de la configuration.
 *
 * Des paramètres supplémentaires (username) ont été ajoutés afin d'améliorer les messages des emails en affichant une salutation
 * et en indiquant clairement le token ou le code en cas de problème avec le lien.
 */
@Injectable()
export class EmailSenderService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailSenderService.name);

  constructor(private readonly configService: ConfigService) {
    let mailService = this.configService.get<string>('MAIL_SERVICE');

    if (mailService === 'mailjet') {
      // Configuration for Mailjet
      this.transporter = nodemailer.createTransport({
        host: 'in-v3.mailjet.com',
        port: 587,
        auth: {
          user: this.configService.get<string>('MAILJET_API_KEY'),
          pass: this.configService.get<string>('MAILJET_API_SECRET'),
        },
      });
    } else if (mailService === 'mailhog') {
      // Configuration for MailHog
      const mailhogOptions: nodemailer.TransportOptions = {
        host: this.configService.get<string>('MAIL_HOST'),
        port: this.configService.get<number>('MAIL_PORT'),
        secure: false, // MailHog ne supporte pas TLS
      };

      // Include authentication if provided
      const mailUser = this.configService.get<string>('MAIL_USER');
      const mailPass = this.configService.get<string>('MAIL_PASS');
      if (mailUser && mailPass) {
        mailhogOptions.auth = {
          user: mailUser,
          pass: mailPass,
        };
      }

      this.transporter = nodemailer.createTransport(mailhogOptions);
    } else {
      throw new Error(`Unsupported MAIL_SERVICE: ${mailService}`);
    }
  }

  /**
   * Envoie un email de réinitialisation de mot de passe.
   *
   * @param username Le nom d'utilisateur.
   * @param email L'adresse email de destination.
   * @param token Le token de réinitialisation.
   */
  async sendPasswordResetEmail(username: string, email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const mailFromName = this.configService.get<string>('MAIL_FROM_NAME');
    const mailFrom = this.configService.get<string>('MAIL_FROM');
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${mailFromName}" <${mailFrom}>`,
      to: email,
      subject: 'Password Reset Request',
      text: `Hello ${username},

You requested a password reset. Click the link below to reset your password:
${resetLink}

If the link does not work, please use the following token:
${token}

Best regards,
The Team`,
      html: `<p>Hello ${username},</p>
<p>You requested a password reset. Click the link below to reset your password:</p>
<p><a href="${resetLink}">Reset Password</a></p>
<p>If the link does not work, please copy and paste the following token into the application:</p>
<p><strong>${token}</strong></p>
<p>Best regards,<br/>The Team</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${email}: ${info.messageId}`);
    } catch (error) {
      this.logger.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email.');
    }
  }

  /**
   * Envoie un email de vérification d'email.
   *
   * @param username Le nom d'utilisateur.
   * @param email L'adresse email à vérifier.
   * @param token Le token de vérification.
   * @param emailType 'PRIMARY' pour l'email principal, 'SECONDARY' pour l'email secondaire.
   */
  async sendEmailVerification(username: string, email: string, token: string, emailType: 'PRIMARY' | 'SECONDARY'): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const mailFromName = this.configService.get<string>('MAIL_FROM_NAME');
    const mailFrom = this.configService.get<string>('MAIL_FROM');

    // Ici, le lien est identique pour les deux types, mais peut être adapté si besoin.
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;
    const subject = emailType === 'PRIMARY' ? 'Verify Your Email Address' : 'Verify Your Secondary Email Address';

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${mailFromName}" <${mailFrom}>`,
      to: email,
      subject: subject,
      text: `Hello ${username},

Please verify your ${emailType === 'PRIMARY' ? 'primary' : 'secondary'} email address by clicking the link below:
${verificationLink}

If the link does not work, please use the following token:
${token}

Best regards,
The Team`,
      html: `<p>Hello ${username},</p>
<p>Please verify your ${emailType === 'PRIMARY' ? 'primary' : 'secondary'} email address by clicking the link below:</p>
<p><a href="${verificationLink}">Verify Email</a></p>
<p>If the link does not work, please copy and paste the following token:</p>
<p><strong>${token}</strong></p>
<p>Best regards,<br/>The Team</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email verification sent to ${email} (${emailType}): ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Error sending ${emailType} email verification to ${email}:`, error);
      throw new Error(`Failed to send ${emailType} email verification.`);
    }
  }

  /**
   * Envoie un email de confirmation de changement d'email.
   *
   * @param username Le nom d'utilisateur.
   * @param newEmail La nouvelle adresse email.
   * @param token Le token de confirmation.
   * @param emailType 'PRIMARY' pour l'email principal, 'SECONDARY' pour l'email secondaire.
   */
  async sendEmailChangeConfirmation(username: string, newEmail: string, token: string, emailType: 'PRIMARY' | 'SECONDARY'): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const mailFromName = this.configService.get<string>('MAIL_FROM_NAME');
    const mailFrom = this.configService.get<string>('MAIL_FROM');

    const confirmLink = emailType === 'PRIMARY'
      ? `${frontendUrl}/confirm-email-change?token=${token}`
      : `${frontendUrl}/confirm-secondary-email-change?token=${token}`;
    const subject = emailType === 'PRIMARY'
      ? 'Confirm Your Primary Email Change'
      : 'Confirm Your Secondary Email Change';

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${mailFromName}" <${mailFrom}>`,
      to: newEmail,
      subject: subject,
      text: `Hello ${username},

You requested to change your ${emailType === 'PRIMARY' ? 'primary' : 'secondary'} email.
Please confirm this change by clicking the link below:
${confirmLink}

If the link does not work, please use the following token:
${token}

Best regards,
The Team`,
      html: `<p>Hello ${username},</p>
<p>You requested to change your ${emailType === 'PRIMARY' ? 'primary' : 'secondary'} email.</p>
<p>Please confirm this change by clicking the link below:</p>
<p><a href="${confirmLink}">Confirm Email Change</a></p>
<p>If the link does not work, please copy and paste the following token:</p>
<p><strong>${token}</strong></p>
<p>Best regards,<br/>The Team</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email change confirmation sent to ${newEmail} (${emailType}): ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Error sending ${emailType} email change confirmation to ${newEmail}:`, error);
      throw new Error(`Failed to send ${emailType} email change confirmation.`);
    }
  }

  /**
   * Envoie un email de confirmation de suppression de l'email secondaire.
   *
   * @param username Le nom d'utilisateur.
   * @param email L'adresse email secondaire.
   * @param token Le token de confirmation.
   */
  async sendSecondaryEmailDeletionConfirmation(username: string, email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const mailFromName = this.configService.get<string>('MAIL_FROM_NAME');
    const mailFrom = this.configService.get<string>('MAIL_FROM');

    const confirmLink = `${frontendUrl}/confirm-secondary-email-deletion?token=${token}`;
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${mailFromName}" <${mailFrom}>`,
      to: email,
      subject: 'Confirm Secondary Email Deletion',
      text: `Hello ${username},

You requested to delete your secondary email.
Please confirm this deletion by clicking the link below:
${confirmLink}

If the link does not work, please use the following token:
${token}

Best regards,
The Team`,
      html: `<p>Hello ${username},</p>
<p>You requested to delete your secondary email.</p>
<p>Please confirm this deletion by clicking the link below:</p>
<p><a href="${confirmLink}">Confirm Email Deletion</a></p>
<p>If the link does not work, please copy and paste the following token:</p>
<p><strong>${token}</strong></p>
<p>Best regards,<br/>The Team</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Secondary email deletion confirmation sent to ${email}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Error sending secondary email deletion confirmation to ${email}:`, error);
      throw new Error('Failed to send secondary email deletion confirmation.');
    }
  }

  /**
   * Envoie un email de vérification pour la Multi-Factor Authentication (MFA).
   *
   * @param username Le nom d'utilisateur.
   * @param email L'adresse email.
   * @param code Le code MFA à utiliser.
   */
  async sendEmailMFA(username: string, email: string, code: string): Promise<void> {
    const mailFromName = this.configService.get<string>('MAIL_FROM_NAME');
    const mailFrom = this.configService.get<string>('MAIL_FROM');

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${mailFromName}" <${mailFrom}>`,
      to: email,
      subject: 'Multi-Factor Authentication (MFA) Verification',
      text: `Hello ${username},

To complete the Multi-Factor Authentication, please enter the following code:
${code}

If you did not request MFA, please ignore this email.

Best regards,
The Team`,
      html: `<p>Hello ${username},</p>
<p>To complete the Multi-Factor Authentication, please enter the following code:</p>
<p><strong>${code}</strong></p>
<p>If you did not request MFA, please ignore this email.</p>
<p>Best regards,<br/>The Team</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`MFA email sent to ${email}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Error sending MFA email to ${email}:`, error);
      throw new Error('Failed to send MFA email.');
    }
  }
}
