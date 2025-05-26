document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".fw-reveal-on-scroll");

  if (revealElements.length > 0) {
    const observerOptions = {
      root: null, // relative to viewport
      rootMargin: "0px", // no margin
      threshold: 0.2, // Trigger when 20% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const animationClass =
            entry.target.dataset.animationClass || "animate"; // Default to 'animate'
          entry.target.classList.add(animationClass);
          // Optional: Stop observing the element after it has been revealed
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      observer.observe(el);
    });
  }
});
