const jwt = require('jsonwebtoken');
require('dotenv').config();

// auth
exports.auth = async (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Decoded payload', payload);

    if (!payload.email || !payload.password) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      sucess: false,
      message: 'Failed to authenticate token',
    });
  }
};

// is student
exports.isStudent = async(req, res, next) => {
    if(req.user.accountType === 'student') {
        next();
    } else {
        return res.status(403).json({ message: 'You are not a student' });
    }
}

// is instructor

exports.isInstructor = async(req, res, next) => {
    if(req.user.accountType === 'instructor') {
        next();
    } else {
        return res.status(403).json({ message: 'You are not an instructor' });
    }
}

// is admin
