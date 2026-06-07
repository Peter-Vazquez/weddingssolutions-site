document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector("button[type='submit']");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
  if (typeof gtag === "function") {
    gtag("event", "generate_lead", {
      event_category: "form",
      event_label: "Wedding Solutions Contact Form"
    });
  }

  setTimeout(function () {
    window.location.assign("/thank-you.html");
  }, 500);
} else {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Send Inquiry";
        }

        alert("There was a problem sending your inquiry. Please check your information and try again.");
      }
    } catch (error) {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Inquiry";
      }

      alert("There was a connection problem. Please try again.");
    }
  });
});