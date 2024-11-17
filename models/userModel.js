const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    maxLength: [40, 'The name length has to be less than 40 characters long'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please type a valid email address'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minLength: [8, 'The password must have at least 8 characters'],
    maxLength: [20, 'The name length has to be less than 20 characters long'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    minLength: [8, 'The password must have at least 8 characters'],
    maxLength: [20, 'The name length has to be less than 20 characters long'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password and password confirmation must be the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async (currentPassword, userPassword) => {
  return await bcrypt.compare(currentPassword, userPassword);
};

userSchema.methods.comparePasswordChangedDates = async (tokenTimestamp) => {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    tokenTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
