const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

// JWT Auth Middleware (Optional if using simple route check)
// const verifyAdmin = require('./middleware/auth'); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

// Static Files
app.use(express.static(__dirname));

// Rate Limiter Configuration
const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: 'ብዙ ጥያቄ ልከዋል። እባክዎ ከ15 ደቂቃ በኋላ ደግመው ይሞክሩ።' }
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_db';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connection established successfully.');
    seedProjectDetails(); // Seed default project content
  })
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

// Initial Project Content with Full Key Features
const initialProjects = [
  {
    key: 'embedded',
    title: 'Color Sorting Robotic Arm',
    githubUrl: 'https://github.com/Metadel-hub',
    description: `
      <div style="max-height: 350px; overflow-y: auto; padding-right: 0.5rem;">
        <p>An automated robotic arm that uses computer vision and optical sensors to identify, categorize, and sort physical items based on color analysis in real time.</p>
        <br>
        <h4>Key Features:</h4>
        <ul style="padding-left: 1.2rem; margin-top: 0.5rem; line-height: 1.6;">
          <li><strong>Computer Vision Integration:</strong> High-precision color identification using RGB camera feeds and color sensor arrays.</li>
          <li><strong>Real-Time Processing:</strong> Instant object classification via microcontrollers and edge AI execution.</li>
          <li><strong>Multi-Axis Articulation:</strong> Smooth multi-DOF movement mechanisms for flexible positional control.</li>
          <li><strong>Precision Gripping:</strong> Specialized vacuum suction cups and mechanical grippers tailored to grab diverse item shapes.</li>
          <li><strong>Automated Sorting Logic:</strong> Target-zone mapping for systematic sorting into pre-allocated bins.</li>
          <li><strong>High-Speed Pick & Place:</strong> Rapid execution cycles engineered to maximize throughput efficiency.</li>
          <li><strong>Conveyor Syncing:</strong> Dynamic timing algorithms to pick moving items directly off automated belts.</li>
          <li><strong>Adaptive Lighting:</strong> Onboard lighting control to maintain color identification consistency regardless of ambient light.</li>
        </ul>
      </div>
    `
  },
  {
    key: 'web',
    title: 'Habesha Crafts (የሀበሻ ዕደ-ጥበብ)',
    githubUrl: 'https://github.com/Metadel-hub',
    description: `
      <div style="max-height: 350px; overflow-y: auto; padding-right: 0.5rem;">
        <p><strong>Habesha Crafts (የሀበሻ ዕደ-ጥበብ)</strong> is a specialized e-commerce web platform designed in native Amharic. It connects local Ethiopian artisans directly with online buyers interested in handmade goods.</p>
        <br>
        <h4>Key Features:</h4>
        <ul style="padding-left: 1.2rem; margin-top: 0.5rem; line-height: 1.6;">
          <li><strong>Native Localization:</strong> Full Amharic typography and contextual semantics optimized for native accessibility.</li>
          <li><strong>Interactive Search & Navigation:</strong> Dynamic header query filters with a real-time shopping cart badge counter.</li>
          <li><strong>Artisan Portal:</strong> Seller forms allowing local craftspeople to list items, upload photos, set pricing in ETB, and manage categories.</li>
          <li><strong>Categorized Showcase:</strong> Organized support for Traditional Clothing (የባህል ልብሶች), Pottery (የሸክላ ሥራዎች), Art (ስዕሎች), and Jewelry (ጌጣጌጦች).</li>
          <li><strong>Responsive Card Layout:</strong> Custom responsive CSS grid featuring item previews, artisan credits, and immediate action buttons.</li>
          <li><strong>Dynamic UI Scripting:</strong> Lightweight JavaScript handling cart state management, modal popups, and live DOM updates.</li>
        </ul>
      </div>
    `
  },
  {
    key: 'circuit',
    title: 'Ethio-Industrial-Hub',
    githubUrl: 'https://github.com/Metadel-hub',
    description: `
      <div style="max-height: 350px; overflow-y: auto; padding-right: 0.5rem;">
        <p><strong>Ethio-Industrial-Hub</strong> is a web application linking Ethiopian industrial suppliers and technical experts to streamline hardware sourcing and machinery repair services.</p>
        <br>
        <h4>Key Features:</h4>
        <ul style="padding-left: 1.2rem; margin-top: 0.5rem; line-height: 1.6;">
          <li><strong>Supplier Registration:</strong> Vendor listing system for industrial equipment, spare parts, and pricing schedules.</li>
          <li><strong>Technician Profiles:</strong> Registry for certified repair engineers to list qualifications, service rates, and availability.</li>
          <li><strong>Hardware Filtering:</strong> Organized directories for transformers, electric motors, circuit breakers, power cables, and generators.</li>
          <li><strong>Location-Based Search:</strong> Real-time local search filters connecting users with nearby suppliers and technicians.</li>
          <li><strong>Mobile Payment Verification:</strong> Direct integration triggers supporting Telebirr and CBE Birr transaction verification.</li>
          <li><strong>Direct Contact Channels:</strong> One-click direct calling links and integrated Telegram messaging routes.</li>
        </ul>
      </div>
    `
  }
];

// Helper Function: Upsert default projects into DB
async function seedProjectDetails() {
  try {
    for (const p of initialProjects) {
      await Project.findOneAndUpdate(
        { key: p.key },
        { title: p.title, description: p.description, githubUrl: p.githubUrl },
        { upsert: true, new: true }
      );
    }
    console.log('Project details successfully seeded/updated in database.');
  } catch (err) {
    console.error('Error seeding project details:', err);
  }
}

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

// 1. PUBLIC POST: Save Direct Message from Contact Form
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

// 2. GET: All messages
app.get('/api/admin/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'መልእክቶችን ማምጣት አልተቻለም።' });
  }
});

// 3. ADMIN DELETE: Delete message
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

// ================= ADMIN AUTH ROUTES =================
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Metadel';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Metadel@27';

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'ግባ ተሳክቷል!' });
  } else {
    res.status(401).json({ success: false, message: 'የተሳሳተ መለያ ወይም የይለፍ ቃል!' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  res.json({ success: true, message: 'ውጣ ተሳክቷል!' });
});
// ======================================================

// Admin Route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Front-end Main Route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Server Initialization
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});