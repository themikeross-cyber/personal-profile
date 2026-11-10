const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");

function formspreeMessage(data) {
  if (data && typeof data.error === "string") return data.error;
  if (data && Array.isArray(data.errors) && data.errors.length) {
    return data.errors.map((item) => item.message).filter(Boolean).join(" ");
  }
  return "The message could not be sent. Please try again.";
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = contactForm.querySelector('button[type="submit"]');
  contactStatus.hidden = true;
  submitButton.disabled = true;

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" }
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      contactForm.reset();
      contactStatus.textContent = "Message sent. I'll get back to you.";
    } else {
      contactStatus.textContent = formspreeMessage(data);
    }
  } catch (error) {
    contactStatus.textContent = "The message could not be sent. Please try again.";
  }

  contactStatus.hidden = false;
  submitButton.disabled = false;
});
