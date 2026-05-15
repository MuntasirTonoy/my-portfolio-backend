const mongoose = require('mongoose');

const aboutSchema = mongoose.Schema({
  name: String,
  designation: String,
  location: String,
  experience: String,
  availability: String,
  profileImage: String,
  socialLinks: {
    github: String,
    linkedin: String,
    email: String,
    whatsapp: String,
    resume: String,
  },
  professionalJourney: [{
    heading: String,
    content: String,
  }],
  education: [{
    level: String,
    institution: String,
    year: String,
    result: String,
  }],
  journey: [{
    year: String,
    title: String,
    description: String,
    iconColor: String,
  }],
  certificates: [{
    title: String,
    institution: String,
    image: String,
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('About', aboutSchema);
