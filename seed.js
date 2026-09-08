const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_db';

const ProjectSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  githubUrl: { type: String, default: 'https://github.com/Metadel-hub' }
});

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', ProjectSchema);
const Contact = mongoose.model('Contact', ContactSchema);

const projects = [
  {
    key: "embedded",
    title: "Color Sorting Robotic Arm",
    description: "An automated robotic arm that uses computer vision..."
  },
  {
    key: "web",
    title: "Habesha Crafts (የሀበሻ ዕደ-ጥበብ)",
    description: "Habesha Crafts is a specialized e-commerce landing page..."
  },
  {
    key: "circuit",
    title: "Ethio-Industrial-Hub",
    description: "Ethio-Industrial-Hub is a web application linking Ethiopian suppliers..."
  }
];

// ለቴስት የሚሆን ናሙና መልእክት
const sampleMessages = [
  {
    name: "አበበ ከበደ",
    email: "abebe@gmail.com",
    message: "ሰላም፣ ፖርትፎሊዮህን ወድጄዋለሁ! አብረን መስራት እንችላለን?"
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    await Project.deleteMany({});
    await Project.insertMany(projects);
    
    await Contact.deleteMany({});
    await Contact.insertMany(sampleMessages);

    console.log('ፕሮጀክቶች እና ናሙና መልእክቶች በተሳካ ሁኔታ ወደ ዳታቤዝ ገብተዋል።');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });