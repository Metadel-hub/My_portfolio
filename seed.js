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
    githubUrl: "https://github.com/Metadel-hub",
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
    key: "web",
    title: "Habesha Crafts (የሀበሻ ዕደ-ጥበብ)",
    githubUrl: "https://github.com/Metadel-hub",
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
    key: "circuit",
    title: "Ethio-Industrial-Hub",
    githubUrl: "https://github.com/Metadel-hub",
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

// Sample Message
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
    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });