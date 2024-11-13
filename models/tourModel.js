const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

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
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: 1 },
    toObject: { virtuals: 1 },
  },
);

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = new Date(Date.now());
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(docs);
  this.end = new Date(Date.now());
  console.log(`Query execution time ${this.end - this.start} milliseconds`);
  next();
});

tourSchema.virtual('durationWeeks').get(function () {
  return (this.duration / 7).toFixed(2);
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
