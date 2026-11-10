import { fetchedDecks } from "./decks.js";
import { openModal, closeModal } from "./modal.js";
import { addDeck } from "./api.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const newDeckViewForm = document.querySelector(".new-deck-view__form");
const newDeckViewSubmitBtn = document.querySelector(
  ".new-deck-view__submit-btn",
);

const errorModalEl = document.querySelector("#error-modal");
const errorBtn = errorModalEl.querySelector(".modal__close");
const errorMsg = errorModalEl.querySelector(".modal__error");

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string} A leading "#" + a lowercase hex color string
 */
function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

/**
 * Validates a deck name against the supported type and length constraints.
 *
 * @param {*} name - The value to validate
 * @returns {string|null} The valid name, or null when it is invalid
 */
function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

/**
 * Parses a JSON string, returning null when it is invalid.
 *
 * @param {string} jsonString - The JSON text to parse
 * @returns {*|null} The parsed value, or null if parsing fails
 */
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

/**
 * Displays an error message in the error modal.
 *
 * @param {string} message - The error message to display
 * @returns {void}
 */
function showError(message) {
  errorMsg.textContent = message;
  openModal(errorModalEl);
}

errorBtn.addEventListener("click", () => {
  closeModal(errorModalEl);
});

/**
 * Enables the new-deck form's submit button.
 *
 * @returns {void}
 */
function disableSubmitBtn() {
  newDeckViewSubmitBtn.disabled = false;
}

/**
 * Validates and submits the new-deck form, then navigates to the created deck.
 *
 * @param {SubmitEvent} event - The form submission event
 * @returns {void}
 */
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

  addDeck({
    name: jsonData.name,
    cards: jsonData.cards,
    color: colorValue,
  })
    .then((newDeck) => {
      fetchedDecks.push(newDeck);
      window.location.hash = `deck/${newDeck._id}`;
    })
    .catch(showError);
}

newDeckViewForm.addEventListener("submit", handleNewDeckViewSubmit);

export { disableSubmitBtn, showError };
