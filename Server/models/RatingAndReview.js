const mongoose = require('mongoose');

const RatingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    review: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500  //todo: Limit review length to 500 characters
    }
})

module.exports = mongoose.model('RatingAndReview', RatingAndReviewSchema);