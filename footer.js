document.addEventListener("DOMContentLoaded", () => {
  // Set current year in copyright
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Scroll Reveal Logic
  const revealElements = document.querySelectorAll(".ft-reveal-on-scroll");

  if (revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px", // Trigger a bit before fully in view
      threshold: 0.05, // Start when 5% of element is visible (good for larger footers)
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
});
