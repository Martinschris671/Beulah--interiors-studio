// ALL JAVASCRIPT REMAINS IDENTICAL TO THE PREVIOUS "Interactive Services" VERSION
// The smoothness improvements are primarily CSS-driven for the reveal part.
// The stepper and morphing background JS logic is specific and already targets smooth transitions.
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".icp-reveal-on-scroll");
  if (revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.05,
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

  const stepButtons = document.querySelectorAll(".icp-step-button");
  const stepDetails = document.querySelectorAll(".icp-step-detail");
  const morphingBg = document.getElementById("morphingBg");
  const sectionTitle = document.getElementById("creativeProcessTitle"); // Get the title if it needs separate reveal logic

  // (The title reveal is now handled by the generic .icp-reveal-on-scroll, so direct JS for its reveal is not needed here)

  function setActiveStep(selectedIndex) {
    stepButtons.forEach((button, index) => {
      button.classList.toggle("is-active", index === selectedIndex);
    });
    stepDetails.forEach((detail, index) => {
      detail.classList.toggle("is-active", index === selectedIndex);
    });
    if (morphingBg) {
      const stepNumber = selectedIndex + 1;
      let newRotation = 0;
      let newBorderRadius = "50% 30% 60% 40% / 40% 50% 30% 60%";
      let newScale = 1;
      switch (stepNumber) {
        case 1:
          newRotation = 0;
          newBorderRadius = "50% 30% 60% 40% / 40% 50% 30% 60%";
          newScale = 1;
          break;
        case 2:
          newRotation = 45;
          newBorderRadius = "30% 60% 40% 50% / 50% 30% 60% 40%";
          newScale = 1.05;
          break;
        case 3:
          newRotation = -30;
          newBorderRadius = "60% 40% 50% 30% / 30% 60% 40% 50%";
          newScale = 0.95;
          break;
        case 4:
          newRotation = 15;
          newBorderRadius = "40% 50% 30% 60% / 60% 40% 50% 30%";
          newScale = 1.1;
          break;
      }
      morphingBg.style.transform = `translateX(-50%) translateY(-10%) rotate(${newRotation}deg) scale(${newScale})`;
      morphingBg.style.borderRadius = newBorderRadius;
      morphingBg.style.opacity = "0.03";
    }
  }

  if (stepButtons.length > 0) {
    stepButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        setActiveStep(index);
      });
    });

    let maxListDelay = 0;
    stepButtons.forEach((item) => {
      const delay = parseInt(item.dataset.revealDelay) || 0;
      if (delay > maxListDelay) maxListDelay = delay;
    });
    const titleDelay =
      parseInt(
        document.getElementById("creativeProcessTitle")?.dataset.revealDelay
      ) || 0;
    const initialActivationDelay = Math.max(maxListDelay, titleDelay) + 500; // After the latest revealing element + buffer

    setTimeout(() => {
      if (
        stepButtons[0] &&
        !document.querySelector(".icp-step-button.is-active")
      ) {
        setActiveStep(0);
      }
    }, initialActivationDelay);
  }
});
