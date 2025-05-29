document.addEventListener("DOMContentLoaded", () => {
  // Scroll Reveal Logic
  const revealElements = document.querySelectorAll(".faq-reveal-on-scroll");
  if (revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px", // Trigger a bit before fully in view
      threshold: 0.05,
    };
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.revealDelay) || 0;
          // Apply the JS-controlled delay to the CSS transition-delay property
          entry.target.style.transitionDelay = `${delay / 1000}s`; // Convert ms to s
          entry.target.classList.add("is-visible");
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);
    revealElements.forEach((el) => {
      observer.observe(el);
    });
  }

  // Accordion Functionality (Your existing JS - UNCHANGED)
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question-button");
    const content = item.querySelector(".faq-answer-content");
    if (button && content) {
      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        // Optional: Close others
        // faqItems.forEach(otherItem => {
        //     if (otherItem !== item && otherItem.classList.contains('is-open')) {
        //         otherItem.classList.remove('is-open');
        //         otherItem.querySelector('.faq-question-button').setAttribute('aria-expanded', 'false');
        //         otherItem.querySelector('.faq-answer-content').style.maxHeight = null;
        //     }
        // });
        item.classList.toggle("is-open");
        button.setAttribute("aria-expanded", !isOpen);
        if (!isOpen) {
          content.style.maxHeight = content.scrollHeight + "px";
        } else {
          content.style.maxHeight = null;
        }
      });
    }
  });
});
