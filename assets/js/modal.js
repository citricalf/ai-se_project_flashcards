/**
 * Shows a modal by applying its visible-state class.
 *
 * @param {HTMLElement} modal - The modal element to show
 * @returns {void}
 */
function openModal(modal) {
  modal.classList.add("modal_visible");
}

/**
 * Hides a modal by removing its visible-state class.
 *
 * @param {HTMLElement} modal - The modal element to hide
 * @returns {void}
 */
function closeModal(modal) {
  modal.classList.remove("modal_visible");
}

export { openModal, closeModal };
