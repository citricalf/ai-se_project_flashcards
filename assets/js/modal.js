function openModal(modal) {
  modal.classList.add("modal_visible");
}

function closeModal(modal) {
  modal.classList.remove("modal_visible");
}

export { openModal, closeModal };
