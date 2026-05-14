const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  image: String,
  title: String,
  description: String,
  tech: {
    frontend: [String],
    backend: [String],
    other: [String]
  },
  tags: [String],
  status: String,
  featured: Boolean,
  started: String,
  end: String,
  keyFeature: [String],
  challenges: String,
  improvements: String,
  links: {
    liveDemo: String,
    clientSide: String,
    serverSide: String
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
