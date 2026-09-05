const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_db';

const ProjectSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  githubUrl: { type: String, default: 'https://github.com/Metadel-hub' }
});

const Project = mongoose.model('Project', ProjectSchema);

const projects = [
  {
    key: "embedded",
    title: "Color Sorting Robotic Arm",
    description: `
      <div style="max-height: 350px; overflow-y: auto; padding-right: 0.5rem;">
        <p>An automated robotic arm that uses computer vision or optical sensors to identify, categorize, and sort items by color.</p>
        <br>
        <h4>Key Features:</h4>
        <ul style="padding-left: 1.2rem; margin-top: 0.5rem; line-height: 1.6;">
          <li><strong>Computer Vision Integration:</strong> Uses RGB cameras or color sensors to detect and analyze object hues accurately.</li>
          <li><strong>Real-Time Processing:</strong> Identifies and classifies colors instantly using microcontrollers or edge AI devices.</li>
          <li><strong>Multi-Axis Articulation:</strong> Features multiple joints (e.g., 3-DOF to 6-DOF) for fluid, versatile movement across axes.</li>
          <li><strong>Precision End-Effectors:</strong> Utilizes vacuum suction cups or mechanical grippers tailored to grab specific item shapes.</li>
          <li><strong>Automated Sorting Logic:</strong> Programmed with specific target zones or bins for fast, systematic placement.</li>
          <li><strong>High-Speed Pick-and-Place:</strong> Executes rapid pick, transfer, and release cycles to boost operational throughput.</li>
          <li><strong>Adaptable Lighting Systems:</strong> Includes integrated LEDs to ensure consistent color recognition regardless of ambient light.</li>
          <li><strong>Programmable Control:</strong> Customizable via platforms like ROS, Python, Arduino, or industrial PLC software.</li>
          <li><strong>Quality Control & Inspection:</strong> Rejects defective or incorrectly colored items automatically during high-volume assembly.</li>
          <li><strong>Conveyor Integration:</strong> Often syncs with moving conveyor belts to identify and sort items on the fly.</li>
        </ul>
      </div>
    `
  },
  {
    key: "web",
    title: "Habesha Crafts (የሀበሻ ዕደ-ጥበብ)",
    description: `
      <div style="max-height: 350px; overflow-y: auto; padding-right: 0.5rem;">
        <p><strong>Habesha Crafts (የሀበሻ ዕደ-ጥበብ)</strong> is a specialized e-commerce landing page template written in Amharic. It serves as a digital platform bridging local Ethiopian artisans with buyers interested in traditional handmade goods.</p>
        <br>
        <h4>Detailed Overview & Architecture:</h4>
        <ul style="padding-left: 1.2rem; margin-top: 0.5rem; line-height: 1.6;">
          <li><strong>Localization:</strong> Full UI design built using native Amharic typography and semantics for native user accessibility.</li>
          <li><strong>Interactive Navigation:</strong> Header featuring search query filtering, category links, and a dynamic real-time shopping cart badge counter.</li>
          <li><strong>Seller Product Portal:</strong> Front-end form interface allowing local craftspeople to input product titles, upload image references, set pricing in ETB (Ethiopian Birr), and categorize items.</li>
          <li><strong>Product Categories:</strong> Dedicated support for Traditional Clothing (የባህል ልብሶች), Pottery (የሸክላ ሥራዎች), Art & Paintings (ስዕሎች), and Jewelry (ጌጣጌጦች).</li>
          <li><strong>Responsive Grid Layout:</strong> Styled via <code>style.css</code> to ensure flexible, mobile-first responsive cards featuring item previews, artisan credits, and "Add to Cart" triggers.</li>
          <li><strong>Dynamic Scripting:</strong> Powered by <code>script.js</code> to handle user interactions, state management for cart counts, and live UI updates.</li>
        </ul>
      </div>
    `
  },
  {
    key: "circuit",
    title: "Ethio-Industrial-Hub",
    description: `
      <div style="max-height: 350px; overflow-y: auto; padding-right: 0.5rem;">
        <p><strong>Ethio-Industrial-Hub</strong> is a web application linking Ethiopian suppliers and technicians to streamline industrial hardware sourcing and repair service management.</p>
        <br>
        <h4>Key Features:</h4>
        <ul style="padding-left: 1.2rem; margin-top: 0.5rem; line-height: 1.6;">
          <li><strong>Supplier Registration:</strong> Allows industrial vendors to list electrical equipment, components, and pricing.</li>
          <li><strong>Technician Profiles:</strong> Enables repair experts to register qualifications, experience, and service rates.</li>
          <li><strong>Category Filtering:</strong> Organized navigation for transformers, motors, breakers, cables, and generators.</li>
          <li><strong>Search System:</strong> Real-time search tools to locate hardware items and nearby service technicians.</li>
          <li><strong>Location Filtering:</strong> Location-based query capabilities to find local suppliers across Ethiopian cities.</li>
          <li><strong>Payment Integration:</strong> Supports Telebirr and CBE Birr transaction verification for user registrations.</li>
          <li><strong>Responsive Design:</strong> Mobile-friendly user interface built with Tailwind CSS and interactive navigation menus.</li>
          <li><strong>Media Uploads:</strong> Multi-file input capabilities for product photos and technician verification credentials.</li>
          <li><strong>Direct Contact:</strong> Quick-action channels featuring integrated phone dialer and Telegram communication options.</li>
          <li><strong>Dynamic Modals:</strong> Interactive pop-up dialogs confirming successful registration and transaction status details.</li>
        </ul>
      </div>
    `
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    await Project.deleteMany({});
    await Project.insertMany(projects);
    console.log('መረጃዎቹ በተሳካ ሁኔታ ወደ ዳታቤዝ ገብተዋል።');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });