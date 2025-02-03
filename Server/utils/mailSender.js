const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (email, title, body) => {
  try {
    // create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // mail options
    const mailOptions = {
      from: process.env.EMAIL,
      to: `${email}`,
      subject: `${title}`,
      text: `${body}`,
    };

    //* this part is done in otp model
    // await transporter.sendMail(mailOptions);
    // console.log('Email sent successfully');
  } catch (error) {
    console.log('Error sending email from MailSender Util😒', error);
  }
};

module.exports = {
  sendMail,
};
