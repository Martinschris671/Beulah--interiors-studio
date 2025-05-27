document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("featureOverlay");
  const popupDialog = overlay ? overlay.querySelector(".popup-dialog") : null;
  const closeBtn = document.getElementById("popupCloseBtn");
  const popupTitleElement = document.getElementById("popupTitle");
  const popupMessageElement = document.getElementById("popupMessage");
  const triggerLinks = document.querySelectorAll(".trigger-feature-popup");

  let previouslyFocusedElement = null;

  function openOverlay(title, message) {
    if (!overlay || !popupTitleElement || !popupMessageElement) return;

    previouslyFocusedElement = document.activeElement; // Store focus

    popupTitleElement.textContent = title || "Coming Soon!"; // Default title
    popupMessageElement.textContent =
      message || "This feature is not yet implemented. We're working on it!"; // Default message

    document.body.classList.add("popup-overlay-active");
    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");

    // Focus management for accessibility
    overlay.focus(); // Focus the overlay itself first
    if (closeBtn) closeBtn.focus(); // Then focus the close button
  }

  function closeOverlay() {
    if (!overlay) return;

    document.body.classList.remove("popup-overlay-active");
    overlay.classList.remove("is-active");
    overlay.setAttribute("aria-hidden", "true");

    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus(); // Restore focus
      previouslyFocusedElement = null;
    }
  }

  if (triggerLinks.length > 0) {
    triggerLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default link behavior
        const title = link.dataset.popupTitle;
        const message = link.dataset.popupMessage;
        openOverlay(title, message);
      });
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeOverlay);
  }

  // Close overlay on Escape key press
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      overlay &&
      overlay.classList.contains("is-active")
    ) {
      closeOverlay();
    }
  });

  // Close overlay if user clicks on the dark background (outside the dialog)
  if (overlay && popupDialog) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        // Check if the click is directly on the overlay backdrop
        closeOverlay();
      }
    });
  }
});
