document.addEventListener("DOMContentLoaded", () => {
  const sectionTitle = document.getElementById("portfolioOverviewTitle");
  const projectItems = document.querySelectorAll(".po-project-item");

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px", // Trigger a bit before fully in view
    threshold: 0.1,
  };

  let itemDelayCounter = 0; // Counter for staggering project items

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target === sectionTitle) {
          entry.target.classList.add("is-visible");
        } else if (entry.target.classList.contains("po-project-item")) {
          // Apply dynamic transition delay for stagger
          entry.target.style.transitionDelay = `${itemDelayCounter * 0.15}s`; // 150ms stagger
          entry.target.classList.add("is-visible");
          itemDelayCounter++;
        }
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  if (sectionTitle) {
    observer.observe(sectionTitle);
  }
  projectItems.forEach((item) => {
    observer.observe(item);
  });
});
