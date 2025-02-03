const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,         //todo: Trims whitespace from the beginning and end of the string
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
        enum: ['admin', 'student', "instructor"],
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    courseProgress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseProgress',
        required: true,
    }
})

module.exports = mongoose.model('User', UserSchema);