document.addEventListener("DOMContentLoaded", () => {
  // Scroll Reveal Logic
  const revealElements = document.querySelectorAll(".is-reveal-on-scroll");
  if (revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.05,
    };
    // No need for itemDelayCounter here as data-reveal-delay is used
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

  // Interactive Services Logic (Your existing canvas and service switching JS)
  const serviceTitleItems = document.querySelectorAll(".is-service-title-item");
  const serviceDetailCanvas = document.getElementById("isServiceDetailCanvas");
  const serviceDetailContents = document.querySelectorAll(
    ".is-service-detail-content"
  );

  let ctx,
    width,
    height,
    particles = [],
    currentAccentColor;
  let animationFrameId;

  function initCanvas() {
    /* ... (Your existing initCanvas - UNCHANGED) ... */
    if (!serviceDetailCanvas) return;
    ctx = serviceDetailCanvas.getContext("2d");
    const panel = serviceDetailCanvas.parentElement;
    width = panel.clientWidth;
    height = panel.clientHeight;
    serviceDetailCanvas.width = width;
    serviceDetailCanvas.height = height;
  }
  class Particle {
    /* ... (Your existing Particle class - UNCHANGED) ... */
    constructor(x, y, radius, color, speedX, speedY) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.speedX = speedX;
      this.speedY = speedY;
      this.opacity = 0;
      this.targetOpacity = 0.6 * Math.random() + 0.2;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color.replace(
        /,\s*\d?\.?\d*\)/,
        `, ${this.opacity})`
      );
      ctx.fill();
    }
    update() {
      if (this.x + this.radius > width || this.x - this.radius < 0)
        this.speedX = -this.speedX;
      if (this.y + this.radius > height || this.y - this.radius < 0)
        this.speedY = -this.speedY;
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.opacity < this.targetOpacity) this.opacity += 0.01;
      this.draw();
    }
  }
  function createParticles(accentColor) {
    /* ... (Your existing createParticles - UNCHANGED) ... */
    particles = [];
    const numParticles = Math.floor(Math.random() * 5) + 5;
    for (let i = 0; i < numParticles; i++) {
      const radius = Math.random() * 30 + 20;
      const x = Math.random() * (width - radius * 2) + radius;
      const y = Math.random() * (height - radius * 2) + radius;
      const speedX = (Math.random() - 0.5) * 0.3;
      const speedY = (Math.random() - 0.5) * 0.3;
      particles.push(
        new Particle(
          x,
          y,
          radius,
          accentColor || "rgba(0,0,0,0.1)",
          speedX,
          speedY
        )
      );
    }
  }
  function animateCanvas() {
    /* ... (Your existing animateCanvas - UNCHANGED) ... */
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => particle.update());
    animationFrameId = requestAnimationFrame(animateCanvas);
  }
  function startCanvasAnimation(accentColor) {
    /* ... (Your existing startCanvasAnimation - UNCHANGED) ... */
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    currentAccentColor = accentColor;
    if (serviceDetailCanvas) serviceDetailCanvas.classList.add("is-active");
    initCanvas();
    createParticles(currentAccentColor);
    animateCanvas();
  }
  function stopCanvasAnimation() {
    /* ... (Your existing stopCanvasAnimation - UNCHANGED) ... */
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (serviceDetailCanvas) serviceDetailCanvas.classList.remove("is-active");
  }

  function setActiveService(selectedItem) {
    /* ... (Your existing setActiveService - UNCHANGED) ... */
    serviceTitleItems.forEach((item) => item.classList.remove("is-active"));
    serviceDetailContents.forEach((content) =>
      content.classList.remove("is-active")
    );
    stopCanvasAnimation();
    selectedItem.classList.add("is-active");
    const serviceKey = selectedItem.dataset.service;
    const activeContent = document.querySelector(
      `.is-service-detail-content[data-service="${serviceKey}"]`
    );
    if (activeContent) {
      activeContent.classList.add("is-active");
    }
    const accentColor = selectedItem.dataset.colorAccent || "rgba(0,0,0,0.1)";
    startCanvasAnimation(accentColor);
  }

  if (serviceTitleItems.length > 0) {
    serviceTitleItems.forEach((item) => {
      item.addEventListener("click", () => {
        setActiveService(item);
      });
    });
    // Set initial active state after scroll reveal animations for list items have a chance to start
    // This requires knowing when the last list item is visible.
    // A simpler approach for now: set active after a fixed delay that accounts for list item reveal.
    // Or, set the first one active immediately and let its content fade in.

    // Find the largest reveal delay among title items
    let maxListDelay = 0;
    serviceTitleItems.forEach((item) => {
      const delay = parseInt(item.dataset.revealDelay) || 0;
      if (delay > maxListDelay) maxListDelay = delay;
    });

    const initialActivationDelay = maxListDelay + 500; // 500ms after the last list item starts revealing

    setTimeout(() => {
      if (
        serviceTitleItems[0] &&
        !document.querySelector(".is-service-title-item.is-active")
      ) {
        setActiveService(serviceTitleItems[0]);
      }
    }, initialActivationDelay);
  }

  window.addEventListener("resize", () => {
    /* ... (Your existing resize listener - UNCHANGED) ... */
    if (
      serviceDetailCanvas &&
      serviceDetailCanvas.classList.contains("is-active") &&
      currentAccentColor
    ) {
      initCanvas();
      createParticles(currentAccentColor);
    }
  });
});
