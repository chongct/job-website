const User = require('../models/user');
const Education = require('../models/education');
const Workexp = require('../models/workexp');

// Index home page
// exports.index = (req, res)=>{
//   res.render('home');
// };

// Index home page
exports.home = (req, res)=>{
  Education.findOne({ username : req.params.id})
  .populate('username')
  .exec((err, education)=>{
    if (err) console.log(err);
    res.render('home', { 'education' : education});
    // console.log(education);
  });
};

// Education and work experience
exports.exp = (req, res)=>{
  res.render('experience');
};

exports.updateExp = (req, res)=>{
  req.checkBody('school', 'School cannot be empty').notEmpty();
  req.checkBody('edustart', 'Start year for education cannot be empty').notEmpty();
  req.checkBody('eduend', 'End year for education cannot be empty').notEmpty();
  req.checkBody('company', 'Company cannot be empty').notEmpty();
  req.checkBody('workstart', 'Start year for work cannot be empty').notEmpty();
  req.checkBody('school', 'End year for work cannot be empty').notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    res.render('experience', {'errors' : errors});
  } else {
    Education.create({
      school : req.body.school,
      start : req.body.edustart,
      end : req.body.eduend,
      username : req.user._id
    }, (err, createdEdu)=>{
      if (err) {
        req.flash('error', 'Could not add education information');
        res.redirect('experience');
      } else {
        res.redirect('home');
      }
    });
  }
};
