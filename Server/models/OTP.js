const mongoose = require('mongoose');
const mailSenderUtil = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 300,
  },
});

//todo: we will use pre middlware for otp generation coz it first gen otp and signup use then create a new entry in the database

//* user --> data enter --> otp gen --> opt enter --> submit --> then a db entry is created

async function sendVerificationEmail(email, otp) {
  try {
    const response = await mailSenderUtil.sendMail(email, 'verification email sent by Vishal', otp);
    console.log(response);
  } catch (e) {
    console.log(e);
    throw new Error('Failed to send verification email');
  }
}

otpSchema.pre('save', async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});
module.exports = mongoose.model('OPT', otpSchema);
