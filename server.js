const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

// JWT Auth Middleware
const verifyAdmin = require('./middleware/auth'); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

// Static Files (HTML, CSS, JS, Images ለማስተናገድ)
app.use(express.static(__dirname));

// Rate Limiter Configuration (የስፓም መከላከያ)
const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 ደቂቃ
  max: 5,
  message: { success: false, message: 'ብዙ ጥያቄ ልከዋል። እባክዎ ከ15 ደቂቃ በኋላ ደግመው ይሞክሩ።' }
});

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

// Nodemailer Transport Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ================= API ROUTES =================

// 1. PUBLIC POST: Save Direct Message from Contact Form (ማንኛውም ሰው መላክ ይችላል)
app.post(
  '/api/contact',
  messageLimiter,
  [
    body('name').trim().notEmpty().withMessage('እባክዎ ስምዎን ያስገቡ!'),
    body('email').isEmail().withMessage('እባክዎ ትክክለኛ ኢሜይል ያስገቡ!'),
    body('message').trim().isLength({ min: 5 }).withMessage('መልእክቱ ቢያንስ 5 ፊደላት መሆን አለበት!')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const { name, email, message } = req.body;

      const newContact = new Contact({ name, email, message });
      await newContact.save();

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const mailOptions = {
            from: `Portfolio Contact <${process.env.EMAIL_USER}>`,
            replyTo: email,
            to: process.env.EMAIL_USER,
            subject: `የፖርትፎሊዮ መልእክት ከ ${name}`,
            text: `ስም: ${name}\nኢሜይል: ${email}\n\nመልእክት:\n${message}`
          };
          await transporter.sendMail(mailOptions);
        } catch (emailErr) {
          console.error('የኢሜይል መላክ ስህተት (መልእክቱ ዳታቤዝ ውስጥ ተቀምጧል):', emailErr);
        }
      }

      res.status(200).json({ success: true, message: 'መልእክቱ በተሳካ ሁኔታ ተቀምጧል!' });
    } catch (error) {
      console.error('Server error processing message:', error);
      res.status(500).json({ success: false, message: 'የ ሰርቨር ስህተት ተፈጥሯል' });
    }
  }
);

// 2. GET: ሁሉንም መልእክቶች ማምጫ (ለቀላል ፍተሻ verifyAdmin ተነስቷል)
app.get('/api/admin/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'መልእክቶችን ማምጣት አልተቻለም።' });
  }
});

// 3. ADMIN DELETE: መልእክት ማጥፊያ
app.delete('/api/admin/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ success: true, message: 'መልእክቱ ተሰርዟል።' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'መልእክቱን ማጥፋት አልተቻለም።' });
  }
});

// 4. PUBLIC GET: Fetch Projects
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
// በ server.js ውስጥ ከ app.get('*', ...) በፊት ይጨምሩት፦
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});
// Front-end Main Route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Server Initialization
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});