// Local Project Details Cache Fallback
const projectDetails = {
  embedded: {
    title: "Color Sorting Robotic Arm",
    description: `
      <div style="height: 350px; overflow-y: auto; padding-right: 0.5rem;">
        <p>An automated robotic arm that uses computer vision or optical sensors to identify, categorize, and sort items by color.</p>
        <br>
        <h4>Key Features:</h4>
        <ul style="padding-left: 1.2rem; margin-top: 0.5rem; line-height: 1.6;">
          <li><strong>Computer Vision Integration:</strong> Uses RGB cameras or color sensors to detect and analyze object hues accurately.</li>
          <li><strong>Real-Time Processing:</strong> Identifies and classifies colors instantly using microcontrollers or edge AI devices.</li>
          <li><strong>Multi-Axis Articulation:</strong> Features multiple joints for fluid, versatile movement across axes.</li>
          <li><strong>Precision End-Effectors:</strong> Utilizes vacuum suction cups or mechanical grippers tailored to grab specific item shapes.</li>
          <li><strong>Automated Sorting Logic:</strong> Programmed with specific target zones or bins for fast, systematic placement.</li>
          <li><strong>High-Speed Pick-and-Place:</strong> Executes rapid pick, transfer, and release cycles to boost operational throughput.</li>
          <li><strong>Adaptable Lighting Systems:</strong> Includes integrated LEDs to ensure consistent color recognition regardless of ambient light.</li>
        </ul>
      </div>
    `
  },
  web: {
    title: "Habesha Crafts (የሀበሻ ዕደ-ጥበብ)",
    description: `
      <div style="height: 350px; overflow-y: auto; padding-right: 0.5rem;">
        <p><strong>Habesha Crafts (የሀበሻ ዕደ-ጥበብ)</strong> is a specialized e-commerce landing page template written in Amharic connecting local Ethiopian artisans with buyers.</p>
        <br>
        <h4>Detailed Overview:</h4>
        <ul style="padding-left: 1.2rem; margin-top: 0.5rem; line-height: 1.6;">
          <li><strong>Localization:</strong> Full UI design built using native Amharic typography and semantics.</li>
          <li><strong>Interactive Navigation:</strong> Header featuring search query filtering, category links, and shopping cart counter.</li>
          <li><strong>Seller Product Portal:</strong> Front-end form interface allowing local craftspeople to input product titles, images, and prices in ETB.</li>
          <li><strong>Product Categories:</strong> Traditional Clothing, Pottery, Art & Paintings, and Jewelry.</li>
        </ul>
      </div>
    `
  },
  circuit: {
    title: "Ethio-Industrial-Hub",
    description: `
      <div style="height: 350px; overflow-y: auto; padding-right: 0.5rem;">
        <p><strong>Ethio-Industrial-Hub</strong> is a web application linking Ethiopian suppliers and technicians to streamline industrial hardware sourcing and repair services.</p>
        <br>
        <h4>Key Features:</h4>
        <ul style="padding-left: 1.2rem; margin-top: 0.5rem; line-height: 1.6;">
          <li><strong>Supplier Registration:</strong> Allows industrial vendors to list electrical equipment and components.</li>
          <li><strong>Technician Profiles:</strong> Enables repair experts to register qualifications and service rates.</li>
          <li><strong>Category Filtering:</strong> Organized navigation for transformers, motors, breakers, cables, and generators.</li>
          <li><strong>Payment Integration:</strong> Supports Telebirr and CBE Birr transaction verification.</li>
        </ul>
      </div>
    `
  }
};

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
    if (contactModal) contactModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeContact = function () {
    const contactModal = document.getElementById('contactModal');
    if (contactModal) contactModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  // Backend Contact Form Submission Handler
  window.handleSubmit = async function (e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    const nameInput = form.querySelector('input[name="name"]') || form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[name="email"]') || form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea[name="message"]') || form.querySelector('textarea');

    const name = nameInput ? nameInput.value : '';
    const email = emailInput ? emailInput.value : '';
    const message = messageInput ? messageInput.value : '';

    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch('http://localhost:5003/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('እናመሰግናለን! መልእክትዎ ለ Metadel Aschale ተልኳል።');
        form.reset();
        window.closeContact();
      } else {
        alert('መልእክት መላክ አልተቻለም: ' + (result.message || 'Server error'));
      }
    } catch (error) {
      console.error('ስህተት ተፈጥሯል:', error);
      alert('ከ Server ጋር መገናኘት አልተቻለም። እባክዎ ሰርቨሩ መጀመሩን ያረጋግጡ።');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  };

  // Project Details Modal Handler
  window.openProjectModal = function (key) {
    const modal = document.getElementById('projectModal');
    const title = document.getElementById('projectModalTitle');
    const content = document.getElementById('projectModalContent');

    if (modal && projectDetails[key]) {
      if (title) title.innerText = projectDetails[key].title;
      if (content) content.innerHTML = projectDetails[key].description;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeProjectModal = function () {
    const modal = document.getElementById('projectModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  };

  // Admin Modal Handlers
  window.openAdminModal = function (event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('adminModal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; 
    }
    window.closeMenu(); 
  };

  window.closeAdminModal = function () {
    const modal = document.getElementById('adminModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto'; 
    }
  };

  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    const contactModal = document.getElementById('contactModal');
    const projectModal = document.getElementById('projectModal');
    const adminModal = document.getElementById('adminModal');

    if (event.target === contactModal) window.closeContact();
    if (event.target === projectModal) window.closeProjectModal();
    if (event.target === adminModal) window.closeAdminModal();
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
    });
  }
});

// Admin Login Handler (Backend Check)
window.handleAdminLogin = async function(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    const response = await fetch('http://localhost:5003/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert('ግባ ተሳክቷል! ወደ ዳሽቦርድ በመሄድ ላይ...');
      window.closeAdminModal();
      window.location.href = 'admin.html';
    } else {
      alert(result.message || 'የተሳሳተ መለያ ወይም የይለፍ ቃል!');
    }
  } catch (error) {
    console.error('ስህተት ተፈጥሯል:', error);
    alert('ከ Server ጋር መገናኘት አልተቻለም።');
  }
};

// Admin Logout Handler
window.handleAdminLogout = async function() {
  try {
    await fetch('http://localhost:5003/api/admin/logout', {
      method: 'POST'
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'index.html';
  }
};