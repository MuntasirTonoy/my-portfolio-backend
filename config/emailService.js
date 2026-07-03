const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, text, html }) => {
  let transporter;

  // Check if SMTP environment variables are defined
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Dynamic fallback to Ethereal SMTP for testing/development
    console.log('No SMTP credentials found in environment. Creating Ethereal Test Account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      console.error('Failed to create Ethereal SMTP account:', err);
      throw new Error('Email service configuration missing and test account creation failed.');
    }
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Portfolio Admin" <${process.env.SMTP_USER || 'no-reply@portfolio.com'}>`,
    to: email,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  // If using Ethereal, log the preview URL
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('--------------------------------------------------');
    console.log(`✉️ Email Sent Successfully (Ethereal Dev Mode)`);
    console.log(`🔗 Preview URL: ${previewUrl}`);
    console.log('--------------------------------------------------');
    return previewUrl;
  }

  console.log(`✉️ Email Sent Successfully to ${email}`);
  return true;
};

module.exports = sendEmail;
