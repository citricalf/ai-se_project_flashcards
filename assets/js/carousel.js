import { hexToString, removeColorClasses } from "./colors.js";

/**
 * Renders a deck's cards in the carousel and configures its navigation controls.
 *
 * @param {{name: string, color: string, cards: Object[]}} deck - The deck to render
 * @returns {void}
 */
function renderCarouselView(deck) {
  let currentIndex = 0;
  let showingQuestion = true;

  const carouselEl = document.querySelector(".carousel");
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");
  const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");
  const sectionTitle = document.querySelector(".carousel__title");
  const carouselCard = document.querySelector(".carousel__card");

  // remove color modifiers before setting current card's color
  removeColorClasses(carouselCard);
  const cardColor = hexToString(deck.color);
  carouselCard.classList.add(`card__carousel_color_${cardColor}`);

  /**
   * Disables a carousel navigation button.
   *
   * @param {HTMLButtonElement} buttonEl - The button to disable
   * @returns {void}
   */
  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }

  /**
   * Enables a carousel navigation button.
   *
   * @param {HTMLButtonElement} buttonEl - The button to enable
   * @returns {void}
   */
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

  /**
   * Updates the enabled state of the carousel navigation buttons.
   *
   * @returns {void}
   */
  function updateArrows() {
    if (currentIndex === 0) {
      disableButton(leftBtn);
    } else {
      enableButton(leftBtn);
    }

    if (currentIndex === deck.cards.length - 1) {
      disableButton(rightBtn);
    } else {
      enableButton(rightBtn);
    }
  }

  /**
   * Displays the current card and updates the carousel controls and title.
   *
   * @returns {void}
   */
  function updateDisplay() {
    const currentCard = deck.cards[currentIndex];
    carouselCard.textContent = currentCard.question;
    updateArrows();

    sectionTitle.textContent = `${deck.name} · ${currentIndex + 1}/${deck.cards.length}`;

    if (showingQuestion === true) {
      carouselCard.textContent = currentCard.question;
      carouselCard.classList.remove("card__carousel_color_white");
    } else {
      carouselCard.textContent = currentCard.answer;
      carouselCard.classList.add("card__carousel_color_white");
    }
  }

  rightBtn.onclick = () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      updateDisplay();
    }
  };

  leftBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      updateDisplay();
    }
  };

  flipBtn.onclick = () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  };

  updateDisplay();
}

export { renderCarouselView };
