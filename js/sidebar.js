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

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Initialize sidebar toggle
  const toggleBtn = document.querySelector(".sidebar-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleSidebar);
  }
});
