const nodemailer = require('nodemailer');

const sendEmail = async (mailOptions) => {
  const { SMTP_SERVICE, SMTP_USER, SMTP_PASS } = process.env;

  let transporter = nodemailer.createTransport({
    service: SMTP_SERVICE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
