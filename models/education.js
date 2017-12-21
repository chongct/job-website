const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const educationSchema = new Schema({
  school : {
    type : String
  },
  start : {
    type : Number
  },
  end : {
    type : Number
  },
  username : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  }
});

const Education = mongoose.model('Education', educationSchema);
module.exports = Education;
