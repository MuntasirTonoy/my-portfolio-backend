const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema({
  hero: {
    greeting: String,
    name: String,
    badge: String,
    description: String,
    cvLink: String,
    whatsappLink: String,
    ctaBtn1Text: String,
    ctaBtn2Text: String,
    roleTags: [String],
  },
  introduction: {
    heading: String,
    description: String,
  },
  services: {
    sectionTitle: String,
    heading: String,
    description: String,
    items: [{
      title: String,
      description: String,
    }]
  },
  contact: {
    heading: String,
    subheading: String,
    description: String,
    email: String,
    phone: String,
    location: String,
    socialLinks: {
      github: String,
      linkedin: String,
    },
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
