// mongoose is the package we use to interface with mongodb
const mongoose = require('mongoose');
// we can use bluebird, but we are using built in ES6 promise (aync/await)
mongoose.Promise = global.Promise;
// library named slugs, used for making url friendly slugs
const slug = require('slugs');
// time to make our schema
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String]
});

// autogenerate slug
storeSchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    next(); // skip
    return; // stops the function from running
  }
  // TODO make more resiliant so slugs are unique
  this.slug = slug(this.name);
  next();
});

//  export the schema
module.exports = mongoose.model('Store', storeSchema);
