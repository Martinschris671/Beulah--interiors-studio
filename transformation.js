document.addEventListener("DOMContentLoaded", () => {
  // Scroll Reveal Logic (UNCHANGED)
  const revealElements = document.querySelectorAll(".ts-reveal-on-scroll");
  if (revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    };
    let itemDelayCounter = 0;
    const staggerIncrement = 150;

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const specificDelay = parseInt(entry.target.dataset.revealDelay);
          const delay = !isNaN(specificDelay)
            ? specificDelay
            : itemDelayCounter * staggerIncrement;

          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);

          if (
            isNaN(specificDelay) &&
            entry.target.classList.contains("ts-item-reveal")
          ) {
            itemDelayCounter++;
          }
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);
    revealElements.forEach((el) => {
      observer.observe(el);
    });
  }

  // --- REFACTORED Image Comparison Slider Logic ---
  const sliders = document.querySelectorAll(".ts-image-comparison-slider");

  // Global drag state for mouse events, to prevent multiple sliders dragging at once
  let globalIsMouseDragging = false;
  let globalCurrentSlider = null;

  sliders.forEach((slider) => {
    const imgAfter = slider.querySelector(".ts-img-after");
    const handleContainer = slider.querySelector(".ts-slider-handle-container");
    const labelBefore = slider.querySelector(".ts-label-before");
    const labelAfter = slider.querySelector(".ts-label-after");

    // State specific to this slider instance for touch
    slider.isTouchDragging = false;
    slider.initialTouchX = 0;
    slider.initialTouchY = 0;
    slider.touchDragIntentConfirmed = false;
    const touchDragThreshold = 10;

    function updateSliderPosition(xPosition, activeSlider) {
      if (!activeSlider || !imgAfter || !handleContainer) return;

      const sliderRect = activeSlider.getBoundingClientRect();
      let percentage = ((xPosition - sliderRect.left) / sliderRect.width) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      imgAfter.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
      handleContainer.style.left = `${percentage}%`;

      if (labelBefore && labelAfter) {
        const showLabels =
          activeSlider.matches(":hover") ||
          activeSlider.classList.contains("is-dragging");
        labelBefore.style.opacity = percentage > 5 && showLabels ? "1" : "0";
        labelAfter.style.opacity = percentage < 95 && showLabels ? "1" : "0";
      }
    }

    if (slider.offsetParent !== null) {
      // Check if slider is actually visible
      updateSliderPosition(
        slider.getBoundingClientRect().left +
          slider.getBoundingClientRect().width * 0.5,
        slider
      );
      if (labelBefore) labelBefore.style.opacity = "0"; // Start with labels hidden
      if (labelAfter) labelAfter.style.opacity = "0";
    }

    // --- MOUSE EVENTS (using global state) ---
    slider.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return; // Only left mouse button
      globalIsMouseDragging = true;
      globalCurrentSlider = slider;
      slider.classList.add("is-dragging");
      document.body.style.cursor = "ew-resize";
      updateSliderPosition(e.clientX, slider);
    });

    // --- TOUCH EVENTS (using instance-specific state) ---
    slider.addEventListener(
      "touchstart",
      (e) => {
        slider.isTouchDragging = true;
        slider.touchDragIntentConfirmed = false;
        slider.classList.add("is-dragging");
        slider.initialTouchX = e.touches[0].clientX;
        slider.initialTouchY = e.touches[0].clientY;
        // No updateSliderPosition here, wait for move to confirm intent
      },
      { passive: true }
    );

    // Label visibility on hover (for mouse users)
    slider.addEventListener("mouseenter", () => {
      if (
        !slider.isTouchDragging &&
        !globalIsMouseDragging &&
        labelBefore &&
        labelAfter
      ) {
        // Only if not currently being dragged
        const currentPercentage = parseFloat(
          handleContainer.style.left || "50"
        );
        labelBefore.style.opacity = currentPercentage > 5 ? "1" : "0";
        labelAfter.style.opacity = currentPercentage < 95 ? "1" : "0";
      }
    });
    slider.addEventListener("mouseleave", () => {
      if (
        !slider.isTouchDragging &&
        !globalIsMouseDragging &&
        labelBefore &&
        labelAfter
      ) {
        labelBefore.style.opacity = "0";
        labelAfter.style.opacity = "0";
      }
    });
  }); // END sliders.forEach

  // --- GLOBAL MOUSE EVENT LISTENERS ---
  document.addEventListener("mousemove", (e) => {
    if (globalIsMouseDragging && globalCurrentSlider) {
      const imgAfter = globalCurrentSlider.querySelector(".ts-img-after");
      const handleContainer = globalCurrentSlider.querySelector(
        ".ts-slider-handle-container"
      );
      const labelBefore = globalCurrentSlider.querySelector(".ts-label-before");
      const labelAfter = globalCurrentSlider.querySelector(".ts-label-after");

      function updateGlobalSliderPosition(xPosition) {
        if (!globalCurrentSlider || !imgAfter || !handleContainer) return;
        const sliderRect = globalCurrentSlider.getBoundingClientRect();
        let percentage =
          ((xPosition - sliderRect.left) / sliderRect.width) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        imgAfter.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
        handleContainer.style.left = `${percentage}%`;
        if (labelBefore && labelAfter) {
          labelBefore.style.opacity = percentage > 5 ? "1" : "0";
          labelAfter.style.opacity = percentage < 95 ? "1" : "0";
        }
      }
      updateGlobalSliderPosition(e.clientX);
    }
  });
  document.addEventListener("mouseup", () => {
    if (globalIsMouseDragging && globalCurrentSlider) {
      globalCurrentSlider.classList.remove("is-dragging");
      // Optionally, hide labels if mouse is not over the slider after drag ends
      if (!globalCurrentSlider.matches(":hover")) {
        const labelBefore =
          globalCurrentSlider.querySelector(".ts-label-before");
        const labelAfter = globalCurrentSlider.querySelector(".ts-label-after");
        if (labelBefore) labelBefore.style.opacity = "0";
        if (labelAfter) labelAfter.style.opacity = "0";
      }
    }
    globalIsMouseDragging = false;
    globalCurrentSlider = null;
    document.body.style.cursor = "default";
  });

  // --- GLOBAL TOUCH EVENT LISTENERS ---
  document.addEventListener(
    "touchmove",
    (e) => {
      sliders.forEach((slider) => {
        // Must check which slider this touchmove pertains to
        if (!slider.isTouchDragging) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = Math.abs(currentX - slider.initialTouchX);
        const deltaY = Math.abs(currentY - slider.initialTouchY);
        const touchDragThreshold = 10;

        if (!slider.touchDragIntentConfirmed) {
          if (deltaX > touchDragThreshold || deltaY > touchDragThreshold) {
            if (deltaX > deltaY * 1.2) {
              // Be a bit more biased towards horizontal for slider
              slider.touchDragIntentConfirmed = true;
            } else {
              slider.isTouchDragging = false; // It's a scroll
              slider.classList.remove("is-dragging");
              return;
            }
          } else {
            return; // Not moved enough
          }
        }

        if (slider.touchDragIntentConfirmed) {
          if (e.cancelable) e.preventDefault();
          const imgAfter = slider.querySelector(".ts-img-after");
          const handleContainer = slider.querySelector(
            ".ts-slider-handle-container"
          );
          const labelBefore = slider.querySelector(".ts-label-before");
          const labelAfter = slider.querySelector(".ts-label-after");

          function updateTouchSliderPosition(xPos) {
            if (!imgAfter || !handleContainer) return;
            const sliderRect = slider.getBoundingClientRect();
            let percentage =
              ((xPos - sliderRect.left) / sliderRect.width) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            imgAfter.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
            handleContainer.style.left = `${percentage}%`;
            if (labelBefore && labelAfter) {
              labelBefore.style.opacity = percentage > 5 ? "1" : "0";
              labelAfter.style.opacity = percentage < 95 ? "1" : "0";
            }
          }
          updateTouchSliderPosition(currentX);
        }
      });
    },
    { passive: false }
  );

  document.addEventListener("touchend", (e) => {
    sliders.forEach((slider) => {
      if (slider.isTouchDragging) {
        slider.isTouchDragging = false;
        slider.touchDragIntentConfirmed = false;
        slider.classList.remove("is-dragging");
        // Labels will naturally hide if not hovered, or stay if hovered
      }
    });
  });
  document.addEventListener("touchcancel", (e) => {
    // Same as touchend
    sliders.forEach((slider) => {
      if (slider.isTouchDragging) {
        slider.isTouchDragging = false;
        slider.touchDragIntentConfirmed = false;
        slider.classList.remove("is-dragging");
      }
    });
  });
});
