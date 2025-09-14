// Sidebar toggle functionality
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.querySelector(".sidebar-toggle");
  const toggleIcon = toggleBtn.querySelector("i");

  sidebar.classList.toggle("sidebar-collapsed");

  // Update button icon with delay for smooth transition
  setTimeout(() => {
    if (sidebar.classList.contains("sidebar-collapsed")) {
      toggleIcon.className = "fas fa-bars";
    } else {
      toggleIcon.className = "fas fa-chevron-left";
    }
  }, 150);
}

// Mobile menu functionality
function toggleMobileMenu() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mobileIcon = mobileBtn.querySelector("i");

  // Toggle sidebar visibility
  sidebar.classList.toggle("sidebar-open");
  overlay.classList.toggle("active");
  
  // Update button icon
  if (sidebar.classList.contains("sidebar-open")) {
    mobileIcon.className = "fas fa-times";
  } else {
    mobileIcon.className = "fas fa-bars";
  }
}

// Close mobile menu when clicking overlay
function closeMobileMenu() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mobileIcon = mobileBtn ? mobileBtn.querySelector("i") : null;

  sidebar.classList.remove("sidebar-open");
  overlay.classList.remove("active");
  
  if (mobileIcon) {
    mobileIcon.className = "fas fa-bars";
  }
}

// Handle window resize to close mobile menu on desktop
function handleResize() {
  if (window.innerWidth >= 769) {
    closeMobileMenu();
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Initialize sidebar toggle (desktop)
  const toggleBtn = document.querySelector(".sidebar-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleSidebar);
  }
  
  // Initialize mobile menu toggle
  const mobileBtn = document.getElementById("mobileMenuBtn");
  if (mobileBtn) {
    mobileBtn.addEventListener("click", toggleMobileMenu);
  }
  
  // Initialize overlay click handler
  const overlay = document.getElementById("sidebarOverlay");
  if (overlay) {
    overlay.addEventListener("click", closeMobileMenu);
  }
  
  // Handle window resize
  window.addEventListener("resize", handleResize);
  
  // Close mobile menu when clicking nav links (mobile UX improvement)
  const navLinks = document.querySelectorAll("#sidebar nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 769) {
        closeMobileMenu();
      }
    });
  });
});
