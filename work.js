document.addEventListener("DOMContentLoaded", () => {
  // Scroll Reveal Logic
  const revealElements = document.querySelectorAll(".csw-reveal-on-scroll");
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

  // Interactive Styles Showcase Logic (Your existing JS, UNCHANGED)
  const stylesNavigation = document.getElementById("stylesNavigation"); // Needed for initial active state
  const navItems = document.querySelectorAll(".csw-nav-item");
  const displayArea = document.getElementById("styleDisplayArea");
  const styleTitleElement = document.getElementById("cswStyleTitleDisplay");
  const styleDescriptionElement = document.getElementById(
    "cswStyleDescriptionDisplay"
  );

  const styleData = {
    /* ... (Your styleData object - UNCHANGED) ... */
    minimalist: {
      title: "Minimalist",
      description:
        "Simplicity, functionality, and serene spaces where less is profoundly more.",
      image: "images/minimalist.webp",
    },
    elegant: {
      title: "Elegant",
      description:
        "Timeless sophistication defined by graceful forms, rich textures, and curated luxury.",
      image: "images/elegant.webp",
    },
    classy: {
      title: "Classy",
      description:
        "Refined interiors exuding confidence through quality craftsmanship and understated opulence.",
      image: "images/classy.webp",
    },
    modern: {
      title: "Modern",
      description:
        "Forward-thinking design with bold forms, innovative materials, and smart functionality.",
      image: "images/modern.webp",
    },
    scandinavian: {
      title: "Scandinavian",
      description:
        "Light-filled, functional, and effortlessly stylish, prioritizing comfort and natural elements.",
      image: "images/scandinavian.webp",
    },
  };
  let currentActiveStyle = null;
  let imageLayerPool = [];
  let activeLayerIndex = 0;
  for (let i = 0; i < 2; i++) {
    const layer = document.createElement("div");
    layer.classList.add("csw-image-layer");
    if (displayArea) displayArea.insertBefore(layer, displayArea.firstChild);
    imageLayerPool.push(layer);
  }

  function updateDisplay(styleKey) {
    /* ... (Your updateDisplay function - UNCHANGED) ... */
    if (
      !styleData[styleKey] ||
      styleKey === currentActiveStyle ||
      !styleTitleElement ||
      !styleDescriptionElement
    )
      return;
    const data = styleData[styleKey];
    styleTitleElement.classList.remove("is-visible");
    styleDescriptionElement.classList.remove("is-visible");
    const nextLayerIndex = 1 - activeLayerIndex;
    const newImageLayer = imageLayerPool[nextLayerIndex];
    const oldImageLayer = imageLayerPool[activeLayerIndex];
    if (newImageLayer) {
      newImageLayer.style.backgroundImage = `url(${data.image})`;
      newImageLayer.classList.add("is-active");
    }
    if (oldImageLayer) {
      oldImageLayer.classList.remove("is-active");
    }
    activeLayerIndex = nextLayerIndex;
    setTimeout(() => {
      styleTitleElement.textContent = data.title;
      styleDescriptionElement.textContent = data.description;
      styleTitleElement.classList.add("is-visible");
      styleDescriptionElement.classList.add("is-visible");
    }, 300);
    navItems.forEach((item) => {
      item.classList.toggle("is-active", item.dataset.style === styleKey);
    });
    currentActiveStyle = styleKey;
  }

  if (navItems.length > 0) {
    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        updateDisplay(item.dataset.style);
      });
    });

    // Calculate initial delay based on when the navigation itself becomes visible
    let navRevealDelay = 0;
    if (stylesNavigation && stylesNavigation.dataset.revealDelay) {
      navRevealDelay = parseInt(stylesNavigation.dataset.revealDelay);
    }
    const initialActivationDelay = navRevealDelay + 500 + 200; // Base reveal duration + buffer + nav list item reveal time

    setTimeout(() => {
      if (navItems[0] && !document.querySelector(".csw-nav-item.is-active")) {
        updateDisplay(navItems[0].dataset.style);
      }
    }, initialActivationDelay);
  }
});
