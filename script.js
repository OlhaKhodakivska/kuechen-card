"use strict";

const formDialog = document.getElementById("form-dialog");
const photoDialog = document.getElementById("photo-dialog");
const form = document.getElementById("request-form");
const status = form.querySelector(".form-status");
const proposalField = document.getElementById("proposal-field");
const proposal = form.elements.namedItem("proposal");
let returnFocus = null;

const formCopy = {
  beratung: {
    title: "Ihre Küche beginnt hier.",
    intro: "Erzählen Sie uns von Ihren Plänen. Wählen Sie einen Wunschtermin für unseren Rückruf.",
    button: "Rückruf anfragen",
  },
  zusammenarbeit: {
    title: "Gemeinsam mehr gestalten.",
    intro: "Sie haben eine Idee für eine Zusammenarbeit? Wir freuen uns auf Ihren Vorschlag.",
    button: "Zusammenarbeit anfragen",
  },
};

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// All contact buttons share a native dialog, with the matching form fields.
document.querySelectorAll("[data-open-form]").forEach((button) => {
  button.addEventListener("click", () => {
    returnFocus = button;
    const mode = button.dataset.openForm;
    const copy = formCopy[mode];
    form.reset();
    form.querySelectorAll("input, textarea").forEach((input) => input.setCustomValidity(""));
    status.textContent = "";
    proposalField.hidden = mode !== "zusammenarbeit";
    proposal.disabled = proposalField.hidden;
    form.elements.namedItem("date").min = localDate();
    document.getElementById("dialog-title").textContent = copy.title;
    document.getElementById("dialog-intro").textContent = copy.intro;
    form.querySelector('[type="submit"]').textContent = copy.button;
    formDialog.showModal();
    form.elements.namedItem("name").focus();
  });
});

// Read the existing card content to keep the enlarged view in sync.
document.querySelectorAll("[data-photo]").forEach((button) => {
  button.addEventListener("click", () => {
    returnFocus = button;
    const source = button.querySelector("img");
    const image = photoDialog.querySelector("img");
    const name = button.querySelector("h3").textContent;
    image.src = source.getAttribute("src");
    image.alt = source.alt;
    photoDialog.querySelector("p").textContent = name;
    photoDialog.setAttribute("aria-label", `${name} — Küchenansicht`);
    photoDialog.showModal();
  });
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
});
[formDialog, photoDialog].forEach((dialog) => {
  dialog.addEventListener("close", () => returnFocus?.focus({ preventScroll: true }));
});

// Explicit handling also supports browser environments without native Escape dismissal.
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openDialog = [photoDialog, formDialog].find((dialog) => dialog.open);
  if (openDialog) {
    event.preventDefault();
    openDialog.close();
  }
});

form.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    event.target.setCustomValidity("");
  }
  status.textContent = "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements.namedItem("name");
  const phone = form.elements.namedItem("phone");
  const date = form.elements.namedItem("date");
  const time = form.elements.namedItem("time");
  [name, phone, date, time, proposal].forEach((input) => input.setCustomValidity(""));
  name.value = name.value.trim();
  if (name.value.length < 2) {
    name.setCustomValidity("Bitte geben Sie Ihren Namen an (mindestens 2 Zeichen).");
  }
  const digits = phone.value.replace(/\D/g, "");
  if (!/^\+?[\d\s().-]+$/.test(phone.value.trim()) || digits.length < 7 || digits.length > 15) {
    phone.setCustomValidity("Bitte geben Sie eine gültige Telefonnummer mit 7 bis 15 Ziffern an.");
  }
  if (!proposal.disabled) {
    proposal.value = proposal.value.trim();
    if (proposal.value.length < 10) {
      proposal.setCustomValidity("Bitte beschreiben Sie Ihren Vorschlag mit mindestens 10 Zeichen.");
    }
  }
  date.min = localDate();
  if (new Date(`${date.value}T${time.value}`).getTime() <= Date.now()) {
    time.setCustomValidity("Bitte wählen Sie einen zukünftigen Zeitpunkt.");
  }
  if (!form.reportValidity()) return;
  status.textContent = "Dies ist eine Konzeptwebsite. Ihre Anfrage wurde nicht versendet. Der E-Mail-Versand ist noch nicht eingerichtet.";
});
