const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workexpSchema = new Schema({
  company : {
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

const Workexp = mongoose.model('Workexp', workexpSchema);
module.exports = Workexp;
