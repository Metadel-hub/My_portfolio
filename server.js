const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connection established successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Database Schemas & Models
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  githubUrl: { type: String, default: 'https://github.com/Metadel-hub' }
});

const Contact = mongoose.model('Contact', ContactSchema);
const Project = mongoose.model('Project', ProjectSchema);

// Nodemailer Transport Configuration (Updated for Port 587 TLS)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// API Routes

// 1. POST: Save Direct Message & Send Email (ከ Frontend የሚላኩ መልእክቶችን መቀበያ)
app.post('/api/admin/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'እባክዎ ሁሉንም መስኮች ይሙሉ!' });
    }

    // Database ውስጥ ማስቀመጥ
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // ኢሜይል መላክ (.env ውስጥ EMAIL_USER እና EMAIL_PASS ካለ)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `የፖርትፎሊዮ መልእክት ከ ${name}`,
        text: `ስም: ${name}\nኢሜይል: ${email}\n\nመልእክት:\n${message}`
      };
      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ success: true, message: 'መልእክቱ በተሳካ ሁኔታ ተቀምጧል!' });
  } catch (error) {
    console.error('Server error processing message:', error);
    res.status(500).json({ success: false, message: 'የ ሰርቨር ስህተት ተፈጥሯል' });
  }
});

// 2. GET: ሁሉንም የመጡ መልእክቶች ማምጫ API
app.get('/api/admin/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'መልእክቶችን ማምጣት አልተቻለም።' });
  }
});

// 3. DELETE: የተመረጠ መልእክት ማጥፊያ API
app.delete('/api/admin/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ success: true, message: 'መልእክቱ ተሰርዟል።' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'መልእክቱን ማጥፋት አልተቻለም።' });
  }
});

// 4. GET: Fetch Projects
app.get('/api/projects/:key?', async (req, res) => {
  try {
    const { key } = req.params;
    if (key) {
      const project = await Project.findOne({ key });
      if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
      return res.json({ success: true, data: project });
    }
    const projects = await Project.find();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching projects.' });
  }
});

// Server Initialization
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});