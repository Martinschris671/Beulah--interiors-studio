document.addEventListener("DOMContentLoaded", () => {
  // Scroll Reveal for Title, Testimonial Items, and Form Wrapper
  const revealElements = document.querySelectorAll(".wts-reveal-on-scroll");

  if (revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px", // Trigger a bit before fully in view
      threshold: 0.1, // Start when 10% of element is visible
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.revealDelay) || 0;
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      observer.observe(el);
    });
  }

  // Overlay Logic (Your existing JS, UNCHANGED)
  const commentForm = document.getElementById("commentForm");
  const customOverlay = document.getElementById("wtsCustomOverlay");
  const overlayMessageText = document.getElementById("wtsOverlayMessageText");
  const overlayCloseBtn = document.getElementById("wtsOverlayClose");

  function showCustomOverlay(message) {
    if (overlayMessageText && customOverlay && document.body) {
      // Null checks
      overlayMessageText.textContent = message;
      customOverlay.classList.add("is-active");
      document.body.classList.add("wts-overlay-active");
    }
  }
  function hideCustomOverlay() {
    if (customOverlay && document.body) {
      // Null checks
      customOverlay.classList.remove("is-active");
      document.body.classList.remove("wts-overlay-active");
    }
  }
  if (overlayCloseBtn) {
    overlayCloseBtn.addEventListener("click", hideCustomOverlay);
  }
  if (customOverlay) {
    customOverlay.addEventListener("click", function (event) {
      if (event.target === customOverlay) {
        hideCustomOverlay();
      }
    });
  }
  if (commentForm) {
    commentForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const nameInput = document.getElementById("wtsName");
      const commentInput = document.getElementById("wtsComment");
      if (nameInput && commentInput) {
        // Null checks
        const name = nameInput.value.trim();
        const commentText = commentInput.value.trim();
        if (name && commentText) {
          showCustomOverlay(
            "Thank you! Your feedback is valuable and will be reviewed."
          ); // Updated message
          commentForm.reset();
        } else {
          showCustomOverlay(
            "Please fill in your name and comment before submitting."
          ); // Updated message
        }
      }
    });
  }
});
