const Portfolio = require('../models/Portfolio');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const About = require('../models/About');

// @desc    Get all portfolio data (combined from all collections)
// @route   GET /api/portfolio
// @access  Public
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    const projects = await Project.find();
    const skills = await Skill.find();
    const about = await About.findOne();

    res.json({
      ...(portfolio ? portfolio.toObject() : {}),
      projects,
      skills,
      about: about ? about.toObject() : {}
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update specific portfolio section
// @route   PUT /api/portfolio/:section
// @access  Private (Admin)
const updatePortfolio = async (req, res) => {
  const { section } = req.params;
  
  try {
    if (section === 'about') {
      let about = await About.findOne();
      if (about) {
        Object.assign(about, req.body);
        await about.save();
      } else {
        about = await About.create(req.body);
      }
      return res.json(about);
    }

    if (section === 'projects') {
      // For projects, we assume the body is the full list of projects or we handle CRUD separately
      // Here we handle a full sync for simplicity with your dashboard logic
      await Project.deleteMany({});
      const projects = await Project.insertMany(req.body);
      return res.json(projects);
    }

    if (section === 'skills') {
      await Skill.deleteMany({});
      const skills = await Skill.insertMany(req.body);
      return res.json(skills);
    }

    // Default: Hero, Services, Contact (stored in Portfolio collection)
    let portfolio = await Portfolio.findOne();
    if (portfolio) {
      portfolio[section] = req.body;
      await portfolio.save();
    } else {
      portfolio = await Portfolio.create({ [section]: req.body });
    }
    res.json(portfolio);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getPortfolio, updatePortfolio };
