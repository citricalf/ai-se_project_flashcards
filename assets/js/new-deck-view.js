import { decks } from "./decks.js";
import { openModal, closeModal } from "./modal.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const newDeckViewForm = document.querySelector(".new-deck-view__form");
const newDeckViewSubmitBtn = document.querySelector(
  ".new-deck-view__submit-btn",
);
const newDeckViewTextArea = newDeckViewForm.querySelector(
  ".new-deck-view__json-text",
);

const errorModalEl = document.querySelector("#error-modal");
const errorBtn = errorModalEl.querySelector(".modal__close");
const errorMsg = errorModalEl.querySelector(".modal__error");

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function showError(message) {
  errorMsg.textContent = message;
  openModal(errorModalEl);
}

errorBtn.addEventListener("click", () => {
  closeModal(errorModalEl);
});

function disableSubmitBtn() {
  newDeckViewSubmitBtn.disabled = false;
}

function handleNewDeckViewSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  let colorValue = normalizeColor(data.color);
  let isValid = true;

  const jsonData = parseJSON(data.jsonText);
  if (jsonData === null) {
    isValid = false;
    showError("JSON parsing failed");
  }

  const name = validateName(jsonData.name);
  if (name === null) {
    isValid = false;
    showError("Name must be a string between 2 and 80 characters");
  }

  if (!Array.isArray(jsonData.cards)) {
    isValid = false;
    showError("Cards must be an array");
  }

  if (
    jsonData.color !== undefined &&
    jsonData.color !== null &&
    (typeof jsonData.color !== "string" ||
      jsonData.color.toLowerCase() !== colorValue)
  ) {
    isValid = false;
    showError(
      "Invalid card color use one of: #64D583, #91A8F9, #EE92D7, #AA8EF0, #EE955E, #F5D770",
    );
  }

  if (!isValid) {
    return;
  }

  const deck = {
    id: `${slugify(jsonData.name)}-${Date.now()}`,
    color: colorValue,
    name: jsonData.name,
    cards: jsonData.cards,
  };

  decks.push(deck);
  window.location.hash = `deck/${deck.id}`;
}

newDeckViewForm.addEventListener("submit", handleNewDeckViewSubmit);

export { disableSubmitBtn };
