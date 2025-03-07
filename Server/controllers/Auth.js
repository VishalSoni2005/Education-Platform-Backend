const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const otpModel = require('../models/OTP');
const otpGenerator = require('otp-generator');
const profileModel = require('../models/Profile');

// opt send
exports.optSend = async (req, res) => {
  try {
    //* step 1: extract email from request
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }

    //* step 2: check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'You already have a user with that email',
        success: false,
      });
    }

    //* step 3: generate and save OTP in database
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    console.log();

    console.log('OTP Generated ===>>> ', otp);

    //* step 4: check and delete otp from database
    await otpModel.findOneAndDelete({ email });

    //* step 5: save the new OTP in the database
    await new otpModel({ email, otp }).save();

    //* step 6: send OTP to the user
    res.status(200).json({
      message: 'OTP sent successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

// signup
exports.signup = async (req, res) => {
  try {
    const { email, firstName, lastName, password, confirmPassword, contactNumbber, accountType, otp } = await req.body;

    if (!email || !firstName || !lastName || !password || !accountType || !contactNumbber) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match',
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
        success: false,
      });
    }

    //todo: checing recent Otp
    const recentOtp = await otpModel.findOne({ email });
    // const recentOtp = await userModel.findOne({ email });

    if (recentOtp && recentOtp.otp === otp) {
      // creating new profile to save in database additional information

      const newProfile = await profileModel.create({
        gender: null,
        contact: null,
        about: null,
        dateOfBirth: null,
      });

      // hash paswords
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        accountType,
        contactNumbber,
        additionalDetails: newProfile._id,
        image: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      });

      await user.save();
      res.status(201).json({
        message: 'User created successfully',
        success: true,
      });
    } else {
      return res.status(400).json({
        message: 'Invalid OTP',
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = await req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }

    const user = await User.findOne({ email }); // fetches identity of whole user

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
        success: false,
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // 1 hour token expiration time

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }).json({
      message: 'Logged in successfully',
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Something went wrong *_* Unable to login',
      success: false,
    });
  }
};

// forgot password

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token').json({
      message: 'Logged out successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Something went wrong while logging out',
      success: false,
    });
  }
};
