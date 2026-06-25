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

      .booking-choice-heading {
        max-width: 860px;
        margin: 0 auto 38px;
        text-align: center;
      }

      .booking-choice-heading p {
        color: var(--muted);
        font-size: 1.08rem;
      }

      .booking-choice-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
        gap: 28px;
        align-items: start;
      }

      .booking-card {
        background: var(--ivory);
        border: 1px solid var(--line);
        border-radius: 24px;
        box-shadow: 0 18px 42px rgba(31, 31, 31, 0.07);
        padding: clamp(26px, 3vw, 38px);
      }

      .booking-card p {
        color: var(--muted);
        font-size: 1.05rem;
      }

      .booking-note {
        margin: 22px 0;
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
        margin-bottom: 22px;
      }

      .message-form-card {
        background: transparent !important;
        border: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        padding: 0 !important;
      }

      .message-form-card h2 {
        margin-bottom: 14px;
      }

      .message-form-card .form-note {
        background: var(--white);
        border-left: 5px solid var(--gold);
        border-radius: 12px;
        padding: 14px 16px;
      }

      @media (max-width: 980px) {
        .booking-choice-grid {
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
    const contactFormCard = document.querySelector(".contact-form-card");

    if (!contactSection || !contactFormCard) {
      return;
    }

    addBookingStyles();

    const formHeading = contactFormCard.querySelector("h2");
    const formIntro = formHeading ? formHeading.nextElementSibling : null;

    contactFormCard.classList.add("message-form-card");

    if (formHeading) {
      formHeading.textContent = "Prefer to Send a Message?";
    }

    if (formIntro && formIntro.tagName === "P") {
      formIntro.textContent = "Use this form if you have a question before scheduling. The free consultation is still the preferred next step when you are ready to check a date.";
    }

    const bookingSection = document.createElement("section");
    bookingSection.className = "booking-section";
    bookingSection.id = "free-consultation-booking";
    bookingSection.innerHTML = `
      <div class="container">
        <div class="booking-choice-heading">
          <p class="eyebrow">Start Here</p>
          <h2>Choose the Easiest Next Step</h2>
          <p>
            Schedule a free consultation when you are ready to check availability, or send a message first if you still have a question.
          </p>
        </div>

        <div class="booking-choice-grid">
          <article class="booking-card booking-card-primary">
            <p class="eyebrow">Free Consultation</p>
            <h2>Schedule a Free Consultation Call</h2>
            <p>
              Pick a time for a free 15-minute call to discuss your wedding date, ceremony location,
              ceremony style, package fit, and next steps.
            </p>
            <div class="booking-note">
              <strong>Important:</strong> Scheduling this consultation does not reserve your wedding date.
              Ceremony dates are confirmed only after availability is verified, the service agreement is
              completed, and the required retainer is received.
            </div>
            <a class="button button-secondary booking-fallback" href="https://tidycal.com/weddingssolutions/free-consultation-call" target="_blank" rel="noopener">
              Open Booking Page
            </a>
            <div class="tidycal-embed-wrap" aria-label="Free consultation booking calendar">
              <div class="tidycal-embed" data-path="weddingssolutions/free-consultation-call"></div>
            </div>
          </article>

          <article class="booking-card booking-card-secondary" id="message-card-shell"></article>
        </div>
      </div>
    `;

    contactSection.parentNode.insertBefore(bookingSection, contactSection);

    const messageCardShell = document.getElementById("message-card-shell");
    if (messageCardShell) {
      messageCardShell.appendChild(contactFormCard);
    }

    contactSection.remove();
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
