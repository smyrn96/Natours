const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
    priceDiscount: {
      type: Number,
    },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: { type: Date, default: Date.now() },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: 1 },
    toObject: { virtuals: 1 },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return (this.duration / 7).toFixed(2);
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
