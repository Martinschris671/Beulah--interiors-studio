// YOUR PROVIDED JAVASCRIPT FOR FORM VALIDATION AND SUBMISSION
// The scroll reveal logic within this script will be used for the .cs-container
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const formStatusMessage = document.getElementById("formStatusMessage");
  const MY_EMAIL_ADDRESS = "monsurr671@gmail.com";
  const YOUR_NAME_FOR_EMAIL = "OLUWOLE JOY TEMITOPE";

  function validateField(field) {
    /* ... (Your existing validation logic) ... */
    const errorElement =
      field.parentElement.querySelector(".form-error-message-unique") ||
      (field.parentElement.classList.contains("select-wrapper-unique")
        ? field.parentElement.parentElement.querySelector(
            ".form-error-message-unique"
          )
        : null);
    let isValid = true;
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove("visible");
    }
    field.classList.remove("invalid");
    if (field.hasAttribute("required") && field.value.trim() === "") {
      if (errorElement) errorElement.textContent = "This field is required.";
      isValid = false;
    } else if (field.type === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value.trim())) {
        if (errorElement)
          errorElement.textContent = "Please enter a valid email.";
        isValid = false;
      }
    } else if (
      field.tagName === "SELECT" &&
      field.hasAttribute("required") &&
      field.value === ""
    ) {
      if (errorElement) errorElement.textContent = "Please select an option.";
      isValid = false;
    }
    if (!isValid) {
      if (errorElement) errorElement.classList.add("visible");
      field.classList.add("invalid");
    }
    return isValid;
  }

  if (contactForm) {
    const formFields = contactForm.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );
    formFields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.classList.contains("invalid")) {
          validateField(field);
        }
      });
    });

    contactForm.addEventListener("submit", function (event) {
      /* ... (Your existing submit logic) ... */ event.preventDefault();
      let isFormValid = true;
      formFields.forEach((field) => {
        if (!validateField(field)) {
          isFormValid = false;
        }
      });
      if (!isFormValid) {
        formStatusMessage.textContent = "Please correct the errors above.";
        formStatusMessage.className =
          "form-status-message-unique error visible";
        return;
      }
      formStatusMessage.textContent = "Preparing your message...";
      formStatusMessage.className = "form-status-message-unique visible";
      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const service = document.getElementById("contactService").value;
      const message = document.getElementById("contactMessage").value.trim();
      const subject = `Portfolio Inquiry: ${service} - From ${name}`;
      const body = `Hello ${YOUR_NAME_FOR_EMAIL},\n\nI am reaching out from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nService of Interest: ${service}\n\nMessage:\n${message}\n\nI look forward to discussing this further.\n\nBest regards,\n${name}\n`;
      const mailtoLink = `mailto:${MY_EMAIL_ADDRESS}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      try {
        const mailWindow = window.open(mailtoLink, "_blank");
        if (mailWindow) {
          formStatusMessage.textContent =
            "Your email app should open. Please review and send!";
          formStatusMessage.className =
            "form-status-message-unique success visible";
        } else {
          formStatusMessage.textContent =
            "Could not open email app automatically. Please check your browser settings or copy the details. You might also try right-clicking the 'Send Message' button if this fails.";
          formStatusMessage.className =
            "form-status-message-unique error visible";
          const fallbackLink = document.createElement("a");
          fallbackLink.href = mailtoLink;
          fallbackLink.textContent = "Click here to try opening email manually";
          fallbackLink.target = "_blank";
          fallbackLink.style.display = "block";
          fallbackLink.style.marginTop = "10px";
          formStatusMessage.appendChild(fallbackLink);
        }
        setTimeout(() => {
          contactForm.reset();
          formFields.forEach((field) => {
            field.classList.remove("invalid");
            const errorElement =
              field.parentElement.querySelector(".form-error-message-unique") ||
              (field.parentElement.classList.contains("select-wrapper-unique")
                ? field.parentElement.parentElement.querySelector(
                    ".form-error-message-unique"
                  )
                : null);
            if (errorElement) errorElement.classList.remove("visible");
          });
          formStatusMessage.textContent = "";
          formStatusMessage.className = "form-status-message-unique";
        }, 10000);
      } catch (e) {
        console.error("Error opening mailto link:", e);
        formStatusMessage.textContent =
          "Could not open email app. This can happen due to browser settings. Please try copying the details or email me directly.";
        formStatusMessage.className =
          "form-status-message-unique error visible";
      }
    });
  }

  // Scroll Reveal Logic (using your existing class 'scroll-reveal' for .cs-container)
  const srElements = document.querySelectorAll(".scroll-reveal"); // Targets elements with this class
  if (srElements.length > 0 && typeof IntersectionObserver === "function") {
    // Check if any elements and Observer is supported
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        // Renamed observer to observerInstance inside callback
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observerInstance.unobserve(entry.target); // Use observerInstance
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: "0px 0px -15% 0px", // Trigger 15% from bottom
        threshold: 0.1, // At least 10% of element visible
      }
    );
    srElements.forEach((el) => observer.observe(el));
  } else if (srElements.length > 0) {
    // Fallback if IntersectionObserver not supported
    srElements.forEach((el) => el.classList.add("is-visible"));
  }
});
