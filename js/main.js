document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");

  function addBookingStyles() {
    if (document.getElementById("booking-section-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "booking-section-styles";
    style.textContent = `
      .booking-section {
        padding: 72px 0 88px;
        background: var(--white);
      }

      .booking-panel {
        background: var(--ivory);
        border: 1px solid var(--line);
        border-radius: 24px;
        box-shadow: 0 18px 42px rgba(31, 31, 31, 0.07);
        padding: clamp(28px, 4vw, 46px);
      }

      .booking-panel-grid {
        display: grid;
        grid-template-columns: minmax(0, 0.82fr) minmax(320px, 1.18fr);
        gap: 38px;
        align-items: start;
      }

      .booking-copy p {
        color: var(--muted);
        font-size: 1.08rem;
      }

      .booking-note {
        margin-top: 22px;
        padding: 16px 18px;
        border-left: 5px solid var(--gold);
        background: var(--white);
        border-radius: 12px;
        font-size: 0.96rem;
      }

      .tidycal-embed-wrap {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 18px;
        min-height: 620px;
        overflow: hidden;
        padding: 10px;
      }

      .booking-fallback {
        display: inline-flex;
        margin-top: 18px;
      }

      .contact-form-divider {
        max-width: 820px;
        margin: 0 auto 42px;
        text-align: center;
      }

      .contact-form-divider p {
        color: var(--muted);
        font-size: 1.06rem;
      }

      @media (max-width: 900px) {
        .booking-panel-grid {
          grid-template-columns: 1fr;
        }

        .tidycal-embed-wrap {
          min-height: 560px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function loadTidyCalScript() {
    const existingScript = document.querySelector("script[src='https://asset-tidycal.b-cdn.net/js/embed.js']");

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://asset-tidycal.b-cdn.net/js/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }

  function addContactBookingSection() {
    if (!contactForm || document.getElementById("free-consultation-booking")) {
      return;
    }

    const contactSection = document.querySelector(".contact-section");

    if (!contactSection) {
      return;
    }

    addBookingStyles();

    const bookingSection = document.createElement("section");
    bookingSection.className = "booking-section";
    bookingSection.id = "free-consultation-booking";
    bookingSection.innerHTML = `
      <div class="container booking-panel">
        <div class="booking-panel-grid">
          <div class="booking-copy">
            <p class="eyebrow">Free Consultation</p>
            <h2>Schedule a Free Consultation Call</h2>
            <p>
              Pick a time for a free 15-minute call to talk through your wedding date, ceremony location,
              ceremony style, package fit, and next steps.
            </p>
            <p>
              This is the fastest way to check availability and get the conversation started without making
              you fill out a small novel first. Humanity survives another form field.
            </p>
            <div class="booking-note">
              <strong>Important:</strong> Scheduling this consultation does not reserve your wedding date.
              Ceremony dates are confirmed only after availability is verified, the service agreement is
              completed, and the required retainer is received.
            </div>
            <a class="button button-secondary booking-fallback" href="https://tidycal.com/weddingssolutions/free-consultation-call" target="_blank" rel="noopener">
              Open Booking Page
            </a>
          </div>

          <div class="tidycal-embed-wrap" aria-label="Free consultation booking calendar">
            <div class="tidycal-embed" data-path="weddingssolutions/free-consultation-call"></div>
          </div>
        </div>
      </div>
    `;

    contactSection.parentNode.insertBefore(bookingSection, contactSection);

    const divider = document.createElement("div");
    divider.className = "contact-form-divider";
    divider.innerHTML = `
      <p class="eyebrow">Prefer a Message?</p>
      <h2>Not Ready to Schedule Yet?</h2>
      <p>Use the inquiry form below if you have a question first. The free consultation is still the preferred next step when you are ready to check a date.</p>
    `;

    const contactGrid = contactSection.querySelector(".contact-grid");
    if (contactGrid) {
      contactGrid.parentNode.insertBefore(divider, contactGrid);
    }

    loadTidyCalScript();
  }

  addContactBookingSection();

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
            event_label: "Next Steps Wedding Solutions Contact Form"
          });
        }

        window.setTimeout(function () {
          window.location.href = "/thank-you.html";
        }, 1200);
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
