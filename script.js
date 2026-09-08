const API_BASE_URL = 'http://localhost:5002/api';

// Project details local cache fallback
const projectDetails = {
  embedded: {
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
  web: {
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
  circuit: {
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
};

// 1. Contact Form Submit ማድረጊያ function (ወደ /api/contact እንዲልክ ተስተካክሏል)
window.handleSubmit = async function (event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  try {
    // 🔴 ማስተካከያ፡ ወደ /api/contact ኤንድፖይንት እንዲልክ ተደርጓል
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || 'እናመሰግናለን! መልእክትዎ ለ Metadel Aschale ተልኳል።');
      form.reset();
      window.closeContact();
    } else {
      alert(result.message || 'ስህተት ተፈጥሯል!');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    alert('ከሰርቨሩ ጋር መገናኘት አልተቻለም!');
  }
};

// 2. Project Modal ከ Backend Data (ከ Fallback ጋራ) የሚያመጣ function
window.openProjectModal = async function (key) {
  const modal = document.getElementById('projectModal');
  const title = document.getElementById('projectModalTitle');
  const content = document.getElementById('projectModalContent');
  const githubLink = document.getElementById('projectGithubLink');

  try {
    const response = await fetch(`${API_BASE_URL}/projects/${key}`);
    const result = await response.json();

    if (result.success && result.data) {
      if (title) title.innerText = result.data.title;
      if (content) content.innerHTML = result.data.description;
      if (githubLink) githubLink.href = result.data.githubUrl || 'https://github.com/Metadel-hub';
    } else {
      throw new Error('Fallback to local');
    }
  } catch (error) {
    console.error('Error fetching project, using fallback:', error);
    if (projectDetails[key]) {
      if (title) title.innerText = projectDetails[key].title;
      if (content) content.innerHTML = projectDetails[key].description;
      if (githubLink) githubLink.href = 'https://github.com/Metadel-hub';
    }
  }

  if (modal) {
    modal.classList.add('active');
  }
};

// Modals & Navigation Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Navigation Menu Handlers
  window.toggleMenu = function () {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) navLinks.classList.toggle('active');
  };

  window.closeMenu = function () {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) navLinks.classList.remove('active');
  };

  document.querySelectorAll('#nav-links a').forEach((link) => {
    link.addEventListener('click', window.closeMenu);
  });

  // Contact Modal Handlers
  window.openContact = function (event) {
    if (event) event.preventDefault();
    const contactModal = document.getElementById('contactModal');
    if (contactModal) contactModal.classList.add('active');
  };

  window.closeContact = function () {
    const contactModal = document.getElementById('contactModal');
    if (contactModal) contactModal.classList.remove('active');
  };

  window.closeProjectModal = function () {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('active');
  };

  // Close modals on overlay click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });

  // Hero Section Mouse Glow
  const homeSection = document.getElementById('home');
  if (homeSection) {
    homeSection.addEventListener('mousemove', (e) => {
      const rect = homeSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      homeSection.style.setProperty('--mouse-x', `${x}%`);
      homeSection.style.setProperty('--mouse-y', `${y}%`);
      homeSection.style.setProperty('--glow-x', `${x}%`);
      homeSection.style.setProperty('--glow-y', `${y}%`);
    });
  }
});