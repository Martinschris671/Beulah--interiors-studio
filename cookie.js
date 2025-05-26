document.addEventListener("DOMContentLoaded", () => {
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("cookieAcceptBtn");
  const settingsBtn = document.getElementById("cookieSettingsBtn");
  const cookieName = "userCookieConsent";
  const bannerDisplayDelay = 30000; // 30 seconds in milliseconds

  // Function to show the banner
  function showBanner() {
    if (cookieBanner) {
      cookieBanner.classList.add("is-visible");
    }
  }

  // Function to hide the banner
  function hideBanner() {
    if (cookieBanner) {
      cookieBanner.classList.remove("is-visible");
    }
  }

  // Function to set the cookie consent in localStorage
  function setCookieConsent(status) {
    // status can be 'accepted', 'customized', 'rejected'
    // For this example, we'll just use 'accepted' or 'settings_interacted'
    try {
      localStorage.setItem(cookieName, status);
      localStorage.setItem(cookieName + "_timestamp", new Date().getTime());
    } catch (e) {
      console.error("Error saving to localStorage", e);
      // Fallback or alternative storage if localStorage is disabled/full
    }
    hideBanner();
  }

  // Function to check if consent has been given
  function hasConsent() {
    try {
      return localStorage.getItem(cookieName) !== null;
    } catch (e) {
      console.error("Error reading from localStorage", e);
      return false; // Assume no consent if localStorage is problematic
    }
  }

  // Event listeners for buttons
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      setCookieConsent("accepted");
      // Here you would typically initialize tracking scripts, etc.
      console.log("Cookies accepted by user.");
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      // For a real banner, this would open a modal or another section
      // For this example, we'll just log it and hide the banner
      setCookieConsent("settings_interacted");
      console.log(
        "User clicked customize settings. A settings modal would open here."
      );
      alert(
        "Cookie settings panel would open here. For now, this banner will be dismissed."
      );
    });
  }

  // Check for consent on page load
  if (!hasConsent()) {
    setTimeout(showBanner, bannerDisplayDelay);
  } else {
    console.log(
      "Cookie consent already given: " + localStorage.getItem(cookieName)
    );
  }
});
